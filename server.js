import { WebSocketServer } from "ws";
import https from "https"; // 변경: http -> https
import http from "http"; // 추가: 외부 요청용 HTTP 서버
import fs from "fs"; // 파일 시스템 모듈 추가
import path from "path"; // 경로 모듈 추가
import os from "os"; // 운영체제 정보 모듈 추가
import url from "url";

const PORT = 8001; // WebSocket 및 HTTPS 포트
const EXTERNAL_PORT = 8000; // 외부 요청 받을 HTTP 포트 (이 부분은 HTTP로 유지 가능)

let taskpaneSocket = null;

// --- HTTPS/WSS 서버 설정 ---
try {
  // Office 개발 인증서 경로 찾기 (macOS 기준)
  const certPath = path.join(os.homedir(), ".office-addin-dev-certs");
  const keyFilePath = path.join(certPath, "localhost.key");
  const certFilePath = path.join(certPath, "localhost.crt");

  if (!fs.existsSync(keyFilePath) || !fs.existsSync(certFilePath)) {
     throw new Error(`Office development certificates not found in ${certPath}. Please run 'npx office-addin-dev-certs install'.`);
  }

  // HTTPS 서버 옵션 설정
  const options = {
    key: fs.readFileSync(keyFilePath),
    cert: fs.readFileSync(certFilePath),
  };

  // HTTPS 서버 생성
  const httpsServer = https.createServer(options);

  // WebSocket 서버를 HTTPS 서버에 연결
  const wss = new WebSocketServer({ server: httpsServer }); // 변경: port -> server
  console.log(`WebSocket Secure server (WSS) listening on wss://localhost:${PORT}`);

  wss.on("connection", (ws) => {
    console.log("Taskpane connected via WSS"); // 로그 메시지 변경
    taskpaneSocket = ws;

    ws.on("message", (message) => {
      console.log(`Received message from taskpane: ${message.toString()}`);
    });

    ws.on("close", () => {
      console.log("Taskpane disconnected");
      taskpaneSocket = null;
    });

    ws.on("error", (error) => {
      console.error("Taskpane WebSocket error:", error);
      taskpaneSocket = null;
    });
  });

  // HTTPS 서버 리스닝 시작 (WebSocket 용)
  httpsServer.listen(PORT);

} catch (error) {
   console.error("Failed to start HTTPS/WSS server:", error.message);
   // HTTPS 서버 시작 실패 시 프로세스 종료 또는 다른 처리
   process.exit(1);
}


// --- 외부 요청 처리용 HTTP 서버 (기존과 동일, 다른 포트 사용) ---
const externalServer = http.createServer((req, res) => { // http 모듈 유지
  const reqUrl = url.parse(req.url).pathname;
  let body = "";

  req.on("data", (chunk) => { body += chunk.toString(); });

  req.on("end", async () => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === "POST" && reqUrl === "/execute") {
      console.log(`Received external HTTP request: ${body}`);
      try {
        const requestData = JSON.parse(body);
        const tool = requestData.tool;
        const params = requestData.params || {};

        if (!taskpaneSocket) {
          console.error("Taskpane is not connected.");
          res.writeHead(503, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, error: "Taskpane not connected" }));
          return;
        }

        taskpaneSocket.send(JSON.stringify({ tool, params }));

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: "Command sent to taskpane" }));

      } catch (error) {
        console.error("Error processing external request:", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: error.message || "Invalid JSON format" }));
      }
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Endpoint not found. Use POST /execute" }));
    }
  });
});

externalServer.listen(EXTERNAL_PORT, () => {
  console.log(`External HTTP server listening on http://localhost:${EXTERNAL_PORT}`);
});

console.log("Server setup complete.");