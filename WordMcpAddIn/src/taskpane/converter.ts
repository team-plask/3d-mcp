// converter.ts (전체 수정본)

import { XMLParser, XMLValidator, XMLBuilder } from 'fast-xml-parser';

interface JsonBlock { id: string; type: string; order: number; parentId?: string; }
interface ParagraphProperties { justification?: string; spacing?: { after?: string | number; line?: string | number; lineRule?: string; }; }
interface TextRunProperties { bold?: boolean; italic?: boolean; underline?: string; fontSize?: string; color?: string; fontHint?: string; isLink?: boolean; linkId?: string; }
interface TextRunJson extends JsonBlock { type: "textRun"; text: string; properties?: TextRunProperties; }
interface ParagraphJson extends JsonBlock { type: "paragraph"; properties?: ParagraphProperties; runs: TextRunJson[]; }
interface TableCellJson extends JsonBlock { type: "tableCell"; content: (ParagraphJson | TableJson)[]; } // 셀 안에 테이블도 올 수 있으므로 수정
interface TableRowJson extends JsonBlock { type: "tableRow"; cells: TableCellJson[]; }
interface TableJson extends JsonBlock { type: "table"; rows: TableRowJson[]; }
interface DocumentJson { blocks: (ParagraphJson | TableJson)[]; }

const WHITELISTED_PARA_PROPS = ['w:spacing', 'w:jc', 'w:rPr'];
const WHITELISTED_RUN_PROPS = ['w:b', 'w:i', 'w:u', 'w:sz', 'w:color', 'w:rFonts'];

let globalOrderCounter = 0;

function generateId(type: string, order: number, parentId?: string): string {
  return parentId ? `${parentId}_${type}_${order}` : `${type}_${order}`;
}

function getTextFromTElement(tElementContainer: any): string {
    if (!tElementContainer || !Array.isArray(tElementContainer) || tElementContainer.length === 0) return "";
    let text = "";
    for (const item of tElementContainer) {
        if (item && typeof item['#text'] === 'string') {
            text += item['#text'];
        }
    }
    return text;
}

function processParagraphProperties(pPrContainer: any): ParagraphProperties {
    const properties: ParagraphProperties = {};
    if (!pPrContainer || !Array.isArray(pPrContainer) || pPrContainer.length === 0) return properties;

    const pPrObject = pPrContainer[0];
    if (typeof pPrObject !== 'object' || pPrObject === null) return properties;

    for (const key in pPrObject) { 
        if (WHITELISTED_PARA_PROPS.includes(key)) {
            const propValueArray = pPrObject[key]; 
            if (propValueArray && Array.isArray(propValueArray) && propValueArray.length > 0) {
                const attributes = propValueArray[0][':@'] || {}; 
                if (key === 'w:jc' && attributes['w:val']) {
                    properties.justification = attributes['w:val'];
                } else if (key === 'w:spacing') {
                    properties.spacing = {
                        after: attributes['w:after'],
                        line: attributes['w:line'],
                        lineRule: attributes['w:lineRule']
                    };
                }
            }
        }
    }
    return properties;
}

function processRunProperties(rPrContainer: any): TextRunProperties {
    const properties: TextRunProperties = {};
    if (!rPrContainer || !Array.isArray(rPrContainer) || rPrContainer.length === 0) return properties;
    
    const rPrObject = rPrContainer[0];
    if (typeof rPrObject !== 'object' || rPrObject === null) return properties;

    for (const key in rPrObject) {
        if (WHITELISTED_RUN_PROPS.includes(key)) {
            const propValueArray = rPrObject[key];
             if (propValueArray && Array.isArray(propValueArray) && propValueArray.length > 0) {
                const attributes = propValueArray[0][':@'] || {}; 
                const hasValue = Object.keys(attributes).length > 0 || (propValueArray[0] && Object.keys(propValueArray[0]).length > 0 && !propValueArray[0][':@']);


                if (key === 'w:b' && hasValue) properties.bold = true;
                else if (key === 'w:i' && hasValue) properties.italic = true;
                else if (key === 'w:u' && attributes['w:val']) properties.underline = attributes['w:val'];
                else if (key === 'w:sz' && attributes['w:val']) properties.fontSize = String(attributes['w:val']);
                else if (key === 'w:color' && attributes['w:val']) properties.color = attributes['w:val'];
                else if (key === 'w:rFonts' && attributes['w:hint']) properties.fontHint = attributes['w:hint'];
             }
        }
    }
    return properties;
}

