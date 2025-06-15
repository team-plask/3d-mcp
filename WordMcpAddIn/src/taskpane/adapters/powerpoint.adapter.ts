import { IDocumentAdapter } from './adapter.interface';
// import { powerpointConfig } from '../configs/powerpoint.config';

export class PowerPointAdapter implements IDocumentAdapter {
    /**
     * [제한적 구현] 현재 슬라이드의 선택된 내용을 가져옵니다.
     * PowerPoint JavaScript API는 전체 문서의 모든 Shape을 순회하는 직접적인 방법을 제공하지 않습니다.
     * 완전한 구현을 위해서는 OOXML을 직접 파싱하는 복잡한 과정이 필요합니다.
     */
    public async getDocumentSnapshot(): Promise<any> {
        console.warn("[PowerPointAdapter] getDocumentSnapshot provides a limited view (selected object only) due to API constraints.");
        return new Promise((resolve, reject) => {
            Office.context.document.getSelectedDataAsync(Office.CoercionType.Ooxml, (result) => {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    console.log("[PowerPointAdapter] Got OOXML for selected shape.");
                    // 실제 구현에서는 이 OOXML을 파싱하여 JSON을 생성해야 합니다.
                    // 여기서는 예시로 XML 문자열 자체를 반환합니다.
                    resolve({ selectedOoxml: result.value });
                } else {
                    reject(result.error);
                }
            });
        });
    }

    /**
     * [제한적 구현] 새로운 텍스트 상자를 삽입하는 예시입니다.
     * 기존 Shape을 ID로 찾아 수정하는 기능은 API에서 직접 지원하지 않으므로,
     * OOXML을 직접 수정하여 전체 슬라이드를 교체하는 방식이 필요할 수 있습니다.
     */
    public async applyDocumentPatch(patch: any): Promise<void> {
        console.warn("[PowerPointAdapter] applyDocumentPatch is a simplified example (inserting text).");
        return new Promise((resolve, reject) => {
            const textToInsert = patch.newText || "Patched Text";
            Office.context.document.setSelectedDataAsync(textToInsert, (result) => {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    console.log("[PowerPointAdapter] Text inserted/updated successfully.");
                    resolve();
                } else {
                    reject(result.error);
                }
            });
        });
    }
}