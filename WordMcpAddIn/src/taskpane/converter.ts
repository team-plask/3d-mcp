import * as shortid from 'shortid';

// 추적할 요소와 속성 정의
const TRACKED_ELEMENTS = {
  "paragraph": ["w:p", "w:pPr", "w:jc", "w:spacing", "w:ind", "w:rPr"],
  "run": ["w:r", "w:rPr", "w:t", "w:b", "w:i", "w:u", "w:color", "w:sz", "w:szCs", "w:noProof", "w:rFonts", "w:lang"],
  "table": ["w:tbl", "w:tblPr", "w:tblGrid", "w:gridCol", "w:tr", "w:tc", "w:tcPr", "w:tcW"],
  "drawing": ["w:drawing", "wp:inline", "wp:extent", "wp:docPr", "a:graphic", "a:graphicData", "pic:pic", "pic:blipFill", "pic:spPr", "a:blip", "a:xfrm", "a:prstGeom"]
};

// XML 태그 매핑
const TAG_TYPE_MAP = {
  "w:p": "paragraph",
  "w:r": "run",
  "w:tbl": "table",
  "w:drawing": "drawing"
};

// 콘텐츠 컨트롤 적용 대상 요소
const CONTENT_CONTROL_ELEMENTS = ["paragraph", "run", "table", "drawing"];

/**
 * 문서 XML을 파싱하고 JSON 구조로 변환
 * @param xmlString OOXML 문서 문자열
 * @param contentControlAppearance Content Control 표시 유형 ('BoundingBox', 'Tags', 'Hidden')
 * @returns 변환 결과 (XML 및 JSON)
 */
export function processDocument(
  xmlString: string
): any {
  // XML 파싱
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  console.log("docuemntElement", xmlDoc.documentElement);
  
  // 결과를 저장할 JSON 객체
  const resultJson = {};
  
  // 이미 처리된 요소 추적 (ID 저장)
  const processedElements = new WeakMap<Element, string>();
  
  // 처리할 요소 목록 (순서 보존을 위해)
  const elementsToProcess: {element: Element, type: string}[] = [];
  
  // 1단계: 문서 내 모든 처리 대상 요소 찾기 (순서 보존)
  collectElementsInOrder(xmlDoc.documentElement, elementsToProcess);
  
  // 2단계: 모든 요소 처리 (ID 생성 및 정보 추출)
  processElementsWithoutWrapping(elementsToProcess, resultJson, processedElements);
  
  // 3단계: Content Control 적용 (별도 단계로 분리하여 순서 변경 최소화)
  applyContentControls(processedElements, elementsToProcess);
  

  // ContentControl이 적용된 XML 생성
  const serializer = new XMLSerializer();
  const processedXml = serializer.serializeToString(xmlDoc);
  
  return {
    json: resultJson,
    xml: processedXml
  };
}

/**
 * 문서 내 처리 대상 요소를 순서대로 수집 (개선된 버전)
 * @param node 시작 노드
 * @param elementsToProcess 수집된 요소 목록
 */
function collectElementsInOrder(node: Node, elementsToProcess: {element: Element, type: string}[]): void {
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;
    const nodeName = element.nodeName;
    const elementType = TAG_TYPE_MAP[nodeName];
    
    // 대상 요소인 경우 목록에 추가 (모든 대상 요소 수집)
    if (elementType && CONTENT_CONTROL_ELEMENTS.includes(elementType)) {
      elementsToProcess.push({ element, type: elementType });
    }
    
    // 자식 노드 순회 (깊이 우선)
    for (let i = 0; i < node.childNodes.length; i++) {
      collectElementsInOrder(node.childNodes[i], elementsToProcess);
    }
  }
}


/**
 * 요소 정보 추출 및 JSON 생성 (Content Control 적용 없이)
 * @param elementsToProcess 처리할 요소 목록
 * @param resultJson 결과 JSON 객체
 * @param processedElements 처리된 요소 맵
 */
function processElementsWithoutWrapping(
  elementsToProcess: {element: Element, type: string}[],
  resultJson: any,
  processedElements: WeakMap<Element, string>
): void {
  // 먼저 문단, 테이블, 그림 요소 처리
  for (const { element, type } of elementsToProcess) {
    if (processedElements.has(element)) continue;
    
    if (type === "paragraph") {
      processParagraphInfo(element, resultJson, processedElements);
    } else if (type === "table") {
      processTableInfo(element, resultJson, processedElements);
    } else if (type === "drawing") {
      processDrawingInfo(element, resultJson, processedElements);
    }
  }
  
  // 그 다음 run 요소 처리
  for (const { element, type } of elementsToProcess) {
    if (type === "run" && !processedElements.has(element)) {
      processRunInfo(element, resultJson, processedElements);
    }
  }
  
  // 부모-자식 관계 설정 (별도 단계로 분리)
  setupParentChildRelationships(elementsToProcess, resultJson, processedElements);
}

