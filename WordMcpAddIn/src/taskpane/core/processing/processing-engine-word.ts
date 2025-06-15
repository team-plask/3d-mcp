import type { IHostConfig, ElementConfig } from '../../configs/config.interface'; // 특정 config가 아닌, 공통 인터페이스만 import
import * as XmlUtils from '../xml-utils'; // XML 유틸리티 함수들
import * as shortid from 'shortid';
import { generateNKeysBetween } from 'fractional-indexing';
import { format } from 'path';

export function extractJsonFromXml(xmlString: string, config: IHostConfig): Record<string, any> {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const resultJson: Record<string, any> = {};

  console.log("rootElement:", xmlDoc.documentElement);
  const rootElement = xmlDoc.documentElement;
  const rootType = config.tagToType[rootElement.nodeName];
  if (!rootType) {
    console.warn(`[extractJsonFromXml] Root element type for <${rootElement.nodeName}> not found.`);
    return {};
  }
  
  // 루트 요소부터 재귀적 데이터 추출 시작
  resultJson[rootType] = _extractElementData(rootElement, rootType, config);
  return resultJson;
}

/**
 * [Word 전용 메인 함수] Word XML에 ID를 부여하는 래퍼를 적용하고, 순서를 할당한 후,
 * 최종적으로 수정된 XML과 분석된 JSON 구조를 반환합니다.
 */
export function processWordXml(
  xmlString: string,
  config: IHostConfig,
  existingJson: Record<string, any> = {}
): { json: Record<string, any>; xml: string } {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const xmlDocWithWrappers = applyIdentifierWrappers(xmlDoc, config);
  assignOrderToWrappers(xmlDocWithWrappers, config);

  const xmlSerializer = new XMLSerializer();
  const updatedXmlString = xmlSerializer.serializeToString(xmlDocWithWrappers.documentElement);
  
  const resultJson = extractJsonFromWrappers(xmlDocWithWrappers, config, existingJson);

  return { json: resultJson, xml: updatedXmlString };
}

/**
 * [메인 함수] XML 문자열과 호스트별 설정을 받아,
 * 분석된 JSON 구조와 ID가 부여된 XML 문자열을 반환합니다.
 * @param xmlString - 처리할 메인 파트의 XML 문자열
 * @param config - 사용할 호스트의 설정 객체 (예: wordConfig, excelConfig)
 * @param existingJson - 이전 작업에서 저장된 기존 JSON 구조
 * @returns { json: Record<string, any>, xml: string }
 */
export function processXmlToJson(
  xmlString: string,
  config: IHostConfig,
  existingJson: Record<string, any> = {}
): { json: Record<string, any>; xml: string } {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  // 1. 식별자(ID)를 부여하기 위해 요소들을 래핑합니다. (구 applyContentControlsToDocument)
  // Word의 경우, config에 정의된 대로 Content Control로 래핑됩니다.
  const xmlDocWithWrappers = applyIdentifierWrappers(xmlDoc, config);
  
  // 2. 래핑된 요소들에 계층적으로 순서(order)를 부여합니다.
  assignOrderToWrappers(xmlDocWithWrappers, config);

  // 3. 수정된 XML DOM을 문자열로 변환합니다.
  const xmlSerializer = new XMLSerializer();
  const updatedXmlString = xmlSerializer.serializeToString(xmlDocWithWrappers.documentElement);

  console.log("[processXmlToJson] Updated XML with wrappers:", XmlUtils.formatXML(updatedXmlString));
  
  // 4. ID가 부여된 XML에서 최종 JSON 구조를 추출합니다.
  const resultJson = extractJsonFromWrappers(xmlDocWithWrappers, config, existingJson);

  console.log("[processXmlToJson] Extracted JSON structure:", JSON.stringify(resultJson, null, 2));

  return {
    json: resultJson,
    xml: updatedXmlString
  };
}

/**
 * XML 문서 내의 주요 요소들을 식별자(ID)를 가진 래퍼로 감쌉니다.
 * config.wrapperConfig가 없으면 아무 작업도 하지 않습니다.
 */
function applyIdentifierWrappers(xmlDoc: Document, config: IHostConfig): Document {
  if (!config.wrapperConfig) {
    console.log(`[ProcessingEngine] Skipping wrapper application for host: ${config.hostType}`);
    return xmlDoc;
  }
  
  const wrappedElements = new Set<Element>();

  function findExistingWrappedElements(node: Node): void {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      if (element.nodeName === config.wrapperConfig!.tagName) { 
        const contentNode = element.getElementsByTagName(config.wrapperConfig!.contentTagName)[0];
        if (contentNode && contentNode.firstElementChild) {
          wrappedElements.add(contentNode.firstElementChild);
        }
      }
      for (const child of Array.from(element.childNodes)) {
        findExistingWrappedElements(child);
      }
    }
  }

  if (xmlDoc.documentElement) {
    findExistingWrappedElements(xmlDoc.documentElement);
  }

  let elementsToWrap = collectTargetElements(xmlDoc, wrappedElements, config);
  elementsToWrap = elementsToWrap.filter(item => 
      !wrappedElements.has(item.element) && 
      item.element.parentNode?.nodeName !== config.wrapperConfig!.contentTagName
  );
  
  elementsToWrap.sort((a, b) => b.depth - a.depth);

  const alreadyHandled = new Set<Element>();

  for (const item of elementsToWrap) {
    if (alreadyHandled.has(item.element)) continue;
    
    const { element, type } = item;
    const elementConfig = config.elementConfig[type];

    if (elementConfig?.requiresPrwWrapper) {
        // ... (createDummyParagraph 로직은 Word 전용이므로, 이 또한 config 플래그로 제어 가능)
    } else {
      const id = `${type.charAt(0)}_${shortid.generate()}`;
      wrapElement(element, id, type, config);
      alreadyHandled.add(element);
    }
  }

  return xmlDoc;
}

