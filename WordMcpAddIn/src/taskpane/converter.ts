// converter.ts (전체 수정본)

import { XMLParser, XMLValidator, XMLBuilder } from 'fast-xml-parser';

// --- 인터페이스 정의 ---
interface JsonBlock { id: string; type: string; order: number; parentId?: string; }
interface ParagraphProperties { justification?: string; spacing?: { after?: string | number; line?: string | number; lineRule?: string; }; } // 타입을 좀 더 구체화 (string | number)
interface TextRunProperties { bold?: boolean; italic?: boolean; underline?: string; fontSize?: string; color?: string; fontHint?: string; isLink?: boolean; linkId?: string; }
interface TextRunJson extends JsonBlock { type: "textRun"; text: string; properties?: TextRunProperties; }
interface ParagraphJson extends JsonBlock { type: "paragraph"; properties?: ParagraphProperties; runs: TextRunJson[]; }
interface TableCellJson extends JsonBlock { type: "tableCell"; content: (ParagraphJson | TableJson)[]; } // 셀 안에 테이블도 올 수 있으므로 수정
interface TableRowJson extends JsonBlock { type: "tableRow"; cells: TableCellJson[]; }
interface TableJson extends JsonBlock { type: "table"; rows: TableRowJson[]; }
interface DocumentJson { blocks: (ParagraphJson | TableJson)[]; }

// --- Whitelist 정의 ---
const WHITELISTED_PARA_PROPS = ['w:spacing', 'w:jc', 'w:rPr']; // 단락 속성 처리 대상
const WHITELISTED_RUN_PROPS = ['w:b', 'w:i', 'w:u', 'w:sz', 'w:color', 'w:rFonts']; // 텍스트 런 속성 처리 대상

let globalOrderCounter = 0; // 문서 전체 블록 순서 카운터

function generateId(type: string, order: number, parentId?: string): string {
  // ID 생성 규칙: parentId가 있으면 계층적으로, 없으면 타입과 순서만 사용
  return parentId ? `${parentId}_${type}_${order}` : `${type}_${order}`;
}

// XML 파싱 결과에서 <w:t> 요소의 텍스트 내용을 추출하는 함수 (숫자 처리 제거)
function getTextFromTElement(tElementContainer: any): string {
    // preserveOrder:true 시, tElementContainer는 [{ '#text': '...' }] 또는 [{ '#text': '...' }, {':@': {...}}] 형태일 수 있음
    if (!tElementContainer || !Array.isArray(tElementContainer) || tElementContainer.length === 0) return "";
    let text = "";
    for (const item of tElementContainer) {
        if (item && typeof item['#text'] === 'string') {
            text += item['#text'];
        }
    }
    return text;
}

// 단락 속성(<w:pPr>) 객체 처리 함수
function processParagraphProperties(pPrContainer: any): ParagraphProperties {
    const properties: ParagraphProperties = {};
    if (!pPrContainer || !Array.isArray(pPrContainer) || pPrContainer.length === 0) return properties;

    const pPrObject = pPrContainer[0]; // pPr 요소는 하나만 존재 가정
    if (typeof pPrObject !== 'object' || pPrObject === null) return properties;

    for (const key in pPrObject) { // <w:spacing>, <w:jc> 등이 키로 존재
        if (WHITELISTED_PARA_PROPS.includes(key)) {
            const propValueArray = pPrObject[key]; // [{...attributes...}] 형태
            if (propValueArray && Array.isArray(propValueArray) && propValueArray.length > 0) {
                const attributes = propValueArray[0][':@'] || {}; // 속성 접근
                if (key === 'w:jc' && attributes['w:val']) {
                    properties.justification = attributes['w:val'];
                } else if (key === 'w:spacing') {
                    properties.spacing = {
                        after: attributes['w:after'],
                        line: attributes['w:line'],
                        lineRule: attributes['w:lineRule']
                    };
                }
            }
        }
    }
    return properties;
}

