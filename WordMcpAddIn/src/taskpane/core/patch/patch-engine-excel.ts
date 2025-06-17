import { Operation } from 'fast-json-patch';
import type { IHostConfig } from '../../configs/config.interface';

/**
 * [메인 엔진] 모든 XML 파트(DOM)와 전체 패치 목록을 받아 적절한 핸들러에 작업을 분배합니다.
 */
export function applyPatchesToDom(
  originalParts: Map<string, Document>,
  patch: Operation[],
  targetJson: any,
  config: IHostConfig
): void {
  // 1. styles.xml과 sharedStrings.xml은 재빌드하여 최신 인덱스 맵을 확보합니다.
  const { stringMap } = rebuildAndApplySharedStrings(originalParts, targetJson);
  const { styleMap } = rebuildAndApplyStyles(originalParts, targetJson, config);

  // 2. 나머지 patch عمليات을 순회하며 DOM을 직접 수정합니다.
  for (const op of patch) {
    const pathSegments = op.path.split('/').slice(1);

    if (pathSegments[0] === 'sheets') {
      const sheetId = pathSegments[1];
      const sheetRel = targetJson.sheetRels.find((r: any) => r.id === sheetId);
      if (!sheetRel) continue;

      const sheetPath = `xl/${sheetRel.target}`;
      const sheetDom = originalParts.get(sheetPath);
      if (!sheetDom) continue;
      
      _handleSheetOperation(sheetDom, op, pathSegments.slice(2), targetJson.sheets[sheetId], stringMap, styleMap);

    } else if (pathSegments[0] === 'sheetOrder') {
      const workbookDom = originalParts.get('xl/workbook.xml');
      if (workbookDom) {
        _handleSheetOrderOperation(workbookDom, targetJson);
      }
    }
  }
}

// ===============================================================
// 시트 및 워크북 DOM 직접 수정 핸들러
// ===============================================================

function _handleSheetOperation(
  sheetDom: Document, 
  op: Operation, 
  path: string[], 
  targetSheetJson: any,
  stringMap: Map<string, number>,
  styleMap: Map<string, number>
) {
  const action = path[0];

  if (action === 'cells') {
    const cellAddress = path[1];
    const cellData = targetSheetJson.cells[cellAddress];
    let cellElement = sheetDom.querySelector(`c[r="${cellAddress}"]`);

    switch (op.op) {
      case 'add':
      case 'replace':
        if (!cellElement) {
            cellElement = _createCell(sheetDom, cellAddress);
        }
        _updateCell(cellElement, cellData, stringMap, styleMap);
        break;
      
      case 'remove':
        if (cellElement) {
          cellElement.parentNode?.removeChild(cellElement);
        }
        break;
    }
  } 
}

function _handleSheetOrderOperation(workbookDom: Document, targetJson: any) {
  const sheetsElement = workbookDom.querySelector('sheets');
  if (!sheetsElement) return;

  while (sheetsElement.firstChild) {
    sheetsElement.removeChild(sheetsElement.firstChild);
  }

  targetJson.sheetRels.forEach((rel: any) => {
    const sheetTag = workbookDom.createElement('sheet');
    sheetTag.setAttribute('name', rel.name);
    sheetTag.setAttribute('sheetId', rel.id.replace('sheet',''));
    sheetTag.setAttribute('r:id', rel.rId);
    sheetsElement.appendChild(sheetTag);
  });
}

// ===============================================================
// 재빌드(Rebuild) 방식 핸들러
// ===============================================================

/**
 * sharedStrings.xml을 재빌드하고 DOM을 교체합니다.
 */
function rebuildAndApplySharedStrings(originalParts: Map<string, Document>, targetJson: any): { stringMap: Map<string, number> } {
    const allStrings = Array.from(new Set(
        Object.values(targetJson.sheets).flatMap((sheet: any) => 
            Object.values(sheet.cells)
                  .filter((cell: any) => cell.type === 'string')
                  .map((cell: any) => cell.value)
        )
    )) as string[];

    const stringMap = new Map(allStrings.map((s, i) => [s, i]));
    const items = allStrings.map(s => `<si><t>${escapeXml(s)}</t></si>`).join('');
    const newXmlString = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${allStrings.length}" uniqueCount="${allStrings.length}">${items}</sst>`;

    originalParts.set('xl/sharedStrings.xml', new DOMParser().parseFromString(newXmlString, "text/xml"));
    return { stringMap };
}

/**
 * styles.xml을 재빌드하고 DOM을 교체합니다.
 */
