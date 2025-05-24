import { v4 as uuid } from 'uuid';
import * as svc from './service';
import { updateDocumentStructure } from './document';
import { TRACKED_ELEMENTS } from './converter';

// 메시지 타입 정의
export interface ToolCallRequest {
  kind: 'req';
  id: string;
  type: 'tool_call_request';
  name: string;
  params?: any;
}

export interface ToolResultResponse {
  kind: 'res';
  id: string;
  type: 'tool_result_response';
  name: string;
  result: any;
  error?: string;
}

// 요청 처리 핸들러 정의
const nameToHandler = {
  // 문서 읽기 - 현재 문서의 JSON 구조 반환
  read: async (message: ToolCallRequest): Promise<ToolResultResponse> => {
    try {
      const documentStructure = await updateDocumentStructure();
      return {
        kind: 'res',
        id: message.id,
        type: 'tool_result_response',
        name: message.name,
        result: documentStructure
      };
    } catch (error) {
      console.error("문서 읽기 오류:", error);
      return {
        kind: 'res',
        id: message.id,
        type: 'tool_result_response',
        name: message.name,
        result: null,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  },
  
  // 문서 쓰기 - JSON RFC Merge Patch 적용
  write_doc: async (message: ToolCallRequest): Promise<ToolResultResponse> => {
    try {
      if (!message.params || typeof message.params !== 'object') {
        throw new Error("유효한 패치 데이터가 필요합니다.");
      }
      
      // JSON RFC Merge Patch 적용
      const result = await svc.writeDocContent(message.params);
      
      return {
        kind: 'res',
        id: message.id,
        type: 'tool_result_response',
        name: message.name,
        result: result
      };
    } catch (error) {
      console.error("문서 쓰기 오류:", error);
      return {
        kind: 'res',
        id: message.id,
        type: 'tool_result_response',
        name: message.name,
        result: null,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
};

// 메시지 타입별 처리 핸들러
const typeToHandler = {
  'tool_call_request': async (message: ToolCallRequest, ws: RpcWebSocket) => {
    try {
      // 해당 요청 핸들러 존재 여부 확인
      if (!nameToHandler[message.name]) {
        const errorResponse: ToolResultResponse = {
          kind: 'res',
          id: message.id,
          type: 'tool_result_response',
          name: message.name,
          result: null,
          error: `지원하지 않는 명령: ${message.name}`
        };
        ws.raw(errorResponse);
        return;
      }

      // 해당 핸들러 실행 및 응답 전송
      const response = await nameToHandler[message.name](message);
      ws.raw(response);
    } catch (error) {
      console.error(`메시지 처리 오류(${message.name}):`, error);
      const errorResponse: ToolResultResponse = {
        kind: 'res',
        id: message.id,
        type: 'tool_result_response',
        name: message.name,
        result: null,
        error: error instanceof Error ? error.message : String(error)
      };
      ws.raw(errorResponse);
    }
  }
};

// WebSocket 싱글톤 인스턴스
let wsInstance: RpcWebSocket | null = null;

// RpcWebSocket 클래스 개선
export class RpcWebSocket {
  private ws: WebSocket | null = null;
  private isInitialized = false;
  readonly id = uuid(); // 클라이언트 ID 생성 (서버 요구사항)

  constructor(private url: string, private app = 'word') {
    // 싱글톤 패턴 적용
    if (wsInstance) {
      return wsInstance;
    }
    wsInstance = this;
  }

  onOpen = () => {};
  onClose = () => {};
  onError = (_: any) => {};
  onMessage = (_: any) => {};
  onInitialized = () => {}; // 초기화 완료 이벤트 핸들러 추가

  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("WebSocket 이미 연결됨");
      return;
    }

    this.ws = new WebSocket(this.url);

    this.ws.onopen = async () => {
      console.log("WebSocket 연결 성공");
      this.onOpen();
    
      // 초기화 메시지 준비 및 전송
      try {
        // 문서 스냅샷 가져오기 (기본 옵션: 전체 문서)
        const fullSnapshot = await updateDocumentStructure();
                
        // 서버 요구사항에 맞는 초기화 메시지 전송
        const initMessage = {
          kind: 'req',
          id: this.id, // 클라이언트에서 생성한 고유 ID
          init: {
            name: 'Word JSON Add-in',
            version: '0.1.0',
            description: 'Task-pane add-in exposing read/search/edit RPC',
            capabilities: ['read', 'write_doc'],
            requires_ui: true,
            document: fullSnapshot, // 전체 문서 상태
            whitelist: TRACKED_ELEMENTS, // 추적할 요소 목록
            meta: {
              application: this.app,
              clientId: this.id,
              timestamp: new Date().toISOString() // 타임스탬프 추가
            }
          }
        };
        
        this.raw(initMessage);
        console.log("초기화 메시지 전송 완료");
      } catch (error) {
        console.error("초기화 메시지 준비 실패:", error);
      }
    };

    this.ws.onclose = (event) => {
      console.log(`WebSocket 연결 종료: ${event.code} - ${event.reason}`);
      this.isInitialized = false;
      this.onClose();
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket 오류:", error);
      this.onError(error);
    };

    this.ws.onmessage = async (event) => {
      let message;
      try {
        message = JSON.parse(event.data as string);
        console.log("수신된 메시지:", message);
      } catch (error) {
        console.error("잘못된 메시지 형식:", error);
        return;
      }

      // 초기화 응답 처리
      if (message.kind === 'res' && message.init && message.id === this.id) {
        if (message.init.ok) {
          console.log("서버 초기화 성공");
          this.isInitialized = true;
          this.onInitialized();
        } else {
          console.error("서버 초기화 실패:", message.init.err);
        }
        return;
      }

      // 도구 호출 요청 처리
      if (message.type === 'tool_call_request' && message.kind === 'req') {
        if (typeToHandler[message.type]) {
          await typeToHandler[message.type](message, this);
        } else {
          console.warn(`지원하지 않는 메시지 타입: ${message.type}`);
          // 오류 응답 전송
          this.raw({
            kind: 'res',
            id: message.id,
            type: 'tool_result_response',
            name: message.name || 'unknown',
            result: null,
            error: `지원하지 않는 메시지 타입: ${message.type}`
          });
        }
        return;
      }

      // 일반 메시지 처리
      this.onMessage(message);
    };
  }

  // 기존 메서드들을 서버 요구사항에 맞게 조정
  sendReq(action: string, params: unknown = {}): void {
    if (!this.isInitialized && action !== 'init') {
      console.warn("WebSocket이 초기화되지 않았습니다. 요청을 보낼 수 없습니다.");
      return;
    }

    const payload = { 
      kind: 'req', 
      id: this.id, 
      [action]: params 
    };
    this.raw(payload);
  }

  sendRes(action: string, ok: boolean, data?: unknown, err?: string) {
    if (!this.isInitialized) {
      console.warn("WebSocket이 초기화되지 않았습니다. 응답을 보낼 수 없습니다.");
      return;
    }

    const payload = {
      kind: 'res',
      id: this.id,
      [action]: { ok, data, err }
    };
    this.raw(payload);
  }

  // 도구 호출 응답 전송
  sendToolResponse(requestId: string, name: string, result: any, error?: string): void {
    if (!this.isInitialized) {
      console.warn("WebSocket이 초기화되지 않았습니다. 응답을 보낼 수 없습니다.");
      return;
    }

    const response: ToolResultResponse = {
      kind: 'res',
      id: requestId, // 중요: 요청의 ID를 사용해야 함
      type: 'tool_result_response',
      name,
      result,
      error
    };
    this.raw(response);
  }

  raw(obj: object): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const json = JSON.stringify(obj);
      console.log("전송 메시지:", json);
      this.ws.send(json);
    } else {
      console.warn("WebSocket이 연결되지 않았습니다. 메시지를 보낼 수 없습니다.");
    }
  }

  // 연결 상태 확인
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // 연결 종료
  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, "클라이언트에서 연결 종료");
      this.ws = null;
      this.isInitialized = false;
    }
  }
}