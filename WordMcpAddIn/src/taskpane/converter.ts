import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import * as shortid from 'shortid';

// --- 인터페이스 정의 ---
interface DocumentJson {
  [blockId: string]: ParagraphJson | TableJson;
}

interface BaseBlockData {
  type: string;
  order: number;
  parentId?: string;
  xmlId?: string;
}

interface ParagraphProperties { 
  justification?: string; 
  spacing?: { 
    after?: string | number; 
    line?: string | number; 
    lineRule?: string; 
  }; 
}

interface TextRunProperties { 
  bold?: boolean; 
  italic?: boolean; 
  underline?: string; 
  fontSize?: string; 
  color?: string; 
  fontHint?: string; 
  isLink?: boolean; 
  linkId?: string; 
}

interface TextRunJson extends BaseBlockData {
  type: "textRun";
  text: string;
  properties: TextRunProperties;
}

interface ParagraphJson extends BaseBlockData {
  type: "paragraph";
  properties: ParagraphProperties;
  [runId: string]: TextRunJson | ParagraphProperties | string | number | undefined;
}

interface TableCellContent {
  [blockId: string]: ParagraphJson | TableJson;
}

interface TableCellJson extends BaseBlockData {
  type: "tableCell";
  content: TableCellContent;
}

interface TableRowJson extends BaseBlockData {
  type: "tableRow";
  [cellId: string]: TableCellJson | string | number | undefined;
}

interface TableJson extends BaseBlockData {
  type: "table";
  [rowId: string]: TableRowJson | string | number | undefined;
}

interface ConversionResult {
  xml: string;
  json: DocumentJson;
}

export type { DocumentJson, ParagraphJson, TableJson, TextRunJson, ConversionResult };

// OOXML 네임스페이스 상수
const MC_PREFIX = 'mc';
const MC_NS = 'http://schemas.openxmlformats.org/markup-compatibility/2006';
const CUSTOM_PREFIX = 'custom'; // 사용자 정의 네임스페이스 접두사
const CUSTOM_NS = 'http://schemas.customns.com/wordprocessingml/2023/custom';

const WHITELISTED_PARA_PROPS = ['w:spacing', 'w:jc', 'w:rPr'];
const WHITELISTED_RUN_PROPS = ['w:b', 'w:i', 'w:u', 'w:sz', 'w:color', 'w:rFonts'];
let globalOrderCounter = 0;

// ID를 추출하거나 생성하는 함수
function extractOrGenerateId(elementObject: any, type: string, order: number, parentId?: string): string {
  // 1. custom:id가 있으면 사용
  if (elementObject && elementObject[':@'] && elementObject[':@'][`${CUSTOM_PREFIX}:id`]) {
    return elementObject[':@'][`${CUSTOM_PREFIX}:id`];
  }
  
  // 2. w14:paraId나 다른 고유 ID가 있으면 사용
  if (elementObject && elementObject[':@']) {
    if (elementObject[':@']['w14:paraId']) {
      return elementObject[':@']['w14:paraId'];
    }
    // 기타 가능한 ID 속성이 있다면 여기에 추가...
  }
  
  // 3. 없으면 새로 생성
  return shortid.generate();
}

