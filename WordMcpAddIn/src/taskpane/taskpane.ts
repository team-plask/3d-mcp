import { WebSocketClient } from './ws-client';
import { updateDocumentStructure } from './document';
import { applyDocumentPatch } from './service';
import './taskpane.css';

let wsClient: WebSocketClient | null = null;

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
    wsClient.onOpen = () => {
      updateStatus('Connected');
      enableControls(true);
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
  try {
    const snapshot = await updateDocumentStructure();
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
  
  try {
    await wsClient.syncDocument();
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
  
  const patchTextarea = $('patchTextarea') as HTMLTextAreaElement;
  if (!patchTextarea || !patchTextarea.value.trim()) {
    updateResultDisplay('No patch data provided');
    return;
  }
  
  try {
    // Parse the patch JSON
    const patch = JSON.parse(patchTextarea.value);
    
    // Apply the patch using the WebSocket client
    const result = await wsClient.writeDocument(patch);
    
    updateResultDisplay({
      status: 'Patch applied successfully',
      result
    });
  } catch (error) {
    console.error('Failed to apply patch:', error);
    updateResultDisplay({
      error: 'Failed to apply patch',
      details: error instanceof Error ? error.message : String(error)
    });
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
  
  if (info.host === Office.HostType.Word) {
    // Set up UI and connect
    setupEventListeners();
    connectWebSocket();
  } else {
    const appElement = $('app');
    if (appElement) {
      appElement.innerHTML = `
        <div class="error-container">
          <h2>Unsupported Application</h2>
          <p>This add-in requires Microsoft Word.</p>
        </div>
      `;
    }
  }
});