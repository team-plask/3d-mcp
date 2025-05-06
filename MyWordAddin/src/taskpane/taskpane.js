/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global console, document, Office, Word */

let socket = null;
const serverUrl = "wss://localhost:8001"; // 통합 MCP 서버의 WSS 주소

let currentContentForPatch = null; // Patch 적용 전 원본 콘텐츠 (JSON 객체 형태)
let patchedContentResult = null;  // Patch 적용 후 결과 콘텐츠 (JSON 객체 형태)
let patchDataReceived = null;     // 수신된 Patch 데이터

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    // Word에서 실행될 때만 초기화
    document.getElementById("app-body").style.display = "flex";
    console.log("Word Add-in ready.");

    // WebSocket 서버에 연결 시도
    connectWebSocket();
  } else {
    console.log("This add-in only runs on Word.");
  }
});

function connectWebSocket() {
  console.log(`Attempting to connect to WebSocket Secure server at ${serverUrl}`);
  socket = new WebSocket(serverUrl);

  socket.onopen = function (event) {
    console.log("WebSocket Secure connection established with MCP server.");
    // 연결 성공 시 필요한 작업 수행 가능
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
          // Word용 텍스트 삽입 함수 호출
          await insertTextIntoWord(params.text);
          // 작업 완료 응답 (선택 사항)
          // if (socket && socket.readyState === WebSocket.OPEN) {
          //   socket.send(JSON.stringify({ status: "success", tool: tool, message: "Text inserted in Word" }));
          // }
          break;
        // 다른 Word 관련 도구(명령)에 대한 case 추가 가능
        // case "insertImage": // Word용 이미지 삽입 구현
        //   await insertImageIntoWord(params.base64Image);
        //   break;
        case "proposeMergePatch": // 새로운 명령 처리
        patchDataReceived = params.patch; // 받은 패치 저장
        console.log("Received patch proposal:", patchDataReceived);
        // 1. 현재 문서 내용 가져오기 (Patch 대상에 따라 달라짐 - 여기서는 전체 본문 텍스트 예시)
        await Word.run(async (context) => {
          const body = context.document.body;
          body.load("text"); // 본문 텍스트 로드
          await context.sync();

          // Word 내용을 Patch 가능한 JSON 형태로 변환 (매우 중요하고 어려운 부분)
          // 예시: 간단히 본문 전체를 하나의 text 필드로 갖는 객체로 가정
          currentContentForPatch = { text: body.text };

          // 2. JSON Merge Patch 적용 (메모리 상에서)
          // 'json-merge-patch' 같은 라이브러리 사용
          // 예시 라이브러리 사용법 (실제 라이브러리에 맞게 수정 필요):
          // patchedContentResult = applyPatch(currentContentForPatch, patchDataReceived);
          // 간단한 예시: 직접 merge (실제로는 라이브러리 사용 권장)
          patchedContentResult = mergePatchSimple(currentContentForPatch, patchDataReceived);

          // 3. Diff 계산 (원본 텍스트 vs 패치된 텍스트)
          const dmp = new diff_match_patch();
          const diffs = dmp.diff_main(currentContentForPatch.text, patchedContentResult.text);
          dmp.diff_cleanupSemantic(diffs); // 가독성 좋게 정리

          // 4. Diff 결과를 HTML로 변환하여 Task Pane에 표시
          const diffHtml = dmp.diff_prettyHtml(diffs);
          displayDiff(diffHtml); // 아래 정의할 함수
        }).catch(handleWordError);
        break;
        default:
          console.warn(`Unknown tool command received: ${tool}`);
          // 오류 응답 (선택 사항)
          // if (socket && socket.readyState === WebSocket.OPEN) {
          //   socket.send(JSON.stringify({ status: "error", tool: tool, message: "Unknown tool for Word" }));
          // }
      }
    } catch (error) {
      console.error("Error processing command from server:", error);
      // 오류 응답 (선택 사항)
      // if (socket && socket.readyState === WebSocket.OPEN) {
      //   socket.send(JSON.stringify({ status: "error", message: `Error processing command: ${error.message}` }));
      // }
    }
  };

  socket.onclose = function (event) {
    // 연결 종료 코드와 이유 로깅
    console.log(`WebSocket connection closed. Code: ${event.code}, Reason: "${event.reason}", Clean close: ${event.wasClean}`);
    socket = null;

    // 조건부 재연결 로직 (예시):
    // - event.code 1000 (Normal Closure) 또는 1001 (Going Away) 등 정상 종료 시에는 재연결 안 함
    // - 또는 wasClean이 true이면 (깔끔하게 닫혔으면) 재연결 안 함
    // - 여기서는 비정상 종료로 간주될 수 있는 경우(예: 1006 Abnormal Closure) 또는
    //   코드를 특정할 수 없을 때만 재연결 시도하도록 수정 (필요에 맞게 조정)
    if (!event.wasClean || event.code === 1006) {
        console.log("Connection closed unexpectedly or abnormally. Attempting to reconnect in 5 seconds...");
        // 5초 후 재연결 시도
        setTimeout(connectWebSocket, 5000);
    } else {
        console.log("Connection closed normally. Not attempting reconnect.");
    }
  };

  socket.onerror = function (error) {
    // 발생한 에러 객체 전체를 로깅
    console.error("WebSocket error occurred:", error);
    // 필요하다면 여기서도 재연결 로직을 고려할 수 있으나, 보통 onerror 후 onclose가 발생함
    // socket = null; // 필요에 따라 여기서 null 처리
    // setTimeout(connectWebSocket, 5000);
  };
}

