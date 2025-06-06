import * as shortid from 'shortid';
import { generateNKeysBetween } from 'fractional-indexing';
import { formatXML } from './document';

// XML Namespaces
const NS_W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const NS_WP = "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing";
const NS_A = "http://schemas.openxmlformats.org/drawingml/2006/main";
const NS_PIC = "http://schemas.openxmlformats.org/drawingml/2006/picture";
const NS_R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
// Word 2013+ namespace for appearance (필요시 사용)
// const NS_W15 = "http://schemas.microsoft.com/office/word/2012/wordml";

export const SDT_CHOICE_TAG_FROM_CONFIG_TYPE: Record<string, string | null> = {
  richText: "richText",
  text: "text",            // CT_SdtText (내부에 w:multiLine 등 가능)
  picture: "picture",        // CT_Empty
  date: "date",              // CT_SdtDate (내부에 w:dateFormat, w:lid 등 가능)
  comboBox: "comboBox",      // CT_SdtComboBox
  dropDownList: "dropDownList",// CT_SdtDropDownList
  equation: "equation",      // CT_Empty
  citation: "citation",      // CT_Empty
  group: "group",            // CT_Empty
  bibliography: "bibliography",// CT_Empty
  docPartObj: "docPartObj",  // CT_SdtDocPart
  docPartList: "docPartList",// CT_SdtDocPart

  block: "richText",     // 'block' 식별자는 <choice> 내 'richText' 태그로 해석
  cell: "richText",      // 'cell' 식별자도 <choice> 내 'richText' 태그로 해석
  inline: "richText",    // 'inline' 식별자도 <choice> 내 'richText' 태그로 해석
  
  row: null,
  repeatingSection: null,
  repeatingSectionItem: null,
  docPartGallery: null,
};

// ELEMENT_CONFIG에 sdtType 식별자가 없을 때, 요소의 'type'에 따른 기본 식별자
export const DEFAULT_SDT_IDENTIFIER_BY_ELEMENT_TYPE: Record<string, string> = {
  paragraph: 'block',
  run: 'richText',
  table: 'block',
  tableCell: 'cell',
  hyperlink: 'richText',
  drawing: 'picture', 
};
export const UNIVERSAL_DEFAULT_SDT_IDENTIFIER = 'richText'; // 최후의 기본 SDT 종류 식별자

export interface ElementConfig {
  type: 'structural' | 'property' | 'leaf';
  xmlTag: string;
  jsonKey?: string;
  parameters?: string[];
  children?: Record<string, ElementConfig>;
  isList?: boolean;
  processRowsImplicitly?: boolean;
  // 이 sdtType은 <xsd:choice> 내의 어떤 태그를 사용할지 결정하는 "내부 식별자"
  sdtType?: 'block' | 'inline' | 'richText' | 'cell' | 'row' | 'text' | 'date' | 'docPartObj' | 'docPartGallery' | 'group' | 'picture' | 'equation' | 'citation' | 'bibliography' | 'comboBox' | 'dropdownList' | 'repeatingSection' | 'repeatingSectionItem';
  
  // --- <xsd:choice> 태그 내부 컨텐츠 설정을 위한 필드 (향후 확장) ---
  // 예시: 특정 SDT 종류에 대한 세부 설정을 이곳에 정의
  sdtSpecificConfig?: {
    // sdtType: 'text' 인 경우
    text?: {
      multiLine?: boolean;
      maxLength?: number;
    };
    // sdtType: 'date' 인 경우
    date?: {
      dateFormat?: string;
      lid?: string; // language ID
      storeMappedDataAs?: 'date' | 'text' | 'dateTime';
      calendar?: string; // 'gregorian', 'hijri', etc.
      fullDate?: string; // 실제 날짜값 (xsd:dateTime)
    };
    // sdtType: 'dropDownList' 또는 'comboBox' 인 경우
    listItems?: Array<{ displayText: string; value: string }>;
    // 기타 다른 SDT 종류에 대한 설정 추가 가능
  };
  requiresPrwWrapper?: boolean; // P(aragraph) R(un) Wrapper
}

