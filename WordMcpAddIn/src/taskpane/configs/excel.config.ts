// src/configs/excel.config.ts

import type { IHostConfig, ElementConfig, PatchAction } from './config.interface';

const cellValueAction: PatchAction = (context, range, value) => {
    // 값이 비어있으면 clear, 아니면 값을 설정
    if (value === "" || value === null) {
        range.clear(Excel.ClearApplyTo.contents);
    } else {
        range.values = [[value]];
    }
};
const cellFormulaAction: PatchAction = (context, range, formula) => {
    range.formulas = [[`=${formula}`]];
};
const cellStyleAction: PatchAction = (context, range, styleId, fullTargetJson) => {
    const styleDef = fullTargetJson.styles[styleId];
    if (styleDef) {
        // API가 지원하는 형식으로 변환 후 적용
        const format = {
            font: styleDef.font,
            fill: styleDef.fill ? { color: styleDef.fill.fgColor } : undefined,
            alignment: styleDef.alignment,
        };
        range.format.set(format);
    }
};

// ✅ XML에 존재하는 모든 처리 대상 태그를 타입으로 정의합니다.
const TAG_TO_TYPE: Record<string, string> = {
    // workbook & rels
    'workbook': 'workbook',
    'sheets': 'sheets',
    'sheet': 'sheet',
    'Relationships': 'Relationships',
    'Relationship': 'Relationship',
    // styles
    'styleSheet': 'styleSheet',
    'fonts': 'fonts',
    'font': 'font',
    'fills': 'fills',
    'fill': 'fill',
    'borders': 'borders',
    'border': 'border',
    'cellStyleXfs': 'cellStyleXfs',
    'cellXfs': 'cellXfs',
    'cellStyles': 'cellStyles',
    'xf': 'xf',
    'patternFill': 'patternFill',
    'fgColor': 'fgColor',
    'bgColor': 'bgColor',
    'left': 'left',
    'right': 'right',
    'top': 'top',
    'bottom': 'bottom',
    'diagonal': 'diagonal',
    'alignment': 'alignment',
    'cellStyle': 'cellStyle',
    'b': 'b', 'sz': 'sz', 'color': 'color', 'name': 'name', 'family': 'family', 'scheme': 'scheme',
    // sharedStrings
    'sst': 'sst', 'si': 'si', 't': 't',
    // worksheet
    'worksheet': 'worksheet', 'sheetData': 'sheetData', 'mergeCells': 'mergeCells',
    'row': 'row', 'c': 'cell', 'f': 'f', 'v': 'v', 'mergeCell': 'mergeCell',
};

