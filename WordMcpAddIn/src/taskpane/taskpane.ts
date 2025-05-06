// /// <reference types="office-js" />

// /* ------------------------------------------------------------------ *
//  *  Word → JSON snapshot helpers (same logic you built earlier)
//  * ------------------------------------------------------------------ */
// interface DocumentBlock {
//   id: string;
//   type: 'paragraph' | 'table' | 'image';
//   content: any;
//   controlId?: string;
//   paraId?: string;
// }

// function normalizeText(t = '') { return t.replace(/\s+/g, ' ').trim(); }

// /* Parse HTML DOM (keeps visual order) */
// function parseFlowNodes(nodes: NodeList, blocks: DocumentBlock[]) {
//   Array.from(nodes).forEach(node => {
//     if (node.nodeName === 'P') {
//       blocks.push({
//         id: '',
//         type: 'paragraph',
//         content: {
//           text:  normalizeText((node as HTMLElement).textContent || ''),
//           style: (node as HTMLElement).getAttribute('data-style')
//                || (node as HTMLElement).getAttribute('class')
//                || 'Normal'
//         }
//       });
//     } else if (node.nodeName === 'TABLE') {
//       const rows = Array.from((node as HTMLTableElement).rows).map(r =>
//         Array.from(r.cells).map(c => normalizeText(c.textContent || '')));
//       blocks.push({ id:'', type:'table',  content:{ rows } });
//     } else if (node.nodeName === 'IMG') {
//       blocks.push({ id:'', type:'image', content:{ src:(node as HTMLImageElement).src } });
//     } else if (node.nodeType === Node.ELEMENT_NODE) {
//       parseFlowNodes((node as Element).childNodes, blocks);
//     }
//   });
// }

// /* Export live Word document → JSON blocks (adds stable ids) */
// async function exportDocumentStructureJson(): Promise<DocumentBlock[]> {
//   return Word.run(async ctx => {
//     const body      = ctx.document.body;
//     const tables    = body.tables;
//     const controls  = ctx.document.contentControls;
//     const paras     = body.paragraphs;

//     tables.load('items,items/styleBuiltIn');
//     controls.load('items/id,text');
//     paras.load('items/text');
//     await ctx.sync();

//     const htmlResult = body.getHtml(); 
//     await ctx.sync();          
//     const html = htmlResult.value;              
//     const blocks: DocumentBlock[] = [];
//     parseFlowNodes(new DOMParser().parseFromString(html, 'text/html').body.childNodes, blocks);

//     /* ---- add styling / ids ---- */
//     let ti = 0, pi = 0, ii = 0;
//     for (const b of blocks) {
//       if (b.type === 'table')  b.content.style = tables.items[ti++].styleBuiltIn || 'TableGrid';

//       if (b.type === 'paragraph') {
//         const txt = b.content.text;
//         const ctrl = controls.items.find(c => c.text?.includes(txt));
//         b.controlId = ctrl?.id.toString();

//         if (!b.controlId) b.id = `para-${pi++}`;
//         else              b.id = `cc-${b.controlId}`;
//       }
//       else if (b.type === 'table')  b.id = `table-${ti-1}`;
//       else if (b.type === 'image')  b.id = `image-${ii++}`;
//     }
//     return blocks;
//   });
// }

// /* Import JSON blocks back into Word (overwrites body) */
// async function importDocumentStructureJson(blocks: DocumentBlock[]) {
//   return Word.run(async ctx => {
//     const body = ctx.document.body;
//     body.clear();            // wipe current content

//     for (const b of blocks) {
//       if (b.type === 'paragraph') {
//         const p = body.insertParagraph(b.content.text, Word.InsertLocation.end);
//         const k = b.content.style.replace(/\s+/g,'');
//         // @ts-ignore
//         p.styleBuiltIn = (Word.Style as any)[k] || Word.Style.Normal;
//       }
//       if (b.type === 'table') {
//         const tbl = body.insertTable(b.content.rows.length, b.content.rows[0]?.length || 1,
//                                      Word.InsertLocation.end, b.content.rows);
//         // @ts-ignore
//         tbl.styleBuiltIn = b.content.style || 'TableGrid';
//       }
//       if (b.type === 'image') {
//         const base64 = b.content.src.split(',')[1];
//         body.insertInlinePictureFromBase64(base64, Word.InsertLocation.end);
//       }
//     }
//     await ctx.sync();
//   });
// }

