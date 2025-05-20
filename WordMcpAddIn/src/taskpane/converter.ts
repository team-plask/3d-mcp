import { XMLParser, XMLBuilder, X2jOptions, XmlBuilderOptions } from 'fast-xml-parser';
import * as shortid from 'shortid';

// --- 인터페이스 정의는 원본과 동일하게 유지 ---
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

// 상수 정의
const XMLNS_W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const XMLNS_MC = 'http://schemas.openxmlformats.org/markup-compatibility/2006';
const XMLNS_CUSTOM = 'http://schemas.customns.com/wordprocessingml/2023/custom';

const MC_PREFIX = 'mc';
const CUSTOM_PREFIX = 'plask';
const W_PREFIX = 'w';

const WHITELISTED_PARA_PROPS = ['w:spacing', 'w:jc', 'w:rPr'];
const WHITELISTED_RUN_PROPS = ['w:b', 'w:i', 'w:u', 'w:sz', 'w:color', 'w:rFonts'];

// 공통 변수
let globalOrderCounter = 0;

// 파싱 및 빌드 옵션 통합 관리
const parserOptions: X2jOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: "",
  attributesGroupName: ":@",
  removeNSPrefix: false,
  parseTagValue: false,
  trimValues: false,
  textNodeName: "#text",
  isArray: (name) => {
    // 항상 배열로 처리되어야 하는 태그 목록
    const alwaysArrayTags = ['w:p', 'w:r', 'w:t', 'w:tbl', 'w:tr', 'w:tc'];
    return alwaysArrayTags.includes(name);
  },
  // 배열 처리 문제를 방지하기 위해 preserveOrder는 제거
  ignoreDeclaration: true,
  ignorePiTags: true
};

const builderOptions: XmlBuilderOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: "",
  attributesGroupName: ":@",
  format: true,
  indentBy: "  ",
  suppressEmptyNode: true,
  suppressBooleanAttributes: false,
  unpairedTags: ["w:br", "w:cr"]
};

// 유틸리티 함수들
function getTagName(element: any): string | null {
  if (!element || typeof element !== 'object') return null;
  const keys = Object.keys(element);
  return keys.find(key => key !== ':@' && key !== '#text') || null;
}

function getAttributes(element: any): Record<string, any> {
  if (!element || typeof element !== 'object') return {};
  return element[':@'] || {};
}

function getText(element: any): string {
  if (!element || typeof element !== 'object') return '';
  return element['#text'] || '';
}

function getElements(parent: any, tagName: string): any[] {
  if (!parent || typeof parent !== 'object') return [];
  
  const result = parent[tagName];
  if (Array.isArray(result)) return result;
  return result ? [result] : [];
}

function extractOrGenerateId(element: any, prefix: string = ''): string {
  const attrs = getAttributes(element);
  
  // 기존 custom:id가 있는 경우 사용
  if (attrs[`${CUSTOM_PREFIX}:id`]) {
    return attrs[`${CUSTOM_PREFIX}:id`];
  }
  
  // w14:paraId와 같은 기존 ID 사용
  if (attrs['w14:paraId']) {
    return attrs['w14:paraId'];
  }
  
  // 새 ID 생성
  return prefix + shortid.generate();
}

function addOrUpdateAttribute(element: any, attrName: string, attrValue: string): void {
  if (!element) return;
  
  if (!element[':@']) {
    element[':@'] = {};
  }
  
  element[':@'][attrName] = attrValue;
}

