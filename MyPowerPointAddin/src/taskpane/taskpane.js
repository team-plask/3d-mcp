/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */

Office.onReady((info) => {
  if (info.host === Office.HostType.PowerPoint) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    // "Say Hello" 버튼 클릭 이벤트 리스너 추가
    document.getElementById("say-hello").onclick = sayHello;
  }
});

async function sayHello() {
  try {
    // Office.context.document.setSelectedDataAsync API를 사용하여
    // 현재 슬라이드의 선택된 위치에 텍스트를 삽입합니다.
    await Office.context.document.setSelectedDataAsync("Hello World!", {
      coercionType: Office.CoercionType.Text,
    });
  } catch (error) {
    // 오류 처리 (예: 콘솔에 로그 출력)
    console.error("Error: " + error);
    if (error instanceof Office.Error) {
        console.error("Debug info: " + JSON.stringify(error.debugInfo));
    }
  }
}
