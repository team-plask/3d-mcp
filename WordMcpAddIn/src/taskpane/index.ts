// src/taskpane/index.ts
import { snapshot, readById, searchKeyword, editParagraph } from './demo';
import { WordWebSocketClient } from './ws-client';

const $ = (id:string)=>document.getElementById(id)!;
let wsClient: WordWebSocketClient | null = null;

// 웹소켓 연결 상태를 UI에 표시하는 함수
function updateConnectionStatus(status: string, isError: boolean = false) {
  const statusElement = $('connectionStatus');
  statusElement.textContent = status;
  statusElement.className = isError ? 'error' : 'success';
  
  // 연결 성공 시 기본 UI 표시, 실패 시 재시도 UI 표시
  $('mainContent').style.display = isError ? 'none' : 'block';
  $('reconnectPanel').style.display = isError ? 'block' : 'none';
}

// 웹소켓 연결 시도 함수
function connectWebSocket() {
  try {
    updateConnectionStatus('연결 중...', false);
    
    const secure = location.protocol === 'https:';
    const proto = secure ? 'wss' : 'ws';
    const port = secure ? 8081 : 8080;
    
    wsClient = new WordWebSocketClient(`${proto}://localhost:${port}/ws/word`);
    
    // 연결 성공/실패 콜백 등록
    wsClient.onOpen = () => {
      updateConnectionStatus('연결됨', false);
    };
    
    wsClient.onError = (error) => {
      updateConnectionStatus(`연결 실패: ${error}`, true);
    };
    
    wsClient.onClose = () => {
      updateConnectionStatus('연결이 종료되었습니다', true);
    };
    
    wsClient.connect();
  } catch (error) {
    updateConnectionStatus(`연결 오류: ${error}`, true);
  }
}

Office.onReady(() => {
  // 기존 이벤트 리스너 등록
  $('snapshotBtn').addEventListener('click', snapshot);
  $('readBtn').addEventListener('click', readById);
  $('searchBtn').addEventListener('click', searchKeyword);
  $('editBtn').addEventListener('click', editParagraph);

  // 기존 웹소켓 버튼을 수정하여 connectWebSocket 함수 호출
  $('wsButton').addEventListener('click', connectWebSocket);
  
  // 재연결 버튼에 이벤트 리스너 등록
  $('reconnectBtn').addEventListener('click', connectWebSocket);
  
  // 애드인 시작 시 자동으로 웹소켓 연결 시도
  connectWebSocket();
});