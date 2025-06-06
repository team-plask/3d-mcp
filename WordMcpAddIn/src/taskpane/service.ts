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
  DEFAULT_SDT_IDENTIFIER_BY_ELEMENT_TYPE,
  UNIVERSAL_DEFAULT_SDT_IDENTIFIER,
  SDT_CHOICE_TAG_FROM_CONFIG_TYPE
} from './converter';
import { formatXML } from './document';

const NS_W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const NS_R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

// --- Helper Functions (extractDocumentXml, replaceOriginalWithUpdated, findSdtElementById, createXmlElementFromJson, robustApplyMergePatchRecursive, insertSdtInOrder) ---
// 이 함수들은 이전 답변의 내용으로 가정하고 생략합니다.
// createXmlElementFromJson의 text 처리 로직이 이전 답변처럼 수정되었다고 가정합니다.
function extractDocumentXml(flatXml: string): string {
  if (flatXml.indexOf('<pkg:package') === -1) {
    return flatXml.trim();
  }
  const partMatch = flatXml.match(
    /<pkg:part[^>]*pkg:name="\/word\/document\.xml"[^>]*>[\s\S]*?<\/pkg:part>/i
  );
  if (!partMatch) throw new Error('document.xml part not found in Flat-OPC');
  const xmlMatch = partMatch[0].match(
    /<pkg:xmlData[^>]*>([\s\S]*?)<\/pkg:xmlData>/i
  );
  if (!xmlMatch) throw new Error('pkg:xmlData section missing in document.xml part');
  return xmlMatch[1].trim();
}

function replaceOriginalWithUpdated(originalFullFlatXml: string, updatedDocumentXmlContent: string): string {
  if (originalFullFlatXml.indexOf('<pkg:package') !== -1) {
    const partMatch = originalFullFlatXml.match(
      /(<pkg:part[^>]*pkg:name="\/word\/document\.xml"[^>]*>)([\s\S]*?)(<\/pkg:part>)/i
    );
    if (!partMatch) {
      return updatedDocumentXmlContent;
    }
    const xmlDataContainerMatch = partMatch[2].match(
      /(<pkg:xmlData[^>]*>)([\s\S]*?)(<\/pkg:xmlData>)/i
    );
    if (!xmlDataContainerMatch) {
      throw new Error('pkg:xmlData container not found in document.xml part.');
    }
    const originalDocContentInXmlData = xmlDataContainerMatch[2];
    const originalDocRootMatch = originalDocContentInXmlData.match(/<w:document([^>]*)>/i);
    let finalUpdatedDocumentXmlForEmbedding = updatedDocumentXmlContent;
    if (originalDocRootMatch && originalDocRootMatch[1]) {
        const updatedDocRootMatch = updatedDocumentXmlContent.match(/<w:document[^>]*>/i);
        if (updatedDocRootMatch) {
            finalUpdatedDocumentXmlForEmbedding = updatedDocumentXmlContent.replace(
                updatedDocRootMatch[0],
                `<w:document${originalDocRootMatch[1]}>`
            );
        }
    }
    const updatedXmlDataContent = `${xmlDataContainerMatch[1]}${finalUpdatedDocumentXmlForEmbedding}${xmlDataContainerMatch[3]}`;
    return originalFullFlatXml.replace(partMatch[2], updatedXmlDataContent);
  }
  return updatedDocumentXmlContent;
}

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
  // console.log("element", element);
  // console.log("propertiesJson", propertiesJson);
  // console.log("elementConfig", elementConfig);

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

// service.ts

// 가정: NS_W, NS_R, ELEMENT_CONFIG, applyPropertiesToXmlElement,
// DEFAULT_SDT_IDENTIFIER_BY_ELEMENT_TYPE, UNIVERSAL_DEFAULT_SDT_IDENTIFIER,
// SDT_CHOICE_TAG_FROM_CONFIG_TYPE 등은 이미 정의되어 있다고 가정합니다.

const NS_XML = "http://www.w3.org/XML/1998/namespace"; // xml:space 용 네임스페이스

