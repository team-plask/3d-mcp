/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global console, document, Excel, Office */

let socket = null;
const serverUrl = "wss://localhost:8001"; // 통합 MCP 서버의 WSS 주소

Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    // Excel에서 실행될 때만 초기화
    document.getElementById("app-body").style.display = "flex";
    console.log("Excel Add-in ready.");

    // 예시: 기본 'Run' 버튼 이벤트 핸들러 (필요 없으면 제거)
    document.getElementById("run").onclick = runSampleCode;

    // WebSocket 서버에 연결 시도
    connectWebSocket();
  } else {
    console.log("This add-in only runs on Excel.");
  }
});

function connectWebSocket() {
  console.log(`Attempting to connect to WebSocket Secure server at ${serverUrl}`);
  socket = new WebSocket(serverUrl);

  socket.onopen = function (event) {
    console.log("WebSocket Secure connection established with MCP server.");
  };

  socket.onmessage = async function (event) {
    console.log(`Message from MCP server: ${event.data}`);
    try {
      const command = JSON.parse(event.data);
      const tool = command.tool;
      const params = command.params || {};

      // 서버로부터 받은 명령(tool)에 따라 함수 실행
      switch (tool) {
        case "insertText":
          // Excel용 텍스트 삽입 함수 호출
          await insertTextIntoExcel(params.text);
          // 작업 완료 응답 (선택 사항)
          // if (socket && socket.readyState === WebSocket.OPEN) {
          //   socket.send(JSON.stringify({ status: "success", tool: tool, message: "Text inserted in Excel" }));
          // }
          break;
        // 다른 Excel 관련 도구(명령)에 대한 case 추가 가능
        // case "createChart":
        //   await createChartInExcel(params.rangeAddress, params.chartType);
        //   break;
        default:
          console.warn(`Unknown tool command received: ${tool}`);
          // 오류 응답 (선택 사항)
      }
    } catch (error) {
      console.error("Error processing command from server:", error);
      // 오류 응답 (선택 사항)
    }
  };

  socket.onclose = function (event) {
    console.log("WebSocket connection closed. Attempting to reconnect in 5 seconds...");
    socket = null;
    setTimeout(connectWebSocket, 5000);
  };

  socket.onerror = function (error) {
    console.error("WebSocket error:", error);
  };
}

// --- Excel JavaScript API 함수 ---

// MCP 서버 명령으로 Excel 시트에 텍스트를 삽입하는 함수 (활성 셀에 삽입)
async function insertTextIntoExcel(textToInsert = "Default text from server") {
  // Excel.run()을 사용하여 Excel 개체 모델과 상호 작용
  await Excel.run(async (context) => {
    // 현재 활성 셀 가져오기
    const activeCell = context.workbook.getActiveCell();

    // 활성 셀에 값 설정
    // Excel 범위 값은 항상 2차원 배열로 설정해야 함 [[value]]
    activeCell.values = [[textToInsert]];

    // 활성 셀 주소 로드 (선택적 로깅용)
    activeCell.load("address");

    // 변경 사항을 문서에 적용하기 위해 context.sync() 호출
    await context.sync();
    console.log(`Inserted text "${textToInsert}" into cell ${activeCell.address}`);
  }).catch(function (error) {
    console.error("Error inserting text into Excel: " + error);
    if (error instanceof OfficeExtension.Error) {
      console.error("Debug info: " + JSON.stringify(error.debugInfo));
    }
    // 오류 발생 시 서버에 알림 (선택 사항)
  });
}

// (선택 사항) 특정 범위에 값을 설정하는 함수 예시
async function insertDataIntoRange(rangeAddress = "Sheet1!A1:B2", data = [[1, 2], [3, 4]]) {
   await Excel.run(async (context) => {
      const sheet = context.workbook.worksheets.getActiveWorksheet();
      const range = sheet.getRange(rangeAddress);
      range.values = data;
      range.format.autofitColumns(); // 열 너비 자동 맞춤
      await context.sync();
      console.log(`Inserted data into range ${rangeAddress}`);
   }).catch(function (error) {
      console.error(`Error inserting data into range ${rangeAddress}: ${error}`);
      if (error instanceof OfficeExtension.Error) {
         console.error("Debug info: " + JSON.stringify(error.debugInfo));
      }
   });
}


// 예시: 기본 'Run' 버튼 클릭 시 실행될 샘플 코드 (활성 셀 노란색으로 채우기)
async function runSampleCode() {
  await Excel.run(async (context) => {
    const range = context.workbook.getSelectedRange();
    range.format.fill.color = "yellow";
    await context.sync();
    console.log("Filled selected range with yellow.");
  }).catch(function (error) {
    console.error("Error in sample code: " + error);
    if (error instanceof OfficeExtension.Error) {
      console.error("Debug info: " + JSON.stringify(error.debugInfo));
    }
  });
}