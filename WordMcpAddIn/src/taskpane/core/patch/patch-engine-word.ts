// src/core/patch-engine.ts

import { compare, Operation, AddOperation, RemoveOperation, ReplaceOperation } from 'fast-json-patch';
import type { IHostConfig, ElementConfig } from '../../configs/config.interface';
import * as JsonUtils from '../json-utils'; // JSON 유틸리티 함수들
import * as XmlUtils from '../xml-utils'; // XML 유틸리티 함수들
import { config } from 'process';

// ===================================================================================
// I. 메인 함수 (Main Exported Function)
// ===================================================================================

export function applyPatchToSingleXml(
  xmlStringWithIds: string,
  originalJson: Record<string, any>,
  mergePatch: Record<string, any>,
  config: IHostConfig
): string {
    const targetJson = JsonUtils.robustApplyMergePatchRecursive(originalJson, mergePatch);
    const operations = compare(originalJson, targetJson);
    if (operations.length === 0) return xmlStringWithIds;

  if (operations.length === 0) {
    console.log("[PatchEngine] No changes to apply.");
    return xmlStringWithIds;
  }

  const validOperations = operations.filter(op => typeof op === 'object' && op !== null && op.op) as Operation[];
  if (validOperations.length !== operations.length) {
      console.warn("Warning: Invalid operations were filtered out.");
  }

  if (validOperations.length === 0 && JSON.stringify(originalJson) === JSON.stringify(targetJson)) {
    console.log("Office Add-in: No effective changes to apply based on the merge patch.");
    return;
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlStringWithIds, "application/xml");

  // 범용 DOM 조작 함수 호출
  applyOperationsToXmlDom(operations, xmlDoc, targetJson, originalJson, config);
  
  const serializer = new XMLSerializer();
  return serializer.serializeToString(xmlDoc.documentElement);
}

/**
 * [Word용] 단일 XML 파트에 JSON 패치를 적용합니다.
 */
export function applyPatchToMultiPart(
    originalParts: Map<string, string>, // 이제 string을 직접 받음
    originalJson: Record<string, any>,
    mergePatch: Record<string, any | null>,
    config: IHostConfig
  ): Map<string, string> {
    const updatedParts = new Map<string, string>();
    const targetJson = JsonUtils.robustApplyMergePatchRecursive(originalJson, mergePatch);
    const operations = compare(originalJson, targetJson);
    if (operations.length === 0) return updatedParts;
  
    // 1. 공유 문자열(Shared Strings) 처리
    const sharedStringsOps = operations.filter(op => op.path.includes('/cells/') && op.path.includes('/value'));
    if (sharedStringsOps.length > 0) {
        const allStrings = getAllStringCellValues(targetJson.sheets);
        const newSharedStringsXml = rebuildSharedStringsXml(allStrings, config);
        updatedParts.set('/xl/sharedStrings.xml', newSharedStringsXml);
    }
  
    // 2. 스타일 변경 처리
    const styleOps = operations.filter(op => op.path.startsWith('/styles'));
    if (styleOps.length > 0) {
        const { xml: newStylesXml } = rebuildStylesXml(targetJson.styles, config);
        updatedParts.set('/xl/styles.xml', newStylesXml);
    }
  
    // 3. 시트 데이터 변경 처리
    const sheetOps = operations.filter(op => op.path.startsWith('/sheets/'));
    const affectedSheets = new Set(sheetOps.map(op => op.path.split('/')[2]));
    affectedSheets.forEach(sheetId => { // for...of 대신 forEach 사용
        const sheetPath = findSheetPath(originalJson, sheetId);
        if (sheetPath) {
            const newSheetXml = rebuildSheetXml(
                targetJson.sheets[sheetId],
                targetJson.styles, // targetJson의 스타일 정보를 전달
                getAllStringCellValues(targetJson.sheets), // 최신 공유 문자열 목록 전달
                config
            );
            updatedParts.set(sheetPath, newSheetXml);
        }
    });
    
    
      // TODO: 4. 시트 순서/이름 변경 -> workbook.xml 수정
  
      return updatedParts;
  }