/**
 * 문단 정보 추출 (Content Control 적용 없이)
 * @param paragraph 문단 요소
 * @param resultJson 결과 JSON 객체
 * @param processedElements 처리된 요소 맵
 * @returns 문단 ID
 */
function processParagraphInfo(paragraph: Element, resultJson: any, processedElements: WeakMap<Element, string>): string {
  // 이미 처리된 요소인지 확인
  if (processedElements.has(paragraph)) {
    return processedElements.get(paragraph);
  }
  
  // 문단 ID 생성
  const paragraphId = `p_${shortid.generate()}`;
  
  // 맵에 요소와 ID 등록
  processedElements.set(paragraph, paragraphId);
  
  // 문단 정보 추출
  const paragraphInfo = extractElementInfo(paragraph, "paragraph");
  
  // JSON에 문단 정보 추가
  resultJson[paragraphId] = {
    type: "paragraph",
    attributes: paragraphInfo
  };
  
  return paragraphId;
}

/**
 * Run 정보 추출 (Content Control 적용 없이)
 * @param run Run 요소
 * @param resultJson 결과 JSON 객체
 * @param processedElements 처리된 요소 맵
 * @returns Run ID
 */
function processRunInfo(run: Element, resultJson: any, processedElements: WeakMap<Element, string>): string {
  // 이미 처리된 요소인지 확인
  if (processedElements.has(run)) {
    return processedElements.get(run);
  }
  
  // Run ID 생성
  const runId = `r_${shortid.generate()}`;
  
  // 맵에 요소와 ID 등록
  processedElements.set(run, runId);
  
  // Run 정보 추출
  const runInfo = extractElementInfo(run, "run");
  
  // JSON에 Run 정보 추가
  resultJson[runId] = {
    type: "run",
    attributes: runInfo
  };
  
  return runId;
}

/**
 * 테이블 정보 추출 (Content Control 적용 없이)
 * @param table 테이블 요소
 * @param resultJson 결과 JSON 객체
 * @param processedElements 처리된 요소 맵
 * @returns 테이블 ID
 */
function processTableInfo(table: Element, resultJson: any, processedElements: WeakMap<Element, string>): string {
  // 이미 처리된 요소인지 확인
  if (processedElements.has(table)) {
    return processedElements.get(table);
  }
  
  // 테이블 ID 생성
  const tableId = `t_${shortid.generate()}`;
  
  // 맵에 요소와 ID 등록
  processedElements.set(table, tableId);
  
  // 테이블 정보 추출
  const tableInfo = extractElementInfo(table, "table");
  
  // 테이블 내 셀의 텍스트 정보 추출 (간소화된 참조용)
  const cells = table.getElementsByTagName("w:tc");
  let cellTextContent = "";
  for (let i = 0; i < cells.length; i++) {
    const cellText = cells[i].textContent;
    if (cellText) {
      cellTextContent += cellText;
    }
  }
  
  if (tableInfo["w:tc"] === true) {
    tableInfo["w:tc"] = cellTextContent;
  }
  
  // JSON에 테이블 정보 추가
  resultJson[tableId] = {
    type: "table",
    attributes: tableInfo
  };
  
  return tableId;
}

/**
 * 그림 정보 추출 (Content Control 적용 없이)
 * @param drawing 그림 요소
 * @param resultJson 결과 JSON 객체
 * @param processedElements 처리된 요소 맵
 * @returns 그림 ID
 */
function processDrawingInfo(drawing: Element, resultJson: any, processedElements: WeakMap<Element, string>): string {
  // 이미 처리된 요소인지 확인
  if (processedElements.has(drawing)) {
    return processedElements.get(drawing);
  }
  
  // 그림 ID 생성
  const drawingId = `d_${shortid.generate()}`;
  
  // 맵에 요소와 ID 등록
  processedElements.set(drawing, drawingId);
  
  // 그림 정보 추출
  const drawingInfo = extractElementInfo(drawing, "drawing");
  
  // JSON에 그림 정보 추가
  resultJson[drawingId] = {
    type: "drawing",
    attributes: drawingInfo
  };
  
  return drawingId;
}