// XML 요소에 ID 주입하는 함수
function injectIdToElement(elementObject: any, tagName: string, id: string): void {
  if (!elementObject) return;
  
  // 속성 객체가 없으면 생성
  if (!elementObject[':@']) {
    elementObject[':@'] = {};
  }
  
  // custom:id 속성 추가
  elementObject[':@'][`${CUSTOM_PREFIX}:id`] = id;
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

// 요소의 자식 콘텐츠 배열을 가져오는 함수
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

// w:t 태그의 텍스트 내용을 추출하는 함수
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

// 문단 속성 처리 함수
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

// 텍스트 실행 속성 처리 함수
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

// processTextRun은 TextRunJson 객체와 해당 run의 id를 반환
function processTextRun(rElementObject: any, paragraphId: string, order: number, extraProps?: any): { runId: string, runJson: TextRunJson } | null {
    const tagName = getTagName(rElementObject);
    if (!tagName || tagName !== 'w:r') return null;
    
    // 이 요소의 ID 추출 또는 생성
    const runId = extractOrGenerateId(rElementObject, 'r', order, paragraphId);
    
    // XML 요소에 ID 주입
    injectIdToElement(rElementObject, 'w:r', runId);
    
    // const rTagAttributes = getAttributesFromElementObject(rElementObject); // 현재 사용 안 함
    const rContentArray = getContentArrayFromElementObject(rElementObject, tagName);

    const textRunJson: TextRunJson = {
        type: "textRun", order, parentId: paragraphId, text: "", properties: {},
        xmlId: runId // XML ID 저장
    };

    const rChildren = getActualChildElementObjects(rContentArray);
    rChildren.forEach(childObject => {
        const childTagName = getTagName(childObject);
        if (childTagName === 'w:rPr') {
            textRunJson.properties = processRunProperties(childObject);
        } else if (childTagName === 'w:t') {
            textRunJson.text += getTextFromTContentArray(getContentArrayFromElementObject(childObject, childTagName));
        } else if (childTagName === 'w:br') {
            textRunJson.text += '\\n';
        }
    });
    
    if (extraProps) {
        textRunJson.properties = { ...textRunJson.properties, ...extraProps };
    }
    return { runId, runJson: textRunJson };
}

// processParagraph는 { [paragraphId]: ParagraphJson } 형태의 객체를 반환
function processParagraph(pElementObject: any, parentBlockId?: string): { [id: string]: ParagraphJson } | null {
    const tagName = getTagName(pElementObject);
    if (!tagName || tagName !== 'w:p') return null;

    // 이 요소의 ID 추출 또는 생성
    globalOrderCounter++;
    const paraId = extractOrGenerateId(pElementObject, 'p', globalOrderCounter, parentBlockId);
    
    // XML 요소에 ID 주입
    injectIdToElement(pElementObject, 'w:p', paraId);
    
    // const pTagAttributes = getAttributesFromElementObject(pElementObject); // w14:paraId 사용하지 않음
    const pContentArray = getContentArrayFromElementObject(pElementObject, tagName);

    const paragraphJson: ParagraphJson = {
        type: "paragraph",
        order: globalOrderCounter,
        properties: {},
        xmlId: paraId // XML ID 저장
    };
    if (parentBlockId) paragraphJson.parentId = parentBlockId;

    const pChildren = getActualChildElementObjects(pContentArray);
    let runOrder = 0;

    pChildren.forEach((childObject: any) => {
        const childTagName = getTagName(childObject);
        if (!childTagName) return;

        if (childTagName === 'w:pPr') {
            paragraphJson.properties = processParagraphProperties(childObject);
        } else if (childTagName === 'w:r') {
            runOrder++;
            const runResult = processTextRun(childObject, paraId, runOrder);
            if (runResult) {
                paragraphJson[runResult.runId] = runResult.runJson;
            }
        } else if (childTagName === 'w:hyperlink') {
            const hyperlinkTagAttributes = getAttributesFromElementObject(childObject);
            const hyperlinkContentArray = getContentArrayFromElementObject(childObject, childTagName);
            const hyperlinkChildren = getActualChildElementObjects(hyperlinkContentArray);
            
            // 하이퍼링크에도 ID 주입
            const hyperlinkId = extractOrGenerateId(childObject, 'hyperlink', globalOrderCounter + runOrder, paraId);
            injectIdToElement(childObject, 'w:hyperlink', hyperlinkId);
            
            hyperlinkChildren.forEach(linkChildNode => {
                const linkChildTagName = getTagName(linkChildNode);
                if (linkChildTagName === 'w:r') {
                    runOrder++;
                    const runResult = processTextRun(
                        linkChildNode,
                        paraId,
                        runOrder,
                        { isLink: true, linkId: hyperlinkTagAttributes['r:id'] }
                    );
                    if (runResult) {
                        paragraphJson[runResult.runId] = runResult.runJson;
                    }
                }
            });
        }
    });
    return { [paraId]: paragraphJson };
}

// processTableCell은 { [cellId]: TableCellJson } 형태의 객체를 반환
function processTableCell(tcElementObject: any, tableRowId: string, order: number): { [id: string]: TableCellJson } | null {
    const tagName = getTagName(tcElementObject);
    if (!tagName || tagName !== 'w:tc') return null;

    // 이 요소의 ID 추출 또는 생성
    const cellId = extractOrGenerateId(tcElementObject, 'tc', order, tableRowId);
    
    // XML 요소에 ID 주입
    injectIdToElement(tcElementObject, 'w:tc', cellId);
    
    // const tcTagAttributes = getAttributesFromElementObject(tcElementObject); // 현재 사용 안 함
    const tcContentArray = getContentArrayFromElementObject(tcElementObject, tagName);

    const cellJson: TableCellJson = {
        type: "tableCell", order, parentId: tableRowId, content: {},
        xmlId: cellId // XML ID 저장
    };

    const tcChildren = getActualChildElementObjects(tcContentArray);
    tcChildren.forEach(tcChild => {
        const childTagName = getTagName(tcChild);
        if (!childTagName) return;

        if (childTagName === 'w:p') {
            const paragraphResult = processParagraph(tcChild, cellId); // 셀 내 문단의 parentId는 cellId
            if (paragraphResult) Object.assign(cellJson.content, paragraphResult);
        } else if (childTagName === 'w:tbl') {
            const tableResult = processTable(tcChild, cellId); // 셀 내 테이블의 parentId는 cellId
            if (tableResult) Object.assign(cellJson.content, tableResult);
        }
    });
    return { [cellId]: cellJson };
}

// processTableRow는 { [rowId]: TableRowJson } 형태의 객체를 반환
function processTableRow(trElementObject: any, tableId: string, order: number): { [id: string]: TableRowJson } | null {
    const tagName = getTagName(trElementObject);
    if (!tagName || tagName !== 'w:tr') return null;

    // 이 요소의 ID 추출 또는 생성
    const rowId = extractOrGenerateId(trElementObject, 'tr', order, tableId);
    
    // XML 요소에 ID 주입
    injectIdToElement(trElementObject, 'w:tr', rowId);
    
    // const trTagAttributes = getAttributesFromElementObject(trElementObject); // 현재 사용 안 함
    const trContentArray = getContentArrayFromElementObject(trElementObject, tagName);
    
    const rowJson: TableRowJson = {
        type: "tableRow", order, parentId: tableId,
        xmlId: rowId // XML ID 저장
        // cells는 여기에 동적으로 추가됨
    };
    
    const trChildren = getActualChildElementObjects(trContentArray);
    let cellOrder = 0;
    trChildren.forEach((trChild: any) => {
        const childTagName = getTagName(trChild);
        if (childTagName === 'w:tc') {
            cellOrder++;
            const cellResult = processTableCell(trChild, rowId, cellOrder);
            if (cellResult) {
                const cellKey = Object.keys(cellResult)[0];
                rowJson[cellKey] = cellResult[cellKey];
            }
        }
    });
    return { [rowId]: rowJson };
}

// processTable은 { [tableId]: TableJson } 형태의 객체를 반환
function processTable(tblElementObject: any, parentBlockId?: string): { [id: string]: TableJson } | null {
    const tagName = getTagName(tblElementObject);
    if (!tagName || tagName !== 'w:tbl') return null;

    // 이 요소의 ID 추출 또는 생성
    globalOrderCounter++;
    const tableId = extractOrGenerateId(tblElementObject, 'tbl', globalOrderCounter, parentBlockId);
    
    // XML 요소에 ID 주입
    injectIdToElement(tblElementObject, 'w:tbl', tableId);
    
    // const tblTagAttributes = getAttributesFromElementObject(tblElementObject); // 현재 사용 안 함
    const tblContentArray = getContentArrayFromElementObject(tblElementObject, tagName);

    const tableJson: TableJson = {
        type: "table", order: globalOrderCounter,
        xmlId: tableId // XML ID 저장
        // rows는 여기에 동적으로 추가됨
    };
    if (parentBlockId) tableJson.parentId = parentBlockId;

    const tblChildren = getActualChildElementObjects(tblContentArray);
    let rowOrder = 0;
    tblChildren.forEach((tblChild: any) => {
        const childTagName = getTagName(tblChild);
        if (childTagName === 'w:tr') {
            rowOrder++;
            const rowResult = processTableRow(tblChild, tableId, rowOrder);
            if (rowResult) {
                const rowKey = Object.keys(rowResult)[0];
                tableJson[rowKey] = rowResult[rowKey];
            }
        }
    });
    return { [tableId]: tableJson };
}

// w:document 요소에 필요한 네임스페이스 및 Ignorable 속성 추가
function addNamespacesToDocument(docEntry: any): void {
  if (!docEntry) return;
  
  const tagName = getTagName(docEntry);
  if (tagName !== 'w:document') return;
  
  const docContentArray = getContentArrayFromElementObject(docEntry, tagName);
  if (!docContentArray || docContentArray.length === 0) return;
  
  // w:document 요소의 첫 번째 항목이 일반적으로 속성을 포함
  if (!docContentArray[0][':@']) {
    docContentArray[0][':@'] = {};
  }
  
  const documentAttrs = docContentArray[0][':@'];
  
  // 네임스페이스 선언 추가
  documentAttrs[`xmlns:${MC_PREFIX}`] = MC_NS;
  documentAttrs[`xmlns:${CUSTOM_PREFIX}`] = CUSTOM_NS;
  
  // mc:Ignorable 속성 추가/업데이트
  if (documentAttrs[`${MC_PREFIX}:Ignorable`]) {
    // 이미 mc:Ignorable이 있으면 custom 접두사 추가
    if (!documentAttrs[`${MC_PREFIX}:Ignorable`].includes(CUSTOM_PREFIX)) {
      documentAttrs[`${MC_PREFIX}:Ignorable`] += ` ${CUSTOM_PREFIX}`;
    }
  } else {
    // mc:Ignorable이 없으면 새로 추가
    documentAttrs[`${MC_PREFIX}:Ignorable`] = CUSTOM_PREFIX;
  }
}

// 메인 변환 함수 (ID 주입 및 JSON 변환을 함께 처리)
export function convertOoxmlToJson(xmlString: string): ConversionResult {
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
    return { xml: xmlString, json: {} }; // 빈 DocumentJson 객체 반환
  }

  const documentJson: DocumentJson = {}; // DocumentJson을 객체로 초기화
  globalOrderCounter = 0;

  const docEntry = parsedXmlArray.find((entry: any) => getTagName(entry) === 'w:document'); // getTagName 사용
  if (!docEntry) {
    console.error("오류: <w:document> 요소를 찾을 수 없습니다.");
    return { xml: xmlString, json: documentJson };
  }

  // w:document 요소에 네임스페이스 및 Ignorable 속성 추가
  addNamespacesToDocument(docEntry);

  const docContentArray = getContentArrayFromElementObject(docEntry, 'w:document');
  const bodyEntry = docContentArray.find((entry: any) => getTagName(entry) === 'w:body');

  if (!bodyEntry) {
    console.error("오류: <w:body> 요소를 찾을 수 없습니다.");
    return { xml: xmlString, json: documentJson };
  }
  
  const bodyContentArray = getContentArrayFromElementObject(bodyEntry, 'w:body');
  const bodyChildren = getActualChildElementObjects(bodyContentArray);
  
  console.log(`<w:body> 내부의 유효한 자식 요소(그룹) 개수: ${bodyChildren.length}`);

  if (bodyChildren.length > 0) {
    bodyChildren.forEach((bodyChildElementObject: any) => { // 변수명 변경 bodyChild -> bodyChildElementObject
      const tagName = getTagName(bodyChildElementObject);

      if (tagName === 'w:p') {
        const paragraphResult = processParagraph(bodyChildElementObject, undefined); // 최상위 문단이므로 parentId 없음
        if (paragraphResult) Object.assign(documentJson, paragraphResult); // 결과 병합
      } else if (tagName === 'w:tbl') {
        const tableResult = processTable(bodyChildElementObject, undefined); // 최상위 테이블이므로 parentId 없음
        if (tableResult) Object.assign(documentJson, tableResult); // 결과 병합
      } else if (tagName === 'w:sectPr') {
         // console.log(`  - 섹션 속성(w:sectPr)은 현재 처리 로직에서 건너뜁니다.`);
      } else if (tagName && tagName.startsWith('w:')) {
         // console.log(`  - 처리되지 않은 WordprocessingML 요소 타입 (body 자식): ${tagName}`);
      }
    });
  } else {
    console.warn("경고: <w:body> 요소 내부에 처리할 자식 요소가 없습니다.");
  }

  console.log(`최종 블록 개수 (키 기준): ${Object.keys(documentJson).length}`);
  if (Object.keys(documentJson).length === 0 && xmlString.includes("<w:p>")) {
      console.warn("경고: XML에 <w:p> 태그가 있지만, JSON 블록이 생성되지 않았습니다. 파싱 또는 처리 로직을 확인하세요.");
  }
  
  // 변경된 XML 다시 문자열로 변환
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    // attributesGroupName: ":@",
    format: true,
    suppressEmptyNode: false,
    preserveOrder: true,
    suppressBooleanAttributes: false,
    unpairedTags: ["w:br", "w:cr"] // Self-closing tags
  });
  
  // XML 생성 및 문자열 후처리
  let updatedXml = "";
  try {
    updatedXml = builder.build(parsedXmlArray);
    
    // 속성 문제 수정: 잘못된 속성 접두사와 [object Object] 수정
    updatedXml = updatedXml
      .replace(/="?\[object Object\]"?/g, '')
      .replace(/ lns:/g, ' xmlns:')
      .replace(/stom:id=/g, `${CUSTOM_PREFIX}:id=`)
      .replace(/ :Ignorable=/g, ` ${MC_PREFIX}:Ignorable=`);
      
  } catch (error) {
    console.error("XML 빌드 중 오류 발생:", error);
    updatedXml = xmlString; // 오류 발생 시 원본 반환
  }
  
  return { 
    xml: updatedXml, 
    json: documentJson 
  };
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
  
