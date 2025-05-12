// converter.ts (사용자 수정 기반 + 추가 개선)

import { XMLParser } from 'fast-xml-parser';

// --- 인터페이스 정의 (동일) ---
interface JsonBlock { id: string; type: string; order: number; parentId?: string; }
interface ParagraphProperties { justification?: string; spacing?: { after?: string | number; line?: string | number; lineRule?: string; }; }
interface TextRunProperties { bold?: boolean; italic?: boolean; underline?: string; fontSize?: string; color?: string; fontHint?: string; isLink?: boolean; linkId?: string; }
interface TextRunJson extends JsonBlock { type: "textRun"; text: string; properties: TextRunProperties; } // properties를 non-optional로 변경 고려
interface ParagraphJson extends JsonBlock { type: "paragraph"; properties: ParagraphProperties; runs: TextRunJson[]; } // properties를 non-optional로 변경 고려
interface TableCellJson extends JsonBlock { type: "tableCell"; content: (ParagraphJson | TableJson)[]; }
interface TableRowJson extends JsonBlock { type: "tableRow"; cells: TableCellJson[]; }
interface TableJson extends JsonBlock { type: "table"; rows: TableRowJson[]; }
interface DocumentJson { blocks: (ParagraphJson | TableJson)[]; }

const WHITELISTED_PARA_PROPS = ['w:spacing', 'w:jc', 'w:rPr'];
const WHITELISTED_RUN_PROPS = ['w:b', 'w:i', 'w:u', 'w:sz', 'w:color', 'w:rFonts'];
let globalOrderCounter = 0;

function generateId(type: string, order: number, parentId?: string): string {
  return parentId ? `${parentId}_${type}_${order}` : `${type}_${order}`;
}

// 실제 태그 이름을 반환하는 견고한 getTagName 함수
function getTagName(elementObject: any): string | null {
  if (typeof elementObject !== 'object' || elementObject === null) {
    return null;
  }
  const keys = Object.keys(elementObject);
  // ':@' (속성 그룹)이나 '#text' (텍스트 노드)가 아닌 첫 번째 키를 태그 이름으로 간주
  return keys.find(key => key !== ':@' && key !== '#text') || null;
}

// 요소의 속성 객체를 가져오는 함수
function getAttributesFromElementObject(elementObject: any): any {
  if (typeof elementObject !== 'object' || elementObject === null) {
    return {};
  }
  
  // 중첩된 속성 구조 처리
  if (elementObject[':@']) {
    if (elementObject[':@'][':@']) {
      return elementObject[':@'][':@'];
    }
    return elementObject[':@'];
  }
  
  return {};
}

// 요소의 자식 콘텐츠 배열을 가져오는 함수 ( preserveOrder:true 형식 )
function getContentArrayFromElementObject(elementObject: any, tagName: string): any[] {
  if (typeof elementObject === 'object' && elementObject !== null && typeof tagName === 'string' && Array.isArray(elementObject[tagName])) {
    return elementObject[tagName];
  }
  return [];
}

// preserveOrder:true로 파싱된 배열에서 실제 자식 요소 객체들만 필터링
function getActualChildElementObjects(parsedContentArray: any[]): any[] {
    if (!parsedContentArray || !Array.isArray(parsedContentArray)) {
        return [];
    }
    // 속성 객체({':@':{}})나 순수 텍스트 노드 객체({"#text":"..."})가 아닌 것들만 필터링
    return parsedContentArray.filter(item => {
        if (typeof item !== 'object' || item === null) return false;
        const keys = Object.keys(item);
        if (keys.length === 1 && (keys[0] === ':@' || keys[0] === '#text')) return false;
        // '#text' 와 'w:tagName' 이 같이 있는 경우는 (예: w:t 안의 텍스트) 여기서 걸러지지 않도록 주의.
        // getTagName을 통해 실제 태그가 있는 객체인지 확인하는 것이 더 정확.
        return getTagName(item) !== null;
    });
}


function getTextFromTContentArray(tContentArray: any[]): string {
    let text = "";
    if (tContentArray && Array.isArray(tContentArray)) {
        for (const item of tContentArray) {
            if (item && typeof item['#text'] === 'string') {
                text += item['#text'];
            }
        }
    }
    return text;
}