function ensureNamespaces(docElement: any): void {
  if (!docElement) return;
  
  const attributes = getAttributes(docElement);
  
  // 필수 네임스페이스 추가
  attributes['xmlns:w'] = attributes['xmlns:w'] || XMLNS_W;
  attributes['xmlns:mc'] = XMLNS_MC;
  attributes['xmlns:plask'] = XMLNS_CUSTOM;
  
  // Ignorable 속성 추가/업데이트
  if (attributes[`${MC_PREFIX}:Ignorable`]) {
    if (!attributes[`${MC_PREFIX}:Ignorable`].includes(CUSTOM_PREFIX)) {
      attributes[`${MC_PREFIX}:Ignorable`] += ` ${CUSTOM_PREFIX}`;
    }
  } else {
    attributes[`${MC_PREFIX}:Ignorable`] = CUSTOM_PREFIX;
  }
  
  // 속성 업데이트
  docElement[':@'] = attributes;
}

// 처리 함수들
function processRunProperties(rPrElement: any): TextRunProperties {
  const properties: TextRunProperties = {};
  if (!rPrElement) return properties;
  
  // 볼드
  const boldElements = getElements(rPrElement, 'w:b');
  if (boldElements.length > 0) {
    const boldAttrs = getAttributes(boldElements[0]);
    properties.bold = boldAttrs['w:val'] !== '0';
  }
  
  // 이탤릭
  const italicElements = getElements(rPrElement, 'w:i');
  if (italicElements.length > 0) {
    const italicAttrs = getAttributes(italicElements[0]);
    properties.italic = italicAttrs['w:val'] !== '0';
  }
  
  // 언더라인
  const underlineElements = getElements(rPrElement, 'w:u');
  if (underlineElements.length > 0) {
    const underlineAttrs = getAttributes(underlineElements[0]);
    properties.underline = underlineAttrs['w:val'];
  }
  
  // 폰트 크기
  const sizeElements = getElements(rPrElement, 'w:sz');
  if (sizeElements.length > 0) {
    const sizeAttrs = getAttributes(sizeElements[0]);
    properties.fontSize = sizeAttrs['w:val'];
  }
  
  // 색상
  const colorElements = getElements(rPrElement, 'w:color');
  if (colorElements.length > 0) {
    const colorAttrs = getAttributes(colorElements[0]);
    properties.color = colorAttrs['w:val'];
  }
  
  // 폰트 힌트
  const fontElements = getElements(rPrElement, 'w:rFonts');
  if (fontElements.length > 0) {
    const fontAttrs = getAttributes(fontElements[0]);
    properties.fontHint = fontAttrs['w:hint'];
  }
  
  return properties;
}

function processParagraphProperties(pPrElement: any): ParagraphProperties {
  const properties: ParagraphProperties = {};
  if (!pPrElement) return properties;
  
  // 정렬
  const jcElements = getElements(pPrElement, 'w:jc');
  if (jcElements.length > 0) {
    const jcAttrs = getAttributes(jcElements[0]);
    properties.justification = jcAttrs['w:val'];
  }
  
  // 간격
  const spacingElements = getElements(pPrElement, 'w:spacing');
  if (spacingElements.length > 0) {
    const spacingAttrs = getAttributes(spacingElements[0]);
    properties.spacing = {
      after: spacingAttrs['w:after'],
      line: spacingAttrs['w:line'],
      lineRule: spacingAttrs['w:lineRule']
    };
  }
  
  return properties;
}

function processTextRun(rElement: any, paragraphId: string, order: number): { runId: string, run: TextRunJson } | null {
  if (!rElement) return null;
  
  // ID 추출 또는 생성
  const runId = extractOrGenerateId(rElement, 'r_');
  
  // ID 주입
  addOrUpdateAttribute(rElement, `${CUSTOM_PREFIX}:id`, runId);
  
  const runJson: TextRunJson = {
    type: "textRun",
    order,
    parentId: paragraphId,
    text: "",
    properties: {},
    xmlId: runId
  };
  
  // 속성 처리
  const rPrElements = getElements(rElement, 'w:rPr');
  if (rPrElements.length > 0) {
    runJson.properties = processRunProperties(rPrElements[0]);
  }
  
  // 텍스트 추출
  const tElements = getElements(rElement, 'w:t');
  if (tElements.length > 0) {
    runJson.text = getText(tElements[0]);
  }
  
  // 줄바꿈 처리
  const brElements = getElements(rElement, 'w:br');
  if (brElements.length > 0) {
    runJson.text += '\n';
  }
  
  return { runId, run: runJson };
}

