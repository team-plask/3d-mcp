// mcp_server_merged.ts (파일명 변경 제안)
import { FastMCP } from "fastmcp";
import { z } from "zod";
import https from "https"; // WSS를 위한 https 모듈
import fs from "fs";      // 파일 시스템 접근 (인증서 로드)
import path from "path";    // 경로 처리
import os from "os";      // 운영체제 정보 (홈 디렉토리)
import { WebSocketServer, WebSocket } from "ws"; // WebSocket 서버 구현

const MCP_PORT = 8001; // WSS 및 (향후 FastMCP 웹 전송용) 포트

let taskpaneSocket: WebSocket | null = null; // Taskpane WebSocket 연결 관리

// --- WebSocket Secure (WSS) 서버 설정 ---
try {
  console.log("Setting up WSS server...");
  // Office 개발 인증서 경로 찾기 (macOS 기준) - 환경에 맞게 조정 필요
  const certPath = path.join(os.homedir(), ".office-addin-dev-certs");
  const keyFilePath = path.join(certPath, "localhost.key");
  const certFilePath = path.join(certPath, "localhost.crt");

  if (!fs.existsSync(keyFilePath) || !fs.existsSync(certFilePath)) {
    throw new Error(
      `Office development certificates not found in ${certPath}. Please run 'npx office-addin-dev-certs install'.`
    );
  }
  console.log("Development certificates found.");

  // HTTPS 서버 옵션 설정
  const options = {
    key: fs.readFileSync(keyFilePath),
    cert: fs.readFileSync(certFilePath),
  };

  // HTTPS 서버 생성 (WSS 기반용)
  const httpsServer = https.createServer(options);

  // WebSocket 서버를 HTTPS 서버에 연결
  const wss = new WebSocketServer({ server: httpsServer });
  console.log(`WebSocket Secure server (WSS) listening on wss://localhost:${MCP_PORT}`);

  wss.on("connection", (ws) => {
    console.log("Taskpane connected via WSS");
    if (taskpaneSocket) {
        console.warn("A new taskpane tried to connect while another was already connected. Closing the old one.");
        taskpaneSocket.close(); // 기존 연결이 있다면 닫음 (하나의 연결만 관리)
    }
    taskpaneSocket = ws;

    ws.on("message", (message) => {
      // Taskpane으로부터 메시지를 받을 경우 처리 (현재는 로그만 출력)
      console.log(`Received message from taskpane: ${message.toString()}`);
    });

    ws.on("close", () => {
      console.log("Taskpane disconnected");
      if (taskpaneSocket === ws) { // 현재 연결된 소켓이 맞는지 확인 후 null 처리
         taskpaneSocket = null;
      }
    });

    ws.on("error", (error) => {
      console.error("Taskpane WebSocket error:", error);
      if (taskpaneSocket === ws) { // 현재 연결된 소켓이 맞는지 확인 후 null 처리
         taskpaneSocket = null;
      }
    });
  });

  // HTTPS 서버 리스닝 시작 (WebSocket 용)
  httpsServer.listen(MCP_PORT, () => {
      console.log(`HTTPS server for WSS started on port ${MCP_PORT}`);
  });

} catch (error: any) {
  console.error("Failed to start HTTPS/WSS server:", error.message);
  process.exit(1); // 서버 시작 실패 시 종료
}


// --- FastMCP 서버 설정 ---

// FastMCP 서버 인스턴스 생성
const mcpServer = new FastMCP({
  name: "PowerPoint Controller (Integrated)",
  version: "1.1.0", // 버전 업데이트
  description: "Controls PowerPoint via direct WebSocket connection from Office Add-in.",
});