const ELEMENT_CONFIG: Record<string, ElementConfig> = {
    // === 루트 요소 ===
    workbook: { type: 'structural', xmlTag: 'workbook' },
    styleSheet: { type: 'structural', xmlTag: 'styleSheet' },
    sst: { type: 'structural', xmlTag: 'sst', parameters: ['uniqueCount'] },
    worksheet: { type: 'structural', xmlTag: 'worksheet' },
    Relationships: { type: 'structural', xmlTag: 'Relationships' },

    // === 컨테이너 요소 ===
    sheets:       { type: 'structural', xmlTag: 'sheets', jsonKey: 'sheetList' },
    fonts:        { type: 'structural', xmlTag: 'fonts', parameters: ['count'] },
    fills:        { type: 'structural', xmlTag: 'fills', parameters: ['count'] },
    borders:      { type: 'structural', xmlTag: 'borders', parameters: ['count'] },
    cellStyleXfs: { type: 'structural', xmlTag: 'cellStyleXfs', parameters: ['count'] },
    cellXfs:      { type: 'structural', xmlTag: 'cellXfs', jsonKey: 'cellStyles', parameters: ['count'] },
    cellStyles:   { type: 'structural', xmlTag: 'cellStyles', parameters: ['count'] },
    sheetData:    { type: 'structural', xmlTag: 'sheetData' },
    mergeCells:   { type: 'structural', xmlTag: 'mergeCells', parameters: ['count'] },

    // === 리스트 아이템 요소 ===
    Relationship: { type: 'leaf', xmlTag: 'Relationship', isList: true, parameters: ['Id', 'Type', 'Target'] },
    sheet:        { type: 'leaf', xmlTag: 'sheet', isList: true, parameters: ['name', 'sheetId', 'r:id'] },
    // ✅ font의 children으로 모든 관련 태그를 정의합니다.
    font:         { type: 'property', xmlTag: 'font', isList: true },
    fill:         { type: 'property', xmlTag: 'fill', isList: true },
    border:       { type: 'property', xmlTag: 'border', isList: true },
    xf:           { type: 'property', xmlTag: 'xf', isList: true, parameters: ['numFmtId', 'fontId', 'fillId', 'borderId', 'xfId', 'applyAlignment', 'applyFont', 'applyFill', 'applyBorder'] },
    si:           { type: 'structural', xmlTag: 'si', isList: true, jsonKey: 'stringItems' },
    row:          { type: 'structural', xmlTag: 'row', isList: true, parameters: ['r'] },
    c:            { type: 'structural', xmlTag: 'c', isList: true, jsonKey: 'cells', parameters: ['r', 's', 't'] },
    mergeCell:    { type: 'leaf', xmlTag: 'mergeCell', isList: true, parameters: ['ref'] },
    cellStyle:    { type: 'leaf', xmlTag: 'cellStyle', isList: true, parameters: ['name', 'xfId', 'builtinId']},
  
    // === Leaf & Property 상세 요소 ===
    b:            { type: 'leaf', xmlTag: 'b', jsonKey: 'bold' },
    sz:           { type: 'leaf', xmlTag: 'sz', jsonKey: 'size', parameters: ['val'] },
    color:        { type: 'leaf', xmlTag: 'color', jsonKey: 'color', parameters: ['rgb', 'theme', 'indexed'] },
    name:         { type: 'leaf', xmlTag: 'name', jsonKey: 'name', parameters: ['val'] },
    family:       { type: 'leaf', xmlTag: 'family', parameters: ['val'] },
    scheme:       { type: 'leaf', xmlTag: 'scheme', parameters: ['val'] },
    patternFill:  { type: 'property', xmlTag: 'patternFill', jsonKey: 'pattern', parameters: ['patternType'] },
    fgColor:      { type: 'leaf', xmlTag: 'fgColor', jsonKey: 'fgColor', parameters: ['rgb'] },
    bgColor:      { type: 'leaf', xmlTag: 'bgColor', jsonKey: 'bgColor', parameters: ['indexed'] },
    left:         { type: 'leaf', xmlTag: 'left', parameters: ['style'] },
    right:        { type: 'leaf', xmlTag: 'right', parameters: ['style'] },
    top:          { type: 'leaf', xmlTag: 'top', parameters: ['style'] },
    bottom:       { type: 'leaf', xmlTag: 'bottom', parameters: ['style'] },
    diagonal:     { type: 'leaf', xmlTag: 'diagonal' },
    alignment:    { type: 'leaf', xmlTag: 'alignment', jsonKey: 'alignment', parameters: ['horizontal', 'vertical'] },
    t:            { type: 'leaf', xmlTag: 't', jsonKey: 'text' },
    f:            { type: 'leaf', xmlTag: 'f', jsonKey: 'formula' },
    v:            { type: 'leaf', xmlTag: 'v', jsonKey: 'value' },
};

export const excelConfig: IHostConfig = {
    hostType: 'Excel',
    mainPartPath: '/xl/workbook.xml',
    bodyTag: 'sheetData',
    namespaces: {
        main: "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
        r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
    },
    tagToType: TAG_TO_TYPE,
    elementConfig: ELEMENT_CONFIG,
    wrapperConfig: undefined,
    sdtConfig: undefined,
};