// 편의 함수: Flat OPC 또는 document XML 처리 후 XML과 JSON 모두 반환
export function processDocument(xmlString: string): ConversionResult {
  let documentXml = xmlString;
  try {
    documentXml = pickDocumentPart(xmlString);
  } catch (e) {
    // 이미 document 부분만 있는 경우 그대로 사용
    console.log("문서 추출 시도 중 오류 발생, 입력값을 그대로 사용합니다:", e.message);
  }
  
  return convertOoxmlToJson(documentXml);
}

// 이전 API와의 호환성을 위한 함수 (JSON만 반환)
export function convertOoxmlToJsonOnly(xmlString: string): DocumentJson {
  return convertOoxmlToJson(xmlString).json;
}

// OOXML과 매핑된 JSON을 생성/변환하는 유틸리티 함수들

// 원본 XML에서 업데이트된 XML 부분만 교체하는 함수
export function replaceOriginalWithUpdated(originalXml: string, updatedXml: string): string {
  // Flat OPC 형식인 경우 document.xml 부분만 교체
  if (originalXml.indexOf('<pkg:package') !== -1) {
    // '/word/document.xml' 파트 찾기
    const partMatch = originalXml.match(
      /<pkg:part[^>]*pkg:name="\/word\/document\.xml"[^>]*>[\s\S]*?<\/pkg:part>/i
    );
    if (!partMatch) {
      throw new Error('document.xml part not found in Flat-OPC');
    }
    
    // XML 데이터 부분 찾기
    const xmlDataMatch = partMatch[0].match(
      /(<pkg:xmlData[^>]*>)([\s\S]*?)(<\/pkg:xmlData>)/i
    );
    if (!xmlDataMatch) {
      throw new Error('pkg:xmlData section missing');
    }
    
    // xmlData 내용만 업데이트
    const updatedPart = partMatch[0].replace(
      xmlDataMatch[0],
      `${xmlDataMatch[1]}${updatedXml}${xmlDataMatch[3]}`
    );
    
    // 전체 문서에서 해당 부분 교체
    return originalXml.replace(partMatch[0], updatedPart);
  }
  
  // 이미 document 부분만 있는 경우 직접 교체
  return updatedXml;
}