// /* ------------------------------------------------------------------ *
//  *                         Demo logic
//  * ------------------------------------------------------------------ */
// let blocksBuffer: DocumentBlock[] = [];   // keeps latest export

// /* UI helpers */
// const $  = (id: string) => document.getElementById(id) as HTMLElement;
// const log = (msg: any) => { $('result').textContent = typeof msg === 'string'
//                                                 ? msg : JSON.stringify(msg,null,2); };

//                                                 /** blocks 를 문서 끝에 그대로 덧붙임(기존 내용은 보존) */
// async function appendBlocks(blocks: DocumentBlock[]) {
//   return Word.run(async ctx => {
//     const body = ctx.document.body;

//     for (const b of blocks) {
//       if (b.type === 'paragraph') {
//         const p = body.insertParagraph(b.content.text, Word.InsertLocation.end);
//         const k = b.content.style.replace(/\s+/g, '');
//         // @ts-ignore  ─ Office enum 매핑
//         p.styleBuiltIn = (Word.Style as any)[k] || Word.Style.Normal;
//       }

//       if (b.type === 'table') {
//         const tbl = body.insertTable(
//           b.content.rows.length,
//           b.content.rows[0]?.length || 1,
//           Word.InsertLocation.end,
//           b.content.rows
//         );
//         // @ts-ignore
//         tbl.styleBuiltIn = b.content.style || 'TableGrid';
//       }

//       if (b.type === 'image') {
//         const base64 = b.content.src.split(',')[1];
//         body.insertInlinePictureFromBase64(base64, Word.InsertLocation.end);
//       }
//     }
//     await ctx.sync();
//   });
// }

// async function snapshot() {
//   // 1) JSON 스냅샷
//   blocksBuffer = await exportDocumentStructureJson();
//   log(`Exported ${blocksBuffer.length} blocks → JSON (see console)`);
//   console.table(blocksBuffer.map(b => ({
//     id: b.id, type: b.type, text: b.content?.text || ''
//   })));

//   // 2) 같은 내용을 그대로 문서 끝에 붙여 보기
//   await appendBlocks(blocksBuffer);
//   console.info('✅  duplicated current content at the end of the document');
// }


// /* 1. READ */
// function readById() {
//   const id = ( $('readId') as HTMLInputElement ).value.trim();
//   const blk = blocksBuffer.find(b => b.id === id);
//   log(blk ?? `❓  block "${id}" not found`);
// }

// /* 2. SEARCH */
// async function searchKeyword() {
//   // → 함수 자체를 async 로
//   if (blocksBuffer.length === 0) {
//     await snapshot();                   // ← 반드시 기다린다
//   }

//   const input = $('searchKw') as HTMLInputElement | null;
//   if (!input) { log('❓ search box not found'); return; }

//   const kw = input.value.trim().toLowerCase();
//   if (!kw) { log('🔍 enter a keyword'); return; }

//   const hits = blocksBuffer.filter(b => {
//     if (b.type === 'paragraph')
//       return (b.content.text as string).toLowerCase().includes(kw);
//     if (b.type === 'table')
//       return b.content.rows.some((r: string[]) =>
//         r.some(c => c.toLowerCase().includes(kw)));
//     return false;
//   }).map(b => ({ id: b.id, type: b.type }));

//   log(hits.length ? hits : '🔍 no match');
// }


// /* 3. EDIT (paragraph only ‑ demo) */
// async function editParagraph() {
//   const id  = ( $('editId') as HTMLInputElement ).value.trim();
//   const txt = ( $('editTxt') as HTMLInputElement ).value;
//   const blk = blocksBuffer.find(b => b.id === id);

//   if (!blk)         return log(`❓ "${id}" not found`);
//   if (blk.type!=='paragraph')
//     return log('⚠️ edit demo only supports paragraph blocks');

//   blk.content.text = txt;                // mutate buffer
//   await importDocumentStructureJson(blocksBuffer);
//   log(`✅ paragraph "${id}" replaced and written back!`);
// }

// class WordWebSocketClient {
//   private socket: WebSocket | null = null;

//   constructor(private url: string) {}

