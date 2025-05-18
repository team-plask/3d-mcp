import { v4 as uuid }                     from 'uuid';
import * as svc                           from './service';
import { updateDocumentStructure }    from './document';

type Action = 'init' | 'read' | 'search' | 'edit';

type BaseMsg = { kind: 'req' | 'res'; id: string };

export type Req = BaseMsg & { kind: 'req' } &
  { [K in Action]?: any };

export type ResPayload = { ok: boolean; data?: any; err?: string };
export type Res = BaseMsg & { kind: 'res' } &
  { [K in Action]?: ResPayload };

const META_KEYS = new Set(['kind', 'id'] as const);
function getAction(obj: Req | Res): Action | undefined {
  for (const k of Object.keys(obj))
    if (!META_KEYS.has(k as any)) return k as Action;
}

export class RpcWebSocket {
  private ws: WebSocket | null = null;
  readonly id = uuid();               

  constructor(private url: string, private app = 'word') {}

  onOpen    = ()        => {};
  onClose   = ()        => {};
  onError   = (_: any)  => {};
  onMessage = (_: Res)  => {};

  async connect(): Promise<void> {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = async () => {
      this.onOpen();

      let snapshot: unknown = [];
      try { snapshot = await updateDocumentStructure(); }
      catch { }

      this.sendReq('init', {
        name:         'Word JSON Add-in',
        version:      '0.1.0',
        description:  'Task-pane add-in exposing read/search/edit RPC',
        capabilities: ['read', 'search', 'edit'],
        requires_ui:  true,
        document:     snapshot
      });

      this.sendReq('search', { keyword: 'ff' });
    };

    this.ws.onclose = ()  => this.onClose();
    this.ws.onerror = e   => this.onError(e);

    this.ws.onmessage = async ev => {
      let msg: Req | Res;
      try { msg = JSON.parse(ev.data as string); } catch { return; }

      const act = getAction(msg);
      if (!act) return;

      if (msg.kind === 'res') {
        this.onMessage(msg as Res);
        return;
      }

      const req = msg as Req;
      try {
        switch (act) {
          case 'read': {
            const blk = await svc.readBlockById(req.read.blockId);
            this.sendRes('read', true, blk);
            break;
          }
          case 'search': {
            const hits = await svc.searchBlocks(req.search.keyword);
            this.sendRes('search', true, hits);
            break;
          }
          case 'edit': {
            const ok = await svc.editBlockParagraph(
              req.edit.blockId,
              req.edit.content
            );
            this.sendRes(
              'edit',
              ok,
              undefined,
              ok ? undefined : 'not paragraph / not found'
            );
            break;
          }
          default:
            this.sendRes(act, false, undefined, 'unknown action');
        }
      } catch (e: any) {
        this.sendRes(act, false, undefined, e?.message ?? String(e));
      }
    };
  }

  sendReq(action: Action, params: unknown = {}): void {
    const payload: Req = { kind: 'req', id: this.id, [action]: params };
    this.raw(payload);
  }

  private sendRes(action: Action, ok: boolean, data?: unknown, err?: string) {
    const payload: Res = {
      kind: 'res',
      id:   this.id,
      [action]: { ok, data, err }
    } as Res;
    this.raw(payload);
  }

  private raw(obj: object): void {
    if (this.ws?.readyState === WebSocket.OPEN)
      this.ws.send(JSON.stringify(obj));
  }
}