// 텍스트 런 속성(<w:rPr>) 객체 처리 함수
function processRunProperties(rPrContainer: any): TextRunProperties {
    const properties: TextRunProperties = {};
    if (!rPrContainer || !Array.isArray(rPrContainer) || rPrContainer.length === 0) return properties;
    
    const rPrObject = rPrContainer[0];
    if (typeof rPrObject !== 'object' || rPrObject === null) return properties;

    for (const key in rPrObject) {
        if (WHITELISTED_RUN_PROPS.includes(key)) {
            const propValueArray = rPrObject[key];
             if (propValueArray && Array.isArray(propValueArray) && propValueArray.length > 0) {
                const attributes = propValueArray[0][':@'] || {}; // 속성 객체
                const hasValue = Object.keys(attributes).length > 0 || (propValueArray[0] && Object.keys(propValueArray[0]).length > 0 && !propValueArray[0][':@']);


                if (key === 'w:b' && hasValue) properties.bold = true; // <w:b/> 또는 <w:b w:val="true"/>
                else if (key === 'w:i' && hasValue) properties.italic = true;
                else if (key === 'w:u' && attributes['w:val']) properties.underline = attributes['w:val'];
                else if (key === 'w:sz' && attributes['w:val']) properties.fontSize = String(attributes['w:val']);
                else if (key === 'w:color' && attributes['w:val']) properties.color = attributes['w:val'];
                else if (key === 'w:rFonts' && attributes['w:hint']) properties.fontHint = attributes['w:hint'];
             }
        }
    }
    return properties;
}

// 텍스트 런(<w:r>) 객체 처리 함수
function processTextRun(rContentArray: any[], parentId: string, order: number, extraProps?: any): TextRunJson | null {
    if (!rContentArray || !Array.isArray(rContentArray)) return null;

    const runId = generateId('r', order, parentId);
    const textRunJson: TextRunJson = {
        id: runId, type: "textRun", order, parentId, text: "", properties: {}
    };

    // rContentArray는 <w:r>의 자식 요소들의 배열: 예: [{ "w:rPr": [...] }, { "w:t": ["Text"] }]
    rContentArray.forEach(childElement => {
        if (childElement['w:rPr']) {
            textRunJson.properties = processRunProperties(childElement['w:rPr']);
        } else if (childElement['w:t']) {
            textRunJson.text += getTextFromTElement(childElement['w:t']);
        } else if (childElement['w:br']) {
            textRunJson.text += '\n';
        }
        // <w:tab> 등 다른 요소 처리
    });

    if (extraProps) {
        textRunJson.properties = { ...textRunJson.properties, ...extraProps };
    }
    return textRunJson;
}

// 단락(<w:p>) 객체 처리 함수
function processParagraph(pContainer: any, parentId?: string): ParagraphJson | null {
    if (!pContainer || !Array.isArray(pContainer) || pContainer.length === 0) return null;

    const pAttributes = pContainer[0][':@'] || {}; // <w:p> 태그의 속성들
    const pChildren = pContainer.slice(pContainer[0][':@'] ? 1 : 0); // 속성 객체를 제외한 실제 자식 요소들의 배열

    globalOrderCounter++;
    const paraId = pAttributes['w14:paraId'] || generateId('p', globalOrderCounter, parentId);

    const paragraphJson: ParagraphJson = {
        id: paraId, type: "paragraph", order: globalOrderCounter, runs: [], properties: {}
    };
    if (parentId) paragraphJson.parentId = parentId;

    let runOrder = 0;
    pChildren.forEach((childElementObject: any) => { // childElementObject 예: { "w:pPr": [...] } 또는 { "w:r": [...] }
        const elementName = Object.keys(childElementObject)[0]; // "w:pPr", "w:r", "w:hyperlink" 등

        if (elementName === 'w:pPr') {
            paragraphJson.properties = processParagraphProperties(childElementObject['w:pPr']);
        } else if (elementName === 'w:r') {
            runOrder++;
            const runJson = processTextRun(childElementObject['w:r'], paraId, runOrder);
            if (runJson) paragraphJson.runs.push(runJson);
        } else if (elementName === 'w:hyperlink') {
            const hyperlinkContent = childElementObject['w:hyperlink']; // [{ "w:r": [...] }, { ":@": { "r:id": "..."} }]
            if (hyperlinkContent && Array.isArray(hyperlinkContent)) {
                const linkAttributes = hyperlinkContent.find(item => item[':@'])?.[':@'] || {};
                hyperlinkContent.forEach(linkChild => {
                    if (linkChild['w:r']) { // 하이퍼링크 내부의 <w:r>
                         runOrder++;
                         const runJson = processTextRun(linkChild['w:r'], paraId, runOrder, { isLink: true, linkId: linkAttributes['r:id'] });
                         if (runJson) paragraphJson.runs.push(runJson);
                    }
                });
            }
        }
        // <w:proofErr> 등 기타 요소 처리...
    });
    return paragraphJson;
}