function processTextRun(rContentArray: any[], parentId: string, order: number, extraProps?: any): TextRunJson | null {
    if (!rContentArray || !Array.isArray(rContentArray)) return null;

    const runId = generateId('r', order, parentId);
    const textRunJson: TextRunJson = {
        id: runId, type: "textRun", order, parentId, text: "", properties: {}
    };

    rContentArray.forEach(childElement => {
        if (childElement['w:rPr']) {
            textRunJson.properties = processRunProperties(childElement['w:rPr']);
        } else if (childElement['w:t']) {
            textRunJson.text += getTextFromTElement(childElement['w:t']);
        } else if (childElement['w:br']) {
            textRunJson.text += '\n';
        }
    });

    if (extraProps) {
        textRunJson.properties = { ...textRunJson.properties, ...extraProps };
    }
    return textRunJson;
}

function processParagraph(pContainer: any, parentId?: string): ParagraphJson | null {
    if (!pContainer || !Array.isArray(pContainer) || pContainer.length === 0) return null;

    const pAttributes = pContainer[0][':@'] || {}; 
    const pChildren = pContainer.slice(pContainer[0][':@'] ? 1 : 0); 

    globalOrderCounter++;
    const paraId = pAttributes['w14:paraId'] || generateId('p', globalOrderCounter, parentId);

    const paragraphJson: ParagraphJson = {
        id: paraId, type: "paragraph", order: globalOrderCounter, runs: [], properties: {}
    };
    if (parentId) paragraphJson.parentId = parentId;

    let runOrder = 0;
    pChildren.forEach((childElementObject: any) => { 
        const elementName = Object.keys(childElementObject)[0]; 

        if (elementName === 'w:pPr') {
            paragraphJson.properties = processParagraphProperties(childElementObject['w:pPr']);
        } else if (elementName === 'w:r') {
            runOrder++;
            const runJson = processTextRun(childElementObject['w:r'], paraId, runOrder);
            if (runJson) paragraphJson.runs.push(runJson);
        } else if (elementName === 'w:hyperlink') {
            const hyperlinkContent = childElementObject['w:hyperlink']; 
            if (hyperlinkContent && Array.isArray(hyperlinkContent)) {
                const linkAttributes = hyperlinkContent.find(item => item[':@'])?.[':@'] || {};
                hyperlinkContent.forEach(linkChild => {
                    if (linkChild['w:r']) { 
                         runOrder++;
                         const runJson = processTextRun(linkChild['w:r'], paraId, runOrder, { isLink: true, linkId: linkAttributes['r:id'] });
                         if (runJson) paragraphJson.runs.push(runJson);
                    }
                });
            }
        }
    });
    return paragraphJson;
}

function processTableCell(tcContainer: any, parentId: string, order: number): TableCellJson | null {
    if (!tcContainer || !Array.isArray(tcContainer) || tcContainer.length === 0) return null;
    const tcAttributes = tcContainer[0][':@'] || {};
    const tcChildren = tcContainer.slice(tcContainer[0][':@'] ? 1: 0);

    const cellId = generateId('tc', order, parentId);
    const cellJson: TableCellJson = {
        id: cellId, type: "tableCell", order, parentId, content: []
    };

    tcChildren.forEach((childElementObject: any) => {
        const elementName = Object.keys(childElementObject)[0];
        if (elementName === 'w:p') {
            const paragraph = processParagraph(childElementObject['w:p'], cellId);
            if (paragraph) cellJson.content.push(paragraph);
        } else if (elementName === 'w:tbl') {
            const table = processTable(childElementObject['w:tbl'], cellId);
            if (table) cellJson.content.push(table);
        }
    });
    return cellJson;
}

function processTableRow(trContainer: any, parentId: string, order: number): TableRowJson | null {
    if (!trContainer || !Array.isArray(trContainer) || trContainer.length === 0) return null;
    const trAttributes = trContainer[0][':@'] || {};
    const trChildren = trContainer.slice(trContainer[0][':@'] ? 1 : 0);

    const rowId = generateId('tr', order, parentId);
    const rowJson: TableRowJson = {
        id: rowId, type: "tableRow", order, parentId, cells: []
    };
    
    let cellOrder = 0;
    trChildren.forEach((childElementObject: any) => {
        const elementName = Object.keys(childElementObject)[0];
        if (elementName === 'w:tc') {
            cellOrder++;
            const cellJson = processTableCell(childElementObject['w:tc'], rowId, cellOrder);
            if (cellJson) rowJson.cells.push(cellJson);
        }
    });
    return rowJson;
}