/**
 * 부모-자식 관계 설정 및 중복 요소 제거
 * @param elementsToProcess 처리할 요소 목록
 * @param resultJson 결과 JSON 객체
 * @param processedElements 처리된 요소 맵
 */
function setupParentChildRelationships(
  elementsToProcess: {element: Element, type: string}[],
  resultJson: any,
  processedElements: WeakMap<Element, string>
): void {
  // 삭제할 요소 ID 목록 (부모 요소에 포함된 자식 요소)
  const idsToRemove: string[] = [];
  
  // 부모-자식 관계 설정
  for (const { element, type } of elementsToProcess) {
    if (type === "paragraph") {
      const paragraphId = processedElements.get(element);
      
      // 문단 내 run 요소 처리
      const runs = element.getElementsByTagName("w:r");
      for (let i = 0; i < runs.length; i++) {
        const run = runs[i];
        if (processedElements.has(run)) {
          const runId = processedElements.get(run);
          
          // 문단 객체에 run 참조 추가 (중복 없이)
          if (runId && !resultJson[paragraphId][runId] && resultJson[runId]) {
            resultJson[paragraphId][runId] = resultJson[runId];
            
            // 삭제 목록에 추가
            idsToRemove.push(runId);
          }
        }
      }
    } else if (type === "table") {
      const tableId = processedElements.get(element);
      
      // 테이블 내 셀의 문단 참조 추가
      const cells = element.getElementsByTagName("w:tc");
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const paragraphs = cell.getElementsByTagName("w:p");
        
        for (let j = 0; j < paragraphs.length; j++) {
          const paragraph = paragraphs[j];
          if (processedElements.has(paragraph)) {
            const paraId = processedElements.get(paragraph);
            
            // 테이블 객체에 문단 참조 추가 (중복 없이)
            if (paraId && !resultJson[tableId][paraId] && resultJson[paraId]) {
              resultJson[tableId][paraId] = resultJson[paraId];
              
              // 삭제 목록에 추가
              idsToRemove.push(paraId);
            }
          }
        }
      }
    }
  }
  
  // 부모에 포함된 자식 요소들을 최상위 JSON에서 제거
  for (const idToRemove of idsToRemove) {
    delete resultJson[idToRemove];
  }
}

/**
 * 모든 요소에 Content Control 적용 (하위 요소 포함)
 * @param processedElements 처리된 요소 맵
 * @param elementsToProcess 처리할 요소 목록 (순서 유지)
 */
function applyContentControls(
  processedElements: WeakMap<Element, string>,
  elementsToProcess: {element: Element, type: string}[],
): void {
  // 처리 순서 유지를 위해 깊이가 깊은 요소부터 처리 (하위 요소 먼저)
  // 이렇게 하면 상위 요소를 감쌀 때 이미 감싸진 하위 요소가 올바르게 포함됨
  const elementsToProcessSorted = [...elementsToProcess].sort((a, b) => {
    // getDepth 함수로 XML 트리에서의 깊이 계산
    return getElementDepth(b.element) - getElementDepth(a.element);
  });
  
  // 수집된 요소 목록을 순회하며 Content Control 적용 (깊이 우선)
  for (const { element, type } of elementsToProcessSorted) {
    if (processedElements.has(element)) {
      const id = processedElements.get(element);
      wrapWithContentControl(element, id, type);
    }
  }
}

/**
 * 요소의 DOM 트리 깊이 계산
 * @param element 대상 요소
 * @returns 깊이 값
 */
function getElementDepth(element: Element): number {
  let depth = 0;
  let parent = element.parentNode;
  
  while (parent && parent.nodeType === Node.ELEMENT_NODE) {
    depth++;
    parent = parent.parentNode;
  }
  
  return depth;
}

/**
 * 요소 정보 추출
 * @param element XML 요소
 * @param elementType 요소 유형
 * @returns 추출된 요소 정보
 */
function extractElementInfo(element: Element, elementType: string): any {
  const result: any = {};
  
  // 추적할 속성 및 하위 요소 목록
  const trackedProps = TRACKED_ELEMENTS[elementType] || [];
  
  // 요소 자체 속성 추출
  if (element.attributes) {
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      result[attr.name] = attr.value;
    }
  }
  
  // 추적할 하위 요소 및 속성 추출
  extractTrackedElements(element, trackedProps, result);
  
  // 텍스트 콘텐츠 추출 (run 요소일 경우)
  if (elementType === "run") {
    const textNodes = element.getElementsByTagName("w:t");
    if (textNodes.length > 0) {
      result.text = textNodes[0].textContent || "";
    }
  }
  
  return result;
}

