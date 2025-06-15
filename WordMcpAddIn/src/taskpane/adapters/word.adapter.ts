// src/adapters/word.adapter.ts

import { IDocumentAdapter } from './adapter.interface';
import { wordConfig } from '../configs/word.config';
import { processXmlToJson } from '../core/processing/processing-engine-word';
import { applyPatchToSingleXml } from '../core/patch/patch-engine-word';
import * as XmlUtils from '../core/xml-utils';
import * as JsonUtils from '../core/json-utils'; // 가정: JSON 유틸로 분리
import { loadDocumentState, saveDocumentState } from '../core/state-manager';

export class WordAdapter implements IDocumentAdapter {
    private readonly config = wordConfig;

    /**
     * Word 문서의 전체 구조를 분석하여 JSON 스냅샷으로 반환합니다.
     */
    public async getDocumentSnapshot(): Promise<any> {
        return Word.run(async (context) => {
            console.log("[WordAdapter] Getting document snapshot...");

            // 1. 현재 문서의 OOXML 가져오기
            const ooxmlResult1 = context.document.body.getOoxml();
            await context.sync();
            const flatXml = ooxmlResult1.value;
            const mainPartXml = XmlUtils.extractMainPart(flatXml, this.config.mainPartPath);
            
            // 2. 범용 엔진으로 XML을 JSON으로 변환하고, ID가 부여된 XML 생성
            const existingJson = loadDocumentState();
            const { json: processedJson, xml: xmlWithIds } = processXmlToJson(mainPartXml, this.config, existingJson);
            
            // 3. ID가 부여된 XML을 문서에 다시 삽입하여 ID 확정
            const updatedFlatXml = XmlUtils.replaceMainPart(flatXml, xmlWithIds, this.config.mainPartPath);
            context.document.body.insertOoxml(updatedFlatXml, Word.InsertLocation.replace);
            await context.sync();
            console.log("[WordAdapter] Document updated with IDs.");

            // 4. 최종적으로 확정된 문서에서 다시 스냅샷 생성
            const ooxmlResult2 = context.document.body.getOoxml();
            await context.sync();
            const finalFlatXml = ooxmlResult2.value;
            
            const finalMainPartXml = XmlUtils.extractMainPart(finalFlatXml, this.config.mainPartPath);
            const { json: finalJson } = processXmlToJson(finalMainPartXml, this.config);

            saveDocumentState(finalJson);
            console.log("[WordAdapter] Snapshot created successfully.");
            return finalJson;
        });
    }

    /**
     * JSON Merge Patch를 Word 문서에 적용합니다.
     */
    public async applyDocumentPatch(patch: any): Promise<void> {
        return Word.run(async (context) => {
            console.log("[WordAdapter] Applying document patch...");

            // 1. 현재 문서 상태로부터 원본 JSON 및 ID가 부여된 XML 생성
            const ooxmlResult = context.document.body.getOoxml();
            await context.sync();
            const flatXml = ooxmlResult.value;

            const mainPartXml = XmlUtils.extractMainPart(flatXml, this.config.mainPartPath);
            const { json: originalJson, xml: xmlWithIds } = processXmlToJson(mainPartXml, this.config, loadDocumentState());
            
            console.log("patch:", patch);
            // 2. 범용 엔진을 사용해 XML 수정
            // const targetJson = JsonUtils.robustApplyMergePatchRecursive(originalJson, patch);

            const updatedMainPartXml = applyPatchToSingleXml(xmlWithIds, originalJson, patch, this.config);
            
            // 3. 수정된 XML을 문서에 적용
            const finalFlatXml = XmlUtils.replaceMainPart(flatXml, updatedMainPartXml, this.config.mainPartPath);
            context.document.body.insertOoxml(finalFlatXml, Word.InsertLocation.replace);
            await context.sync();
            
            console.log("[WordAdapter] Patch applied successfully.");

            // 4. [선택적] Word 렌더링에 따른 추가 XML 재구성 작업
            const finalDocXml = await this.recomposeSdtContent(context);
            
            // 5. 최종적으로 재구성된 XML을 다시 문서에 적용
            const finalFlatOpcXmlToSave = XmlUtils.replaceMainPart(flatXml, finalDocXml, this.config.mainPartPath);
            context.document.body.clear();
            await context.sync();
            context.document.body.insertOoxml(finalFlatOpcXmlToSave, Word.InsertLocation.replace);
            await context.sync();
            console.log("[WordAdapter] Document successfully updated after potential recomposition.");

            // 6. 변경된 최종 상태를 기반으로 스냅샷을 다시 만들어 상태를 저장
            await this.getDocumentSnapshot();
        });
    }

