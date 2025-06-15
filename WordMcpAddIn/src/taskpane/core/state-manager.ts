export let cachedDocumentJson: Record<string, any> = {};

// 문서 상태 저장 함수 개선
/**
 * 문서 JSON 상태 저장
 * @param json 저장할 JSON 객체
 */
export function saveDocumentState(json: Record<string, any>): void {
  try {
    // 저장 전에 메타 정보 추가
    // json._meta = {
    //   version: "1.0",
    //   timestamp: new Date().toISOString(),
    //   documentUrl: Office.context.document.url || "unknown"
    // };
    
    // _idMapping은 더 이상 필요하지 않으므로 제거
    // Content Control의 w:tag 값이 직접 JSON의 키로 사용되므로 매핑이 불필요
    if (json._idMapping) {
      delete json._idMapping;
    }
    
    console.log("문서 상태 저장 (요소 수):", Object.keys(json).filter(key => !key.startsWith('_')).length);
    
    // Office 문서 설정에 저장
    Office.context.document.settings.set('documentJsonStructure', json);
    Office.context.document.settings.saveAsync();
    
    // 백업용 로컬 스토리지 저장
    const documentId = Office.context.document.url || 'current-document';
    localStorage.setItem(`document-${documentId}-json`, JSON.stringify(json));
  } catch (error) {
    console.error("문서 상태 저장 중 오류:", error);
  }
}

// 문서 상태 불러오기
export function loadDocumentState(): Record<string, any> {
  try {
    // 먼저 Office 설정에서 불러오기 시도
    const savedJson = Office.context.document.settings.get('documentJsonStructure');
    if (savedJson) {
      cachedDocumentJson = savedJson;
      return savedJson;
    }
    
    // 실패하면 로컬 스토리지 백업 시도
    const documentId = Office.context.document.url || 'current-document';
    const backupJson = localStorage.getItem(`document-${documentId}-backup`);
    if (backupJson) {
      const parsed = JSON.parse(backupJson);
      cachedDocumentJson = parsed;
      return parsed;
    }
    
    return {};
  } catch (error) {
    console.error('Error loading document state:', error);
    return {};
  }
}