// 특정 요소만 업데이트하는 함수
export function updateElementInXml(xml: string, elementId: string, newContent: string): string {
  // XML 파싱
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    attributesGroupName: ":@",
    removeNSPrefix: false,
    parseTagValue: false,
    trimValues: false,
    textNodeName: "#text",
    preserveOrder: true,
    ignoreDeclaration: true,
    ignorePiTags: true,
  });
  
  const parsedXml = parser.parse(xml);
  
  // 요소 검색 및 업데이트 (재귀 함수)
  function findAndUpdateElement(elements: any[]): boolean {
    if (!Array.isArray(elements)) return false;
    
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (typeof element !== 'object' || element === null) continue;
      
      // 속성 확인
      if (element[':@'] && element[':@'][`${CUSTOM_PREFIX}:id`] === elementId) {
        // 요소를 찾음 - 업데이트 로직 (여기서는 간단히 새 콘텐츠로 대체)
        // 실제 구현에서는 더 복잡한 업데이트 로직이 필요할 수 있음
        const tagName = getTagName(element);
        if (tagName) {
          elements[i] = parser.parse(newContent)[0]; // 새 콘텐츠로 교체
          return true;
        }
      }
      
      // 자식 요소 재귀 검색
      for (const key in element) {
        if (key === ':@' || key === '#text') continue;
        if (Array.isArray(element[key]) && findAndUpdateElement(element[key])) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  // 요소 검색 및 업데이트
  if (!findAndUpdateElement(parsedXml)) {
    throw new Error(`Element with id '${elementId}' not found in XML`);
  }
  
  // 다시 XML 문자열로 변환
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    attributesGroupName: ":@",
    format: true,
    suppressEmptyNode: false,
    preserveOrder: true,
    suppressBooleanAttributes: false,
    unpairedTags: ["w:br", "w:cr"] // Self-closing tags
  });
  
  // XML 생성 및 문자열 후처리
  let xmlOutput = "";
  try {
    xmlOutput = builder.build(parsedXml);
    
    // 속성 문제 수정: 잘못된 속성 접두사와 [object Object] 수정
    xmlOutput = xmlOutput
      .replace(/="?\[object Object\]"?/g, '')
      .replace(/ lns:/g, ' xmlns:')
      .replace(/stom:id=/g, `${CUSTOM_PREFIX}:id=`)
      .replace(/ :Ignorable=/g, ` ${MC_PREFIX}:Ignorable=`);
      
  } catch (error) {
    console.error("XML 빌드 중 오류 발생:", error);
    throw new Error(`Element with id '${elementId}' found but XML building failed: ${error.message}`);
  }
  
  return xmlOutput;
}

