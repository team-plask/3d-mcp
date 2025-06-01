// element-config.ts
import { generateNKeysBetween } from 'fractional-indexing';

// 요소 변환 및 패치 인터페이스
export interface ElementConverter {
  // XML -> JSON 변환
  extractAttributes(element: Element): Record<string, any>;
  // JSON -> XML 속성 적용
  applyAttributes(context: any, element: any, attributes: Record<string, any>): Promise<void>;
  // 새 요소 생성
  createElement(context: any, id: string, attributes: Record<string, any>, position: InsertPosition): Promise<any>;
  // 요소 삭제
  deleteElement(context: any, element: any): Promise<void>;
}

export interface InsertPosition {
  parentId?: string;
  referenceId?: string;
  position: 'before' | 'after' | 'start' | 'end';
  index: number;
}

// 요소 설정 인터페이스
export interface ElementConfig {
  // 요소 타입
  type: string;
  // XML 태그명
  xmlTag: string;
  // ID 접두사
  idPrefix: string;
  // 추적할 속성 정의
  attributes: AttributeConfig;
  // 중첩 가능한 자식 요소 타입
  allowedChildren?: string[];
  // 변환 및 패치 처리기
  converter: ElementConverter;
}

// 속성 설정 인터페이스
export interface AttributeConfig {
  [key: string]: {
    // XML 경로 (중첩된 요소 접근)
    path?: string[];
    // 속성명
    attribute?: string;
    // 텍스트 콘텐츠 여부
    textContent?: boolean;
    // 값 변환 함수
    transform?: {
      toJson?: (value: any) => any;
      fromJson?: (value: any) => any;
    };
    // 기본값
    defaultValue?: any;
  };
}

// Word 단락 Converter
class ParagraphConverter implements ElementConverter {
  extractAttributes(element: Element): Record<string, any> {
    const attrs: Record<string, any> = {};
    
    // 정렬
    const jc = element.querySelector('w\\:jc, jc');
    if (jc?.getAttribute('w:val')) {
      attrs.alignment = jc.getAttribute('w:val');
    }
    
    // 간격
    const spacing = element.querySelector('w\\:spacing, spacing');
    if (spacing) {
      const spacingAttrs: any = {};
      if (spacing.getAttribute('w:after')) spacingAttrs.after = parseInt(spacing.getAttribute('w:after')!);
      if (spacing.getAttribute('w:before')) spacingAttrs.before = parseInt(spacing.getAttribute('w:before')!);
      if (spacing.getAttribute('w:line')) spacingAttrs.line = parseInt(spacing.getAttribute('w:line')!);
      if (spacing.getAttribute('w:lineRule')) spacingAttrs.lineRule = spacing.getAttribute('w:lineRule');
      if (Object.keys(spacingAttrs).length > 0) attrs.spacing = spacingAttrs;
    }
    
    // 들여쓰기
    const ind = element.querySelector('w\\:ind, ind');
    if (ind) {
      const indAttrs: any = {};
      if (ind.getAttribute('w:left')) indAttrs.left = parseInt(ind.getAttribute('w:left')!);
      if (ind.getAttribute('w:right')) indAttrs.right = parseInt(ind.getAttribute('w:right')!);
      if (ind.getAttribute('w:firstLine')) indAttrs.firstLine = parseInt(ind.getAttribute('w:firstLine')!);
      if (ind.getAttribute('w:hanging')) indAttrs.hanging = parseInt(ind.getAttribute('w:hanging')!);
      if (Object.keys(indAttrs).length > 0) attrs.indent = indAttrs;
    }
    
    return attrs;
  }
  