function collectTargetElements(
  xmlDocOrElement: Document | Element,
  elementsToExclude: Set<Element>,
  config: IHostConfig,
  depth = 0
): Array<{element: Element, type: string, depth: number}> {
  const collected: Array<{element: Element, type: string, depth: number}> = [];
  const rootNode = (xmlDocOrElement as Document).documentElement || xmlDocOrElement as Element;

  function traverse(node: Node, currentDepth: number) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;

      if (config.wrapperConfig && element.nodeName === config.wrapperConfig.contentTagName) {
        for (const child of Array.from(element.childNodes)) traverse(child, currentDepth);
        return;
      }

      const elementType = config.tagToType[element.nodeName];
      if (elementType && !elementsToExclude.has(element)) {
        collected.push({ element, type: elementType, depth: currentDepth });
      }

      for (const child of Array.from(element.childNodes)) traverse(child, currentDepth + 1);
    }
  }

  if (rootNode) traverse(rootNode, depth);
  return collected;
}

function wrapElement(element: Element, id: string, type: string, config: IHostConfig): Element | null {
  const xmlDoc = element.ownerDocument;
  if (!xmlDoc || !element.parentNode || !config.wrapperConfig || !config.sdtConfig) return null;

  const { namespaces, elementConfig, sdtConfig } = config;
  const { tagName, prTagName, contentTagName, idTagName, aliasTagName } = config.wrapperConfig;

  const wrapperElement = xmlDoc.createElementNS(namespaces.w, tagName);
  const prElement = xmlDoc.createElementNS(namespaces.w, prTagName);

  const aliasElement = xmlDoc.createElementNS(namespaces.w, aliasTagName);
  aliasElement.setAttributeNS(namespaces.w, "w:val", `${type} ${id}`);
  prElement.appendChild(aliasElement);

  const tagElement = xmlDoc.createElementNS(namespaces.w, idTagName);
  tagElement.setAttributeNS(namespaces.w, "w:val", id);
  prElement.appendChild(tagElement);

  const idNode = xmlDoc.createElementNS(namespaces.w, "w:id");
  const wordInternalId = Math.floor(Math.random() * (2**31 - 1)) * (Math.random() < 0.5 ? 1 : -1);
  idNode.setAttributeNS(namespaces.w, "w:val", String(wordInternalId));
  prElement.appendChild(idNode);
  
  const specificElementConfig = elementConfig[type];
  const sdtTypeIdentifier = specificElementConfig?.sdtType ||
                            sdtConfig.defaultSdtIdByType[type] ||
                            sdtConfig.universalDefaultSdtId;
  const choiceXmlTagName = sdtConfig.choiceTagMap[sdtTypeIdentifier];

  if (choiceXmlTagName) {
    const choiceElement = xmlDoc.createElementNS(namespaces.w, `w:${choiceXmlTagName}`);
    // ... (sdtSpecificConfig에 따른 세부 설정 로직)
    prElement.appendChild(choiceElement);
  }

  wrapperElement.appendChild(prElement);

  const contentElement = xmlDoc.createElementNS(namespaces.w, contentTagName);
  element.parentNode.replaceChild(wrapperElement, element);
  contentElement.appendChild(element);
  wrapperElement.appendChild(contentElement);

  return wrapperElement;
}
  
  
  function extractJsonFromWrappers(
    xmlDoc: Document,
    config: IHostConfig,
    existingJson: Record<string, any> = {}
  ): Record<string, any> {
    const resultJson: Record<string, any> = {};
    if (config.wrapperConfig) {
      const idElementMap = new Map<string, Element>(); 
    
      const sdtElements = Array.from(xmlDoc.getElementsByTagNameNS(config.namespaces.w, "sdt"));
    
      for (const sdt of sdtElements) {
        const tagElements = sdt.getElementsByTagNameNS(config.namespaces.w, "tag");
        if (!(tagElements.length > 0 && tagElements[0].hasAttributeNS(config.namespaces.w, "val"))) continue;
        
        const id = tagElements[0].getAttributeNS(config.namespaces.w, "val")!;
        let order: string | null = null;
        const aliasElements = sdt.getElementsByTagNameNS(config.namespaces.w, "alias");
        if (aliasElements.length > 0 && aliasElements[0].hasAttributeNS(config.namespaces.w, "val")) {
          const aliasValue = aliasElements[0].getAttributeNS(config.namespaces.w, "val") || "";
          if (aliasValue.includes('__')) {
            order = aliasValue.substring(aliasValue.lastIndexOf('__') + 2);
          }
        }
    
        const contentNode = sdt.getElementsByTagNameNS(config.namespaces.w, "sdtContent")[0];
        if (!(contentNode && contentNode.firstElementChild)) continue;
        
        const actualElement = contentNode.firstElementChild as Element;
        const elementType = config.tagToType[actualElement.nodeName];

        if (!elementType) {
          console.warn(`Unknown element type for nodeName: ${actualElement.nodeName} (ID: ${id}). Skipping.`);
          continue;
        }
        
        idElementMap.set(id, actualElement);
    
        let extractedData;
        // ❌ 이전 코드: if (elementType === 'table' && ELEMENT_CONFIG[elementType]?.processRowsImplicitly)
        // ✅ 수정된 코드: config에서 elementConfig를 사용하고, 헬퍼 함수에 config를 전달합니다.
        if (elementType === 'table' && config.elementConfig[elementType]?.processRowsImplicitly) {
          extractedData = extractTableDataWithImplicitRows(actualElement, elementType, id, resultJson, idElementMap, xmlDoc, config);
        } else {
          extractedData = _extractElementData(actualElement, elementType, config);
        }
    
        let elementJson: any = {
          type: elementType,
          ...extractedData
        };
    
        if (order) {
          elementJson.order = order;
        }
    
        if (existingJson[id]) {
          // mergeElementData는 순수 JSON 객체만 다루므로 config가 필요 없습니다.
          elementJson = mergeElementData(existingJson[id], elementJson);
        }
        resultJson[id] = elementJson;
      }
    } else {
      const elementsToProcess = collectTargetElements(xmlDoc, new Set(), config);
      for (const item of elementsToProcess) {
          const { element, type } = item;
          // Excel의 경우, ID는 셀 주소('r' 속성)가 됩니다.
          const id = element.getAttribute("r"); 
          if(!id) continue;

          const extractedData = _extractElementData(element, type, config);
          resultJson[id] = { type, ...extractedData };
      }
    }
    // ✅ 수정: buildHierarchyStructure 호출 시 config를 전달합니다.
    buildHierarchyStructure(resultJson, xmlDoc, config);
    return resultJson;
  }
  
  function extractTableDataWithImplicitRows(
    tableElement: Element, 
    tableElementType: string, 
    tableSdtId: string,
    resultJson: Record<string, any>, 
    idElementMap: Map<string, Element>,
    xmlDoc: Document,
    config: IHostConfig // ✅ config를 매개변수로 받음
  ): Record<string, any> {
      const tableData = _extractElementData(tableElement, tableElementType, config); 
      tableData.rows = []; 
  
      const trElements: Element[] = [];
      for (let i = 0; i < tableElement.childNodes.length; i++) {
          const node = tableElement.childNodes[i];
          if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'w:tr') {
              trElements.push(node as Element);
          }
      }
  
      const rowOrders = trElements.length > 0 ? generateNKeysBetween(null, null, trElements.length) : [];
  
      trElements.forEach((trElement, rowIndex) => {
          const conceptualRowId = `row_${tableSdtId}_${shortid.generate()}`;
          const rowJson: any = {
              id: conceptualRowId,
              order: rowOrders[rowIndex],
              properties: {}, 
              cells: []      
          };
  
          const trPrElement = trElement.getElementsByTagNameNS(config.namespaces.w, 'trPr')[0];
          if (trPrElement) {
              const trHeightElement = trPrElement.getElementsByTagNameNS(config.namespaces.w, 'trHeight')[0];
              if (trHeightElement) {
                  rowJson.properties.height = {};
                  if (trHeightElement.hasAttributeNS(config.namespaces.w,'val')) rowJson.properties.height.val = trHeightElement.getAttributeNS(config.namespaces.w,'val');
                  if (trHeightElement.hasAttributeNS(config.namespaces.w,'hRule')) rowJson.properties.height.hRule = trHeightElement.getAttributeNS(config.namespaces.w,'hRule');
              }
              // 기타 필요한 trPr 속성 추출 로직 추가 가능
          }
  
          const cellSdtNodes = trElement.childNodes; // <w:tr>의 직접 자식들 (셀 <w:sdt>들)
          const cellInfos: { id: string, order: string }[] = [];
  
          for (let i = 0; i < cellSdtNodes.length; i++) {
              const node = cellSdtNodes[i];
              if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'w:sdt') {
                  const cellSdtElement = node as Element;
                  const tagEl = cellSdtElement.getElementsByTagNameNS(config.namespaces.w, 'tag')[0];
                  const aliasEl = cellSdtElement.getElementsByTagNameNS(config.namespaces.w, 'alias')[0];
  
                  if (tagEl && tagEl.hasAttributeNS(config.namespaces.w, 'val')) {
                      const cellSdtIdVal = tagEl.getAttributeNS(config.namespaces.w, 'val')!;
                      let cellOrderVal = "";
                      if (aliasEl && aliasEl.hasAttributeNS(config.namespaces.w, 'val')) {
                          const aliasStr = aliasEl.getAttributeNS(config.namespaces.w, 'val') || "";
                          if (aliasStr.includes('__')) {
                              cellOrderVal = aliasStr.substring(aliasStr.lastIndexOf('__') + 2);
                          }
                      }
                      cellInfos.push({ id: cellSdtIdVal, order: cellOrderVal });
                      
                      // 셀 SDT의 실제 <w:tc> 요소를 idElementMap에 추가 (이미 메인 루프에서 처리될 수 있음)
                      // 여기서는 extractJsonFromContentControls의 메인 루프가 셀 SDT를 발견하고 처리하도록 의존.
                  }
              }
          }
          
          cellInfos.sort((a, b) => a.order.localeCompare(b.order));
          rowJson.cells = cellInfos.map(info => info.id);
  
          tableData.rows.push(rowJson);
      });
  
      return tableData;
  }
  
  function _extractElementData(element: Element, elementType: string, config: IHostConfig): any {
    const result: Record<string, any> = {};
    const elementConfig = config.elementConfig[elementType];
    if (!elementConfig) {
        console.warn(`[extractElementData] No elementConfig found for type: ${elementType}`);
        return {};
    }
    let dataExists = false;

    // 1. 요소의 속성(XML attributes) 추출 (공통 로직)
    if (elementConfig.parameters) {
        for (const param of elementConfig.parameters) {
            const [prefix, localName] = param.includes(':') ? param.split(':') as [string, string] : [null, param];
            const namespaceURI = prefix ? config.namespaces[prefix] : null;

            if ((namespaceURI && element.hasAttributeNS(namespaceURI, localName)) || (!namespaceURI && element.hasAttribute(localName))) {
                const attrValue = namespaceURI ? element.getAttributeNS(namespaceURI, localName)! : element.getAttribute(localName)!;
                if (elementConfig.parameters.length === 1 && (localName === 'val' || localName === 'ref')) {
                    return attrValue;
                }
                result[localName] = attrValue;
                dataExists = true;
            }
        }
    }

    // 2. 자식 요소 처리 (✅ Word 테이블 분기 로직 복원)
    if (elementConfig.children) {
        // --- ❗ 예외 규칙: Word 테이블 특별 처리 분기 ❗ ---
        if (elementType === 'table' && elementConfig.processRowsImplicitly) {
            console.log(`[extractElementData] Applying Word-specific table processing for <${element.nodeName}>`);
            const tableSpecificChildConfigs: Record<string, ElementConfig> = {};
            // config에 정의된 tblPr, tblGrid만 자식으로 간주하여 처리
            if (elementConfig.children.tblPr) tableSpecificChildConfigs.tblPr = elementConfig.children.tblPr;
            if (elementConfig.children.tblGrid) tableSpecificChildConfigs.tblGrid = elementConfig.children.tblGrid;
            _processChildElements(element, tableSpecificChildConfigs, result, config);
        } 
        // --- ⭐ 일반 규칙: 그 외 모든 요소 처리 분기 ⭐ ---
        else {
            _processChildElements(element, elementConfig.children, result, config);
        }

        if (Object.keys(result).length > (elementConfig.parameters?.length || 0)) {
            dataExists = true;
        }
    }
    
    // 3. 텍스트 컨텐츠 추출
    const textChildKey = Object.keys(elementConfig.children || {}).find(key => elementConfig.children![key].jsonKey === 'text');
    if(textChildKey){
        const textConfig = elementConfig.children![textChildKey];
        const textNode = Array.from(element.children).find(c => c.nodeName === textConfig.xmlTag);
        if(textNode?.textContent) {
            result.text = textNode.textContent;
            dataExists = true;
        }
    }

    // 4. 존재 자체로 의미를 갖는 리프 노드 처리
    if (!dataExists && !elementConfig.children && !elementConfig.parameters) {
        return true;
    }

    return result;
}
  
