import { RpcWebSocket } from './ws-client';
import {
  snapshot,
  viewElement,
  runSamplePatch,
  applyCustomPatch,
  deleteElement,
  updateParagraph,
  updateRunText,
  loadExamplePatch,
  loadComplexPatchExample
} from './demo';

let rpc: RpcWebSocket | null = null;

// DOM 요소 가져오기 유틸리티 함수
const $ = (id: string) => document.getElementById(id);

// 연결 상태 업데이트
function updateStatus(txt: string, error = false, connecting = false) {
  const status = $('connectionStatus');
  if (status) status.textContent = txt;

  const reconnectPanel = $('reconnectPanel');
  const mainContent = $('mainContent');
  
  if (reconnectPanel) reconnectPanel.style.display = error ? 'block' : 'none';
  if (mainContent) mainContent.style.display = error ? 'none' : 'block';
}

// WebSocket 연결
function connectWS() {
  updateStatus('Connecting to server...', false, true);

  const url = `wss://localhost:8080/ws`;     
  rpc = new RpcWebSocket(url, 'word');

  rpc.onOpen    = () => updateStatus('Connected');
  rpc.onClose   = () => updateStatus('Connection closed', true);
  rpc.onError   = () => updateStatus('Connection error', true);

  rpc.onMessage = res => {
    console.log('↙︎ WS response:', res);
    const result = $('result');
    if (result) {
      result.textContent = typeof res === 'string'
        ? res
        : JSON.stringify(res, null, 2);
    }
  };

  rpc.connect();
}

// 탭 전환 이벤트 설정
function setupTabs() {
  const tabs = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');
      
      // 모든 탭과 컨텐츠 비활성화
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // 선택한 탭과 컨텐츠 활성화
      tab.classList.add('active');
      if (tabId) {
        const contentElement = $(`tab-${tabId}`);
        if (contentElement) {
          contentElement.classList.add('active');
        }
      }
    });
  });
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 연결 관련
  $('reconnectBtn')?.addEventListener('click', connectWS);
  
  // 탭 설정
  setupTabs();
  
  // 읽기 기능
  $('snapshotBtn')?.addEventListener('click', snapshot);
  $('viewElementBtn')?.addEventListener('click', viewElement);
  
  // 편집 기능
  $('deleteElementBtn')?.addEventListener('click', deleteElement);
  $('updateParagraphBtn')?.addEventListener('click', updateParagraph);
  $('updateRunBtn')?.addEventListener('click', updateRunText);
  
  // 패치 기능
  $('samplePatchBtn')?.addEventListener('click', runSamplePatch);
  $('applyPatchBtn')?.addEventListener('click', applyCustomPatch);
  $('loadExampleBtn')?.addEventListener('click', loadExamplePatch);
  $('loadComplexBtn')?.addEventListener('click', loadComplexPatchExample);
}

// Office.js 초기화 완료 시 실행
Office.onReady(info => {
  console.log(`Office.js ready in ${info.host}`);
  
  // UI 초기화
  setupEventListeners();
  
  // WebSocket 연결
  connectWS();
});