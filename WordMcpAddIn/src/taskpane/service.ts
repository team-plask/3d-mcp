// ──────────────────────────────────────────────────────────
// src/taskpane/service.ts
// ──────────────────────────────────────────────────────────
import {
  exportDocumentStructureJson,
  importDocumentStructureJson,
} from './document';
import type { DocumentBlock, ParagraphJson, TableJson } from './types';

/** 블록을 “검색용 한줄 문자열”로 변환 */
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

type DocumentBlock = ParagraphJson | TableJson;

let _buffer: DocumentBlock[] = [];

// 문서 읽기 캐시
async function ensureBuffer() {
  _buffer = await exportDocumentStructureJson() as (ParagraphJson | TableJson)[];
  return _buffer;
}

function plainText(b: DocumentBlock): string {
  if (b.type === 'paragraph') {
    // ① convertOoxmlToJson이 runs 배열만 줄 때:
    if (Array.isArray(b.content?.runs)) {
      return b.content.runs.map((r:any)=> r.text).join('');
    }
    // ② 예전 포맷(back-compat) – content.text 가 있을 때:
    return String(b.content?.text ?? '');
  }
  if (b.type === 'table') {
    return (b.content?.rows || [])
           .flat().join(' ');
  }
  return '';     // image 등 검색 대상 아님
}

/*────────── read / search / edit ──────────*/
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


/** id = p_26  |  id = p_26_r_3  둘 다 허용  */
export async function editBlockParagraph(id: string, newText: string) {
  await ensureBuffer();

  // ── Paragraph-ID? ─────────────────────
  let para = _buffer.find(b => b.id === id && b.type === 'paragraph') as ParagraphJson | undefined;
  if (para) {
    para.runs = [{
      id: `${para.id}_r1`,
      type:'textRun', order:1, parentId: para.id,
      text: newText, properties:{}
    }];
  } else {
    // ── Run-ID? (p_26_r_3) ────────────────
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
  _buffer = [];            // invalidate cache
  return true;
}

/** 특정 run(id) 의 text 를 교체 */
export async function editRunText(runId: string, newText: string) {
  await ensureBuffer();                       // 최신 JSON 확보

  // runId → paragraph 찾기
  const m = runId.match(/^(.+_p_\d+)_r_\d+$/);
  if (!m) return false;                       // id 형식 오류
  const paraId = m[1];

  // ParagraphJson
  const para = _buffer.find(b => b.id === paraId) as ParagraphJson | undefined;
  if (!para) return false;

  // Run 찾기
  const run = para.runs.find(r => r.id === runId);
  if (!run) return false;

  run.text = newText;                         // 🔄 수정

  await importDocumentStructureJson(_buffer); // Word 에 반영
  _buffer = [];                               // 캐시 무효화
  return true;
}