  async applyAttributes(context: Word.RequestContext, paragraph: Word.Paragraph, attributes: Record<string, any>): Promise<void> {
    // 정렬
    if (attributes.alignment) {
      const alignmentMap: Record<string, Word.Alignment> = {
        'left': Word.Alignment.left,
        'center': Word.Alignment.centered,
        'right': Word.Alignment.right,
        'justify': Word.Alignment.justified,
        'distributed': Word.Alignment.justified // 근사값
      };
      if (alignmentMap[attributes.alignment]) {
        paragraph.alignment = alignmentMap[attributes.alignment];
      }
    }
    
    // 간격
    if (attributes.spacing) {
      const spacing = attributes.spacing;
      if (spacing.line !== undefined) paragraph.lineSpacing = spacing.line / 240;
      if (spacing.after !== undefined) paragraph.spaceAfter = spacing.after / 20;
      if (spacing.before !== undefined) paragraph.spaceBefore = spacing.before / 20;
    }
    
    // 들여쓰기
    if (attributes.indent) {
      const indent = attributes.indent;
      if (indent.left !== undefined) paragraph.leftIndent = indent.left / 20;
      if (indent.right !== undefined) paragraph.rightIndent = indent.right / 20;
      if (indent.firstLine !== undefined) paragraph.firstLineIndent = indent.firstLine / 20;
      if (indent.hanging !== undefined) paragraph.firstLineIndent = -indent.hanging / 20;
    }
  }
  
  async createElement(context: Word.RequestContext, id: string, attributes: Record<string, any>, position: InsertPosition): Promise<Word.Paragraph> {
    const body = context.document.body;
    let newParagraph: Word.Paragraph;
    
    if (position.position === 'end') {
      newParagraph = body.insertParagraph("", Word.InsertLocation.end);
    } else if (position.position === 'start') {
      newParagraph = body.insertParagraph("", Word.InsertLocation.start);
    } else if (position.referenceId) {
      // 참조 요소 기준 삽입 로직
      const contentControls = context.document.contentControls;
      contentControls.load("items,tag");
      await context.sync();
      
      const refControl = contentControls.items.find(cc => cc.tag === position.referenceId);
      if (refControl) {
        const range = refControl.getRange();
        newParagraph = range.insertParagraph("", position.position === 'before' ? Word.InsertLocation.before : Word.InsertLocation.after);
      } else {
        newParagraph = body.insertParagraph("", Word.InsertLocation.end);
      }
    } else {
      newParagraph = body.insertParagraph("", Word.InsertLocation.end);
    }
    
    // Content Control 적용
    const contentControl = newParagraph.insertContentControl();
    contentControl.tag = id;
    contentControl.title = `paragraph ${id}`;
    contentControl.appearance = Word.ContentControlAppearance.boundingBox;
    
    // 속성 적용
    await this.applyAttributes(context, newParagraph, attributes);
    
    return newParagraph;
  }
  
  async deleteElement(context: Word.RequestContext, contentControl: Word.ContentControl): Promise<void> {
    const range = contentControl.getRange();
    range.insertText(" ", Word.InsertLocation.replace);
  }
}

// Word Run Converter
class RunConverter implements ElementConverter {
  extractAttributes(element: Element): Record<string, any> {
    const attrs: Record<string, any> = {};
    
    // 텍스트 내용
    const textElement = element.querySelector('w\\:t, t');
    if (textElement?.textContent) {
      attrs.text = textElement.textContent;
    }
    
    // 굵게
    const bold = element.querySelector('w\\:b, b');
    if (bold) {
      attrs.bold = bold.getAttribute('w:val') !== 'false' && bold.getAttribute('w:val') !== '0';
    }
    
    // 기울임
    const italic = element.querySelector('w\\:i, i');
    if (italic) {
      attrs.italic = italic.getAttribute('w:val') !== 'false' && italic.getAttribute('w:val') !== '0';
    }
    
    // 밑줄
    const underline = element.querySelector('w\\:u, u');
    if (underline) {
      attrs.underline = underline.getAttribute('w:val') || 'single';
    }
    
    // 색상
    const color = element.querySelector('w\\:color, color');
    if (color?.getAttribute('w:val')) {
      attrs.color = color.getAttribute('w:val');
    }
    
    // 크기
    const size = element.querySelector('w\\:sz, sz');
    if (size?.getAttribute('w:val')) {
      attrs.size = parseInt(size.getAttribute('w:val')!) / 2;
    }
    
    // 글꼴
    const font = element.querySelector('w\\:rFonts, rFonts');
    if (font?.getAttribute('w:ascii')) {
      attrs.font = font.getAttribute('w:ascii');
    }
    
    return attrs;
  }
  
