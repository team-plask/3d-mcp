// src/taskpane/demo.ts
import {
    readBlockById,
    searchBlocks,
    editBlockParagraph
  } from './service';
  
  const $ = (id:string) => document.getElementById(id)!;
  const log = (msg:any) => {
    $('result')!.textContent = typeof msg === 'string'
      ? msg
      : JSON.stringify(msg, null, 2);
  };
  
  export async function snapshot(): Promise<void> {
    // you can still keep your appendBlocks demo here
    log('Snapshot done (see console)');
  }
  
  export async function readById(): Promise<void> {
    const id = ( $('readId') as HTMLInputElement ).value.trim();
    const blk = await readBlockById(id);
    log(blk ?? `❓ block "${id}" not found`);
  }
  
  export async function searchKeyword(): Promise<void> {
    const kw = ( $('searchKw') as HTMLInputElement ).value.trim();
    if (!kw) return log('🔍 enter keyword');
    const hits = await searchBlocks(kw);
    log(hits.length ? hits : '🔍 no match');
  }
  
  export async function editParagraph(): Promise<void> {
    const id  = ( $('editId')  as HTMLInputElement ).value.trim();
    const txt = ( $('editTxt') as HTMLInputElement ).value;
    const ok = await editBlockParagraph(id, txt);
    if (ok) log(`✅ paragraph "${id}" replaced!`);
    else  log(`❌ failed to edit "${id}" (not found or not a paragraph)`);
  }
  