/**
 * [개선] 부모 XML 요소의 자식들을 재귀적으로 처리하여 result JSON 객체에 추가합니다.
 * @param parentElement - 부모 XML 요소
 * @param childConfigs - 처리할 자식 요소들에 대한 설정
 * @param result - 변환된 JSON 데이터가 누적될 객체
 * @param config - 전체 호스트 설정 객체
 */
function processChildElements(
  parentElement: Element,
  childConfigs: Record<string, ElementConfig>,
  result: Record<string, any>,
  config: IHostConfig // ✅ 수정: 네 번째 인자로 config: IHostConfig 추가
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
                itemData = {};
                if (childConfig.children) {
                    // ✅ 수정: 재귀 호출 시 config 전달
                    processChildElements(childElement, childConfig.children, itemData, config);
                }
                 if (Object.keys(itemData).length > 0) listData.push(itemData);
            } else if (childConfig.type === 'leaf') {
                // ✅ 수정: extractLeafData 호출 시 config 전달
                itemData = extractLeafData(childElement, childConfig, config);
                if (itemData !== null) listData.push(itemData);
            }
        }
        if (listData.length > 0) {
            result[jsonKey] = listData;
        }
      } else {
        const childElement = directChildElements[0];
        let singleData: any = null;
        if (childConfig.type === 'property') {
            singleData = {};
            if (childConfig.children) {
                // ✅ 수정: 재귀 호출 시 config 전달
                processChildElements(childElement, childConfig.children, singleData, config);
            }
             if (Object.keys(singleData).length === 0 && childConfig.parameters && childConfig.parameters.length > 0) {
                // ✅ 수정: extractLeafData 호출 시 config 전달
                const directParams = extractLeafData(childElement, childConfig, config);
                if (directParams && typeof directParams === 'object' && Object.keys(directParams).length > 0){
                     Object.assign(singleData, directParams);
                } else if (directParams === true && (!childConfig.parameters || childConfig.parameters.length === 0)) {
                    // 이 부분의 로직은 올바르므로 유지합니다.
                }
             }

            if (Object.keys(singleData).length > 0) {
                result[jsonKey] = singleData;
            } else if (childConfig.parameters && childConfig.parameters.length === 0) {
                result[jsonKey] = true;
            }

        } else if (childConfig.type === 'leaf') {
            // ✅ 수정: extractLeafData 호출 시 config 전달
            singleData = extractLeafData(childElement, childConfig, config);
            if (singleData !== null) { 
                result[jsonKey] = singleData;
            }
        }
    }
  }
}