// ===================================================================================
// II. 내부 XML DOM 조작 함수들 (Internal Helper Functions)
// ===================================================================================

/**
 * [개선] 생성된 Operation들을 기반으로 XML DOM을 직접 수정합니다.
 */
function applyOperationsToXmlDom(
  operations: Operation[],
  xmlDoc: Document,
  targetJsonState: Record<string, any>,
  originalJsonState: Record<string, any>,
  config: IHostConfig
): void {
  const bodyElement = xmlDoc.getElementsByTagName(config.bodyTag)[0];
  if (!bodyElement) throw new Error(`Body tag '${config.bodyTag}' not found in XML.`);
  
  // [수정] 'clonedSectPr' 변수 선언 추가
  let clonedSectPr: Node | null = null;
  const sectPrNodeList = bodyElement.getElementsByTagNameNS(config.namespaces.w, "sectPr");
  if (sectPrNodeList.length > 0 && sectPrNodeList[0].parentNode === bodyElement) {
      clonedSectPr = sectPrNodeList[0].cloneNode(true);
      sectPrNodeList[0].remove();
  }

  const tableSyncJobs = new Map<string, Operation[]>();
  const otherOps: Operation[] = [];

  // [개선] findTableIdInPath 로직 단순화
  const findTableIdInPath = (path: string): string | null => {
    const segments = path.substring(1).split('/');
    // 수정: 세그먼트 자체가 테이블의 ID이거나, targetJsonState에서 타입이 테이블인 경우를 모두 찾음
    return segments.find(seg => targetJsonState[seg]?.type === 'table') || null;
  };

  for (const op of operations) {
    const tableId = findTableIdInPath(op.path);
    if (tableId) {
      if (!tableSyncJobs.has(tableId)) tableSyncJobs.set(tableId, []);
      tableSyncJobs.get(tableId)!.push(op);
    } else {
      otherOps.push(op);
    }
  }

  operations.forEach(op => {
    try {
      switch (op.op) {
        case 'remove':
          handleXmlDomRemove(op as RemoveOperation, xmlDoc, bodyElement, originalJsonState, config);
          break;
        case 'add':
          handleXmlDomAdd(op as AddOperation<any>, xmlDoc, bodyElement, targetJsonState, config);
          break;
        case 'replace':
          handleXmlDomReplace(op as ReplaceOperation<any>, xmlDoc, bodyElement, targetJsonState, originalJsonState, config);
          break;
      }
    } catch (e) {
      console.error(`[PatchEngine] Error applying operation ${JSON.stringify(op)}:`, e);
    }
  });
  console.log("--- Phase 2: Syncing Tables ---");
  // [수정] for...of 대신 forEach를 사용하여 TS 호환성 문제 해결
  tableSyncJobs.forEach((ops, tableId) => {
    console.log(`Syncing table '${tableId}' based on ${ops.length} related operations.`);
    syncTableFromState(tableId, xmlDoc, targetJsonState, bodyElement, config);
  });

  // [개선] 최종 순서 재정렬 로직 수정
  // 이미 올바르게 자리를 잡은 테이블은 건드리지 않고,
  // 나머지 최상위 요소들의 순서만 맞추거나 누락된 것을 추가합니다.
  const finalTopLevelIds = Object.keys(targetJsonState).filter(id => !JsonUtils.findObjectInNestedJson(targetJsonState, id));
  
  const finalSdtMap = new Map<string, Element>();
  Array.from(bodyElement.children).filter(c => c.tagName === 'w:sdt').forEach(sdt => {
      const tagEl = (sdt as Element).getElementsByTagNameNS(config.namespaces.w, 'tag')[0];
      const id = tagEl?.getAttribute('w:val');
      if (id) finalSdtMap.set(id, sdt as Element);
  });
  
  const sortedTopLevelTargetIds = finalTopLevelIds
    .filter(id => targetJsonState[id]?.type) // 유효한 타입이 있는 요소만
    .sort((a, b) => (targetJsonState[a]?.order || "").localeCompare(targetJsonState[b]?.order || ""));

  // 기존 요소를 모두 지우기보다, 순서에 맞게 재배치하거나 새로 추가
  sortedTopLevelTargetIds.forEach(id => {
      const sdtElement = finalSdtMap.get(id);
      if (sdtElement) {
          bodyElement.appendChild(sdtElement); // 순서대로 다시 붙여넣기
      } else {
          // 1단계에서 추가되지 않은 요소(예: 빈 문서에 새로 추가)가 있다면 여기서 생성
          const itemJson = targetJsonState[id];
          if (itemJson) {
              const newSdt = XmlUtils.createXmlElementFromJson(id, itemJson, xmlDoc, itemJson.order, config);
              bodyElement.appendChild(newSdt);
          }
      }
  });


  if (clonedSectPr) {
    bodyElement.appendChild(clonedSectPr);
  }
}

