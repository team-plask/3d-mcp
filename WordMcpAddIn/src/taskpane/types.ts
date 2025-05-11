/*───────────────────────────────────────────────────────────*
 *  OOXML → JSON  구조와  TypeScript 타입 정의 (최소 핵심)
 *───────────────────────────────────────────────────────────*/

/*— ① 텍스트 런(r) —*/
export interface TextRunProperties {
    bold?: boolean;
    italic?: boolean;
    underline?: string;
    fontSize?: string;
    color?: string;
    /* 필요한 <w:rPr> 속성 추가 */
  }
  export interface TextRunJson {
    id: string;             // 예: p_3_r1
    type: 'textRun';
    order: number;          // 단락 내 순서
    parentId: string;       // 소속 단락 id
    text: string;
    properties?: TextRunProperties;
  }
  
  /*— ② 단락(p) —*/
  export interface ParagraphProperties {
    justification?: 'left'|'center'|'right'|'both';
    spacing?: { after?: string; line?: string; lineRule?: string };
  }
  export interface ParagraphJson {
    id: string;             // <w14:paraId> 또는 p_<n>
    type: 'paragraph';
    order: number;          // 문서 흐름 순서
    runs: TextRunJson[];
    properties?: ParagraphProperties;
  }
  
  /*— ③ 표(tbl) —*/
  export interface TableCellJson {
    id: string;
    type: 'tableCell';
    order: number;          // 행 내 셀순
    parentId: string;       // tr id
    content: (ParagraphJson | TableJson)[];  // 셀 안엔 단락 or nested table
  }
  export interface TableRowJson {
    id: string;
    type: 'tableRow';
    order: number;          // 테이블 내 행순
    parentId: string;       // tbl id
    cells: TableCellJson[];
  }
  export interface TableJson {
    id: string;             // <w:tblId> or tbl_<n>
    type: 'table';
    order: number;
    rows: TableRowJson[];
  }
  
  /*— ④ 블록 합집합 & 문서 루트 —*/
  export type DocumentBlock = ParagraphJson | TableJson;
  /* 필요 시 ImageJson, ListJson 등 추가해 union 확장 */
  
  export interface DocumentJson {
    blocks: DocumentBlock[];
  }
  