/**
 * [개선] Leaf 타입의 XML 요소에서 데이터를 추출합니다.
 * @param element - 데이터를 추출할 XML 요소
 * @param leafConfig - 해당 요소에 대한 ElementConfig
 * @param config - 전체 호스트 설정 객체 (네임스페이스 등 접근용)
 * @returns 추출된 데이터 (문자열, 객체, boolean, 또는 null)
 */
function extractLeafData(element: Element, leafConfig: ElementConfig, config: IHostConfig): any {
  // ❌ 이전 코드: if (config.xmlTag === 'w:t')
  // ✅ 수정: 특정 태그 이름 대신, 설정에 정의된 'jsonKey'를 기반으로 텍스트 노드를 식별합니다.
  //          이 방식이 더 유연하고 의미가 명확합니다.
  if (leafConfig.jsonKey === 'text') {
    return element.textContent || "";
  }

  const params: Record<string, string> = {};
  let extractedParamCount = 0;
  let hasValAttribute = false;

  if (leafConfig.parameters) {
    for (const paramName of leafConfig.parameters) {
      // ❌ 이전 코드: const namespace = paramName.includes(':') ? (paramName.startsWith('w:') ? NS_W : ...
      // ✅ 수정: config.namespaces 객체를 사용하여 동적으로 네임스페이스 URI를 찾습니다.
      const [prefix, localName] = paramName.includes(':') ? paramName.split(':') as [string, string] : [null, paramName];
      const namespaceURI = prefix ? config.namespaces[prefix] : null;
      
      if ((namespaceURI && element.hasAttributeNS(namespaceURI, localName)) || 
          (!namespaceURI && element.hasAttribute(localName))) {
        
        params[localName] = namespaceURI 
          ? element.getAttributeNS(namespaceURI, localName)! 
          : element.getAttribute(localName)!;
          
        extractedParamCount++;
        // ❌ 이전 코드: if (paramName === 'w:val')
        // ✅ 수정: 특정 태그('w:val') 대신, 속성의 로컬 이름('val')을 확인하여 범용성을 높입니다.
        if (localName === 'val') {
          hasValAttribute = true;
        }
      }
    }
  }
  
  // 'val' 속성 하나만 가진 경우, 객체 대신 값만 반환하는 로직 (유지)
  if (leafConfig.parameters && leafConfig.parameters.length === 1 && hasValAttribute) {
    return params['val'];
  }

  if (extractedParamCount > 0) {
    return params;
  }
 
  // 파라미터가 없거나, 정의되었지만 하나도 추출되지 않은 경우 (예: <w:b/>)
  // 태그의 존재 자체를 true로 반환 (유지)
  if (!leafConfig.parameters || leafConfig.parameters.length === 0) {
      return true; 
  }
  
  return null; 
}
  
  function buildHierarchyStructure(
    resultJson: Record<string, any>,
    xmlDoc: Document,
    config: IHostConfig
  ): void {
    const childToParentMap = new Map<string, string>();
    const allSdtElements = Array.from(xmlDoc.getElementsByTagName("w:sdt"));
  
    // 1. 모든 SDT를 순회하며 부모-자식 관계 맵을 생성합니다. (기존 로직 유지)
    for (const sdtElement of allSdtElements) {
      const sdtPr = sdtElement.getElementsByTagName("w:sdtPr")[0];
      if (!sdtPr) continue;
      const tagEl = sdtPr.getElementsByTagName("w:tag")[0];
      if (!tagEl?.getAttribute("w:val")) continue;
  
      const currentSdtId = tagEl.getAttribute("w:val")!;
      if (!resultJson[currentSdtId]) continue;
  
      let searchNode = sdtElement.parentNode;
      while (searchNode && searchNode.nodeName !== 'w:body' && searchNode !== xmlDoc.documentElement) {
        if (searchNode.nodeName === 'w:sdt') {
          const parentSdtElement = searchNode as Element;
          const parentTagEl = parentSdtElement.getElementsByTagName("w:sdtPr")[0]?.getElementsByTagName("w:tag")[0];
          if (parentTagEl?.getAttribute("w:val")) {
            const parentSdtId = parentTagEl.getAttribute("w:val")!;
            if (resultJson[parentSdtId]) {
              childToParentMap.set(currentSdtId, parentSdtId);
              break;
            }
          }
        }
        searchNode = searchNode.parentNode;
      }
    }
  
    // 2. 부모 ID를 기준으로 자식들을 그룹화하고 순서에 맞게 정렬합니다. (기존 로직 유지)
    const parentToChildrenOrderMap = new Map<string, { id: string; order: string }[]>();
    childToParentMap.forEach((parentId, childId) => {
      const childObj = resultJson[childId];
      if (childObj?.order) {
        if (!parentToChildrenOrderMap.has(parentId)) parentToChildrenOrderMap.set(parentId, []);
        parentToChildrenOrderMap.get(parentId)!.push({ id: childId, order: childObj.order });
      }
    });
    parentToChildrenOrderMap.forEach(children => children.sort((a, b) => a.order.localeCompare(b.order)));
  
    // ❗ [핵심 수정] 1단계: 모든 계층 구조를 먼저 만듭니다. (삭제는 아직 안 함)
    parentToChildrenOrderMap.forEach((sortedChildren, parentId) => {
      const parentObj = resultJson[parentId];
      if (!parentObj) return;
  
      // 모든 타입을 동일하게 처리: 부모 객체에 자식 ID를 키로 하여 자식 객체를 추가.
      sortedChildren.forEach(childInfo => {
        const childJson = resultJson[childInfo.id];
        if (childJson) {
          parentObj[childInfo.id] = childJson;
        }
      });
    });
  
    // ❗ [핵심 수정] 2단계: 모든 계층화가 끝난 후, 최상위 레벨에서 자식들을 한 번에 정리합니다.
    childToParentMap.forEach((parentId, childId) => {
      // 부모가 있는 자식(childId)은 이제 최상위 레벨에 있을 필요가 없으므로 제거합니다.
      delete resultJson[childId];
    });
  }
  
  function assignOrderToWrappers(xmlDoc: Document, config: IHostConfig): void {
    // ✅ 수정: 'w:body' 대신 config.bodyTag 사용
    const body = xmlDoc.getElementsByTagName(config.bodyTag)[0];
    if (!body) {
      console.warn(`[assignOrderToWrappers] Body tag '${config.bodyTag}' not found.`);
      return;
    }
  
    function processElement(currentElement: Element) {
      // ✅ 수정: 'w:sdt' 대신 config.wrapperConfig.tagName 사용
      const directChildWrappers = Array.from(currentElement.childNodes).filter(
          (node): node is Element => node.nodeType === Node.ELEMENT_NODE && node.nodeName === config.wrapperConfig.tagName
      );
  
      if (directChildWrappers.length > 0) {
        const orders = generateNKeysBetween(null, null, directChildWrappers.length);
        directChildWrappers.forEach((wrapper, index) => {
          // ✅ 수정: setOrderToWrapperAlias 호출 시 config 객체를 전달합니다.
          setOrderToWrapperAlias(wrapper, orders[index], xmlDoc, config);
        });
      }
      
      for (const childNode of Array.from(currentElement.childNodes)) {
        if (childNode.nodeType === Node.ELEMENT_NODE) {
          processElement(childNode as Element);
        }
      }
    }
  
    processElement(body);
  }

  function setOrderToWrapperAlias(wrapperElement: Element, order: string, xmlDoc: Document, config: IHostConfig): void {
    // ✅ 수정: config에서 래퍼 관련 태그 이름을 가져옵니다.
    const { prTagName, aliasTagName, idTagName } = config.wrapperConfig;
  
    const prEl = wrapperElement.getElementsByTagName(prTagName)[0];
    if (!prEl) return;
  
    let aliasElement = prEl.getElementsByTagName(aliasTagName)[0];
    
    if (!aliasElement) {
      aliasElement = xmlDoc.createElement(aliasTagName);
      prEl.insertBefore(aliasElement, prEl.firstChild); 
    }
  
    let currentAliasValue = aliasElement.getAttribute("w:val") || "";
    
    if (currentAliasValue.includes("__")) {
      currentAliasValue = currentAliasValue.substring(0, currentAliasValue.lastIndexOf("__"));
    }
    
    if (!currentAliasValue) {
        const tagElement = prEl.getElementsByTagName(idTagName)[0];
        const tagVal = tagElement?.getAttribute("w:val");
        if (tagVal) {
            const sdtContent = wrapperElement.getElementsByTagName('w:sdtContent')[0]; // 이 부분은 Word의 구조에 의존적일 수 있음
            const mainContentElement = sdtContent?.firstElementChild;
            // ✅ 수정: TAG_TO_TYPE 대신 config.tagToType 사용
            const resolvedTypeName = mainContentElement ? (config.tagToType[mainContentElement.nodeName] || 'unknown') : 'unknown';
            currentAliasValue = `${resolvedTypeName} ${tagVal}`;
        } else {
            currentAliasValue = `unknown ${shortid.generate()}`;
        }
    }
  
    aliasElement.setAttribute("w:val", `${currentAliasValue}__${order}`);
  }
  
  // mergeElementData 함수는 이전과 동일하게 유지
  function mergeElementData(existing: any, updated: any): any {
    const result = { ...existing }; // 기존 객체를 복사하여 시작
    for (const [key, value] of Object.entries(updated)) {
      // 'order'와 'id'는 항상 updated 값으로 덮어쓰기 (기존 로직에서 id는 없었으므로 추가)
      if (key === 'order' || key === 'id') {
          result[key] = value;
          continue;
      }
  
      if ( typeof value === 'object' && value !== null && !Array.isArray(value) &&
           existing[key] && typeof existing[key] === 'object' && !Array.isArray(existing[key])
      ) {
        // 자식 객체가 둘 다 객체이면 재귀적으로 병합
        result[key] = mergeElementData(existing[key], value);
      } else {
        // 그 외의 경우 (원시 타입, 배열, 또는 한쪽만 객체 등)는 updated 값으로 덮어쓰기
        result[key] = value;
      }
    }
    return result;
  }


  // src/core/processing-engine.ts

