import * as shortid from 'shortid';
import { formatXML } from './document';
import { generateNKeysBetween } from 'fractional-indexing';
// 추적할 요소와 속성 정의
// 추적할 요소와 속성 정의 - 개선된 계층 구조
const TRACKED_ELEMENTS = {
  "paragraph": {
    // 문단 요소 자체의 추적할 속성 (비어있으면 문단 요소 속성은 추출하지 않음)
    selfAttributes: [],
    // 하위 요소 및 그 속성
    children: {
      "w:pPr": {
        selfAttributes: [], // 요소 자체 속성은 추출하지 않음
        children: {} // 하위 요소 없음
      },
      "w:jc": {
        selfAttributes: ["w:val"], // w:jc의 w:val 속성만 추출
        children: {}
      },
      "w:spacing": {
        selfAttributes: ["w:after", "w:before", "w:line", "w:lineRule"],
        children: {}
      },
      "w:ind": {
        selfAttributes: ["w:left", "w:right", "w:firstLine", "w:hanging"],
        children: {}
      },
      "w:rPr": {
        selfAttributes: [],
        children: {}
      }
    }
  },
  "run": {
    selfAttributes: [],
    children: {
      "w:rPr": {
        selfAttributes: [],
        children: {}
      },
      "w:t": {
        selfAttributes: [],
        textContent: true // 텍스트 내용 추출 플래그
      },
      "w:b": {
        selfAttributes: ["w:val"],
        children: {}
      },
      "w:i": {
        selfAttributes: ["w:val"],
        children: {}
      },
      "w:u": {
        selfAttributes: ["w:val"],
        children: {}
      },
      "w:color": {
        selfAttributes: ["w:val"],
        children: {}
      },
      "w:sz": {
        selfAttributes: ["w:val"],
        children: {}
      },
      "w:szCs": {
        selfAttributes: ["w:val"],
        children: {}
      },
      "w:noProof": {
        selfAttributes: ["w:val"],
        children: {}
      },
      "w:rFonts": {
        selfAttributes: ["w:ascii"],
        children: {}
      },
      "w:lang": {
        selfAttributes: ["w:val"],
        children: {}
      }
    }
  },
  "table": {
    selfAttributes: [],
    children: {
      "w:tblPr": {
        selfAttributes: [],
        children: {}
      },
      "w:tblGrid": {
        selfAttributes: [],
        children: {
          "w:gridCol": {
            selfAttributes: ["w:w"],
            children: {}
          }
        }
      },
      "w:tr": {
        selfAttributes: [],
        children: {
          "w:tc": {
            selfAttributes: [],
            children: {
              "w:tcPr": {
                selfAttributes: [],
                children: {
                  "w:tcW": {
                    selfAttributes: ["w:w", "w:type"],
                    children: {}
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "drawing": {
    selfAttributes: [],
    children: {
      "wp:inline": {
        selfAttributes: [],
        children: {}
      },
      "wp:extent": {
        selfAttributes: ["cx", "cy"],
        children: {}
      },
      "wp:docPr": {
        selfAttributes: ["id", "name", "descr"],
        children: {}
      },
      "a:graphic": {
        selfAttributes: [],
        children: {
          "a:graphicData": {
            selfAttributes: ["uri"],
            children: {
              "pic:pic": {
                selfAttributes: [],
                children: {
                  "pic:blipFill": {
                    selfAttributes: [],
                    children: {
                      "a:blip": {
                        selfAttributes: ["r:embed", "r:link", "cstate"],
                        children: {}
                      }
                    }
                  },
                  "pic:spPr": {
                    selfAttributes: [],
                    children: {
                      "a:xfrm": {
                        selfAttributes: [],
                        children: {}
                      },
                      "a:prstGeom": {
                        selfAttributes: ["prst"],
                        children: {}
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

// XML 태그 매핑
const TAG_TYPE_MAP = {
  "w:p": "paragraph",
  "w:r": "run",
  "w:tbl": "table",
  "w:drawing": "drawing"
};


// 이전 형식과의 호환성을 위한 태그 목록 생성 함수
function getTagsForType(elementType: string): string[] {
  const result: string[] = [];
  
  // 노드 자체 (루트 노드) 추가
  const rootNodeName = Object.keys(TAG_TYPE_MAP).find(key => TAG_TYPE_MAP[key] === elementType);
  if (rootNodeName) {
    result.push(rootNodeName);
  }
  
  // 하위 요소 재귀적으로 수집
  function collectChildTags(node: any, prefix: string = '') {
    if (!node || typeof node !== 'object') return;
    
    // children 객체가 있으면 처리
    if (node.children) {
      for (const childTag of Object.keys(node.children)) {
        result.push(childTag);
        collectChildTags(node.children[childTag], childTag);
      }
    }
  }
  
  // 해당 타입의 요소에 대한 모든 태그 수집
  const typeConfig = TRACKED_ELEMENTS[elementType];
  if (typeConfig) {
    collectChildTags(typeConfig);
  }
  
  return result;
}

// 호환성을 위한 기존 형식 유지
const TRACKED_TAGS = {
  "paragraph": getTagsForType("paragraph"),
  "run": getTagsForType("run"),
  "table": getTagsForType("table"),
  "drawing": getTagsForType("drawing")
};

// 콘텐츠 컨트롤 적용 대상 요소
const CONTENT_CONTROL_ELEMENTS = ["paragraph", "run", "table", "drawing"];

export {
  TRACKED_ELEMENTS,
  TAG_TYPE_MAP,
  CONTENT_CONTROL_ELEMENTS
}

/**
 * 문서 처리 메인 함수 - 두 단계로 분리됨:
 * 1) XML에 Content Control 적용
 * 2) Content Control 기반으로 JSON 추출
 */
export function processDocument(
  xmlString: string,
  existingJson: Record<string, any> = {}
): { json: Record<string, any>; xml: string } {
  // 1. XML 파싱
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  
  // 2. Content Control 적용
  const xmlDocWithControls = applyContentControlsToDocument(xmlDoc);
  
  // 3. 수정된 XML 문자열 생성
  const xmlSerializer = new XMLSerializer();
  const updatedXmlString = xmlSerializer.serializeToString(xmlDocWithControls);
  
  // 4. JSON 추출 (주의: updatedXmlString이 아닌 xmlDocWithControls 직접 사용)
  const resultJson = extractJsonFromContentControls(xmlDocWithControls);
  
  return {
    json: resultJson,
    xml: updatedXmlString
  };
}

// 추가: 최종 문서 XML에서 JSON 추출하는 함수 (외부에서 직접 호출 가능하도록)
export function extractFinalJson(
  xmlString: string,
  existingJson: Record<string, any> = {}
): Record<string, any> {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  return extractJsonFromContentControls(xmlDoc);
}

/**
 * 1단계: 화이트리스트에 해당하는 요소에 Content Control 적용
 */
function applyContentControlsToDocument(xmlDoc: Document): Document {
  console.log("1단계: XML에 Content Control 적용 시작");
  
  // 정규화된 Document XML 로깅 (디버깅용)
  const serializer = new XMLSerializer();
  console.log("정규화된 Document XML:", serializer.serializeToString(xmlDoc).substring(0, 100) + "...");
  
  // 이미 Content Control이 적용된 요소 추적
  const wrappedElements = new Set<Element>();
  const contentControlIds = new Map<Element, string>(); // 요소별 이미 적용된 ID 추적
  
  // 이미 존재하는 Content Control 식별 (재귀적으로 검색)
  function findWrappedElements(node: Node): void {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    
    const element = node as Element;
    
    // Content Control인 경우
    if (element.nodeName === "w:sdt") {
      // 태그 ID 가져오기
      let tagId = "";
      const tagElements = element.getElementsByTagName("w:tag");
      if (tagElements.length > 0 && tagElements[0].hasAttribute("w:val")) {
        tagId = tagElements[0].getAttribute("w:val");
      }
      
      // Content Control 내부 콘텐츠 요소 찾기
      const contentElements = element.getElementsByTagName("w:sdtContent");
      if (contentElements.length > 0) {
        // 내부의 모든 자식 요소들을 감싸진 것으로 표시
        const contentElement = contentElements[0];
        console.log(`Content Control 요소 발견: ${element.nodeName}, ID: ${tagId}`);
        // 첫 번째 직접 자식 요소부터 처리
        for (let i = 0; i < contentElement.childNodes.length; i++) {
          const child = contentElement.childNodes[i];
          if (child.nodeType === Node.ELEMENT_NODE) {
            const childElement = child as Element;
            wrappedElements.add(childElement);
            if (tagId) {
              contentControlIds.set(childElement, tagId);
              console.log(`요소 ${childElement.nodeName}는 이미 ID ${tagId}로 Content Control 적용됨`);
            }
          }
        }
      }
    }
    
    // 자식 노드에 대해 재귀 호출
    for (let i = 0; i < node.childNodes.length; i++) {
      findWrappedElements(node.childNodes[i]);
    }
  }
  
  // 문서 전체 순회하며 이미 Content Control로 감싸진 요소 찾기
  const bodyElements = xmlDoc.getElementsByTagName("w:body");
  if (bodyElements.length > 0) {
    findWrappedElements(bodyElements[0]);
  }
  
  console.log(`이미 Content Control로 감싸진 요소 수: ${wrappedElements.size}`);
  
  // 감싸진 요소의 이름과 ID 표시 (최대 10개까지)
  const wrappedElementInfo = Array.from(wrappedElements)
    .slice(0, 10)
    .map(el => {
      const id = contentControlIds.get(el) || "unknown";
      return `${el.nodeName}(${id})`;
    });
  console.log(`감싸진 요소 샘플: ${wrappedElementInfo.join(', ')}`);
  
  // 재귀적으로 상위 구조에 Content Control이 있는지 확인하는 함수
  /**
   * 요소가 Content Control 내부에 있는지 확인하는 함수 (최대 2계층까지만 확인)
   */
  function isInsideContentControl(element: Element): boolean {
    // 1단계: 직접적인 부모 확인
    let parent = element.parentNode;
    if (!parent) return false;
    
    if (parent.nodeType === Node.ELEMENT_NODE) {
      const parentElement = parent as Element;
      
      // 직접적인 부모가 Content Control인 경우
      if (parentElement.nodeName === "w:sdtContent") {
        return true;
      }
      
      // 2단계: 한 단계 더 올라가서 확인
      parent = parentElement.parentNode;
      if (parent && parent.nodeType === Node.ELEMENT_NODE) {
        const grandParentElement = parent as Element;
        
        // 한 단계 위 부모가 Content Control인 경우
        if (grandParentElement.nodeName === "w:sdt") {
          return true;
        }
      }
    }
    
    return false;
  }
  console.log("wrappedElements", wrappedElements);
  // 화이트리스트 요소 수집 (깊이 순으로 정렬)
  const elementsToWrap = collectTargetElements(xmlDoc, wrappedElements);
  
  console.log(`Content Control 적용 대상 요소 수 (초기): ${elementsToWrap.length}`);
  console.log("elementsToWrap", elementsToWrap)
  
  // 대상 요소 필터링: 이미 컨텐트 컨트롤 내부에 있는 요소 제외
  const filteredElements = elementsToWrap.filter(({element}) => {
    // 이미 직접 감싸진 요소 제외
    if (wrappedElements.has(element)) {
      return false;
    }
    
    // 상위 구조에 Content Control이 있는지 확인하여 제외
    if (isInsideContentControl(element)) {
      return false;
    }
    
    return true;
  });
  
  console.log(`필터링 후 Content Control 적용 대상 요소 수: ${filteredElements}`);
  
  // 대상 요소의 상세 정보 로깅 (최대 5개만)
  if (filteredElements.length > 0) {
    const sampleElements = filteredElements.slice(0, 5).map(({element, type, depth}) => ({
      type,
      depth,
      nodeName: element.nodeName,
      textPreview: element.textContent?.substring(0, 30).replace(/\s+/g, ' ') + (element.textContent?.length > 30 ? '...' : ''),
      attributes: Array.from(element.attributes || []).map(attr => `${attr.name}="${attr.value}"`).join(', ')
    }));
    console.log(`처리 대상 요소 샘플:`, sampleElements);
  }
  
  // 깊이가 깊은 요소부터 처리 (트리 상단부터 하면 참조가 꼬일 수 있음)
  filteredElements.sort((a, b) => b.depth - a.depth);
  
  // Content Control 적용
  for (const { element, type } of filteredElements) {
    const id = `${type.charAt(0)}_${shortid.generate()}`;
    wrapWithContentControl(element, id, type);
  }
  
  assignOrderToContentControls(xmlDoc);
  
  console.log("Content Control 적용 완료");
  
  // 업데이트된 Document XML 로깅 (디버깅용)
  console.log("업데이트된 Document XML:", serializer.serializeToString(xmlDoc).substring(0, 100) + "...");
  
  return xmlDoc;
}

function wrapWithContentControl(
  element: Element, 
  id: string, 
  type: string
): void {
  // 이미 Content Control로 감싸져 있는지 한번 더 검사
  const parent = element.parentNode;
  if (parent && parent.nodeName === "w:sdtContent") {
    console.log(`요소 ${element.nodeName}는 이미 Content Control 내부에 있어 건너뜀`);
    return;
  }
  
  // 문서 참조 가져오기
  const xmlDoc = element.ownerDocument;
  
  try {
    // 일반 요소 처리 (테이블 포함 - 컨테이너 패턴 제거)
    const sdtElement = xmlDoc.createElement("w:sdt");
    const sdtPrElement = xmlDoc.createElement("w:sdtPr");
    
    // alias 설정
    const aliasElement = xmlDoc.createElement("w:alias");
    aliasElement.setAttribute("w:val", `${type} ${id}`);
    sdtPrElement.appendChild(aliasElement);
    
    // tag 설정 (ID)
    const tagElement = xmlDoc.createElement("w:tag");
    tagElement.setAttribute("w:val", id);
    sdtPrElement.appendChild(tagElement);
    
    // Content Control ID 생성
    const idElement = xmlDoc.createElement("w:id");
    const randomId = Math.floor(Math.random() * 1000000000);
    idElement.setAttribute("w:val", randomId.toString());
    sdtPrElement.appendChild(idElement);
    
    // sdtContent 요소 생성
    const sdtContentElement = xmlDoc.createElement("w:sdtContent");
    
    // 요소 위치 정보 기억
    const originalParent = element.parentNode;
    const nextSibling = element.nextSibling;
    
    if (!originalParent) {
      console.error(`요소 ${id} (${type})에 부모 요소가 없음`);
      return;
    }
    
    // 요소를 sdtContent로 이동
    originalParent.removeChild(element);
    sdtContentElement.appendChild(element);
    
    // sdt 요소 구성
    sdtElement.appendChild(sdtPrElement);
    sdtElement.appendChild(sdtContentElement);
    
    // 원래 위치에 삽입
    if (nextSibling) {
      originalParent.insertBefore(sdtElement, nextSibling);
    } else {
      originalParent.appendChild(sdtElement);
    }
    
    // 테이블인 경우 특별 로깅
    if (element.nodeName === "w:tbl") {
      console.log(`테이블 요소 ${id}에 Content Control 직접 적용 완료`);
    } else {
      console.log(`요소 ${id} (${type})에 Content Control 적용 완료`);
    }
  } catch (error) {
    console.error(`요소 ${id} (${type})에 Content Control 적용 중 오류:`, error);
  }
}

function collectTargetElements(
  xmlDoc: Document, 
  wrappedElements: Set<Element>
): Array<{element: Element, type: string, depth: number}> {
  const targetElements: Array<{element: Element, type: string, depth: number}> = [];
  
  // 처리된 테이블 추적
  const processedTables = new Set<Element>();
  
  console.log("wrapWithContentControl: 문서에서 Content Control 적용 대상 요소 수집 시작", wrappedElements);
  // 재귀적으로 모든 요소 검사
  function examineNode(node: Node, depth: number = 0) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    
    const element = node as Element;
    const nodeName = element.nodeName;
    
    // 모든 화이트리스트 요소 처리
    if (TAG_TYPE_MAP[nodeName] && 
        CONTENT_CONTROL_ELEMENTS.includes(TAG_TYPE_MAP[nodeName])) {
      
      // 이미 Content Control로 감싸져 있지 않은 경우에만 추가
      if (!wrappedElements.has(element)) {
        console.log(`대상 요소 발견: ${nodeName}, 깊이: ${depth}, element:`, element);
        targetElements.push({
          element,
          type: TAG_TYPE_MAP[nodeName],
          depth
        });
        
        // 테이블인 경우 나중에 참조할 수 있도록 추적
        if (nodeName === "w:tbl") {
          processedTables.add(element);
          console.log("테이블 발견: ID 할당 예정");
        }
      }
    }
    
    // 자식 노드 검사 (모든 요소에 대해 재귀, 테이블도 건너뛰지 않음)
    for (let i = 0; i < node.childNodes.length; i++) {
      examineNode(node.childNodes[i], depth + 1);
    }
  }
  
  // 문서 전체 검사 시작
  const bodyElements = xmlDoc.getElementsByTagName("w:body");
  if (bodyElements.length > 0) {
    examineNode(bodyElements[0]);
  }
  
  return targetElements;
}

/**
 * 2단계: Content Control 기반으로 JSON 추출
 */
export function extractJsonFromContentControls(
  xmlDoc: Document,
  existingJson: Record<string, any> = {}
): Record<string, any> {
  console.log("2단계: Content Control 기반 JSON 추출 시작");
  
  // 결과 JSON 객체
  const resultJson: Record<string, any> = {};
  
  // Content Control 요소-ID 매핑 (계층 구조 구성용)
  const elementIdMap = new Map<Element, string>();
  const idElementMap = new Map<string, Element>();
  
  // Content Control 리스트 가져오기
  const sdtElements = xmlDoc.getElementsByTagName("w:sdt");
  console.log(`문서에서 ${sdtElements.length}개의 Content Control 요소 발견`);
  
  // 1. 먼저 모든 Content Control 요소와 ID 수집
  for (let i = 0; i < sdtElements.length; i++) {
    const sdt = sdtElements[i];
    const tagElements = sdt.getElementsByTagName("w:tag");
    
    if (tagElements.length > 0 && tagElements[0].hasAttribute("w:val")) {
      const id = tagElements[0].getAttribute("w:val");
      
      // 순서 정보 추출
      let order = null;
      const aliasElements = sdt.getElementsByTagName("w:alias");
      if (aliasElements.length > 0 && aliasElements[0].hasAttribute("w:val")) {
        const aliasValue = aliasElements[0].getAttribute("w:val");
        
        // alias 값에서 order 추출 (type id__order 형식)
        if (aliasValue.includes('__')) {
          const parts = aliasValue.split('__');
          if (parts.length > 1) {
            order = parts[parts.length - 1];
          }
        }
      }
      
      // Content 요소 찾기
      const contentElements = sdt.getElementsByTagName("w:sdtContent");
      if (contentElements.length > 0 && contentElements[0].firstElementChild) {
        const element = contentElements[0].firstElementChild;
        
        // 요소 타입 결정
        const elementType = TAG_TYPE_MAP[element.nodeName] || "unknown";
        
        // 매핑 등록
        elementIdMap.set(element, id);
        idElementMap.set(id, element);
        
        // 요소 속성 추출
        const attributes = extractElementAttributes(element, elementType);

        // 이전 JSON에서 정보 가져오기 (있는 경우)
        let elementData: { type: string; attributes: Record<string, any>; order?: string; children?: Record<string, any> } = { type: elementType, attributes };
        
        if (order) {
          elementData.order = order;
        }

        if (existingJson[id]) {
          // 기존 데이터가 있으면 타입은 유지하고 속성은 업데이트
          elementData = {
            ...existingJson[id],
            attributes: {
              ...existingJson[id].attributes,
              ...attributes
            }
          };

          if (order) {
            elementData.order = order;
          } else if (existingJson[id].order) {
            elementData.order = existingJson[id].order;
          }
          
          // 기존에 children 속성이 있었다면 유지
          if (existingJson[id].children) {
            elementData.children = existingJson[id].children;
          }
        }
        
        // JSON에 요소 정보 추가
        resultJson[id] = elementData;
      }
    }
  }
  
  console.log(`${Object.keys(resultJson).length}개의 요소 정보 추출 완료`);
  
  // 2. 계층 구조 및 부모-자식 관계 구성
  buildHierarchyStructure(resultJson, elementIdMap, idElementMap);
  
  return resultJson;
}

/**
 * 요소에서 화이트리스트에 정의된 속성만 추출하되, 원본 XML 구조 유지
 */
function extractElementAttributes(element: Element, elementType: string): Record<string, any> {
  const attributes: Record<string, any> = {};
  
  // 화이트리스트에 정의된 속성이 아니면 추출하지 않음
  if (!TRACKED_ELEMENTS[elementType]) {
    return attributes;
  }
  
  // 요소 자체의 허용된 속성 추출
  const typeConfig = TRACKED_ELEMENTS[elementType];
  const allowedSelfAttributes = typeConfig.selfAttributes || [];
  
  if (allowedSelfAttributes.length > 0) {
    attributes[element.nodeName] = {};
    
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      if (allowedSelfAttributes.includes(attr.name)) {
        attributes[element.nodeName][attr.name] = attr.value;
      }
    }
    
    // 빈 객체라면 제거
    if (Object.keys(attributes[element.nodeName]).length === 0) {
      delete attributes[element.nodeName];
    }
  }
  
  // 하위 요소 추출
  const childConfigs = typeConfig.children || {};
  
  for (const childTag of Object.keys(childConfigs)) {
    const childConfig = childConfigs[childTag];
    const childElements = element.getElementsByTagName(childTag);
    
    if (childElements.length > 0) {
      const childElement = childElements[0];
      
      // 요소 자체에 속성이 있고 허용된 속성이 있을 경우
      const allowedChildAttributes = childConfig.selfAttributes || [];
      
      if (childElement.attributes.length > 0 && allowedChildAttributes.length > 0) {
        attributes[childTag] = {};
        
        for (let i = 0; i < childElement.attributes.length; i++) {
          const attr = childElement.attributes[i];
          if (allowedChildAttributes.includes(attr.name)) {
            attributes[childTag][attr.name] = attr.value;
          }
        }
        
        // 빈 객체라면 true로 설정 (요소는 있으나 추출할 속성이 없는 경우)
        if (Object.keys(attributes[childTag]).length === 0) {
          if (childConfig.textContent && childElement.textContent) {
            attributes[childTag] = childElement.textContent;
          } else {
            attributes[childTag] = true;
          }
        }
      } 
      // 텍스트 콘텐츠를 추출해야 하는 경우
      else if (childConfig.textContent && childElement.textContent) {
        attributes[childTag] = childElement.textContent;
      }
      // 속성이 없는 경우 요소 존재만 표시
      else if (allowedChildAttributes.length === 0) {
        attributes[childTag] = true;
      }
      
      // 하위 요소의 하위 요소 처리 (최대 2단계까지만 구현)
      const grandchildConfigs = childConfig.children || {};
      
      for (const grandchildTag of Object.keys(grandchildConfigs)) {
        const grandchildConfig = grandchildConfigs[grandchildTag];
        const grandchildElements = childElement.getElementsByTagName(grandchildTag);
        
        if (grandchildElements.length > 0) {
          const grandchildElement = grandchildElements[0];
          const allowedGrandchildAttributes = grandchildConfig.selfAttributes || [];
          
          if (grandchildElement.attributes.length > 0 && allowedGrandchildAttributes.length > 0) {
            if (!attributes[childTag] || attributes[childTag] === true) {
              attributes[childTag] = {};
            }
            
            if (typeof attributes[childTag] === 'object') {
              attributes[childTag][grandchildTag] = {};
              
              for (let i = 0; i < grandchildElement.attributes.length; i++) {
                const attr = grandchildElement.attributes[i];
                if (allowedGrandchildAttributes.includes(attr.name)) {
                  attributes[childTag][grandchildTag][attr.name] = attr.value;
                }
              }
              
              // 빈 객체라면 true로 설정
              if (Object.keys(attributes[childTag][grandchildTag]).length === 0) {
                if (grandchildConfig.textContent && grandchildElement.textContent) {
                  attributes[childTag][grandchildTag] = grandchildElement.textContent;
                } else {
                  attributes[childTag][grandchildTag] = true;
                }
              }
            }
          }
          // 텍스트 콘텐츠를 추출해야 하는 경우
          else if (grandchildConfig.textContent && grandchildElement.textContent) {
            if (!attributes[childTag] || attributes[childTag] === true) {
              attributes[childTag] = {};
            }
            
            if (typeof attributes[childTag] === 'object') {
              attributes[childTag][grandchildTag] = grandchildElement.textContent;
            }
          }
          // 속성이 없는 경우 요소 존재만 표시
          else if (allowedGrandchildAttributes.length === 0) {
            if (!attributes[childTag] || attributes[childTag] === true) {
              attributes[childTag] = {};
            }
            
            if (typeof attributes[childTag] === 'object') {
              attributes[childTag][grandchildTag] = true;
            }
          }
        }
      }
    }
  }
  
  return attributes;
}

function buildHierarchyStructure(
  resultJson: Record<string, any>,
  elementIdMap: Map<Element, string>,
  idElementMap: Map<string, Element>
): void {
  console.log("JSON 계층 구조 구성 시작");
  
  // 1. 부모-자식 관계 맵핑
  const parentChildMap = new Map<string, string[]>();
  
  // 각 자식 요소의 부모 맵핑 (복수 부모 문제 해결용)
  const childToParentMap = new Map<string, string>();
  
  // DOM 구조 기반 계층 관계 분석
  idElementMap.forEach((element, id) => {
    // 요소 타입 확인
    const elementType = resultJson[id]?.type;
    
    if (elementType === "paragraph") {
      // 문단 내 run 요소 찾기
      const runs = Array.from(element.getElementsByTagName("w:r"));
      const childIds: string[] = [];
      
      runs.forEach(run => {
        const runId = elementIdMap.get(run);
        if (runId && resultJson[runId]) {
          childIds.push(runId);
          // 각 run의 부모를 현재 문단으로 설정
          childToParentMap.set(runId, id);
        }
      });
      
      if (childIds.length > 0) {
        // 순서 속성에 따라 자식 ID 정렬
        childIds.sort((a, b) => {
          const orderA = resultJson[a]?.order || "";
          const orderB = resultJson[b]?.order || "";
          return orderA.localeCompare(orderB);
        });
        
        parentChildMap.set(id, childIds);
      }
    } 
    else if (elementType === "table") {
      // 테이블 내 문단 요소 찾기
      const paragraphs: Element[] = [];
      const cells = Array.from(element.getElementsByTagName("w:tc"));
      
      // 셀별로 그룹화
      const cellContents: Record<string, string[]> = {};
      
      cells.forEach((cell, cellIndex) => {
        const cellId = `cell_${cellIndex}`;
        cellContents[cellId] = [];
        
        // 셀 내 문단 찾기
        Array.from(cell.getElementsByTagName("w:p")).forEach(para => {
          const paraId = elementIdMap.get(para);
          if (paraId && resultJson[paraId]) {
            // 셀 참조만 추가하고, 실제 객체는 중복 추가하지 않음
            cellContents[cellId].push(paraId);
            paragraphs.push(para);
            
            // 이미 다른 부모가 있는지 확인
            const existingParent = childToParentMap.get(paraId);
            if (!existingParent) {
              childToParentMap.set(paraId, id);
            }
          }
        });
      });
      
      // 테이블 자식 ID 목록 생성
      const childIds: string[] = [];
      paragraphs.forEach(para => {
        const paraId = elementIdMap.get(para);
        if (paraId && resultJson[paraId]) {
          // 현재 테이블이 이 문단의 소유자인 경우만 자식으로 추가
          if (childToParentMap.get(paraId) === id) {
            childIds.push(paraId);
          }
        }
      });
      
      if (childIds.length > 0) {
        // 순서 속성에 따라 자식 ID 정렬
        childIds.sort((a, b) => {
          const orderA = resultJson[a]?.order || "";
          const orderB = resultJson[b]?.order || "";
          return orderA.localeCompare(orderB);
        });
        
        parentChildMap.set(id, childIds);
        
        // 구조화된 셀 정보 추가 (일관성 유지)
        if (Object.keys(cellContents).length > 0) {
          resultJson[id].cells = cellContents;
        }
      }
    }
  });
  
  // 2. 부모-자식 관계에 있는 요소 식별 (제거용)
  const childrenToRemove = new Set<string>();
  
  // 3. JSON 구조에 계층 관계 반영 - 자식 요소를 직접 부모 객체에 추가
  parentChildMap.forEach((childIds, parentId) => {
    const parentObj = resultJson[parentId];
    
    if (parentObj) {
      // 기존 children 객체가 있으면 삭제 (중요!)
      if (parentObj.children) {
        delete parentObj.children;
      }
      
      childIds.forEach(childId => {
        if (resultJson[childId]) {
          // 현재 부모가 이 자식의 소유자인 경우만 추가 및 제거
          if (childToParentMap.get(childId) === parentId) {
            // 직접 부모 객체에 자식 요소 추가 (키는 자식의 ID)
            parentObj[childId] = { ...resultJson[childId] };
            
            // 제거 목록에 자식 ID 추가
            childrenToRemove.add(childId);
          }
        }
      });
    }
  });
  
  // 4. 최상위 레벨에서 자식 요소 제거
  childrenToRemove.forEach(childId => {
    if (resultJson[childId]) {
      delete resultJson[childId];
    }
  });
  
  // 5. 남아있는 children 속성 제거 (모든 객체 순회)
  Object.values(resultJson).forEach(obj => {
    if (obj && typeof obj === 'object' && 'children' in obj) {
      delete obj.children;
    }
  });
  
  console.log(`계층 구조 구성 완료: ${childrenToRemove.size}개 요소를 최상위에서 제거`);
}

/**
 * 테이블 구조 최적화 함수 - 테이블 Content Control 중첩 문제 해결
 * @param xmlString 문서 XML 문자열
 * @returns 최적화된 XML 문자열
 */
export function optimizeTableStructures(xmlString: string): string {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  let modified = false;

  try {
    // 테이블 Content Control 내에 다른 테이블 Content Control이 중첩된 경우 처리
    const sdtElements = xmlDoc.getElementsByTagName("w:sdt");
    
    for (let i = 0; i < sdtElements.length; i++) {
      const sdt = sdtElements[i];
      const tagElements = sdt.getElementsByTagName("w:tag");
      
      // 테이블 Content Control 찾기
      if (tagElements.length > 0) {
        const tagValue = tagElements[0].getAttribute("w:val");
        if (tagValue && tagValue.startsWith("t_")) {
          // 테이블 Content Control 발견
          const sdtContent = sdt.getElementsByTagName("w:sdtContent")[0];
          if (sdtContent) {
            // 내부에 중첩된 테이블 Content Control 찾기
            const innerSdts = sdtContent.getElementsByTagName("w:sdt");
            for (let j = 0; j < innerSdts.length; j++) {
              const innerSdt = innerSdts[j];
              const innerTagElements = innerSdt.getElementsByTagName("w:tag");
              
              if (innerTagElements.length > 0) {
                const innerTagValue = innerTagElements[0].getAttribute("w:val");
                if (innerTagValue && innerTagValue.startsWith("t_")) {
                  // 중첩된 테이블 Content Control 발견 - 구조 수정
                  console.log(`중첩된 테이블 Content Control 발견: ${innerTagValue} in ${tagValue}`);
                  
                  // 중첩된 테이블 Content Control의 내용 추출
                  const innerSdtContent = innerSdt.getElementsByTagName("w:sdtContent")[0];
                  if (innerSdtContent) {
                    while (innerSdtContent.firstChild) {
                      sdtContent.insertBefore(innerSdtContent.firstChild, innerSdt);
                    }
                    // 중첩된 Content Control 제거
                    sdtContent.removeChild(innerSdt);
                    modified = true;
                  }
                }
              }
            }
          }
        }
      }
    }
    
    // 테이블이 셀 내부의 Content Control에 감싸진 경우 처리
    const tableElements = xmlDoc.getElementsByTagName("w:tbl");
    
    for (let i = 0; i < tableElements.length; i++) {
      const table = tableElements[i];
      const cells = table.getElementsByTagName("w:tc");
      
      for (let j = 0; j < cells.length; j++) {
        const cell = cells[j];
        const cellContentControls = cell.getElementsByTagName("w:sdt");
        
        for (let k = 0; k < cellContentControls.length; k++) {
          const cellSdt = cellContentControls[k];
          const tagElements = cellSdt.getElementsByTagName("w:tag");
          
          if (tagElements.length > 0) {
            const tagValue = tagElements[0].getAttribute("w:val");
            if (tagValue && tagValue.startsWith("t_")) {
              // 셀 내부에 테이블 Content Control 발견
              console.log(`셀 내부에 테이블 Content Control 발견: ${tagValue}`);
              
              // 테이블을 감싸는 새 Content Control 생성
              const newSdt = xmlDoc.createElement("w:sdt");
              const newSdtPr = xmlDoc.createElement("w:sdtPr");
              
              // alias 설정
              const newAlias = xmlDoc.createElement("w:alias");
              newAlias.setAttribute("w:val", `table ${tagValue}`);
              newSdtPr.appendChild(newAlias);
              
              // tag 설정
              const newTag = xmlDoc.createElement("w:tag");
              newTag.setAttribute("w:val", tagValue);
              newSdtPr.appendChild(newTag);
              
              // id 설정
              const newId = xmlDoc.createElement("w:id");
              newId.setAttribute("w:val", Math.floor(Math.random() * 1000000000).toString());
              newSdtPr.appendChild(newId);
              
              // 테이블을 내용으로 하는 sdtContent 생성
              const newSdtContent = xmlDoc.createElement("w:sdtContent");
              
              // 테이블의 부모 노드와 다음 형제 노드 저장
              const tableParent = table.parentNode;
              const nextSibling = table.nextSibling;
              
              // 테이블을 문서에서 제거
              tableParent.removeChild(table);
              
              // 새 구조 구성
              newSdt.appendChild(newSdtPr);
              newSdt.appendChild(newSdtContent);
              newSdtContent.appendChild(table);
              
              // 새 구조를 문서에 삽입
              if (nextSibling) {
                tableParent.insertBefore(newSdt, nextSibling);
              } else {
                tableParent.appendChild(newSdt);
              }
              
              // 셀 내부 Content Control 제거 (이제 테이블 자체가 Content Control로 감싸짐)
              cell.removeChild(cellSdt);
              modified = true;
            }
          }
        }
      }
    }
    
    if (modified) {
      console.log("테이블 구조가 최적화되었습니다.");
    } else {
      console.log("테이블 구조 최적화가 필요하지 않습니다.");
    }
    
    // 수정된 XML 문서를 문자열로 직렬화하여 반환
    const serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc);
  } catch (error) {
    console.error("테이블 구조 최적화 중 오류:", error);
    return xmlString; // 오류 발생 시 원본 반환
  }
}

/**
 * 모든 Content Control에 순서 속성을 하향식으로 부여
 * 문서 루트에서 시작하여 계층별로 내려가면서 순서 부여
 */
function assignOrderToContentControls(xmlDoc: Document): void {
  console.log("Content Control 요소에 하향식 순서 부여 시작");
  
  // 1. 문서의 body 요소 찾기 (루트 시작점)
  const bodyElements = xmlDoc.getElementsByTagName("w:body");
  if (bodyElements.length === 0) {
    console.log("문서 body 요소를 찾을 수 없음");
    return;
  }
  
  const body = bodyElements[0];
  
  // 2. 재귀적으로 요소와 그 자식들에게 순서 부여
  processElementAndChildren(body);
  
  console.log("모든 Content Control에 순서 속성 부여 완료");
  
  // 요소와 그 직계 자식들을 처리하는 재귀 함수
  function processElementAndChildren(element: Element): void {
    // 현재 요소의 직계 자식 중 Content Control 요소만 수집
    const directChildSdts: Element[] = [];
    
    for (let i = 0; i < element.childNodes.length; i++) {
      const child = element.childNodes[i];
      if (child.nodeType === Node.ELEMENT_NODE) {
        const childElement = child as Element;
        
        // Content Control인 경우 목록에 추가
        if (childElement.nodeName === "w:sdt") {
          directChildSdts.push(childElement);
        }
        // 일반 요소인 경우 재귀적으로 처리
        else {
          processElementAndChildren(childElement);
        }
      }
    }
    
    // 직계 자식 Content Control이 있으면 순서 부여
    if (directChildSdts.length > 0) {
      const elementName = element.nodeName;
      console.log(`${elementName} 요소 내 ${directChildSdts.length}개의 직계 Content Control 요소 처리`);
      
      // DOM 순서대로 정렬 (이미 DOM 순서대로 수집되었으므로 필요 없을 수도 있음)
      // directChildSdts.sort((a, b) => getElementPosition(a) - getElementPosition(b));
      
      // 순서 배열 생성
      const orders = generateNKeysBetween(null, null, directChildSdts.length);
      
      // 각 Content Control에 순서 할당
      directChildSdts.forEach((sdt, index) => {
        // alias에 순서 정보 설정
        setOrderToContentControl(sdt, orders[index]);
        
        // Content Control 내부의 요소들도 재귀적으로 처리
        const contentElements = sdt.getElementsByTagName("w:sdtContent");
        if (contentElements.length > 0) {
          processElementAndChildren(contentElements[0]);
        }
      });
    }
  }
  
  // 요소의 DOM 내 위치 가져오기
  function getElementPosition(element: Element): number {
    if (!element.parentNode) return 0;
    
    const siblings = Array.from(element.parentNode.childNodes)
      .filter(node => node.nodeType === Node.ELEMENT_NODE);
    
    for (let i = 0; i < siblings.length; i++) {
      if (siblings[i] === element) {
        return i;
      }
    }
    
    return 0;
  }
  
  // Content Control에 순서 정보 설정
  function setOrderToContentControl(sdt: Element, order: string): void {
    // sdtPr 요소 찾기
    const sdtPrElements = sdt.getElementsByTagName("w:sdtPr");
    if (sdtPrElements.length === 0) return;
    
    const sdtPr = sdtPrElements[0];
    
    // alias 요소 찾기
    let aliasElement = sdt.getElementsByTagName("w:alias")[0];
    
    // 없으면 새로 생성
    if (!aliasElement) {
      aliasElement = xmlDoc.createElement("w:alias");
      sdtPr.appendChild(aliasElement);
    }
    
    // 기존 값 확인
    let existingValue = "";
    if (aliasElement.hasAttribute("w:val")) {
      existingValue = aliasElement.getAttribute("w:val");
    }
    
    // Content Control ID 가져오기
    const tagElements = sdt.getElementsByTagName("w:tag");
    if (tagElements.length > 0 && tagElements[0].hasAttribute("w:val")) {
      const id = tagElements[0].getAttribute("w:val");
      const elementType = id.split('_')[0]; // ID에서 타입 추출 (p, r, t 등)
      
      // alias 값에 순서 정보 추가
      let newValue = "";
      
      // 기존 값에 순서 정보가 있는지 확인
      if (existingValue && existingValue.includes('__')) {
        // 기존 순서 정보 제거 후 새 순서 정보 추가
        const basePart = existingValue.split('__')[0];
        newValue = `${basePart}__${order}`;
      } else if (existingValue) {
        // 기존 값에 순서 정보 추가
        newValue = `${existingValue}__${order}`;
      } else {
        // 기본 형식으로 설정
        newValue = `${elementType} ${id}__${order}`;
      }
      
      // 새 값 설정
      aliasElement.setAttribute("w:val", newValue);
      
      // 내부 요소 정보 (로깅용)
      let contentType = "unknown";
      const contentElements = sdt.getElementsByTagName("w:sdtContent");
      if (contentElements.length > 0 && contentElements[0].firstElementChild) {
        contentType = contentElements[0].firstElementChild.nodeName;
      }
      
      console.log(`  Content Control ${id} (${contentType}): 순서 ${order} 할당`);
    }
  }
}