//   /* 도우미 */
//   private send(msg: any) {
//     if (this.socket?.readyState === WebSocket.OPEN) {
//       this.socket.send(JSON.stringify(msg));
//     } else {
//       console.warn('WS not open – message skipped', msg);
//     }
//   }

//   /* 스냅샷 캐시가 비어 있으면 채움 */
//   private async ensureSnapshot() {
//     if (blocksBuffer.length === 0) {
//       blocksBuffer = await exportDocumentStructureJson();
//     }
//   }

//   /* 핵심 onMessage 라우터 */
//   private async handleMessage(raw: MessageEvent) {
//     let msg: any;
//     try { msg = JSON.parse(raw.data); } catch {
//       return this.send({ type: 'error', err: 'invalid JSON' });
//     }

//     try {
//       switch (msg.type) {
//         /* ---------- READ ---------- */
//         case 'readRequest': {
//           await this.ensureSnapshot();
//           const blk = blocksBuffer.find(b => b.id === msg.id) ?? null;
//           this.send({ type: 'readResponse', id: msg.id, payload: blk });
//           break;
//         }

//         /* ---------- SEARCH ---------- */
//         case 'searchRequest': {
//           await this.ensureSnapshot();
//           const kw = String(msg.keyword ?? '').toLowerCase();
//           const hits = blocksBuffer.filter(b => {
//             if (b.type === 'paragraph')
//               return (b.content.text as string).toLowerCase().includes(kw);
//             if (b.type === 'table')
//               return b.content.rows.some((r: string[]) =>
//                 r.some(c => c.toLowerCase().includes(kw)));
//             return false;
//           }).map(b => ({ id: b.id, type: b.type }));
//           this.send({ type: 'searchResponse', keyword: msg.keyword, hits });
//           break;
//         }

//         /* ---------- EDIT ---------- */
//         case 'editRequest': {
//           await this.ensureSnapshot();
//           const blk = blocksBuffer.find(b => b.id === msg.id);
//           if (!blk) {
//             this.send({ type: 'editResponse', id: msg.id, success: false,
//                         err: 'not found' });
//             return;
//           }
//           if (blk.type !== 'paragraph') {
//             this.send({ type: 'editResponse', id: msg.id, success: false,
//                         err: 'only paragraph editable in demo' });
//             return;
//           }
//           blk.content.text = String(msg.content ?? '');
//           await importDocumentStructureJson(blocksBuffer);   // Word 반영
//           this.send({ type: 'editResponse', id: msg.id, success: true });
//           break;
//         }

//         /* ---------- UNKNOWN ---------- */
//         default:
//           this.send({ type: 'error', err: `unknown type "${msg.type}"` });
//       }
//     } catch (e: any) {
//       console.error(e);
//       this.send({ type: 'error', err: e.message ?? String(e) });
//     }
//   }

//   /* 연결 */
//   connect() {
//     if (this.socket) return;

//     this.socket = new WebSocket(this.url);

//     this.socket.onopen = async () => {
//       console.log('WS connected');
//       await this.ensureSnapshot();                 // 최초 캐싱
//       this.send({ type: 'readResponse',
//                   id: '*snapshot*',
//                   payload: blocksBuffer });
//     };

//     this.socket.onmessage = ev => this.handleMessage(ev);
//     this.socket.onerror   = e  => console.error('WS error', e);
//     this.socket.onclose   = () => { this.socket = null; };
//   }
// }

// let client: WordWebSocketClient|null = null;

// /* ------------------------------------------------------------------ *
//  *  Register UI events once Office is ready
//  * ------------------------------------------------------------------ */
// Office.onReady(() => {

//   $('snapshotBtn').addEventListener('click', snapshot);
//   $('readBtn').    addEventListener('click', readById);
//   $('searchBtn').  addEventListener('click', searchKeyword);
//   $('editBtn').    addEventListener('click', editParagraph);

//   $('wsButton').addEventListener('click', () => {
//     if(!client){
//       const secure = location.protocol === 'https:';
//       const proto  = secure ? 'wss' : 'ws';
//       const port   = secure ? 8001   : 8000;
//       client = new WordWebSocketClient(`${proto}://localhost:${port}/ws/word`);
//     }
//     client.connect();
//   });

// });
