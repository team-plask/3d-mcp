import * as shortid from 'shortid';
// import { formatXML } from './document'; // 사용되지 않음
import { generateNKeysBetween } from 'fractional-indexing';

// ElementConfig 인터페이스 및 ELEMENT_CONFIG, TAG_TO_TYPE, CONTENT_CONTROL_ELEMENTS는 이전과 동일하게 유지합니다.
// (여기에 전체 코드를 다시 붙여넣으면 너무 길어지므로, 변경되는 함수 위주로 표시합니다.)

export interface ElementConfig {
  type: 'structural' | 'property' | 'leaf';
  xmlTag: string;
  jsonKey?: string;
  parameters?: string[];
  children?: Record<string, ElementConfig>;
  isList?: boolean;
}

export const ELEMENT_CONFIG: Record<string, ElementConfig> = {
  paragraph: {
    type: 'structural',
    xmlTag: 'w:p',
    children: {
      pPr: {
        type: 'property',
        xmlTag: 'w:pPr',
        jsonKey: 'properties',
        children: {
          jc: { type: 'leaf', xmlTag: 'w:jc', jsonKey: 'justification', parameters: ['w:val'] },
          spacing: { type: 'leaf', xmlTag: 'w:spacing', jsonKey: 'spacing', parameters: ['w:after', 'w:before', 'w:line', 'w:lineRule'] },
          ind: { type: 'leaf', xmlTag: 'w:ind', jsonKey: 'indentation', parameters: ['w:left', 'w:right', 'w:firstLine', 'w:hanging'] }
        }
      }
    }
  },
  run: {
    type: 'structural',
    xmlTag: 'w:r',
    children: {
      rPr: {
        type: 'property',
        xmlTag: 'w:rPr',
        jsonKey: 'properties',
        children: {
          b: { type: 'leaf', xmlTag: 'w:b', jsonKey: 'bold', parameters: ['w:val'] },
          i: { type: 'leaf', xmlTag: 'w:i', jsonKey: 'italic', parameters: ['w:val'] },
          u: { type: 'leaf', xmlTag: 'w:u', jsonKey: 'underline', parameters: ['w:val'] },
          color: { type: 'leaf', xmlTag: 'w:color', jsonKey: 'color', parameters: ['w:val'] },
          sz: { type: 'leaf', xmlTag: 'w:sz', jsonKey: 'fontSize', parameters: ['w:val'] },
          szCs: { type: 'leaf', xmlTag: 'w:szCs', jsonKey: 'fontSizeCs', parameters: ['w:val'] },
          rFonts: { type: 'leaf', xmlTag: 'w:rFonts', jsonKey: 'fonts', parameters: ['w:ascii', 'w:hAnsi', 'w:cs', 'w:eastAsia', 'w:hint'] },
          lang: { type: 'leaf', xmlTag: 'w:lang', jsonKey: 'language', parameters: ['w:val'] }
        }
      },
      t: { type: 'leaf', xmlTag: 'w:t', jsonKey: 'text' }
    }
  },
  table: {
    type: 'structural',
    xmlTag: 'w:tbl',
    children: {
      tblPr: {
        type: 'property',
        xmlTag: 'w:tblPr',
        jsonKey: 'properties',
        children: {
          tblStyle: { type: 'leaf', xmlTag: 'w:tblStyle', jsonKey: 'style', parameters: ['w:val'] },
          tblW: { type: 'leaf', xmlTag: 'w:tblW', jsonKey: 'width', parameters: ['w:w', 'w:type'] },
          tblInd: { type: 'leaf', xmlTag: 'w:tblInd', jsonKey: 'indentation', parameters: ['w:w', 'w:type'] },
          tblBorders: {
            type: 'property', xmlTag: 'w:tblBorders', jsonKey: 'borders',
            children: {
              top: { type: 'leaf', xmlTag: 'w:top', jsonKey: 'top', parameters: ['w:val', 'w:sz', 'w:space', 'w:color'] },
              left: { type: 'leaf', xmlTag: 'w:left', jsonKey: 'left', parameters: ['w:val', 'w:sz', 'w:space', 'w:color'] },
              bottom: { type: 'leaf', xmlTag: 'w:bottom', jsonKey: 'bottom', parameters: ['w:val', 'w:sz', 'w:space', 'w:color'] },
              right: { type: 'leaf', xmlTag: 'w:right', jsonKey: 'right', parameters: ['w:val', 'w:sz', 'w:space', 'w:color'] },
              insideH: { type: 'leaf', xmlTag: 'w:insideH', jsonKey: 'insideH', parameters: ['w:val', 'w:sz', 'w:space', 'w:color'] },
              insideV: { type: 'leaf', xmlTag: 'w:insideV', jsonKey: 'insideV', parameters: ['w:val', 'w:sz', 'w:space', 'w:color'] }
            }
          }
        }
      },
      tblGrid: {
        type: 'property', xmlTag: 'w:tblGrid', jsonKey: 'grid',
        children: {
          gridCol: { type: 'leaf', xmlTag: 'w:gridCol', jsonKey: 'columns', parameters: ['w:w'], isList: true }
        }
      }
    }
  },
  tableRow: {
    type: 'structural',
    xmlTag: 'w:tr',
    children: {
      trPr: {
        type: 'property', xmlTag: 'w:trPr', jsonKey: 'properties',
        children: {
          trHeight: { type: 'leaf', xmlTag: 'w:trHeight', jsonKey: 'height', parameters: ['w:val', 'w:hRule'] }
        }
      }
    }
  },
  tableCell: {
    type: 'structural',
    xmlTag: 'w:tc',
    children: {
      tcPr: {
        type: 'property', xmlTag: 'w:tcPr', jsonKey: 'properties',
        children: {
          tcW: { type: 'leaf', xmlTag: 'w:tcW', jsonKey: 'width', parameters: ['w:w', 'w:type'] },
          gridSpan: { type: 'leaf', xmlTag: 'w:gridSpan', jsonKey: 'gridSpan', parameters: ['w:val'] },
          vMerge: { type: 'leaf', xmlTag: 'w:vMerge', jsonKey: 'vMerge', parameters: ['w:val'] },
          tcBorders: {
            type: 'property', xmlTag: 'w:tcBorders', jsonKey: 'borders',
            children: {
              top: { type: 'leaf', xmlTag: 'w:top', jsonKey: 'top', parameters: ['w:val', 'w:sz', 'w:space', 'w:color'] },
              left: { type: 'leaf', xmlTag: 'w:left', jsonKey: 'left', parameters: ['w:val', 'w:sz', 'w:space', 'w:color'] },
              bottom: { type: 'leaf', xmlTag: 'w:bottom', jsonKey: 'bottom', parameters: ['w:val', 'w:sz', 'w:space', 'w:color'] },
              right: { type: 'leaf', xmlTag: 'w:right', jsonKey: 'right', parameters: ['w:val', 'w:sz', 'w:space', 'w:color'] }
            }
          }
        }
      }
    }
  },
  hyperlink: {
    type: 'structural',
    xmlTag: 'w:hyperlink',
    parameters: ['r:id', 'w:anchor', 'w:history'],
    children: {}
  },
  drawing: {
    type: 'structural',
    xmlTag: 'w:drawing',
    children: {
      inline: {
        type: 'property', xmlTag: 'wp:inline', jsonKey: 'inlineProperties', parameters: ['distT', 'distB', 'distL', 'distR'],
        children: {
          extent: { type: 'leaf', xmlTag: 'wp:extent', jsonKey: 'extent', parameters: ['cx', 'cy'] },
          docPr: { type: 'leaf', xmlTag: 'wp:docPr', jsonKey: 'docProperties', parameters: ['id', 'name', 'descr'] }
        }
      }
    }
  }
};