// --- Word JavaScript API 함수 ---

// MCP 서버 명령으로 Word 문서에 텍스트를 삽입하는 함수
async function insertTextIntoWord(textToInsert = "Default text from server") {
  // Word.run()을 사용하여 Word 개체 모델과 상호 작용
  await Word.run(async (context) => {
    // 현재 사용자의 선택 영역 가져오기
    const selection = context.document.getSelection();

    // 선택 영역에 텍스트 삽입 (기존 내용 대체)
    // 다른 삽입 위치: Word.InsertLocation.start, Word.InsertLocation.end, Word.InsertLocation.before, Word.InsertLocation.after
    selection.insertText(textToInsert, Word.InsertLocation.replace);

    // 변경 사항을 문서에 적용하기 위해 context.sync() 호출
    await context.sync();
    console.log(`Inserted text into Word: "${textToInsert}"`);
  }).catch(function (error) {
    console.error("Error inserting text into Word: " + error);
    if (error instanceof OfficeExtension.Error) {
      console.error("Debug info: " + JSON.stringify(error.debugInfo));
    }
    // 오류 발생 시 서버에 알림 (선택 사항)
    // if (socket && socket.readyState === WebSocket.OPEN) {
    //   socket.send(JSON.stringify({ status: "error", tool: "insertText", message: `Word API Error: ${error.message}` }));
    // }
  });
}

// (선택 사항) Word에 이미지를 삽입하는 함수 예시
async function insertImageIntoWord(base64Image) {
  if (!base64Image) {
    console.error("No image data provided for insertImage command");
    return;
  }
  await Word.run(async (context) => {
    const selection = context.document.getSelection();
    // 선택 영역에 Base64 인코딩된 이미지 삽입
    selection.insertInlinePictureFromBase64(base64Image, Word.InsertLocation.replace);
    await context.sync();
    console.log("Inserted image into Word from server command.");
  }).catch(function (error) {
    console.error("Error inserting image into Word: " + error);
    if (error instanceof OfficeExtension.Error) {
      console.error("Debug info: " + JSON.stringify(error.debugInfo));
    }
    // 오류 알림 등
  });
}

// Word 내용을 대표하는 JSON 객체와 패치 객체를 병합하는 간단한 예시 함수
// 실제 구현에서는 검증된 라이브러리 사용 권장 (https://www.npmjs.com/package/json-merge-patch 등)
function mergePatchSimple(target, patch) {
  const result = JSON.parse(JSON.stringify(target)); // Deep copy
  for (const key in patch) {
    if (patch[key] === null) {
      delete result[key]; // null이면 삭제 (JSON Merge Patch 규칙)
    } else if (typeof patch[key] === 'object' && !Array.isArray(patch[key]) && typeof target[key] === 'object' && !Array.isArray(target[key])) {
       // 객체는 재귀적으로 병합 (라이브러리는 더 정교하게 처리)
       result[key] = mergePatchSimple(target[key], patch[key]);
    } else {
      result[key] = patch[key]; // 다른 경우는 덮어쓰기
    }
  }
  return result;
}


