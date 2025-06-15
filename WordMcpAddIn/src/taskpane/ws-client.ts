import { v4 as uuid } from 'uuid';

// Role definitions
const Roles = ["user", "model", "process"] as const;
type Role = (typeof Roles)[number];

// Part type definition
type PartType = {
  mimeType: string;
  content: string;
};

// Tool definitions
const TOOLS = {
  WRITE_DOC: {
    description: "Write the document. The patch is a JSON Merge Patch to apply to the document.",
    parameters: {
      type: "object",
      properties: {
        document_id: { type: "string" },
        patch: { type: "object" },
      },
      required: ["document_id", "patch"],
    },
  }
} as const;

// Command type definitions
type Command<T extends keyof typeof TOOLS = keyof typeof TOOLS> = {
  ACCEPT: {
    REQUEST: { processId: string; nodeId: string; };
    RESPONSE: {};
  };
  REJECT: {
    REQUEST: { processId: string; nodeId: string; };
    RESPONSE: {};
  };
  HIGHLIGHT: {
    REQUEST: { processId: string; nodeId: string; };
    RESPONSE: {};
  };
  AGENT: {
    REQUEST: {
      mimeType: string;
      history: {
        role: "user" | "model";
        parts: PartType[];
      }[];
      processes: {
        id: string;
        metadata: Record<string, any>;
        document: string;
      }[];
    };
    RESPONSE: {};
  };
  TOOL: {
    REQUEST: {
      name: keyof typeof TOOLS;
      args: Record<string, any>;
    };
    RESPONSE: {
      result: Record<string, any>;
    };
  };
  UPDATE: {
    REQUEST: {
      document: string;
      processId: string;
    };
    RESPONSE: {};
  };
};

// Message type definition
type Message<T extends keyof Command, R extends keyof Command[T]> = {
  role: Role;
  command: T;
  type: R;
  id?: string;
} & Command[T][R] & {
  error?: string;
};

// Command handler type for better type-checking
type CommandHandlers = {
  [K in keyof Command]?: (
    message: Message<K, "REQUEST"> & { id: string }
  ) => Promise<Message<K, "RESPONSE">>;
};