export const TAG_TO_TYPE: Record<string, string> = {
  'w:p': 'paragraph', 'w:r': 'run', 'w:tbl': 'table', 'w:tr': 'tableRow',
  'w:tc': 'tableCell', 'w:hyperlink': 'hyperlink', 'w:drawing': 'drawing'
};
const CONTENT_CONTROL_ELEMENTS = Object.values(TAG_TO_TYPE);


// processDocument, applyContentControlsToDocument, collectTargetElementsRecursive,
// isDirectlyInsideSdtContent, wrapWithContentControl, extractJsonFromContentControls,
// extractElementData, processChildElements, extractLeafData, mergeElementData,
// assignOrderToContentControls, setOrderToSdtAlias 함수들은 이전과 동일하게 유지합니다.
// sortByOrder 함수는 buildHierarchyStructure 내에서 직접 사용되지 않으므로 제거하거나,
// 필요시 다른 용도로 유지할 수 있습니다. 여기서는 일단 그대로 둡니다.

export function processDocument(
  xmlString: string,
  existingJson: Record<string, any> = {}
): { json: Record<string, any>; xml: string } {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const xmlDocWithControls = applyContentControlsToDocument(xmlDoc);
  console.log("xmlDocWithControls:", xmlDocWithControls);

  const xmlSerializer = new XMLSerializer();
  let updatedXmlString = xmlSerializer.serializeToString(xmlDocWithControls);
  
  // XMLSerializer가 네임스페이스를 모두 루트에 선언하는 경향이 있어, 수동으로 정리 (선택적)
  // updatedXmlString = formatWellFormedXml(updatedXmlString);


  const resultJson = extractJsonFromContentControls(xmlDocWithControls, existingJson);

  return {
    json: resultJson,
    xml: updatedXmlString
  };
}

