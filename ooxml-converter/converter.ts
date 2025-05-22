// converter.ts (사용자 수정 기반 + 추가 개선)

import { XMLParser } from 'fast-xml-parser';
import * as shortid from 'shortid';
import { generateNKeysBetween } from 'fractional-indexing';

// --- 인터페이스 정의 (새로운 구조에 맞게 수정) ---
interface DocumentJson {
  [blockId: string]: ParagraphJson | TableJson;
}

// BaseBlockData는 각 블록/요소의 공통 속성을 정의 (id는 키로 사용되므로 제외)
interface BaseBlockData {
  type: string;
  order?: string; // 문서 전체 또는 상위 요소 내에서의 순서
  parentId?: string; // 상위 요소의 ID (TextRun, TableRow, TableCell 등에 사용)
}

interface ParagraphProperties { justification?: string; spacing?: { after?: string | number; line?: string | number; lineRule?: string; }; }
interface TextRunProperties { bold?: boolean; italic?: boolean; underline?: string; fontSize?: string; color?: string; fontHint?: string; isLink?: boolean; linkId?: string; }

// TextRun 데이터 (id는 키로 사용되므로 ParagraphJson 내부의 키가 됨)
interface TextRunJson extends BaseBlockData {
  type: "textRun";
  // parentId: string; // 속한 Paragraph의 ID (BaseBlockData에 포함)
  text: string;
  properties: TextRunProperties;
}

// Paragraph 블록 데이터 (id는 DocumentJson의 키가 됨)
// ParagraphJson은 type, order, properties 고정 필드와 [runId: string]: TextRunJson 동적 필드를 가짐
interface ParagraphJson extends BaseBlockData {
  type: "paragraph";
  properties: ParagraphProperties;
  // TextRunJson 객체들이 runId를 키로 하여 여기에 직접 추가됨
  [runId: string]: TextRunJson | ParagraphProperties | string | undefined;
}

// TableCell 내용. DocumentJson과 유사하게 중첩된 블록을 가짐
interface TableCellContent {
    [blockId: string]: ParagraphJson | TableJson;
}

interface TableCellJson extends BaseBlockData {
  type: "tableCell";
  // parentId: string; // 속한 TableRow의 ID (BaseBlockData에 포함)
  content: TableCellContent; // 셀 내부는 다시 DocumentJson과 유사한 구조
}

interface TableRowJson extends BaseBlockData {
  type: "tableRow";
  // parentId: string; // 속한 Table의 ID (BaseBlockData에 포함)
  // TableCellJson 객체들이 cellId를 키로 하여 여기에 직접 추가됨
  [cellId: string]: TableCellJson | string | undefined;
}

// Table 블록 데이터 (id는 DocumentJson의 키가 됨)
interface TableJson extends BaseBlockData {
  type: "table";
  // Table Properties (예: w:tblPr)는 여기에 추가 가능
  // TableRowJson 객체들이 rowId를 키로 하여 여기에 직접 추가됨
  [rowId: string]: TableRowJson | string | undefined;
}


const WHITELISTED_PARA_PROPS = ['w:spacing', 'w:jc', 'w:rPr'];
const WHITELISTED_RUN_PROPS = ['w:b', 'w:i', 'w:u', 'w:sz', 'w:color', 'w:rFonts'];

function generateOrderArray(length: number): string[] {
    if (length === 0) {
        return [];
    }
    // fractional-indexing 라이브러리를 사용하여 length개의 정렬 가능한 문자열 키를 생성합니다.
    // 첫 번째 인자와 두 번째 인자로 null, null을 전달하면, 리스트의 처음부터 순서대로 키가 생성됩니다.
    // 예를 들어 length가 3이면 ["a0", "a1", "a2"] 와 유사한 (하지만 실제로는 더 복잡한) 배열이 반환될 수 있습니다.
    return generateNKeysBetween(null, null, length);
}