function processParagraphProperties(pPrElementObject: any): ParagraphProperties {
    const properties: ParagraphProperties = {};
    const tagName = getTagName(pPrElementObject); // "w:pPr"
    if (!tagName || tagName !== 'w:pPr') return properties;

    const pPrContentArray = getContentArrayFromElementObject(pPrElementObject, tagName);
    const pPrChildren = getActualChildElementObjects(pPrContentArray);

    pPrChildren.forEach(childObject => { // childObject 예: {"w:spacing": [{":@":{...}}]}
        const childTagName = getTagName(childObject);
        if (childTagName && WHITELISTED_PARA_PROPS.includes(childTagName)) {
            const childContentArray = getContentArrayFromElementObject(childObject, childTagName);
            const attributes = getAttributesFromElementObject(childObject); // <w:spacing> 태그의 속성

            if (childTagName === 'w:jc' && attributes['w:val']) {
                properties.justification = attributes['w:val'];
            } else if (childTagName === 'w:spacing' && attributes) {
                properties.spacing = {
                    after: attributes['w:after'],
                    line: attributes['w:line'],
                    lineRule: attributes['w:lineRule']
                };
            }
        }
    });
    return properties;
}

function processRunProperties(rPrElementObject: any): TextRunProperties {
    const properties: TextRunProperties = {};
    const tagName = getTagName(rPrElementObject); // "w:rPr"
     if (!tagName || tagName !== 'w:rPr') return properties;

    const rPrContentArray = getContentArrayFromElementObject(rPrElementObject, tagName);
    const rPrChildren = getActualChildElementObjects(rPrContentArray);

    rPrChildren.forEach(childObject => {
        const childTagName = getTagName(childObject);
        if (childTagName && WHITELISTED_RUN_PROPS.includes(childTagName)) {
            const childContentArray = getContentArrayFromElementObject(childObject, childTagName);
            const attributes = getAttributesFromElementObject(childObject);
            const isEmptyTag = childContentArray.length === 1 && Object.keys(childContentArray[0]).length === 0 && !childContentArray[0][':@'];


            if (childTagName === 'w:b' && (attributes['w:val'] !== "0" || isEmptyTag )) properties.bold = true;
            else if (childTagName === 'w:i' && (attributes['w:val'] !== "0" || isEmptyTag)) properties.italic = true;
            else if (childTagName === 'w:u' && attributes['w:val']) properties.underline = attributes['w:val'];
            else if (childTagName === 'w:sz' && attributes['w:val']) properties.fontSize = String(attributes['w:val']);
            else if (childTagName === 'w:color' && attributes['w:val']) properties.color = attributes['w:val'];
            else if (childTagName === 'w:rFonts' && attributes['w:hint']) properties.fontHint = attributes['w:hint'];
        }
    });
    return properties;
}

function processTextRun(rElementObject: any, parentId: string, order: number, extraProps?: any): TextRunJson | null {
    const tagName = getTagName(rElementObject);
    if (!tagName || tagName !== 'w:r') return null;
    
    const rTagAttributes = getAttributesFromElementObject(rElementObject);
    const rContentArray = getContentArrayFromElementObject(rElementObject, tagName);

    const runId = generateId('r', order, parentId);
    const textRunJson: TextRunJson = {
        id: runId, type: "textRun", order, parentId, text: "", properties: {}
    };

    // <w:r> 태그의 자식 요소들 (예: <w:rPr>, <w:t>, <w:br>)을 순회
    const rChildren = getActualChildElementObjects(rContentArray);
    rChildren.forEach(childObject => {
        const childTagName = getTagName(childObject);
        if (childTagName === 'w:rPr') {
            textRunJson.properties = processRunProperties(childObject); // pPrElementObject 전체를 넘김
        } else if (childTagName === 'w:t') {
            textRunJson.text += getTextFromTContentArray(getContentArrayFromElementObject(childObject, childTagName));
        } else if (childTagName === 'w:br') {
            textRunJson.text += '\n';
        }
    });
    
    // <w:r> 태그 자체의 속성도 properties에 포함시킬 수 있음 (예: w:rsidRPr)
    // textRunJson.properties = { ...textRunJson.properties, ...rTagAttributes };

    if (extraProps) {
        textRunJson.properties = { ...textRunJson.properties, ...extraProps };
    }
    return textRunJson;
}

