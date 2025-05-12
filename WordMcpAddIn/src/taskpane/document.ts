import { XMLParser } from 'fast-xml-parser';
import { convertOoxmlToJson, pickDocumentPart } from './converter'; 
import { ParagraphJson, DocumentBlock } from './types';

const domParser = new DOMParser();
const xmlSerializer = new XMLSerializer();
const wNs   = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const w14Ns = 'http://schemas.microsoft.com/office/word/2010/wordml';

export async function exportDocumentStructureJson() {
  return Word.run(async ctx => {
    const flat   = ctx.document.body.getOoxml();
    await ctx.sync();

    const docXml   = pickDocumentPart(flat.value);  
    console.log('Document XML:', docXml);
    const docJson = convertOoxmlToJson(docXml);   
    console.log('Document JSON:', docJson);
    return docJson.blocks;                            
  });
}

export async function importDocumentStructureJson(blocks: DocumentBlock[]) {
  return Word.run(async ctx => {
    const flat = ctx.document.body.getOoxml();
    await ctx.sync();

    const xmlDoc = domParser.parseFromString(flat.value, 'application/xml');
    const bodyEl = xmlDoc.getElementsByTagNameNS(wNs, 'body')[0];
    const pNodes = Array.from(bodyEl.getElementsByTagNameNS(wNs, 'p'));

    const pMap = new Map<string, ParagraphJson>();
    blocks.filter(b => b.type === 'paragraph')
          .forEach(p => pMap.set(p.id, p as ParagraphJson));

    let idx = 1, patched = 0;
    pNodes.forEach(pEl => {
      const pId = `p_${idx++}`;
      const pj  = pMap.get(pId);
      if (!pj) return;

      const newText = pj.runs.map(r => r.text).join('');
      const tEls = pEl.getElementsByTagNameNS(wNs, 't');
      if (!tEls.length) return;

      (tEls[0] as Element).textContent = newText;
      for (let i=1;i<tEls.length;i++) tEls[i].textContent = '';
      patched++;
    });
    console.log('patched paragraphs =', patched);

    const newOoxml = xmlSerializer.serializeToString(xmlDoc)
                       .replace(/<\?xml.*?\?>/, '');
    ctx.document.body.insertOoxml(newOoxml, Word.InsertLocation.replace);
    await ctx.sync();
  });
}