/**
 * [최종 개선] 요소의 데이터(속성, 자식)를 JSON으로 추출하는 메인 함수.
 * 내부적으로 _processChildElements 헬퍼를 호출하여 자식들을 재귀적으로 처리합니다.
 */
function extractExcelElementData(element: Element, elementType: string, config: IHostConfig): any {
  const result: Record<string, any> = {};
  const elementConfig = config.elementConfig[elementType];
  if (!elementConfig) {
      console.warn(`No elementConfig found for type: ${elementType}`);
      return result;
  }

  // 1. 요소의 속성(XML attributes) 추출
  if (elementConfig.parameters) {
      for (const param of elementConfig.parameters) {
          const [prefix, localName] = param.includes(':') ? param.split(':') as [string, string] : [null, param];
          const namespaceURI = prefix ? config.namespaces[prefix] : null;
          
          if ((namespaceURI && element.hasAttributeNS(namespaceURI, localName)) || (!namespaceURI && element.hasAttribute(localName))) {
              const attrValue = namespaceURI ? element.getAttributeNS(namespaceURI, localName)! : element.getAttribute(localName)!;
              // 'val' 속성 하나만 있는 경우, 값을 직접 할당 (예: sz: {val: "24"} -> sz: "24")
              if (elementConfig.parameters.length === 1 && (localName === 'val' || localName === 'ref')) {
                  return attrValue;
              }
              result[localName] = attrValue;
          }
      }
  }

  // 2. 자식 요소들을 재귀적으로 처리
  if (elementConfig.children) {
      _processChildElements(element, elementConfig.children, result, config);
  }

  // 3. 자식 요소가 없고, 텍스트만 있는 리프 노드 처리 (예: <w:t>)
  if (!elementConfig.children && elementConfig.jsonKey === 'text') {
      return element.textContent || "";
  }

  // 4. 속성도 자식도 없는 존재 자체로 의미를 갖는 리프 노드 처리 (예: <w:b/>)
  if (Object.keys(result).length === 0 && !elementConfig.children) {
      return true;
  }

  return result;
}

