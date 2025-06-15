// src/core/patch-engine-excel.ts

import { compare, Operation } from 'fast-json-patch';
import type { IHostConfig } from '../../configs/config.interface';
import * as JsonUtils from '../json-utils';
import * as XmlUtils from '../xml-utils';
// src/core/patch-engine-excel.ts

/**
 * [Excel용 메인 함수] JSON 변경사항을 기반으로 수정이 필요한 모든 XML 파트들의
 * 새로운 내용을 생성하여 맵 형태로 반환합니다.
 */
export function applyPatchToMultiPart(
  originalParts: Map<string, string>,
  originalJson: Record<string, any>,
  targetJson: Record<string, any>,
  config: IHostConfig
): Map<string, string> {
  const updatedParts = new Map<string, string>();
  const operations = compare(originalJson, targetJson);
  if (operations.length === 0) return updatedParts;

  console.log("[Excel Patch Engine] Operations to apply:", operations);
  // 스타일, 공유문자열, 시트 데이터는 서로 영향을 주므로,
  // 관련 변경이 하나라도 있으면 모두 다시 빌드하는 것이 가장 안정적입니다.
  const styleOps = operations.some(op => op.path.startsWith('/styles'));
  const sheetOps = operations.some(op => op.path.startsWith('/sheets'));

  console.log("[Excel Patch Engine] Style operations:", styleOps, "Sheet operations:", sheetOps);
  if (styleOps || sheetOps) {
    // 1. 스타일(styles.xml) 재생성 및 새 스타일 맵 확보
    const { xml: newStylesXml, styleMap } = rebuildStylesXml(targetJson.styles, config);
    console.log("[Excel Patch Engine] New styles XML generated.", XmlUtils.formatXML(newStylesXml));
    updatedParts.set('/xl/styles.xml', newStylesXml);
    
    // 2. 공유 문자열(sharedStrings.xml) 재생성 및 새 문자열 맵 확보
    const allStrings = getAllStringCellValues(targetJson.sheets);
    console.log("[Excel Patch Engine] All string cell values collected:", allStrings);
    const { xml: newSharedStringsXml, stringMap } = rebuildSharedStringsXml(allStrings, config);
    console.log("[Excel Patch Engine] New shared strings XML generated.", XmlUtils.formatXML(newSharedStringsXml));
    updatedParts.set('/xl/sharedStrings.xml', newSharedStringsXml);

    // 3. 각 시트(sheetN.xml) 재생성
    for (const sheetId of targetJson.sheetOrder) {
        const sheetJson = targetJson.sheets[sheetId];
        const sheetPath = findSheetPathFromRels(targetJson.sheetRels, sheetId);
        if (sheetPath && sheetJson) {
            const newSheetXml = rebuildSheetXml(sheetJson, styleMap, stringMap, config);
            console.log(`[Excel Patch Engine] New XML for sheet ${sheetId} generated.`, XmlUtils.formatXML(newSheetXml));
            updatedParts.set(sheetPath, newSheetXml);
        }
        console.log(`[Excel Patch Engine] Sheet ${sheetId} XML rebuilt.`);
    }
  }

  // TODO: 4. 시트 순서/이름 변경 시 -> workbook.xml 수정

  return updatedParts;
}

// ===============================================================
// XML 재건축(Rebuild) 헬퍼 함수들
// ===============================================================

function rebuildStylesXml(stylesJson: any, config: IHostConfig): { xml: string, styleMap: Map<string, number> } {
    const styleMap = new Map<string, number>();
    const fontDefs: string[] = ['<font><sz val="11"/><name val="Calibri"/></font>']; // 0번 기본 폰트
    const fillDefs: string[] = ['<fill><patternFill patternType="none"/></fill>', '<fill><patternFill patternType="gray125"/></fill>']; // 0, 1번 기본 채우기
    const borderDefs: string[] = ['<border><left/><right/><top/><bottom/><diagonal/></border>']; // 0번 기본 테두리
    const xfDefs: string[] = ['<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>']; // 0번 기본 xf

    const fontMap = new Map<string, number>();
    const fillMap = new Map<string, number>();

    Object.entries(stylesJson).forEach(([styleId, styleDef]: [string, any]) => {
        let fontId = 0, fillId = 0, borderId = 0;

        // Font 처리
        if (styleDef.font) {
            const fontFingerprint = JSON.stringify(styleDef.font);
            if (!fontMap.has(fontFingerprint)) {
                let fontXml = '<font>';
                if(styleDef.font.bold) fontXml += '<b/>';
                if(styleDef.font.size) fontXml += `<sz val="${styleDef.font.size}"/>`;
                if(styleDef.font.color) fontXml += `<color rgb="${styleDef.font.color}"/>`;
                fontXml += '</font>';
                fontMap.set(fontFingerprint, fontDefs.length);
                fontDefs.push(fontXml);
            }
            fontId = fontMap.get(fontFingerprint)!;
        }

        // Fill 처리
        if (styleDef.fill) {
            const fillFingerprint = JSON.stringify(styleDef.fill);
            if (!fillMap.has(fillFingerprint)) {
                const fillXml = `<fill><patternFill patternType="solid"><fgColor rgb="${styleDef.fill.fgColor}"/></patternFill></fill>`;
                fillMap.set(fillFingerprint, fillDefs.length);
                fillDefs.push(fillXml);
            }
            fillId = fillMap.get(fillFingerprint)!;
        }
        
        // xf 레코드 생성
        let alignmentXml = '';
        if (styleDef.alignment) {
            alignmentXml = `<alignment horizontal="${styleDef.alignment.horizontal || 'general'}" vertical="${styleDef.alignment.vertical || 'bottom'}"/>`;
        }
        const xfXml = `<xf numFmtId="${styleDef.numberFormat ? 164 : 0}" fontId="${fontId}" fillId="${fillId}" borderId="${borderId}" xfId="0" applyFont="1" applyFill="1" applyAlignment="${styleDef.alignment ? 1:0}">${alignmentXml}</xf>`;
        styleMap.set(styleId, xfDefs.length);
        xfDefs.push(xfXml);
    });

    const finalXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="${config.namespaces.main}">
    <fonts count="${fontDefs.length}">${fontDefs.join('')}</fonts>
    <fills count="${fillDefs.length}">${fillDefs.join('')}</fills>
    <borders count="${borderDefs.length}">${borderDefs.join('')}</borders>
    <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
    <cellXfs count="${xfDefs.length}">${xfDefs.join('')}</cellXfs>
    <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;
    
    return { xml: finalXml, styleMap };
}