function createXmlElementFromJson(
  id: string,
  itemJson: Record<string, any>,
  xmlDoc: Document,
  orderKey: string
): Element {
  const elementType = itemJson.type as string;
  if (!elementType || !ELEMENT_CONFIG[elementType]) {
    throw new Error(`[createXmlElementFromJson] Unsupported element type: ${itemJson.type} for ID: ${id}. JSON: ${JSON.stringify(itemJson)}`);
  }
  const config = ELEMENT_CONFIG[elementType];

  // createElementNS 대신 createElement 사용, 태그 이름에 접두사 포함 (예: "w:p")
  const contentElement = xmlDoc.createElement(config.xmlTag);

  if (config.parameters) {
    for (const paramFullName of config.parameters) { // paramFullName은 "w:val", "r:id" 등의 형태
      const paramKeyInJson = paramFullName.includes(':') ? paramFullName.substring(paramFullName.indexOf(':') + 1) : paramFullName;

      if (itemJson.hasOwnProperty(paramKeyInJson) && itemJson[paramKeyInJson] !== undefined && itemJson[paramKeyInJson] !== null) {
        // setAttributeNS 대신 setAttribute 사용, 속성 이름에 접두사 포함
        contentElement.setAttribute(paramFullName, String(itemJson[paramKeyInJson]));
      }
    }
  }

  if (itemJson.properties && typeof itemJson.properties === 'object') {
    // applyPropertiesToXmlElement 함수 내부에서도 네임스페이스 처리 방식을 확인/통일해야 합니다.
    applyPropertiesToXmlElement(contentElement, itemJson.properties, config, xmlDoc);
  } else if (config.xmlTag === 'w:p' && !contentElement.getElementsByTagName("w:pPr")[0]) {
    // pPr 요소가 없는 경우 기본 pPr 추가 (w: 접두사 사용)
    const pPrElement = xmlDoc.createElement("w:pPr");
    contentElement.insertBefore(pPrElement, contentElement.firstChild);
  }

  if (itemJson.hasOwnProperty('text') && config.children?.t && config.xmlTag === 'w:r') {
    const textConfig = config.children.t as ElementConfig; // textConfig.xmlTag는 "w:t"로 가정
    const textElement = xmlDoc.createElement(textConfig.xmlTag); // "w:t"

    if (itemJson.text !== null && itemJson.text !== undefined) {
      const textContentStr = String(itemJson.text);
      textElement.textContent = textContentStr;
      if (textContentStr === "" || textContentStr.startsWith(" ") || textContentStr.endsWith(" ") || textContentStr.includes("  ")) {
        // 'xml:space'는 'xml' 네임스페이스에 속합니다.
        // setAttributeNS를 사용하는 것이 더 정확하지만, setAttribute도 대부분의 경우 동작합니다.
        textElement.setAttribute('xml:space', 'preserve');
      } else {
        // xml:space 속성이 필요 없는 경우 제거할 수 있습니다.
        // textElement.removeAttribute('xml:space'); // 명시적으로 제거하거나, 아예 설정하지 않음
      }
    } else {
      textElement.textContent = '';
      textElement.setAttribute('xml:space', 'preserve');
    }
    contentElement.appendChild(textElement);
  }

  // 자식 요소 재귀적으로 생성
  const childItemKeys = Object.keys(itemJson).filter(
    key =>
      key !== 'type' && key !== 'order' && key !== 'properties' && key !== 'text' &&
      !(config.parameters && config.parameters.map(p => p.includes(':') ? p.substring(p.indexOf(':') + 1) : p).includes(key)) &&
      itemJson[key] && typeof itemJson[key] === 'object' && ELEMENT_CONFIG[itemJson[key]?.type]
  );
  childItemKeys.sort((a, b) => (itemJson[a]?.order || '').localeCompare(itemJson[b]?.order || ''));
  for (const childKey of childItemKeys) {
    const childJson = itemJson[childKey];
    const childSdtElement = createXmlElementFromJson(childKey, childJson, xmlDoc, childJson.order);
    contentElement.appendChild(childSdtElement);
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
  sdtElement.appendChild(sdtContentElement);

  return sdtElement;
}

function robustApplyMergePatchRecursive( /* 이전 답변의 코드와 동일 */
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
        ? JSON.parse(JSON.stringify(original)) // Ensure deep copy for modification
        : {};
    // Ensure type and order are preserved or taken from patch
    if (patch.hasOwnProperty('type')) SPREADSHEET_TARGET.type = patch.type;
    else if (original && original.hasOwnProperty('type')) SPREADSHEET_TARGET.type = original.type;

    if (patch.hasOwnProperty('order')) SPREADSHEET_TARGET.order = patch.order;
    else if (original && original.hasOwnProperty('order')) SPREADSHEET_TARGET.order = original.order;
    
    for (const key in patch) {
        if (!patch.hasOwnProperty(key)) continue;
        if (key === 'type' || key === 'order') continue; // Already handled

        const patchValue = patch[key];
        const originalValueForKey = (typeof original === 'object' && original !== null) ? original[key] : undefined;

        if (patchValue === null) { // RFC 7396: If the value is null, the member is removed from the target.
            delete SPREADSHEET_TARGET[key];
        } else { // Otherwise, the value is replaced or added.
            SPREADSHEET_TARGET[key] = robustApplyMergePatchRecursive(originalValueForKey, patchValue);
        }
    }
    // Ensure keys only in original (and not in patch, thus not processed above) are kept if original was an object
    if(typeof original === 'object' && original !== null && !Array.isArray(original)){
        for(const originalKey in original){
            if(original.hasOwnProperty(originalKey) && !patch.hasOwnProperty(originalKey)){
                 // type and order are already handled with priority to patch or original.
                 // Other original properties/children not touched by patch should remain.
                 // This is already covered by SPREADSHEET_TARGET = { ...original } if original is an object.
                 // However, robustApplyMergePatchRecursive on children might have returned undefined
                 if (SPREADSHEET_TARGET[originalKey] === undefined && original[originalKey] !== undefined) {
                    SPREADSHEET_TARGET[originalKey] = JSON.parse(JSON.stringify(original[originalKey]));
                 }
            }
        }
    }
    return SPREADSHEET_TARGET;
}


function getElementByPathRecursive(
  currentSearchRoot: Element,
  pathSegments: string[], // 찾아야 할 ID들의 배열 (예: ["p_1", "r_1"])
  pathIndex: number,
  operationDesc: string
): Element | null {
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

      console.log("Office Add-in: Current document.xml content extracted from OOXML:", formatXML(currentDocumentXmlFromOoxml));
      const { json: originalJson, xml: documentXmlWithIds } =
        processDocumentFromConverter(currentDocumentXmlFromOoxml);
      
      console.log("Office Add-in: Original JSON parsed:", originalJson);
      // console.log("Original JSON (Full):\n", JSON.stringify(originalJson, null, 2));
      // console.log("Received Merge Patch:\n", JSON.stringify(mergePatch, null, 2));
      
      const targetJson = robustApplyMergePatchRecursive(originalJson, mergePatch);
      for (const key in targetJson) { // robustApplyMergePatchRecursive가 undefined를 반환한 경우 정리
          if (targetJson.hasOwnProperty(key) && targetJson[key] === undefined) {
              delete targetJson[key];
          }
      }

      console.log("Office Add-in: Target JSON constructed:", targetJson);
      console.log("Target JSON (Full for debugging):\n", JSON.stringify(targetJson, null, 2));

      const operations: Operation[] = compare(originalJson, targetJson);
      console.log("Office Add-in: Generated JSON Patch Operations (count):", operations.length);
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

  operations.forEach(op => {
    console.log(`Applying DOM Op: ${op.op}, Path: ${op.path}`);    
    try {
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
    } catch(e) {
        console.error(`Error applying DOM operation ${JSON.stringify(op)}:`, e);
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
      
      const actualElementToModify = getElementByPathRecursive(bodyElement, elementPathSegments, 0, "Remove target element search");
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

// 가정: createXmlElementFromJson, insertSdtInOrder, getElementByPathRecursive,
// ELEMENT_CONFIG, applyPropertiesToXmlElement, NS_W 등은 이미 정의되어 있다고 가정합니다.
// NS_XML은 "http://www.w3.org/XML/1998/namespace"로 가정합니다.

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

  let actualElementToModify: Element | null = bodyElement;
  if (elementPathSegments.length > 0) {
    actualElementToModify = getElementByPathRecursive(bodyElement, elementPathSegments, 0, `Add target element search for ${elementPathSegments.join('/')}`);
  }

  if (!actualElementToModify) {
    console.warn(`Add Op: Could not find target/parent XML element at path '${elementPathSegments.join('/')}' for operation on '${lastSegment}'.`);
    return;
  }

  let jsonNodeForElement = targetJsonState;
  elementPathSegments.forEach(seg => { if (jsonNodeForElement) jsonNodeForElement = jsonNodeForElement[seg]; else jsonNodeForElement = null; });

  if (operationSubType === 'structural') {
    if (typeof valueToAdd === 'object' && valueToAdd.type && valueToAdd.order !== undefined) {
      // createXmlElementFromJson 함수는 이미 createElement를 사용하도록 수정되었다고 가정합니다.
      const newSdtElement = createXmlElementFromJson(lastSegment, valueToAdd, xmlDoc, valueToAdd.order);
      insertSdtInOrder(actualElementToModify, newSdtElement, valueToAdd.order, xmlDoc);
    } else {
      console.warn(`Add Op (Structural): Invalid JSON for new element '${lastSegment}'. Missing type/order. Value:`, valueToAdd);
    }
  } else {
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

// service.ts
// 가정: createXmlElementFromJson, insertSdtInOrder, getElementByPathRecursive, findSdtElementById,
// ELEMENT_CONFIG, applyPropertiesToXmlElement, NS_W 등은 이미 정의되어 있다고 가정합니다.
// NS_XML은 "http://www.w3.org/XML/1998/namespace"로 가정합니다.

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

  const actualElementToModify = (operationSubType === 'structural' && elementPathSegments.length === 0)
    ? bodyElement // 최상위 구조 변경 (실제로는 parentForSdtReplace가 bodyElement가 됨)
    : getElementByPathRecursive(bodyElement, elementPathSegments, 0, `Replace target for ${op.path}`);

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