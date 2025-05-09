// converter.ts (전체 수정본)

import { XMLParser } from 'fast-xml-parser';

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

// XML 파싱 결과에서 <w:t> 요소의 텍스트 내용을 추출하는 함수
function getTextFromTElement(tElement: any): string {
  if (tElement === null || tElement === undefined) return ""; // null 또는 undefined 체크

  // Case 1: Handles object { '#text': '...' }
  if (typeof tElement === 'object' && typeof tElement['#text'] === 'string') {
    return tElement['#text'];
  }
  // Case 2: Handles string 'Text'
  if (typeof tElement === 'string') {
      return tElement;
  }
  // **** 추가된 Case 3: Handles number type ****
  if (typeof tElement === 'number') {
      return String(tElement); // 숫자를 문자열로 변환하여 반환
  }
  // **** 추가된 Case 4: Handles boolean type (필요 시) ****
  if (typeof tElement === 'boolean') {
      return String(tElement); // 불리언을 문자열로 변환
  }

  console.warn(`[getTextFromTElement] 예상치 못한 타입의 입력값: ${typeof tElement}`, tElement); // 디버깅용 로그
  return ""; // 그 외 경우는 빈 문자열 반환
}

// 단락 속성(<w:pPr>) 객체 처리 함수
function processParagraphProperties(pPrElement: any): ParagraphProperties {
  const properties: ParagraphProperties = {};
  if (typeof pPrElement !== 'object' || pPrElement === null) return properties;

  const keys = Object.keys(pPrElement); // 속성 객체의 키들 (예: 'w:spacing', 'w:jc')

  for (const key of keys) {
    if (WHITELISTED_PARA_PROPS.includes(key)) { // 화이트리스트 확인
      const prop = pPrElement[key]; // 해당 속성 값 (객체 또는 배열일 수 있음)
      const propObj = Array.isArray(prop) ? prop[0] : prop; // 실제 속성 객체 (배열인 경우 첫 번째 요소 사용)

      if (key === 'w:jc' && propObj?.['w:val']) {
        properties.justification = propObj['w:val'];
      } else if (key === 'w:spacing' && propObj) {
        properties.spacing = {
          after: propObj['w:after'], // 숫자나 문자열일 수 있음
          line: propObj['w:line'],
          lineRule: propObj['w:lineRule']
        };
      }
      // <w:rPr> (단락 기본 런 속성) 처리 로직 추가 가능
    }
  }
  return properties;
}

// 텍스트 런 속성(<w:rPr>) 객체 처리 함수
function processRunProperties(rPrElement: any): TextRunProperties {
  const properties: TextRunProperties = {};
  if (typeof rPrElement !== 'object' || rPrElement === null) return properties;

  const keys = Object.keys(rPrElement); // 속성 객체의 키들 (예: 'w:b', 'w:sz')

  for (const key of keys) {
    if (WHITELISTED_RUN_PROPS.includes(key)) { // 화이트리스트 확인
      const prop = rPrElement[key];
      const propObj = Array.isArray(prop) ? prop[0] : prop; // 실제 속성 객체

      if (key === 'w:b') properties.bold = true; // <w:b/> 태그 존재 여부로 판단
      else if (key === 'w:i') properties.italic = true; // <w:i/> 태그 존재 여부로 판단
      else if (key === 'w:u' && propObj?.['w:val']) properties.underline = propObj['w:val'];
      else if (key === 'w:sz' && propObj?.['w:val']) properties.fontSize = String(propObj['w:val']); // 값 가져오고 문자열로 변환
      else if (key === 'w:color' && propObj?.['w:val']) properties.color = propObj['w:val'];
      else if (key === 'w:rFonts' && propObj?.['w:hint']) properties.fontHint = propObj['w:hint'];
      // 기타 필요한 속성 처리 추가
    }
  }
  return properties;
}

// 텍스트 런(<w:r>) 객체 처리 함수
function processTextRun(rElement: any, parentId: string, order: number, extraProps?: any): TextRunJson | null {
  if (typeof rElement !== 'object' || rElement === null) return null;

  const runId = generateId('r', order, parentId);
  const textRunJson: TextRunJson = {
    id: runId, type: "textRun", order: order, parentId: parentId, text: "", properties: {}
  };

  // 1. 텍스트 런 속성(<w:rPr>) 처리
  const rPr = rElement['w:rPr'];
  if (rPr) {
    textRunJson.properties = processRunProperties(Array.isArray(rPr) ? rPr[0] : rPr);
  }

  // 2. 텍스트 내용(<w:t>) 처리
  const t = rElement['w:t'];
  if (t) {
    const tElements = Array.isArray(t) ? t : [t]; // 항상 배열로 처리
    tElements.forEach(tElem => {
      textRunJson.text += getTextFromTElement(tElem);
    });
  }

  // 3. 줄바꿈(<w:br>) 처리
  const br = rElement['w:br'];
  if (br) {
    textRunJson.text += '\n'; // 텍스트 끝에 줄바꿈 문자 추가
  }

  // 4. 기타 요소 (<w:tab> 등) 처리 필요 시 추가

  // 5. 추가 속성 (예: 하이퍼링크 정보) 병합
  if (extraProps) {
    textRunJson.properties = { ...textRunJson.properties, ...extraProps };
  }

  // 내용이 없는 런은 제외할 수 있음 (예: 스타일만 있는 빈 <w:r></w:r>)
  // if (!textRunJson.text.trim() && textRunJson.text !== '\n') return null;

  return textRunJson;
}

