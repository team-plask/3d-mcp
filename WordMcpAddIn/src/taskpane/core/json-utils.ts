export function robustApplyMergePatchRecursive(
    original: any,
    patch: any
  ): any {
    if (patch === null) {
      return undefined; 
    }
    if (typeof patch !== 'object' || Array.isArray(patch) || patch === null) {
      return patch;
    }
    
    const SPREADSHEET_TARGET: Record<string, any> = (typeof original === 'object' && original !== null && !Array.isArray(original))
      ? JSON.parse(JSON.stringify(original))
      : {};
  
    for (const key in patch) {
      if (!patch.hasOwnProperty(key)) continue;
  
      const patchValue = patch[key];
    //   console.log(`Processing key: ${key}, patchValue:`, patchValue);
      
      // ✅ [핵심 수정] original의 최상위 레벨에 키가 있는지 먼저 확인
      let originalValueForKey = original ? original[key] : undefined;
  
      // 만약 최상위에 없다면, original 객체 전체를 재귀적으로 탐색하여 찾아봅니다.
      if (originalValueForKey === undefined && typeof original === 'object' && original !== null) {
          originalValueForKey = findObjectInNestedJson(original, key);
      }
  
      if (patchValue === null) {
        // 삭제는 `compare`가 처리하므로, 여기서는 단순히 키를 제거하는 것으로 충분할 수 있습니다.
        // 하지만, 중첩된 객체 내의 키를 삭제하려면 더 복잡한 로직이 필요합니다.
        // 현재 시나리오는 add/replace가 문제이므로, null 처리는 기존 로직을 유지합니다.
        delete SPREADSHEET_TARGET[key];
      } else {
        // 찾은 originalValue(중첩된 위치에 있더라도)를 기반으로 재귀 호출합니다.
        SPREADSHEET_TARGET[key] = robustApplyMergePatchRecursive(originalValueForKey, patchValue);
        // console.log(`Updated key: ${key}, new value:`, SPREADSHEET_TARGET[key]);
      }
    }
  
    // 원본에만 있고 패치에 없는 키는 그대로 유지됩니다 (초기 복사로 처리됨).
    
    return SPREADSHEET_TARGET;
}

export function findObjectInNestedJson(obj: any, id: string): any | null {
    if (typeof obj !== 'object' || obj === null) {
      return null;
    }
    if (obj.hasOwnProperty(id)) {
      return obj[id];
    }
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const found = findObjectInNestedJson(obj[key], id);
        if (found) {
          return found;
        }
      }
    }
    return null;
}
  