// src/adapters/excel.adapter.ts

import { IDocumentAdapter, } from './adapter.interface';
import { excelConfig } from '../configs/excel.config';
import { compare, Operation } from 'fast-json-patch';
import type { IHostConfig } from '../configs/config.interface';
import { processExcelWorkbook, processExcelSheet, processExcelStyles, processSharedStrings } from '../core/processing/processing-engine-excel';
import { applyPatchToMultiPart } from '../core/patch/patch-engine-excel';
import * as XmlUtils from '../core/xml-utils';
import * as JsonUtils from '../core/json-utils';
import { loadDocumentState, saveDocumentState } from '../core/state-manager';
import JSZip from 'jszip';

export class ExcelAdapter implements IDocumentAdapter {
    private readonly config = excelConfig;

    public async getDocumentSnapshot(): Promise<any> {
      return Excel.run(async () => {
          const parts = await this._getWorkbookParts();
          const workbookXml = await parts.get('xl/workbook.xml')?.async('string');
          const stylesXml = await parts.get('xl/styles.xml')?.async('string');
          const sharedStringsXml = await parts.get('xl/sharedStrings.xml')?.async('string');
          const workbookRelsXml = await parts.get('xl/_rels/workbook.xml.rels')?.async('string');

          if (!workbookXml || !stylesXml || !workbookRelsXml) throw new Error("Core workbook parts not found.");
          
          // ✅ 각 전용 함수를 호출합니다. 더 이상 config 객체를 전달할 필요가 없습니다.
          const { stylesJson, xmlIndexToStyleIdMap } = processExcelStyles(stylesXml);
          const sharedStrings = sharedStringsXml ? processSharedStrings(sharedStringsXml) : [];
          const { sheetOrder, sheetRels } = processExcelWorkbook(workbookXml, workbookRelsXml);

          const sheetsJson: Record<string, any> = {};
          for (const rel of sheetRels) {
              const sheetPath = rel.target.startsWith('worksheets/') ? `xl/${rel.target}` : rel.target;
              const sheetXml = await parts.get(sheetPath)?.async('string');
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
    public async applyDocumentPatch(patch: any): Promise<void> {
      return Excel.run(async (context) => {
          console.log("[ExcelAdapter] Applying patch via API calls...");

          const originalJson = loadDocumentState();
          const targetJson = JsonUtils.robustApplyMergePatchRecursive(originalJson, patch);

          // 1. Patch Engine으로부터 API 호출 계획을 생성합니다.
          const executionPlan = generateApiExecutionPlan(originalJson, targetJson, this.config);
          console.log("[ExcelAdapter] Execution plan generated:", executionPlan);
          // 2. 실행 계획에 따라 실제 API를 호출합니다.
          for (const call of executionPlan) {
              if (call.type === 'cell') {
                  const sheet = context.workbook.worksheets.getItem(call.sheet);
                  const range = sheet.getRange(call.address);
                  
                  const cellData = call.data;
                  if (!cellData) { // 셀이 삭제된 경우 (JSON에서 키가 없어짐)
                      range.clear();
                      continue;
                  }

                  // Office.js API를 사용하여 각 속성을 설정
                  range.values = [[cellData.value]];
                  if(cellData.formula) range.formulas = [[cellData.formula]];
                  if(cellData.numberFormat) range.numberFormat = [[cellData.numberFormat]];
                  
                  if (cellData.styleId && targetJson.styles[cellData.styleId]) {
                      const style = targetJson.styles[cellData.styleId];
                      if (style.font) range.format.font.set(style.font);
                      if (style.fill) range.format.fill.color = style.fill.fgColor;
                      if (style.alignment) range.format.horizontalAlignment = style.alignment.horizontal;
                  }
              }
              // TODO: 병합, 시트 순서 변경 등 다른 타입의 API 호출 처리
          }

          // 3. 큐에 쌓인 모든 변경사항을 한 번에 실행합니다.
          await context.sync();
          
          console.log("[ExcelAdapter] Patch applied successfully via API.");
          await this.getDocumentSnapshot(); // 최종 상태 저장
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
          console.log("Adding updated part:", path, "content", XmlUtils.formatXML(content));
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

// ✅ API 호출을 위한 실행 계획의 타입 정의
export type ApiCall = 
    { type: 'cell', sheet: string, address: string, data: any } |
    { type: 'merge', sheet: string, address: string, action: 'merge' | 'unmerge' } |
    { type: 'sheet_order', order: string[] };

/**
 * [최종] JSON 변경사항을 분석하여 필요한 Excel API 호출 목록을 생성합니다.
 */
export function generateApiExecutionPlan(
  originalJson: any,
  targetJson: any,
  config: IHostConfig
): ApiCall[] {
  const operations = compare(originalJson, targetJson);
  const executionPlan: ApiCall[] = [];

  for (const op of operations) {
    const path = op.path.split('/'); // 예: ["", "sheets", "sheet1", "cells", "A1", "value"]
    if (path[1] === 'sheets' && path[3] === 'cells') {
        const sheetId = path[2];
        const cellAddress = path[4];
        // 셀 변경 작업을 요약하여 계획에 추가 (중복 방지 필요)
        if (!executionPlan.some(p => p.type === 'cell' && p.sheet === sheetId && p.address === cellAddress)) {
            executionPlan.push({
                type: 'cell',
                sheet: targetJson.sheets[sheetId].name,
                address: cellAddress,
                data: targetJson.sheets[sheetId].cells[cellAddress]
            });
        }
    }
    // TODO: merges, sheetOrder 변경에 대한 실행 계획 추가
  }
  return executionPlan;
}