/**
 * 추적할 하위 요소 및 속성 추출
 * @param element XML 요소
 * @param trackedProps 추적할 속성 목록
 * @param result 결과 객체
 */
function extractTrackedElements(element: Element, trackedProps: string[], result: any): void {
  for (const propName of trackedProps) {
    // 전체 문서가 아닌 현재 요소 내에서만 검색 (중첩 처리 방지)
    const propElements = Array.from(element.childNodes).filter(
      node => node.nodeType === Node.ELEMENT_NODE && (node as Element).nodeName === propName
    ) as Element[];
    
    if (propElements.length > 0) {
      const propElement = propElements[0];
      
      // 속성 값 추출
      const propInfo: any = {};
      
      if (propElement.attributes) {
        for (let i = 0; i < propElement.attributes.length; i++) {
          const attr = propElement.attributes[i];
          propInfo[attr.name] = attr.value;
        }
      }
      
      // 특별한 처리: w:t와 text 속성의 중복 해결
      if (propName === "w:t") {
        if (Object.keys(propInfo).length > 0) {
          // w:t 요소에 속성이 있는 경우만 저장
          result[propName] = propInfo;
        }
        // 텍스트 내용은 별도의 text 속성으로 저장
        continue;
      }
      
      // 결과에 추가
      if (Object.keys(propInfo).length > 0) {
        result[propName] = propInfo;
      } else if (propElement.textContent && propName !== "w:t") {
        // 텍스트 내용이 있는 경우 (w:t 제외)
        result[propName] = propElement.textContent;
      } else {
        // 속성 없이 요소만 있는 경우
        result[propName] = true;
      }
    }
  }
}

/**
 * 요소를 ContentControl로 감싸기 (이미 감싸진 요소 체크 개선)
 * @param element XML 요소
 * @param id 요소 ID
 * @param type 요소 유형
 */
function wrapWithContentControl(
  element: Element, 
  id: string, 
  type: string, 
): void {
  // 이미 직접 ContentControl로 감싸져 있는지 확인
  let directParent = element.parentNode;
  if (directParent && directParent.nodeName === "w:sdtContent" && 
      directParent.parentNode && directParent.parentNode.nodeName === "w:sdt") {
    // 이미 직접 Content Control로 감싸져 있으면 건너뜀
    return;
  }
  
  // XML 문서에 새로운 sdt(구조화된 문서 태그) 요소 생성
  const xmlDoc = element.ownerDocument;
  
  // w:sdt 요소 생성
  const sdtElement = xmlDoc.createElement("w:sdt");
  
  // w:sdtPr (속성) 요소 생성
  const sdtPrElement = xmlDoc.createElement("w:sdtPr");
  
  // w:alias 요소 생성 (표시 이름)
  const aliasElement = xmlDoc.createElement("w:alias");
  aliasElement.setAttribute("w:val", `${type} ${id}`);
  sdtPrElement.appendChild(aliasElement);
  
  // w:tag 요소 생성 (우리의 요소 ID)
  const tagElement = xmlDoc.createElement("w:tag");
  tagElement.setAttribute("w:val", id);
  sdtPrElement.appendChild(tagElement);
  
  // w:id 요소 생성 (ContentControl ID)
  const idElement = xmlDoc.createElement("w:id");
  const randomId = Math.floor(Math.random() * 1000000000); // 임의의 숫자 ID (Word 요구사항)
  idElement.setAttribute("w:val", randomId.toString());
  sdtPrElement.appendChild(idElement);
  
  // w:sdtContent 요소 생성 (콘텐츠 컨테이너)
  const sdtContentElement = xmlDoc.createElement("w:sdtContent");
  
  // 요소의 부모 노드 가져오기
  const parentNode = element.parentNode;
  
  // 부모 노드가 null이 아니면 요소를 ContentControl로 교체
  if (parentNode) {
    // 원래 위치 기억
    const nextSibling = element.nextSibling;
    
    // 원본 요소를 sdtContent에 이동
    parentNode.removeChild(element);
    sdtContentElement.appendChild(element);
    
    // sdtPr과 sdtContent를 sdt에 추가
    sdtElement.appendChild(sdtPrElement);
    sdtElement.appendChild(sdtContentElement);
    
    // sdt를 원래 위치에 삽입
    if (nextSibling) {
      parentNode.insertBefore(sdtElement, nextSibling);
    } else {
      parentNode.appendChild(sdtElement);
    }
  }
}