function processParagraph(pElement: any, parentId?: string): { [id: string]: ParagraphJson } | null {
  if (!pElement) return null;
  
  globalOrderCounter++;
  const paraId = extractOrGenerateId(pElement, 'p_');
  
  // ID 주입
  addOrUpdateAttribute(pElement, `${CUSTOM_PREFIX}:id`, paraId);
  
  const paraJson: ParagraphJson = {
    type: "paragraph",
    order: globalOrderCounter,
    properties: {},
    xmlId: paraId
  };
  
  if (parentId) {
    paraJson.parentId = parentId;
  }
  
  // 속성 처리
  const pPrElements = getElements(pElement, 'w:pPr');
  if (pPrElements.length > 0) {
    paraJson.properties = processParagraphProperties(pPrElements[0]);
  }
  
  // 텍스트 실행 처리
  let runOrder = 0;
  const rElements = getElements(pElement, 'w:r');
  for (const rElement of rElements) {
    runOrder++;
    const runResult = processTextRun(rElement, paraId, runOrder);
    if (runResult) {
      paraJson[runResult.runId] = runResult.run;
    }
  }
  
  // 하이퍼링크 처리
  const hyperlinkElements = getElements(pElement, 'w:hyperlink');
  for (const hyperlinkElement of hyperlinkElements) {
    const hyperlinkAttrs = getAttributes(hyperlinkElement);
    
    // 하이퍼링크 내 텍스트 실행 처리
    const hyperlinkRElements = getElements(hyperlinkElement, 'w:r');
    for (const rElement of hyperlinkRElements) {
      runOrder++;
      const runResult = processTextRun(rElement, paraId, runOrder);
      if (runResult) {
        const run = runResult.run;
        run.properties.isLink = true;
        run.properties.linkId = hyperlinkAttrs['r:id'];
        paraJson[runResult.runId] = run;
      }
    }
  }
  
  return { [paraId]: paraJson };
}

function processTable(tblElement: any, parentId?: string): { [id: string]: TableJson } | null {
  if (!tblElement) return null;
  
  globalOrderCounter++;
  const tableId = extractOrGenerateId(tblElement, 'tbl_');
  
  // ID 주입
  addOrUpdateAttribute(tblElement, `${CUSTOM_PREFIX}:id`, tableId);
  
  const tableJson: TableJson = {
    type: "table",
    order: globalOrderCounter,
    xmlId: tableId
  };
  
  if (parentId) {
    tableJson.parentId = parentId;
  }
  
  // 행 처리
  let rowOrder = 0;
  const trElements = getElements(tblElement, 'w:tr');
  for (const trElement of trElements) {
    rowOrder++;
    const rowId = extractOrGenerateId(trElement, 'tr_');
    
    // 행 ID 주입
    addOrUpdateAttribute(trElement, `${CUSTOM_PREFIX}:id`, rowId);
    
    const rowJson: TableRowJson = {
      type: "tableRow",
      order: rowOrder,
      parentId: tableId,
      xmlId: rowId
    };
    
    // 셀 처리
    let cellOrder = 0;
    const tcElements = getElements(trElement, 'w:tc');
    for (const tcElement of tcElements) {
      cellOrder++;
      const cellId = extractOrGenerateId(tcElement, 'tc_');
      
      // 셀 ID 주입
      addOrUpdateAttribute(tcElement, `${CUSTOM_PREFIX}:id`, cellId);
      
      const cellJson: TableCellJson = {
        type: "tableCell",
        order: cellOrder,
        parentId: rowId,
        xmlId: cellId,
        content: {}
      };
      
      // 셀 내 콘텐츠 처리
      const pElements = getElements(tcElement, 'w:p');
      for (const pElement of pElements) {
        const paragraphResult = processParagraph(pElement, cellId);
        if (paragraphResult) {
          Object.assign(cellJson.content, paragraphResult);
        }
      }
      
      // 중첩 테이블 처리
      const nestedTblElements = getElements(tcElement, 'w:tbl');
      for (const nestedTblElement of nestedTblElements) {
        const nestedTableResult = processTable(nestedTblElement, cellId);
        if (nestedTableResult) {
          Object.assign(cellJson.content, nestedTableResult);
        }
      }
      
      rowJson[cellId] = cellJson;
    }
    
    tableJson[rowId] = rowJson;
  }
  
  return { [tableId]: tableJson };
}

