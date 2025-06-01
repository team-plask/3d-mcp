// src/taskpane/demo.ts
import {
  updateDocumentFromPatch // service.ts에서 가져옴
} from './service';

// updateDocumentStructure는 문서의 현재 JSON 상태를 읽어오는 함수로 가정합니다.
// 이는 converter.ts 또는 document.ts 등에 정의될 수 있습니다.
import { updateDocumentStructure } from './document'; // 또는 './converter'

const $ = (id: string) => document.getElementById(id)!;
const log = (msg: any) => {
  const resultElement = $('result');
  if (resultElement) {
    resultElement.textContent = typeof msg === 'string'
      ? msg
      : JSON.stringify(msg, null, 2);
  } else {
    console.warn("Element with ID 'result' not found for logging.");
    console.log("Log message:", msg);
  }
};

/**
 * 문서 구조 스냅샷 캡처 및 표시 (read 기능)
 */
export async function snapshot(): Promise<void> {
  try {
    log('⏳ 문서 구조 스냅샷 생성 중...');
    const documentStructure = await updateDocumentStructure();
    console.log('문서 구조 스냅샷:', documentStructure);

    const keys = Object.keys(documentStructure);
    const previewKeys = keys.slice(0, 3);
    const preview: Record<string, any> = {};
    previewKeys.forEach(key => {
      preview[key] = documentStructure[key];
    });

    log({
      message: '문서 구조 미리보기 (콘솔에서 전체 확인 가능)',
      elementsInPreview: previewKeys.length,
      totalElements: keys.length,
      previewData: preview
    });
  } catch (error) {
    console.error('스냅샷 오류:', error);
    log(`❌ 스냅샷 오류: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 특정 요소 정보 보기 (read 기능 - 특정 ID)
 */
export async function viewElement(): Promise<void> {
  try {
    const elementId = ($('viewId') as HTMLInputElement).value.trim();
    if (!elementId) {
      log('❓ 확인할 요소 ID를 입력하세요.');
      return;
    }
    log(`⏳ 요소 "${elementId}" 정보 조회 중...`);
    const documentStructure = await updateDocumentStructure();

    if (documentStructure[elementId]) {
      log({
        status: `✅ 요소 "${elementId}" 정보`,
        element: documentStructure[elementId]
      });
    } else {
      log({
        status: `❓ 요소 "${elementId}"를 찾을 수 없습니다.`,
        availableIdsPreview: Object.keys(documentStructure).slice(0, 5)
      });
    }
  } catch (error) {
    console.error('요소 정보 확인 오류:', error);
    log(`❌ 요소 정보 확인 오류: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 샘플 패치 테스트 실행 (이 함수는 service.ts에 실제 테스트 함수가 있다는 가정하에 유지)
 * 실제로는 특정 샘플 패치를 정의하고 applyCustomPatch를 호출하는 방식으로 대체할 수 있습니다.
 */
export async function runSamplePatch(): Promise<void> {
  try {
    log('⏳ 샘플 패치를 실행합니다... (구현 필요)');
    console.log('샘플 패치 실행 중... (service.ts에 testPatch() 와 같은 함수 구현 필요)');

    // 예시: 여기에 특정 샘플 패치 객체를 만들고 updateDocumentFromPatch 호출
    const sampleMergePatch = {
      /* 샘플 패치 내용 */
      "p_VNsHkUoBKzJ": { // 기존 단락 내용 변경
        "type": "paragraph",
        "properties": { "justification": "center" }, // 오른쪽 정렬을 가운데 정렬로
        "order": "a4", // 순서 유지
        "r_jMD9NWm6JKK": { // 기존 런
          "type": "run",
          "properties": { "fonts": { "hint": "eastAsia" }, "bold": true }, // 굵게 추가
          "text": "수정된 학사팀(", // 텍스트 변경
          "order": "a0"
        },
        "r_YkszPZjkbq0": { // 기존 런
          "type": "run",
          "text": "날짜 변경됨)", // 텍스트 변경
          "order": "a1"
        }
      },
      "p_newSampleParagraph": { // 새 단락 추가
        "type": "paragraph",
        "order": "za", // 맨 뒤에 추가될 수 있도록 (실제 order 값은 문서 상태에 따라 다름)
        "properties": { "justification": "left" },
        "r_newSampleRun": {
          "type": "run",
          "order": "a0",
          "text": "이것은 샘플 패치로 추가된 단락입니다."
        }
      }
    };
    // await updateDocumentFromPatch(sampleMergePatch); // 실제 호출

    log({
      status: '✅ 샘플 패치 실행 완료 (가상)',
      message: '실제 구현 시 service.ts의 테스트 함수를 호출하거나, 여기서 패치를 직접 적용하세요.'
    });
  } catch (error) {
    console.error('샘플 패치 실행 오류:', error);
    log(`❌ 샘플 패치 실행 오류: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 사용자 정의 패치 적용
 */
export async function applyCustomPatch(): Promise<void> {
  try {
    const patchText = ($('customPatch') as HTMLTextAreaElement).value.trim();
    if (!patchText) {
      log('❓ 패치 데이터를 입력하세요.');
      return;
    }

    let mergePatchData: Record<string, any | null>;
    try {
      mergePatchData = JSON.parse(patchText);
    } catch (parseError) {
      log(`❌ 유효하지 않은 JSON 형식입니다: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      return;
    }

    if (Object.keys(mergePatchData).length === 0) {
        log('ℹ️ 적용할 변경 사항이 없습니다 (빈 패치).');
        return;
    }

    log('⏳ 사용자 정의 패치 적용 중...');
    await updateDocumentFromPatch(mergePatchData); // "Merge Patch" 객체 직접 전달

    log({
      status: '✅ 사용자 정의 패치 적용 완료',
      message: '문서가 성공적으로 업데이트되었습니다. (오류 발생 시 콘솔 확인)'
    });

  } catch (error) {
    console.error('사용자 정의 패치 적용 오류:', error);
    log(`❌ 패치 적용 오류: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 요소 삭제 테스트
 */
export async function deleteElement(): Promise<void> {
  try {
    const elementId = ($('deleteId') as HTMLInputElement).value.trim();
    if (!elementId) {
      log('❓ 삭제할 요소 ID를 입력하세요.');
      return;
    }

    // 삭제를 위한 "Merge Patch" 객체 생성
    const deleteMergePatch: Record<string, null> = {
      [elementId]: null
    };

    log(`⏳ 요소 "${elementId}" 삭제 중...`);
    await updateDocumentFromPatch(deleteMergePatch);

    log({
      status: `✅ 요소 "${elementId}" 삭제 완료`,
      message: '문서에서 요소가 삭제되었습니다.'
    });

  } catch (error) {
    console.error('요소 삭제 오류:', error);
    log(`❌ 요소 삭제 오류: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 단락 속성 업데이트 테스트
 * 주의: 이 방식은 해당 단락(paragraphId)의 전체 내용을 주어진 객체로 대체합니다.
 * 만약 단락 내의 특정 Run 요소 등 자식 요소들을 보존하면서 속성만 바꾸려면,
 * patch 객체에 해당 자식 요소들의 전체 정의도 포함해야 합니다.
 * 또는, service.ts에서 더 세밀한 부분 업데이트 로직을 지원해야 합니다.
 */
export async function updateParagraphProperties(): Promise<void> {
  try {
    const paragraphId = ($('paragraphId') as HTMLInputElement).value.trim();
    if (!paragraphId) {
      log('❓ 업데이트할 단락 ID를 입력하세요.');
      return;
    }

    const alignment = ($('paragraphAlignment') as HTMLSelectElement).value;
    // const boldText = ($('boldCheckbox') as HTMLInputElement).checked; // 이 예제에서는 사용 안함

    // 업데이트를 위한 "Merge Patch" 객체 생성
    // 중요: 이 패치는 paragraphId 요소의 'properties' 객체만을 업데이트하지 않고,
    //       paragraphId 요소 전체를 아래 정의된 내용으로 "교체"하려는 의도로 해석될 수 있습니다.
    //       따라서, type, order 및 기존 자식 요소(run 등) 정보도 함께 제공해야 합니다.
    //       만약 `properties`만 변경하고 싶다면, 먼저 해당 요소의 전체 JSON을 읽어온 후,
    //       `properties` 부분만 수정하고 전체 객체를 패치로 사용해야 합니다.

    log(`⏳ 단락 "${paragraphId}" 속성 업데이트 준비 중 (원본 정보 로드)...`);
    const currentJson = await updateDocumentStructure();
    const originalParagraphJson = currentJson[paragraphId];

    if (!originalParagraphJson || typeof originalParagraphJson !== 'object') {
        log(`❌ 업데이트할 단락 "${paragraphId}"를 찾을 수 없습니다.`);
        return;
    }

    // 원본 JSON을 기반으로 수정된 JSON 객체 생성
    const updatedParagraphJson = {
      ...originalParagraphJson, // 기존 내용 복사 (type, order, 자식 요소 등 보존)
      properties: {
        ...(originalParagraphJson.properties || {}), // 기존 properties 복사
        justification: alignment // 원하는 속성만 변경 또는 추가
      }
    };

    const updateMergePatch: Record<string, any> = {
      [paragraphId]: updatedParagraphJson
    };

    log(`⏳ 단락 "${paragraphId}" 속성 업데이트 중...`);
    await updateDocumentFromPatch(updateMergePatch);

    log({
      status: `✅ 단락 "${paragraphId}" 속성 업데이트 완료`,
      message: '단락 정렬이 변경되었습니다.',
      newAlignment: alignment
    });

  } catch (error) {
    console.error('단락 속성 업데이트 오류:', error);
    log(`❌ 단락 속성 업데이트 오류: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 텍스트 실행(Run) 내용 업데이트
 * 이 함수도 Run이 포함된 부모 단락(또는 다른 부모)의 전체 내용을 교체하는 방식으로 동작합니다.
 * 특정 Run의 텍스트만 변경하려면, 해당 Run을 포함하는 부모 요소의 전체 업데이트된 상태를
 * 패치로 제공해야 합니다.
 */
export async function updateRunText(): Promise<void> {
  try {
    const runId = ($('runId') as HTMLInputElement).value.trim(); // 실제 Run의 ID (예: r_xxxx)
    const newText = ($('newText') as HTMLInputElement).value;

    if (!runId) {
      log('❓ 업데이트할 Run ID를 입력하세요.');
      return;
    }

    log(`⏳ Run "${runId}" 텍스트 업데이트 준비 중 (원본 정보 로드)...`);
    const currentJson = await updateDocumentStructure();
    let parentIdContainingRun: string | null = null;
    let originalRunJson: any = null;

    // 문서 전체 JSON에서 해당 runId를 가진 자식 요소를 찾고 그 부모 ID를 식별
    for (const topLevelId in currentJson) {
      const topLevelElement = currentJson[topLevelId];
      if (topLevelElement && typeof topLevelElement === 'object') {
        if (topLevelElement[runId] && typeof topLevelElement[runId] === 'object') {
          parentIdContainingRun = topLevelId;
          originalRunJson = topLevelElement[runId];
          break;
        }
      }
    }

    if (!parentIdContainingRun || !originalRunJson) {
      log(`❌ Run ID "${runId}"를 포함하는 부모 요소를 찾을 수 없거나, Run 정보를 가져올 수 없습니다.`);
      return;
    }

    // 수정된 Run JSON 생성
    const updatedRunJson = {
      ...originalRunJson, // 기존 Run 내용 복사 (type, order, properties 등 보존)
      text: newText // 텍스트만 변경
    };

    // 부모 요소의 전체 업데이트된 상태를 포함하는 Merge Patch 객체 생성
    const updateMergePatch: Record<string, any> = {
      [parentIdContainingRun]: {
        ...currentJson[parentIdContainingRun], // 부모 요소의 다른 자식 및 속성 보존
        [runId]: updatedRunJson // 특정 Run만 업데이트된 내용으로 교체
      }
    };

    log(`⏳ Run "${runId}" (부모: "${parentIdContainingRun}") 텍스트 업데이트 중...`);
    await updateDocumentFromPatch(updateMergePatch);

    log({
      status: `✅ Run "${runId}" 텍스트 업데이트 완료`,
      message: '텍스트가 변경되었습니다.',
      newText: newText
    });

  } catch (error) {
    console.error('Run 텍스트 업데이트 오류:', error);
    log(`❌ Run 텍스트 업데이트 오류: ${error instanceof Error ? error.message : String(error)}`);
  }
}


/**
 * 사용자 정의 복합 "Merge Patch" 예시 불러오기
 */
export function loadComplexPatchExample(): void {
  const complexMergePatch = {
    // 단락 p_VNsHkUoBKzJ 업데이트: 정렬 변경 및 첫번째 Run 텍스트/스타일 변경
    "p_VNsHkUoBKzJ": {
      "type": "paragraph", // type과 order는 일반적으로 원본과 동일하게 유지
      "order": "a4",
      "properties": {
        "justification": "center", // 기존 'right'에서 변경
        "spacing": { // 기존 spacing 유지 또는 명시적 설정
          "after": "0",
          "line": "240",
          "lineRule": "auto"
        }
      },
      "r_jMD9NWm6JKK": { // 이 Run 업데이트
        "type": "run",
        "order": "a0",
        "properties": {
          "fonts": { "hint": "eastAsia" },
          "bold": true, // 굵게 추가
          "color": "008000" // 녹색으로 변경
        },
        "text": "수정된 학사팀 내용(" // 텍스트 변경
      },
      "r_YkszPZjkbq0": { // 이 Run은 그대로 유지 (명시적으로 포함해야 함)
        "type": "run",
        "order": "a1",
        "text": "2024.09.11.)"
        // properties가 없었으면 그대로 비워둠
      }
    },
    // 새 단락 p_newParagraph123 추가
    "p_newParagraph123": {
      "type": "paragraph",
      "order": "z", // 순서는 실제 문서 상태에 따라 결정되어야 함 (가장 뒤 또는 특정 위치)
      "properties": {
        "justification": "left"
      },
      "r_newRunText456": {
        "type": "run",
        "order": "a0",
        "properties": { "bold": true, "color": "FF00FF" },
        "text": "이것은 새로 추가된 단락입니다!"
      }
    },
    // 기존 단락 p_awu3amOgtJ2 삭제
    "p_awu3amOgtJ2": null
  };

  ($('customPatch') as HTMLTextAreaElement).value = JSON.stringify(complexMergePatch, null, 2);

  log({
    status: '✅ 복합 "Merge Patch" 예시 로드 완료',
    message: '이 객체는 applyCustomPatch를 통해 서비스로 전달되어 처리됩니다.'
  });
}

// runSamplePatch와 loadExamplePatch는 필요에 따라 구체적인 샘플 패치를 정의하여 사용합니다.
// loadExamplePatch는 loadComplexPatchExample로 대체되거나 유사한 방식으로 구현될 수 있습니다.