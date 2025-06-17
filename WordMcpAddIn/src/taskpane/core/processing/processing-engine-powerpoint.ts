// src/core/processing-engine.ts

import type { IHostConfig, ElementConfig } from '../../configs/config.interface';

/**
 * [범용 메인] XML 문자열과 config를 받아, 재귀적으로 분석하여 JSON 객체를 생성합니다.
 */
/**
 * [범용 메인] XML 문자열과 config를 받아, 재귀적으로 분석하여 JSON 객체를 생성합니다.
 */
export function extractJsonFromXml(xmlString: string, config: IHostConfig): Record<string, any> {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const rootElement = xmlDoc.documentElement;

  const rootType = config.tagToType[rootElement.nodeName];
  if (!rootType) return {};
  console.log("rootType:", rootType, "rootElement:", rootElement);
  return { [rootType]: _extractElementData(rootElement, rootType, config) };
}

/**
 * [내부 헬퍼] 요소의 데이터(속성, 자식, 텍스트)를 추출하는 핵심 재귀 함수
 */
function _extractElementData(element: Element, elementType: string, config: IHostConfig): any {
  console.log("elementType:", elementType, "element:", element);
    const elementConfig = config.elementConfig[elementType]; //styleSheet
    if (!elementConfig) return {};

    const result: Record<string, any> = {};

    // 1. 속성(Parameters) 추출
    if (elementConfig.parameters) {
        for (const param of elementConfig.parameters) {
            const [prefix, localName] = param.includes(':') ? param.split(':') as [string, string] : [null, param];
            const attrValue = prefix ? element.getAttributeNS(config.namespaces[prefix], localName) : element.getAttribute(localName);
            if (attrValue !== null) {
                if (elementConfig.type === 'leaf' && elementConfig.parameters.length === 1) return attrValue;
                result[localName || param] = attrValue;
            }
        }
    }
    
    // 2. 자식(Children) 요소 재귀 처리
    if (elementConfig.children) {
        _processChildElements(element, elementConfig.children, result, config);
    }
    
    // 3. 텍스트 내용(Text Content) 추출
    if (!element.children.length && element.textContent?.trim()) {
        if (Object.keys(result).length > 0) result.text = element.textContent.trim();
        else return element.textContent.trim();
    }

    // 4. 존재만으로 의미를 갖는 빈 태그 처리
    if (Object.keys(result).length === 0 && !element.children.length && !element.textContent?.trim()) {
        return true;
    }

    return result;
}

// src/core/processing-engine.ts

// ... 다른 함수들은 그대로 유지 ...

/**
 * [최종 수정] config에 정의된 children을 기반으로 자식 요소들을 재귀 처리합니다.
 * 네임스페이스와 태그 이름 처리를 안정적으로 변경했습니다.
 */
function _processChildElements(
  parentElement: Element,
  childConfigs: Record<string, ElementConfig>,
  result: Record<string, any>,
  config: IHostConfig
): void {
  for (const [childKey, childConfig] of Object.entries(childConfigs)) {
      
      // --- ✅ 안정적인 태그 및 네임스페이스 파싱 로직 ---
      const tagParts = childConfig.xmlTag.split(':');
      const prefix = tagParts.length > 1 ? tagParts[0] : null;
      const localName = tagParts.length > 1 ? tagParts[1] : tagParts[0];

      // 자식 요소는 부모의 네임스페이스를 상속받는 것이 일반적입니다.
      // 접두사가 있다면 해당 네임스페이스를, 없다면 부모의 네임스페이스를 사용합니다.
      const expectedNamespaceURI = prefix ? config.namespaces[prefix] : parentElement.namespaceURI;
      // --- 수정 끝 ---

      const childElements = Array.from(parentElement.children).filter(
          c => c.localName === localName && c.namespaceURI === expectedNamespaceURI
      );

      if (childElements.length === 0) {
          // 디버깅을 위해 '못 찾음' 로그 추가
          // console.log(`Could not find child <${localName}> in <${parentElement.localName}> with NS: ${expectedNamespaceURI}`);
          continue;
      }
      
      const jsonKey = childConfig.jsonKey || childKey;

      if (childConfig.isList) {
          console.log("isList childElements:", childElements, "jsonKey:", jsonKey);
          console.log("chlidElemets.map:", childElements.map(child => _extractElementData(child, childKey, config)));
          result[jsonKey] = childElements.map(child => _extractElementData(child, childKey, config));
      } else {
        console.log("single childElements:", childElements, "jsonKey:", jsonKey);
        console.log("childElements[0]:", childElements[0]);
          const childData = _extractElementData(childElements[0], childKey, config);
          if (childData !== null && (typeof childData !== 'object' || Object.keys(childData).length > 0) || childData === true) {
              result[jsonKey] = childData;
          }
      }
  }
}

// src/core/processing-engine-excel.ts

/**
 * [Excel 전용] workbook.xml과 rels.xml을 파싱하여 시트 정보를 반환합니다.
 */
