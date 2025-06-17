// src/adapters/powerpoint.adapter.ts ('되돌리기' 기능 테스트용)

import { IDocumentAdapter } from './adapter.interface';
import { powerpointConfig } from '../configs/powerpoint.config';

export class PowerPointAdapter implements IDocumentAdapter {
    private readonly config = powerpointConfig;

    /**
     * [더미 구현] 이 테스트에서는 사용하지 않습니다.
     */
    public async getDocumentSnapshot(): Promise<any> {
        console.log("[Undo-Test] getDocumentSnapshot called (dummy).");
        return { status: "This is a dummy snapshot for the Undo test." };
    }

    /**
     * [테스트용 핵심 구현]
     * 현재 선택한 도형의 텍스트를 API로 변경하여,
     * 이 작업이 '되돌리기' 스택에 기록되는지 테스트합니다.
     */
    public async applyDocumentPatch(patch: any): Promise<void> {
        console.log("=============================================");
        console.log("🚀 '되돌리기(Undo)' 테스트를 시작합니다.");
        console.log("=============================================");

        // 변경할 텍스트를 미리 정의합니다.
        const newText = `✅ API Test Successful! (Timestamp: ${new Date().toLocaleTimeString()})`;
        
        console.log(`📄 선택된 도형의 텍스트를 "${newText}" (으)로 변경합니다...`);

        return new Promise((resolve, reject) => {
            Office.context.document.setSelectedDataAsync(
                newText,
                { coercionType: Office.CoercionType.Text },
                (result) => {
                    if (result.status === Office.AsyncResultStatus.Failed) {
                        const errorMsg = `❌ TEST ACTION FAILED: setSelectedDataAsync failed. Error: ${result.error.message}`;
                        console.error(errorMsg);
                        reject(new Error(errorMsg));
                        return;
                    }

                    console.log("🎉 TEST ACTION COMPLETE: 텍스트가 성공적으로 변경되었습니다.");
                    console.log("🔔 지금 바로 PowerPoint에서 '되돌리기' (Ctrl+Z 또는 Cmd+Z)를 실행하여 텍스트가 원래대로 돌아오는지 확인해주세요.");
                    resolve();
                }
            );
        });
    }
}