function processParagraph(pElementObject: any, parentJsonBlockId?: string): ParagraphJson | null {
    const tagName = getTagName(pElementObject);
    if (!tagName || tagName !== 'w:p') return null;

    const pTagAttributes = getAttributesFromElementObject(pElementObject);
    const pContentArray = getContentArrayFromElementObject(pElementObject, tagName);

    globalOrderCounter++;
    const paraId = pTagAttributes['w14:paraId'] || generateId('p', globalOrderCounter, parentJsonBlockId);

    const paragraphJson: ParagraphJson = {
        id: paraId, type: "paragraph", order: globalOrderCounter, runs: [], properties: {}
    };
    if (parentJsonBlockId) paragraphJson.parentId = parentJsonBlockId;

    const pChildren = getActualChildElementObjects(pContentArray);
    let runOrder = 0;

    pChildren.forEach((childObject: any) => {
        const childTagName = getTagName(childObject);
        if (!childTagName) return;

        if (childTagName === 'w:pPr') {
            paragraphJson.properties = processParagraphProperties(childObject);
        } else if (childTagName === 'w:r') {
            runOrder++;
            const runJson = processTextRun(childObject, paraId, runOrder);
            if (runJson) paragraphJson.runs.push(runJson);
        } else if (childTagName === 'w:hyperlink') {
            const hyperlinkTagAttributes = getAttributesFromElementObject(childObject);
            const hyperlinkContentArray = getContentArrayFromElementObject(childObject, childTagName);
            const hyperlinkChildren = getActualChildElementObjects(hyperlinkContentArray);
            
            hyperlinkChildren.forEach(linkChildNode => {
                const linkChildTagName = getTagName(linkChildNode);
                if (linkChildTagName === 'w:r') {
                    runOrder++;
                    const runJson = processTextRun(
                        linkChildNode, // <w:r> 요소 객체 자체를 전달
                        paraId,
                        runOrder,
                        { isLink: true, linkId: hyperlinkTagAttributes['r:id'] }
                    );
                    if (runJson) paragraphJson.runs.push(runJson);
                }
            });
        }
    });
    return paragraphJson;
}

function processTableCell(tcElementObject: any, parentJsonBlockId: string, order: number): TableCellJson | null {
    const tagName = getTagName(tcElementObject);
    if (!tagName || tagName !== 'w:tc') return null;

    const tcTagAttributes = getAttributesFromElementObject(tcElementObject);
    const tcContentArray = getContentArrayFromElementObject(tcElementObject, tagName);

    const cellId = generateId('tc', order, parentJsonBlockId);
    const cellJson: TableCellJson = {
        id: cellId, type: "tableCell", order, parentId: parentJsonBlockId, content: []
    };

    const tcChildren = getActualChildElementObjects(tcContentArray);
    tcChildren.forEach(tcChild => {
        const childTagName = getTagName(tcChild);
        if (!childTagName) return;

        if (childTagName === 'w:p') {
            const paragraph = processParagraph(tcChild, cellId);
            if (paragraph) cellJson.content.push(paragraph);
        } else if (childTagName === 'w:tbl') {
            const table = processTable(tcChild, cellId);
            if (table) cellJson.content.push(table);
        }
    });
    return cellJson;
}

function processTableRow(trElementObject: any, parentId: string, order: number): TableRowJson | null {
    const tagName = getTagName(trElementObject);
    if (!tagName || tagName !== 'w:tr') return null;

    const trTagAttributes = getAttributesFromElementObject(trElementObject);
    const trContentArray = getContentArrayFromElementObject(trElementObject, tagName);
    
    const rowId = generateId('tr', order, parentId);
    const rowJson: TableRowJson = {
        id: rowId, type: "tableRow", order, parentId, cells: []
    };
    
    const trChildren = getActualChildElementObjects(trContentArray);
    let cellOrder = 0;
    trChildren.forEach((trChild: any) => {
        const childTagName = getTagName(trChild);
        if (childTagName === 'w:tc') {
            cellOrder++;
            const cellJson = processTableCell(trChild, rowId, cellOrder);
            if (cellJson) rowJson.cells.push(cellJson);
        }
    });
    return rowJson;
}