function applyContentControlsToDocument(xmlDoc: Document): Document {
  console.log("XML에 Content Control 적용 시작");
  const wrappedElements = new Set<Element>();

  function findExistingWrappedElementsRecursive(node: Node): void {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      if (element.nodeName === "w:sdt") {
        const contentElements = element.getElementsByTagName("w:sdtContent");
        if (contentElements.length > 0 && contentElements[0].firstElementChild) {
          wrappedElements.add(contentElements[0].firstElementChild);
        }
      }
      for (let i = 0; i < element.childNodes.length; i++) {
        findExistingWrappedElementsRecursive(element.childNodes[i]);
      }
    }
  }

  const bodyElements = xmlDoc.getElementsByTagName("w:body");
  if (bodyElements.length > 0) {
    findExistingWrappedElementsRecursive(bodyElements[0]);
  }

  let elementsToWrap = collectTargetElementsRecursive(xmlDoc, wrappedElements);
   // 필터링: elementsToWrap에서 이미 wrappedElements에 있는 요소 제거
  elementsToWrap = elementsToWrap.filter(item => !wrappedElements.has(item.element));


  elementsToWrap.sort((a, b) => b.depth - a.depth);
  console.log("Content Control 적용 대상 요소들:", elementsToWrap);
  for (const { element, type } of elementsToWrap) {
    const id = `${type.charAt(0)}_${shortid.generate()}`;
    wrapWithContentControl(element, id, type);
  }

  assignOrderToContentControls(xmlDoc);
  console.log("Content Control 적용 완료");
  return xmlDoc;
}


// converter.ts 내의 collectTargetElementsRecursive 함수 수정
function collectTargetElementsRecursive(
  xmlDocOrElement: Document | Element,
  initialElementsToExclude: Set<Element>,
  depth = 0,
  collected: Array<{element: Element, type: string, depth: number}> = []
): Array<{element: Element, type: string, depth: number}> {
  // Document일 경우 documentElement를, Element일 경우 해당 element를 사용
  const rootNode = (xmlDocOrElement as Document).documentElement || xmlDocOrElement as Element;
  console.log("[DEBUG] collectTargetElementsRecursive - Root node for traversal:", rootNode?.nodeName);

  function traverse(node: Node, currentDepth: number) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      // console.log(`[DEBUG] Traversing: <${element.nodeName}> at depth ${currentDepth}`); // 모든 요소 로깅 (매우 많을 수 있음)

      if (element.nodeName === "w:sdtContent") {
        // console.log("[DEBUG] Traversing children of w:sdtContent");
        for (let i = 0; i < element.childNodes.length; i++) {
            traverse(element.childNodes[i], currentDepth); // sdtContent 내부는 depth 동일하게 유지 또는 +1
        }
        return;
      }

      const elementType = TAG_TO_TYPE[element.nodeName];
      if (elementType && CONTENT_CONTROL_ELEMENTS.includes(elementType)) {
        // console.log(`[DEBUG] Found potential target: <${element.nodeName}>, type: ${elementType}`);
        if (!initialElementsToExclude.has(element) && !isDirectlyInsideSdtContent(element)) {
          // console.log(`[DEBUG] Adding target: <${element.nodeName}> to collected list.`);
          collected.push({ element, type: elementType, depth: currentDepth });
        } else {
          // console.log(`[DEBUG] Skipping already wrapped or sdtContent child: <${element.nodeName}>`);
        }
      }

      if (element.nodeName !== "w:sdt") { // sdt 내부의 sdtContent는 위에서 처리
        for (let i = 0; i < element.childNodes.length; i++) {
          traverse(element.childNodes[i], currentDepth + 1);
        }
      }
    }
  }

  if (rootNode) { // rootNode가 null이 아닌지 확인
    traverse(rootNode, depth);
  } else {
    console.error("[DEBUG] collectTargetElementsRecursive - Root node is null or undefined.");
  }
  return collected;
}

