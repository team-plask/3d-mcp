import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import * as shortid from 'shortid';

// --- 인터페이스 정의 ---
interface DocumentJson {
  [id: string]: ElementJson;
}

interface ElementJson {
  type: string;
  properties?: any;
  [key: string]: any;
}

interface RunJson {
    text: string;
    properties: {
        bold?: boolean;
        italic?: boolean;
        underline?: string;
        color?: string;
        size?: string | number;
        font?: string;
    };
}
  
interface ParagraphJson extends ElementJson {
    type: 'paragraph';
    properties: {
        style?: string;
        alignment?: string;
        spacing?: {
        before?: number | string;
        after?: number | string;
        line?: number | string;
        lineRule?: string;
        };
    };
    runs: { [id: string]: RunJson }; // 배열 대신 객체로 변경
}

interface TableJson extends ElementJson {
    type: 'table';
    properties: {
        width?: string | number;
        style?: string;
        borders?: {
        top?: string;
        bottom?: string;
        left?: string;
        right?: string;
        insideH?: string;
        insideV?: string;
        };
    };
    rows: { [id: string]: TableRowJson }; // 배열 대신 객체로 변경
}
  
interface TableRowJson {
    properties: {
        height?: string | number;
    };
    cells: { [id: string]: TableCellJson }; // 배열 대신 객체로 변경
}
  
interface TableCellJson {
    properties: {
        width?: string | number;
        verticalAlign?: string;
        colSpan?: number;
        rowSpan?: number;
        borders?: {
        top?: string;
        bottom?: string;
        left?: string;
        right?: string;
        };
    };
    content: DocumentJson;
}

interface ListJson extends ElementJson {
  type: 'list';
  properties: {
    listType: 'bullet' | 'numbered';
    level?: number;
  };
  items: { [id: string]: ListItemJson }; // 배열 대신 객체로 변경
}

interface ListJson extends ElementJson {
    type: 'list';
    properties: {
      listType: 'bullet' | 'numbered';
      level?: number;
    };
    items: { [id: string]: ListItemJson }; // 배열 대신 객체로 변경
}
  
interface ListItemJson {
    text: string;
    level: number;
    properties: {
      style?: string;
    };
    runs: { [id: string]: RunJson }; // 배열 대신 객체로 변경
}

interface ConversionResult {
    xml: string;
    json: DocumentJson;
}

/**
 * OOXML 문서 처리를 위한 클래스
 */
class OoxmlProcessor {
  private static idCounter = 0;
  
