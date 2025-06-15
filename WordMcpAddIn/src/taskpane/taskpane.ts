import { WebSocketClient } from './ws-client';
import './taskpane.css';
import { getDocumentAdapter } from './adapters/index';
import { IDocumentAdapter } from './adapters/adapter.interface';

let wsClient: WebSocketClient | null = null;
let docAdapter: IDocumentAdapter | null = null; // 어댑터를 저장할 변수

// DOM utility function
const $ = (id: string): HTMLElement | null => document.getElementById(id);

/**
 * Updates the connection status display
 */
function updateStatus(txt: string, error = false, connecting = false): void {
  const status = $('connectionStatus');
  if (status) status.textContent = txt;

  const reconnectPanel = $('reconnectPanel');
  const mainContent = $('mainContent');
  
  if (reconnectPanel) reconnectPanel.style.display = error ? 'block' : 'none';
  if (mainContent) mainContent.style.display = error ? 'none' : 'block';
  
  // Update button state while connecting
  const connectButton = $('reconnectBtn') as HTMLButtonElement;
  if (connectButton) {
    connectButton.textContent = connecting ? 'Connecting...' : 'Connect';
    connectButton.disabled = connecting;
  }
}

/**
 * Updates the result display area
 */
function updateResultDisplay(data: any): void {
  const resultElement = $('result');
  if (!resultElement) return;
  
  if (typeof data === 'string') {
    resultElement.textContent = data;
  } else {
    resultElement.textContent = JSON.stringify(data, null, 2);
  }
}

/**
 * Establishes WebSocket connection
 */
async function connectWebSocket(): Promise<void> {
  updateStatus('Connecting to server...', false, true);

  try {
    const url = 'wss://localhost:8080/ws';
    wsClient = new WebSocketClient(url);

    // Set up event handlers
    wsClient.onOpen = async () => { // onOpen을 async로 변경
      updateStatus('Connected');
      enableControls(true);
      await handleSync();
    };
    
    wsClient.onClose = () => {
      updateStatus('Connection closed', true);
      enableControls(false);
    };
    
    wsClient.onError = (error) => {
      console.error('WebSocket error:', error);
      updateStatus('Connection error', true);
      enableControls(false);
    };
    
    wsClient.onMessage = (message) => {
      console.log('Received message:', message);
      updateResultDisplay(message);
    };
    
    wsClient.onInitialized = () => {
      updateStatus('Connected and document synchronized');
    };

    wsClient.onToolRequest = async (toolName, args) => {
      console.log(`Received tool request from server: ${toolName}`, args);
      if (toolName.toUpperCase() === 'WRITE_DOC') {
        if (!docAdapter) throw new Error("Adapter not ready");
        // 어댑터를 통해 문서에 패치를 적용합니다.
        await docAdapter.applyDocumentPatch(args.patch);
        // 성공적으로 완료되었음을 알리는 결과를 반환할 수 있습니다.
        return { status: "ok" };
      }
      throw new Error(`Unsupported tool requested: ${toolName}`);
    };

    // Connect to the server
    await wsClient.connect();
  } catch (error) {
    console.error('Connection failed:', error);
    updateStatus('Failed to connect', true);
  }
}

/**
 * Enable/disable UI controls based on connection state
 */
function enableControls(enabled: boolean): void {
  const controls = [
    'snapshotBtn', 
    'syncBtn',
    'patchTextarea',
    'applyPatchBtn',
    'clearPatchBtn',
    'sampleBtn'
  ];
  
  controls.forEach(id => {
    const element = $(id) as HTMLButtonElement | HTMLTextAreaElement;
    if (element) {
      element.disabled = !enabled;
    }
  });
}

/**
 * Handles document snapshot retrieval
 */