  async applyAttributes(context: Word.RequestContext, range: Word.Range, attributes: Record<string, any>): Promise<void> {
    range.load("font");
    await context.sync();
    
    if (attributes.bold !== undefined) range.font.bold = attributes.bold;
    if (attributes.italic !== undefined) range.font.italic = attributes.italic;
    if (attributes.color) range.font.color = attributes.color;
    if (attributes.size) range.font.size = attributes.size;
    if (attributes.font) range.font.name = attributes.font;
    
    if (attributes.underline !== undefined) {
      const underlineMap: Record<string, Word.UnderlineType> = {
        'none': Word.UnderlineType.none,
        'single': Word.UnderlineType.single,
        'words': Word.UnderlineType.word,
        'double': Word.UnderlineType.double,
        'thick': Word.UnderlineType.thick,
        'dotted': Word.UnderlineType.dotted,
        'dottedHeavy': Word.UnderlineType.dottedHeavy,
        'dashLine': Word.UnderlineType.dashLine,
        'dashLineHeavy': Word.UnderlineType.dashLineHeavy,
        'dashLineLong': Word.UnderlineType.dashLineLong,
        'dashLineLongHeavy': Word.UnderlineType.dashLineLongHeavy,
        'dotDashLine': Word.UnderlineType.dotDashLine,
        'dotDashLineHeavy': Word.UnderlineType.dotDashLineHeavy,
        'twoDotDashLine': Word.UnderlineType.twoDotDashLine,
        'twoDotDashLineHeavy': Word.UnderlineType.twoDotDashLineHeavy,
        'wave': Word.UnderlineType.wave,
        'waveHeavy': Word.UnderlineType.waveHeavy,
        'waveDouble': Word.UnderlineType.waveDouble,
        // OOXML 값 매핑
        'dash': Word.UnderlineType.dashLine,
        'dotDash': Word.UnderlineType.dotDashLine,
        'dotDotDash': Word.UnderlineType.twoDotDashLine
      };
      range.font.underline = underlineMap[attributes.underline] || Word.UnderlineType.single;
    }
  }
  
  async createElement(context: Word.RequestContext, id: string, attributes: Record<string, any>, position: InsertPosition): Promise<Word.Range> {
    if (!position.parentId) {
      throw new Error(`Run 요소는 부모 단락이 필요합니다`);
    }
    
    // 부모 Content Control 찾기
    const contentControls = context.document.contentControls;
    contentControls.load("items,tag");
    await context.sync();
    
    const parentControl = contentControls.items.find(cc => cc.tag === position.parentId);
    if (!parentControl) {
      throw new Error(`부모 단락을 찾을 수 없습니다: ${position.parentId}`);
    }
    
    const text = attributes.text || "";
    let range: Word.Range;
    
    if (position.position === 'end') {
      range = parentControl.insertText(text, Word.InsertLocation.end);
    } else if (position.position === 'start') {
      range = parentControl.insertText(text, Word.InsertLocation.start);
    } else if (position.referenceId) {
      const refControl = contentControls.items.find(cc => cc.tag === position.referenceId);
      if (refControl) {
        const refRange = refControl.getRange();
        range = refRange.insertText(text, position.position === 'before' ? Word.InsertLocation.before : Word.InsertLocation.after);
      } else {
        range = parentControl.insertText(text, Word.InsertLocation.end);
      }
    } else {
      range = parentControl.insertText(text, Word.InsertLocation.end);
    }
    
    // Content Control 적용
    const contentControl = range.insertContentControl();
    contentControl.tag = id;
    contentControl.title = `run ${id}`;
    contentControl.appearance = Word.ContentControlAppearance.boundingBox;
    
    // 텍스트 제외한 속성 적용
    const formatAttrs = { ...attributes };
    delete formatAttrs.text;
    await this.applyAttributes(context, range, formatAttrs);
    
    return range;
  }
  
  async deleteElement(context: Word.RequestContext, contentControl: Word.ContentControl): Promise<void> {
    const range = contentControl.getRange();
    range.insertText("", Word.InsertLocation.replace);
  }
}

