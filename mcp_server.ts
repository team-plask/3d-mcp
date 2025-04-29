    // mcp_server.ts
    import { FastMCP } from "fastmcp";
    import http from "http"; // Node.js 내장 http 모듈 사용
    import { z } from "zod"; // zod 임포트 추가

    const BRIDGE_SERVER_URL = "http://localhost:8000/execute"; // 기존 server.js의 HTTP 엔드포인트

    // HTTP POST 요청을 보내는 헬퍼 함수 (변경 없음)
    function sendCommandToBridge(toolName: string, params: Record<string, any>): Promise<string> {
      return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
          tool: toolName,
          params: params,
        });

        const options = {
          hostname: "localhost",
          port: 8000,
          path: "/execute",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData),
          },
        };

        const req = http.request(options, (res) => {
          let responseBody = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            responseBody += chunk;
          });
          res.on("end", () => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              try {
                const responseJson = JSON.parse(responseBody);
                resolve(responseJson.message || `Successfully executed tool: ${toolName}`);
              } catch (e) {
                 resolve(`Successfully executed tool: ${toolName}. Response: ${responseBody}`);
              }
            } else {
              reject(
                new Error(
                  `Bridge server request failed with status ${res.statusCode}: ${responseBody}`
                )
              );
            }
          });
        });

        req.on("error", (e) => {
          reject(new Error(`Problem with request to bridge server: ${e.message}`));
        });

        req.write(postData);
        req.end();
      });
    }

    // FastMCP 서버 인스턴스 생성 (변경 없음)
    const server = new FastMCP({
      name: "PowerPoint Controller",
      version: "1.0.0",
      description: "Controls PowerPoint via an Office Add-in bridge.",
    });

    // 'insertText' MCP Tool 정의
    server.addTool({
      name: "insertText",
      description: "Inserts text into the current PowerPoint slide.",
      parameters: z.object({ // 변경: zod 스키마 사용
        text: z.string().describe("The text content to insert."), // .describe()로 설명 추가 가능
      }),
      execute: async (params) => { // params 타입은 zod가 추론
        console.log(`Executing insertText with params:`, params);
        // zod가 자동으로 타입을 검증하므로, 여기서 params.text가 string인지 추가 검사할 필요 없음
        // if (!params || typeof params.text !== 'string') { ... } 제거 가능
        try {
          const result = await sendCommandToBridge("insertText", { text: params.text });
          console.log("Bridge server response:", result);
          return { result: result };
        } catch (error: any) {
          console.error("Error executing insertText:", error.message);
          return { error: error.message || "Failed to execute insertText via bridge server." };
        }
      },
    });

    // 'insertImage' MCP Tool 정의
    server.addTool({
      name: "insertImage",
      description: "Inserts an image (from base64 data) into the current PowerPoint slide.",
      parameters: z.object({ // 변경: zod 스키마 사용
        base64Image: z.string().describe("Base64 encoded image data."),
      }),
      execute: async (params) => { // params 타입은 zod가 추론
        console.log(`Executing insertImage...`);
        // zod가 자동으로 타입을 검증하므로, 여기서 params.base64Image가 string인지 추가 검사할 필요 없음
        try {
          const result = await sendCommandToBridge("insertImage", { base64Image: params.base64Image });
          console.log("Bridge server response:", result);
          return { result: result };
        } catch (error: any) {
          console.error("Error executing insertImage:", error.message);
          return { error: error.message || "Failed to execute insertImage via bridge server." };
        }
      },
    });


    // MCP 서버 시작 (변경 없음)
    server.start({
      transportType: "stdio",
    });

    console.log("MCP Server for PowerPoint started. Waiting for commands...");