// 테이블 셀(<w:tc>) 객체 처리 함수
function processTableCell(tcContainer: any, parentId: string, order: number): TableCellJson | null {
    if (!tcContainer || !Array.isArray(tcContainer) || tcContainer.length === 0) return null;
    const tcAttributes = tcContainer[0][':@'] || {};
    const tcChildren = tcContainer.slice(tcContainer[0][':@'] ? 1: 0);

    const cellId = generateId('tc', order, parentId);
    const cellJson: TableCellJson = {
        id: cellId, type: "tableCell", order, parentId, content: []
    };

    // <w:tcPr> 처리 로직
    // ...

    tcChildren.forEach((childElementObject: any) => {
        const elementName = Object.keys(childElementObject)[0];
        if (elementName === 'w:p') {
            const paragraph = processParagraph(childElementObject['w:p'], cellId);
            if (paragraph) cellJson.content.push(paragraph);
        } else if (elementName === 'w:tbl') {
            const table = processTable(childElementObject['w:tbl'], cellId);
            if (table) cellJson.content.push(table);
        }
    });
    return cellJson;
}

// 테이블 행(<w:tr>) 객체 처리 함수
function processTableRow(trContainer: any, parentId: string, order: number): TableRowJson | null {
    if (!trContainer || !Array.isArray(trContainer) || trContainer.length === 0) return null;
    const trAttributes = trContainer[0][':@'] || {};
    const trChildren = trContainer.slice(trContainer[0][':@'] ? 1 : 0);

    const rowId = generateId('tr', order, parentId);
    const rowJson: TableRowJson = {
        id: rowId, type: "tableRow", order, parentId, cells: []
    };
    
    // <w:trPr> 처리
    // ...

    let cellOrder = 0;
    trChildren.forEach((childElementObject: any) => {
        const elementName = Object.keys(childElementObject)[0];
        if (elementName === 'w:tc') {
            cellOrder++;
            const cellJson = processTableCell(childElementObject['w:tc'], rowId, cellOrder);
            if (cellJson) rowJson.cells.push(cellJson);
        }
    });
    return rowJson;
}

// 테이블(<w:tbl>) 객체 처리 함수
function processTable(tblContainer: any, parentId?: string): TableJson | null {
    if (!tblContainer || !Array.isArray(tblContainer) || tblContainer.length === 0) return null;
    const tblAttributes = tblContainer[0][':@'] || {};
    const tblChildren = tblContainer.slice(tblContainer[0][':@'] ? 1 : 0);

    globalOrderCounter++;
    const tableId = generateId('tbl', globalOrderCounter, parentId);
    const tableJson: TableJson = {
        id: tableId, type: "table", order: globalOrderCounter, rows: []
    };
    if (parentId) tableJson.parentId = parentId;

    // <w:tblPr>, <w:tblGrid> 처리
    // ...

    let rowOrder = 0;
    tblChildren.forEach((childElementObject: any) => {
        const elementName = Object.keys(childElementObject)[0];
        if (elementName === 'w:tr') {
            rowOrder++;
            const rowJson = processTableRow(childElementObject['w:tr'], tableId, rowOrder);
            if (rowJson) tableJson.rows.push(rowJson);
        }
    });
    return tableJson;
}