// Word 테이블 Converter
class TableConverter implements ElementConverter {
  extractAttributes(element: Element): Record<string, any> {
    const attrs: Record<string, any> = {};
    
    // 테이블 그리드 정보
    const gridCols = element.querySelectorAll('w\\:gridCol, gridCol');
    if (gridCols.length > 0) {
      attrs.gridColumns = Array.from(gridCols).map(col => 
        parseInt(col.getAttribute('w:w') || '0')
      );
    }
    
    // 행/열 수 계산
    const rows = element.querySelectorAll('w\\:tr, tr');
    attrs.rowCount = rows.length;
    
    if (rows.length > 0) {
      const firstRowCells = rows[0].querySelectorAll('w\\:tc, tc');
      attrs.columnCount = firstRowCells.length;
    }
    
    return attrs;
  }
  
  async applyAttributes(context: Word.RequestContext, table: Word.Table, attributes: Record<string, any>): Promise<void> {
    // Word JS API의 제한으로 인해 테이블 속성 직접 변경이 어려움
    console.log("테이블 속성 적용:", attributes);
  }
  
  async createElement(context: Word.RequestContext, id: string, attributes: Record<string, any>, position: InsertPosition): Promise<Word.Table> {
    const body = context.document.body;
    const rowCount = attributes.rowCount || 2;
    const columnCount = attributes.columnCount || 2;
    
    let range: Word.Range;
    
    if (position.position === 'end') {
      range = body.getRange(Word.RangeLocation.end);
    } else if (position.position === 'start') {
      range = body.getRange(Word.RangeLocation.start);
    } else if (position.referenceId) {
      const contentControls = context.document.contentControls;
      contentControls.load("items,tag");
      await context.sync();
      
      const refControl = contentControls.items.find(cc => cc.tag === position.referenceId);
      if (refControl) {
        range = refControl.getRange();
      } else {
        range = body.getRange(Word.RangeLocation.end);
      }
    } else {
      range = body.getRange(Word.RangeLocation.end);
    }
    
    const newTable = range.insertTable(rowCount, columnCount, 
      position.position === 'before' ? Word.InsertLocation.before : Word.InsertLocation.after, 
      []
    );
    
    // Content Control 적용
    const contentControl = newTable.insertContentControl();
    contentControl.tag = id;
    contentControl.title = `table ${id}`;
    contentControl.appearance = Word.ContentControlAppearance.boundingBox;
    
    await this.applyAttributes(context, newTable, attributes);
    
    return newTable;
  }
  
  async deleteElement(context: Word.RequestContext, contentControl: Word.ContentControl): Promise<void> {
    const range = contentControl.getRange();
    range.insertText(" ", Word.InsertLocation.replace);
  }
}