function processTable(tblElementObject: any, parentId?: string): TableJson | null {
    const tagName = getTagName(tblElementObject);
    if (!tagName || tagName !== 'w:tbl') return null;

    const tblTagAttributes = getAttributesFromElementObject(tblElementObject);
    const tblContentArray = getContentArrayFromElementObject(tblElementObject, tagName);

    globalOrderCounter++;
    const tableId = generateId('tbl', globalOrderCounter, parentId);
    const tableJson: TableJson = {
        id: tableId, type: "table", order: globalOrderCounter, rows: []
    };
    if (parentId) tableJson.parentId = parentId;

    const tblChildren = getActualChildElementObjects(tblContentArray);
    let rowOrder = 0;
    tblChildren.forEach((tblChild: any) => {
        const childTagName = getTagName(tblChild);
        if (childTagName === 'w:tr') {
            rowOrder++;
            const rowJson = processTableRow(tblChild, tableId, rowOrder);
            if (rowJson) tableJson.rows.push(rowJson);
        }
    });
    return tableJson;
}

// 메인 변환 함수
export function convertOoxmlToJson(xmlString: string): DocumentJson {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    attributesGroupName: ":@",
    removeNSPrefix: false,
    parseTagValue: false, 
    trimValues: false, // 사용자의 요청에 따라 false로 유지
    textNodeName: "#text",
    preserveOrder: true,
    ignoreDeclaration: true, // XML 선언부 무시
    ignorePiTags: true,      // 처리 지시문 무시
  });

  let parsedXmlArray;
  try {
    parsedXmlArray = parser.parse(xmlString);
    console.log("--- XML 파싱 성공 (preserveOrder:true) ---");
  } catch (parseError) {
    console.error("!!! XML 파싱 중 오류 발생 !!!", parseError);
    return { blocks: [] };
  }

  const documentJson: DocumentJson = { blocks: [] };
  globalOrderCounter = 0;

  const docEntry = parsedXmlArray.find((entry: any) => getTagName(entry) === 'w:document'); // getTagName 사용
  if (!docEntry) {
    console.error("오류: <w:document> 요소를 찾을 수 없습니다.");
    return documentJson;
  }

  const docContentArray = getContentArrayFromElementObject(docEntry, 'w:document');
  const bodyEntry = docContentArray.find((entry: any) => getTagName(entry) === 'w:body');

  if (!bodyEntry) {
    console.error("오류: <w:body> 요소를 찾을 수 없습니다.");
    return documentJson;
  }
  
  const bodyContentArray = getContentArrayFromElementObject(bodyEntry, 'w:body');
  const bodyChildren = getActualChildElementObjects(bodyContentArray);
  
  console.log(`<w:body> 내부의 유효한 자식 요소(그룹) 개수: ${bodyChildren.length}`);

  if (bodyChildren.length > 0) {
    bodyChildren.forEach((bodyChildElementObject: any) => { // 변수명 변경 bodyChild -> bodyChildElementObject
      const tagName = getTagName(bodyChildElementObject);

      if (tagName === 'w:p') {
        // processParagraph에는 { "w:p": [...], ":@": {...} } 형태의 객체 자체를 전달
        const paragraph = processParagraph(bodyChildElementObject, undefined);
        if (paragraph) documentJson.blocks.push(paragraph);
      } else if (tagName === 'w:tbl') {
        const table = processTable(bodyChildElementObject, undefined);
        if (table) documentJson.blocks.push(table);
      } else if (tagName === 'w:sectPr') {
         // console.log(`  - 섹션 속성(w:sectPr)은 현재 처리 로직에서 건너뜁니다.`);
      } else if (tagName && tagName.startsWith('w:')) {
         // console.log(`  - 처리되지 않은 WordprocessingML 요소 타입 (body 자식): ${tagName}`);
      }
    });
  } else {
    console.warn("경고: <w:body> 요소 내부에 처리할 자식 요소가 없습니다.");
  }

  console.log(`최종 블록 개수: ${documentJson.blocks.length}`);
  if (documentJson.blocks.length === 0 && xmlString.includes("<w:p>")) {
      console.warn("경고: XML에 <w:p> 태그가 있지만, JSON 블록이 생성되지 않았습니다. 파싱 또는 처리 로직을 확인하세요.");
  }
  return documentJson;
}