import {
  exportDocumentStructureJson,
  importDocumentStructureJson,
} from './document';
import type { DocumentBlock, ParagraphJson, TableJson } from './types';

function blockToPlain(b: DocumentBlock): string {
  if (b.type === 'paragraph') {
    // runs[].text 이어 붙이기
    return (b as ParagraphJson).runs.map(r => r.text).join('');
  }
  if (b.type === 'table') {
    const tbl = b as TableJson;
    return tbl.rows
      .flatMap(row => row.cells)
      .flatMap(cell => cell.content)
      .filter(c => c.type === 'paragraph')
      .map(p => (p as ParagraphJson).runs.map(r => r.text).join(''))
      .join(' ');
  }
  return '';
}

let _buffer: DocumentBlock[] = [];

// 문서 읽기 캐시
async function ensureBuffer() {
  _buffer = await exportDocumentStructureJson() as (ParagraphJson | TableJson)[];
  return _buffer;
}

function plainText(b: DocumentBlock): string {
  if (b.type === 'paragraph') {
    if (Array.isArray((b as ParagraphJson).runs)) {
      return (b as ParagraphJson).runs.map((r:any)=> r.text).join('');
    }
    return '';
  }
  if (b.type === 'table') {
    return ((b as TableJson).rows || [])
           .flat().join(' ');
  }
  return '';    
}

export async function readBlockById(id: string) {
  await ensureBuffer();
  return _buffer.find(b => b.id === id) ?? null;
}

function paraPlainText(p: ParagraphJson){
  return p.runs.map(r=>r.text).join('');
}

export async function searchBlocks(keyword: string){
  if (!_buffer.length) await ensureBuffer();
  const kw = keyword.toLowerCase();
  return _buffer
    .filter(b => {
      if (b.type === 'paragraph')
        return paraPlainText(b as ParagraphJson).toLowerCase().includes(kw);
      if (b.type === 'table')
        return (b as TableJson).rows.flatMap(r=>r.cells)
                .some(c => c.content
                           .filter(x=>x.type==='paragraph')
                           .some(p => paraPlainText(p as ParagraphJson)
                                      .toLowerCase().includes(kw)));
      return false;
    })
    .map(b => ({ id: b.id, type: b.type }));
}


export async function editBlockParagraph(id: string, newText: string) {
  await ensureBuffer();

  let para = _buffer.find(b => b.id === id && b.type === 'paragraph') as ParagraphJson | undefined;
  if (para) {
    para.runs = [{
      id: `${para.id}_r1`,
      type:'textRun', order:1, parentId: para.id,
      text: newText, properties:{}
    }];
  } else {
    const m = id.match(/^(p_\d+)_r_\d+$/);
    if (!m) return false;
    const pId = m[1];
    para = _buffer.find(b => b.id === pId) as ParagraphJson | undefined;
    if (!para) return false;
    const run = para.runs.find(r => r.id === id);
    if (!run) return false;
    run.text = newText;
  }

  await importDocumentStructureJson(_buffer);
  _buffer = [];         
  return true;
}

export async function editRunText(runId: string, newText: string) {
  await ensureBuffer();                      

  const m = runId.match(/^(.+_p_\d+)_r_\d+$/);
  if (!m) return false;                  
  const paraId = m[1];

  const para = _buffer.find(b => b.id === paraId) as ParagraphJson | undefined;
  if (!para) return false;

  const run = para.runs.find(r => r.id === runId);
  if (!run) return false;

  run.text = newText;                        

  await importDocumentStructureJson(_buffer); 
  _buffer = [];                               
  return true;
}
