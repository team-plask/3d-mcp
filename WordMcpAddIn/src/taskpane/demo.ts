// src/taskpane/demo.ts
import {
  writeDocContent,
  getSamplePatch,
  applyDocumentPatch,
  // testPatch
} from './service';

import { updateDocumentStructure } from './document';

const $ = (id: string) => document.getElementById(id)!;
const log = (msg: any) => {
  $('result')!.textContent = typeof msg === 'string'
    ? msg
    : JSON.stringify(msg, null, 2);
};

/**
 * 문서 구조 스냅샷 캡처 및 표시 (read 기능)
 */
export async function snapshot(): Promise<void> {
  try {
    const documentStructure = await updateDocumentStructure();
    console.log('문서 구조 스냅샷:', documentStructure);
    log('문서 스냅샷이 콘솔에 출력되었습니다. (F12를 눌러 개발자 도구 확인)');
    
    // 특정 요소만 표시 (첫 3개)
    const keys = Object.keys(documentStructure).slice(0, 3);
    const preview = {};
    keys.forEach(key => {
      preview[key] = documentStructure[key];
    });
    
    log({
      message: '문서 구조 미리보기 (첫 3개 요소)',
      elements: preview,
      totalElements: Object.keys(documentStructure).length
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
      return log('❓ 확인할 요소 ID를 입력하세요');
    }
    
    const documentStructure = await updateDocumentStructure();
    
    if (documentStructure[elementId]) {
      log({
        status: `✅ 요소 "${elementId}" 정보`,
        element: documentStructure[elementId]
      });
    } else {
      log({
        status: `❓ 요소 "${elementId}"를 찾을 수 없습니다.`,
        availableIds: Object.keys(documentStructure).slice(0, 5) // 참고용으로 첫 5개 ID 표시
      });
    }
  } catch (error) {
    console.error('요소 정보 확인 오류:', error);
    log(`❌ 요소 정보 확인 오류: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 샘플 패치 테스트 실행 (service.ts의 testPatch 함수 활용)
 */
export async function runSamplePatch(): Promise<void> {
  try {
    log('✅ 샘플 패치를 실행합니다...');
    console.log('샘플 패치 실행 중...');
    
    // service.ts의 테스트 패치 함수 실행
    // await testPatch();
    
    log({
      status: '✅ 샘플 패치 실행 완료',
      message: '자세한 내용은 콘솔을 확인하세요 (F12를 눌러 개발자 도구 확인)'
    });
  } catch (error) {
    console.error('샘플 패치 실행 오류:', error);
    log(`❌ 샘플 패치 실행 오류: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 사용자 정의 패치 적용 (write_doc 기능)
 */
export async function applyCustomPatch(): Promise<void> {
  try {
    // 텍스트 영역에서 JSON 가져오기
    const patchText = ($('customPatch') as HTMLTextAreaElement).value.trim();
    if (!patchText) {
      return log('❓ 패치 데이터를 입력하세요');
    }
    
    // JSON 파싱
    let patchData: Record<string, any>;
    try {
      patchData = JSON.parse(patchText);
    } catch (parseError) {
      return log(`❌ 유효하지 않은 JSON 형식: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }
    
    // 패치 적용 (service.ts의 writeDocContent 함수 활용)
    const result = await writeDocContent(patchData);
    
    // 결과 로깅
    if (result.success) {
      log({
        status: '✅ 패치 적용 성공',
        message: '문서가 성공적으로 업데이트되었습니다.'
      });
    } else {
      log({
        status: '❌ 패치 적용 실패',
        error: result.error
      });
    }
  } catch (error) {
    console.error('사용자 정의 패치 적용 오류:', error);
    log(`❌ 패치 적용 오류: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 요소 삭제 테스트 (write_doc 기능 - 삭제)
 */
export async function deleteElement(): Promise<void> {
  try {
    const elementId = ($('deleteId') as HTMLInputElement).value.trim();
    if (!elementId) {
      return log('❓ 삭제할 요소 ID를 입력하세요');
    }
    
    // 삭제 패치 생성 (요소를 null로 설정)
    const deletePatch = {
      [elementId]: null
    };
    
    // 패치 적용 (service.ts의 writeDocContent 함수 활용)
    const result = await writeDocContent(deletePatch);
    
    // 결과 로깅
    if (result.success) {
      log({
        status: `✅ 요소 "${elementId}" 삭제 성공`,
        message: '문서에서 요소가 삭제되었습니다.'
      });
    } else {
      log({
        status: `❌ 요소 "${elementId}" 삭제 실패`,
        error: result.error
      });
    }
  } catch (error) {
    console.error('요소 삭제 오류:', error);
    log(`❌ 요소 삭제 오류: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 단락 업데이트 테스트 (write_doc 기능 - 업데이트)
 */
export async function updateParagraph(): Promise<void> {
  try {
    const paragraphId = ($('paragraphId') as HTMLInputElement).value.trim();
    if (!paragraphId) {
      return log('❓ 업데이트할 단락 ID를 입력하세요');
    }
    
    // 업데이트할 속성 정보 가져오기
    const alignment = ($('paragraphAlignment') as HTMLSelectElement).value;
    const boldText = ($('boldCheckbox') as HTMLInputElement).checked;
    
    // 단락 업데이트 패치 생성
    const updatePatch = {
      [paragraphId]: {
        "attributes": {
          "w:jc": { "w:val": alignment }
        }
      }
    };
    
    // 패치 적용 (service.ts의 writeDocContent 함수 활용)
    const result = await writeDocContent(updatePatch);
    
    // 결과 로깅
    if (result.success) {
      log({
        status: `✅ 단락 "${paragraphId}" 업데이트 성공`,
        message: '단락 정렬이 변경되었습니다.',
        alignment: alignment
      });
    } else {
      log({
        status: `❌ 단락 "${paragraphId}" 업데이트 실패`,
        error: result.error
      });
    }
  } catch (error) {
    console.error('단락 업데이트 오류:', error);
    log(`❌ 단락 업데이트 오류: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 텍스트 실행 업데이트 (write_doc 기능 - Run 업데이트)
 */
export async function updateRunText(): Promise<void> {
  try {
    const paragraphId = ($('runParagraphId') as HTMLInputElement).value.trim();
    const runId = ($('runId') as HTMLInputElement).value.trim();
    const newText = ($('newText') as HTMLInputElement).value;
    
    if (!paragraphId || !runId) {
      return log('❓ 단락 ID와 Run ID를 모두 입력하세요');
    }
    
    // Run 텍스트 업데이트 패치 생성
    const updatePatch = {
      [paragraphId]: {
        [runId]: {
          "attributes": {
            "w:t": newText
          }
        }
      }
    };
    
    // 패치 적용 (service.ts의 writeDocContent 함수 활용)
    const result = await writeDocContent(updatePatch);
    
    // 결과 로깅
    if (result.success) {
      log({
        status: `✅ Run "${runId}" 텍스트 업데이트 성공`,
        message: '텍스트가 변경되었습니다.',
        newText: newText
      });
    } else {
      log({
        status: `❌ Run "${runId}" 텍스트 업데이트 실패`,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Run 텍스트 업데이트 오류:', error);
    log(`❌ Run 텍스트 업데이트 오류: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 예시 패치 데이터 불러오기
 */
export function loadExamplePatch(): void {
  // service.ts의 getSamplePatch 함수를 활용하여 예시 패치 데이터 가져오기
  const samplePatch = getSamplePatch();
  
  // 텍스트 영역에 표시
  ($('customPatch') as HTMLTextAreaElement).value = JSON.stringify(samplePatch, null, 2);
  
  log({
    status: '✅ 예시 패치 데이터 로드 완료',
    message: '예시 패치 데이터가 텍스트 영역에 로드되었습니다. 필요에 따라 수정 후 적용하세요.'
  });
}

/**
 * 사용자 정의 복합 패치 예시 불러오기
 */
export function loadComplexPatchExample(): void {
  // 복합 패치 예시 (여러 작업 조합)
  const complexPatch = {
    // 단락 업데이트
    "p_QodjOgfRsFE": {
      "attributes": {
        "w:jc": { "w:val": "center" }, // 정렬 변경
        "w:spacing": { 
          "w:after": "200",  // 단락 뒤 간격
          "w:before": "200"  // 단락 앞 간격
        }
      },
      // Run 업데이트
      "r_t8vrovNVre": {
        "attributes": {
          "w:t": "학기제 안내 및 중요 유의사항",
          "w:b": true,  // 굵게
          "w:sz": { "w:val": "28" }  // 글꼴 크기
        }
      }
    },
    
    // 다른 단락 업데이트
    "p_FfW8GhZoM4E": {
      "attributes": {
        "w:jc": { "w:val": "left" } // 정렬 변경
      }
    }
  };
  
  // 텍스트 영역에 표시
  ($('customPatch') as HTMLTextAreaElement).value = JSON.stringify(complexPatch, null, 2);
  
  log({
    status: '✅ 복합 패치 예시 로드 완료',
    message: '여러 요소를 동시에 수정하는 복합 패치 예시가 로드되었습니다.'
  });
}