// 단락(<w:p>) 객체 처리 함수
function processParagraph(pElement: any, parentId?: string): ParagraphJson | null {
  if (typeof pElement !== 'object' || pElement === null) return null;

  globalOrderCounter++;
  // ID 추출 (XML 속성으로 접근)
  const paraId = pElement['w14:paraId'] || generateId('p', globalOrderCounter, parentId);

  const paragraphJson: ParagraphJson = {
    id: paraId, type: "paragraph", order: globalOrderCounter, runs: [], properties: {}
  };
  if (parentId) paragraphJson.parentId = parentId;

  // 1. 단락 속성(<w:pPr>) 처리
  const pPr = pElement['w:pPr'];
  if (pPr) {
    paragraphJson.properties = processParagraphProperties(Array.isArray(pPr) ? pPr[0] : pPr);
  }

  // 2. 자식 요소들(<w:r>, <w:hyperlink> 등) 처리
  const childKeys = Object.keys(pElement); // <w:p> 내부의 모든 키 가져오기
  let runOrder = 0;

  // 참고: Object.keys()는 요소 순서를 보장하지 않음. 순서가 중요하다면 파서의 preserveOrder 옵션 고려 필요.
  // 여기서는 각 타입별로 순회
  ['w:r', 'w:hyperlink'].forEach(key => { // 처리할 자식 요소 키 순서 지정 가능
      const children = pElement[key];
      if (children) {
          const elements = Array.isArray(children) ? children : [children]; // 항상 배열로

          elements.forEach(child => {
              if (key === 'w:r') {
                  runOrder++;
                  const runJson = processTextRun(child, paraId, runOrder);
                  if (runJson) paragraphJson.runs.push(runJson);
              } else if (key === 'w:hyperlink') {
                  const linkRuns = child['w:r']; // 하이퍼링크 내부의 <w:r>
                  if (linkRuns) {
                      const linkRunElements = Array.isArray(linkRuns) ? linkRuns : [linkRuns];
                      linkRunElements.forEach(linkRun => {
                          runOrder++;
                          const runJson = processTextRun(linkRun, paraId, runOrder, { isLink: true, linkId: child['r:id'] });
                          if (runJson) paragraphJson.runs.push(runJson);
                      });
                  }
              }
          });
      }
  });
  // <w:proofErr> 등 다른 자식 요소 처리 필요 시 여기에 추가

  return paragraphJson;
}

// 테이블 셀(<w:tc>) 객체 처리 함수
function processTableCell(tcElement: any, parentId: string, order: number): TableCellJson | null {
  if (typeof tcElement !== 'object' || tcElement === null) return null;
  const cellId = generateId('tc', order, parentId);
  const cellJson: TableCellJson = {
    id: cellId, type: "tableCell", order, parentId, content: []
  };

  // 셀 속성(<w:tcPr>) 처리 로직 추가 가능

  // 셀 내부 콘텐츠 처리 (<w:p>, <w:tbl> 등)
  const childKeys = Object.keys(tcElement);
  childKeys.forEach(key => {
      const children = tcElement[key];
      if (children){
           const elements = Array.isArray(children) ? children : [children];
           elements.forEach(element => {
                if (key === 'w:p'){
                    const paragraph = processParagraph(element, cellId); // 셀 ID를 부모로 전달
                    if (paragraph) cellJson.content.push(paragraph);
                } else if (key === 'w:tbl') {
                    const table = processTable(element, cellId); // 셀 안에 중첩된 테이블 처리
                     if (table) cellJson.content.push(table);
                }
                // 기타 셀 내부 요소 처리
           });
      }
  });

  return cellJson;
}

// 테이블 행(<w:tr>) 객체 처리 함수
function processTableRow(trElement: any, parentId: string, order: number): TableRowJson | null {
  if (typeof trElement !== 'object' || trElement === null) return null;
  const rowId = generateId('tr', order, parentId);
  const rowJson: TableRowJson = {
    id: rowId, type: "tableRow", order, parentId, cells: []
  };

  // 행 속성(<w:trPr>) 처리 로직 추가 가능

  const tcElements = trElement['w:tc']; // 테이블 셀 요소들
  if (tcElements) {
    const cells = Array.isArray(tcElements) ? tcElements : [tcElements];
    cells.forEach((tc, index) => {
      const cellJson = processTableCell(tc, rowId, index + 1); // 행 ID를 부모로 전달
      if (cellJson) rowJson.cells.push(cellJson);
    });
  }
  return rowJson;
}