function rebuildAndApplyStyles(originalParts: Map<string, Document>, targetJson: any, config: IHostConfig): { styleMap: Map<string, number> } {
    const finalStyleMap = new Map<string, number>();
    
    // 1. 기본 스타일 요소 정의
    const fontDefs = ['<font><sz val="12"/><name val="Calibri"/></font>'];
    const fillDefs = ['<fill><patternFill patternType="none"/></fill>', '<fill><patternFill patternType="gray125"/></fill>'];
    const borderDefs = ['<border><left/><right/><top/><bottom/><diagonal/></border>'];
    const xfDefs = ['<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'];

    // 2. 중복 방지를 위한 맵
    const fontFingerprintMap = new Map<string, number>([['{"sz":12,"name":"Calibri"}', 0]]);
    const fillFingerprintMap = new Map<string, number>([['{"patternType":"none"}', 0], ['{"patternType":"gray125"}', 1]]);

    // 3. targetJson의 스타일을 순회하며 XML 정의 생성
    for (const [styleId, styleDef] of Object.entries(targetJson.styles as Record<string, any>)) {
        let fontId = 0, fillId = 0, borderId = 0; // 기본값

        // Font 처리
        if (styleDef.font) {
            const fontFingerprint = JSON.stringify(styleDef.font);
            if (!fontFingerprintMap.has(fontFingerprint)) {
                let fontXml = '<font>';
                if (styleDef.font.bold) fontXml += '<b/>';
                if (styleDef.font.size) fontXml += `<sz val="${styleDef.font.size}"/>`;
                if (styleDef.font.name) fontXml += `<name val="${escapeXml(styleDef.font.name)}"/>`;
                if (styleDef.font.color) fontXml += `<color rgb="${styleDef.font.color}"/>`;
                fontXml += '</font>';
                fontFingerprintMap.set(fontFingerprint, fontDefs.length);
                fontDefs.push(fontXml);
            }
            fontId = fontFingerprintMap.get(fontFingerprint)!;
        }

        // Fill 처리
        if (styleDef.fill) {
            const fillFingerprint = JSON.stringify(styleDef.fill);
            if (!fillFingerprintMap.has(fillFingerprint)) {
                const fillXml = `<fill><patternFill patternType="solid"><fgColor rgb="${styleDef.fill.fgColor}"/></patternFill></fill>`;
                fillFingerprintMap.set(fillFingerprint, fillDefs.length);
                fillDefs.push(fillXml);
            }
            fillId = fillFingerprintMap.get(fillFingerprint)!;
        }
        
        // TODO: Border 처리 로직 추가

        // XF (셀 스타일 최종 조합) 레코드 생성
        let alignmentXml = '';
        if (styleDef.alignment) {
            alignmentXml = `<alignment horizontal="${styleDef.alignment.horizontal}" vertical="${styleDef.alignment.vertical}"/>`;
        }
        const xfXml = `<xf numFmtId="0" fontId="${fontId}" fillId="${fillId}" borderId="${borderId}" xfId="0" applyFont="1" applyFill="1" applyAlignment="${styleDef.alignment ? 1:0}">${alignmentXml}</xf>`;
        
        finalStyleMap.set(styleId, xfDefs.length);
        xfDefs.push(xfXml);
    }
    
    // 4. 최종 styles.xml 문자열 조립
    const newXmlString = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="${config.namespaces.main}">
    <fonts count="${fontDefs.length}">${fontDefs.join('')}</fonts>
    <fills count="${fillDefs.length}">${fillDefs.join('')}</fills>
    <borders count="${borderDefs.length}">${borderDefs.join('')}</borders>
    <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
    <cellXfs count="${xfDefs.length}">${xfDefs.join('')}</cellXfs>
    <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

    originalParts.set('xl/styles.xml', new DOMParser().parseFromString(newXmlString, "text/xml"));
    return { styleMap: finalStyleMap };
}


// ===============================================================
// DOM 조작 헬퍼 함수들
// ===============================================================

function _findOrCreateRow(sheetDom: Document, rowNum: string): Element {
    let rowElement = sheetDom.querySelector(`row[r="${rowNum}"]`);
    if (!rowElement) {
        const sheetData = sheetDom.querySelector('sheetData');
        if (!sheetData) throw new Error("sheetData not found!");
        rowElement = sheetDom.createElement('row');
        rowElement.setAttribute('r', rowNum);
        sheetData.appendChild(rowElement); // TODO: 정렬된 위치에 삽입 필요
    }
    return rowElement;
}

function _createCell(sheetDom: Document, cellAddress: string): Element {
    const rowNum = cellAddress.match(/\d+/)?.[0];
    if (!rowNum) throw new Error(`Invalid cell address: ${cellAddress}`);
    const rowElement = _findOrCreateRow(sheetDom, rowNum);
    const cellElement = sheetDom.createElement('c');
    cellElement.setAttribute('r', cellAddress);
    rowElement.appendChild(cellElement); // TODO: 정렬된 위치에 삽입 필요
    return cellElement;
}

function _updateCell(
  cellElement: Element,
  cellData: any,
  stringMap: Map<string, number>,
  styleMap: Map<string, number>
) {
    if (cellData.type === 'string') {
        cellElement.setAttribute('t', 's');
    } else {
        cellElement.removeAttribute('t');
    }

    while(cellElement.firstChild) {
        cellElement.removeChild(cellElement.firstChild);
    }

    if (cellData.formula) {
        const formulaElement = cellElement.ownerDocument.createElement('f');
        formulaElement.textContent = escapeXml(cellData.formula);
        cellElement.appendChild(formulaElement);
    }
    
    if (cellData.value !== undefined && cellData.value !== null) {
        const valueElement = cellElement.ownerDocument.createElement('v');
        if(cellData.type === 'string') {
            valueElement.textContent = String(stringMap.get(cellData.value) ?? '');
        } else {
            valueElement.textContent = String(cellData.value);
        }
        cellElement.appendChild(valueElement);
    }
    
    if (cellData.styleId) {
        const styleIndex = styleMap.get(cellData.styleId);
        if (styleIndex !== undefined) {
            cellElement.setAttribute('s', String(styleIndex));
        }
    } else {
        cellElement.removeAttribute('s');
    }
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