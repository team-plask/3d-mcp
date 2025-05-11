import { v4 as uuid } from 'uuid';
import * as svc from './service';

type Req = { kind:'req'; id:string; action:string; params:any };
type Res = { kind:'res'; id:string; action:string; ok:boolean; data?:any; err?:string };

export class RpcWebSocket {
  private ws: WebSocket | null = null;
  readonly id = uuid();                   // add‑in 고유 ID

  constructor(private url: string, private app = 'word') {}

  /* 외부에서 필요하면 콜백 갈아끼우세요 */
  onOpen    = ()           => {};
  onClose   = ()           => {};
  onError   = (_:any)      => {};
  onMessage = (_:Res)      => {};

  /* ------------------------------------------------------------------ */
  connect() {
    this.ws = new WebSocket(this.url);

    /* open → init & 테스트 search */
    this.ws.onopen = () => {
      this.onOpen();

      /* 1️⃣ 서버에게 자기 소개 */
      this.sendReq('init', {
        name:         'Word JSON Add‑in',
        version:      '0.1.0',
        description:  'Task‑pane add‑in exposing read/search/edit RPC',
        capabilities: ['read','search','edit'],
        requires_ui:  true
      });

      /* 2️⃣ 테스트 검색 */
      this.sendReq('search', { keyword:'소프트웨어' });
    };

    this.ws.onclose = ()  => this.onClose();
    this.ws.onerror = err => this.onError(err);

    /* 모든 ‑‑> 애드‑인 수신 */
    this.ws.onmessage = async ev => {
      let m: Req | Res;
      try { m = JSON.parse(ev.data as string); } catch { return; }

      /* ① 서버 → add‑in 응답 → UI 에 그대로 전달 */
      if (m.kind === 'res') {
        this.onMessage(m);
        return;
      }

      /* ② 서버 → add‑in 요청 처리 */
      if (m.kind !== 'req') return;

      try {
        switch (m.action) {
          case 'read': {
            const blk = await svc.readBlockById(m.params.blockId);
            this.sendRes('read',  true, blk);
            break;
          }
          case 'search': {
            const hits = await svc.searchBlocks(m.params.keyword);
            this.sendRes('search', true, hits);
            break;
          }
          case 'edit': {
            const ok = await svc.editBlockParagraph(
              m.params.blockId, m.params.content);
            this.sendRes('edit', ok, undefined,
                         ok ? undefined : 'not paragraph / not found');
            break;
          }
          default:
            this.sendRes(m.action, false, undefined, 'unknown action');
        }
      } catch (e:any) {
        this.sendRes(m.action, false, undefined, e.message||String(e));
      }
    };
  }

  /* ------------------------------------------------------------------ */
  sendReq(action:string, params:any={}) {
    this.raw({ kind:'req', id:this.id, action, params });
  }
  private sendRes(action:string, ok:boolean, data?:any, err?:string) {
    this.raw({ kind:'res', id:this.id, action, ok, data, err });
  }
  private raw(o:any) {
    if (this.ws?.readyState === WebSocket.OPEN)
      this.ws.send(JSON.stringify(o));
  }
}