async function handleSnapshot(): Promise<void> {
  // CHANGED: docAdapter를 사용하여 스냅샷 가져오기
  if (!docAdapter) {
    console.error("Document Adapter is not initialized.");
    return;
  }

  try {
    const snapshot = await docAdapter.getDocumentSnapshot(); // 어댑터의 메서드 호출
    updateResultDisplay(snapshot);
  } catch (error) {
    console.error('Failed to get document snapshot:', error);
    updateResultDisplay({
      error: 'Failed to get document snapshot',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * Handles document synchronization
 */
async function handleSync(): Promise<void> {
  if (!wsClient || !wsClient.isConnected()) {
    updateResultDisplay('WebSocket not connected');
    return;
  }
  if (!docAdapter) {
    console.error("Document Adapter is not initialized.");
    return;
  }

  try {
    const snapshot = await docAdapter.getDocumentSnapshot();
    await wsClient.syncDocument(snapshot, Office.context.host); 
    updateResultDisplay({ status: 'Document synchronized successfully' });
  } catch (error) {
    console.error('Sync failed:', error);
    updateResultDisplay({
      error: 'Document synchronization failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * Applies a document patch
 */
async function handleApplyPatch(): Promise<void> {
  if (!wsClient || !wsClient.isConnected()) {
    updateResultDisplay('WebSocket not connected');
    return;
  }

  const patchTextarea = $('patchTextarea') as HTMLTextAreaElement | null;
  if (!patchTextarea || !patchTextarea.value.trim()) {
    updateResultDisplay({ warning: 'No patch data provided in textarea.' });
    return;
  }
  const patchText = patchTextarea.value.trim(); // Get the text

  updateResultDisplay('⏳ Applying patch...');
  console.log("[DEBUG] Text to be parsed by JSON.parse():", patchText); // <--- ADD THIS LINE

  try {
    const mergePatchData: Record<string, any | null> = JSON.parse(patchText); // This is line 165 (or around it)

    if (Object.keys(mergePatchData).length === 0) {
        updateResultDisplay({ info: 'No changes to apply (empty patch object).' });
        return;
    }

    await docAdapter?.applyDocumentPatch(mergePatchData); // Use the adapter to apply the patch
    updateResultDisplay({
      status: 'Local document patch applied successfully.',
      message: 'Document has been updated. Consider syncing with server if applicable.'
    });
      if (wsClient) {
        console.log("Patch applied locally, attempting to sync with server...");
        await handleSync(); 
      } else {
        console.warn("WebSocket not connected or initialized; server sync skipped after local patch.");
      }

  } catch (error) {
    console.error('Failed to parse or apply patch:', error);
    // If it's a JSON.parse error, the raw text will be logged above
    if (error instanceof SyntaxError && error.message.includes("JSON Parse error")) {
         updateResultDisplay({
           error: 'Failed to apply patch: Invalid JSON format.',
           details: `Error: ${error.message}. Problematic text logged in console.`,
           attemptedText: patchText // Show the problematic text in UI if desired (can be long)
         });
    } else {
        updateResultDisplay({
          error: 'Failed to apply patch',
          details: error instanceof Error ? error.message : String(error)
        });
    }
  }
}

/**
 * Clears the patch textarea
 */
function handleClearPatch(): void {
  const patchTextarea = $('patchTextarea') as HTMLTextAreaElement;
  if (patchTextarea) {
    patchTextarea.value = '';
  }
}

/**
 * Loads a sample patch
 */
function handleLoadSample(): void {
  const samplePatch = {
    "p_sample123": {
      "type": "w:p",
      "category": "structure",
      "attributes": null,
      "order": "a7",
      "r_sample456": {
        "type": "w:r",
        "category": "structure",
        "attributes": {
          "text": "✅ This is sample text inserted by the add-in."
        },
        "order": "a0"
      }
    }
  };
  
  const patchTextarea = $('patchTextarea') as HTMLTextAreaElement;
  if (patchTextarea) {
    patchTextarea.value = JSON.stringify(samplePatch, null, 2);
  }
}

/**
 * Sets up event listeners
 */
function setupEventListeners(): void {
  // Connection
  $('reconnectBtn')?.addEventListener('click', connectWebSocket);
  
  // Document operations
  $('snapshotBtn')?.addEventListener('click', handleSnapshot);
  $('syncBtn')?.addEventListener('click', handleSync);
  
  // Patch operations
  $('applyPatchBtn')?.addEventListener('click', handleApplyPatch);
  $('clearPatchBtn')?.addEventListener('click', handleClearPatch);
  $('sampleBtn')?.addEventListener('click', handleLoadSample);
  
  // Initially disable controls
  enableControls(false);
}

// Office.js initialization
Office.onReady(info => {
  console.log(`Office.js initialized in ${info.host}`);
  
  // 1. 호스트에 맞는 어댑터 가져오기
  docAdapter = getDocumentAdapter(info.host);
  console.log(`Document adapter created for host: ${info.host}`, docAdapter);
  if (docAdapter) {
    // 어댑터가 성공적으로 생성되면 UI 설정 및 웹소켓 연결
    setupEventListeners();
    connectWebSocket();
  } else {
    // 2. 지원하지 않는 호스트에 대한 에러 처리
    const appElement = $('app');
    if (appElement) {
      appElement.innerHTML = `
        <div class="error-container">
          <h2>Unsupported Application</h2>
          <p>This add-in currently supports Word, Excel, and PowerPoint.</p>
        </div>
      `;
    }
  }
});