// 문서 XML 추출 (Flat OPC에서 document.xml 부분만 추출)
export function pickDocumentPart(flatXml: string): string {
  // 이미 document XML만 있는 경우
  if (flatXml.trim().startsWith('<w:document')) {
    return flatXml.trim();
  }
  
  // 평면 OPC 형식에서 document.xml 파트 추출
  const partRegex = /<pkg:part[^>]*pkg:name="\/word\/document\.xml"[^>]*>[\s\S]*?<\/pkg:part>/i;
  const partMatch = flatXml.match(partRegex);
  if (!partMatch) {
    throw new Error('document.xml part not found in Flat OPC');
  }
  
  // xmlData 내용 추출
  const xmlDataRegex = /<pkg:xmlData[^>]*>([\s\S]*?)<\/pkg:xmlData>/i;
  const xmlDataMatch = partMatch[0].match(xmlDataRegex);
  if (!xmlDataMatch) {
    throw new Error('pkg:xmlData section missing in document.xml part');
  }
  
  return xmlDataMatch[1].trim();
}

// XML 후처리 - 문법 오류 및 잘못된 속성 수정
function cleanupXml(xmlString: string): string {
    return xmlString
      // 숫자 태그 제거
      .replace(/<\d+\s*>/g, '')
      .replace(/<\/\d+>/g, '')
      
      // 속성 정리
      .replace(/="?\[object Object\]"?/g, '')
      .replace(/ lns:/g, ' xmlns:')
      .replace(/cucustom:id=/g, `${CUSTOM_PREFIX}:id=`)
      .replace(/stom:id=/g, `${CUSTOM_PREFIX}:id=`)
      .replace(/ :Ignorable=/g, ` ${MC_PREFIX}:Ignorable=`)
      .replace(/\s+:@(?=\s|\/|>)/g, '')
      .replace(/:@>/g, '>')
      
      // 빈 태그 정리
      .replace(/<(w:[^>]+)\s*><\/(w:[^>]+)>/g, '<$1/>')
      .replace(/<(w:[^>]+)\s*:@\s*\/>/g, '<$1/>');
  }

export function convertOoxmlToJson(documentXml: string): ConversionResult {
    const parser = new XMLParser(parserOptions);
    
    let docObj;
    try {
      docObj = parser.parse(documentXml);
    } catch (error) {
      console.error("XML 파싱 오류:", error);
      return { xml: documentXml, json: {} };
    }
    
    // w:document 요소 검색
    const documentElement = docObj['w:document'];
    if (!documentElement) {
      console.error("w:document 요소를 찾을 수 없습니다");
      return { xml: documentXml, json: {} };
    }
    
    // 네임스페이스 및 Ignorable 속성 추가
    ensureNamespaces(documentElement);
    
    // w:body 요소 검색
    const bodyElement = documentElement['w:body'];
    if (!bodyElement) {
      console.error("w:body 요소를 찾을 수 없습니다");
      return { xml: documentXml, json: {} };
    }
    
    // 문서 JSON 초기화
    const documentJson: DocumentJson = {};
    globalOrderCounter = 0;
    
    // 문단 처리
    const paragraphs = getElements(bodyElement, 'w:p');
    for (const paragraph of paragraphs) {
      const paragraphResult = processParagraph(paragraph);
      if (paragraphResult) {
        Object.assign(documentJson, paragraphResult);
      }
    }
    
    // 테이블 처리
    const tables = getElements(bodyElement, 'w:tbl');
    for (const table of tables) {
      const tableResult = processTable(table);
      if (tableResult) {
        Object.assign(documentJson, tableResult);
      }
    }
    
    // 수정된 XML 생성
    const builder = new XMLBuilder(builderOptions);
    let updatedXml = builder.build(docObj);
    
    // XML 문법 후처리
    updatedXml = cleanupXml(updatedXml);
    
    return {
      xml: updatedXml,
      json: documentJson
    };
  }