function rebuildSharedStringsXml(strings: string[], config: IHostConfig): { xml: string, stringMap: Map<string, number> } {
    const stringMap = new Map(strings.map((s, i) => [s, i]));
    const items = strings.map(s => `<si><t>${escapeXml(s)}</t></si>`).join('');
    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><sst xmlns="${config.namespaces.main}" count="${strings.length}" uniqueCount="${strings.length}">${items}</sst>`;
    return { xml, stringMap };
}

function rebuildSheetXml(sheetJson: any, styleMap: Map<string, number>, stringMap: Map<string, number>, config: IHostConfig): string {
    let sheetDataXml = '';
    const rows: Record<string, any[]> = {};
    for (const cellId in sheetJson.cells) {
        const rowNum = cellId.match(/\d+/)?.[0];
        if (rowNum) {
            if (!rows[rowNum]) rows[rowNum] = [];
            rows[rowNum].push({ id: cellId, ...sheetJson.cells[cellId] });
        }
    }

    for (const rowNum in rows) {
        let rowCellsXml = '';
        rows[rowNum].sort((a,b) => a.id.localeCompare(b.id, undefined, {numeric: true}));
        
        for (const cell of rows[rowNum]) {
            const styleIdx = cell.styleId ? styleMap.get(cell.styleId) : undefined;
            const styleAttr = styleIdx !== undefined ? `s="${styleIdx}"` : '';
            let valueXml = '', typeAttr = '';
            
            if (cell.type === 'string') {
                const sstIndex = stringMap.get(cell.value);
                if (sstIndex !== undefined) {
                    valueXml = `<v>${sstIndex}</v>`;
                    typeAttr = `t="s"`;
                }
            } else if (cell.type === 'number') {
                valueXml = `<v>${cell.value}</v>`;
            }
            if (cell.formula) {
                valueXml = `<f>${cell.formula}</f>${valueXml}`;
            }

            rowCellsXml += `<c r="${cell.id}" ${styleAttr} ${typeAttr}>${valueXml}</c>`;
        }
        sheetDataXml += `<row r="${rowNum}">${rowCellsXml}</row>`;
    }
    
    const mergesXml = sheetJson.merges.map((m: any) => `<mergeCell ref="${m.startCell}:${m.endCell}"/>`).join('');

    return `<?xml version="1.0" ...><worksheet xmlns="${config.namespaces.main}"><sheetData>${sheetDataXml}</sheetData><mergeCells count="${sheetJson.merges.length}">${mergesXml}</mergeCells></worksheet>`;
}

// --- 기타 유틸리티 함수들 ---

function getAllStringCellValues(sheetsJson: Record<string, any>): string[] {
    const strings = new Set<string>();
    for (const sheetId in sheetsJson) {
        for (const cellId in sheetsJson[sheetId].cells) {
            const cell = sheetsJson[sheetId].cells[cellId];
            if (cell.type === 'string' && typeof cell.value === 'string') {
                strings.add(cell.value);
            }
        }
    }
    return Array.from(strings); // Set을 배열로 변환
}

function findSheetPathFromRels(sheetRels: any[], sheetId: string): string | null {
    const rel = sheetRels.find(r => r.id === sheetId);
    return rel ? `xl/${rel.target}` : null;
}

function escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, c => {
        switch (c) {
            case '<': return '&lt;'; case '>': return '&gt;';
            case '&': return '&amp;'; case '\'': return '&apos;'; case '"': return '&quot;';
            default: return c;
        }
    });
}