// 'insertText' MCP Tool 정의
mcpServer.addTool({
  name: "insertText",
  description: "Inserts text into the current PowerPoint slide via WebSocket.",
  parameters: z.object({
    text: z.string().describe("The text content to insert."),
  }),
  execute: async (params) => {
    console.log(`Executing insertText with params:`, params);
    if (!taskpaneSocket) {
      console.error("Taskpane is not connected. Cannot send command.");
      return { error: "Taskpane not connected" }; // MCP 클라이언트에 오류 전달
    }
    try {
      // 직접 WebSocket으로 명령 전송
      taskpaneSocket.send(JSON.stringify({ tool: "insertText", params: { text: params.text } }));
      console.log("Command 'insertText' sent to taskpane via WebSocket.");
      return { result: "Command sent to taskpane via WebSocket." }; // 성공 메시지 반환
    } catch (error: any) {
      console.error("Error sending command via WebSocket:", error);
      return { error: error.message || "Failed to send command via WebSocket." };
    }
  },
});

// 'insertImage' MCP Tool 정의
mcpServer.addTool({
  name: "insertImage",
  description: "Inserts an image (from base64 data) into the current PowerPoint slide via WebSocket.",
  parameters: z.object({
    base64Image: z.string().describe("Base64 encoded image data."),
  }),
  execute: async (params) => {
    console.log(`Executing insertImage...`);
     if (!taskpaneSocket) {
      console.error("Taskpane is not connected. Cannot send command.");
      return { error: "Taskpane not connected" }; // MCP 클라이언트에 오류 전달
    }
    try {
       // 직접 WebSocket으로 명령 전송
      taskpaneSocket.send(JSON.stringify({ tool: "insertImage", params: { base64Image: params.base64Image } }));
      console.log("Command 'insertImage' sent to taskpane via WebSocket.");
      return { result: "Command sent to taskpane via WebSocket." }; // 성공 메시지 반환
    } catch (error: any) {
      console.error("Error sending command via WebSocket:", error);
      return { error: error.message || "Failed to send command via WebSocket." };
    }
  },
});

// 'proposeMergePatch' MCP Tool 정의
mcpServer.addTool({
  name: "proposeMergePatch",
  description: "Receives a JSON Merge Patch and forwards it to the Word Add-in to propose changes.",
  parameters: z.object({
    // JSON Merge Patch는 복잡한 객체일 수 있으므로, 여기서는 일단 'any' 타입으로 받거나
    // z.record(z.any()) 또는 더 구체적인 스키마를 정의할 수 있습니다.
    // 실제로는 JSON 문자열로 받아 Add-in에서 파싱하는 것이 더 안정적일 수 있습니다.
    patch: z.record(z.any()).describe("The JSON Merge Patch object (RFC 7396)."),
    // patchTarget: z.string().optional().describe("Optional identifier for the target content (e.g., 'paragraph:123', 'body'). Defaults to 'body'."), // 어떤 콘텐츠를 패치할지 식별자 추가 고려
  }),
  execute: async (params) => {
    console.log(`Executing proposeMergePatch with patch:`, params.patch);
    if (!taskpaneSocket) {
      console.error("Taskpane is not connected. Cannot forward patch.");
      return { error: "Taskpane not connected" };
    }
    try {
      // 받은 patch 데이터를 그대로 Add-in으로 전송
      taskpaneSocket.send(JSON.stringify({
        tool: "proposeMergePatch", // Add-in이 식별할 명령 이름
        params: {
          patch: params.patch,
          // patchTarget: params.patchTarget // 타겟 정보도 전달
        }
      }));
      console.log("Patch forwarded to taskpane via WebSocket.");
      // 서버는 전달만 하므로, 성공/실패 여부는 Add-in에서 판단 후 필요시 서버로 다시 알릴 수 있음
      return { result: "Patch proposal forwarded to Word Add-in." };
    } catch (error: any) {
      console.error("Error forwarding patch via WebSocket:", error);
      return { error: error.message || "Failed to forward patch via WebSocket." };
    }
  },
});



// MCP 서버 시작 (표준 입출력 사용 - WSS 서버와 독립적으로 실행됨)
mcpServer.start({
  transportType: "stdio",
}).then(() => {
    console.log("FastMCP server started using stdio transport.");
}).catch((error) => {
    console.error("Failed to start FastMCP server:", error);
});

console.log("Integrated MCP Server setup complete. Waiting for Taskpane connection and MCP commands...");