function processTable(tblContainer: any, parentId?: string): TableJson | null {
    if (!tblContainer || !Array.isArray(tblContainer) || tblContainer.length === 0) return null;
    const tblAttributes = tblContainer[0][':@'] || {};
    const tblChildren = tblContainer.slice(tblContainer[0][':@'] ? 1 : 0);

    globalOrderCounter++;
    const tableId = generateId('tbl', globalOrderCounter, parentId);
    const tableJson: TableJson = {
        id: tableId, type: "table", order: globalOrderCounter, rows: []
    };
    if (parentId) tableJson.parentId = parentId;

    let rowOrder = 0;
    tblChildren.forEach((childElementObject: any) => {
        const elementName = Object.keys(childElementObject)[0];
        if (elementName === 'w:tr') {
            rowOrder++;
            const rowJson = processTableRow(childElementObject['w:tr'], tableId, rowOrder);
            if (rowJson) tableJson.rows.push(rowJson);
        }
    });
    return tableJson;
}

export function convertOoxmlToJson(xmlString: string): DocumentJson {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    attributesGroupName: ":@",
    removeNSPrefix: false,
    parseTagValue: false,     
    trimValues: false,         
    textNodeName: "#text",
    preserveOrder: true,      
  });

  let parsedXmlArray;
  try {
    parsedXmlArray = parser.parse(xmlString);
    console.log("--- XML 파싱 성공 (preserveOrder:true) ---");
  } catch (parseError) {
    console.error("!!! XML 파싱 중 오류 발생 !!!", parseError);
    return { blocks: [] };
  }

  const documentJson: DocumentJson = { blocks: [] };
  globalOrderCounter = 0;

  const docEntry = parsedXmlArray.find((entry: any) => entry['w:document']);
  if (!docEntry || !Array.isArray(docEntry['w:document']) || docEntry['w:document'].length === 0) {
    console.error("오류: <w:document> 요소를 찾을 수 없습니다.");
    return documentJson;
  }

  const docElementContent = docEntry['w:document'];
  const docAttributes = docElementContent[0][':@'] || {}; 
  const bodyEntry = docElementContent.find((entry: any) => entry['w:body']);

  if (!bodyEntry || !Array.isArray(bodyEntry['w:body']) || bodyEntry['w:body'].length === 0) {
    console.error("오류: <w:body> 요소를 찾을 수 없습니다.");
    return documentJson;
  }

  const bodyContent = bodyEntry['w:body'];
  const bodyAttributes = bodyContent[0][':@'] || {}; 
  const bodyChildren = bodyContent.slice(bodyContent[0][':@'] ? 1 : 0);

  console.log(`<w:body> 내부의 자식 요소(그룹) 개수: ${bodyChildren.length}`);

  if (bodyChildren.length > 0) {
    bodyChildren.forEach((childElementObject: any) => { 
      const elementName = Object.keys(childElementObject)[0];
      const elementContent = childElementObject[elementName]; 

      if (elementName === 'w:p') {
        const paragraph = processParagraph(elementContent, undefined);
        if (paragraph) documentJson.blocks.push(paragraph);
      } else if (elementName === 'w:tbl') {
        const table = processTable(elementContent, undefined);
        if (table) documentJson.blocks.push(table);
      } else if (elementName === 'w:sectPr') {
         console.log(`  - 섹션 속성(w:sectPr)은 현재 처리 로직에서 건너뜁니다.`);
      } else if (elementName.startsWith('w:')) {
         console.log(`  - 처리되지 않은 WordprocessingML 요소 타입 (body 자식): ${elementName}`);
      }
    });
  } else {
    console.warn("경고: <w:body> 요소 내부에 처리할 자식 요소가 없습니다.");
  }

  console.log(`최종 블록 개수: ${documentJson.blocks.length}`);
  return documentJson;
}

export function pickDocumentPart(flatXml: string): string {
    if (flatXml.indexOf('<pkg:package') === -1) {
      return flatXml.trim();
    }
  
    const partMatch = flatXml.match(
      /<pkg:part[^>]*pkg:name="\/word\/document\.xml"[^>]*>[\s\S]*?<\/pkg:part>/i
    );
    if (!partMatch) throw new Error('document.xml part not found in Flat-OPC');
    const part: string = partMatch[0];
  
    const xmlMatch = part.match(
      /<pkg:xmlData[^>]*>([\s\S]*?)<\/pkg:xmlData>/i
    );
    if (!xmlMatch) throw new Error('pkg:xmlData section missing');
  
    return xmlMatch[1].trim();
  }
  