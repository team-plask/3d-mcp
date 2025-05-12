import { snapshot, readById, searchKeyword, editParagraph } from './demo';
import { RpcWebSocket } from './ws-client';

const $ = <T extends HTMLElement>(id: string) =>
  document.getElementById(id)! as T;

let rpc: RpcWebSocket | null = null;

function logResult(obj: any) {
  $('result').textContent = JSON.stringify(obj, null, 2);
}

function updateStatus(txt: string, error = false) {
  const s = $('connectionStatus');
  s.textContent = txt;
  s.className   = error ? 'error' : 'success';
  $('mainContent').style.display   = error ? 'none' : 'block';
  $('reconnectPanel').style.display= error ? 'block' : 'none';
}

function connectWS() {
  updateStatus('연결 중…');

  const url = `wss://localhost:8080/ws`;     
  rpc = new RpcWebSocket(url, 'word');

  rpc.onOpen    = () => updateStatus('연결됨');
  rpc.onClose   = () => updateStatus('연결 종료', true);
  rpc.onError   = () => updateStatus('연결 오류', true);

  rpc.onMessage = res => {
    console.log('↙︎  WS response:', res);
    logResult(res);
  };

  rpc.connect();
}

/* ------------------------------------------------------------------ */
Office.onReady(() => {
  $('snapshotBtn').addEventListener('click', snapshot);
  $('readBtn')    .addEventListener('click', readById);
  $('searchBtn')  .addEventListener('click', searchKeyword);
  $('editBtn')    .addEventListener('click', editParagraph);

  $('wsButton')   .addEventListener('click', connectWS);
  $('reconnectBtn').addEventListener('click', connectWS);

  connectWS();    
});