/**
* [내부 헬퍼] 자식 요소들을 재귀적으로 처리하여 result JSON 객체에 추가합니다.
* (기존의 processChildElements 로직을 그대로 사용)
*/
function _processChildElements(
  parentElement: Element,
  childConfigs: Record<string, ElementConfig>, // ✅ 올바른 타입
  result: Record<string, any>,
  config: IHostConfig
): void {
  for (const [childKey, childConfig] of Object.entries(childConfigs)) {
      const [prefix, localName] = childConfig.xmlTag.includes(':') ? childConfig.xmlTag.split(':') : [null, childConfig.xmlTag];
      const namespaceURI = prefix ? config.namespaces[prefix] : config.namespaces.main;
      
      const childElements = Array.from(parentElement.children).filter(
          c => c.localName === localName && c.namespaceURI === namespaceURI
      );
      
      if (childElements.length === 0) continue;
      
      const jsonKey = childConfig.jsonKey || childKey;

      if (childConfig.isList) {
          // 자식 요소 '하나하나'에 대해 재귀 호출. 이때 elementType은 'childKey'가 됩니다.
          result[jsonKey] = childElements.map(child => _extractElementData(child, childKey, config));
      } else {
          const childData = _extractElementData(childElements[0], childKey, config);
          if (childData !== null && (typeof childData !== 'object' || Object.keys(childData).length > 0) || childData === true) {
              result[jsonKey] = childData;
          }
      }
  }
}


