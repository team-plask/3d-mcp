import { snapshot, readById, searchKeyword, editParagraph } from './demo';
import { RpcWebSocket } from './ws-client';

const $ = <T extends HTMLElement>(id: string) =>
  document.getElementById(id)! as T;

let rpc: RpcWebSocket | null = null;

function logResult(obj: any) {
  $('result').textContent = JSON.stringify(obj, null, 2);
}

function updateStatus(txt: string, error = false, connecting = false) {
  const s = $('connectionStatus');
  s.textContent = txt;

  // 상태 클래스 초기화
  s.classList.remove('connecting', 'connected', 'disconnected');

  if (connecting) {
    s.classList.add('connecting');
  } else if (error) {
    s.classList.add('disconnected');
  } else {
    s.classList.add('connected');
  }

  $('mainContent').style.display = error ? 'none' : 'block';
  $('reconnectPanel').style.display = error ? 'block' : 'none';
}


function connectWS() {
  updateStatus('연결 중…');

  const url = `wss://localhost:8080/ws`;     
  rpc = new RpcWebSocket(url, 'word');

  rpc.onOpen    = () => updateStatus('Connected');
  rpc.onClose   = () => updateStatus('Connection closed', true);
  rpc.onError   = () => updateStatus('Connection error', true);

  rpc.onMessage = res => {
    console.log('↙︎  WS response:', res);
    logResult(res);
  };

  rpc.connect();
}

// taskpane.ts에서 수정
Office.onReady((info) => {
  console.log('Office.onReady fired with host:', info.host);
  
  // 초기 UI 상태 처리
  updateStatus('Office.js 초기화 됨', false);
  
  // WebSocket 연결 시도 전에 지연시간 추가
  setTimeout(() => {
    try {
      // 이벤트 리스너 등록
      $('readBtn')?.addEventListener('click', readById);
      $('searchBtn')?.addEventListener('click', searchKeyword);
      $('editBtn')?.addEventListener('click', editParagraph);
      $('reconnectBtn')?.addEventListener('click', connectWS);
      
      // WebSocket 연결
      connectWS();
    } catch (error) {
      console.error('Error during initialization:', error);
      updateStatus('초기화 실패: ' + error.message, true);
    }
  }, 1000); // 1초 지연
});