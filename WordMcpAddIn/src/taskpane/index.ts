// src/taskpane/index.ts
import { snapshot, readById, searchKeyword, editParagraph } from './demo';
import { WordWebSocketClient } from './ws-client';

const $ = <T extends HTMLElement>(id:string)=>document.getElementById(id)! as T;
let wsClient: WordWebSocketClient|null = null;

function updateConnectionStatus(status: string, isError: boolean = false) {
  const s = $('connectionStatus')!;
  s.textContent = status;
  s.className = isError ? 'error' : 'success';
  $('mainContent') .style.display = isError ? 'none' : 'block';
  $('reconnectPanel').style.display = isError ? 'block' : 'none';
}

function connectWebSocket() {
    updateConnectionStatus('연결 중...', false);
  
    const secure = location.protocol==='https:';
    const proto  = secure ? 'wss' : 'ws';
    const port   = 8080;
  
    wsClient = new WordWebSocketClient(`${proto}://localhost:${port}/ws/word`);
  
    wsClient.onOpen  = () => updateConnectionStatus('연결됨', false);
    wsClient.onError = e  => updateConnectionStatus(`연결 실패: ${e}`, true);
    wsClient.onClose = () => updateConnectionStatus('연결 종료', true);
  
    // ← HERE: bind incoming messages to your UI logger
    wsClient.onMessage = (msg) => {
      console.log('→ UI got msg:', msg);
      displayResult(msg);
    };
  
    wsClient.connect();
}

function displayResult(obj: any) {
  $('result').textContent = JSON.stringify(obj, null, 2);
}

Office.onReady(() => {
  // 버튼은 기존대로
  $('snapshotBtn') .addEventListener('click', snapshot);
  $('readBtn')     .addEventListener('click', readById);
  $('searchBtn')   .addEventListener('click', searchKeyword);
  $('editBtn')     .addEventListener('click', editParagraph);

  // WS 버튼과 리커넥트
  $('wsButton')    .addEventListener('click', connectWebSocket);
  $('reconnectBtn').addEventListener('click', connectWebSocket);

  // WS 연결된 후
  connectWebSocket();

  // WS 로 받은 메시지는 displayResult 로 찍어보기
  // (WordWebSocketClient 내부에서 UI로 forward 하고 싶으면
  //  onmessage 콜백 추가해서 처리하세요)
});