// 테이블(<w:tbl>) 객체 처리 함수
function processTable(tblElement: any, parentId?: string): TableJson | null {
  if (typeof tblElement !== 'object' || tblElement === null) return null;
  globalOrderCounter++;
  const tableId = generateId('tbl', globalOrderCounter, parentId);

  const tableJson: TableJson = {
    id: tableId, type: "table", order: globalOrderCounter, rows: []
  };
  if (parentId) tableJson.parentId = parentId;

  // 테이블 속성(<w:tblPr>, <w:tblGrid>) 처리 로직 추가 가능

  const trElements = tblElement['w:tr']; // 테이블 행 요소들
  if (trElements) {
    const rows = Array.isArray(trElements) ? trElements : [trElements];
    rows.forEach((tr, index) => {
      const rowJson = processTableRow(tr, tableId, index + 1); // 테이블 ID를 부모로 전달
      if (rowJson) tableJson.rows.push(rowJson);
    });
  }
  return tableJson;
}

// 메인 변환 함수
export function convertOoxmlToJson(xmlString: string): DocumentJson {
  const parser = new XMLParser({
    ignoreAttributes: false,    // 속성 유지
    attributeNamePrefix: "",    // 속성 이름 접두사 없음
    removeNSPrefix: false,      // 네임스페이스 접두사 ('w:') 유지
    parseTagValue: true,        // 태그 값 파싱 시도
    parseAttributeValue: true,  // 속성 값 파싱 시도
    textNodeName: "#text",      // 텍스트 노드 이름 지정
    isArray: (name, jpath, isLeafNode, isAttribute) => { // 항상 배열로 처리할 태그 목록
        return ['w:document', 'w:body', 'w:p', 'w:r', 'w:tbl', 'w:tr', 'w:tc', 'w:hyperlink', 'w:proofErr'].includes(name);
    },
    // stopNodes: ["*.ignore"], // 특정 노드 파싱 중지 (필요시 사용)
    // parseBooleanAttributes: true, // 불리언 속성 파싱 (기본값 true일 수 있음)
  });

  let parsedXml;
  try {
    parsedXml = parser.parse(xmlString);
    console.log("--- XML 파싱 성공 ---");
  } catch (parseError) {
    console.error("!!! XML 파싱 중 오류 발생 !!!", parseError);
    return { blocks: [] };
  }

  const documentJson: DocumentJson = { blocks: [] };
  globalOrderCounter = 0; // 실행 시마다 순서 카운터 초기화

  const docElement = parsedXml?.['w:document']?.[0];
  if (!docElement) {
    console.error("오류: 파싱된 결과에서 <w:document> 요소를 찾을 수 없습니다.");
    return documentJson;
  }

  const body = docElement?.['w:body']?.[0];
  if (!body) {
    console.error("오류: <w:document> 요소는 찾았으나 <w:body> 요소를 찾을 수 없습니다.");
    return documentJson;
  }

  console.log("<w:body> 객체 키:", Object.keys(body));

  // body 객체의 키들을 순회하며 처리
  const potentialChildrenKeys = Object.keys(body);
  if (potentialChildrenKeys.length > 0) {
    console.log(`<w:body> 내부 요소 처리 시작...`);

    // body 내부의 키 ('w:p', 'w:tbl' 등)를 기반으로 순회
    potentialChildrenKeys.forEach(key => {
      const elements = body[key]; // 해당 키의 요소(들)

      if (Array.isArray(elements)) { // isArray 옵션으로 항상 배열일 것으로 기대
        if (key === 'w:p') {
          elements.forEach((pElement: any) => {
            // console.log(`처리 중인 요소: w:p`); // 로그 상세화 필요 시 주석 해제
            const paragraph = processParagraph(pElement, undefined);
            if (paragraph) {
              documentJson.blocks.push(paragraph);
              // console.log(`  - 단락(w:p) 추가됨: ${paragraph.id}`);
            } else {
              // console.warn(`  - 단락(w:p) 처리 결과가 null입니다. Element:`, JSON.stringify(pElement).substring(0, 200)); // 문제 요소 확인 로그
            }
          });
        } else if (key === 'w:tbl') {
          elements.forEach((tblElement: any) => {
            // console.log(`처리 중인 요소: w:tbl`);
            const table = processTable(tblElement, undefined);
            if (table) {
              documentJson.blocks.push(table);
              // console.log(`  - 테이블(w:tbl) 추가됨: ${table.id}`);
            } else {
              // console.warn(`  - 테이블(w:tbl) 처리 결과가 null입니다.`);
            }
          });
        } else if (key === 'w:sectPr') {
            console.log(`  - 섹션 속성(w:sectPr)은 현재 처리 로직에서 건너뜁니다.`);
        } else if (key.startsWith('w:')) { // 기타 WordprocessingML 요소
            console.log(`  - 처리되지 않은 요소 타입 (body 자식): ${key}`);
        }
        // XML 속성 등 기타 키는 무시
      } else {
         console.warn(`경고: <w:body>의 키 '${key}'에 해당하는 값이 배열이 아닙니다. 무시합니다.`);
      }
    });
  } else {
    console.warn("경고: <w:body> 요소 내부에 처리할 자식 요소 키가 없습니다.");
  }

  console.log(`최종 블록 개수: ${documentJson.blocks.length}`);
  return documentJson;
}