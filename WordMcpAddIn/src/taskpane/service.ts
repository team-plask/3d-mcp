// src/taskpane/service.ts
import {
    exportDocumentStructureJson,
    importDocumentStructureJson
  } from './document';
  import type { DocumentBlock } from './document';
  
  let _buffer: DocumentBlock[] = [];
  
  // 전체를 다시 뽑아 옵니다
  async function ensureBuffer() {
    _buffer = await exportDocumentStructureJson();
    return _buffer;
  }
  
  export async function readBlockById(id: string): Promise<DocumentBlock|null> {
    await ensureBuffer();
    return _buffer.find(b => b.id === id) ?? null;
  }
  
  export async function searchBlocks(keyword: string): Promise<{id:string,type:string}[]> {
    if (!_buffer.length) await ensureBuffer();
    const kw = keyword.toLowerCase();
    return _buffer
      .filter(b => {
        if (b.type === 'paragraph')
          return (b.content.text as string).toLowerCase().includes(kw);
        if (b.type === 'table')
          return b.content.rows.some((r:string[]) =>
            r.some(c=>c.toLowerCase().includes(kw))
          );
        return false;
      })
      .map(b => ({ id: b.id, type: b.type }));
  }
  
  export async function editBlockParagraph(id: string, content: string): Promise<boolean> {
    await ensureBuffer();
    const blk = _buffer.find(b => b.id === id);
    if (!blk || blk.type !== 'paragraph') return false;
    blk.content.text = content;
    await importDocumentStructureJson(_buffer);
    return true;
  }
  