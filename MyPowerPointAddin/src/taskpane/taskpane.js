/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global console, document, Excel, Office, Word, PowerPoint */

Office.onReady((info) => {
  if (info.host === Office.HostType.PowerPoint) {
    // WebSocket 서버에 연결
    connectWebSocket();

    // 기존 버튼 이벤트 핸들러 (예시)
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    // 변경: "run" -> "say-hello"
    document.getElementById("say-hello").onclick = run; // HTML의 실제 버튼 ID 사용
  }
});

let socket = null;
const serverUrl = "wss://localhost:8001"; // 변경: ws -> wss

function connectWebSocket() {
  console.log(`Attempting to connect to WebSocket Secure server at ${serverUrl}`); // 로그 변경
  socket = new WebSocket(serverUrl);

  socket.onopen = function (event) {
    console.log("WebSocket Secure connection established");
    // 연결 성공 시 서버에 메시지 전송 가능
    // socket.send("Hello Server from Taskpane!");
  };

  socket.onmessage = async function (event) {
    console.log(`Message from server: ${event.data}`);
    try {
      const command = JSON.parse(event.data);
      const tool = command.tool;
      const params = command.params || {};

      // 서버로부터 받은 명령(tool)에 따라 함수 실행
      switch (tool) {
        case "insertText":
          await insertTextFromCommand(params.text);
          // 필요시 작업 완료 메시지 서버로 전송
          // socket.send(JSON.stringify({ status: "success", tool: tool }));
          break;
        case "insertImage":
          await insertImageFromCommand(params.base64Image);
           // 필요시 작업 완료 메시지 서버로 전송
           // socket.send(JSON.stringify({ status: "success", tool: tool }));
          break;
        // 다른 도구(명령)에 대한 case 추가
        default:
          console.warn(`Unknown tool command received: ${tool}`);
          // 필요시 에러 메시지 서버로 전송
          // socket.send(JSON.stringify({ status: "error", tool: tool, message: "Unknown tool" }));
      }
    } catch (error) {
      console.error("Error processing command from server:", error);
      // 필요시 에러 메시지 서버로 전송
      // socket.send(JSON.stringify({ status: "error", message: error.message }));
    }
  };

  socket.onclose = function (event) {
    console.log("WebSocket connection closed. Attempting to reconnect...");
    socket = null;
    // 연결이 끊어지면 잠시 후 재연결 시도
    setTimeout(connectWebSocket, 5000); // 5초 후 재연결
  };

  socket.onerror = function (error) {
    console.error("WebSocket error:", error);
    // 에러 발생 시에도 재연결 시도 가능
    // socket = null;
    // setTimeout(connectWebSocket, 5000);
  };
}

// 서버 명령으로 텍스트를 삽입하는 함수
async function insertTextFromCommand(textToInsert = "Default text from server") {
  await PowerPoint.run(async (context) => {
    // 현재 선택된 위치나 슬라이드의 첫 번째 도형 등에 텍스트 삽입
    // 여기서는 간단히 현재 선택된 슬라이드에 텍스트 상자를 추가하고 텍스트를 넣습니다.
    const slide = context.presentation.getSelectedSlides().getItemAt(0);
    const shape = slide.shapes.addTextBox(textToInsert);
    shape.left = 100;
    shape.top = 100;
    await context.sync();
    console.log(`Inserted text: "${textToInsert}"`);
  }).catch(function (error) {
    console.log("Error inserting text: " + error);
    if (error instanceof OfficeExtension.Error) {
      console.log("Debug info: " + JSON.stringify(error.debugInfo));
    }
  });
}

// 서버 명령으로 이미지를 삽입하는 함수 (Base64 인코딩된 이미지 데이터 사용)
async function insertImageFromCommand(base64Image) {
   if (!base64Image) {
       console.error("No image data provided for insertImage command");
       return;
   }
   await PowerPoint.run(async (context) => {
      const slide = context.presentation.getSelectedSlides().getItemAt(0);
      // Base64 이미지 데이터를 사용하여 이미지 추가
      // 주의: 매우 큰 이미지는 성능 문제를 일으킬 수 있음
      const imageShape = slide.shapes.addImage(base64Image);
      imageShape.left = 150;
      imageShape.top = 150;
      await context.sync();
      console.log("Inserted image from server command.");
   }).catch(function (error) {
       console.log("Error inserting image: " + error);
       if (error instanceof OfficeExtension.Error) {
           console.log("Debug info: " + JSON.stringify(error.debugInfo));
       }
   });
}


// 기존 run 함수 (예시) - 이제 "Say Hello" 버튼과 연결됩니다.
async function run() {
  await PowerPoint.run(async (context) => {
    /**
     * Insert your PowerPoint code here.
     * The code below runs independently of the WebSocket logic.
     */
    const options = { coercionType: Office.CoercionType.Text };
    await Office.context.document.setSelectedDataAsync("Hello World!", options);
    console.log("Executed default run action (via say-hello button).");
  }).catch(function (error) {
    console.log("Error in default run: " + error);
    if (error instanceof OfficeExtension.Error) {
      console.log("Debug info: " + JSON.stringify(error.debugInfo));
    }
  });
}