function syncTableFromState(
  tableId: string,
  xmlDoc: Document,
  targetJsonState: Record<string, any>,
  bodyElement: Element,
  config: IHostConfig
) {
  const tableJson = JsonUtils.findObjectInNestedJson(targetJsonState, tableId);

  if (!tableJson) {
    const sdtToRemove = XmlUtils.findSdtElementById(xmlDoc.documentElement, tableId);
    if (sdtToRemove) sdtToRemove.remove();
    return;
  }
  
  let tableSdt = XmlUtils.findSdtElementById(xmlDoc.documentElement, tableId);
  
  // 테이블 SDT가 없다면, 뼈대만 있는 테이블을 새로 생성하여 DOM에 추가
  if (!tableSdt) {
    tableSdt = XmlUtils.createXmlElementFromJson(tableId, tableJson, xmlDoc, tableJson.order, config);
    XmlUtils.insertSdtInOrder(bodyElement, tableSdt, tableJson.order, xmlDoc);
  }

  const tableElement = tableSdt.getElementsByTagNameNS(config.namespaces.w, 'tbl')[0];
  if (!tableElement) {
    console.error(`Could not find or create <w:tbl> for table ID '${tableId}'`);
    return;
  }

  // [핵심] 기존 행(<w:tr>)들을 모두 삭제하여 테이블 내용을 비움
  const existingTrs = Array.from(tableElement.getElementsByTagNameNS(config.namespaces.w, 'tr'));
  existingTrs.forEach(tr => tr.remove());
  
  // `targetJsonState`를 기준으로 행과 셀을 새로 만듦
  if (Array.isArray(tableJson.rows)) {
    tableJson.rows.forEach((rowJson: any) => {
      const trElement = xmlDoc.createElementNS(config.namespaces.w, 'tr');

      // 행 속성 적용
      if (rowJson.properties && config.elementConfig.tableRow) {
        XmlUtils.applyPropertiesToXmlElement(trElement, rowJson.properties, config.elementConfig.tableRow, xmlDoc, config);
      }
      
      // 셀 생성 및 추가
      if (Array.isArray(rowJson.cells)) {
        rowJson.cells.forEach((cellId: string) => {
          const cellJson = tableJson[cellId]; // 테이블 JSON 객체 내에서 셀 정의를 찾음
          if (cellJson) {
            const cellSdt = XmlUtils.createXmlElementFromJson(cellId, cellJson, xmlDoc, cellJson.order, config);
            trElement.appendChild(cellSdt);
          }
        });
      }
      tableElement.appendChild(trElement);
    });
  }
}

/**
 * [개선] 'remove' operation을 처리합니다.
 */
