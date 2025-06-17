// src/adapters/excel.adapter.ts

import { IDocumentAdapter } from './adapter.interface';
import { excelConfig } from '../configs/excel.config';
import { processExcelWorkbook, processExcelSheet, processExcelStyles, processSharedStrings } from '../core/processing/processing-engine-excel';
import { applyPatchesToDom } from '../core/patch/patch-engine-excel';
import * as XmlUtils from '../core/xml-utils';
import * as JsonUtils from '../core/json-utils';
import { loadDocumentState, saveDocumentState } from '../core/state-manager';
import JSZip from 'jszip';
import { Operation, compare } from 'fast-json-patch';

export class ExcelAdapter implements IDocumentAdapter {
    private readonly config = excelConfig;

    public async getDocumentSnapshot(): Promise<any> {
      return Excel.run(async () => {
          const parts = await this._getWorkbookParts();
          const workbookXml = await parts.get('xl/workbook.xml')?.async('string');
          const stylesXml = await parts.get('xl/styles.xml')?.async('string');
          const sharedStringsXml = await parts.get('xl/sharedStrings.xml')?.async('string');
          const workbookRelsXml = await parts.get('xl/_rels/workbook.xml.rels')?.async('string');
          console.log("[ExcelAdapter] Document snapshot created successfully.", XmlUtils.formatXML(workbookXml));
          console.log("[ExcelAdapter] Styles XML:", XmlUtils.formatXML(stylesXml));
          console.log("[ExcelAdapter] Shared Strings XML:", XmlUtils.formatXML(sharedStringsXml));
          console.log("[ExcelAdapter] Workbook Rels XML:", XmlUtils.formatXML(workbookRelsXml));

          if (!workbookXml || !stylesXml || !workbookRelsXml) throw new Error("Core workbook parts not found.");
          
          // ✅ 각 전용 함수를 호출합니다. 더 이상 config 객체를 전달할 필요가 없습니다.
          const { stylesJson, xmlIndexToStyleIdMap } = processExcelStyles(stylesXml);
          const sharedStrings = sharedStringsXml ? processSharedStrings(sharedStringsXml) : [];
          const { sheetOrder, sheetRels } = processExcelWorkbook(workbookXml, workbookRelsXml);

          const sheetsJson: Record<string, any> = {};
          for (const rel of sheetRels) {
              const sheetPath = rel.target.startsWith('worksheets/') ? `xl/${rel.target}` : rel.target;
              const sheetXml = await parts.get(sheetPath)?.async('string');
              console.log("[ExcelAdapter] Processing sheetXml:", XmlUtils.formatXML(sheetXml));
              if (sheetXml) {
                  const sheetData = processExcelSheet(sheetXml, sharedStrings, xmlIndexToStyleIdMap);
                  sheetsJson[rel.id] = { name: rel.name, ...sheetData };
              }
          }
          
          const finalJson = {
              workbookName: this._getWorkbookName(),
              sheetOrder,
              sheetRels,
              styles: stylesJson,
              sheets: sheetsJson,
          };

          saveDocumentState(finalJson);
          return finalJson;
      });
    }
    /**
     * ✅ 수정: Excel.run() 래퍼를 제거하고 순수 async 함수로 변경합니다.
     */
    public async applyDocumentPatch(mergePatch: any): Promise<void> { // 인자 이름을 mergePatch로 변경하여 명확화
      return Excel.run(async () => {
          console.log("[ExcelAdapter] Applying patch via DOM modification...");

          // 1. 원본 JSON과 mergePatch를 이용해 targetJson 계산
          const originalJson = loadDocumentState();
          const targetJson = JsonUtils.robustApplyMergePatchRecursive(originalJson, mergePatch);
          console.log("[ExcelAdapter] Target JSON calculated.");

          // ✅ 2. [수정] 누락되었던 Operation 배열 생성 단계 추가!
          // originalJson과 targetJson을 비교하여 실제 작업 목록(배열)을 생성합니다.
          const operations: Operation[] = compare(originalJson, targetJson);
          if (operations.length === 0) {
              console.log("[ExcelAdapter] No effective changes to apply.");
              return; // 변경사항 없으면 종료
          }
          console.log("[ExcelAdapter] Patch operations generated:", operations);

          // 3. 원본 파트를 DOM 객체로 변환
          const originalPartsZip = await this._getWorkbookParts();
          const originalPartsDOM = new Map<string, Document>();
          const parser = new DOMParser();
          const promises = Array.from(originalPartsZip.entries()).map(async ([path, fileObject]) => {
              if (path.endsWith('.xml') || path.endsWith('.rels')) {
                  const xmlString = await fileObject.async('string');
                  originalPartsDOM.set(path, parser.parseFromString(xmlString, "text/xml"));
              }
          });
          await Promise.all(promises);
          console.log("[ExcelAdapter] Original parts parsed into DOMs.");

          // ✅ 4. [수정] 패치 엔진에 'mergePatch' 객체가 아닌, 'operations' 배열을 전달합니다.
          applyPatchesToDom(
              originalPartsDOM,
              operations, // <--- 이 부분이 수정되었습니다.
              targetJson,
              this.config
          );
          console.log("[ExcelAdapter] DOM patching completed.");
          
          // 5. 수정된 DOM 객체를 다시 XML 문자열로 변환
          const updatedPartsString = new Map<string, string>();
          const serializer = new XMLSerializer();
          originalPartsDOM.forEach((dom, path) => {
              const xmlString = serializer.serializeToString(dom);
              updatedPartsString.set(path, xmlString);
          });

          // 6. 업데이트된 문자열 맵을 사용하여 문서 업데이트
          await this._setWorkbookParts(updatedPartsString, originalPartsZip);
          
          console.log("[ExcelAdapter] Workbook patch applied successfully.");
          
          // 7. 최종 상태 스냅샷 저장
          await this.getDocumentSnapshot();
      });
  }
    // --- Private Helper Functions (변경 없음) ---
    