// 요소 설정 레지스트리
export const ELEMENT_CONFIGS: Record<string, ElementConfig> = {
  paragraph: {
    type: 'paragraph',
    xmlTag: 'w:p',
    idPrefix: 'p_',
    attributes: {
      alignment: {
        path: ['w:pPr', 'w:jc'],
        attribute: 'w:val'
      },
      spacing: {
        path: ['w:pPr', 'w:spacing'],
        transform: {
          toJson: (el: Element) => ({
            after: el.getAttribute('w:after') ? parseInt(el.getAttribute('w:after')!) : undefined,
            before: el.getAttribute('w:before') ? parseInt(el.getAttribute('w:before')!) : undefined,
            line: el.getAttribute('w:line') ? parseInt(el.getAttribute('w:line')!) : undefined,
            lineRule: el.getAttribute('w:lineRule') || undefined
          }),
          fromJson: (val: any) => val
        }
      },
      indent: {
        path: ['w:pPr', 'w:ind'],
        transform: {
          toJson: (el: Element) => ({
            left: el.getAttribute('w:left') ? parseInt(el.getAttribute('w:left')!) : undefined,
            right: el.getAttribute('w:right') ? parseInt(el.getAttribute('w:right')!) : undefined,
            firstLine: el.getAttribute('w:firstLine') ? parseInt(el.getAttribute('w:firstLine')!) : undefined,
            hanging: el.getAttribute('w:hanging') ? parseInt(el.getAttribute('w:hanging')!) : undefined
          }),
          fromJson: (val: any) => val
        }
      }
    },
    allowedChildren: ['run'],
    converter: new ParagraphConverter()
  },
  
  run: {
    type: 'run',
    xmlTag: 'w:r',
    idPrefix: 'r_',
    attributes: {
      text: {
        path: ['w:t'],
        textContent: true
      },
      bold: {
        path: ['w:rPr', 'w:b'],
        attribute: 'w:val',
        transform: {
          toJson: (val: string | null) => val !== 'false' && val !== '0',
          fromJson: (val: boolean) => val
        },
        defaultValue: false
      },
      italic: {
        path: ['w:rPr', 'w:i'],
        attribute: 'w:val',
        transform: {
          toJson: (val: string | null) => val !== 'false' && val !== '0',
          fromJson: (val: boolean) => val
        },
        defaultValue: false
      },
      underline: {
        path: ['w:rPr', 'w:u'],
        attribute: 'w:val',
        defaultValue: 'none'
      },
      color: {
        path: ['w:rPr', 'w:color'],
        attribute: 'w:val'
      },
      size: {
        path: ['w:rPr', 'w:sz'],
        attribute: 'w:val',
        transform: {
          toJson: (val: string) => parseInt(val) / 2,
          fromJson: (val: number) => val * 2
        }
      },
      font: {
        path: ['w:rPr', 'w:rFonts'],
        attribute: 'w:ascii'
      }
    },
    converter: new RunConverter()
  },
  
  table: {
    type: 'table',
    xmlTag: 'w:tbl',
    idPrefix: 't_',
    attributes: {
      gridColumns: {
        path: ['w:tblGrid', 'w:gridCol'],
        transform: {
          toJson: (elements: NodeListOf<Element>) => 
            Array.from(elements).map(el => parseInt(el.getAttribute('w:w') || '0')),
          fromJson: (val: number[]) => val
        }
      },
      rowCount: {
        transform: {
          toJson: (element: Element) => element.querySelectorAll('w\\:tr, tr').length,
          fromJson: (val: number) => val
        }
      },
      columnCount: {
        transform: {
          toJson: (element: Element) => {
            const firstRow = element.querySelector('w\\:tr, tr');
            return firstRow ? firstRow.querySelectorAll('w\\:tc, tc').length : 0;
          },
          fromJson: (val: number) => val
        }
      }
    },
    allowedChildren: ['paragraph'],
    converter: new TableConverter()
  },
  
  drawing: {
    type: 'drawing',
    xmlTag: 'w:drawing',
    idPrefix: 'd_',
    attributes: {
      width: {
        path: ['wp:inline', 'wp:extent'],
        attribute: 'cx',
        transform: {
          toJson: (val: string) => parseInt(val) / 12700,
          fromJson: (val: number) => val * 12700
        }
      },
      height: {
        path: ['wp:inline', 'wp:extent'],
        attribute: 'cy',
        transform: {
          toJson: (val: string) => parseInt(val) / 12700,
          fromJson: (val: number) => val * 12700
        }
      },
      name: {
        path: ['wp:inline', 'wp:docPr'],
        attribute: 'name'
      },
      description: {
        path: ['wp:inline', 'wp:docPr'],
        attribute: 'descr'
      }
    },
    converter: new RunConverter() // 임시, DrawingConverter 구현 필요
  }
};

// 헬퍼 함수들
export function getElementConfig(type: string): ElementConfig | null {
  return ELEMENT_CONFIGS[type] || null;
}

export function getElementConfigByTag(xmlTag: string): ElementConfig | null {
  return Object.values(ELEMENT_CONFIGS).find(config => config.xmlTag === xmlTag) || null;
}

export function getElementTypeFromId(id: string): string {
  for (const [type, config] of Object.entries(ELEMENT_CONFIGS)) {
    if (id.startsWith(config.idPrefix)) {
      return type;
    }
  }
  return 'unknown';
}

// Content Control 적용 대상 요소 타입 목록
export const CONTENT_CONTROL_ELEMENTS = Object.keys(ELEMENT_CONFIGS);

// XML 태그 -> 타입 매핑
export const TAG_TYPE_MAP: Record<string, string> = Object.entries(ELEMENT_CONFIGS).reduce(
  (acc, [type, config]) => {
    acc[config.xmlTag] = type;
    return acc;
  },
  {} as Record<string, string>
);