// 업데이트된 document.xml을 원래 Flat OPC에 다시 삽입
export function replaceDocumentInFlatOpc(flatOpc: string, updatedDocumentXml: string): string {
  // 이미 document XML만 있는 경우 교체할 필요 없음
  if (flatOpc.trim().startsWith('<w:document')) {
    return updatedDocumentXml;
  }
  
  // 정규식으로 document.xml 부분 찾아서 교체
  const regex = /(<pkg:part[^>]*pkg:name="\/word\/document\.xml"[^>]*>)[\s\S]*?(<pkg:xmlData[^>]*>)([\s\S]*?)(<\/pkg:xmlData>[\s\S]*?<\/pkg:part>)/i;
  
  return flatOpc.replace(regex, (match, partStart, xmlDataStart, oldContent, xmlDataEnd) => {
    return `${partStart}${xmlDataStart}${updatedDocumentXml}${xmlDataEnd}`;
  });
}

// 통합 처리 함수
export function processDocument(xmlString: string): ConversionResult {
  let documentXml;
  
  try {
    // document.xml 부분만 추출
    documentXml = pickDocumentPart(xmlString);
  } catch (error) {
    console.error("document.xml 추출 오류:", error);
    return { xml: xmlString, json: {} };
  }
  
  // OOXML을 JSON으로 변환 (ID 주입 포함)
  const { xml: updatedDocumentXml, json } = convertOoxmlToJson(documentXml);
  
  // 업데이트된 document.xml을 원래 Flat OPC에 다시 삽입
  const updatedFullXml = replaceDocumentInFlatOpc(xmlString, updatedDocumentXml);
  
  return {
    xml: updatedFullXml,
    json
  };
}

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
    suppressEmptyNode: true // 빈 태그 처리 개선
  });
  
  // XML 생성 및 문자열 후처리
  let xmlOutput = "";
  try {
    xmlOutput = builder.build(parsedXml);
    
    // 속성 문제 수정: 잘못된 속성 접두사와 [object Object] 수정
    xmlOutput = xmlOutput
        .replace(/="?\[object Object\]"?/g, '')
        .replace(/ lns:/g, ' xmlns:')
        .replace(/cucustom:id=/g, `${CUSTOM_PREFIX}:id=`) // cucustom 오타 수정
        .replace(/stom:id=/g, `${CUSTOM_PREFIX}:id=`)
        .replace(/ :Ignorable=/g, ` ${MC_PREFIX}:Ignorable=`)
        .replace(/:@>/g, '>') // :@ 제거
        .replace(/<w:[^>]+ :@><\/w:[^>]+>/g, match => { 
        // 빈 태그 정리
        const tagName = match.match(/<(w:[^> ]+)/)[1];
        return `<${tagName}/>`;
        });
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
      console.log("Updating element:", key, element);
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

export function isValidXml(xmlString: string): boolean {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      
      // 파싱 오류 확인
      const parserError = xmlDoc.querySelector("parsererror");
      if (parserError) {
        console.error("XML 파싱 오류:", parserError.textContent);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("XML 유효성 검사 오류:", error);
      return false;
    }
  }