  /**
   * 문서 XML을 파싱하고 JSON 구조로 변환
   */
  static processDocument(xmlString: string): ConversionResult {
    // XML 파싱을 위한 설정
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      preserveOrder: true,
      isArray: (name) => {
        // 항상 배열로 처리할 태그들
        const arrayTags = ['w:p', 'w:r', 'w:tbl', 'w:tr', 'w:tc', 'w:t'];
        return arrayTags.includes(name);
      }
    });
    
    try {
      // XML 파싱
      const parsedXml = parser.parse(xmlString);
      
      // 문서 구조 추출
      const documentJson: DocumentJson = {};
      
      // 문서 요소 찾기
      const docElement = this.findDocumentElement(parsedXml);
      if (!docElement) {
        throw new Error('문서 요소(w:document)를 찾을 수 없습니다.');
      }
      
      // 본문 요소 찾기
      const bodyElement = this.findBodyElement(docElement);
      if (!bodyElement) {
        throw new Error('본문 요소(w:body)를 찾을 수 없습니다.');
      }
      
      // 본문 내용 처리
      this.processBody(bodyElement, documentJson);
      
      // 콘텐츠 컨트롤 추가
      const xmlWithControls = this.addContentControls(xmlString, documentJson);
      
      return {
        xml: xmlWithControls,
        json: documentJson
      };
    } catch (error) {
      console.error('OOXML 처리 중 오류:', error);
      return {
        xml: xmlString,
        json: {}
      };
    }
  }
  
  /**
   * w:document 요소 찾기
   */
  private static findDocumentElement(parsedXml: any[]): any {
    if (!Array.isArray(parsedXml)) return null;
    
    for (const item of parsedXml) {
      if (item['w:document']) {
        return item['w:document'];
      }
    }
    
    return null;
  }
  
  /**
   * w:body 요소 찾기
   */
  private static findBodyElement(docElement: any[]): any {
    if (!Array.isArray(docElement)) return null;
    
    for (const item of docElement) {
      if (item['w:body']) {
        return item['w:body'];
      }
    }
    
    return null;
  }
  
  /**
   * 본문 내용 처리
   */
  private static processBody(bodyElement: any[], documentJson: DocumentJson): void {
    if (!Array.isArray(bodyElement)) return;
    
    for (const item of bodyElement) {
      // 문단 처리
      if (item['w:p']) {
        this.processParagraph(item['w:p'], documentJson);
      }
      
      // 테이블 처리
      if (item['w:tbl']) {
        this.processTable(item['w:tbl'], documentJson);
      }
      
      // 기타 요소 처리 가능
    }
  }
  
  /**
   * 문단 처리
   */
  private static processParagraph(paragraphElement: any[], documentJson: DocumentJson): void {
    if (!Array.isArray(paragraphElement)) return;
    
    // 문단 ID 생성
    const paragraphId = `p_${shortid.generate()}`;
    
    // 문단 기본 구조 생성
    const paragraphJson: ParagraphJson = {
      type: 'paragraph',
      properties: {},
      runs: {} // 배열 대신 객체로 변경
    };
    
    // 문단 내용 처리
    for (const item of paragraphElement) {
      // 문단 속성 처리
      if (item['w:pPr']) {
        paragraphJson.properties = this.extractParagraphProperties(item['w:pPr']);
      }
      
      // 텍스트 실행 처리
      if (item['w:r']) {
        this.processRun(item['w:r'], paragraphJson.runs);
      }
    }
    
    // 결과 추가
    documentJson[paragraphId] = paragraphJson;
  }
  
  /**
   * 문단 속성 추출
   */
  private static extractParagraphProperties(pPrElement: any[]): any {
    const properties: any = {};
    
    if (!Array.isArray(pPrElement)) return properties;
    
    for (const item of pPrElement) {
      // 정렬
      if (item['w:jc']) {
        const jc = item['w:jc'];
        if (jc && jc[0] && jc[0]['@_w:val']) {
          properties.alignment = jc[0]['@_w:val'];
        }
      }
      
      // 스타일
      if (item['w:pStyle']) {
        const pStyle = item['w:pStyle'];
        if (pStyle && pStyle[0] && pStyle[0]['@_w:val']) {
          properties.style = pStyle[0]['@_w:val'];
        }
      }
      
      // 간격
      if (item['w:spacing']) {
        const spacing = item['w:spacing'];
        if (spacing && spacing[0]) {
          properties.spacing = {};
          
          if (spacing[0]['@_w:after']) {
            properties.spacing.after = spacing[0]['@_w:after'];
          }
          
          if (spacing[0]['@_w:before']) {
            properties.spacing.before = spacing[0]['@_w:before'];
          }
          
          if (spacing[0]['@_w:line']) {
            properties.spacing.line = spacing[0]['@_w:line'];
          }
          
          if (spacing[0]['@_w:lineRule']) {
            properties.spacing.lineRule = spacing[0]['@_w:lineRule'];
          }
        }
      }
    }
    
    return properties;
  }
  
  /**
   * 텍스트 실행 처리
   */
  private static processRun(runElement: any[], runs: { [id: string]: RunJson }): void {
    if (!Array.isArray(runElement)) return;
    
    // 실행 ID 생성
    const runId = `r_${shortid.generate()}`;
    
    // 텍스트 및 속성 추출
    let text = '';
    const properties: any = {};
    
    for (const item of runElement) {
      // 실행 속성
      if (item['w:rPr']) {
        Object.assign(properties, this.extractRunProperties(item['w:rPr']));
      }
      
      // 텍스트 내용
      if (item['w:t']) {
        text += this.extractText(item['w:t']);
      }
      
      // 줄바꿈
      if (item['w:br']) {
        text += '\n';
      }
    }
    
    // 실행 객체 추가 - 배열 push 대신 객체 속성 할당
    if (text) {
      runs[runId] = {
        text,
        properties
      };
    }
  }
  
  /**
   * 텍스트 실행 속성 추출
   */
  private static extractRunProperties(rPrElement: any[]): any {
    const properties: any = {};
    
    if (!Array.isArray(rPrElement)) return properties;
    
    for (const item of rPrElement) {
      // 굵게
      if (item['w:b']) {
        properties.bold = true;
      }
      
      // 이탤릭
      if (item['w:i']) {
        properties.italic = true;
      }
      
      // 밑줄
      if (item['w:u']) {
        const u = item['w:u'];
        if (u && u[0] && u[0]['@_w:val']) {
          properties.underline = u[0]['@_w:val'];
        }
      }
      
      // 색상
      if (item['w:color']) {
        const color = item['w:color'];
        if (color && color[0] && color[0]['@_w:val']) {
          properties.color = color[0]['@_w:val'];
        }
      }
      
      // 크기
      if (item['w:sz']) {
        const sz = item['w:sz'];
        if (sz && sz[0] && sz[0]['@_w:val']) {
          properties.size = sz[0]['@_w:val'];
        }
      }
      
      // 글꼴
      if (item['w:rFonts']) {
        const rFonts = item['w:rFonts'];
        if (rFonts && rFonts[0]) {
          if (rFonts[0]['@_w:ascii']) {
            properties.font = rFonts[0]['@_w:ascii'];
          } else if (rFonts[0]['@_w:eastAsia']) {
            properties.font = rFonts[0]['@_w:eastAsia'];
          }
        }
      }
    }
    
    return properties;
  }
  
  /**
   * 텍스트 내용 추출
   */
  private static extractText(tElement: any[]): string {
    let text = '';
    
    if (!Array.isArray(tElement)) return text;
    
    for (const item of tElement) {
      // 직접 텍스트 내용이 있는 경우
      if (item['#text']) {
        text += item['#text'];
      }
      
      // 속성과 텍스트가 함께 있는 경우
      if (typeof item === 'object' && Object.keys(item).length === 0) {
        // 빈 텍스트 노드
        text += '';
      }
    }
    
    return text;
  }
  
  /**
   * 테이블 처리
   */
  private static processTable(tableElement: any[], documentJson: DocumentJson): void {
    if (!Array.isArray(tableElement)) return;
    
    // 테이블 ID 생성
    const tableId = `t_${shortid.generate()}`;
    
    // 테이블 기본 구조 생성
    const tableJson: TableJson = {
      type: 'table',
      properties: {},
      rows: {} // 배열 대신 객체로 변경
    };
    
    // 테이블 내용 처리
    for (const item of tableElement) {
      // 테이블 속성
      if (item['w:tblPr']) {
        tableJson.properties = this.extractTableProperties(item['w:tblPr']);
      }
      
      // 테이블 행
      if (item['w:tr']) {
        this.processTableRow(item['w:tr'], tableJson.rows);
      }
    }
    
    // 결과 추가
    documentJson[tableId] = tableJson;
  }
  
  /**
   * 테이블 속성 추출
   */
  private static extractTableProperties(tblPrElement: any[]): any {
    const properties: any = {};
    
    if (!Array.isArray(tblPrElement)) return properties;
    
    for (const item of tblPrElement) {
      // 너비
      if (item['w:tblW']) {
        const tblW = item['w:tblW'];
        if (tblW && tblW[0] && tblW[0]['@_w:w']) {
          properties.width = tblW[0]['@_w:w'];
        }
      }
      
      // 스타일
      if (item['w:tblStyle']) {
        const tblStyle = item['w:tblStyle'];
        if (tblStyle && tblStyle[0] && tblStyle[0]['@_w:val']) {
          properties.style = tblStyle[0]['@_w:val'];
        }
      }
      
      // 테두리
      if (item['w:tblBorders']) {
        properties.borders = this.extractTableBorders(item['w:tblBorders']);
      }
    }
    
    return properties;
  }
  
  /**
   * 테이블 테두리 추출
   */
  private static extractTableBorders(bordersElement: any[]): any {
    const borders: any = {};
    
    if (!Array.isArray(bordersElement)) return borders;
    
    for (const item of bordersElement) {
      // 상단 테두리
      if (item['w:top']) {
        const top = item['w:top'];
        if (top && top[0] && top[0]['@_w:val']) {
          borders.top = top[0]['@_w:val'];
        }
      }
      
      // 하단 테두리
      if (item['w:bottom']) {
        const bottom = item['w:bottom'];
        if (bottom && bottom[0] && bottom[0]['@_w:val']) {
          borders.bottom = bottom[0]['@_w:val'];
        }
      }
      
      // 좌측 테두리
      if (item['w:left']) {
        const left = item['w:left'];
        if (left && left[0] && left[0]['@_w:val']) {
          borders.left = left[0]['@_w:val'];
        }
      }
      
      // 우측 테두리
      if (item['w:right']) {
        const right = item['w:right'];
        if (right && right[0] && right[0]['@_w:val']) {
          borders.right = right[0]['@_w:val'];
        }
      }
      
      // 내부 가로 테두리
      if (item['w:insideH']) {
        const insideH = item['w:insideH'];
        if (insideH && insideH[0] && insideH[0]['@_w:val']) {
          borders.insideH = insideH[0]['@_w:val'];
        }
      }
      
      // 내부 세로 테두리
      if (item['w:insideV']) {
        const insideV = item['w:insideV'];
        if (insideV && insideV[0] && insideV[0]['@_w:val']) {
          borders.insideV = insideV[0]['@_w:val'];
        }
      }
    }
    
    return borders;
  }
  
  /**
   * 테이블 행 처리
   */
  private static processTableRow(rowElement: any[], rows: { [id: string]: TableRowJson }): void {
    if (!Array.isArray(rowElement)) return;
    
    // 행 ID 생성
    const rowId = `tr_${shortid.generate()}`;
    
    // 행 기본 구조 생성
    const rowJson: TableRowJson = {
      properties: {},
      cells: {} // 배열 대신 객체로 변경
    };
    
    // 행 내용 처리
    for (const item of rowElement) {
      // 행 속성
      if (item['w:trPr']) {
        rowJson.properties = this.extractRowProperties(item['w:trPr']);
      }
      
      // 셀
      if (item['w:tc']) {
        this.processTableCell(item['w:tc'], rowJson.cells);
      }
    }
    
    // 결과 추가 - 배열 push 대신 객체 속성 할당
    rows[rowId] = rowJson;
  }
  
  /**
   * 테이블 행 속성 추출
   */
  private static extractRowProperties(trPrElement: any[]): any {
    const properties: any = {};
    
    if (!Array.isArray(trPrElement)) return properties;
    
    for (const item of trPrElement) {
      // 높이
      if (item['w:trHeight']) {
        const trHeight = item['w:trHeight'];
        if (trHeight && trHeight[0] && trHeight[0]['@_w:val']) {
          properties.height = trHeight[0]['@_w:val'];
        }
      }
    }
    
    return properties;
  }
  
  /**
   * 테이블 셀 처리
   */
  private static processTableCell(cellElement: any[], cells: { [id: string]: TableCellJson }): void {
    if (!Array.isArray(cellElement)) return;
    
    // 셀 ID 생성
    const cellId = `tc_${shortid.generate()}`;
    
    // 셀 기본 구조 생성
    const cellJson: TableCellJson = {
      properties: {},
      content: {}
    };
    
    // 셀 내용 처리
    for (const item of cellElement) {
      // 셀 속성
      if (item['w:tcPr']) {
        cellJson.properties = this.extractCellProperties(item['w:tcPr']);
      }
      
      // 셀 내 문단
      if (item['w:p']) {
        this.processParagraph(item['w:p'], cellJson.content);
      }
      
      // 셀 내 테이블 (중첩 테이블)
      if (item['w:tbl']) {
        this.processTable(item['w:tbl'], cellJson.content);
      }
    }
    
    // 결과 추가 - 배열 push 대신 객체 속성 할당
    cells[cellId] = cellJson;
  }
  
  /**
   * 테이블 셀 속성 추출
   */
  private static extractCellProperties(tcPrElement: any[]): any {
    const properties: any = {};
    
    if (!Array.isArray(tcPrElement)) return properties;
    
    for (const item of tcPrElement) {
      // 너비
      if (item['w:tcW']) {
        const tcW = item['w:tcW'];
        if (tcW && tcW[0] && tcW[0]['@_w:w']) {
          properties.width = tcW[0]['@_w:w'];
        }
      }
      
      // 수직 정렬
      if (item['w:vAlign']) {
        const vAlign = item['w:vAlign'];
        if (vAlign && vAlign[0] && vAlign[0]['@_w:val']) {
          properties.verticalAlign = vAlign[0]['@_w:val'];
        }
      }
      
      // 열 병합
      if (item['w:gridSpan']) {
        const gridSpan = item['w:gridSpan'];
        if (gridSpan && gridSpan[0] && gridSpan[0]['@_w:val']) {
          properties.colSpan = parseInt(gridSpan[0]['@_w:val']);
        }
      }
      
      // 행 병합
      if (item['w:vMerge']) {
        const vMerge = item['w:vMerge'];
        if (vMerge && vMerge[0]) {
          if (vMerge[0]['@_w:val'] === 'restart') {
            properties.rowSpan = 1; // 시작점, 실제 rowSpan은 별도 계산 필요
          } else {
            properties.rowSpan = 0; // 병합된 셀
          }
        }
      }
      
      // 테두리
      if (item['w:tcBorders']) {
        properties.borders = this.extractCellBorders(item['w:tcBorders']);
      }
    }
    
    return properties;
  }
  
  /**
   * 테이블 셀 테두리 추출
   */
  private static extractCellBorders(bordersElement: any[]): any {
    const borders: any = {};
    
    if (!Array.isArray(bordersElement)) return borders;
    
    for (const item of bordersElement) {
      // 상단 테두리
      if (item['w:top']) {
        const top = item['w:top'];
        if (top && top[0] && top[0]['@_w:val']) {
          borders.top = top[0]['@_w:val'];
        }
      }
      
      // 하단 테두리
      if (item['w:bottom']) {
        const bottom = item['w:bottom'];
        if (bottom && bottom[0] && bottom[0]['@_w:val']) {
          borders.bottom = bottom[0]['@_w:val'];
        }
      }
      
      // 좌측 테두리
      if (item['w:left']) {
        const left = item['w:left'];
        if (left && left[0] && left[0]['@_w:val']) {
          borders.left = left[0]['@_w:val'];
        }
      }
      
      // 우측 테두리
      if (item['w:right']) {
        const right = item['w:right'];
        if (right && right[0] && right[0]['@_w:val']) {
          borders.right = right[0]['@_w:val'];
        }
      }
    }
    
    return borders;
  }
  
  /**
   * XML에 콘텐츠 컨트롤 추가
   */
  private static addContentControls(xmlString: string, documentJson: DocumentJson): string {
    // 직접 XML을 수정하는 대신 Word API를 통해 콘텐츠 컨트롤을 추가하는 것이 권장됩니다.
    // 이 함수는 Word API를 사용하지 않는 환경에서의 대안입니다.
    
    // 간단한 구현을 위해 원본 XML 반환
    // 실제 구현에서는 XML 조작 라이브러리를 사용하여 적절한 위치에 콘텐츠 컨트롤을 삽입해야 합니다.
    return xmlString;
  }
  
  /**
   * Word API를 사용하여 콘텐츠 컨트롤 추가
   */
  static async addContentControlsWithApi(documentJson: DocumentJson): Promise<void> {
    return Word.run(async context => {
      try {
        // 문서 요소 로드
        const paragraphs = context.document.body.paragraphs;
        const tables = context.document.body.tables;
        
        paragraphs.load("items");
        tables.load("items");
        
        await context.sync();
        
        // 문단 처리
        let paragraphIndex = 0;
        for (const id in documentJson) {
          const element = documentJson[id];
          
          if (element.type === 'paragraph') {
            if (paragraphIndex < paragraphs.items.length) {
              const paragraph = paragraphs.items[paragraphIndex];
              const contentControl = paragraph.insertContentControl();
              contentControl.tag = id;
              contentControl.title = `Paragraph ${paragraphIndex + 1}`;
              paragraphIndex++;
            }
          }
        }
        
        // 테이블 처리
        let tableIndex = 0;
        for (const id in documentJson) {
          const element = documentJson[id];
          
          if (element.type === 'table') {
            if (tableIndex < tables.items.length) {
              const table = tables.items[tableIndex];
              const contentControl = table.insertContentControl();
              contentControl.tag = id;
              contentControl.title = `Table ${tableIndex + 1}`;
              
              // 테이블 셀에 콘텐츠 컨트롤 추가 - 필요에 따라 구현
              // 이 부분은 복잡성을 피하기 위해 생략됨
              
              tableIndex++;
            }
          }
        }
        
        await context.sync();
      } catch (error) {
        console.error('콘텐츠 컨트롤 추가 중 오류:', error);
        throw error;
      }
    });
  }
}

