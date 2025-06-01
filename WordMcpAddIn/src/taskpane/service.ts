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
} from './converter';
import { formatXML } from './document';

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

function applyPropertiesToXmlElement( /* 이전 답변의 코드 */
  element: Element,
  propertiesJson: Record<string, any>,
  elementConfig: ElementConfig,
  xmlDoc: Document
): void {
  const propContainerKey = Object.keys(elementConfig.children || {}).find(
    key => (elementConfig.children?.[key] as ElementConfig)?.jsonKey === 'properties' || key === 'properties'
  );

  if (!propContainerKey || !elementConfig.children?.[propContainerKey]) return;
  const propContainerConfig = elementConfig.children[propContainerKey] as ElementConfig;

  let propContainerElement: Element | null = null;
  for (let i = 0; i < element.childNodes.length; i++) {
    const node = element.childNodes[i];
    if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === propContainerConfig.xmlTag) {
      propContainerElement = node as Element;
      break;
    }
  }

  if (propertiesJson && Object.keys(propertiesJson).length > 0) {
    if (!propContainerElement) {
      propContainerElement = xmlDoc.createElement(propContainerConfig.xmlTag);
      element.insertBefore(propContainerElement, element.firstChild);
    }
  } else if (propContainerElement) {
    propContainerElement.remove();
    return;
  } else {
    return;
  }

  if (!propContainerElement || !propContainerConfig.children) return;

  Array.from(propContainerElement.childNodes).forEach(childNode => {
    if (childNode.nodeType === Node.ELEMENT_NODE) {
      const existingLeafElement = childNode as Element;
      const leafKeyInConfig = Object.keys(propContainerConfig.children!).find(
        pKey => propContainerConfig.children![pKey].xmlTag === existingLeafElement.tagName
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
    if (!leafConfigKey) {
        // console.warn(`No config found for property key: ${propJsonKeyInPatch} in ${propContainerConfig.xmlTag}`);
        continue;
    }
    const leafConfig = propContainerConfig.children[leafConfigKey];

    let leafElement: Element | null = null;
    for (let i = 0; i < propContainerElement.childNodes.length; i++) {
        const node = propContainerElement.childNodes[i];
        if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === leafConfig.xmlTag) {
            leafElement = node as Element;
            break;
        }
    }

    if (propValueFromJson !== undefined && propValueFromJson !== null) {
      if (!leafElement) {
        leafElement = xmlDoc.createElement(leafConfig.xmlTag);
        propContainerElement.appendChild(leafElement);
      }
      if (leafConfig.parameters) {
        Array.from(leafElement.attributes).forEach(attr => {
          if (leafConfig.parameters!.includes(attr.name)) {
            leafElement!.removeAttribute(attr.name);
          }
        });
      }
      if (typeof propValueFromJson === 'object' && leafConfig.parameters) {
        for (const paramFullName of leafConfig.parameters) {
          const paramKeyInJson = paramFullName.includes(':') ? paramFullName.substring(paramFullName.indexOf(':') + 1) : paramFullName;
          if (propValueFromJson[paramKeyInJson] !== undefined && propValueFromJson[paramKeyInJson] !== null) {
            leafElement.setAttribute(paramFullName, String(propValueFromJson[paramKeyInJson]));
          }
        }
      } else if (leafConfig.parameters && leafConfig.parameters.includes('w:val')) {
        if (propValueFromJson === true && leafConfig.parameters.length === 1 && leafConfig.parameters[0] === 'w:val') {
          leafElement.removeAttribute('w:val');
        } else {
          leafElement.setAttribute('w:val', String(propValueFromJson));
        }
      } else if (propValueFromJson === true && (!leafConfig.parameters || leafConfig.parameters.length === 0)) {
        // Tag exists, no value needed
      }
    } else if (leafElement) {
      leafElement.remove();
    }
  }
}

function createXmlElementFromJson( /* 이전 답변의 수정된 코드 사용 */
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
  const contentElement = xmlDoc.createElement(config.xmlTag);

  if (config.parameters) {
    for (const paramFullName of config.parameters) {
      const paramKeyInJson = paramFullName.includes(':') ? paramFullName.substring(paramFullName.indexOf(':') + 1) : paramFullName;
      if (itemJson.hasOwnProperty(paramKeyInJson) && itemJson[paramKeyInJson] !== undefined) {
        contentElement.setAttribute(paramFullName, String(itemJson[paramKeyInJson]));
      }
    }
  }

  if (itemJson.properties && typeof itemJson.properties === 'object') {
    applyPropertiesToXmlElement(contentElement, itemJson.properties, config, xmlDoc);
  }

  if (itemJson.hasOwnProperty('text') && config.children?.t && config.xmlTag === 'w:r') { // run('w:r')의 text 자식은 't'
    const textConfig = config.children.t as ElementConfig;
    const textElement = xmlDoc.createElement(textConfig.xmlTag);
    if (itemJson.text !== null && itemJson.text !== undefined) {
        textElement.textContent = String(itemJson.text);
        if (String(itemJson.text).trim() === "" && String(itemJson.text).length > 0) {
            textElement.setAttribute('xml:space', 'preserve');
        } else if (String(itemJson.text) === "") {
            // <w:t/> 또는 <w:t xml:space="preserve"></w:t> (공백 없는 빈 문자열)
             textElement.setAttribute('xml:space', 'preserve'); // Word에서 빈 문자열 유지
        }
    } else { // text가 null 또는 undefined
        textElement.setAttribute('xml:space', 'preserve');
        textElement.textContent = ' '; // 빈 <w:t> 대신 공백 하나를 가진 <w:t>가 더 안정적일 수 있음
    }
    contentElement.appendChild(textElement);
  } else if (itemJson.hasOwnProperty('text') && config.children?.text) { // 일반적인 text 자식 (현재 config에는 없음)
    // 이 로직은 현재 ELEMENT_CONFIG에 'text'라는 키로 직접 정의된 자식이 없으므로 실행되지 않음
    const textConfig = config.children.text as ElementConfig;
    const textElement = xmlDoc.createElement(textConfig.xmlTag);
    if (itemJson.text !== null && itemJson.text !== undefined) {
        textElement.textContent = String(itemJson.text);
    }
    contentElement.appendChild(textElement);
  }


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

  const sdtElement = xmlDoc.createElement('w:sdt');
  const sdtPrElement = xmlDoc.createElement('w:sdtPr');
  const aliasElement = xmlDoc.createElement('w:alias');
  aliasElement.setAttribute('w:val', `${elementType} ${id}__${orderKey}`);
  sdtPrElement.appendChild(aliasElement);
  const tagElement = xmlDoc.createElement('w:tag');
  tagElement.setAttribute('w:val', id);
  sdtPrElement.appendChild(tagElement);
  const idNode = xmlDoc.createElement('w:id');
  idNode.setAttribute('w:val', String(Math.floor(Math.random() * 1000000000)));
  sdtPrElement.appendChild(idNode);
  sdtElement.appendChild(sdtPrElement);
  const sdtContentElement = xmlDoc.createElement('w:sdtContent');
  sdtContentElement.appendChild(contentElement);
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
        const aliasElement = siblingSdt.getElementsByTagNameNS(wordNs, 'alias')[0] || siblingSdt.getElementsByTagName('w:alias')[0];
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
): Promise<void> {
  try {
    await Word.run(async (context: Word.RequestContext) => {
      console.log("Office Add-in: Document update from merge patch started.");

      const ooxml = context.document.body.getOoxml();
      await context.sync();
      const fullFlatXml = ooxml.value;
      const currentDocumentXmlFromOoxml = extractDocumentXml(fullFlatXml);

      const { json: originalJson, xml: documentXmlWithIds } =
        processDocumentFromConverter(currentDocumentXmlFromOoxml);
      
      console.log("Office Add-in: Original JSON parsed (keys):", Object.keys(originalJson));
      // console.log("Original JSON (Full):\n", JSON.stringify(originalJson, null, 2));
      // console.log("Received Merge Patch:\n", JSON.stringify(mergePatch, null, 2));
      
      const targetJson = robustApplyMergePatchRecursive(originalJson, mergePatch);
      for (const key in targetJson) { // robustApplyMergePatchRecursive가 undefined를 반환한 경우 정리
          if (targetJson.hasOwnProperty(key) && targetJson[key] === undefined) {
              delete targetJson[key];
          }
      }

      console.log("Office Add-in: Target JSON constructed (keys):", Object.keys(targetJson));
      // console.log("Target JSON (Full for debugging):\n", JSON.stringify(targetJson, null, 2));

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
      // console.log("Office Add-in: Updated document.xml content:\n", formatXML(updatedDocumentXmlContent)); // formatXML 사용

      const finalFlatOpcXml = replaceOriginalWithUpdated(fullFlatXml, updatedDocumentXmlContent);
      
      context.document.body.insertOoxml(finalFlatOpcXml, Word.InsertLocation.replace);
      await context.sync();

      console.log("Office Add-in: Document successfully updated.");
    });
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
  const bodyElement = xmlDoc.getElementsByTagNameNS(wordNs, "body")[0] || xmlDoc.getElementsByTagName("w:body")[0];
  if (!bodyElement) throw new Error("w:body element not found in XML document.");

  let clonedSectPr: Node | null = null;
  const sectPrNodeList = bodyElement.getElementsByTagNameNS(wordNs, 'sectPr');
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

  for (const id of sortedTopLevelTargetIds) {
    let sdtToAppend = sdtMap.get(id);
    if (!sdtToAppend) {
        const itemJson = targetJsonState[id];
        if (itemJson && itemJson.type && itemJson.order !== undefined) {
            // console.log(`[DOM Reorder/Finalize] ID ${id} not found in DOM map, creating from targetJson.`);
            sdtToAppend = createXmlElementFromJson(id, itemJson, xmlDoc, itemJson.order);
        } else {
            console.warn(`[DOM Reorder/Finalize] Cannot create SDT for ID ${id}, itemJson invalid in targetJson.`);
            continue;
        }
    }
    if (sdtToAppend) {
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
  // console.log(`  [DOM Add] Path: ${op.path}, Value:`, JSON.stringify(valueToAdd));

  const lastSegment = pathSegments[pathSegments.length - 1];
  const secondLastSegment = pathSegments.length > 1 ? pathSegments[pathSegments.length - 2] : null;

  let elementPathSegments = [...pathSegments]; // 기본적으로 전체 경로가 요소 ID를 가리킴
  let operationSubType: 'structural' | 'text' | 'propertyKey' | 'propertiesObject' = 'structural';

  if (lastSegment === 'text') {
      operationSubType = 'text';
      elementPathSegments = pathSegments.slice(0, -1);
  } else if (lastSegment === 'properties' && typeof valueToAdd === 'object') {
      operationSubType = 'propertiesObject'; // properties 객체 전체를 추가/교체
      elementPathSegments = pathSegments.slice(0, -1);
  } else if (secondLastSegment === 'properties') {
      operationSubType = 'propertyKey'; // properties 내부의 특정 키 추가
      elementPathSegments = pathSegments.slice(0, -2);
  }
  // 그 외: path의 마지막 세그먼트가 새 구조적 요소의 ID (operationSubType = 'structural' 유지)

  let actualElementToModify: Element | null = bodyElement; // 기본값은 body (최상위 요소 추가 시)
  if (elementPathSegments.length > 0) { // 최상위 요소가 아닌 경우에만 경로 탐색
      actualElementToModify = getElementByPathRecursive(bodyElement, elementPathSegments, 0, `Add target element search for ${elementPathSegments.join('/')}`);
  }

  if (!actualElementToModify) {
      console.warn(`Add Op: Could not find target/parent XML element at path '${elementPathSegments.join('/')}' for operation on '${lastSegment}'.`);
      return;
  }

  // targetJsonState에서 실제 조작 대상 요소의 전체 JSON 정의를 가져옴
  let jsonNodeForElement = targetJsonState;
  elementPathSegments.forEach(seg => { if(jsonNodeForElement) jsonNodeForElement = jsonNodeForElement[seg]; else jsonNodeForElement = null; });

  if (operationSubType === 'structural') {
      if (typeof valueToAdd === 'object' && valueToAdd.type && valueToAdd.order !== undefined) {
          const newSdtElement = createXmlElementFromJson(lastSegment, valueToAdd, xmlDoc, valueToAdd.order);
          insertSdtInOrder(actualElementToModify, newSdtElement, valueToAdd.order, xmlDoc); // actualElementToModify는 이때 부모
      } else {
          console.warn(`Add Op (Structural): Invalid JSON for new element '${lastSegment}'. Missing type/order. Value:`, valueToAdd);
      }
  } else { // Text 또는 Property 관련 작업
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
          if (textConfig) {
              const oldTextNodes = actualElementToModify.getElementsByTagName(textConfig.xmlTag);
              for(let i=0; i<oldTextNodes.length; i++) { if(oldTextNodes[i].parentNode === actualElementToModify) oldTextNodes[i].remove(); }

              const textElement = xmlDoc.createElement(textConfig.xmlTag);
              if (valueToAdd !== null && valueToAdd !== undefined) {
                  textElement.textContent = String(valueToAdd);
                  if (String(valueToAdd) === "") textElement.setAttribute('xml:space', 'preserve');
              }
              actualElementToModify.appendChild(textElement);
          }
      } else if (operationSubType === 'propertiesObject' || operationSubType === 'propertyKey') {
          // targetJson에서 항상 최신 properties 객체 전체를 가져와서 적용
          const fullPropertiesJson = jsonNodeForElement.properties;
          if (fullPropertiesJson && typeof fullPropertiesJson === 'object') {
              applyPropertiesToXmlElement(actualElementToModify, fullPropertiesJson, elementConfig, xmlDoc);
          } else if (operationSubType === 'propertiesObject' && valueToAdd && typeof valueToAdd === 'object'){
              // properties 객체 자체가 추가되는 경우 (원래 properties가 없었을 때)
              applyPropertiesToXmlElement(actualElementToModify, valueToAdd, elementConfig, xmlDoc);
          }
          else {
              console.warn(`Add Op (Property): Expected full properties object for ${actualElementToModify.tagName} at path ${elementPathSegments.join('/')}/properties, but targetJson has:`, fullPropertiesJson);
          }
      } else {
           console.warn(`Add Op: Unhandled non-structural addition for key '${lastSegment}' under element type '${elementConfig.xmlTag}'. Path: ${op.path}.`);
      }
  }
}

// service.ts

// ... (다른 함수들은 이전 답변과 동일하게 유지) ...

function handleXmlDomReplace(
  op: ReplaceOperation<any>,
  xmlDoc: Document,
  bodyElement: Element,
  targetJsonState: Record<string, any>,
  originalJsonState: Record<string, any>
) {
  const pathSegments = op.path.substring(1).split('/');
  const newJsonValueFromOp = op.value;
  // console.log(`  [DOM Replace] Path: ${op.path}, New value:`, newJsonValueFromOp);

  const keyToReplace = pathSegments[pathSegments.length - 1];
  let elementPathSegments = [...pathSegments];
  // ❗ 변수명 일치: operationType -> operationSubType
  let operationSubType: 'structural' | 'text' | 'propertyKey' | 'propertiesObject' | 'directParameter' = 'structural';

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
      }
      // directParameter에 대한 operationSubType 결정 로직 추가 가능 (필요하다면)
      else if (ELEMENT_CONFIG[originalJsonState[elementPathSegments.slice(0, -1).join('/')]?.type]?.parameters?.some(p => (p.includes(':') ? p.substring(p.indexOf(':') + 1) : p) === keyToReplace)) {
        operationSubType = 'directParameter';
        elementPathSegments = pathSegments.slice(0, -1);
      }
  }
  // console.log(`  [DOM Replace] Element Path: ${elementPathSegments.join(' -> ')}, OpSubType: ${operationSubType}, Key: ${keyToReplace}`);

  const actualElementToModify = getElementByPathRecursive(bodyElement, elementPathSegments, 0, `Replace target element search for path: ${elementPathSegments.join('/')}`);

  // ❗ 변수명 일치: operationType -> operationSubType
  if (!actualElementToModify && !(operationSubType === 'structural' && elementPathSegments.length === 0 && pathSegments.length === 1) ) {
      console.warn(`Replace Op: Could not find target XML element at path '${elementPathSegments.join('/')}' to replace '${keyToReplace}'.`);
      return;
  }
  
  let originalJsonNodeForElement = originalJsonState;
  elementPathSegments.forEach(seg => { if(originalJsonNodeForElement && originalJsonNodeForElement.hasOwnProperty(seg)) originalJsonNodeForElement = originalJsonNodeForElement[seg]; else originalJsonNodeForElement = null; });
  
  // ❗ 변수명 일치: operationType -> operationSubType
  if (operationSubType === 'structural') {
      if (typeof newJsonValueFromOp === 'object' && newJsonValueFromOp !== null && newJsonValueFromOp.type && newJsonValueFromOp.order !== undefined) {
          let parentForSdtReplace: Element | null = bodyElement;
           if (elementPathSegments.length > 0 && keyToReplace !== elementPathSegments[elementPathSegments.length-1] ){
               parentForSdtReplace = actualElementToModify;
          }

          if (parentForSdtReplace) {
              const oldSdt = findSdtElementById(parentForSdtReplace, keyToReplace);
              if (oldSdt && oldSdt.parentNode === parentForSdtReplace) oldSdt.remove();
              
              const newSdt = createXmlElementFromJson(keyToReplace, newJsonValueFromOp, xmlDoc, newJsonValueFromOp.order);
              insertSdtInOrder(parentForSdtReplace, newSdt, newJsonValueFromOp.order, xmlDoc);
          } else {
              console.warn(`Replace Op (Structural): Could not determine parent for replacing SDT ${keyToReplace}.`);
          }
      } else {
          console.warn(`Replace Op (Structural): Invalid JSON for replacement element ${keyToReplace}. Value:`, newJsonValueFromOp);
      }
  // ❗ 변수명 일치: operationType -> operationSubType (else if 조건에서도)
  } else if (actualElementToModify && originalJsonNodeForElement && originalJsonNodeForElement.type) {
      const elementConfig = ELEMENT_CONFIG[originalJsonNodeForElement.type];
      if (!elementConfig) {
           console.warn(`Replace Op: No ELEMENT_CONFIG for type ${originalJsonNodeForElement.type} at path ${elementPathSegments.join('/')}.`);
           return;
      }

      if (operationSubType === 'text') { // ❗ 변수명 일치
          const textConfig = (elementConfig.xmlTag === 'w:r' && elementConfig.children?.t) ? elementConfig.children.t : elementConfig.children?.text;
          if(textConfig){
              let textNode = actualElementToModify.getElementsByTagName(textConfig.xmlTag)[0];
              if (newJsonValueFromOp === null || newJsonValueFromOp === undefined) {
                  if(textNode && textNode.parentNode === actualElementToModify) textNode.remove();
              } else {
                  if (!textNode || textNode.parentNode !== actualElementToModify) {
                      const oldTextNodes = actualElementToModify.getElementsByTagName(textConfig.xmlTag);
                      for(let i=0; i<oldTextNodes.length; i++) { if(oldTextNodes[i].parentNode === actualElementToModify) oldTextNodes[i].remove(); }
                      textNode = xmlDoc.createElement(textConfig.xmlTag);
                      actualElementToModify.appendChild(textNode);
                  }
                  textNode.textContent = String(newJsonValueFromOp);
                  if (String(newJsonValueFromOp) === "") textNode.setAttribute('xml:space', 'preserve');
                  else textNode.removeAttribute('xml:space');
              }
          } else {
               console.warn(`Replace Op: No text config for element type ${elementConfig.xmlTag} (ID: ${elementPathSegments.join('/')})`);
          }
      } else if (operationSubType === 'propertyKey' || operationSubType === 'propertiesObject') { // ❗ 변수명 일치
          let targetPropertiesContainer = targetJsonState;
          elementPathSegments.forEach(seg => {if(targetPropertiesContainer) targetPropertiesContainer = targetPropertiesContainer[seg]; else targetPropertiesContainer = null; });
          
          const fullPropertiesJson = targetPropertiesContainer?.properties;
          if (fullPropertiesJson && typeof fullPropertiesJson === 'object') {
               applyPropertiesToXmlElement(actualElementToModify, fullPropertiesJson, elementConfig, xmlDoc);
          } else if ( (fullPropertiesJson === null || fullPropertiesJson === undefined) && operationSubType === 'propertiesObject' ) {  // ❗ 변수명 일치
               applyPropertiesToXmlElement(actualElementToModify, {}, elementConfig, xmlDoc);
          }
          else {
               console.warn(`Replace Op: Could not get updated properties object or invalid type from targetJson for element ${elementPathSegments.join('/')}. Properties in target:`, fullPropertiesJson);
          }
      } else if (operationSubType === 'directParameter') { // ❗ 변수명 일치
          const paramFullName = elementConfig.parameters?.find(p => (p.includes(':') ? p.substring(p.indexOf(':') + 1) : p) === keyToReplace);
          if (paramFullName) {
              if (newJsonValueFromOp === null || newJsonValueFromOp === undefined) {
                  actualElementToModify.removeAttribute(paramFullName);
              } else {
                  actualElementToModify.setAttribute(paramFullName, String(newJsonValueFromOp));
              }
          }
      } else {
          console.warn(`Replace Op: Unhandled non-structural replacement for key '${keyToReplace}' under element type '${elementConfig.xmlTag}'. Path: ${op.path}. OpSubType: ${operationSubType}`);
      }
  } else if (!actualElementToModify && operationSubType !== 'structural' as string) { // ❗ 변수명 일치 (그리고 이 조건은 이제 TypeScript 오류 없이 유효)
      console.warn(`Replace Op: Target element for property/text replace not found at ${elementPathSegments.join('/')}`);
  }
}

// ... (나머지 service.ts 코드는 이전 답변과 동일하게 유지)