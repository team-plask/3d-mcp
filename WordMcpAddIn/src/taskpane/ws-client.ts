// src/taskpane/ws-client.ts
import {
    readBlockById,
    searchBlocks,
    editBlockParagraph
  } from './service';
  
  type WSIn =
    | { type: 'init'; role: string }
    | { type: 'readRequest';   id: string }
    | { type: 'searchRequest'; keyword: string }
    | { type: 'editRequest';   id: string; content: string };
  
  type WSOut =
    | { type: 'initResponse';  success: boolean }
    | { type: 'readResponse';  id: string;       payload: any }
    | { type: 'searchResponse';keyword: string; hits: any[] }
    | { type: 'editResponse';  id: string;       success: boolean; err?: string }
    | { type: 'error';         err: string };
  
  export class WordWebSocketClient {
    private ws: WebSocket | null = null;
    constructor(private url: string) {}
    public onMessage: ((msg: WSOut) => void) | null = null;

    public onOpen: (() => void) | null = null;
    public onError: ((error: any) => void) | null = null;
    public onClose: (() => void) | null = null;
  
    public connect() {
      this.ws = new WebSocket(this.url);
  
      this.ws.onopen = () => {
        console.log('WS open');
        this.onOpen?.();
        this.ws!.send(JSON.stringify({ type: 'init', role: 'addin' }));
      };
  
      this.ws.onmessage = async ev => {
        let raw = ev.data as string;
        let msg: WSIn;
        console.log('WS message', raw);
        try { msg = JSON.parse(raw); }
        catch { 
          this.send({ type:'error', err:'invalid JSON' });
          return;
        }
  
        // ← IMMEDIATELY inform any UI-listener
        //    (we'll forward the typed object, WSOut, after we respond or before)
        //    but for simplicity let's forward the raw untyped object:
        const notify = (o: any) => this.onMessage?.(o);
  
        try {
          switch (msg.type) {
            case 'init':
              this.send({ type:'initResponse', success: true });
              notify({ type:'initResponse', success: true });
              break;
  
            case 'readRequest': {
              const blk = await readBlockById(msg.id);
              const out: WSOut = { type:'readResponse', id: msg.id, payload: blk };
              this.send(out);
              notify(out);
              break;
            }
  
            case 'searchRequest': {
              const hits = await searchBlocks(msg.keyword);
              const out: WSOut = { type:'searchResponse', keyword: msg.keyword, hits };
              this.send(out);
              notify(out);
              break;
            }
  
            case 'editRequest': {
              const ok = await editBlockParagraph(msg.id, msg.content);
              const out: WSOut = {
                type: 'editResponse',
                id: msg.id,
                success: ok,
                ...(ok ? {} : { err: 'not found or not paragraph' })
              };
              this.send(out);
              notify(out);
              break;
            }
  
            default:
              const unknownMsg = msg as { type: string };
              const e: WSOut = { type:'error', err:`unknown type ${unknownMsg.type}` };
              this.send(e);
              notify(e);
          }
        } catch (e: any) {
          const errMsg: WSOut = { type:'error', err: e.message||String(e) };
          this.send(errMsg);
          notify(errMsg);
        }
      };
  
      this.ws.onerror = err => {
        console.error('WS error', err);
        this.onError?.(err);
      };
  
      this.ws.onclose = () => {
        console.log('WS closed');
        this.onClose?.();
      };
    }
  
    private send(msg: WSOut) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(msg));
      } else {
        console.warn('WS not open; skipping send', msg);
      }
    }
  
    public disconnect() {
      this.ws?.close();
      this.ws = null;
    }
  }
  