export const ELEMENT_CONFIG: Record<string, ElementConfig> = {
  paragraph: {
    type: 'structural',
    xmlTag: 'w:p',
    requiresPrwWrapper: true, // ❗ 행(row)을 SDT로 감싸지 않고 암시적으로 처리
    sdtType: 'block',
    children: {
      pPr: {
        type: 'property',
        xmlTag: 'w:pPr',
        jsonKey: 'properties',
        children: {
          jc: { type: 'leaf', xmlTag: 'w:jc', jsonKey: 'justification', parameters: ['w:val'] },
          spacing: { type: 'leaf', xmlTag: 'w:spacing', jsonKey: 'spacing', parameters: ['w:after', 'w:before', 'w:line', 'w:lineRule'] },
          ind: { type: 'leaf', xmlTag: 'w:ind', jsonKey: 'indentation', parameters: ['w:left', 'w:right', 'w:firstLine', 'w:hanging'] },
          rPr: { // 단락 기본 런 속성
            type: 'property',
            xmlTag: 'w:rPr',
            jsonKey: 'runProperties',
            children: {
              rFonts: { type: 'leaf', xmlTag: 'w:rFonts', jsonKey: 'fonts', parameters: ['w:ascii', 'w:hAnsi', 'w:cs', 'w:eastAsia', 'w:hint'] },
              b: { type: 'leaf', xmlTag: 'w:b', jsonKey: 'bold', parameters: ['w:val'] },
              i: { type: 'leaf', xmlTag: 'w:i', jsonKey: 'italic', parameters: ['w:val'] },
              u: { type: 'leaf', xmlTag: 'w:u', jsonKey: 'underline', parameters: ['w:val'] },
              color: { type: 'leaf', xmlTag: 'w:color', jsonKey: 'color', parameters: ['w:val'] },
              sz: { type: 'leaf', xmlTag: 'w:sz', jsonKey: 'fontSize', parameters: ['w:val'] },
              szCs: { type: 'leaf', xmlTag: 'w:szCs', jsonKey: 'fontSizeCs', parameters: ['w:val'] },
              lang: { type: 'leaf', xmlTag: 'w:lang', jsonKey: 'language', parameters: ['w:val'] }
            }
          }
        }
      }
    }
  },
  run: {
    type: 'structural',
    xmlTag: 'w:r',
    sdtType: 'richText',
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
      t: { type: 'leaf', xmlTag: 'w:t', jsonKey: 'text' },
    }
  },
  table: {
    type: 'structural',
    xmlTag: 'w:tbl',
    processRowsImplicitly: true, // ❗ 행(row)을 SDT로 감싸지 않고 암시적으로 처리
    sdtType: 'block',
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
          },
          tblLook: { type: 'leaf', xmlTag: 'w:tblLook', jsonKey: 'look', parameters: ['w:val', 'w:firstRow', 'w:lastRow', 'w:firstColumn', 'w:lastColumn', 'w:noHBand', 'w:noVBand'] }
        }
      },
      tblGrid: {
        type: 'property', xmlTag: 'w:tblGrid', jsonKey: 'grid',
        children: {
          gridCol: { type: 'leaf', xmlTag: 'w:gridCol', jsonKey: 'columns', parameters: ['w:w'], isList: true }
        }
      }
      // <w:tr> 자식 설정은 여기서 직접 다루지 않음
    },
    requiresPrwWrapper: true, // 👈 이 줄 추가
  },
  tableCell: {
    type: 'structural',
    xmlTag: 'w:tc',
    sdtType: 'cell',
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
          },
          vAlign: { type: 'leaf', xmlTag: 'w:vAlign', jsonKey: 'vAlign', parameters: ['w:val'] },
          shd: { type: 'leaf', xmlTag: 'w:shd', jsonKey: 'shading', parameters: ['w:val', 'w:color', 'w:fill', 'w:themeFill', 'w:themeFillShade'] }
        }
      }
    }
  },
  hyperlink: {
    type: 'structural',
    xmlTag: 'w:hyperlink',
    sdtType: 'richText',
    parameters: ['r:id', 'w:anchor', 'w:history'],
    children: {}
  },
  drawing: {
    type: 'structural',
    xmlTag: 'w:drawing',
    sdtType: 'block',
    children: {
      inline: {
        type: 'property', // drawing의 세부 속성으로 취급
        xmlTag: 'wp:inline',
        jsonKey: 'inline', // JSON에서 사용할 키
        // wp:inline의 직접 속성들 (예: distT, distB 등)
        parameters: ['distT', 'distB', 'distL', 'distR'],
        children: {
          extent: { type: 'leaf', xmlTag: 'wp:extent', jsonKey: 'extent', parameters: ['cx', 'cy'] },
          docPr: { type: 'leaf', xmlTag: 'wp:docPr', jsonKey: 'docProperties', parameters: ['id', 'name', 'descr'] },
          graphic: {
            type: 'property', xmlTag: 'a:graphic', jsonKey: 'graphic',
            children: {
              graphicData: {
                type: 'property', xmlTag: 'a:graphicData', parameters: ['uri'], jsonKey: 'graphicData',
                children: {
                  pic: {
                    type: 'property', xmlTag: 'pic:pic', jsonKey: 'picture',
                    children: {
                      blipFill: {
                        type: 'property', xmlTag: 'pic:blipFill', jsonKey: 'blipFill',
                        children: {
                          blip: { // a:blip에서 r:embed 추출
                            type: 'leaf',
                            xmlTag: 'a:blip',
                            jsonKey: 'blipReference',
                            parameters: ['r:embed', 'cstate'] // ❗ r:embed 필수 추출
                          }
                        }
                      },
                      spPr: { type: 'property', xmlTag: 'pic:spPr', jsonKey: 'shapeProperties', children: { /* 상세 정의 필요시 */ } }
                    }
                  }
                }
              }
            }
          }
        }
      },
      anchor: { // wp:anchor도 inline과 유사하게 상세 정의
        type: 'property',
        xmlTag: 'wp:anchor',
        jsonKey: 'anchor',
        // ... (inline과 유사한 상세 자식 구조 정의) ...
        parameters: ['simplePos', 'relativeHeight', 'behindDoc', 'locked', 'layoutInCell', 'allowOverlap'],
        children: {
          extent: { type: 'leaf', xmlTag: 'wp:extent', jsonKey: 'extent', parameters: ['cx', 'cy'] },
          docPr: { type: 'leaf', xmlTag: 'wp:docPr', jsonKey: 'docProperties', parameters: ['id', 'name', 'descr'] },
          graphic: {
            type: 'property', xmlTag: 'a:graphic', jsonKey: 'graphic',
            children: {
              graphicData: {
                type: 'property', xmlTag: 'a:graphicData', parameters: ['uri'], jsonKey: 'graphicData',
                children: {
                  pic: {
                    type: 'property', xmlTag: 'pic:pic', jsonKey: 'picture',
                    children: {
                      blipFill: {
                        type: 'property', xmlTag: 'pic:blipFill', jsonKey: 'blipFill',
                        children: {
                          blip: { // a:blip에서 r:embed 추출
                            type: 'leaf',
                            xmlTag: 'a:blip',
                            jsonKey: 'blipReference',
                            parameters: ['r:embed', 'cstate'] // ❗ r:embed 필수 추출
                          }
                        }
                      },
                      spPr: { type: 'property', xmlTag: 'pic:spPr', jsonKey: 'shapeProperties', children: { /* 상세 정의 필요시 */ } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    requiresPrwWrapper: true, // 👈 이 줄 추가
  },
};

export const TAG_TO_TYPE: Record<string, string> = {
  'w:p': 'paragraph', 'w:r': 'run', 'w:tbl': 'table',
  'w:tc': 'tableCell', 'w:hyperlink': 'hyperlink', 'w:drawing': 'drawing'
  // 'w:tr' 매핑 제거
};
// CONTENT_CONTROL_ELEMENTS는 TAG_TO_TYPE에 따라 자동으로 업데이트됨
const CONTENT_CONTROL_ELEMENTS = Object.values(TAG_TO_TYPE);

export function processDocument(
  xmlString: string,
  existingJson: Record<string, any> = {}
): { json: Record<string, any>; xml: string } {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const xmlDocWithControls = applyContentControlsToDocument(xmlDoc);

  const xmlSerializer = new XMLSerializer();
  const updatedXmlString = xmlSerializer.serializeToString(xmlDocWithControls);
  
  const resultJson = extractJsonFromContentControls(xmlDocWithControls, existingJson);

  return {
    json: resultJson,
    xml: updatedXmlString
  };
}

/**
 * 테이블과 같은 블록 요소 앞에 삽입할 더미 단락을 생성합니다.
 * Word가 최적화 과정에서 제거하지 않도록 공백 텍스트를 포함합니다.
 * @param xmlDoc - XML Document 객체
 * @returns 생성된 <w:p> 요소
 */
function createDummyParagraph(xmlDoc: Document): Element {
  const pElement = xmlDoc.createElement("w:p");
  const pPrElement = xmlDoc.createElement("w:pPr");
  
  // 높이를 최소화하는 빈 단락 속성
  const spacing = xmlDoc.createElement("w:spacing");
  spacing.setAttribute("w:after", "0");
  spacing.setAttribute("w:line", "0");
  pPrElement.appendChild(spacing);
  
  const rPrElement = xmlDoc.createElement("w:rPr");
  const sz = xmlDoc.createElement("w:sz");
  sz.setAttribute("w:val", "2"); // 1pt 크기
  rPrElement.appendChild(sz);
  pPrElement.appendChild(rPrElement);

  pElement.appendChild(pPrElement);
  return pElement;
}

function applyContentControlsToDocument(xmlDoc: Document): Document {
  const wrappedElements = new Set<Element>();

  function findExistingWrappedElementsRecursive(node: Node): void {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      if (element.nodeName === "w:sdt") {
        const contentNode = element.getElementsByTagNameNS(NS_W, "sdtContent")[0];
        if (contentNode && contentNode.firstElementChild) {
          wrappedElements.add(contentNode.firstElementChild);
        }
      }
      for (let i = 0; i < element.childNodes.length; i++) {
        findExistingWrappedElementsRecursive(element.childNodes[i]);
      }
    }
  }
  if (xmlDoc.documentElement) { // body보다 상위인 documentElement에서 시작
    findExistingWrappedElementsRecursive(xmlDoc.documentElement);
  }
  let elementsToWrap = collectTargetElementsRecursive(xmlDoc, wrappedElements);
  elementsToWrap = elementsToWrap.filter(item => !wrappedElements.has(item.element) && !isDirectlyInsideSdtContent(item.element));
  
  elementsToWrap.sort((a, b) => b.depth - a.depth);

  const alreadyHandled = new Set<Element>();

  for (const item of elementsToWrap) {
    if (alreadyHandled.has(item.element)) {
      continue;
    }

    const { element, type } = item;
    const config = ELEMENT_CONFIG[type];

    // ❗ [핵심 수정] 테이블 등 특정 요소를 처리하는 새로운 방식
    if (config?.requiresPrwWrapper) {
      const parent = element.parentNode;
      if (!parent) {
        console.warn(`Cannot wrap <${element.nodeName}> because it has no parent. Skipping.`);
        continue;
      }
      
      console.log(`[Group Wrapping] Applying group wrap for <${element.nodeName}> with dummy paragraph at the end.`);

      // 1. 더미 단락을 생성하고 테이블 *뒤에* 삽입합니다.
      const dummyP = createDummyParagraph(xmlDoc);
      // element.nextSibling이 null이면 맨 뒤에 추가됩니다.
      parent.insertBefore(dummyP, element.nextSibling);

      // 2. 메인 요소(테이블)를 기준으로 <w:sdt>를 생성합니다.
      const id = `${type.charAt(0)}_${shortid.generate()}`;
      const sdtWrapper = wrapWithContentControl(element, id, type)!; // 이제 테이블을 직접 감쌉니다.

      if (sdtWrapper) {
        const sdtContent = sdtWrapper.getElementsByTagName("w:sdtContent")[0];
        if (sdtContent) {
          // 3. 더미 단락을 생성된 <w:sdt>의 sdtContent 안으로 이동시킵니다.
          // appendChild는 노드를 현재 위치에서 제거하고 새 위치로 이동시킵니다.
          sdtContent.appendChild(dummyP);

          // 4. 이 작업으로 처리된 요소들을 등록하여 중복 작업을 방지합니다.
          alreadyHandled.add(element); // 테이블
          alreadyHandled.add(dummyP);  // 더미 단락
        }
      }
    } else {
      // 일반적인 p, r 요소 처리
      const id = `${type.charAt(0)}_${shortid.generate()}`;
      wrapWithContentControl(element, id, type);
      alreadyHandled.add(element);
    }
  }

  console.log(`Wrapped ${alreadyHandled.size} elements with content controls.`);
  assignOrderToContentControls(xmlDoc);
  return xmlDoc;
}

function collectTargetElementsRecursive(
  xmlDocOrElement: Document | Element,
  initialElementsToExclude: Set<Element>,
  depth = 0,
  collected: Array<{element: Element, type: string, depth: number}> = []
): Array<{element: Element, type: string, depth: number}> {
  console.log("initialElementsToExclude", initialElementsToExclude);
  const rootNode = (xmlDocOrElement as Document).documentElement || xmlDocOrElement as Element;

  function traverse(node: Node, currentDepth: number) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;

      if (element.nodeName === "w:sdtContent") {
        for (let i = 0; i < element.childNodes.length; i++) {
            traverse(element.childNodes[i], currentDepth); 
        }
        return;
      }
      const elementType = TAG_TO_TYPE[element.nodeName];
      if (elementType && CONTENT_CONTROL_ELEMENTS.includes(elementType)) {
        
        // ❗ 수정된 로직: 모든 대상 타입을 검사하고, 특정 조건일 때만 제외합니다.
        let shouldBeSkipped = false;
        
        // 1. 이미 감싸여 있거나 sdtContent 바로 아래 있는 경우 건너뛰기
        if (initialElementsToExclude.has(element) || isDirectlyInsideSdtContent(element)) {
          console.log(`Skipping <${element.nodeName}> (ID: ${element.id}) - already wrapped or inside sdtContent.`); 
            shouldBeSkipped = true;
        }

        // 2. 단락 타입인데 비어있는 경우 건너뛰기
        // if (!shouldBeSkipped && elementType === 'paragraph' && isParagraphEmpty(element)) {
        //     shouldBeSkipped = true;
        // }

        // ✅ 최종적으로 건너뛸 필요가 없는 요소만 수집
        if (!shouldBeSkipped) {
            collected.push({ element, type: elementType, depth: currentDepth });
        }
      }

      for (let i = 0; i < element.childNodes.length; i++) {
        traverse(element.childNodes[i], currentDepth + 1);
      }
    }
  }

  if (rootNode) {
    traverse(rootNode, depth);
  }
  return collected;
}

/**
 * <w:p> 요소가 비어 있는지 확인합니다.
 * <w:pPr> 외에 다른 자식 요소(특히 <w:r>)가 없으면 빈 것으로 간주합니다.
 */
// function isParagraphEmpty(pElement: Element): boolean {
//   for (let i = 0; i < pElement.childNodes.length; i++) {
//     const child = pElement.childNodes[i];
//     // <w:pPr>는 단락 속성이므로 무시하고, 다른 요소(주로 <w:r>)가 있는지 확인
//     if (child.nodeType === Node.ELEMENT_NODE && child.nodeName !== 'w:pPr') {
//       return false; // 내용이 있는 요소 발견
//     }
//   }
//   return true; // 내용이 있는 요소를 찾지 못함
// }

function isDirectlyInsideSdtContent(element: Element): boolean {
    return element.parentNode?.nodeName === 'w:sdtContent';
}

function wrapWithContentControl(element: Element, id: string, type: string): Element | null {
  const xmlDoc = element.ownerDocument;
  if (!xmlDoc || !element.parentNode) {
    console.warn(`Cannot wrap element <${element.tagName}> (ID ${id}): parentNode is null.`);
    return null;
  }

  const sdtElement = xmlDoc.createElementNS(NS_W, "w:sdt");
  const sdtPrElement = xmlDoc.createElementNS(NS_W, "w:sdtPr");

  // XSD 순서에 따라 요소 추가 시도 (rPr가 가장 먼저지만, 현재는 생성 로직 없음)

  const aliasElement = xmlDoc.createElementNS(NS_W, "w:alias");
  aliasElement.setAttributeNS(NS_W, "w:val", `${type} ${id}`);
  sdtPrElement.appendChild(aliasElement);

  const tagElement = xmlDoc.createElementNS(NS_W, "w:tag");
  tagElement.setAttributeNS(NS_W, "w:val", id);
  sdtPrElement.appendChild(tagElement);

  const idElementNode = xmlDoc.createElementNS(NS_W, "w:id");
  const wordInternalId = Math.floor(Math.random() * (2**31 - 1)) * (Math.random() < 0.5 ? 1 : -1);
  idElementNode.setAttributeNS(NS_W, "w:val", String(wordInternalId));
  sdtPrElement.appendChild(idElementNode);

  // (XSD에 따라 lock, placeholder, temporary 등이 이 위치에 올 수 있음)
  // 예: const lockElement = xmlDoc.createElementNS(NS_W, "lock");
  //     lockElement.setAttributeNS(NS_W, "w:val", "sdtLocked"); 
  //     sdtPrElement.appendChild(lockElement);

  // const showingPlcHdrElement = xmlDoc.createElementNS(NS_W, "showingPlcHdr");
  // showingPlcHdrElement.setAttributeNS(NS_W, "w:val", "1"); // 또는 "true"
  // sdtPrElement.appendChild(showingPlcHdrElement);

  // (XSD에 따라 dataBinding, label, tabIndex 등이 이 위치에 올 수 있음)

  // --- <w:sdtType> 요소는 제공된 XSD 스키마에 없으므로 생성하지 않음 ---

  // --- XSD <choice> 블록에 해당하는 특정 종류 태그 추가 ---
  const elementSpecificConfig = ELEMENT_CONFIG[type];
  const sdtTypeIdentifier = elementSpecificConfig?.sdtType ||
                            DEFAULT_SDT_IDENTIFIER_BY_ELEMENT_TYPE[type] ||
                            UNIVERSAL_DEFAULT_SDT_IDENTIFIER;

  const choiceXmlTagName = SDT_CHOICE_TAG_FROM_CONFIG_TYPE[sdtTypeIdentifier];

  if (choiceXmlTagName) {
    const choiceElement = xmlDoc.createElementNS(NS_W, `w:${choiceXmlTagName}`);

    // --- <choice> 태그 내부 컨텐츠(세부 설정) 생성 로직 ---
    // ELEMENT_CONFIG의 sdtSpecificConfig를 사용하여 채웁니다.
    if (elementSpecificConfig?.sdtSpecificConfig) {
      if (sdtTypeIdentifier === 'text' && elementSpecificConfig.sdtSpecificConfig.text) {
        const textConf = elementSpecificConfig.sdtSpecificConfig.text;
        if (textConf.multiLine !== undefined) {
          const multiLineEl = xmlDoc.createElementNS(NS_W, "w:multiLine");
          multiLineEl.setAttributeNS(NS_W, "w:val", textConf.multiLine ? "1" : "0");
          choiceElement.appendChild(multiLineEl);
        }
        // textConf.maxLength 처리 로직 추가 가능
      } else if (sdtTypeIdentifier === 'date' && elementSpecificConfig.sdtSpecificConfig.date) {
        const dateConf = elementSpecificConfig.sdtSpecificConfig.date;
        if (dateConf.dateFormat) {
          const dateFormatEl = xmlDoc.createElementNS(NS_W, "w:dateFormat");
          dateFormatEl.setAttributeNS(NS_W, "w:val", dateConf.dateFormat);
          choiceElement.appendChild(dateFormatEl);
        }
        if (dateConf.lid) {
          const lidEl = xmlDoc.createElementNS(NS_W, "w:lid");
          lidEl.setAttributeNS(NS_W, "w:val", dateConf.lid);
          choiceElement.appendChild(lidEl);
        }
        if (dateConf.storeMappedDataAs) {
          const storeMappedDataAsEl = xmlDoc.createElementNS(NS_W, "w:storeMappedDataAs");
          storeMappedDataAsEl.setAttributeNS(NS_W, "w:val", dateConf.storeMappedDataAs);
          choiceElement.appendChild(storeMappedDataAsEl);
        }
        if (dateConf.calendar) {
          const calendarEl = xmlDoc.createElementNS(NS_W, "w:calendar");
          calendarEl.setAttributeNS(NS_W, "w:val", dateConf.calendar);
          choiceElement.appendChild(calendarEl);
        }
        if (dateConf.fullDate) { // CT_SdtDate의 fullDate는 xsd:dateTime 타입
            const fullDateEl = xmlDoc.createElementNS(NS_W, "w:fullDate");
            fullDateEl.setAttributeNS(NS_W, "w:val", dateConf.fullDate); // 예: "2025-06-04T00:00:00Z"
            choiceElement.appendChild(fullDateEl);
        }
      }
      // TODO: comboBox, dropDownList 등의 sdtSpecificConfig 처리 로직 추가
      // 예: <w:listItem w:displayText="옵션1" w:value="1"/>
    }
    sdtPrElement.appendChild(choiceElement);
  }

  sdtElement.appendChild(sdtPrElement);

  // --- <w:sdtContent> 생성 및 원래 요소 삽입 ---
  const sdtContentElement = xmlDoc.createElementNS(NS_W, "w:sdtContent");
  if (element.parentNode) { // 안전하게 부모가 있는지 확인 후 replaceChild 호출
    element.parentNode.replaceChild(sdtElement, element);
  } else {
    // 만약 element가 이미 DOM에서 분리된 상태라면 (이론적으로는 발생하면 안 됨)
    // sdtElement를 직접 반환하거나, 특정 위치에 삽입하는 로직이 필요할 수 있음.
    // 여기서는 경고를 남기고, sdtElement에 직접 내용을 추가하는 방식을 취할 수 있지만,
    // 호출부에서 element가 유효한 DOM 노드임을 보장해야 함.
    console.warn(`Element to be wrapped (ID: ${id}, Type: ${type}) has no parentNode. SDT will be created but not placed in the original element's position.`);
  }
  sdtContentElement.appendChild(element); // element는 이제 sdtContent의 자식
  sdtElement.appendChild(sdtContentElement); // sdtContent를 sdt에 추가
  // --- <w:sdtContent> 처리 끝 ---

  return sdtElement;
}


export function extractJsonFromContentControls(
  xmlDoc: Document,
  existingJson: Record<string, any> = {}
): Record<string, any> {
  const resultJson: Record<string, any> = {};
  const idElementMap = new Map<string, Element>(); 

  const sdtElements = Array.from(xmlDoc.getElementsByTagNameNS(NS_W, "sdt"));

  for (const sdt of sdtElements) {
    const tagElements = sdt.getElementsByTagNameNS(NS_W, "tag");
    if (!(tagElements.length > 0 && tagElements[0].hasAttributeNS(NS_W, "val"))) continue;
    
    const id = tagElements[0].getAttributeNS(NS_W, "val")!;
    let order: string | null = null;
    const aliasElements = sdt.getElementsByTagNameNS(NS_W, "alias");
    if (aliasElements.length > 0 && aliasElements[0].hasAttributeNS(NS_W, "val")) {
      const aliasValue = aliasElements[0].getAttributeNS(NS_W, "val") || "";
      if (aliasValue.includes('__')) {
        order = aliasValue.substring(aliasValue.lastIndexOf('__') + 2);
      }
    }

    const contentNode = sdt.getElementsByTagNameNS(NS_W, "sdtContent")[0];
    if (!(contentNode && contentNode.firstElementChild)) continue;
    
    const actualElement = contentNode.firstElementChild as Element;
    // console.log(`Processing element with ID: ${id}, Type: ${actualElement.nodeName}`);
    const elementType = TAG_TO_TYPE[actualElement.nodeName];

    if (!elementType) {
      console.warn(`Unknown element type for nodeName: ${actualElement.nodeName} (ID: ${id}). Skipping.`);
      continue;
    }
    
    idElementMap.set(id, actualElement);

    let extractedData;
    if (elementType === 'table' && ELEMENT_CONFIG[elementType]?.processRowsImplicitly) {
      extractedData = extractTableDataWithImplicitRows(actualElement, elementType, id, resultJson, idElementMap, xmlDoc);
    } else {
      extractedData = extractElementData(actualElement, elementType);
    }

    let elementJson: any = {
      type: elementType,
      // id: id, 
      ...extractedData
    };

    if (order) {
      elementJson.order = order;
    }

    if (existingJson[id]) {
      elementJson = mergeElementData(existingJson[id], elementJson);
    }
    resultJson[id] = elementJson;
  }
  
  buildHierarchyStructure(resultJson, xmlDoc);
  return resultJson;
}

function extractTableDataWithImplicitRows(
    tableElement: Element, 
    tableElementType: string, 
    tableSdtId: string,
    resultJson: Record<string, any>, 
    idElementMap: Map<string, Element>,
    xmlDoc: Document
): Record<string, any> {
    const tableData = extractElementData(tableElement, tableElementType); 
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

        const trPrElement = trElement.getElementsByTagNameNS(NS_W, 'trPr')[0];
        if (trPrElement) {
            const trHeightElement = trPrElement.getElementsByTagNameNS(NS_W, 'trHeight')[0];
            if (trHeightElement) {
                rowJson.properties.height = {};
                if (trHeightElement.hasAttributeNS(NS_W,'val')) rowJson.properties.height.val = trHeightElement.getAttributeNS(NS_W,'val');
                if (trHeightElement.hasAttributeNS(NS_W,'hRule')) rowJson.properties.height.hRule = trHeightElement.getAttributeNS(NS_W,'hRule');
            }
            // 기타 필요한 trPr 속성 추출 로직 추가 가능
        }

        const cellSdtNodes = trElement.childNodes; // <w:tr>의 직접 자식들 (셀 <w:sdt>들)
        const cellInfos: { id: string, order: string }[] = [];

        for (let i = 0; i < cellSdtNodes.length; i++) {
            const node = cellSdtNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'w:sdt') {
                const cellSdtElement = node as Element;
                const tagEl = cellSdtElement.getElementsByTagNameNS(NS_W, 'tag')[0];
                const aliasEl = cellSdtElement.getElementsByTagNameNS(NS_W, 'alias')[0];

                if (tagEl && tagEl.hasAttributeNS(NS_W, 'val')) {
                    const cellSdtIdVal = tagEl.getAttributeNS(NS_W, 'val')!;
                    let cellOrderVal = "";
                    if (aliasEl && aliasEl.hasAttributeNS(NS_W, 'val')) {
                        const aliasStr = aliasEl.getAttributeNS(NS_W, 'val') || "";
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

function extractElementData(element: Element, elementType: string): Record<string, any> {
  const result: Record<string, any> = {};
  const config = ELEMENT_CONFIG[elementType];

  if (!config) {
    console.warn(`No ELEMENT_CONFIG found for elementType: ${elementType} (element: ${element.nodeName})`);
    return result;
  }

  if (config.parameters) {
    for (const param of config.parameters) {
      if (element.hasAttribute(param)) { // 네임스페이스 고려: element.hasAttributeNS(NS_W, paramKey) 등
        const paramKey = param.includes(':') ? param.substring(param.indexOf(':') + 1) : param;
        const namespace = param.includes(':') ? (param.startsWith('w:') ? NS_W : (param.startsWith('r:') ? NS_R : null )) : NS_W; // 단순화된 네임스페이스 추론
        
        if (namespace) {
            result[paramKey] = element.getAttributeNS(namespace, paramKey)!;
        } else {
            result[paramKey] = element.getAttribute(param)!; // 네임스페이스 없는 속성 또는 기본
        }
      }
    }
  }

  if (config.children) {
    if (elementType === 'table' && config.processRowsImplicitly) {
      const tableSpecificChildConfigs: Record<string, ElementConfig> = {};
      if (config.children.tblPr) tableSpecificChildConfigs.tblPr = config.children.tblPr;
      if (config.children.tblGrid) tableSpecificChildConfigs.tblGrid = config.children.tblGrid;
      processChildElements(element, tableSpecificChildConfigs, result);
    } else {
      processChildElements(element, config.children, result);
    }
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
                itemData = {}; // 빈 객체로 초기화
                if (childConfig.children) {
                    processChildElements(childElement, childConfig.children, itemData);
                }
                // 속성 객체가 비어있지 않은 경우에만 추가 (또는 항상 추가하도록 정책 변경 가능)
                 if (Object.keys(itemData).length > 0) listData.push(itemData);
            } else if (childConfig.type === 'leaf') {
                itemData = extractLeafData(childElement, childConfig);
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
            singleData = {}; // 빈 객체로 초기화
            if (childConfig.children) {
                processChildElements(childElement, childConfig.children, singleData);
            }
             if (Object.keys(singleData).length === 0 && childConfig.parameters && childConfig.parameters.length > 0) {
                // 자식은 없지만 직접 파라미터가 있는 경우
                const directParams = extractLeafData(childElement, childConfig);
                if (directParams && typeof directParams === 'object' && Object.keys(directParams).length > 0){
                     Object.assign(singleData, directParams);
                } else if (directParams === true && (!childConfig.parameters || childConfig.parameters.length === 0)) { // ❗ 수정: config -> childConfig
                     // no-parameter leaf인데 true로 반환된 경우, property 객체에 키를 true로 할당할지 결정 필요
                     // 예: childConfig.jsonKey가 있다면 singleData[childConfig.jsonKey] = true;
                     // 또는 이 케이스가 발생하지 않도록 extractLeafData/ELEMENT_CONFIG 조정
                }
             }

            if (Object.keys(singleData).length > 0) {
                result[jsonKey] = singleData;
            } else if (childConfig.parameters && childConfig.parameters.length === 0) {
                 // 파라미터 없는 property 태그 존재 자체 (예: <w:keepNext/>)
                result[jsonKey] = true;
            }

        } else if (childConfig.type === 'leaf') {
            singleData = extractLeafData(childElement, childConfig);
            if (singleData !== null) { 
                result[jsonKey] = singleData;
            }
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
  let hasValAttribute = false;

  if (config.parameters) {
    for (const paramName of config.parameters) {
      const paramKey = paramName.includes(':') ? paramName.substring(paramName.indexOf(':') + 1) : paramName;
      const namespace = paramName.includes(':') ? (paramName.startsWith('w:') ? NS_W : (paramName.startsWith('r:') ? NS_R : null )) : NS_W; // 단순화
      
      if (element.hasAttributeNS(namespace, paramKey) || (!namespace && element.hasAttribute(paramKey))) {
        params[paramKey] = namespace ? element.getAttributeNS(namespace, paramKey)! : element.getAttribute(paramKey)!;
        extractedParamCount++;
        if (paramName === 'w:val') hasValAttribute = true;
      }
    }
  }
  
  if (config.parameters && config.parameters.length === 1 && hasValAttribute && config.parameters[0] === 'w:val') {
    return params['val']; // 'val' 키로 접근
  }

  if (extractedParamCount > 0) {
    return params;
  }
 
  // 파라미터가 정의되지 않았거나, 정의되었지만 하나도 추출되지 않은 경우 (예: <w:b/>, <w:i/>)
  // 태그 존재 자체로 true를 의미
  if (!config.parameters || config.parameters.length === 0 || extractedParamCount === 0) {
      return true; 
  }
  
  return null; 
}

function buildHierarchyStructure(
  resultJson: Record<string, any>,
  xmlDoc: Document // 또는 idElementMap, 현재 로직에서는 xmlDoc으로 SDT를 다시 찾는 것으로 보임
): void {
  const childToParentMap = new Map<string, string>(); // childSdtId -> parentSdtId
  const allSdtElements = Array.from(xmlDoc.getElementsByTagNameNS(NS_W, "sdt"));

  for (const sdtElement of allSdtElements) {
    const sdtPr = sdtElement.getElementsByTagNameNS(NS_W, "w:sdtPr")[0];
    if (!sdtPr) continue;
    const tagElements = sdtPr.getElementsByTagNameNS(NS_W, "w:tag");
    if (!(tagElements.length > 0 && tagElements[0].hasAttributeNS(NS_W, "w:val"))) continue;
    
    const currentSdtId = tagElements[0].getAttributeNS(NS_W, "w:val")!;
    if (!resultJson[currentSdtId]) continue;

    let parentNode = sdtElement.parentNode;
    let parentSdtElement: Element | null = null;
    while (parentNode && parentNode !== xmlDoc.documentElement && parentNode !== xmlDoc) {
        // 부모 SDT를 찾을 때, 실제 콘텐츠 요소(<w:p>, <w:r> 등)의 부모 SDT를 찾아야 함
        // 현재 로직은 SDT의 부모 SDT를 찾고 있음. 이는 중첩 SDT 구조에서는 맞음.
        if (parentNode.nodeType === Node.ELEMENT_NODE && 
            (parentNode as Element).localName === 'w:sdt' && 
            (parentNode as Element).namespaceURI === NS_W) {
            parentSdtElement = parentNode as Element;
            break;
        }
        parentNode = parentNode.parentNode;
    }

    if (parentSdtElement) {
        const parentSdtPr = parentSdtElement.getElementsByTagNameNS(NS_W, 'w:sdtPr')[0];
        if (parentSdtPr) {
            const parentTagElements = parentSdtPr.getElementsByTagNameNS(NS_W, 'w:tag');
            if (parentTagElements.length > 0 && parentTagElements[0].hasAttributeNS(NS_W, 'w:val')) {
                const parentSdtId = parentTagElements[0].getAttributeNS(NS_W, 'w:val')!;
                if (resultJson[parentSdtId]) { 
                    childToParentMap.set(currentSdtId, parentSdtId);
                }
            }
        }
    }
  }
  
  const parentToChildrenOrderMap = new Map<string, {id: string, order: string}[]>();
  childToParentMap.forEach((parentId, childId) => {
    const childObj = resultJson[childId];
    if (childObj && childObj.order !== undefined) { 
        if (!parentToChildrenOrderMap.has(parentId)) parentToChildrenOrderMap.set(parentId, []);
        parentToChildrenOrderMap.get(parentId)!.push({id: childId, order: childObj.order});
    } else if (childObj) { // order가 없는 경우 대비 (예: healing으로 인해 alias가 없을 때)
        if (!parentToChildrenOrderMap.has(parentId)) parentToChildrenOrderMap.set(parentId, []);
        // console.warn(`[buildHierarchyStructure] Child object ${childId} is missing 'order'. Using fallback.`);
        parentToChildrenOrderMap.get(parentId)!.push({id: childId, order: shortid.generate()}); 
    }
  });

  parentToChildrenOrderMap.forEach(children => children.sort((a, b) => a.order.localeCompare(b.order)));
  
  parentToChildrenOrderMap.forEach((sortedChildren, parentId) => {
    const parentObj = resultJson[parentId];
    if (parentObj) {
      // ❗ 핵심 수정: 'content' 객체 없이 부모 객체에 자식 ID를 키로 하여 직접 할당
      // 테이블 행과 셀은 이미 extractTableDataWithImplicitRows에서 처리되므로, 일반적인 경우에만 적용.
      if (parentObj.type !== 'table' && parentObj.type !== 'tableRow') { 
        sortedChildren.forEach(childInfo => {
          const childJson = resultJson[childInfo.id];
          if (childJson) {
            parentObj[childInfo.id] = childJson; // 부모 객체에 직접 자식 추가
            delete resultJson[childInfo.id];     // 최상위 resultJson에서 자식 제거
          }
        });
      }
      // 기존 'content' 필드가 있다면 삭제 (선택적)
      // if (parentObj.content && Object.keys(parentObj.content).length === 0) {
      //   delete parentObj.content;
      // } else if (parentObj.content && Object.keys(parentObj.content).length > 0 && parentObj.type !== 'table' && parentObj.type !== 'tableRow') {
      //   // 만약 content 필드가 이미 존재하고, 위 로직에서 parentObj[childInfo.id]로 옮겼다면, 기존 content는 비워야 함.
      //   // 하지만 위 로직은 parentObj.content를 사용하지 않으므로, 이 부분은 필요 없을 수 있음.
      //   // 혹시 모를 이전 로직의 잔재를 위해 남겨둘 수 있으나, 깔끔하게 하려면 parentObj.content 사용 자체를 없애야 함.
      // }
    }
  });

  // 테이블 행 객체를 테이블의 rows 배열에 ID 대신 실제 객체로 채우고, 최상위에서 행 객체 제거
  // (이 로직은 extractTableDataWithImplicitRows가 rows 배열에 row JSON 객체를 직접 넣는다면 필요 없어지거나 수정되어야 함)
  // 현재 extractTableDataWithImplicitRows는 rows 배열에 conceptualRowId를 넣고, resultJson에 row 객체를 저장함.
  // 따라서 이 로직은 그 row 객체를 table.rows 안으로 옮기는 역할을 함.
  Object.keys(resultJson).forEach(key => {
    if (resultJson[key]?.type === 'table') {
      const tableJson = resultJson[key];
      if (tableJson.rows && Array.isArray(tableJson.rows)) {
        // tableJson.rows에는 conceptualRowId들이 문자열로 들어있음 (extractTableDataWithImplicitRows 현재 로직 기준)
        tableJson.rows = tableJson.rows.map((rowIdOrConceptualId: any) => {
          // rowIdOrConceptualId가 실제 row 객체가 아니고 문자열 ID라면
          if (typeof rowIdOrConceptualId === 'string' && resultJson[rowIdOrConceptualId] && resultJson[rowIdOrConceptualId].type === 'tableRow') {
            const rowObject = resultJson[rowIdOrConceptualId];
            delete resultJson[rowIdOrConceptualId]; // 최상위에서 행 객체 제거
            return rowObject; // 실제 행 객체로 교체
          }
          // 이미 객체이거나(이전 로직의 잔재 또는 다른 흐름), 찾을 수 없는 경우
          return rowIdOrConceptualId; 
        }).filter((row: any) => row && typeof row === 'object'); // 유효한 객체만 남김
      }
    }
  });
}


function assignOrderToContentControls(xmlDoc: Document): void {
  // console.log("xmlDoc", xmlDoc);
  const bodyElements = xmlDoc.getElementsByTagNameNS(NS_W, "body");
  if (bodyElements.length === 0) return;
  const body = bodyElements[0];

  // currentParentSdtOrderKey는 현재 부모 SDT의 order key (계층적 order 생성 시 사용 가능, 현재는 사용 안함)
  function processElementAndItsDirectSdtChildren(currentElement: Element): void {
    const directChildSdts: Element[] = [];

    // 현재 요소(currentElement)의 직접 자식들 중에서 <w:sdt>만 수집
    // console.log(`Processing element <${currentElement.childNodes.length}> for direct child SDTs`);
    for (let i = 0; i < currentElement.childNodes.length; i++) {
      const childNode = currentElement.childNodes[i];
      // console.log(`Child node ${i}: <${childNode.nodeName}>`);
      if (childNode.nodeType === Node.ELEMENT_NODE && childNode.nodeName === 'sdt') {
        directChildSdts.push(childNode as Element);
      }
    }

    // 수집된 직접 자식 <w:sdt>들에 대해 순서 할당
    // console.log(`Found ${directChildSdts.length} direct child SDTs for element <${currentElement.nodeName}>`);
    if (directChildSdts.length > 0) {
      // console.log(`Processing ${directChildSdts.length} direct child SDTs for element <${currentElement.nodeName}>`);
      const orders = generateNKeysBetween(null, null, directChildSdts.length);
      directChildSdts.forEach((sdt, index) => {
        setOrderToSdtAlias(sdt, orders[index], xmlDoc);
        
        // 이 SDT의 내용물에 대해 다시 재귀
        const sdtContent = sdt.getElementsByTagNameNS(NS_W, 'sdtContent')[0];
        if (sdtContent && sdtContent.firstElementChild) {
          processElementAndItsDirectSdtChildren(sdtContent.firstElementChild as Element);
        }
      });
    }
    
    // 만약 currentElement가 <w:tr>이나 <w:tc>처럼 SDT가 아니지만 그 안에 SDT를 가질 수 있는 요소라면,
    // 그 자식들에 대해서도 재귀적으로 processElementAndItsDirectSdtChildren를 호출할 필요가 있음.
    // 하지만 위 로직에서 sdtContent.firstElementChild에 대해 재귀하므로,
    // <w:tbl> -> <w:tr> -> <w:tc> -> <w:p> -> <w:r> 와 같은 경로로 자연스럽게 처리될 것임.
    // 단, <w:tr>은 SDT로 감싸이지 않으므로, <w:tbl>의 sdtContent.firstElementChild인 <w:tbl> 요소에 대해
    // processElementAndItsDirectSdtChildren가 호출될 때, <w:tbl>의 자식 <w:tr>들에 대해
    // processElementAndItsDirectSdtChildren(trElement)를 명시적으로 호출해줘야 함.

    if (currentElement.nodeName === 'w:tbl') {
        const trElements: Element[] = [];
        for (let i = 0; i < currentElement.childNodes.length; i++) {
            const node = currentElement.childNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'w:tr') {
                trElements.push(node as Element);
            }
        }
        trElements.forEach(tr => {
            processElementAndItsDirectSdtChildren(tr); // 각 <w:tr> 내부의 셀 <w:sdt> 처리 위임
        });
    }
    // <w:tc>나 <w:p>의 경우, 그 자식 <w:sdt>들은 위 directChildSdts 루프에서 처리됨.
  }

  processElementAndItsDirectSdtChildren(body);
}

// setOrderToSdtAlias 함수는 이전과 동일하게 유지
// (단, aliasElement가 null일 때 sdtPr에 appendChild 하기 전에, sdtPr의 다른 자식 요소들과의 순서를 고려하는 것이 더 좋을 수 있습니다.)
function setOrderToSdtAlias(sdtElement: Element, order: string, xmlDoc: Document): void {
  // console.log("sdtElement:", sdtElement);
  // console.log(`Setting order ${order} for SDT with ID: ${sdtElement.getAttributeNS(NS_W, "id")}`);
  const sdtPr = sdtElement.getElementsByTagNameNS(NS_W, "sdtPr")[0];
  if (!sdtPr) return;

  let aliasElement = sdtPr.getElementsByTagNameNS(NS_W, "alias")[0];
  // console.log("aliasElement:", aliasElement);
  if (!aliasElement) {
    aliasElement = xmlDoc.createElementNS(NS_W, "w:alias");
    // <w:alias>는 보통 <w:sdtPr>의 첫 번째 자식 또는 <w:docPartObj> 뒤 등에 위치합니다.
    // 여기서는 간단히 마지막에 추가하거나, 필요시 순서 조정 로직 추가.
    sdtPr.appendChild(aliasElement); 
  }

  const currentAliasValue = aliasElement.getAttributeNS(NS_W, "val") || "";
  
  if (currentAliasValue.includes("__")) {
    // console.log(`Current alias value "${currentAliasValue}" already has an order suffix. Updating...`);
    const baseValue = currentAliasValue.substring(0, currentAliasValue.lastIndexOf("__"));
    aliasElement.setAttributeNS(NS_W, "w:val", `${baseValue}__${order}`);
  } else { 
    const tagElement = sdtPr.getElementsByTagNameNS(NS_W, "tag")[0];
    let baseAlias = currentAliasValue; 
    // console.log("tagElement:", tagElement);

    if (!baseAlias && tagElement && tagElement.hasAttributeNS(NS_W, "val")) {
        const tagVal = tagElement.getAttributeNS(NS_W, "val")!;
        const typePrefix = tagVal.split('_')[0];
        let resolvedTypeName = typePrefix; 
        const sdtContent = sdtElement.getElementsByTagNameNS(NS_W, 'sdtContent')[0];
        if (sdtContent && sdtContent.firstElementChild) {
            resolvedTypeName = TAG_TO_TYPE[sdtContent.firstElementChild.nodeName] || typePrefix;
        }
        baseAlias = `${resolvedTypeName} ${tagVal}`;
    } else if (!baseAlias) {
        const idAttrNode = sdtPr.getElementsByTagNameNS(NS_W, "id")[0];
        const idAttr = idAttrNode ? idAttrNode.getAttributeNS(NS_W, "val") : null;
        baseAlias = `unknown ${idAttr || shortid.generate()}`;
    }
    aliasElement.setAttributeNS(NS_W, "w:val", `${baseAlias}__${order}`);
  }
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