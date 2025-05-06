// src/taskpane/document.ts
import { parseFlowNodes } from './parser';

export interface DocumentBlock {
  id: string;
  type: 'paragraph'|'table'|'image';
  content: any;
  controlId?: string;
  paraId?: string;
}

export async function exportDocumentStructureJson(): Promise<DocumentBlock[]> {
    return Word.run(async ctx => {
      const body     = ctx.document.body;
      const tables   = body.tables;
      const controls = ctx.document.contentControls;
      const paras    = body.paragraphs;
  
      tables.load('items,items/styleBuiltIn');
      controls.load('items/id,text');
      paras.load('items/text');
      await ctx.sync();
  
      // HTML 가져오기
      const htmlResult = body.getHtml();
      // 중요: HTML 결과를 사용하기 전에 sync 호출 필요
      await ctx.sync();
      
      const blocks: DocumentBlock[] = [];
      parseFlowNodes(new DOMParser().parseFromString(htmlResult.value, 'text/html').body.childNodes, blocks);
  
      // 스타일, id 매핑 (기존 로직 그대로)
      let ti = 0, pi = 0, ii = 0;
      for (const b of blocks) {
        if (b.type === 'table')  b.content.style = tables.items[ti].styleBuiltIn || 'TableGrid';
        if (b.type === 'paragraph') {
          const txt = b.content.text;
          const ctrl = controls.items.find(c => c.text?.includes(txt));
          b.controlId = ctrl?.id.toString();
          if (!b.controlId)      b.id = `para-${pi++}`;
          else                   b.id = `cc-${b.controlId}`;
        }
        else if (b.type === 'table') { b.id = `table-${ti}`; ti++; }
        else if (b.type === 'image') { b.id = `image-${ii}`; ii++; }
      }
      return blocks;
    });
  }

export async function importDocumentStructureJson(blocks: DocumentBlock[]): Promise<void> {
  return Word.run(async ctx => {
    const body = ctx.document.body;
    body.clear();
    for (const b of blocks) {
      if (b.type === 'paragraph') {
        const p = body.insertParagraph(b.content.text, Word.InsertLocation.end);
        const key = b.content.style.replace(/\s+/g,'');
        // @ts-ignore
        p.styleBuiltIn = (Word.Style as any)[key] || Word.Style.Normal;
      }
      if (b.type === 'table') {
        const rows = b.content.rows as string[][];
        const tbl = body.insertTable(rows.length, rows[0]?.length||1, Word.InsertLocation.end, rows);
        // @ts-ignore
        tbl.styleBuiltIn = b.content.style || 'TableGrid';
      }
      if (b.type === 'image') {
        const base64 = (b.content.src as string).split(',')[1];
        body.insertInlinePictureFromBase64(base64, Word.InsertLocation.end);
      }
    }
    await ctx.sync();
  });
}

/** 문서 끝에 그대로 덧붙임 */
export async function appendBlocks(blocks: DocumentBlock[]): Promise<void> {
  return Word.run(async ctx => {
    const body = ctx.document.body;
    for (const b of blocks) {
      if (b.type === 'paragraph') {
        const p = body.insertParagraph(b.content.text, Word.InsertLocation.end);
        const key = b.content.style.replace(/\s+/g,'');
        // @ts-ignore
        p.styleBuiltIn = (Word.Style as any)[key] || Word.Style.Normal;
      }
      if (b.type === 'table') {
        const rows = b.content.rows as string[][];
        const tbl = body.insertTable(rows.length, rows[0]?.length||1, Word.InsertLocation.end, rows);
        // @ts-ignore
        tbl.styleBuiltIn = b.content.style || 'TableGrid';
      }
      if (b.type === 'image') {
        const base64 = (b.content.src as string).split(',')[1];
        body.insertInlinePictureFromBase64(base64, Word.InsertLocation.end);
      }
    }
    await ctx.sync();
  });
}