function handleXmlDomRemove(
  op: RemoveOperation,
  xmlDoc: Document,
  bodyElement: Element,
  originalJsonState: Record<string, any>,config: IHostConfig
) {
  const pathSegments = op.path.substring(1).split('/');
  // console.log(`  [DOM Remove] Path segments: ${pathSegments.join(' -> ')}`);
  
  if (pathSegments.length === 1) { // 최상위 요소 삭제
      const sdtElement = XmlUtils.findSdtElementById(bodyElement, pathSegments[0]);
      if (sdtElement && sdtElement.parentNode === bodyElement) sdtElement.remove();
      else console.warn(`Remove Op: Top-level SDT for ID ${pathSegments[0]} not found or not direct child of body.`);
  } else { 
      const keyToRemove = pathSegments[pathSegments.length - 1];
      const elementPathSegments = pathSegments.slice(0, pathSegments[pathSegments.length - 2] === 'properties' ? -2 : -1);
      
      const elementIdToFind = elementPathSegments[elementPathSegments.length - 1];

      const actualElementToModify = XmlUtils.findElementBySdtId(xmlDoc, elementIdToFind, "Remove target element search");
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
      const elementConfig = config.elementConfig[jsonNodeForElement.type];
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
          const childSdtToRemove = XmlUtils.findSdtElementById(actualElementToModify, keyToRemove);
          if (childSdtToRemove && childSdtToRemove.parentNode === actualElementToModify) childSdtToRemove.remove();
          else console.warn(`Remove Op: Child SDT '${keyToRemove}' not found directly under ${actualElementToModify.tagName} (ID: ${elementPathSegments.pop()}).`);
      }
  }
}

