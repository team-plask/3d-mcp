// service.ts
import {
  applyPatch,
  compare,
  Operation,
  AddOperation,
  RemoveOperation,
  ReplaceOperation
} from 'fast-json-patch';
import {
  ELEMENT_CONFIG,
  ElementConfig,
  TAG_TO_TYPE,
  processDocument as processDocumentFromConverter,
  extractJsonFromContentControls,
  createDummyParagraph,
  DEFAULT_SDT_IDENTIFIER_BY_ELEMENT_TYPE,
  UNIVERSAL_DEFAULT_SDT_IDENTIFIER,
  SDT_CHOICE_TAG_FROM_CONFIG_TYPE
} from './converter';
import { 
  extractDocumentXml,
  formatXML,
  replaceOriginalWithUpdated
} from './document';

const NS_W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";

function findSdtElementById(xmlDocOrElement: Document | Element, id: string): Element | null {
    const sdtNodeList = (xmlDocOrElement instanceof Document) ?
                        xmlDocOrElement.getElementsByTagName('w:sdt') :
                        (xmlDocOrElement as Element).getElementsByTagName('w:sdt');
    for (let i = 0; i < sdtNodeList.length; i++) {
        const sdt = sdtNodeList[i];
        const sdtPrList = sdt.getElementsByTagName('w:sdtPr');
        if (sdtPrList.length > 0) {
            const tagList = sdtPrList[0].getElementsByTagName('w:tag');
            if (tagList.length > 0 && tagList[0].getAttribute('w:val') === id) {
                return sdt;
            }
        }
    }
    return null;
}

function applyPropertiesToXmlElement(
  element: Element,
  propertiesJson: Record<string, any>,
  elementConfig: ElementConfig,
  xmlDoc: Document
): void {
  const propContainerConfigKey = Object.keys(elementConfig.children || {}).find(
    key => (elementConfig.children?.[key] as ElementConfig)?.jsonKey === 'properties'
  );

  if (!propContainerConfigKey || !elementConfig.children?.[propContainerConfigKey]) return;
  const propContainerConfig = elementConfig.children[propContainerConfigKey] as ElementConfig;
  const propContainerTagName = propContainerConfig.xmlTag;
  let propContainerElement: Element | null = element.getElementsByTagName(propContainerTagName)[0] || null;

  const propContainerLocalName = propContainerConfig.xmlTag.split(':')[1] || propContainerConfig.xmlTag;
  // 자식 노드 중에서 네임스페이스와 로컬 이름으로 검색
  for (let i = 0; i < element.childNodes.length; i++) {
    const node = element.childNodes[i];
    if (node.nodeType === Node.ELEMENT_NODE && 
        (node as Element).localName === propContainerLocalName && 
        (node as Element).namespaceURI === NS_W) {
      propContainerElement = node as Element;
      break;
    }
  }

  if (propertiesJson && Object.keys(propertiesJson).length > 0) {
    if (!propContainerElement) {
      // ❗ createElementNS 사용
      propContainerElement = xmlDoc.createElement(propContainerTagName);
      element.insertBefore(propContainerElement, element.firstChild);
    }
  } else if (propContainerElement) {
    propContainerElement.remove();
    return;
  } else {
    return;
  }

  if (!propContainerElement || !propContainerConfig.children) return;

  // 기존 자식 요소 제거 로직 (tagName 대신 localName, namespaceURI 비교 권장)
  Array.from(propContainerElement.childNodes).forEach(childNode => {
    if (childNode.nodeType === Node.ELEMENT_NODE) {
      const existingLeafElement = childNode as Element;
      const leafKeyInConfig = Object.keys(propContainerConfig.children!).find(
        pKey => {
            const cfg = propContainerConfig.children![pKey] as ElementConfig;
            const cfgLocalName = cfg.xmlTag.split(':')[1] || cfg.xmlTag;
            return cfgLocalName === existingLeafElement.localName && existingLeafElement.namespaceURI === NS_W;
        }
      );
      if (leafKeyInConfig) {
        const jsonKeyForExisting = propContainerConfig.children![leafKeyInConfig].jsonKey || leafKeyInConfig;
        if (!propertiesJson.hasOwnProperty(jsonKeyForExisting) || propertiesJson[jsonKeyForExisting] === null || propertiesJson[jsonKeyForExisting] === undefined) {
          existingLeafElement.remove();
        }
      }
    }
  });

  for (const propJsonKeyInPatch in propertiesJson) {
    if (!propertiesJson.hasOwnProperty(propJsonKeyInPatch)) continue;
    const propValueFromJson = propertiesJson[propJsonKeyInPatch];
    const leafConfigKey = Object.keys(propContainerConfig.children).find(
        pKey => (propContainerConfig.children![pKey].jsonKey || pKey) === propJsonKeyInPatch
    );
    if (!leafConfigKey) continue;
    
    const leafConfig = propContainerConfig.children[leafConfigKey] as ElementConfig;
    const leafLocalName = leafConfig.xmlTag.split(':')[1] || leafConfig.xmlTag;
    let leafElement: Element | null = null;

    for (let i = 0; i < propContainerElement.childNodes.length; i++) {
        const node = propContainerElement.childNodes[i];
        if (node.nodeType === Node.ELEMENT_NODE && 
            (node as Element).localName === leafLocalName && 
            (node as Element).namespaceURI === NS_W) {
            leafElement = node as Element;
            break;
        }
    }

    if (propValueFromJson !== undefined && propValueFromJson !== null) {
      if (!leafElement) {
        // ❗ createElementNS 사용
        leafElement = xmlDoc.createElement(leafConfig.xmlTag);
        propContainerElement.appendChild(leafElement);
      }
      // 속성 설정 시 setAttributeNS 사용 고려 (특히 w:val 등)
      if (leafConfig.parameters) {
        Array.from(leafElement.attributes).forEach(attr => {
            // 접두사가 있는 속성(예: w:val)과 없는 속성(예: val)을 구분하여 제거 필요
            const attrLocalName = attr.name.includes(':') ? attr.name.split(':')[1] : attr.name;
            const cfgParamLocalNames = leafConfig.parameters!.map(p => p.includes(':') ? p.split(':')[1] : p);
            if (cfgParamLocalNames.includes(attrLocalName)) {
                 // 정확한 제거를 위해 removeAttributeNS 사용 고려
                 if (attr.namespaceURI) {
                    leafElement!.removeAttribute(attr.name);
                 } else {
                    leafElement!.removeAttribute(attr.name);
                 }
            }
        });

        if (typeof propValueFromJson === 'object') {
          for (const paramFullName of leafConfig.parameters) {
            const paramLocalName = paramFullName.includes(':') ? paramFullName.substring(paramFullName.indexOf(':') + 1) : paramFullName;
            const paramPrefix = paramFullName.includes(':') ? paramFullName.split(':')[0] : null;
            if (propValueFromJson.hasOwnProperty(paramLocalName) && propValueFromJson[paramLocalName] !== undefined && propValueFromJson[paramLocalName] !== null) {
              if (paramPrefix === 'w') {
                leafElement.setAttribute(paramFullName, String(propValueFromJson[paramLocalName]));
              } else {
                leafElement.setAttribute(paramLocalName, String(propValueFromJson[paramLocalName])); // 접두사 없는 경우
              }
            }
          }
        } else if (leafConfig.parameters.includes('w:val') || leafConfig.parameters.includes('val')) {
          const valAttrName = leafConfig.parameters.find(p => p === 'w:val' || p === 'val')!;
          if (propValueFromJson === true && leafConfig.parameters.length === 1) {
            if(valAttrName.includes(':')) leafElement.removeAttribute('val'); // 'w:val'
            else leafElement.removeAttribute('val');
          } else {
            if(valAttrName.includes(':')) leafElement.setAttribute(valAttrName, String(propValueFromJson));
            else leafElement.setAttribute(valAttrName, String(propValueFromJson));
          }
        }
      } else if (propValueFromJson === true && (!leafConfig.parameters || leafConfig.parameters.length === 0)) {
        // Tag exists, no value needed
      }
    } else if (leafElement) {
      leafElement.remove();
    }
  }
}