// JSON의 변경 사항을 XML에 반영하는 함수
export function applyJsonChangesToXml(originalXml: string, originalJson: DocumentJson, updatedJson: DocumentJson): string {
  // 여기서는 간단한 예시만 구현
  // 실제 구현에서는 복잡한 비교 및 변경 감지 로직이 필요
  
  let updatedXml = originalXml;
  
  // 각 키에 대해 변경 감지
  for (const key in updatedJson) {
    if (!originalJson[key] || JSON.stringify(originalJson[key]) !== JSON.stringify(updatedJson[key])) {
      const element = updatedJson[key];
      
      // XML ID가 있는지 확인
      if (element && element.xmlId) {
        // 해당 요소에 대한 XML 생성
        // 이 부분은 실제 구현시 더 복잡해질 수 있음
        // 현재는 간단한 개념 증명으로만 구현
        
        try {
          // 예: 문단 요소 업데이트 (실제로는 더 복잡한 로직 필요)
          if (element.type === 'paragraph') {
            const newContent = `<w:p ${CUSTOM_PREFIX}:id="${element.xmlId}">
              <w:pPr>
                <!-- 문단 속성 -->
              </w:pPr>
              <!-- 텍스트 실행 요소들 -->
            </w:p>`;
            
            updatedXml = updateElementInXml(updatedXml, element.xmlId, newContent);
          }
          // 여기에 다른 요소 타입에 대한 처리 추가
        } catch (error) {
          console.error(`Error updating element ${key}:`, error);
        }
      }
    }
  }
  
  return updatedXml;
}