function handleXmlDomAdd(
  op: AddOperation<any>,
  xmlDoc: Document,
  bodyElement: Element,
  targetJsonState: Record<string, any>,
  config: IHostConfig
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
      actualElementToModify = XmlUtils.findElementBySdtId(xmlDoc, parentId, `Structural Add Parent Search: ${parentId}`);
    }
  } else {
    // 텍스트/속성 추가: 경로 자체가 수정 대상 요소를 가리킴
    if (elementPathSegments.length > 0) {
        const elementIdToFind = elementPathSegments[elementPathSegments.length - 1];
        actualElementToModify = XmlUtils.findElementBySdtId(xmlDoc, elementIdToFind, `Property/Text Add Target Search: ${elementIdToFind}`);
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
      const newSdtElement = XmlUtils.createXmlElementFromJson(newStructuralElementId!, valueToAdd, xmlDoc, valueToAdd.order, config);
      XmlUtils.insertSdtInOrder(actualElementToModify, newSdtElement, valueToAdd.order, xmlDoc);
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
    const elementConfig = config.elementConfig[jsonNodeForElement.type];
    if (!elementConfig) {
      console.warn(`Add Op: No ELEMENT_CONFIG for type ${jsonNodeForElement.type}.`);
      return;
    }

    if (operationSubType === 'text') {
      const textConfig = (elementConfig.xmlTag === 'w:r' && elementConfig.children?.t) ? elementConfig.children.t : elementConfig.children?.text;
      if (textConfig && actualElementToModify.localName === 'w:r') { // 실제 조작 대상이 <w:r>인지 확인
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
        XmlUtils.applyPropertiesToXmlElement(actualElementToModify, fullPropertiesJson, elementConfig, xmlDoc);
      } else if (operationSubType === 'propertiesObject' && valueToAdd && typeof valueToAdd === 'object') {
        XmlUtils.applyPropertiesToXmlElement(actualElementToModify, valueToAdd, elementConfig, xmlDoc);
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
  originalJsonState: Record<string, any>,
  config: IHostConfig
) {
  const pathSegments = op.path.substring(1).split('/');
  const newJsonValueFromOp = op.value;

  const keyToReplace = pathSegments[pathSegments.length - 1];
  let elementPathSegments = [...pathSegments];
  let operationSubType: 'structural' | 'text' | 'propertyKey' | 'propertiesObject' | 'directParameter' = 'structural';
  const elementConnfig = config.elementConfig

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
      if (parentJsonNode && parentJsonNode.type && elementConnfig[parentJsonNode.type]?.parameters?.some(p => (p.includes(':') ? p.substring(p.indexOf(':') + 1) : p) === keyToReplace)) {
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
  const actualElementToModify = XmlUtils.findElementBySdtId(xmlDoc, elementIdToFind, `Replace target for ID ${elementIdToFind}`);

//   console.log("actualElementToModify:", actualElementToModify ? actualElementToModify : "null");
//   console.log("operationSubType:", operationSubType, "for keyToReplace:", keyToReplace);
//   console.log("elementPathSegments:", elementPathSegments.join('/'));
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
        const oldSdt = XmlUtils.findSdtElementById(parentForSdtReplace, keyToReplace);
        if (oldSdt && oldSdt.parentNode === parentForSdtReplace) { // 부모의 직계 자식인지 확인
            oldSdt.remove();
        } else if (oldSdt) {
            // console.warn(`[handleXmlDomReplace] Old SDT ${keyToReplace} found but not a direct child of designated parent. Parent: ${parentForSdtReplace.tagName}`);
        }
        // 값이 null이 아니면 새로운 요소 추가
        if (typeof newJsonValueFromOp === 'object' && newJsonValueFromOp !== null && newJsonValueFromOp.type && newJsonValueFromOp.order !== undefined) {
            const newSdt = XmlUtils.createXmlElementFromJson(keyToReplace, newJsonValueFromOp, xmlDoc, newJsonValueFromOp.order, config);
            XmlUtils.insertSdtInOrder(parentForSdtReplace, newSdt, newJsonValueFromOp.order, xmlDoc);
        } else if (newJsonValueFromOp !== null) { // null이 아닌데 유효한 객체가 아닌 경우 경고
             // console.warn(`[handleXmlDomReplace] (Structural): Invalid JSON for replacement element ${keyToReplace}. Value:`, newJsonValueFromOp);
        }
        // newJsonValueFromOp이 null이면 위에서 oldSdt.remove()로 이미 처리됨 (삭제)
    } else {
        // console.warn(`[handleXmlDomReplace] (Structural): Could not determine parent for replacing SDT ${keyToReplace}.`);
    }

  } else if (actualElementToModify && originalJsonNodeForElement && originalJsonNodeForElement.type) {
    const elementConfig = elementConnfig[originalJsonNodeForElement.type];
    if (!elementConfig) {
      console.warn(`[handleXmlDomReplace] No elementConnfig for type ${originalJsonNodeForElement.type} at path ${elementPathSegments.join('/')}.`);
      return;
    }

    if (operationSubType === 'text') {
      // actualElementToModify는 <w:r> 요소를 가리켜야 함
      if (actualElementToModify.localName === 'r' && actualElementToModify.namespaceURI === config.namespaces.w) {
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
        XmlUtils.applyPropertiesToXmlElement(actualElementToModify, fullPropertiesJson || {}, elementConfig, xmlDoc, config);
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

/**
 * [개선] ID로 래퍼 요소를 찾습니다.
 */
function findWrapperElementById(xmlDocOrElement: Document | Element, id: string, config: IHostConfig): Element | null {
  if (!config.wrapperConfig) return null;
  
  const { tagName, idTagName } = config.wrapperConfig;
  const wrapperNodeList = xmlDocOrElement.getElementsByTagName(tagName);

  for (let i = 0; i < wrapperNodeList.length; i++) {
    const wrapper = wrapperNodeList[i];
    const idTagList = wrapper.getElementsByTagName(idTagName);
    if (idTagList.length > 0 && idTagList[0].getAttribute('w:val') === id) {
      return wrapper;
    }
  }
  return null;
}

function findSheetPath(originalJson: any, sheetId: string): string | null {
    const sheetInfo = originalJson.sheets?.[sheetId];
    if (sheetInfo) {
        // 이 부분은 실제 rels 파싱 결과에 따라 달라져야 합니다.
        // 여기서는 간단하게 sheetId가 sheet1, sheet2 등이라고 가정합니다.
        return `/xl/worksheets/${sheetId.replace('rId', 'sheet')}.xml`;
    }
    return null;
}

/** ✅ [수정] Set 대신 string[]을 반환하도록 수정 */
function getAllStringCellValues(sheetsJson: Record<string, any>): string[] {
    const strings = new Set<string>();
    for (const sheetId in sheetsJson) {
        for (const cellId in sheetsJson[sheetId].cells) {
            const cell = sheetsJson[sheetId].cells[cellId];
            if (cell.type === 'string' && typeof cell.value === 'string') {
                strings.add(cell.value);
            }
        }
    }
    const stringArray: string[] = [];
    strings.forEach(value => stringArray.push(value));
    return stringArray;
}

function rebuildSharedStringsXml(strings: string[], config: IHostConfig): string {
    const { elementConfig, namespaces } = config;
    const sstTag = elementConfig.sst.xmlTag;
    const siTag = elementConfig.si.xmlTag;
    const tTag = elementConfig.si.children!.t.xmlTag;

    const items = strings.map(s => `<${siTag}><${tTag}>${escapeXml(s)}</${tTag}></${siTag}>`).join('');
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><${sstTag} xmlns="${namespaces.main}" count="${strings.length}" uniqueCount="${strings.length}">${items}</${sstTag}>`;
}

function rebuildStylesXml(stylesJson: any, config: IHostConfig): { xml: string, styleMap: Map<string, number> } {
    const styleMap = new Map<string, number>();
    // 1. stylesJson을 분석하여 fonts, fills, borders, xfs 목록을 생성
    // 2. 각 목록을 XML 문자열로 변환
    // 3. 최종 <styleSheet> XML을 조립
    // 4. "style_0" -> 0, "style_1" -> 1 과 같은 매핑을 생성하여 styleMap에 저장
    return { xml: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet>...</styleSheet>', styleMap: new Map() };
}

function rebuildSheetXml(
    sheetJson: any,
    stylesJson: any,
    sharedStrings: string[],
    config: IHostConfig
): string {
    const { namespaces } = config;
    const sharedStringsMap = new Map(sharedStrings.map((s, i) => [s, i]));
    const styleMap = new Map(Object.keys(stylesJson).map((styleId, index) => [styleId, index]));

    let sheetDataXml = '';
    const rows: Record<string, any[]> = {};
    for (const cellId in sheetJson.cells) {
        const rowNum = cellId.match(/\d+/)?.[0];
        if (rowNum) {
            if (!rows[rowNum]) rows[rowNum] = [];
            rows[rowNum].push({ id: cellId, ...sheetJson.cells[cellId] });
        }
    }

    for (const rowNum in rows) {
        let rowCellsXml = '';
        rows[rowNum].sort((a,b) => a.id.localeCompare(b.id, undefined, {numeric: true})); // A1, B1, C1 순 정렬
        
        for (const cell of rows[rowNum]) {
            let valueXml = '';
            let typeAttr = '';
            if (cell.type === 'string') {
                const sstIndex = sharedStringsMap.get(cell.value);
                valueXml = `<v>${sstIndex}</v>`;
                typeAttr = `t="s"`;
            } else if (cell.type === 'number') {
                valueXml = `<v>${cell.value}</v>
                `;
            }
            // ... formula 처리 ...

            const styleAttr = cell.styleId ? `s="${cell.styleId.split('_')[1]}"` : '';
            rowCellsXml += `<c r="${cell.id}" ${styleAttr} ${typeAttr}>${valueXml}</c>`;
        }
        sheetDataXml += `<row r="${rowNum}">${rowCellsXml}</row>`;
    }
    
    const mergesXml = sheetJson.merges.map((m: any) => `<mergeCell ref="${m.startCell}:${m.endCell}"/>`).join('');

    return `<?xml version="1.0" ...><worksheet xmlns="${namespaces.main}"><sheetData>${sheetDataXml}</sheetData><mergeCells>${mergesXml}</mergeCells></worksheet>`;
}

function escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, c => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

