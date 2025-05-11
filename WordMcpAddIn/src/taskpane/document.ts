// ──────────────────────────────────────────────────────────
// src/taskpane/document.ts
// ──────────────────────────────────────────────────────────
import { XMLParser } from 'fast-xml-parser';
import { convertOoxmlToJson, pickDocumentPart } from './converter';  // 이미 제공
import { ParagraphJson, DocumentBlock } from './types';

// XML 파서 설정 (OOXML 수정용)
const domParser = new DOMParser();
const xmlSerializer = new XMLSerializer();
const wNs   = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const w14Ns = 'http://schemas.microsoft.com/office/word/2010/wordml';

// ──────────────────────────────────────────────────────────
// EXPORT  → OOXML(document.xml) → JSON 블록 배열
// ──────────────────────────────────────────────────────────
export async function exportDocumentStructureJson() {
  return Word.run(async ctx => {
    const flat   = ctx.document.body.getOoxml();
    await ctx.sync();

    const docXml   = pickDocumentPart(flat.value);  // ← 여기서 본문만 추출
    console.log('Document XML:', docXml);
    const docJson = convertOoxmlToJson(docXml);    // ⬅ 이미 구현
    console.log('Document JSON:', docJson);
    return docJson.blocks;                              // [{ id, type, … }]
  });
}

export async function importDocumentStructureJson(blocks: DocumentBlock[]) {
  return Word.run(async ctx => {
    // ① 본문 OOXML 가져오기
    const flat = ctx.document.body.getOoxml();
    await ctx.sync();

    const xmlDoc = domParser.parseFromString(flat.value, 'application/xml');
    const bodyEl = xmlDoc.getElementsByTagNameNS(wNs, 'body')[0];
    const pNodes = Array.from(bodyEl.getElementsByTagNameNS(wNs, 'p'));

    // ② Map <paragraph-id , ParagraphJson>
    const pMap = new Map<string, ParagraphJson>();
    blocks.filter(b => b.type === 'paragraph')
          .forEach(p => pMap.set(p.id, p as ParagraphJson));

    // ③ 순차 매핑(p_1 , p_2 …)  ↔  실제 <w:p>
    let idx = 1, patched = 0;
    pNodes.forEach(pEl => {
      const pId = `p_${idx++}`;
      const pj  = pMap.get(pId);
      if (!pj) return;

      const newText = pj.runs.map(r => r.text).join('');
      const tEls = pEl.getElementsByTagNameNS(wNs, 't');
      if (!tEls.length) return;

      // 첫 <w:t> 에 새 텍스트, 나머지는 비움
      (tEls[0] as Element).textContent = newText;
      for (let i=1;i<tEls.length;i++) tEls[i].textContent = '';
      patched++;
    });
    console.log('patched paragraphs =', patched);

    // ④ Word 에 다시 삽입
    const newOoxml = xmlSerializer.serializeToString(xmlDoc)
                       .replace(/<\?xml.*?\?>/, '');
    ctx.document.body.insertOoxml(newOoxml, Word.InsertLocation.replace);
    await ctx.sync();
  });
}
