import { updateDocumentStructure, importDocumentWithPatch } from './document';
import type { DocumentBlock, ParagraphJson, TableJson, TextRunJson } from './types';
import type { Operation as JsonPatchOperation } from 'fast-json-patch';

// 캐시된 블록 리스트
let _buffer: DocumentBlock[] | undefined;

/**
 * converter의 JSON 맵핑 객체를 받아서
 * 순서대로 블록 배열로 변환합니다.
 */
function mapToBlocks(mapping: Record<string, any>): DocumentBlock[] {
  const blocks: DocumentBlock[] = [];
  for (const id in mapping) {
    const obj = mapping[id];
    if (!obj || typeof obj !== 'object' || typeof obj.type !== 'string') continue;
    if (obj.type === 'paragraph') {
      // 개별 key를 순회하면서 textRun 타입만 선별
      const runs: TextRunJson[] = [];
      for (const key in obj) {
        const val = obj[key];
        if (val && typeof val === 'object' && (val as any).type === 'textRun') {
          const v = val as TextRunJson;
          runs.push({ ...v, id: key });
        }
      }
      // 순서대로 정렬
      runs.sort((a, b) => a.order - b.order);
      const para: ParagraphJson = {
        id,
        type: 'paragraph',
        order: (obj as any).order,
        properties: (obj as any).properties || {},
        runs,
      };
      blocks.push(para);
    } else if (obj.type === 'table') {
      const tbl = obj as TableJson;
      blocks.push({ ...tbl, id });
    }
  }
  return blocks.sort((a, b) => a.order - b.order);((a, b) => a.order - b.order);
}

async function ensureBuffer(): Promise<DocumentBlock[]> {
  if (!_buffer) {
    // converter JSON 맵핑 객체를 직접 가져오도록 export 수정 필요
    const mapping = await updateDocumentStructure() as unknown as Record<string, any>;
    // console.log('Mapping:', mapping);
    _buffer = mapToBlocks(mapping);
  }
  console.log('Buffer:', _buffer);
  return _buffer;
}

/**
 * id로 블록(단락 또는 표) 하나를 찾아 반환합니다.
 */
export async function readBlockById(id: string): Promise<DocumentBlock | null> {
  const buffer = await ensureBuffer();
  return buffer.find(b => b.id === id) ?? null;
}

/**
 * 키워드로 문서에서 블록들을 검색해 id와 타입 목록을 반환합니다.
 */
export async function searchBlocks(keyword: string): Promise<{ id: string; type: string }[]> {
  const buffer = await ensureBuffer();
  const kw = keyword.toLowerCase();
  return buffer
    .filter(b => b.type === 'paragraph')
    .filter((p: ParagraphJson) => 
      p.runs.some(r => r.text.toLowerCase().includes(kw))
    )
    .map(b => ({ id: b.id, type: b.type }));
}

/**
 * 단락 전체를 새로운 텍스트 한 줄로 교체합니다.
 */
export async function editBlockParagraph(id: string, newText: string): Promise<boolean> {
  const buffer = await ensureBuffer();
  const para = buffer.find(b => b.id === id && b.type === 'paragraph') as ParagraphJson | undefined;
  if (!para) return false;
  // 문서 내 단락 인덱스
  const docIdx = buffer.indexOf(para);

  // 텍스트 run 요소 수 만큼 patch 생성
  const patch: JsonPatchOperation[] = para.runs.map((run, i) => ({
    op: 'replace' as const,
    path: `/w:document/w:body/w:p/${docIdx}/w:r/${i}/w:t`,
    value: i === 0 ? newText : '',
  }));

  await importDocumentWithPatch(patch);
  _buffer = undefined;
  return true;
}

/**
 * 특정 텍스트 run 하나의 텍스트만 교체합니다.
 */
export async function editRunText(runId: string, newText: string): Promise<boolean> {
  const buffer = await ensureBuffer();
  // runId 형식: '<blockId>_<runId>' → blockId와 runs 배열에서 찾기
  let targetPara: ParagraphJson | undefined;
  let runIndex = -1;
  buffer.forEach(b => {
    if (b.type === 'paragraph') {
      const p = b as ParagraphJson;
      const idx = p.runs.findIndex(r => r.id === runId);
      if (idx >= 0) {
        targetPara = p;
        runIndex = idx;
      }
    }
  });
  if (!targetPara || runIndex < 0) return false;
  const docIdx = buffer.indexOf(targetPara);

  const patch: JsonPatchOperation[] = [{
    op: 'replace' as const,
    path: `/w:document/w:body/w:p/${docIdx}/w:r/${runIndex}/w:t`,
    value: newText,
  }];

  await importDocumentWithPatch(patch);
  _buffer = undefined;
  return true;
}