function isDirectlyInsideSdtContent(element: Element): boolean {
    return element.parentNode?.nodeName === 'w:sdtContent';
}


function wrapWithContentControl(element: Element, id: string, type: string): void {
  const xmlDoc = element.ownerDocument;
  if (!xmlDoc) return; 

  const sdtElement = xmlDoc.createElement("w:sdt");
  const sdtPrElement = xmlDoc.createElement("w:sdtPr");

  const aliasElement = xmlDoc.createElement("w:alias");
  aliasElement.setAttribute("w:val", `${type} ${id}`);
  sdtPrElement.appendChild(aliasElement);

  const tagElement = xmlDoc.createElement("w:tag");
  tagElement.setAttribute("w:val", id);
  sdtPrElement.appendChild(tagElement);

  const idElementVal = Math.floor(Math.random() * 1000000000); 
  const idElementNode = xmlDoc.createElement("w:id"); // 변수명 변경
  idElementNode.setAttribute("w:val", idElementVal.toString());
  sdtPrElement.appendChild(idElementNode);

  sdtElement.appendChild(sdtPrElement);

  const sdtContentElement = xmlDoc.createElement("w:sdtContent");
  const parent = element.parentNode;

  if (parent) {
    parent.replaceChild(sdtElement, element); 
    sdtContentElement.appendChild(element);    
  } else {
    sdtContentElement.appendChild(element);
  }
  sdtElement.appendChild(sdtContentElement);
}


export function extractJsonFromContentControls(
  xmlDoc: Document,
  existingJson: Record<string, any> = {}
): Record<string, any> {
  console.log("Content Control 기반 JSON 추출 시작");
  const resultJson: Record<string, any> = {};
  // elementIdMap: 실제 콘텐츠 요소 -> sdt ID (이 맵은 buildHierarchyStructure에서 직접 사용하지 않을 수 있음)
  // const elementIdMap = new Map<Element, string>(); 
  const idElementMap = new Map<string, Element>(); // sdt ID -> 실제 콘텐츠 요소

  const sdtElements = Array.from(xmlDoc.getElementsByTagName("w:sdt"));

  for (const sdt of sdtElements) {
    const tagElements = sdt.getElementsByTagName("w:tag");
    if (tagElements.length > 0 && tagElements[0].hasAttribute("w:val")) {
      const id = tagElements[0].getAttribute("w:val")!;
      let order: string | null = null;
      const aliasElements = sdt.getElementsByTagName("w:alias");
      if (aliasElements.length > 0 && aliasElements[0].hasAttribute("w:val")) {
        const aliasValue = aliasElements[0].getAttribute("w:val") || "";
        if (aliasValue.includes('__')) {
          order = aliasValue.substring(aliasValue.lastIndexOf('__') + 2);
        }
      }

      const contentElements = sdt.getElementsByTagName("w:sdtContent");
      if (contentElements.length > 0 && contentElements[0].firstElementChild) {
        const actualElement = contentElements[0].firstElementChild as Element;
        const elementType = TAG_TO_TYPE[actualElement.nodeName];

        if (!elementType) {
          console.warn(`Unknown element type for nodeName: ${actualElement.nodeName} with ID: ${id}`);
          continue;
        }
        
        // elementIdMap.set(actualElement, id); // buildHierarchy에서 직접 사용하지 않으면 생략 가능
        idElementMap.set(id, actualElement); // sdt ID로 실제 요소를 찾는 데 사용

        const extractedData = extractElementData(actualElement, elementType);
        let elementJson: any = {
          type: elementType,
          ...extractedData
        };
        if (order) {
          elementJson.order = order; // order는 항상 유지
        }

        if (existingJson[id]) {
          elementJson = mergeElementData(existingJson[id], elementJson);
        }
        resultJson[id] = elementJson;
      }
    }
  }
  
  // buildHierarchyStructure는 resultJson을 직접 수정합니다.
  buildHierarchyStructure(resultJson, idElementMap, xmlDoc); // elementIdMap은 제거
  return resultJson;
}