function generateId(): string {

    // type 1: use ordered id
    //return parentId ? `${parentId}_${type}_${order}` : `${type}_${order}`;

    // type 2: use randomHex id
    // const randomHex = shortid.generate();
    // if (parentId) {
    //     return `${parentId}_${randomHex}`;
    // } else {
    //     return randomHex;
    // }

    // type 3: use shortid
    return shortid.generate();
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

// processTextRun은 TextRunJson 객체와 해당 run의 id를 반환
function processTextRun(rElementObject: any, paragraphId: string, order?: string, extraProps?: any): { runId: string, runJson: TextRunJson } | null {
    const tagName = getTagName(rElementObject);
    if (!tagName || tagName !== 'w:r') return null;
    
    // const rTagAttributes = getAttributesFromElementObject(rElementObject); // 현재 사용 안 함
    const rContentArray = getContentArrayFromElementObject(rElementObject, tagName);

    const runId = generateId(); // runId는 parentId(paragraphId)를 기반으로 생성
    const textRunJson: TextRunJson = {
        type: "textRun", order, text: "", properties: {}
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
function processParagraph(pElementObject: any, parentBlockId?: string, order?: string): { [id: string]: ParagraphJson } | null {
    const tagName = getTagName(pElementObject);
    if (!tagName || tagName !== 'w:p') return null;

    // const pTagAttributes = getAttributesFromElementObject(pElementObject); // w14:paraId 사용하지 않음
    const pContentArray = getContentArrayFromElementObject(pElementObject, tagName);

    const paraId = generateId(); // 최상위 문단의 parentBlockId는 undefined

    const paragraphJson: ParagraphJson = {
        type: "paragraph",
        order: order,
        properties: {}
        // runs는 여기에 동적으로 추가됨
    };
    if (parentBlockId) paragraphJson.parentId = parentBlockId;


    const pChildren = getActualChildElementObjects(pContentArray);
    const runOrderArray = generateOrderArray(pChildren.length); // 자식 수 만큼 order 생성

    pChildren.forEach((childObject: any) => {
        const childTagName = getTagName(childObject);
        const runOrder = runOrderArray.shift();
        if (!childTagName) return;

        if (childTagName === 'w:pPr') {
            paragraphJson.properties = processParagraphProperties(childObject);
        } else if (childTagName === 'w:r') {
            const runResult = processTextRun(childObject, paraId, runOrder);
            if (runResult) {
                paragraphJson[runResult.runId] = runResult.runJson;
            }
        } else if (childTagName === 'w:hyperlink') {
            const hyperlinkTagAttributes = getAttributesFromElementObject(childObject);
            const hyperlinkContentArray = getContentArrayFromElementObject(childObject, childTagName);
            const hyperlinkChildren = getActualChildElementObjects(hyperlinkContentArray);
            
            hyperlinkChildren.forEach(linkChildNode => {
                const linkChildTagName = getTagName(linkChildNode);
                if (linkChildTagName === 'w:r') {
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
function processTableCell(tcElementObject: any, tableRowId: string, order?: string): { [id: string]: TableCellJson } | null {
    const tagName = getTagName(tcElementObject);
    if (!tagName || tagName !== 'w:tc') return null;

    // const tcTagAttributes = getAttributesFromElementObject(tcElementObject); // 현재 사용 안 함
    const tcContentArray = getContentArrayFromElementObject(tcElementObject, tagName);

    const cellId = generateId();
    const cellJson: TableCellJson = {
        type: "tableCell", order, content: {}
    };

    const tcChildren = getActualChildElementObjects(tcContentArray);
    const cellOrderArray = generateOrderArray(tcChildren.length); // 자식 수 만큼 order 생성
    tcChildren.forEach(tcChild => {
        const childTagName = getTagName(tcChild);
        const order = cellOrderArray.shift();
        if (!childTagName) return;

        if (childTagName === 'w:p') {
            const paragraphResult = processParagraph(tcChild, cellId, order); // 셀 내 문단의 parentId는 cellId
            if (paragraphResult) Object.assign(cellJson.content, paragraphResult);
        } else if (childTagName === 'w:tbl') {
            const tableResult = processTable(tcChild, cellId, order); // 셀 내 테이블의 parentId는 cellId
            if (tableResult) Object.assign(cellJson.content, tableResult);
        }
    });
    return { [cellId]: cellJson };
}

// processTableRow는 { [rowId]: TableRowJson } 형태의 객체를 반환
function processTableRow(trElementObject: any, tableId: string, order?: string): { [id: string]: TableRowJson } | null {
    const tagName = getTagName(trElementObject);
    if (!tagName || tagName !== 'w:tr') return null;

    // const trTagAttributes = getAttributesFromElementObject(trElementObject); // 현재 사용 안 함
    const trContentArray = getContentArrayFromElementObject(trElementObject, tagName);
    
    const rowId = generateId();
    const rowJson: TableRowJson = {
        type: "tableRow", order
        // cells는 여기에 동적으로 추가됨
    };
    
    const trChildren = getActualChildElementObjects(trContentArray);
    const cellOrderArray = generateOrderArray(trChildren.length); // 자식 수 만큼 order 생성
    trChildren.forEach((trChild: any) => {
        const childTagName = getTagName(trChild);
        if (childTagName === 'w:tc') {
            const cellOrder = cellOrderArray.shift();
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
function processTable(tblElementObject: any, parentBlockId?: string, order?: string): { [id: string]: TableJson } | null {
    const tagName = getTagName(tblElementObject);
    if (!tagName || tagName !== 'w:tbl') return null;

    // const tblTagAttributes = getAttributesFromElementObject(tblElementObject); // 현재 사용 안 함
    const tblContentArray = getContentArrayFromElementObject(tblElementObject, tagName);

    const tableId = generateId();
    const tableJson: TableJson = {
        type: "table", order: order
        // rows는 여기에 동적으로 추가됨
    };
    if (parentBlockId) tableJson.parentId = parentBlockId;


    const tblChildren = getActualChildElementObjects(tblContentArray);
    const rowOrderArray = generateOrderArray(tblChildren.length); // 자식 수 만큼 order 생성
    tblChildren.forEach((tblChild: any) => {
        const childTagName = getTagName(tblChild);
        if (childTagName === 'w:tr') {
            const rowOrder = rowOrderArray.shift();
            const rowResult = processTableRow(tblChild, tableId, rowOrder);
            if (rowResult) {
                const rowKey = Object.keys(rowResult)[0];
                tableJson[rowKey] = rowResult[rowKey];
            }
        }
    });
    return { [tableId]: tableJson };
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
    return {}; // 빈 DocumentJson 객체 반환
  }

  const documentJson: DocumentJson = {}; // DocumentJson을 객체로 초기화

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

  const orderArray = generateOrderArray(bodyChildren.length); // 자식 수 만큼 order 생성

  if (bodyChildren.length > 0) {
    bodyChildren.forEach((bodyChildElementObject: any) => { // 변수명 변경 bodyChild -> bodyChildElementObject
      const tagName = getTagName(bodyChildElementObject);
      const order = orderArray.shift();

      if (tagName === 'w:p') {
        const paragraphResult = processParagraph(bodyChildElementObject, undefined, order); // 최상위 문단이므로 parentId 없음
        if (paragraphResult) Object.assign(documentJson, paragraphResult); // 결과 병합
      } else if (tagName === 'w:tbl') {
        const tableResult = processTable(bodyChildElementObject, undefined, order); // 최상위 테이블이므로 parentId 없음
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
  return documentJson;
}