export function processExcelWorkbook(workbookXml: string, config: IHostConfig, relsXml: string): { sheetOrder: string[], sheetRels: any[] } {
  const workbookJson = extractJsonFromXml(workbookXml, config).workbook;
  const relsJson = extractJsonFromXml(relsXml, config).Relationships;

  console.log("workbookJson", workbookJson);
  console.log("relsJson", relsJson);

  const sheetEntries = Array.isArray(workbookJson.sheets.sheet) ? workbookJson.sheets.sheet : [workbookJson.sheets.sheet];
  const relationships = Array.isArray(relsJson.Relationship) ? relsJson.Relationship : [relsJson.Relationship];

  const sheetRels = sheetEntries.map((s: any) => {
      const rel = relationships.find((r: any) => r.Id === s.id);
      return {
          id: `sheet${s.sheetId}`,
          rId: s.id,
          name: s.name,
          target: rel ? rel.Target : ''
      };
  });
  
  const sheetOrder = sheetRels.map((r: any) => r.id);
  return { sheetOrder, sheetRels };
}

/**
 * [Excel] styles.xml을 파싱하여 JSON의 styles 객체로 변환합니다.
 */
export function processExcelStyles(stylesXml: string, config: IHostConfig): { stylesJson: Record<string, any>, xmlIndexToStyleIdMap: Map<number, string> } {
  // console.log("stylesXml", XmlUtils.formatXML(stylesXml));
  const styleSheet = extractJsonFromXml(stylesXml, config).styleSheet;
  console.log("styleSheet", styleSheet);
  const stylesJson: Record<string, any> = {};
  const xmlIndexToStyleIdMap = new Map<number, string>();
  const styleFingerprintToIdMap = new Map<string, string>();

  const fonts = styleSheet.fonts?.font || [];
  const fills = styleSheet.fills?.fill || [];
  const borders = styleSheet.borders?.border || [];
  const numFmts = (styleSheet.numberFormats?.numFmt || []).reduce((acc: any, fmt: any) => {
      if(fmt) acc[fmt.numFmtId] = fmt.formatCode;
      return acc;
  }, {});
  
  (styleSheet.cellStyles?.xf || []).forEach((xf: any, index: number) => {
      const styleDef: any = {};
      if (xf.applyFont === "1" && fonts[xf.fontId]) styleDef.font = fonts[xf.fontId];
      if (xf.applyFill === "1" && fills[xf.fillId]) styleDef.fill = fills[xf.fillId].pattern;
      if (xf.applyBorder === "1" && borders[xf.borderId]) styleDef.border = borders[xf.borderId];
      if (xf.applyAlignment === "1" && xf.alignment) styleDef.alignment = xf.alignment;
      const numFmtCode = numFmts[xf.numFmtId];
      if (xf.numFmtId && xf.numFmtId !== "0" && numFmtCode) {
          styleDef.numberFormat = numFmtCode;
      }

      if (Object.keys(styleDef).length === 0) return;

      const fingerprint = JSON.stringify(styleDef);
      let styleId = styleFingerprintToIdMap.get(fingerprint);

      if (!styleId) {
          styleId = `style_${styleFingerprintToIdMap.size}`;
          styleFingerprintToIdMap.set(fingerprint, styleId);
          stylesJson[styleId] = styleDef;
      }
      
      xmlIndexToStyleIdMap.set(index, styleId);
  });

  return { stylesJson, xmlIndexToStyleIdMap };
}