function extractElementData(element: Element, elementType: string): Record<string, any> {
  const result: Record<string, any> = {};
  const config = ELEMENT_CONFIG[elementType];

  if (!config) return result;

  if (config.parameters) {
    for (const param of config.parameters) {
      if (element.hasAttribute(param)) {
        // 네임스페이스 프리픽스 제거 (w:val -> val)
        const paramKey = param.includes(':') ? param.substring(param.indexOf(':') + 1) : param;
        result[paramKey] = element.getAttribute(param)!;
      }
    }
  }

  if (config.children) {
    processChildElements(element, config.children, result);
  }
  return result;
}

function processChildElements(
  parentElement: Element,
  childConfigs: Record<string, ElementConfig>,
  result: Record<string, any>
): void {
  for (const [key, childConfig] of Object.entries(childConfigs)) {
    const directChildElements = Array.from(parentElement.childNodes).filter(
        (node): node is Element => node.nodeType === Node.ELEMENT_NODE && node.nodeName === childConfig.xmlTag
    );

    if (directChildElements.length === 0) continue;

    const jsonKey = childConfig.jsonKey || key;

    if (childConfig.isList) {
        const listData: any[] = [];
        for (const childElement of directChildElements) {
            let itemData: any = null;
            if (childConfig.type === 'property') {
                const propertyData: Record<string, any> = {};
                if (childConfig.children) {
                    processChildElements(childElement, childConfig.children, propertyData);
                }
                if (Object.keys(propertyData).length > 0) {
                    itemData = propertyData;
                }
            } else if (childConfig.type === 'leaf') {
                itemData = extractLeafData(childElement, childConfig);
            }
            if (itemData !== null) {
                listData.push(itemData);
            }
        }
        if (listData.length > 0) {
            result[jsonKey] = listData;
        }
    } else { 
        const childElement = directChildElements[0]; 
        let singleData: any = null;
        if (childConfig.type === 'property') {
            const propertyData: Record<string, any> = {};
            if (childConfig.children) {
                processChildElements(childElement, childConfig.children, propertyData);
            }
            if (Object.keys(propertyData).length > 0) {
                singleData = propertyData;
            }
        } else if (childConfig.type === 'leaf') {
            singleData = extractLeafData(childElement, childConfig);
        }
        if (singleData !== null) {
            result[jsonKey] = singleData;
        }
    }
  }
}

function extractLeafData(element: Element, config: ElementConfig): any {
  if (config.xmlTag === 'w:t') {
    return element.textContent || "";
  }

  const params: Record<string, string> = {};
  let extractedParamCount = 0;

  if (config.parameters) {
    for (const paramName of config.parameters) {
      if (element.hasAttribute(paramName)) {
        const paramKey = paramName.includes(':') ? paramName.substring(paramName.indexOf(':') + 1) : paramName;
        params[paramKey] = element.getAttribute(paramName)!;
        extractedParamCount++;
      }
    }
  }
  
  if (config.parameters && config.parameters.length === 1 && config.parameters[0] === 'w:val') {
    if (element.hasAttribute('w:val')) {
      return element.getAttribute('w:val');
    } else {
      return true; // <w:b/> 같은 경우
    }
  }

  if (extractedParamCount > 0) {
    return params;
  }
 
  if (!config.parameters || config.parameters.length === 0) {
      return true; // 파라미터 설정이 아예 없는 리프 태그는 존재 자체로 true
  }
  
  return null; // 설정된 파라미터가 있었으나 하나도 추출되지 않음
}