// Diff 결과를 Task Pane에 표시하는 함수
function displayDiff(diffHtml) {
  const diffContainer = document.getElementById("diff-container"); // HTML에 해당 ID 요소 필요
  const acceptButton = document.getElementById("accept-patch"); // HTML에 해당 ID 요소 필요
  const rejectButton = document.getElementById("reject-patch"); // HTML에 해당 ID 요소 필요

  if (diffContainer && acceptButton && rejectButton) {
    diffContainer.innerHTML = diffHtml; // 계산된 HTML 삽입
    acceptButton.style.display = "inline-block";
    rejectButton.style.display = "inline-block";
    // 버튼 이벤트 리스너 설정 (한 번만 설정하도록 주의)
    acceptButton.onclick = handleAcceptPatch;
    rejectButton.onclick = handleRejectPatch;
  } else {
    console.error("Required HTML elements for diff display not found.");
  }
}

// '수락' 버튼 처리 함수
async function handleAcceptPatch() {
  console.log("Patch accepted. Applying changes to Word document.");
  if (!patchedContentResult) {
    console.error("No patched content available to apply.");
    return;
  }

  // **매우 중요:** Patch된 JSON 결과를 실제 Word 문서 수정으로 변환
  // 이 부분이 가장 복잡하며, Patch의 내용과 대상에 따라 달라짐
  // 예시: 본문 전체 텍스트를 교체하는 경우 (가장 간단하지만 위험할 수 있음)
  await Word.run(async (context) => {
    // 주의: body.clear()는 모든 서식을 제거하므로 사용에 신중해야 함
    // context.document.body.clear();
    // context.document.body.insertText(patchedContentResult.text, Word.InsertLocation.replace);

    // 더 나은 방법: OOXML 사용 (JSON과 OOXML 매핑이 가능하다는 가정 하에)
    // const targetOoxml = convertPatchedJsonToOoxml(patchedContentResult); // 이 함수 구현 필요
    // context.document.body.insertOoxml(targetOoxml, Word.InsertLocation.replace);

    // 또는 더 정교하게 변경된 부분만 찾아 수정 (Diff 결과 활용) - 매우 복잡
    // applyDiffToWord(diffs); // 이 함수 구현 필요

    // 여기서는 가장 간단하게 전체 텍스트 교체 시연
    context.document.body.insertText(patchedContentResult.text, Word.InsertLocation.replace);

    await context.sync();
    console.log("Changes applied to Word document based on patch.");
    clearDiffDisplay(); // Diff 표시 정리

    // (선택) 작업 완료를 서버에 알림
    // if (socket && socket.readyState === WebSocket.OPEN) {
    //   socket.send(JSON.stringify({ status: "success", tool: "proposeMergePatch", message: "Patch applied successfully." }));
    // }

  }).catch((error) => {
      handleWordError(error);
      // (선택) 작업 실패를 서버에 알림
      // if (socket && socket.readyState === WebSocket.OPEN) {
      //   socket.send(JSON.stringify({ status: "error", tool: "proposeMergePatch", message: `Failed to apply patch: ${error.message}` }));
      // }
  });
}

// '거부' 버튼 처리 함수
function handleRejectPatch() {
  console.log("Patch rejected.");
  clearDiffDisplay();
  // (선택) 거부 사실을 서버에 알림
  // if (socket && socket.readyState === WebSocket.OPEN) {
  //   socket.send(JSON.stringify({ status: "rejected", tool: "proposeMergePatch", message: "Patch proposal rejected by user." }));
  // }
}

// Diff 표시 및 버튼 숨김
function clearDiffDisplay() {
  const diffContainer = document.getElementById("diff-container");
  const acceptButton = document.getElementById("accept-patch");
  const rejectButton = document.getElementById("reject-patch");
  if (diffContainer) diffContainer.innerHTML = "";
  if (acceptButton) acceptButton.style.display = "none";
  if (rejectButton) rejectButton.style.display = "none";
  currentContentForPatch = null;
  patchedContentResult = null;
  patchDataReceived = null;
}

// 공통 Word API 오류 처리 함수
function handleWordError(error) {
   console.error("Word API Error: " + error);
   if (error instanceof OfficeExtension.Error) {
       console.error("Debug info: " + JSON.stringify(error.debugInfo));
   }
   // UI에 오류 표시 등
}