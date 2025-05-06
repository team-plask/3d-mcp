// src/taskpane/service.ts
import {
    exportDocumentStructureJson,
    importDocumentStructureJson,
    DocumentBlock
  } from './document';
  
  /**
   * Return the entire block buffer (fresh snapshot).
   */
  async function snapshot(): Promise<DocumentBlock[]> {
    return await exportDocumentStructureJson();
  }
  
  /**
   * Read a single block by id.
   */
  export async function readBlockById(id: string): Promise<DocumentBlock | null> {
    const blocks = await snapshot();
    return blocks.find(b => b.id === id) ?? null;
  }
  
  /**
   * Search all blocks for any paragraph or table containing `keyword`.
   */
  export async function searchBlocks(keyword: string): Promise<{id:string, type:string}[]> {
    const kw = keyword.toLowerCase();
    const blocks = await snapshot();
    return blocks
      .filter(b => {
        if (b.type === 'paragraph') {
          return (b.content.text as string).toLowerCase().includes(kw);
        }
        if (b.type === 'table') {
          return b.content.rows.some((r:string[]) =>
            r.some(c => c.toLowerCase().includes(kw)));
        }
        return false;
      })
      .map(b => ({ id: b.id, type: b.type }));
  }
  
  /**
   * Edit a paragraph block’s text, then write the entire document back.
   * Returns true on success, false if block not found or not paragraph.
   */
  export async function editBlockParagraph(id: string, newText: string): Promise<boolean> {
    const blocks = await snapshot();
    const blk = blocks.find(b => b.id === id);
    if (!blk || blk.type !== 'paragraph') return false;
    blk.content.text = newText;
    await importDocumentStructureJson(blocks);
    return true;
  }
  