    /**
     * [개선] Word 렌더링 특성으로 인해 발생하는 sdtContent 내 여러 run들을 재구성하는 로직
     * @param context Word 실행 컨텍스트
     * @returns 재구성된 메인 파트 XML 문자열
     */
    private async recomposeSdtContent(context: Word.RequestContext): Promise<string> {
        const ooxmlResult = context.document.body.getOoxml();
        await context.sync();
        let finalDocXml = XmlUtils.extractMainPart(ooxmlResult.value, this.config.mainPartPath);

        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(finalDocXml, "application/xml");
            if (xmlDoc.getElementsByTagName("parsererror").length > 0) throw new Error("XML parsing error");

            const allSdtElements = Array.from(xmlDoc.getElementsByTagName("w:sdt"));
            let sdtModified = false;

            for (const sdtElement of allSdtElements) {
                const sdtPrNode = sdtElement.getElementsByTagName("w:sdtPr")[0];
                const sdtContentNode = sdtElement.getElementsByTagName("w:sdtContent")[0];

                if (!sdtPrNode || !sdtContentNode) continue;

                const originalTagNode = sdtPrNode.getElementsByTagName("w:tag")[0];
                const originalAliasNode = sdtPrNode.getElementsByTagName("w:alias")[0];
                // ✅ 수정: getAttribute("w:val") 사용
                const originalTagVal = originalTagNode ? originalTagNode.getAttribute("w:val") : null;
                const originalAliasVal = originalAliasNode ? originalAliasNode.getAttribute("w:val") : null;
                const originalOrderKey = originalAliasVal ? originalAliasVal.substring(originalAliasVal.lastIndexOf("__") + 2) : "a0";

                const directChildren = Array.from(sdtContentNode.children).filter(child => child.nodeName === 'w:r');
                
                if (directChildren.length > 1) {
                    sdtModified = true;
                    console.log(`Recomposing SDT with tag '${originalTagVal}' which has ${directChildren.length} direct children in sdtContent.`);

                    const parentOfSdt = sdtElement.parentNode;
                    if (!parentOfSdt) continue;

                    // 기존 sdtContent에서 두 번째 자식부터 모두 제거
                    for (let i = 1; i < directChildren.length; i++) {
                        if (directChildren[i].parentNode === sdtContentNode) {
                          sdtContentNode.removeChild(directChildren[i]);
                        }
                    }

                    // 분리된 자식들을 새로운 SDT로 감싸서 추가
                    let currentSibling = sdtElement;
                    for (let i = 1; i < directChildren.length; i++) {
                        const childToWrap = directChildren[i];
                        const newSdtId = `recomposed_${originalTagVal || 'sdt'}_${i}`; // 예측 가능한 태그 이름 생성
                        const newOrderKey = originalOrderKey.slice(0, -1) + String.fromCharCode(originalOrderKey.charCodeAt(originalOrderKey.length - 1) + i);
                        
                        // ✅ 수정: createElement("w:...") 사용
                        const newSdtWrapper = xmlDoc.createElement("w:sdt");
                        const newSdtPr = xmlDoc.createElement("w:sdtPr");
                        const newSdtContent = xmlDoc.createElement("w:sdtContent");

                        // 새 SDT 속성 설정
                        const newAlias = xmlDoc.createElement("w:alias");
                        const childTagName = childToWrap.tagName.toLowerCase(); // 예: "w:p", "w:r"
                        const elementType = this.config.tagToType[childTagName] || (childTagName.endsWith(':p') ? 'paragraph' : 'run');
                        newAlias.setAttribute("w:val", `${elementType} ${newSdtId}__${newOrderKey}`);
                        newSdtPr.appendChild(newAlias);

                        const newTag = xmlDoc.createElement("w:tag");
                        newTag.setAttribute("w:val", newSdtId);
                        newSdtPr.appendChild(newTag);

                        const newIdNode = xmlDoc.createElement("w:id");
                        newIdNode.setAttribute("w:val", String(Math.floor(Math.random() * (2**31 - 1)) * (Math.random() < 0.5 ? 1 : -1)));
                        newSdtPr.appendChild(newIdNode);

                        newSdtPr.appendChild(xmlDoc.createElement("w:showingPlcHdr"));
                        newSdtPr.appendChild(xmlDoc.createElement("w:richText"));

                        newSdtWrapper.appendChild(newSdtPr);
                        newSdtContent.appendChild(childToWrap);
                        newSdtWrapper.appendChild(newSdtContent);

                        parentOfSdt.insertBefore(newSdtWrapper, currentSibling.nextSibling);
                        currentSibling = newSdtWrapper;
                    }
                }
            }

            if (sdtModified) {
                const serializer = new XMLSerializer();
                finalDocXml = serializer.serializeToString(xmlDoc.documentElement);
                console.log("[WordAdapter] Document.xml recomposed due to multiple children in sdtContent.");
            }
        } catch (recompositionError) {
            console.error("Error during SDT recomposition:", recompositionError);
        }
        return finalDocXml;
    }
}