/** [Excel] sharedStrings.xml을 파싱하여 문자열 배열로 반환합니다. */
export function processSharedStrings(xmlString: string, config: IHostConfig): string[] {
  const sst = extractJsonFromXml(xmlString, config).sst;
  console.log("Shared Strings:", sst);
  if (!sst || !sst.stringItems) return [];
  return sst.stringItems.map((item: any) => item.text || "");
}

/** [Excel] sheetN.xml을 파싱하여 cells와 merges 객체로 변환합니다. */
export function processExcelSheet(sheetXml: string, config: IHostConfig, sharedStrings: string[], xmlIndexToStyleIdMap: Map<number, string>): { cells: Record<string, any>, merges: any[] } {
  const worksheet = extractJsonFromXml(sheetXml, config).worksheet;
  console.log("Worksheet Data:", worksheet);
  const cells: Record<string, any> = {};

  (worksheet.sheetData?.row || []).forEach((row: any) => {
      if (!row.cells) return;
      (Array.isArray(row.cells) ? row.cells : [row.cells]).forEach((cell: any) => {
          const cellData: any = {};
          if (cell.s) {
              const styleId = xmlIndexToStyleIdMap.get(parseInt(cell.s, 10));
              if (styleId) cellData.styleId = styleId;
          }
          if (cell.formula) cellData.formula = cell.formula.text;

          if (cell.t === 's') {
              cellData.type = 'string';
              cellData.value = sharedStrings[parseInt(cell.value, 10)] || "";
          } else if (cell.value) {
              cellData.type = 'number';
              cellData.value = parseFloat(cell.value);
          } else {
              cellData.type = 'empty';
          }
          cells[cell.r] = cellData;
      });
  });

  const merges = (worksheet.merges?.mergeCell || []).map((mc: any) => ({
      startCell: mc.split(':')[0],
      endCell: mc.split(':')[1],
  }));

  return { cells, merges };
}