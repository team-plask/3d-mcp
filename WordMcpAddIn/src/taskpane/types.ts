export interface TextRunProperties {
    bold?: boolean;
    italic?: boolean;
    underline?: string;
    fontSize?: string;
    color?: string;
  }
  export interface TextRunJson {
    id: string;             
    type: 'textRun';
    order: number;         
    parentId: string;      
    text: string;
    properties?: TextRunProperties;
  }
  
  export interface ParagraphProperties {
    justification?: 'left'|'center'|'right'|'both';
    spacing?: { after?: string; line?: string; lineRule?: string };
  }
  export interface ParagraphJson {
    id: string;            
    type: 'paragraph';
    order: number;        
    runs: TextRunJson[];
    properties?: ParagraphProperties;
  }
  
  export interface TableCellJson {
    id: string;
    type: 'tableCell';
    order: number;        
    parentId: string;      
    content: (ParagraphJson | TableJson)[]; 
  }
  export interface TableRowJson {
    id: string;
    type: 'tableRow';
    order: number;          
    parentId: string;      
    cells: TableCellJson[];
  }
  export interface TableJson {
    id: string;           
    type: 'table';
    order: number;
    rows: TableRowJson[];
  }
  
  export type DocumentBlock = ParagraphJson | TableJson;
  
  export interface DocumentJson {
    blocks: DocumentBlock[];
  }
  