/**
 * 문서 XML을 파싱하고 JSON 구조로 변환
 */
export function processDocument(xmlString: string): ConversionResult {
  return OoxmlProcessor.processDocument(xmlString);
}

/**
 * Word API를 사용하여 콘텐츠 컨트롤 추가
 */
export async function addContentControlsWithWordApi(documentJson: DocumentJson): Promise<void> {
  return OoxmlProcessor.addContentControlsWithApi(documentJson);
}

/**
 * XML 유효성 검사
 */
export function isValidXml(xmlString: string): boolean {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    // 파싱 오류 확인
    const parserError = xmlDoc.querySelector("parsererror");
    if (parserError) {
      console.error("XML 파싱 오류:", parserError.textContent);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("XML 유효성 검사 오류:", error);
    return false;
  }
}

/**
 * 원본 XML에서 업데이트된 XML 부분만 교체
 */
export function replaceOriginalWithUpdated(originalXml: string, updatedXml: string): string {
  // Flat OPC 형식인 경우 document.xml 부분만 교체
  if (originalXml.indexOf('<pkg:package') !== -1) {
    // '/word/document.xml' 파트 찾기
    const partMatch = originalXml.match(
      /<pkg:part[^>]*pkg:name="\/word\/document\.xml"[^>]*>[\s\S]*?<\/pkg:part>/i
    );
    if (!partMatch) {
      throw new Error('document.xml part not found in Flat-OPC');
    }
    
    // XML 데이터 부분 찾기
    const xmlDataMatch = partMatch[0].match(
      /(<pkg:xmlData[^>]*>)([\s\S]*?)(<\/pkg:xmlData>)/i
    );
    if (!xmlDataMatch) {
      throw new Error('pkg:xmlData section missing');
    }
    
    // xmlData 내용만 업데이트
    const updatedPart = partMatch[0].replace(
      xmlDataMatch[0],
      `${xmlDataMatch[1]}${updatedXml}${xmlDataMatch[3]}`
    );
    
    // 전체 문서에서 해당 부분 교체
    return originalXml.replace(partMatch[0], updatedPart);
  }
  
  // 이미 document 부분만 있는 경우 직접 교체
  return updatedXml;
}

/**
 * JSON에서 변경된 내용을 XML에 적용
 */
export function applyJsonChangesToXml(originalXml: string, originalJson: DocumentJson, updatedJson: DocumentJson): string {
  // 간단한 구현 - 실제로는 더 복잡한 비교 및 업데이트 로직이 필요합니다
  // 현재는 변경 사항을 XML에 반영하지 않고 원본을 그대로 반환합니다
  
  console.warn("applyJsonChangesToXml 함수는 아직 구현되지 않았습니다");
  return originalXml;
}