    private _getWorkbookName(): string {
        const url = Office.context.document.url;
        if (!url) return "Untitled.xlsx";
        return url.substring(Math.max(url.lastIndexOf('/'), url.lastIndexOf('\\')) + 1);
    }

    private _getWorkbookAsByteArray(): Promise<Uint8Array> {
      return new Promise((resolve, reject) => {
          const options = { sliceSize: 65536 };
  
          Office.context.document.getFileAsync(Office.FileType.Compressed, options, (result) => {
              if (result.status === Office.AsyncResultStatus.Failed) {
                  return reject(result.error);
              }
  
              const file = result.value;
              const totalSlices = file.sliceCount;
              let content = "";
              
              const getSlices = (sliceIndex: number) => {
                  file.getSliceAsync(sliceIndex, (sliceResult) => {
                      if (sliceResult.status === Office.AsyncResultStatus.Succeeded) {
                          content += sliceResult.value.data;
  
                          if (sliceIndex + 1 >= totalSlices) {
                              file.closeAsync();
                              try {
                                  // "80,75,3,4,..." 형태의 바이트 문자열을 실제 Uint8Array로 변환
                                  const byteCharacters = content.split(',');
                                  if (byteCharacters.length === 1 && byteCharacters[0] === '') {
                                      // 빈 파일의 경우 빈 배열 반환
                                      resolve(new Uint8Array());
                                      return;
                                  }
  
                                  const byteNumbers = new Array(byteCharacters.length);
                                  for (let i = 0; i < byteCharacters.length; i++) {
                                      byteNumbers[i] = parseInt(byteCharacters[i], 10);
                                  }
                                  const byteArray = new Uint8Array(byteNumbers);
                                  resolve(byteArray);
                              } catch (e) {
                                  reject(new Error("Failed to parse byte string from Office API. " + e));
                              }
                          } else {
                              getSlices(sliceIndex + 1);
                          }
                      } else {
                          file.closeAsync();
                          reject(sliceResult.error);
                      }
                  });
              };
              getSlices(0);
          });
      });
  }
  

  private async _getWorkbookParts(): Promise<Map<string, JSZip.JSZipObject>> {
    const byteArray = await this._getWorkbookAsByteArray();
    console.log(`[ExcelAdapter] Workbook byte array retrieved successfully. Length: ${byteArray.length}`);

    if (!byteArray || byteArray.length === 0) {
        throw new Error("Failed to get workbook byte array. It was empty.");
    }

    // ✅ 핵심 수정: JSZip이 base64가 아닌, 바이너리 데이터를 직접 로드하도록 합니다.
    const zip = await JSZip.loadAsync(byteArray);
    
    const parts = new Map<string, JSZip.JSZipObject>();
    zip.forEach((relativePath, fileObject) => {
        if (!fileObject.dir) parts.set(relativePath, fileObject);
    });
    return parts;
  }
    
    private async _setWorkbookParts(updatedParts: Map<string, string>, originalParts: Map<string, JSZip.JSZipObject>): Promise<void> {
        const newZip = new JSZip();

        console.log("updatedParts:", updatedParts);
        console.log("originalParts:", originalParts);

        const promises: Promise<void>[] = [];
        originalParts.forEach((file, path) => {
            if (!updatedParts.has(path)) {
                promises.push(
                    (async () => {
                        const buffer = await file.async('arraybuffer');
                        console.log("path:", path, "buffer length:", buffer.byteLength);
                        newZip.file(path, buffer);
                    })()
                );
            }
        });
        await Promise.all(promises);

        updatedParts.forEach((content, path) => {
          console.log("Adding updated part:", path, "content", XmlUtils);
            newZip.file(path, content);
        });

        const newBase64 = await newZip.generateAsync({ type: "base64", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        console.log("newBase64:", newBase64);
        return new Promise((resolve, reject) => {
            Office.context.document.setSelectedDataAsync(newBase64, { coercionType: Office.CoercionType.Ooxml }, res => {
                if (res.status === Office.AsyncResultStatus.Succeeded) {
                    resolve();
                } else {
                    reject(res.error);
                }
            });
        });
    }
}