export function processExcelWorkbook(workbookXml: string, relsXml: string): { sheetOrder: string[], sheetRels: any[] } {
  const parser = new DOMParser();
  const workbookDoc = parser.parseFromString(workbookXml, "text/xml");
  const relsDoc = parser.parseFromString(relsXml, "text/xml");

  const sheetElements = Array.from(workbookDoc.getElementsByTagName("sheet"));
  const relElements = Array.from(relsDoc.getElementsByTagName("Relationship"));

  const sheetRels = sheetElements.map(sheet => {
      const rId = sheet.getAttribute("r:id");
      const rel = relElements.find(r => r.getAttribute("Id") === rId);
      return {
          id: `sheet${sheet.getAttribute("sheetId")}`,
          rId: rId,
          name: sheet.getAttribute("name"),
          target: rel ? rel.getAttribute("Target") : ''
      };
  });

  const sheetOrder = sheetRels.map(r => r.id);
  return { sheetOrder, sheetRels };
}

/**
* [Excel 전용] styles.xml을 파싱하여 JSON의 styles 객체와 인덱스-스타일ID 맵을 반환합니다.
*/
export function processExcelStyles(stylesXml: string): { stylesJson: Record<string, any>, xmlIndexToStyleIdMap: Map<number, string> } {
  const parser = new DOMParser();
  const stylesDoc = parser.parseFromString(stylesXml, "text/xml");
  
  const stylesJson: Record<string, any> = {};
  const xmlIndexToStyleIdMap = new Map<number, string>();
  const styleFingerprintToIdMap = new Map<string, string>();

  const fonts = Array.from(stylesDoc.getElementsByTagName("font"));
  const fills = Array.from(stylesDoc.getElementsByTagName("fill"));
  
  Array.from(stylesDoc.getElementsByTagName("cellXfs")[0]?.getElementsByTagName("xf") || []).forEach((xf, index) => {
      const styleDef: any = {};
      
      if (xf.getAttribute("applyFont") === "1") {
          const fontId = parseInt(xf.getAttribute("fontId")!, 10);
          const fontElement = fonts[fontId];
          if (fontElement) {
              styleDef.font = {
                  bold: !!fontElement.getElementsByTagName("b").length,
                  size: parseInt(fontElement.getElementsByTagName("sz")[0]?.getAttribute("val") || "0", 10),
                  color: fontElement.getElementsByTagName("color")[0]?.getAttribute("rgb") || undefined,
              };
          }
      }
      if (xf.getAttribute("applyFill") === "1") {
          const fillId = parseInt(xf.getAttribute("fillId")!, 10);
          const patternFill = fills[fillId]?.getElementsByTagName("patternFill")[0];
          if(patternFill) {
              const fgColor = patternFill.getElementsByTagName("fgColor")[0]?.getAttribute("rgb");
              if(fgColor) styleDef.fill = { fgColor };
          }
      }
      if (xf.getAttribute("applyAlignment") === "1") {
          const alignment = xf.getElementsByTagName("alignment")[0];
          if (alignment) styleDef.alignment = { horizontal: alignment.getAttribute("horizontal") };
      }
      // TODO: numberFormat, borders 처리 로직 추가

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

/**
* [Excel 전용] sharedStrings.xml을 파싱하여 문자열 배열로 반환합니다.
*/
export function processSharedStrings(xmlString: string): string[] {
  const parser = new DOMParser();
  const sstDoc = parser.parseFromString(xmlString, "text/xml");
  const siElements = Array.from(sstDoc.getElementsByTagName("si"));
  return siElements.map(si => si.getElementsByTagName("t")[0]?.textContent || "");
}

/**
* [Excel 전용] sheetN.xml을 파싱하여 cells와 merges 객체로 변환합니다.
*/
export function processExcelSheet(sheetXml: string, sharedStrings: string[], xmlIndexToStyleIdMap: Map<number, string>): { cells: Record<string, any>, merges: any[] } {
  const parser = new DOMParser();
  const sheetDoc = parser.parseFromString(sheetXml, "text/xml");
  const cells: Record<string, any> = {};

  Array.from(sheetDoc.getElementsByTagName("c")).forEach(cell => {
      const cellAddress = cell.getAttribute("r")!;
      const cellData: any = {};

      const styleIndex = cell.getAttribute("s");
      if (styleIndex) {
          const styleId = xmlIndexToStyleIdMap.get(parseInt(styleIndex, 10));
          if (styleId) cellData.styleId = styleId;
      }

      const formula = cell.getElementsByTagName("f")[0];
      if (formula) cellData.formula = formula.textContent;

      const valueNode = cell.getElementsByTagName("v")[0];
      if (cell.getAttribute("t") === 's') {
          cellData.type = 'string';
          cellData.value = sharedStrings[parseInt(valueNode?.textContent || "0", 10)] || "";
      } else if (valueNode) {
          cellData.type = 'number';
          cellData.value = parseFloat(valueNode.textContent!);
      } else {
          cellData.type = 'empty';
      }
      cells[cellAddress] = cellData;
  });

  const merges = Array.from(sheetDoc.getElementsByTagName("mergeCell")).map(mc => ({
      startCell: mc.getAttribute("ref")!.split(':')[0],
      endCell: mc.getAttribute("ref")!.split(':')[1],
  }));

  return { cells, merges };
}