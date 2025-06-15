import type { IHostConfig, ElementConfig } from '../configs/config.interface';

// ===================================================================================
// I. 범용 XML 유틸리티 (General XML Utilities)
// ===================================================================================

/**
 * XML 문자열의 유효성을 검사합니다.
 * @param xmlString - 검사할 XML 문자열
 * @returns 유효하면 true, 아니면 false
 */
export function isValidXml(xmlString: string): boolean {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");

        const parserError = xmlDoc.querySelector("parsererror");
        if (parserError) {
            console.error("XML parsing error in isValidXml:", parserError.textContent);
            return false;
        }
        return true;
    } catch (error) {
        console.error("XML validation error:", error);
        return false;
    }
}

/**
 * XML 문자열을 보기 좋게 들여쓰기하여 포맷팅합니다.
 * @param xml - 포맷팅할 XML 문자열
 * @param tab - 들여쓰기에 사용할 문자 (기본값: 공백 2칸)
 * @returns 포맷팅된 XML 문자열
 */
export function formatXML(xml: string, tab = '  '): string {
    let formatted = '';
    let indent = '';
    
    // 기본적인 줄바꿈 처리로 가독성 향상
    xml = xml.replace(/(>)\s*(<)(\/*)/g, '$1\n$2$3');
    
    xml.split('\n').forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        if (trimmedLine.match(/^<\//)) { // 닫는 태그
            indent = indent.substring(tab.length);
        }
        
        formatted += indent + trimmedLine + '\n';
        
        if (trimmedLine.match(/^<[^\/].*[^\/]>$/)) { // 여는 태그
            indent += tab;
        }
    });
    
    return formatted.trim();
}


// ===================================================================================
// II. OOXML 패키지 전문 유틸리티 (OOXML Package Utilities)
// ===================================================================================

/**
 * Flat OPC XML 문자열에서 지정된 파트(예: /word/document.xml)의 내용을 추출합니다.
 * 이 함수는 OOXML 패키지 구조를 이해하고 동작합니다.
 * @param flatXml - 전체 Flat OPC XML 문자열
 * @param mainPartPath - 추출할 파트의 경로 (예: "/word/document.xml", "/xl/worksheets/sheet1.xml")
 * @returns 추출된 파트의 XML 내용. 파트가 없으면 Error를 던집니다.
 */
export function extractMainPart(flatXml: string, mainPartPath: string): string {
    // 만약 이미 패키지 형태가 아니라면(즉, 메인 파트 XML만 있는 경우), 받은 문자열을 그대로 반환
    if (!flatXml.includes('<pkg:package')) {
        return flatXml.trim();
    }

    // mainPartPath를 사용하여 동적으로 정규식 생성
    // 경로의 슬래시(/)와 점(.)을 정규식에 맞게 이스케이프 처리
    const partNamePattern = mainPartPath.replace(/[\/.]/g, '\\$&');
    const partRegex = new RegExp(
        `<pkg:part[^>]*pkg:name="${partNamePattern}"[^>]*>[\\s\\S]*?<\\/pkg:part>`,
        'i'
    );

    const partMatch = flatXml.match(partRegex);
    if (!partMatch) {
        throw new Error(`[extractMainPart] Main part '${mainPartPath}' not found in Flat-OPC XML.`);
    }

    const xmlDataMatch = partMatch[0].match(/<pkg:xmlData[^>]*>([\s\S]*?)<\/pkg:xmlData>/i);
    if (!xmlDataMatch?.[1]) {
        throw new Error(`[extractMainPart] pkg:xmlData section missing in part '${mainPartPath}'.`);
    }

    return xmlDataMatch[1].trim();
}

/**
 * Flat OPC XML 문자열에서 지정된 파트의 내용을 새로운 XML로 교체합니다.
 * 이 함수는 OOXML 패키지 구조를 이해하고 동작합니다.
 * @param originalFlatXml - 원본 Flat OPC XML 문자열
 * @param updatedMainPartXml - 교체할 새로운 파트의 XML 내용
 * @param mainPartPath - 교체할 파트의 경로
 * @returns 내용이 교체된 새로운 Flat OPC XML 문자열
 */
export function replaceMainPart(originalFlatXml: string, updatedMainPartXml: string, mainPartPath: string): string {
    // 만약 이미 패키지 형태가 아니라면, 업데이트된 XML을 그대로 반환
    if (!originalFlatXml.includes('<pkg:package')) {
        return updatedMainPartXml;
    }

    const partNamePattern = mainPartPath.replace(/[\/.]/g, '\\$&');
    const partRegex = new RegExp(
        `<pkg:part[^>]*pkg:name="${partNamePattern}"[^>]*>[\\s\\S]*?<\\/pkg:part>`,
        'i'
    );
    
    const partMatch = originalFlatXml.match(partRegex);
    if (!partMatch) {
        throw new Error(`[replaceMainPart] Main part '${mainPartPath}' not found for replacement.`);
    }

    // 참고: 기존의 <w:document> 네임스페이스 보존 로직은 제거되었습니다.
    // 범용성을 위해, updatedMainPartXml이 이미 완전한 네임스페이스를 가지고 있다고 가정합니다.
    // 이는 core/patch-engine.ts의 createXmlElementFromJson 함수가 올바른 네임스페이스로 XML을 생성해야 함을 의미합니다.

    const xmlDataMatch = partMatch[0].match(/(<pkg:xmlData[^>]*>)([\s\S]*?)(<\/pkg:xmlData>)/i);
    if (!xmlDataMatch) {
        throw new Error(`[replaceMainPart] pkg:xmlData section missing in part '${mainPartPath}'.`);
    }

    // <pkg:xmlData> 태그 사이의 내용만 교체
    const updatedPart = partMatch[0].replace(xmlDataMatch[0], `${xmlDataMatch[1]}${updatedMainPartXml}${xmlDataMatch[3]}`);
    
    return originalFlatXml.replace(partMatch[0], updatedPart);
}

export function createXmlElementFromJson(
  id: string,
  itemJson: Record<string, any>,
  xmlDoc: Document,
  orderKey: string,
  config: IHostConfig // ✅ config 추가
): Element {
  const elementType = itemJson.type as string;
  console.log("elementType", elementType, "itemJson", itemJson);
  if (!elementType || !config.elementConfig[elementType]) {
    throw new Error(`[createXmlElementFromJson] Unsupported element type: ${itemJson.type} for ID: ${id}.`);
  }
  const elementConfig = config.elementConfig[elementType];
  
  // [네임스페이스 수정] createElementNS를 사용하여 올바른 네임스페이스로 요소를 생성합니다.
  const contentElement = xmlDoc.createElementNS(config.namespaces.w, elementConfig.xmlTag);

  // 속성 적용
  if (elementConfig.parameters) {
    for (const paramFullName of elementConfig.parameters) {
      const paramKeyInJson = paramFullName.split(':').pop()!;
      if (itemJson.hasOwnProperty(paramKeyInJson) && itemJson[paramKeyInJson] !== null) {
        contentElement.setAttribute(paramFullName, String(itemJson[paramKeyInJson]));
      }
    }
  }
  // properties 적용
  if (itemJson.properties && typeof itemJson.properties === 'object') {
    applyPropertiesToXmlElement(contentElement, itemJson.properties, elementConfig, xmlDoc);
  } else if (elementConfig.xmlTag === 'w:p' && !contentElement.querySelector("pPr")) {
    contentElement.insertBefore(xmlDoc.createElementNS(config.namespaces.w, "w:pPr"), contentElement.firstChild);
  }
  // text 적용
  if (itemJson.text !== undefined && elementConfig.children?.t && elementConfig.xmlTag === 'w:r') {
    const textElement = xmlDoc.createElementNS(config.namespaces.w, "w:t");
    const textContentStr = String(itemJson.text);
    textElement.textContent = textContentStr;
    if (textContentStr.startsWith(" ") || textContentStr.endsWith(" ")) {
      textElement.setAttributeNS("http://www.w3.org/XML/1998/namespace", 'xml:space', 'preserve');
    }
    contentElement.appendChild(textElement);
  }

  // 테이블의 경우 'rows' 배열을 특별히 처리합니다.
  if (elementType === 'table') {
    // [핵심 로직 수정] 테이블의 행과 셀을 올바른 방식으로 생성합니다.
    if (itemJson.grid?.columns) {
        const gridElement = xmlDoc.createElementNS(config.namespaces.w, 'w:tblGrid');
        itemJson.grid.columns.forEach((col: any) => {
            const colEl = xmlDoc.createElementNS(config.namespaces.w, "w:gridCol");
            colEl.setAttribute("w:w", col.w);
            gridElement.appendChild(colEl);
        });
        contentElement.appendChild(gridElement);
    }
      
    if (Array.isArray(itemJson.rows)) {
        itemJson.rows.forEach((rowJson: any) => {
            const trElement = xmlDoc.createElementNS(config.namespaces.w, 'w:tr');
            if (rowJson.properties && config.elementConfig.tableRow) {
                applyPropertiesToXmlElement(trElement, rowJson.properties, config.elementConfig.tableRow, xmlDoc, config);
            }
            
            if (Array.isArray(rowJson.cells)) {
                rowJson.cells.forEach((cellId: string) => {
                    // 테이블 JSON(itemJson)에서 cellId로 셀의 전체 정의를 찾습니다.
                    const cellJson = itemJson[cellId];
                    if (cellJson) {
                        const cellSdt = createXmlElementFromJson(cellId, cellJson, xmlDoc, cellJson.order || 'a0', config);
                        trElement.appendChild(cellSdt);
                    }
                });
            }
            contentElement.appendChild(trElement);
        });
    }
  } else {
    // 그 외 일반적인 자식 요소 처리
    const childItemKeys = Object.keys(itemJson).filter(key =>
        ['type', 'order', 'properties', 'text', 'id', 'parentId', 'grid', 'rows'].indexOf(key) === -1 &&
        !(elementConfig.parameters?.map(p => p.split(':').pop()).includes(key)) &&
        itemJson[key] && typeof itemJson[key] === 'object' && itemJson[key].type
    );

    childItemKeys.sort((a, b) => (itemJson[a]?.order || '').localeCompare(itemJson[b]?.order || ''));
    
    childItemKeys.forEach(childKey => {
      const childJson = itemJson[childKey];
      const childOrder = childJson.order || 'a0'; // 자식의 order가 없으면 기본값 사용
      const childSdtElement = createXmlElementFromJson(childKey, childJson, xmlDoc, childOrder, config);
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

  const sdtTypeIdentifier = elementConfig.sdtType || 'default'; // 기본값은 'default'
//   const choiceXmlTagNameNoPrefix = SDT_CHOICE_TAG_FROM_CONFIG_TYPE[sdtTypeIdentifier]; // 예: "richText"

//   if (choiceXmlTagNameNoPrefix) {
//     // choiceXmlTagNameNoPrefix가 "richText" 등 접두사 없는 이름이라면 'w:'를 붙여줍니다.
//     const choiceElement = xmlDoc.createElement("w:" + choiceXmlTagNameNoPrefix);
//     sdtPrElement.appendChild(choiceElement);
//   }

  sdtElement.appendChild(sdtPrElement);

  const sdtContentElement = xmlDoc.createElement("w:sdtContent");
  sdtContentElement.appendChild(contentElement); // contentElement는 "w:p", "w:r" 등

  if (elementConfig.requiresPrwWrapper) {
    // 2. 필요 시, 더미 단락을 생성하여 뒤에 추가
    const dummyP = createDummyParagraph(xmlDoc, config);
    sdtContentElement.appendChild(dummyP);
  }

  sdtElement.appendChild(sdtContentElement);
  console.log("sdtElement", sdtElement)
  return sdtElement;
}

export function applyPropertiesToXmlElement(
  element: Element,
  propertiesJson: Record<string, any>,
  elementConfig: ElementConfig,
  xmlDoc: Document,
  config?: IHostConfig // 추가: config를 인자로 받음
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
        (node as Element).namespaceURI === config.namespaces.w) {
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
            return cfgLocalName === existingLeafElement.localName && existingLeafElement.namespaceURI === config.namespaces.w;
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
            (node as Element).namespaceURI === config.namespaces.w) {
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
export function createDummyParagraph(xmlDoc: Document, config: IHostConfig): Element {
    const pElement = xmlDoc.createElementNS(config.namespaces.w, "w:p");
    const pPrElement = xmlDoc.createElementNS(config.namespaces.w, "w:pPr");
    const spacing = xmlDoc.createElementNS(config.namespaces.w, "w:spacing");
    spacing.setAttribute("w:after", "0");
    spacing.setAttribute("w:line", "0");
    const rPrElement = xmlDoc.createElementNS(config.namespaces.w, "w:rPr");
    const sz = xmlDoc.createElementNS(config.namespaces.w, "w:sz");
    sz.setAttribute("w:val", "2");
  
    rPrElement.appendChild(sz);
    pPrElement.appendChild(spacing);
    pPrElement.appendChild(rPrElement);
    pElement.appendChild(pPrElement);
    return pElement;
}

export function findSdtElementById(xmlDocOrElement: Document | Element, id: string): Element | null {
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

export function insertSdtInOrder( /* 이전 답변의 코드와 동일 */
    parentElement: Element,
    newSdtElement: Element,
    newOrder: string,
    xmlDoc: Document
) {
    const siblings = Array.from(parentElement.children).filter(c => c.tagName === 'w:sdt');
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
    }
}

export function findElementBySdtId(
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