function mergeElementData(existing: any, updated: any): any {
  const result = { ...existing };
  for (const [key, value] of Object.entries(updated)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value) && 
        existing[key] && typeof existing[key] === 'object' && !Array.isArray(existing[key])) {
      result[key] = mergeElementData(existing[key], value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * 계층 구조 구성: 자식 ID를 직접 키로 사용
 */
function buildHierarchyStructure(
  resultJson: Record<string, any>,
  idElementMap: Map<string, Element>, // sdtId -> actualElement
  xmlDoc: Document
): void {
  const childToParentMap = new Map<string, string>(); // childSdtId -> parentSdtId

  const allSdtElements = Array.from(xmlDoc.getElementsByTagName("w:sdt"));

  for (const sdtElement of allSdtElements) {
    const tagElements = sdtElement.getElementsByTagName("w:tag");
    if (!(tagElements.length > 0 && tagElements[0].hasAttribute("w:val"))) continue;
    
    const currentSdtId = tagElements[0].getAttribute("w:val")!;
    if (!resultJson[currentSdtId]) continue;

    const actualElement = idElementMap.get(currentSdtId); // 현재 sdt의 실제 콘텐츠 요소
    if (!actualElement) continue;

    // actualElement의 직계 자식 노드들 중에서 sdt 태그(즉, 감싸진 자식 요소)를 찾음
    for (let i = 0; i < actualElement.childNodes.length; i++) {
        const childNode = actualElement.childNodes[i];
        if (childNode.nodeType === Node.ELEMENT_NODE && childNode.nodeName === 'w:sdt') {
            const childSdtElement = childNode as Element;
            const childTagElements = childSdtElement.getElementsByTagName('w:tag');
            if (childTagElements.length > 0 && childTagElements[0].hasAttribute('w:val')) {
                const childSdtId = childTagElements[0].getAttribute('w:val')!;
                if (resultJson[childSdtId] && !childToParentMap.has(childSdtId)) {
                    childToParentMap.set(childSdtId, currentSdtId);
                }
            }
        }
    }
  }
  
  // 부모별로 [childId, childOrder] 쌍을 저장할 맵
  const parentToChildrenOrderMap = new Map<string, {id: string, order: string}[]>();

  childToParentMap.forEach((parentId, childId) => {
    const childObj = resultJson[childId];
    if (childObj && childObj.order !== undefined) {
        if (!parentToChildrenOrderMap.has(parentId)) {
            parentToChildrenOrderMap.set(parentId, []);
        }
        parentToChildrenOrderMap.get(parentId)!.push({id: childId, order: childObj.order});
    } else if (childObj) { // order가 없는 자식 (이론상 없어야 함)
        if (!parentToChildrenOrderMap.has(parentId)) {
            parentToChildrenOrderMap.set(parentId, []);
        }
        parentToChildrenOrderMap.get(parentId)!.push({id: childId, order: ""}); // 임시 order
    }
  });

  // 각 부모의 자식 목록을 order 기준으로 정렬
  parentToChildrenOrderMap.forEach(children => {
    children.sort((a, b) => a.order.localeCompare(b.order));
  });
  
  // 정렬된 자식들을 부모 객체에 ID를 키로 사용하여 추가
  parentToChildrenOrderMap.forEach((sortedChildren, parentId) => {
    const parentObj = resultJson[parentId];
    if (parentObj) {
      sortedChildren.forEach(childInfo => {
        const childObj = resultJson[childInfo.id];
        if (childObj) {
          parentObj[childInfo.id] = childObj; // ID를 키로 사용
        }
      });
    }
  });
  
  // 최상위 JSON에서 자식으로 이동된 객체들 제거
  childToParentMap.forEach((_parentId, childId) => {
    delete resultJson[childId];
  });
}

// sortByOrder 함수는 이제 buildHierarchyStructure 내에서 직접 사용되지 않습니다.
// function sortByOrder(items: any[]): void { ... }


function assignOrderToContentControls(xmlDoc: Document): void {
  const bodyElements = xmlDoc.getElementsByTagName("w:body");
  if (bodyElements.length === 0) return;
  const body = bodyElements[0];

  function processSdtSiblingsRecursive(parentElementOrSdtContent: Element): void {
    const directChildSdts: Element[] = [];
    // parentElementOrSdtContent의 직접 자식들 중에서 <w:sdt> 태그 찾기
    for (let i = 0; i < parentElementOrSdtContent.childNodes.length; i++) {
      const child = parentElementOrSdtContent.childNodes[i];
      if (child.nodeType === Node.ELEMENT_NODE && child.nodeName === 'w:sdt') {
        directChildSdts.push(child as Element);
      }
    }

    if (directChildSdts.length > 0) {
      const orders = generateNKeysBetween(null, null, directChildSdts.length);
      directChildSdts.forEach((sdt, index) => {
        setOrderToSdtAlias(sdt, orders[index], xmlDoc);
        const sdtContent = sdt.getElementsByTagName('w:sdtContent')[0];
        // sdtContent 내부의 실제 콘텐츠 요소(예: w:p)를 가져옴
        if (sdtContent && sdtContent.firstElementChild) {
            // 그 실제 콘텐츠 요소의 자식 sdt들을 찾기 위해 재귀 호출
            processSdtSiblingsRecursive(sdtContent.firstElementChild as Element);
        }
      });
    }
  }
  // body에서 시작하여, body의 직계 자식 sdt들을 찾고, 그 안으로 재귀적으로 들어감
  processSdtSiblingsRecursive(body);
}


function setOrderToSdtAlias(sdtElement: Element, order: string, xmlDoc: Document): void {
  const sdtPr = sdtElement.getElementsByTagName("w:sdtPr")[0];
  if (!sdtPr) return;

  let aliasElement = sdtPr.getElementsByTagName("w:alias")[0];
  if (!aliasElement) {
    aliasElement = xmlDoc.createElement("w:alias");
    sdtPr.appendChild(aliasElement);
  }

  const currentAliasValue = aliasElement.getAttribute("w:val") || "";
  
  if (currentAliasValue.includes("__")) {
    const baseValue = currentAliasValue.substring(0, currentAliasValue.lastIndexOf("__"));
    aliasElement.setAttribute("w:val", `${baseValue}__${order}`);
  } else { 
    const tagElement = sdtPr.getElementsByTagName("w:tag")[0];
    let baseAlias = currentAliasValue; // 기본값은 현재 alias 값

    if (!baseAlias && tagElement && tagElement.hasAttribute("w:val")) { // 현재 alias가 비어있고 tag가 있으면 tag 기반으로 생성
        const tagVal = tagElement.getAttribute("w:val")!;
        const typeNameFromTag = tagVal.split('_')[0]; 
        const typeKey = Object.keys(TAG_TO_TYPE).find(key => TAG_TO_TYPE[key].startsWith(typeNameFromTag));
        const resolvedTypeName = typeKey ? TAG_TO_TYPE[typeKey] : typeNameFromTag;
        baseAlias = `${resolvedTypeName} ${tagVal}`;
    } else if (!baseAlias) { // 현재 alias도 없고 tag도 없으면 임시값
        baseAlias = `unknown ${sdtElement.getAttribute("w:id") || Math.random().toString(36).substring(2)}`;
    }
    aliasElement.setAttribute("w:val", `${baseAlias}__${order}`);
  }
}

/*
// XML 포매팅 함수 (선택적) - 브라우저 환경에서는 DOMParser/XMLSerializer가 이미 처리
function formatWellFormedXml(xmlString: string): string {
    // 간단한 정규식 기반 포매팅 또는 라이브러리 사용
    // 예: 불필요한 네임스페이스 선언 정리 등
    // 이 함수는 실제 구현이 필요하며, 복잡할 수 있습니다.
    // 지금은 단순 반환.
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");
        const serializer = new XMLSerializer();
        // 오류 처리 추가 가능
        const errorNode = xmlDoc.querySelector("parsererror");
        if (errorNode) {
            console.error("XML parsing error in formatWellFormedXml:", errorNode.textContent);
            return xmlString; // 오류 시 원본 반환
        }
        return serializer.serializeToString(xmlDoc);
    } catch (e) {
        console.error("Error formatting XML:", e);
        return xmlString;
    }
}
*/