function createXmlElementFromJson(
  id: string,
  itemJson: Record<string, any>,
  xmlDoc: Document,
  orderKey: string
): Element {
  const elementType = itemJson.type as string;
  if (!elementType || !ELEMENT_CONFIG[elementType]) {
    throw new Error(`[createXmlElementFromJson] Unsupported element type: ${itemJson.type} for ID: ${id}.`);
  }
  const config = ELEMENT_CONFIG[elementType];
  const contentElement = xmlDoc.createElement(config.xmlTag);

  // 파라미터, 속성, 텍스트 적용 (기존 로직 유지)
  if (config.parameters) {
    for (const paramFullName of config.parameters) {
      const paramKeyInJson = paramFullName.split(':').pop()!;
      if (itemJson.hasOwnProperty(paramKeyInJson) && itemJson[paramKeyInJson] !== null) {
        contentElement.setAttribute(paramFullName, String(itemJson[paramKeyInJson]));
      }
    }
  }
  if (itemJson.properties && typeof itemJson.properties === 'object') {
    applyPropertiesToXmlElement(contentElement, itemJson.properties, config, xmlDoc);
  } else if (config.xmlTag === 'w:p' && !contentElement.querySelector("pPr")) {
    contentElement.insertBefore(xmlDoc.createElement("w:pPr"), contentElement.firstChild);
  }
  if (itemJson.hasOwnProperty('text') && config.children?.t && config.xmlTag === 'w:r') {
    const textElement = xmlDoc.createElement("w:t");
    const textContentStr = String(itemJson.text || "");
    textElement.textContent = textContentStr;
    if (!textContentStr || textContentStr.startsWith(" ") || textContentStr.endsWith(" ")) {
      textElement.setAttribute('xml:space', 'preserve');
    }
    contentElement.appendChild(textElement);
  }

  // ✅ [핵심 수정] 자식 요소를 생성하는 로직 개선
  // 테이블의 경우 'rows' 배열을 특별히 처리합니다.
  if (elementType === 'table' && itemJson.rows && Array.isArray(itemJson.rows)) {
    // tblGrid는 rows보다 먼저 와야 할 수 있으므로, 먼저 처리
    if(itemJson.grid) {
        const gridConfig = ELEMENT_CONFIG.table.children!.tblGrid as ElementConfig;
        const gridElement = xmlDoc.createElement(gridConfig.xmlTag);
        if (itemJson.grid.columns && Array.isArray(itemJson.grid.columns)) {
            itemJson.grid.columns.forEach((col: any) => {
                const colEl = xmlDoc.createElement("w:gridCol");
                colEl.setAttribute("w:w", col.w);
                gridElement.appendChild(colEl);
            });
        }
        contentElement.appendChild(gridElement);
    }
      
    itemJson.rows.forEach((rowJson: any) => {
      const trElement = xmlDoc.createElement('w:tr'); // <w:tr> 생성
      if (rowJson.properties) {
          applyPropertiesToXmlElement(trElement, rowJson.properties, { type: 'structural', xmlTag: 'w:tr', children: { properties: { type: 'property', xmlTag: 'w:trPr', children: { height: {type: 'leaf', xmlTag: 'w:trHeight', parameters: ['w:val', 'w:hRule']} } }}}, xmlDoc);
      }

      // rowJson의 자식들 중 cell들을 찾아서 재귀적으로 생성
      const cellKeys = Object.keys(rowJson).filter(k => rowJson[k]?.type === 'tableCell');
      cellKeys.sort((a, b) => (rowJson[a].order || '').localeCompare(rowJson[b].order || ''));
      
      cellKeys.forEach(cellKey => {
        const cellJson = rowJson[cellKey];
        // 셀에 대한 SDT를 재귀적으로 생성
        const cellSdt = createXmlElementFromJson(cellKey, cellJson, xmlDoc, cellJson.order);
        trElement.appendChild(cellSdt);
      });
      contentElement.appendChild(trElement);
    });
  } else {
    // 그 외 일반적인 자식 요소 처리
    const childItemKeys = Object.keys(itemJson).filter(key =>
        ['type', 'order', 'properties', 'text', 'id', 'parentId', 'grid', 'rows'].indexOf(key) === -1 &&
        !(config.parameters?.map(p => p.split(':').pop()).includes(key)) &&
        itemJson[key] && typeof itemJson[key] === 'object' && itemJson[key].type
    );
    childItemKeys.sort((a, b) => (itemJson[a]?.order || '').localeCompare(itemJson[b]?.order || ''));
    childItemKeys.forEach(childKey => {
      const childJson = itemJson[childKey];
      const childSdtElement = createXmlElementFromJson(childKey, childJson, xmlDoc, childJson.order);
      contentElement.appendChild(childSdtElement);
    });
  }

  // SDT (Content Control) 관련 요소들도 모두 createElement 사용
  const sdtElement = xmlDoc.createElement("w:sdt");
  const sdtPrElement = xmlDoc.createElement("w:sdtPr");

  const aliasElement = xmlDoc.createElement("w:alias");
  aliasElement.setAttribute("w:val", `${elementType} ${id}__${orderKey}`); // w: 접두사 포함된 속성 이름
  sdtPrElement.appendChild(aliasElement);

  const tagElement = xmlDoc.createElement("w:tag");
  tagElement.setAttribute("w:val", id); // w: 접두사 포함된 속성 이름
  sdtPrElement.appendChild(tagElement);

  const idNode = xmlDoc.createElement("w:id");
  idNode.setAttribute("w:val", String(Math.floor(Math.random() * (2 ** 31 - 1)) * (Math.random() < 0.5 ? 1 : -1))); // w: 접두사 포함된 속성 이름
  sdtPrElement.appendChild(idNode);

  // showingPlcHdr 요소는 일반적으로 속성이 없습니다.
  const showingPlcHdrElement = xmlDoc.createElement("w:showingPlcHdr");
  sdtPrElement.appendChild(showingPlcHdrElement);

  const sdtTypeIdentifier = config.sdtType || DEFAULT_SDT_IDENTIFIER_BY_ELEMENT_TYPE[elementType] || UNIVERSAL_DEFAULT_SDT_IDENTIFIER;
  const choiceXmlTagNameNoPrefix = SDT_CHOICE_TAG_FROM_CONFIG_TYPE[sdtTypeIdentifier]; // 예: "richText"

  if (choiceXmlTagNameNoPrefix) {
    // choiceXmlTagNameNoPrefix가 "richText" 등 접두사 없는 이름이라면 'w:'를 붙여줍니다.
    const choiceElement = xmlDoc.createElement("w:" + choiceXmlTagNameNoPrefix);
    sdtPrElement.appendChild(choiceElement);
  }

  sdtElement.appendChild(sdtPrElement);

  const sdtContentElement = xmlDoc.createElement("w:sdtContent");
  sdtContentElement.appendChild(contentElement); // contentElement는 "w:p", "w:r" 등

  if (config.requiresPrwWrapper) {
    // 2. 필요 시, 더미 단락을 생성하여 뒤에 추가
    const dummyP = createDummyParagraph(xmlDoc);
    sdtContentElement.appendChild(dummyP);
  }

  sdtElement.appendChild(sdtContentElement);

  return sdtElement;
}

// service.ts

/**
 * 재귀적으로 객체를 탐색하여 특정 ID를 가진 자식 객체를 찾습니다.
 * @param obj 탐색할 JSON 객체
 * @param id 찾을 자식 객체의 ID (키)
 * @returns 찾은 경우 해당 자식 객체, 없으면 null
 */
