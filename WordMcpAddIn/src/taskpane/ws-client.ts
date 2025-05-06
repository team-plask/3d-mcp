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
    | { type: 'readResponse';  id: string;          payload: any }
    | { type: 'searchResponse'; keyword: string;    hits: any[] }
    | { type: 'editResponse';  id: string;          success: boolean; err?:string }
    | { type: 'error';         err: string };
  
  export class WordWebSocketClient {
    private ws: WebSocket|null = null;
    constructor(private url: string) {}
  
    public connect() {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => {
        // handshake
        this.send({ type: 'initResponse', success: true });
      };
      this.ws.onmessage = async ev => {
        let msg: WSIn;
        try { msg = JSON.parse(ev.data); }
        catch { return this.send({ type:'error', err:'invalid JSON' }); }
  
        try {
          switch (msg.type) {
            case 'readRequest': {
              const blk = await readBlockById(msg.id);
              this.send({ type:'readResponse', id: msg.id, payload: blk });
              break;
            }
            case 'searchRequest': {
              const hits = await searchBlocks(msg.keyword);
              this.send({ type:'searchResponse', keyword: msg.keyword, hits });
              break;
            }
            case 'editRequest': {
              const ok = await editBlockParagraph(msg.id, msg.content);
              this.send({
                type: 'editResponse',
                id: msg.id,
                success: ok,
                ...(ok ? {} : { err: 'not found or not paragraph' })
              });
              break;
            }
            default:
              this.send({ type:'error', err:`unknown type ${msg.type}` });
          }
        } catch (e:any) {
          this.send({ type:'error', err: e.message||e.toString() });
        }
      };
      this.ws.onerror = e => console.error('WS error:', e);
      this.ws.onclose = () => console.log('WS closed');
    }
  
    private send(msg: WSOut) {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(msg));
      } else {
        console.warn('WS not open, skipping send', msg);
      }
    }
  
    public disconnect() {
      this.ws?.close();
      this.ws = null;
    }
  }
  