// WebSocket client singleton
let wsInstance: WebSocketClient | null = null;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private isInitialized = false;
  readonly clientId = uuid();
  private processId = uuid();
  private documentId = uuid();
  private pendingRequests = new Map<string, (response: any) => void>();

  // Event callbacks
  onOpen = () => {};
  onClose = () => {};
  onError = (_: any) => {};
  onMessage = (_: any) => {};
  onInitialized = () => {};
  onToolRequest: (toolName: string, args: any) => Promise<any> = async (toolName) => {
    // 이 핸들러가 설정되지 않았을 경우를 대비한 기본 에러 처리
    throw new Error(`onToolRequest handler not implemented for tool: ${toolName}`);
  };

  constructor(private url: string) {
    if (wsInstance) return wsInstance;
    wsInstance = this;
  }

  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = async () => {
          console.log("WebSocket connection established");
          this.onOpen();
          
          // try {
          //   await this.syncDocument();
          //   resolve();
          // } catch (error) {
          //   console.error("Failed to initialize with document:", error);
          //   reject(error);
          // }
        };

        this.ws.onclose = (event) => {
          console.log(`WebSocket connection closed: ${event.code} - ${event.reason}`);
          this.isInitialized = false;
          this.onClose();
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          this.onError(error);
          reject(error);
        };

        this.ws.onmessage = this.handleMessage.bind(this);
      } catch (error) {
        console.error("Failed to connect WebSocket:", error);
        reject(error);
      }
    });
  }

  async syncDocument(documentStructure: any, host: Office.HostType): Promise<void> {
    try {
      // 이제 이 메서드는 외부로부터 받은 데이터를 서버에 전송만 합니다.
      const result = await this.send<"UPDATE">({
        role: "process",
        command: "UPDATE",
        type: "REQUEST",
        document: JSON.stringify(documentStructure),
        processId: this.processId,
        // @ts-ignore - 서버에서 이 필드를 사용하도록 메시지 타입 확장 필요
        host: host, 
      });
      
      if (result.error) {
        console.error("Document synchronization failed:", result.error);
      } else {
        console.log("Document synchronization successful");
        this.isInitialized = true;
        this.onInitialized();
      }
    } catch (error) { /* ... */ }
  }

  private async handleMessage(event: MessageEvent): Promise<void> {
    try {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);

      // Handle pending responses
      if (message.id && this.pendingRequests.has(message.id)) {
        const resolver = this.pendingRequests.get(message.id)!;
        this.pendingRequests.delete(message.id);
        resolver(message);
        return;
      }

      // Process incoming requests
      if (message.type === "REQUEST") {
        await this.handleRequest(message);
      }

      // Forward to general handler
      this.onMessage(message);
    } catch (error) {
      console.error("Error handling message:", error);
    }
  }

  private async handleRequest(message: Message<keyof Command, "REQUEST"> & { id: string }): Promise<void> {
    try {
      const { command, id } = message;
      let response: any = {
        role: "process",
        command,
        type: "RESPONSE",
        id
      };

      // Use a command-to-handler map similar to the simpler example
      const commandHandlers: Record<keyof Command, Function> = {
        TOOL: async () => this.handleToolRequest(message as Message<"TOOL", "REQUEST"> & { id: string }),
        UPDATE: async () => ({ ...response, result: { success: true } }),
        ACCEPT: async () => ({ ...response, result: { success: true } }),
        REJECT: async () => ({ ...response, result: { success: true } }),
        HIGHLIGHT: async () => ({ ...response, result: { success: true } }),
        AGENT: async () => ({ ...response, result: { processed: true } })
      };

      const handler = commandHandlers[command];
      if (handler) {
        response = await handler();
      } else {
        response.error = `Unsupported command: ${command}`;
      }

      // Send response
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(response));
      }
    } catch (error) {
      console.error(`Error handling request:`, error);
      
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          role: "process",
          command: message.command,
          type: "RESPONSE",
          id: message.id,
          error: error instanceof Error ? error.message : String(error)
        }));
      }
    }
  }

  private async handleToolRequest(message: Message<"TOOL", "REQUEST"> & { id: string }): Promise<Message<"TOOL", "RESPONSE"> & { id: string }> {
    const { name, args, id } = message;
    
    try {
      // CHANGED: 내부에서 직접 처리하는 대신 onToolRequest 콜백을 호출
      console.log(`Delegating tool request '${name}' to external handler.`);
      const result = await this.onToolRequest(name, args);
      
      return {
        role: "process",
        command: "TOOL",
        type: "RESPONSE",
        id,
        result: { success: true, data: result }
      };
    } catch (error) {
      console.error(`Error in external handler for ${name} tool:`, error);
      return {
        role: "process",
        command: "TOOL",
        type: "RESPONSE",
        id,
        result: { success: false, error: error instanceof Error ? error.message : String(error) }
      };
    }
  }
  
  // Also update the writeDocument method to be consistent
  async writeDocument(patch: Record<string, any>): Promise<any> {
    const response = await this.send<"TOOL">({
      role: "process",
      command: "TOOL",
      type: "REQUEST",
      name: "WRITE_DOC", // This stays uppercase in our request
      args: {
        document_id: this.documentId,
        patch
      }
    });
  
    if (response.error) {
      throw new Error(`Failed to write document: ${response.error}`);
    }
  
    return response.result;
  }

  async send<T extends keyof Command>(
    message: Message<T, "REQUEST">,
    timeout: number = 10000
  ): Promise<Message<T, "RESPONSE">> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return { error: "WebSocket not connected" } as Message<T, "RESPONSE">;
    }

    const id = uuid();
    const messageWithId = { ...message, id };

    console.log("Sending message:", messageWithId);
    this.ws.send(JSON.stringify(messageWithId));

    return new Promise<Message<T, "RESPONSE">>((resolve) => {
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(id);
        resolve({ error: "Request timeout" } as Message<T, "RESPONSE">);
      }, timeout);

      this.pendingRequests.set(id, (response: Message<T, "RESPONSE">) => {
        clearTimeout(timeoutId);
        resolve(response);
      });
    });
  }

  // Utility methods
  setProcessId(processId: string): void {
    this.processId = processId;
  }

  setDocumentId(documentId: string): void {
    this.documentId = documentId;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, "Client disconnected");
      this.ws = null;
      this.isInitialized = false;
    }
  }
}

// Simplified message handler utility (similar to the simpler example)
export const messageHandler = (ws: WebSocket) => {
  const pendingRequests = new Map<string, (response: any) => void>();

  const send = async <T extends keyof Command>(
    message: Message<T, "REQUEST">,
    timeout: number = 10000
  ): Promise<Message<T, "RESPONSE">> => {
    const id = uuid();
    ws.send(JSON.stringify({ ...message, id }));

    return new Promise<Message<T, "RESPONSE">>((resolve) => {
      const timeoutId = setTimeout(() => {
        pendingRequests.delete(id);
        resolve({ error: "Timeout" } as Message<T, "RESPONSE">);
      }, timeout);

      // Set up one-time message listener
      const messageListener = (event: MessageEvent) => {
        try {
          const response = JSON.parse(event.data);
          if (response.id === id) {
            clearTimeout(timeoutId);
            ws.removeEventListener("message", messageListener);
            resolve(response);
          }
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      ws.addEventListener("message", messageListener);
    });
  };

  const receive = (handlers: CommandHandlers): void => {
    ws.addEventListener("message", async (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Handler received message:", message);
        
        const handler = handlers[message.command];
        if (handler) {
          const response = await handler(message);
          ws.send(JSON.stringify({ ...response, id: message.id }));
        }
      } catch (error) {
        console.error("Error in message handler:", error);
      }
    });
  };

  return { send, receive };
};