function findObjectInNestedJson(obj: any, id: string): any | null {
  if (typeof obj !== 'object' || obj === null) {
    return null;
  }
  if (obj.hasOwnProperty(id)) {
    return obj[id];
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const found = findObjectInNestedJson(obj[key], id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function robustApplyMergePatchRecursive(
  original: any,
  patch: any
): any {
  if (patch === null) {
    return undefined; 
  }
  if (typeof patch !== 'object' || Array.isArray(patch) || patch === null) {
    return patch;
  }
  
  const SPREADSHEET_TARGET: Record<string, any> = (typeof original === 'object' && original !== null && !Array.isArray(original))
    ? JSON.parse(JSON.stringify(original))
    : {};

  for (const key in patch) {
    if (!patch.hasOwnProperty(key)) continue;

    const patchValue = patch[key];
    
    // ✅ [핵심 수정] original의 최상위 레벨에 키가 있는지 먼저 확인
    let originalValueForKey = original ? original[key] : undefined;

    // 만약 최상위에 없다면, original 객체 전체를 재귀적으로 탐색하여 찾아봅니다.
    if (originalValueForKey === undefined && typeof original === 'object' && original !== null) {
        originalValueForKey = findObjectInNestedJson(original, key);
    }

    if (patchValue === null) {
      // 삭제는 `compare`가 처리하므로, 여기서는 단순히 키를 제거하는 것으로 충분할 수 있습니다.
      // 하지만, 중첩된 객체 내의 키를 삭제하려면 더 복잡한 로직이 필요합니다.
      // 현재 시나리오는 add/replace가 문제이므로, null 처리는 기존 로직을 유지합니다.
      delete SPREADSHEET_TARGET[key];
    } else {
      // 찾은 originalValue(중첩된 위치에 있더라도)를 기반으로 재귀 호출합니다.
      SPREADSHEET_TARGET[key] = robustApplyMergePatchRecursive(originalValueForKey, patchValue);
    }
  }

  // 원본에만 있고 패치에 없는 키는 그대로 유지됩니다 (초기 복사로 처리됨).
  
  return SPREADSHEET_TARGET;
}

function getElementByPathRecursive(
  currentSearchRoot: Element,
  pathSegments: string[], // 찾아야 할 ID들의 배열 (예: ["p_1", "r_1"])
  pathIndex: number,
  operationDesc: string
): Element | null {
  // console.log("currentSearchRoot", currentSearchRoot.tagName, "Searching for segment:", pathSegments[pathIndex], "at index:", pathIndex);
  if (pathIndex >= pathSegments.length) {
      return currentSearchRoot; // 경로의 모든 ID를 찾았으면 현재 요소가 타겟
  }
  const segmentIdToFind = pathSegments[pathIndex];
  // currentSearchRoot의 직계 자식 중에서 segmentIdToFind를 가진 sdt 찾기
  let foundSdt: Element | null = null;
  const childNodes = currentSearchRoot.childNodes;
  for(let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i];
      if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'w:sdt') {
          const sdtCandidate = node as Element;
          const tagEl = sdtCandidate.getElementsByTagName('w:sdtPr')[0]?.getElementsByTagName('w:tag')[0];
          if (tagEl && tagEl.getAttribute('w:val') === segmentIdToFind) {
              foundSdt = sdtCandidate;
              break;
          }
      }
  }

  if (!foundSdt) {
      // console.warn(`${operationDesc}: SDT for ID segment '${segmentIdToFind}' in path '${pathSegments.join('/')}' not found directly under parent ${currentSearchRoot.tagName}.`);
      return null;
  }
  const sdtContent = foundSdt.getElementsByTagName('w:sdtContent')[0];
  if (!sdtContent || !sdtContent.firstElementChild) {
      // console.warn(`${operationDesc}: sdtContent or actual content element missing for SDT ID '${segmentIdToFind}'.`);
      return null;
  }
  return getElementByPathRecursive(sdtContent.firstElementChild as Element, pathSegments, pathIndex + 1, operationDesc);
}

// service.ts

// 이 함수는 더 이상 재귀적일 필요가 없습니다. 문서 전체에서 ID로 한 번에 찾습니다.
function findElementBySdtId(
  xmlDoc: Document,
  id: string,
  operationDesc: string
): Element | null {
  const sdtNodeList = xmlDoc.getElementsByTagName('w:sdt');
  
  for (let i = 0; i < sdtNodeList.length; i++) {
      const sdt = sdtNodeList[i];
      const tagEl = sdt.getElementsByTagName('w:sdtPr')[0]?.getElementsByTagName('w:tag')[0];

      if (tagEl && tagEl.getAttribute('w:val') === id) {
          const sdtContent = sdt.getElementsByTagName('w:sdtContent')[0];
          // sdtContent의 첫 번째 자식, 즉 실제 콘텐츠 요소를 반환
          if (sdtContent && sdtContent.firstElementChild) {
            return sdtContent.firstElementChild as Element;
          }
          // sdtContent는 있지만 비어있는 경우 (예: 빈 run sdt) sdtContent 자체를 반환할 수도 있음
          // 하지만 수정 대상은 보통 실제 콘텐츠 요소이므로, 자식이 없는 경우는 null 반환이 더 안전할 수 있음.
          return sdtContent || null; 
      }
  }

  console.warn(`${operationDesc}: SDT with ID '${id}' not found anywhere in the document.`);
  return null;
}

function insertSdtInOrder( /* 이전 답변의 코드와 동일 */
    parentElement: Element,
    newSdtElement: Element,
    newOrder: string,
    xmlDoc: Document
) {
    const wordNs = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
    const siblings = Array.from(parentElement.children).filter(c => c.tagName === 'w:sdt');
    // console.log("[DEBUG insertSdtInOrder] Parent:", parentElement.tagName, "New order:", newOrder, "Existing siblings:", siblings.length);
    let inserted = false;
    for (const siblingSdt of siblings) {
        const aliasElement = siblingSdt.getElementsByTagName("w:alias")[0] || siblingSdt.getElementsByTagName('w:alias')[0];
        if (aliasElement) {
            const aliasVal = aliasElement.getAttribute('w:val');
            if (aliasVal && aliasVal.includes('__')) {
                const siblingOrder = aliasVal.substring(aliasVal.lastIndexOf('__') + 2);
                // console.log(`  Comparing newOrder "${newOrder}" with siblingOrder "${siblingOrder}"`);
                if (newOrder < siblingOrder) {
                    parentElement.insertBefore(newSdtElement, siblingSdt);
                    inserted = true;
                    // console.log(`  Inserted before sibling with order ${siblingOrder}`);
                    break;
                }
            }
        }
    }
    if (!inserted) {
        parentElement.appendChild(newSdtElement);
        // console.log("  Appended to end.");
    }
}


// --- Office Add-in Specific Integration ---
export async function updateDocumentFromPatch(
  mergePatch: Record<string, any | null>
): Promise<Record<string, any> | null> {
  try {
    let finalJson: Record<string, any> | null = null;
    await Word.run(async (context: Word.RequestContext) => {
      console.log("Office Add-in: Document update from merge patch started.");

      const ooxml = context.document.body.getOoxml();
      await context.sync();
      const fullFlatXml = ooxml.value;
      const currentDocumentXmlFromOoxml = extractDocumentXml(fullFlatXml);

      // console.log("Office Add-in: Current document.xml content extracted from OOXML:", formatXML(currentDocumentXmlFromOoxml));
      const { json: originalJson, xml: documentXmlWithIds } =
        processDocumentFromConverter(currentDocumentXmlFromOoxml);
      
      // console.log("Office Add-in: Original JSON parsed:", originalJson);
      // console.log("Original JSON (Full):\n", JSON.stringify(originalJson, null, 2));
      // console.log("Received Merge Patch:\n", JSON.stringify(mergePatch, null, 2));
      
      const targetJson = robustApplyMergePatchRecursive(originalJson, mergePatch);
      for (const key in targetJson) { // robustApplyMergePatchRecursive가 undefined를 반환한 경우 정리
          if (targetJson.hasOwnProperty(key) && targetJson[key] === undefined) {
              delete targetJson[key];
          }
      }

      // console.log("Office Add-in: Target JSON constructed:", targetJson);
      // console.log("Target JSON (Full for debugging):\n", JSON.stringify(targetJson, null, 2));

      const operations: Operation[] = compare(originalJson, targetJson);
      // console.log("Office Add-in: Generated JSON Patch Operations (count):", operations.length);
      console.log("Office Add-in: Generated JSON Patch Operations (detailed):\n", JSON.stringify(operations, null, 2));
      
      const validOperations = operations.filter(op => typeof op === 'object' && op !== null && op.op) as Operation[];
      if (validOperations.length !== operations.length) {
          console.warn("Warning: Invalid operations were filtered out.");
      }

      if (validOperations.length === 0 && JSON.stringify(originalJson) === JSON.stringify(targetJson)) {
        console.log("Office Add-in: No effective changes to apply based on the merge patch.");
        return;
      }

      const parser = new DOMParser();
      const xmlDocInstance = parser.parseFromString(documentXmlWithIds, "application/xml");
      const parsingError = xmlDocInstance.getElementsByTagName("parsererror");
      if (parsingError.length > 0) {
          throw new Error("XML parsing error before applying operations: " + (parsingError[0].textContent || "Unknown parsing error"));
      }
      
      applyOperationsDirectlyToXmlDom(validOperations, xmlDocInstance, targetJson, originalJson);
      
      const serializer = new XMLSerializer();
      const updatedDocumentXmlContent = serializer.serializeToString(xmlDocInstance.documentElement);
      console.log("Office Add-in: Updated document.xml content:\n", formatXML(updatedDocumentXmlContent)); // formatXML 사용

      const finalFlatOpcXml = replaceOriginalWithUpdated(fullFlatXml, updatedDocumentXmlContent);
      
      context.document.body.insertOoxml(finalFlatOpcXml, Word.InsertLocation.replace);
      await context.sync();

      console.log("Office Add-in: Document successfully updated.");

      // ... 함수 시작 부분은 동일 ...

      const updatedFlat = context.document.body.getOoxml();
      await context.sync();
      let finalDocXml = extractDocumentXml(updatedFlat.value);
      console.log("Patch 후 (재구성 전) 최종 적용된 Document XML:\n", formatXML(finalDocXml));

      // ❗ [SDTContent 재구성 로직 시작 - 네임스페이스 사용 개선] ❗
      try {
        const parser = new DOMParser();
        const xmlDocInstance = parser.parseFromString(finalDocXml, "application/xml");
        const parsingError = xmlDocInstance.getElementsByTagName("parsererror");
        
        if (parsingError.length > 0) {
            console.error("XML parsing error before SDT recomposition:", parsingError[0].textContent);
        } else {
            // ✅ 수정: getElementsByTagName("w:sdt") 사용
            const allSdtElements = Array.from(xmlDocInstance.getElementsByTagName("w:sdt"));
            let sdtModified = false;

            for (const sdtElement of allSdtElements) {
                // ✅ 수정: getElementsByTagName("w:sdtPr") 등으로 직접 접근
                const sdtPrNode = sdtElement.getElementsByTagName("w:sdtPr")[0];
                const sdtContentNode = sdtElement.getElementsByTagName("w:sdtContent")[0];

                if (!sdtPrNode || !sdtContentNode) continue;

                const originalTagNode = sdtPrNode.getElementsByTagName("w:tag")[0];
                const originalAliasNode = sdtPrNode.getElementsByTagName("w:alias")[0];
                // ✅ 수정: getAttribute("w:val") 사용
                const originalTagVal = originalTagNode ? originalTagNode.getAttribute("w:val") : null;
                const originalAliasVal = originalAliasNode ? originalAliasNode.getAttribute("w:val") : null;
                const originalOrderKey = originalAliasVal ? originalAliasVal.substring(originalAliasVal.lastIndexOf("__") + 2) : "a0";

                const directChildren = Array.from(sdtContentNode.children).filter(child => child.nodeName === 'w:r');
                
                if (directChildren.length > 1) {
                    sdtModified = true;
                    console.log(`Recomposing SDT with tag '${originalTagVal}' which has ${directChildren.length} direct children in sdtContent.`);

                    const parentOfSdt = sdtElement.parentNode;
                    if (!parentOfSdt) continue;

                    // 기존 sdtContent에서 두 번째 자식부터 모두 제거
                    for (let i = 1; i < directChildren.length; i++) {
                        if (directChildren[i].parentNode === sdtContentNode) {
                          sdtContentNode.removeChild(directChildren[i]);
                        }
                    }

                    // 분리된 자식들을 새로운 SDT로 감싸서 추가
                    let currentSibling = sdtElement;
                    for (let i = 1; i < directChildren.length; i++) {
                        const childToWrap = directChildren[i];
                        const newSdtId = `recomposed_${originalTagVal || 'sdt'}_${i}`; // 예측 가능한 태그 이름 생성
                        const newOrderKey = originalOrderKey.slice(0, -1) + String.fromCharCode(originalOrderKey.charCodeAt(originalOrderKey.length - 1) + i);
                        
                        // ✅ 수정: createElement("w:...") 사용
                        const newSdtWrapper = xmlDocInstance.createElement("w:sdt");
                        const newSdtPr = xmlDocInstance.createElement("w:sdtPr");
                        const newSdtContent = xmlDocInstance.createElement("w:sdtContent");

                        // 새 SDT 속성 설정
                        const newAlias = xmlDocInstance.createElement("w:alias");
                        const childTagName = childToWrap.tagName.toLowerCase(); // 예: "w:p", "w:r"
                        const elementType = TAG_TO_TYPE[childTagName] || (childTagName.endsWith(':p') ? 'paragraph' : 'run');
                        newAlias.setAttribute("w:val", `${elementType} ${newSdtId}__${newOrderKey}`);
                        newSdtPr.appendChild(newAlias);

                        const newTag = xmlDocInstance.createElement("w:tag");
                        newTag.setAttribute("w:val", newSdtId);
                        newSdtPr.appendChild(newTag);

                        const newIdNode = xmlDocInstance.createElement("w:id");
                        newIdNode.setAttribute("w:val", String(Math.floor(Math.random() * (2**31 - 1)) * (Math.random() < 0.5 ? 1 : -1)));
                        newSdtPr.appendChild(newIdNode);

                        newSdtPr.appendChild(xmlDocInstance.createElement("w:showingPlcHdr"));
                        newSdtPr.appendChild(xmlDocInstance.createElement("w:richText"));

                        newSdtWrapper.appendChild(newSdtPr);
                        newSdtContent.appendChild(childToWrap);
                        newSdtWrapper.appendChild(newSdtContent);

                        parentOfSdt.insertBefore(newSdtWrapper, currentSibling.nextSibling);
                        currentSibling = newSdtWrapper;
                    }
                }
            }

            if (sdtModified) {
                const serializer = new XMLSerializer();
                finalDocXml = serializer.serializeToString(xmlDocInstance.documentElement);
                console.log("Office Add-in: Document.xml recomposed due to multiple children in sdtContent.");
            }
        }
      } catch (recompositionError) {
          console.error("Error during SDT recomposition:", recompositionError);
      }
      // ❗ [SDTContent 재구성 로직 끝] ❗


      const finalFlatOpcXmlToSave = replaceOriginalWithUpdated(fullFlatXml, finalDocXml);

      context.document.body.clear();
      await context.sync();
      context.document.body.insertOoxml(finalFlatOpcXmlToSave, Word.InsertLocation.replace);
      await context.sync();
      console.log("Office Add-in: Document successfully updated (after potential SDT recomposition).");


      const recheckedOoxml = context.document.body.getOoxml();
      await context.sync();
      const recheckedFinalDocXml = extractDocumentXml(recheckedOoxml.value);
      console.log("Patch 및 재구성 후 최종 적용된 Document XML:\n", formatXML(recheckedFinalDocXml));

      const finalXmlDocInstance = new DOMParser().parseFromString(recheckedFinalDocXml, "application/xml");
      finalJson = extractJsonFromContentControls(finalXmlDocInstance);
      console.log("Patch 및 재구성 후 최종 문서에서 추출한 JSON 구조:\n", JSON.stringify(finalJson, null, 2));
      });
      return finalJson;
      } catch (error) {
      console.error("Office Add-in: Error updating document from merge patch:", error);
      throw error;
      }
}

// --- XML DOM 직접 수정을 위한 함수 ---
function applyOperationsDirectlyToXmlDom(
  operations: Operation[],
  xmlDoc: Document,
  targetJsonState: Record<string, any>,
  originalJsonState: Record<string, any>
): void {
  const wordNs = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  const bodyElement = xmlDoc.getElementsByTagName("w:body")[0] || xmlDoc.getElementsByTagName("w:body")[0];
  if (!bodyElement) throw new Error("w:body element not found in XML document.");

  let clonedSectPr: Node | null = null;
  const sectPrNodeList = bodyElement.getElementsByTagName("w:sectPr");
  if (sectPrNodeList.length > 0 && sectPrNodeList[0].parentNode === bodyElement) {
      clonedSectPr = sectPrNodeList[0].cloneNode(true);
      sectPrNodeList[0].remove();
  }

  const definitionOps: Operation[] = []; // 셀, 단락 등 정의 추가/변경 오퍼레이션
  const tableStructureOps: Operation[] = []; // 테이블 행/셀 구조 변경 오퍼레이션
  operations.forEach(op => {
    if (op.path.includes('/rows/')) {
      tableStructureOps.push(op);
    } else {
      definitionOps.push(op);
    }
  });

  console.log("--- Phase 1: Applying Definition Operations ---");
  definitionOps.forEach(op => {
    console.log(`Applying DEF Op: ${op.op}, Path: ${op.path}`);
    try {
      // 제네릭 핸들러 호출
      switch (op.op) {
        case 'remove':
          handleXmlDomRemove(op, xmlDoc, bodyElement, originalJsonState);
          break;
        case 'add':
          handleXmlDomAdd(op, xmlDoc, bodyElement, targetJsonState);
          break;
        case 'replace':
          handleXmlDomReplace(op, xmlDoc, bodyElement, targetJsonState, originalJsonState);
          break;
        default:
          console.warn(`Unsupported DOM operation type: ${(op as any).op}`);
      }
    } catch (e) {
      console.error(`Error applying definition operation ${JSON.stringify(op)}:`, e);
    }
  });


  // --- 2단계: 테이블 구조(Structure) 관련 오퍼레이션 처리 ---
  console.log("--- Phase 2: Applying Table Structure Operations ---");
  tableStructureOps.forEach(op => {
      console.log(`Applying TBL_STRUCT Op: ${op.op}, Path: ${op.path}`);
      try {
        handleTableRowOrCellModification(op, xmlDoc, targetJsonState);
      } catch (e) {
        console.error(`Error applying table structure operation ${JSON.stringify(op)}:`, e);
      }
  });

  // 최종 순서 재정렬 및 누락 요소 재생성 (방어적 코딩)
  const currentSdtElementsInBody = Array.from(bodyElement.children).filter(c => c.tagName === 'w:sdt');
  const sdtMap = new Map<string, Element>();
  currentSdtElementsInBody.forEach(sdt => {
    const tagEl = sdt.getElementsByTagName('w:sdtPr')[0]?.getElementsByTagName('w:tag')[0];
    if (tagEl) {
      const val = tagEl.getAttribute('w:val');
      if (val) sdtMap.set(val, sdt);
    }
  });
  currentSdtElementsInBody.forEach(sdt => sdt.remove());

  const sortedTopLevelTargetIds = Object.keys(targetJsonState)
    .filter(id => targetJsonState[id] !== null && targetJsonState[id] !== undefined && targetJsonState[id].type)
    .sort((a, b) => (targetJsonState[a]?.order || "").localeCompare(targetJsonState[b]?.order || ""));
  
  console.log("sortedTopLevelTargetIds:", sortedTopLevelTargetIds);
  for (const id of sortedTopLevelTargetIds) {
    let sdtToAppend = sdtMap.get(id);
    if (!sdtToAppend) {
        const itemJson = targetJsonState[id];
        if (itemJson && itemJson.type && itemJson.order !== undefined) {
            // console.log(`[DOM Reorder/Finalize] ID ${id} not found in DOM map, creating from targetJson.`);
            sdtToAppend = createXmlElementFromJson(id, itemJson, xmlDoc, itemJson.order);
            // console.log("sdtToAppend", sdtToAppend);
        } else {
            console.warn(`[DOM Reorder/Finalize] Cannot create SDT for ID ${id}, itemJson invalid in targetJson.`);
            continue;
        }
    }
    if (sdtToAppend) {
        // console.log("sdtToAppend:", sdtToAppend);
        bodyElement.appendChild(sdtToAppend);
    }
  }

  if (clonedSectPr) {
    bodyElement.appendChild(clonedSectPr);
  }
}

// service.ts 에 새로 추가될 함수

/**
 * 테이블의 행(row) 또는 셀(cell) 관련 JSON Patch 오퍼레이션을 처리합니다.
 * @param op - 처리할 JSON Patch 오퍼레이션
 * @param xmlDoc - 전체 XML 문서 객체
 * @param targetJsonState - 최종적으로 만들어져야 할 완전한 JSON 상태
 */
function handleTableRowOrCellModification(
  op: Operation,
  xmlDoc: Document,
  targetJsonState: Record<string, any>
) {
  const pathSegments = op.path.substring(1).split('/');
  const tableId = pathSegments.find(seg => seg.startsWith('t_'));
  if (!tableId) return;

  const tableElement = findElementBySdtId(xmlDoc, tableId, "Table modification target search");
  if (!tableElement || tableElement.tagName.toLowerCase() !== 'w:tbl') {
    console.warn(`Table modification failed: Table with ID '${tableId}' not found.`);
    return;
  }

  const rowsPathIndex = pathSegments.indexOf('rows');
  if (rowsPathIndex === -1) return;

  const rowIndex = parseInt(pathSegments[rowsPathIndex + 1], 10);
  const allTrs = Array.from(tableElement.getElementsByTagNameNS(NS_W, 'tr'));

  // 행 추가 로직
  if (op.op === 'add' && pathSegments[rowsPathIndex + 1] !== undefined && pathSegments.length === rowsPathIndex + 2) {
    const newRowJson = op.value as { id: string, cells: string[], properties?: any, order: string };
    const newTr = xmlDoc.createElementNS(NS_W, 'tr');
    
    // 새 행의 속성 적용 (예: trHeight)
    if(newRowJson.properties) {
        // applyPropertiesToXmlElement 헬퍼를 tr에 맞게 활용
    }

    // 새 행에 포함될 셀들을 생성하여 추가
    newRowJson.cells.forEach(cellId => {
      const tableJson = findObjectInNestedJson(targetJsonState, tableId);
      const cellJson = tableJson ? tableJson[cellId] : null;
      if (cellJson) {
        const cellSdt = createXmlElementFromJson(cellId, cellJson, xmlDoc, cellJson.order);
        newTr.appendChild(cellSdt);
      } else {
        console.warn(`Definition for cell '${cellId}' not found in targetJson for table '${tableId}'`);
      }
    });

    // 테이블의 올바른 위치에 새 tr 삽입
    if (allTrs[rowIndex - 1]) {
      allTrs[rowIndex - 1].after(newTr);
    } else {
      tableElement.appendChild(newTr);
    }

  } else if (op.op === 'replace' && pathSegments[rowsPathIndex + 2] === 'cells') {
    // 사례: 셀 교체 (path: /.../rows/0/cells/0)
    const cellIndex = parseInt(pathSegments[rowsPathIndex + 3], 10);
    const targetTr = allTrs[rowIndex];
    if (!targetTr) {
      console.warn(`Table modification failed: Row at index ${rowIndex} not found.`);
      return;
    }
    const allCellSdts = Array.from(targetTr.getElementsByTagName('w:sdt'));
    const oldCellSdt = allCellSdts[cellIndex];
    if (!oldCellSdt) {
       console.warn(`Table modification failed: Cell at index ${cellIndex} in row ${rowIndex} not found.`);
       return;
    }
    
    const newCellId = op.value as string;
    const newCellJson = findObjectInNestedJson(targetJsonState, newCellId);
    if(newCellJson){
      const newCellSdt = createXmlElementFromJson(newCellId, newCellJson, xmlDoc, newCellJson.order);
      oldCellSdt.replaceWith(newCellSdt);
    }
  } else if (op.op === 'remove') {
    // 사례: 행 삭제 (path: /.../rows/0)
    const trToRemove = allTrs[rowIndex];
    if (trToRemove) {
      trToRemove.remove();
    }
  } else {
    // 기타: row의 id 변경 등. 이런 경우는 보통 DOM 조작이 필요 없음.
    console.log(`Table property modification on path '${op.path}'. No DOM change needed.`);
  }
}

function handleXmlDomRemove(
  op: RemoveOperation,
  xmlDoc: Document,
  bodyElement: Element,
  originalJsonState: Record<string, any>
) {
  const pathSegments = op.path.substring(1).split('/');
  // console.log(`  [DOM Remove] Path segments: ${pathSegments.join(' -> ')}`);
  
  if (pathSegments.length === 1) { // 최상위 요소 삭제
      const sdtElement = findSdtElementById(bodyElement, pathSegments[0]);
      if (sdtElement && sdtElement.parentNode === bodyElement) sdtElement.remove();
      else console.warn(`Remove Op: Top-level SDT for ID ${pathSegments[0]} not found or not direct child of body.`);
  } else { 
      const keyToRemove = pathSegments[pathSegments.length - 1];
      const elementPathSegments = pathSegments.slice(0, pathSegments[pathSegments.length - 2] === 'properties' ? -2 : -1);
      
      const elementIdToFind = elementPathSegments[elementPathSegments.length - 1];

      const actualElementToModify = findElementBySdtId(xmlDoc, elementIdToFind, "Remove target element search");
      // console.log("actualElementToModify:", actualElementToModify ? actualElementToModify : "null");
      if (!actualElementToModify) {
           console.warn(`Remove Op: Target element for path '${elementPathSegments.join('/')}' not found in XML DOM.`);
           return;
      }

      let jsonNodeForElement = originalJsonState;
      elementPathSegments.forEach(seg => { if(jsonNodeForElement && jsonNodeForElement.hasOwnProperty(seg)) jsonNodeForElement = jsonNodeForElement[seg]; else jsonNodeForElement = null; });
      
      if (!jsonNodeForElement || !jsonNodeForElement.type) {
          console.warn(`Remove Op: Cannot get JSON definition or type for element at path ${elementPathSegments.join('/')}`);
          return;
      }
      const elementConfig = ELEMENT_CONFIG[jsonNodeForElement.type];
      if (!elementConfig) { console.warn(`Remove Op: No ELEMENT_CONFIG for type ${jsonNodeForElement.type}`); return; }

      if (keyToRemove === 'text' && elementConfig.children?.text) {
          const textXmlTag = (elementConfig.xmlTag === 'w:r' && elementConfig.children.t) ? elementConfig.children.t.xmlTag : elementConfig.children.text.xmlTag;
          const textNodes = actualElementToModify.getElementsByTagName(textXmlTag);
          if (textNodes.length > 0 && textNodes[0].parentNode === actualElementToModify) textNodes[0].remove();
      } else if (pathSegments[pathSegments.length - 2] === 'properties' && elementConfig.children?.properties) {
          const propContainerConfig = elementConfig.children.properties as ElementConfig;
          const propContainerElement = actualElementToModify.getElementsByTagName(propContainerConfig.xmlTag)[0];
          if (propContainerElement) {
              const leafConfig = Object.values(propContainerConfig.children || {}).find(
                  (lc: any) => (lc.jsonKey || lc.xmlTag.split(':').pop()) === keyToRemove
              ) as ElementConfig | undefined;
              if (leafConfig) {
                  const leafNodes = propContainerElement.getElementsByTagName(leafConfig.xmlTag);
                  if (leafNodes.length > 0 && leafNodes[0].parentNode === propContainerElement) leafNodes[0].remove();
              } else {
                  console.warn(`Remove Op: No leaf config for property '${keyToRemove}' in properties of ${elementConfig.xmlTag}`);
              }
          }
      } else if (elementConfig.parameters?.find(p => (p.includes(':') ? p.substring(p.indexOf(':') + 1) : p) === keyToRemove)) {
          const paramFullName = elementConfig.parameters.find(p => (p.includes(':') ? p.substring(p.indexOf(':') + 1) : p) === keyToRemove);
          if(paramFullName) actualElementToModify.removeAttribute(paramFullName);
      } else { // 자식 구조 요소(SDT) 삭제
          const childSdtToRemove = findSdtElementById(actualElementToModify, keyToRemove);
          if (childSdtToRemove && childSdtToRemove.parentNode === actualElementToModify) childSdtToRemove.remove();
          else console.warn(`Remove Op: Child SDT '${keyToRemove}' not found directly under ${actualElementToModify.tagName} (ID: ${elementPathSegments.pop()}).`);
      }
  }
}

function handleXmlDomAdd(
  op: AddOperation<any>,
  xmlDoc: Document,
  bodyElement: Element,
  targetJsonState: Record<string, any>
) {
  const pathSegments = op.path.substring(1).split('/');
  const valueToAdd = op.value;

  const lastSegment = pathSegments[pathSegments.length - 1];
  const secondLastSegment = pathSegments.length > 1 ? pathSegments[pathSegments.length - 2] : null;

  let elementPathSegments = [...pathSegments];
  let operationSubType: 'structural' | 'text' | 'propertyKey' | 'propertiesObject' = 'structural';

  if (lastSegment === 'text') {
    operationSubType = 'text';
    elementPathSegments = pathSegments.slice(0, -1);
  } else if (lastSegment === 'properties' && typeof valueToAdd === 'object') {
    operationSubType = 'propertiesObject';
    elementPathSegments = pathSegments.slice(0, -1);
  } else if (secondLastSegment === 'properties') {
    operationSubType = 'propertyKey';
    elementPathSegments = pathSegments.slice(0, -2);
  }

  let actualElementToModify: Element | null = null;
  let newStructuralElementId: string | null = null; // structural add일 때만 사용될 새 요소의 ID

  if (operationSubType === 'structural') {
    newStructuralElementId = lastSegment; // 새 요소의 ID는 항상 경로의 마지막
    const parentPathSegments = pathSegments.slice(0, -1);

    if (parentPathSegments.length === 0) {
      // 루트 추가: 부모는 <w:body>
      actualElementToModify = bodyElement;
    } else {
      // 중첩 추가: 부모 ID로 부모 요소 검색
      const parentId = parentPathSegments[parentPathSegments.length - 1];
      actualElementToModify = findElementBySdtId(xmlDoc, parentId, `Structural Add Parent Search: ${parentId}`);
    }
  } else {
    // 텍스트/속성 추가: 경로 자체가 수정 대상 요소를 가리킴
    if (elementPathSegments.length > 0) {
        const elementIdToFind = elementPathSegments[elementPathSegments.length - 1];
        actualElementToModify = findElementBySdtId(xmlDoc, elementIdToFind, `Property/Text Add Target Search: ${elementIdToFind}`);
    } else {
        // 이 경우는 거의 없지만, 방어적으로 body를 할당
        actualElementToModify = bodyElement;
    }
  }
  
  // --- 3. 기존 로직 유지: 대상 확인 ---
  if (!actualElementToModify) {
    console.warn(`Add Op: Could not find target/parent XML element for path '${elementPathSegments.join('/')}'.`);
    return;
  }
  
  // --- 4. 기존 로직 유지: 오퍼레이션 실행 ---
  if (operationSubType === 'structural') {
    if (valueToAdd && typeof valueToAdd === 'object' && valueToAdd.type && valueToAdd.order !== undefined) {
      // structural add는 위에서 찾은 부모(actualElementToModify)에 새 요소를 추가
      const newSdtElement = createXmlElementFromJson(newStructuralElementId!, valueToAdd, xmlDoc, valueToAdd.order);
      insertSdtInOrder(actualElementToModify, newSdtElement, valueToAdd.order, xmlDoc);
    } else {
      console.warn(`Add Op (Structural): Invalid JSON for new element '${newStructuralElementId}'. Missing type/order. Value:`, valueToAdd);
    }
  } else {
    // 텍스트/속성 add는 위에서 찾은 대상(actualElementToModify)을 직접 수정
    let jsonNodeForElement = targetJsonState;
    elementPathSegments.forEach(seg => { if (jsonNodeForElement) jsonNodeForElement = jsonNodeForElement[seg]; else jsonNodeForElement = null; });
    
    if (!jsonNodeForElement || !jsonNodeForElement.type) {
      console.warn(`Add Op: Cannot determine type for element at path ${elementPathSegments.join('/')}.`);
      return;
    }
    const elementConfig = ELEMENT_CONFIG[jsonNodeForElement.type];
    if (!elementConfig) {
      console.warn(`Add Op: No ELEMENT_CONFIG for type ${jsonNodeForElement.type}.`);
      return;
    }

    if (operationSubType === 'text') {
      const textConfig = (elementConfig.xmlTag === 'w:r' && elementConfig.children?.t) ? elementConfig.children.t : elementConfig.children?.text;
      if (textConfig && actualElementToModify.localName === 'r') { // 실제 조작 대상이 <w:r>인지 확인
        // 기존 <w:t> 요소들을 모두 제거 (네임스페이스 접두사 사용)
        const existingTextElements = Array.from(actualElementToModify.getElementsByTagName(textConfig.xmlTag)); // "w:t"
        existingTextElements.forEach(node => {
          if (node.parentNode === actualElementToModify) {
            actualElementToModify.removeChild(node);
          }
        });
        // 새로운 <w:t> 요소 생성 (네임스페이스 접두사 사용)
        const textElement = xmlDoc.createElement(textConfig.xmlTag); // "w:t"
        if (valueToAdd !== null && valueToAdd !== undefined) {
          const textContentStr = String(valueToAdd);
          textElement.textContent = textContentStr;
          if (textContentStr === "" || textContentStr.startsWith(" ") || textContentStr.endsWith(" ") || textContentStr.includes("  ")) {
            textElement.setAttribute('xml:space', 'preserve');
          }
        } else {
            textElement.textContent = '';
            textElement.setAttribute('xml:space', 'preserve');
        }
        actualElementToModify.appendChild(textElement);
      } else {
        console.warn(`Add Op (Text): Target for text addition is not a <w:r> or textConfig missing. Element: ${actualElementToModify.tagName}, Config: ${JSON.stringify(textConfig)}`);
      }
    } else if (operationSubType === 'propertiesObject' || operationSubType === 'propertyKey') {
      const fullPropertiesJson = jsonNodeForElement.properties;
      if (fullPropertiesJson && typeof fullPropertiesJson === 'object') {
        applyPropertiesToXmlElement(actualElementToModify, fullPropertiesJson, elementConfig, xmlDoc);
      } else if (operationSubType === 'propertiesObject' && valueToAdd && typeof valueToAdd === 'object') {
        applyPropertiesToXmlElement(actualElementToModify, valueToAdd, elementConfig, xmlDoc);
      } else {
        console.warn(`Add Op (Property): Expected full properties object for ${actualElementToModify.tagName} at path ${elementPathSegments.join('/')}/properties, but targetJson has:`, fullPropertiesJson);
      }
    } else {
      console.warn(`Add Op: Unhandled non-structural addition for key '${lastSegment}' under element type '${elementConfig.xmlTag}'. Path: ${op.path}.`);
    }
  }
}

function handleXmlDomReplace(
  op: ReplaceOperation<any>,
  xmlDoc: Document,
  bodyElement: Element,
  targetJsonState: Record<string, any>,
  originalJsonState: Record<string, any>
) {
  const pathSegments = op.path.substring(1).split('/');
  const newJsonValueFromOp = op.value;

  const keyToReplace = pathSegments[pathSegments.length - 1];
  let elementPathSegments = [...pathSegments];
  let operationSubType: 'structural' | 'text' | 'propertyKey' | 'propertiesObject' | 'directParameter' = 'structural';

  // operationSubType 결정 로직 (이전과 동일하게 유지, 필요시 내부에서 NS_W 참조 제거)
  if (pathSegments.length > 1) {
    if (keyToReplace === 'text') {
      operationSubType = 'text';
      elementPathSegments = pathSegments.slice(0, -1);
    } else if (pathSegments[pathSegments.length - 2] === 'properties') {
      operationSubType = 'propertyKey';
      elementPathSegments = pathSegments.slice(0, -2);
    } else if (keyToReplace === 'properties') {
      operationSubType = 'propertiesObject';
      elementPathSegments = pathSegments.slice(0, -1);
    } else {
      let parentJsonNode = originalJsonState; // originalJsonState를 사용해야 이전 type의 parameter를 확인 가능
      const parentPathSegments = pathSegments.slice(0, -1);
      for (const seg of parentPathSegments) {
        if (parentJsonNode && typeof parentJsonNode === 'object' && parentJsonNode.hasOwnProperty(seg)) {
          parentJsonNode = parentJsonNode[seg];
        } else {
          parentJsonNode = null;
          break;
        }
      }
      if (parentJsonNode && parentJsonNode.type && ELEMENT_CONFIG[parentJsonNode.type]?.parameters?.some(p => (p.includes(':') ? p.substring(p.indexOf(':') + 1) : p) === keyToReplace)) {
        operationSubType = 'directParameter';
        elementPathSegments = pathSegments.slice(0, -1); // 부모 요소의 경로
      } else {
        // 구조적 자식 교체로 간주 (부모 경로 사용)
        operationSubType = 'structural';
        elementPathSegments = pathSegments.slice(0, -1);
      }
    }
  } else if (pathSegments.length === 1 && keyToReplace !== 'text' && keyToReplace !== 'properties') {
    operationSubType = 'structural';
    elementPathSegments = []; // 부모는 body (최상위 요소의 교체)
  }
  // --- operationSubType 결정 로직 끝 ---

  const elementIdToFind = elementPathSegments[elementPathSegments.length - 1];
  if (!elementIdToFind) {
      console.warn(`[handleXmlDomReplace] Could not determine target element ID from path: ${op.path}`);
      return;
  }
  const actualElementToModify = findElementBySdtId(xmlDoc, elementIdToFind, `Replace target for ID ${elementIdToFind}`);

  console.log("actualElementToModify:", actualElementToModify ? actualElementToModify : "null");
  console.log("operationSubType:", operationSubType, "for keyToReplace:", keyToReplace);
  console.log("elementPathSegments:", elementPathSegments.join('/'));
  if (!actualElementToModify && !(operationSubType === 'structural' && elementPathSegments.length === 0)) {
    console.warn(`[handleXmlDomReplace] Could not find target XML element at path '${elementPathSegments.join('/')}' for key '${keyToReplace}'. Op:`, op);
    return;
  }

  let originalJsonNodeForElement = originalJsonState;
  elementPathSegments.forEach(seg => {
    if (originalJsonNodeForElement && originalJsonNodeForElement.hasOwnProperty(seg)) {
      originalJsonNodeForElement = originalJsonNodeForElement[seg];
    } else {
      originalJsonNodeForElement = null;
    }
  });

  if (operationSubType === 'structural') {
    // keyToReplace는 여기서 교체될 (또는 생성될) 요소의 ID(tag값)
    let parentForSdtReplace: Element | null = bodyElement; // 기본은 bodyElement의 직계 자식
    if (elementPathSegments.length > 0) { // 경로가 비어있지 않다면, elementPathSegments는 부모 SDT의 경로를 가리킴
        parentForSdtReplace = actualElementToModify; // actualElementToModify는 부모 sdt의 sdtContent 내의 contentElement
    }

    if (parentForSdtReplace) {
        const oldSdt = findSdtElementById(parentForSdtReplace, keyToReplace);
        if (oldSdt && oldSdt.parentNode === parentForSdtReplace) { // 부모의 직계 자식인지 확인
            oldSdt.remove();
        } else if (oldSdt) {
            // console.warn(`[handleXmlDomReplace] Old SDT ${keyToReplace} found but not a direct child of designated parent. Parent: ${parentForSdtReplace.tagName}`);
        }
        // 값이 null이 아니면 새로운 요소 추가
        if (typeof newJsonValueFromOp === 'object' && newJsonValueFromOp !== null && newJsonValueFromOp.type && newJsonValueFromOp.order !== undefined) {
            const newSdt = createXmlElementFromJson(keyToReplace, newJsonValueFromOp, xmlDoc, newJsonValueFromOp.order);
            insertSdtInOrder(parentForSdtReplace, newSdt, newJsonValueFromOp.order, xmlDoc);
        } else if (newJsonValueFromOp !== null) { // null이 아닌데 유효한 객체가 아닌 경우 경고
             // console.warn(`[handleXmlDomReplace] (Structural): Invalid JSON for replacement element ${keyToReplace}. Value:`, newJsonValueFromOp);
        }
        // newJsonValueFromOp이 null이면 위에서 oldSdt.remove()로 이미 처리됨 (삭제)
    } else {
        // console.warn(`[handleXmlDomReplace] (Structural): Could not determine parent for replacing SDT ${keyToReplace}.`);
    }

  } else if (actualElementToModify && originalJsonNodeForElement && originalJsonNodeForElement.type) {
    const elementConfig = ELEMENT_CONFIG[originalJsonNodeForElement.type];
    if (!elementConfig) {
      console.warn(`[handleXmlDomReplace] No ELEMENT_CONFIG for type ${originalJsonNodeForElement.type} at path ${elementPathSegments.join('/')}.`);
      return;
    }

    if (operationSubType === 'text') {
      // actualElementToModify는 <w:r> 요소를 가리켜야 함
      if (actualElementToModify.localName === 'r' && actualElementToModify.namespaceURI === NS_W) {
        const runElement = actualElementToModify;

        // 기존 <w:t> 요소들 모두 제거
        const existingTextNodes = Array.from(runElement.getElementsByTagName("w:t"));
        existingTextNodes.forEach(node => {
          if (node.parentNode === runElement) {
            runElement.removeChild(node);
          }
        });

        // 새로운 텍스트 값이 null이나 undefined가 아닐 경우에만 <w:t> 추가
        if (newJsonValueFromOp !== null && newJsonValueFromOp !== undefined) {
          const newTextElement = xmlDoc.createElement("w:t"); // 'w:t'로 생성
          const textContentStr = String(newJsonValueFromOp);
          newTextElement.textContent = textContentStr;

          if (textContentStr === "" || textContentStr.startsWith(" ") || textContentStr.endsWith(" ") || textContentStr.includes("  ")) {
            newTextElement.setAttribute('xml:space', 'preserve');
          } else {
            // newTextElement.removeAttribute('xml:space'); // 불필요 시 제거 또는 설정 안 함
          }

          // <w:rPr>이 있다면 그 뒤에, 없다면 <w:r>의 첫 자식으로 <w:t> 추가
          const rPrElement = runElement.getElementsByTagName("w:rPr")[0];
          if (rPrElement) {
            runElement.insertBefore(newTextElement, rPrElement.nextSibling);
          } else {
            runElement.insertBefore(newTextElement, runElement.firstChild);
          }
        }
      } else {
        console.warn(`[handleXmlDomReplace] (text): Target for text replacement is not <w:r> but <${actualElementToModify.localName}> (ns: ${actualElementToModify.namespaceURI || 'null'}) for path ${op.path}.`);
      }
    } else if (operationSubType === 'propertiesObject' || operationSubType === 'propertyKey') {
      let targetPropertiesContainer = targetJsonState;
      elementPathSegments.forEach(seg => {
        if (targetPropertiesContainer && typeof targetPropertiesContainer === 'object' && targetPropertiesContainer.hasOwnProperty(seg)) {
          targetPropertiesContainer = targetPropertiesContainer[seg];
        } else {
          targetPropertiesContainer = null;
        }
      });

      const fullPropertiesJson = targetPropertiesContainer?.properties;
      if (fullPropertiesJson !== undefined) {
        applyPropertiesToXmlElement(actualElementToModify, fullPropertiesJson || {}, elementConfig, xmlDoc);
      } else {
        // console.warn(`[handleXmlDomReplace] (Property): Could not get updated properties object or invalid type from targetJson for element ${elementPathSegments.join('/')}. Properties in target:`, fullPropertiesJson);
      }
    } else if (operationSubType === 'directParameter') {
      // 파라미터(속성) 변경. paramFullName이 "w:val" 등의 형태여야 함.
      const paramFullName = elementConfig.parameters?.find(p => (p.includes(':') ? p.substring(p.indexOf(':') + 1) : p) === keyToReplace);
      if (paramFullName) {
        if (newJsonValueFromOp === null || newJsonValueFromOp === undefined) {
          actualElementToModify.removeAttribute(paramFullName);
        } else {
          actualElementToModify.setAttribute(paramFullName, String(newJsonValueFromOp));
        }
      }
    } else {
      // console.warn(`[handleXmlDomReplace] Unhandled non-structural replacement for key '${keyToReplace}' under element type '${elementConfig.xmlTag}'. Path: ${op.path}. OpSubType: ${operationSubType}`);
    }
  } else if (operationSubType !== 'structural' as string && !actualElementToModify) {
    console.warn(`[handleXmlDomReplace] Target element for property/text replace not found at ${elementPathSegments.join('/')}.`);
  } else if (operationSubType !== 'structural' as string && !(originalJsonNodeForElement && originalJsonNodeForElement.type)) {
    console.warn(`[handleXmlDomReplace] Original JSON node for element at ${elementPathSegments.join('/')} is invalid or missing type.`);
  }
}

// ... (나머지 service.ts 코드는 이전 답변과 동일하게 유지)