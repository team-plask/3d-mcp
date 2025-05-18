import { updateDocumentStructure, importDocumentWithPatch } from './document';
import type { DocumentBlock, ParagraphJson, TableJson, TextRunJson } from './types';
import type { Operation as JsonPatchOperation } from 'fast-json-patch';

let _buffer: DocumentBlock[] | undefined;

function mapToBlocks(mapping: Record<string, any>): DocumentBlock[] {
  const blocks: DocumentBlock[] = [];
  for (const id in mapping) {
    const obj = mapping[id];
    if (!obj || typeof obj !== 'object' || typeof obj.type !== 'string') continue;
    if (obj.type === 'paragraph') {
      const runs: TextRunJson[] = [];
      for (const key in obj) {
        const val = obj[key];
        if (val && typeof val === 'object' && (val as any).type === 'textRun') {
          const v = val as TextRunJson;
          runs.push({ ...v, id: key });
        }
      }
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
    const mapping = await updateDocumentStructure() as unknown as Record<string, any>;
    _buffer = mapToBlocks(mapping);
  }
  console.log('Buffer:', _buffer);
  return _buffer;
}

export async function readBlockById(id: string): Promise<DocumentBlock | null> {
  const buffer = await ensureBuffer();
  return buffer.find(b => b.id === id) ?? null;
}

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

export async function editBlockParagraph(id: string, newText: string): Promise<boolean> {
  const buffer = await ensureBuffer();
  const para = buffer.find(b => b.id === id && b.type === 'paragraph') as ParagraphJson | undefined;
  if (!para) return false;
  const docIdx = buffer.indexOf(para);

  const patch: JsonPatchOperation[] = para.runs.map((run, i) => ({
    op: 'replace' as const,
    path: `/w:document/w:body/w:p/${docIdx}/w:r/${i}/w:t`,
    value: i === 0 ? newText : '',
  }));

  await importDocumentWithPatch(patch);
  _buffer = undefined;
  return true;
}

export async function editRunText(runId: string, newText: string): Promise<boolean> {
  const buffer = await ensureBuffer();
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