// 메인 변환 함수
export function convertOoxmlToJson(xmlString: string): DocumentJson {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",    // 속성 이름 접두사 사용 안 함
    attributesGroupName: ":@",  // 속성을 별도 그룹으로 (예: element[':@'])
    removeNSPrefix: false,      // 네임스페이스 접두사 유지 ('w:')
    parseTagValue: false,       // 태그 값 자동 타입 변환 비활성화 (모두 문자열로)
    trimValues: false,          // 값 앞뒤 공백 유지
    textNodeName: "#text",
    preserveOrder: true,       // **** XML 요소 순서 보존 활성화 ****
    // isArray는 preserveOrder:true 시에는 일반적으로 필요 없거나 다르게 동작할 수 있음.
    // 파서 문서를 참조하여 preserveOrder와 함께 사용할 때의 정확한 동작 확인 필요.
    // 여기서는 일단 제거하고, 필요시 다시 추가.
  });

  let parsedXmlArray; // preserveOrder: true 시, 최상위는 배열
  try {
    parsedXmlArray = parser.parse(xmlString);
    console.log("--- XML 파싱 성공 (preserveOrder:true) ---");
  } catch (parseError) {
    console.error("!!! XML 파싱 중 오류 발생 !!!", parseError);
    return { blocks: [] };
  }

  // console.log("--- 파싱된 XML 객체 구조 (preserveOrder:true, 일부) ---");
  // console.log(JSON.stringify(parsedXmlArray, null, 2).substring(0, 5000) + '\n...(후략)...');
  // console.log("----------------------------------------------------");

  const documentJson: DocumentJson = { blocks: [] };
  globalOrderCounter = 0;

  // parsedXmlArray는 [{ "?xml": { ... } }, { "w:document": [ ... ] }] 형태일 것임
  const docEntry = parsedXmlArray.find((entry: any) => entry['w:document']);
  if (!docEntry || !Array.isArray(docEntry['w:document']) || docEntry['w:document'].length === 0) {
    console.error("오류: <w:document> 요소를 찾을 수 없습니다.");
    return documentJson;
  }

  // docElementContent는 <w:document> 태그의 속성과 자식들을 담는 배열
  const docElementContent = docEntry['w:document'];
  const docAttributes = docElementContent[0][':@'] || {}; // <w:document>의 속성 (필요 시 사용)
  // 실제 body를 찾기 위해 docElementContent 내부에서 <w:body> 키를 가진 객체를 찾아야 함
  const bodyEntry = docElementContent.find((entry: any) => entry['w:body']);

  if (!bodyEntry || !Array.isArray(bodyEntry['w:body']) || bodyEntry['w:body'].length === 0) {
    console.error("오류: <w:body> 요소를 찾을 수 없습니다.");
    return documentJson;
  }

  // bodyContent는 <w:body> 태그의 속성과 자식들을 담는 배열
  const bodyContent = bodyEntry['w:body'];
  const bodyAttributes = bodyContent[0][':@'] || {}; // <w:body>의 속성 (필요 시 사용)
  const bodyChildren = bodyContent.slice(bodyContent[0][':@'] ? 1 : 0); // 속성 객체 제외

  console.log(`<w:body> 내부의 자식 요소(그룹) 개수: ${bodyChildren.length}`);

  if (bodyChildren.length > 0) {
    bodyChildren.forEach((childElementObject: any) => { // 예: { "w:p": [...] } 또는 { "w:tbl": [...] }
      const elementName = Object.keys(childElementObject)[0]; // 'w:p', 'w:tbl' 등
      const elementContent = childElementObject[elementName]; // [<p attributes>, <p children>...]

      if (elementName === 'w:p') {
        const paragraph = processParagraph(elementContent, undefined);
        if (paragraph) documentJson.blocks.push(paragraph);
      } else if (elementName === 'w:tbl') {
        const table = processTable(elementContent, undefined);
        if (table) documentJson.blocks.push(table);
      } else if (elementName === 'w:sectPr') {
         console.log(`  - 섹션 속성(w:sectPr)은 현재 처리 로직에서 건너뜁니다.`);
      } else if (elementName.startsWith('w:')) {
         console.log(`  - 처리되지 않은 WordprocessingML 요소 타입 (body 자식): ${elementName}`);
      }
    });
  } else {
    console.warn("경고: <w:body> 요소 내부에 처리할 자식 요소가 없습니다.");
  }

  console.log(`최종 블록 개수: ${documentJson.blocks.length}`);
  return documentJson;
}

/*───────────────────────────────────────────────────────────
 *  Flat-OPC 문자열 →  순수 <w:document …> … </w:document>
 *───────────────────────────────────────────────────────────*/
export function pickDocumentPart(flatXml: string): string {
    /* ① 패키지 래퍼가 없으면 이미 <w:document> 로 시작 */
    if (flatXml.indexOf('<pkg:package') === -1) {
      return flatXml.trim();
    }
  
    /* ② `/word/document.xml` 파트를 통째로 추출 */
    const partMatch = flatXml.match(
      /<pkg:part[^>]*pkg:name="\/word\/document\.xml"[^>]*>[\s\S]*?<\/pkg:part>/i
    );
    if (!partMatch) throw new Error('document.xml part not found in Flat-OPC');
    const part: string = partMatch[0];
  
    /* ③ <pkg:xmlData> … </pkg:xmlData> 내부를 추출 */
    const xmlMatch = part.match(
      /<pkg:xmlData[^>]*>([\s\S]*?)<\/pkg:xmlData>/i
    );
    if (!xmlMatch) throw new Error('pkg:xmlData section missing');
  
    /* ④ 캡처 그룹 #1 = 실제 <w:document …> … */
    return xmlMatch[1].trim();
  }
  