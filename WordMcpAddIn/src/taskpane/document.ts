import { convertOoxmlToJson, pickDocumentPart } from './converter';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { applyPatch, Operation } from 'fast-json-patch';

const wNs = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

// Regex to locate the document.xml part in the flat OOXML
const docPartRegex = /(<pkg:part[^>]*pkg:name="\/word\/document\.xml"[^>]*>\s*<pkg:xmlData>)[\s\S]*?(<\/pkg:xmlData>\s*<\/pkg:part>)/;

/**
 * OOXML 문자열에서 document.xml 파트만 추출합니다.
 */
function extractDocumentXml(flatXml: string): string {
  return pickDocumentPart(flatXml);
}

/**
 * 콘텐츠 컨트롤(<w:sdt>)로 wrapper를 만들고, 태그를 id 값으로 설정합니다.
 * 이미 래핑된 요소는 건너뜁니다.
 */
function wrapWithContentControl(element: any, tagId: string, tagName: string) {
  if (element['w:sdt']) {
    return element;
  }
  return {
    'w:sdt': {
      'w:sdtPr': { 'w:tag': { '@_w:val': tagId } },
      'w:sdtContent': { [tagName]: element }
    }
  };
}

/**
 * OOXML 객체 트리에 JSON-Patch를 적용합니다.
 */
function applyJsonPatchToOoxmlObject(obj: any, patch: Operation[]): void {
  patch.forEach(op => applyPatch(obj, [op], true, true));
}

/**
 * OOXML 문자열에 JSON-Patch를 적용하고 수정된 OOXML 문자열을 반환합니다.
 */
function applyJsonPatchToOoxml(xml: string, patch: Operation[]): string {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const obj = parser.parse(xml);
  applyJsonPatchToOoxmlObject(obj, patch);
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    suppressEmptyNode: true,
    format: true,
    indentBy: '  '
  });
  return builder.build(obj);
}

/**
 * 문서 내 converter에서 ID를 부여한 요소만 콘텐츠 컨트롤로 래핑하고, 매핑을 반환합니다.
 */
export async function exportDocumentStructureJson(): Promise<Record<string, any>> {
  return Word.run(async ctx => {
    // 1) 원본 OOXML 가져오기
    const flat = ctx.document.body.getOoxml();
    await ctx.sync();
    const fullFlatXml = flat.value;

    // 2) document.xml 파트 추출
    const docXml = extractDocumentXml(fullFlatXml);

    // --- 구조화된 Original XML 출력 ---
    const logParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    const originalObj = logParser.parse(docXml);
    // const logBuilder = new XMLBuilder({
    //   ignoreAttributes: false,
    //   attributeNamePrefix: '@_',
    //   suppressEmptyNode: true,
    //   format: true,
    //   indentBy: '  '
    // });
    // const formattedOriginal = logBuilder.build(originalObj);
    // console.log('Original Document XML (structured):\n', formattedOriginal);
    // // 선택적으로 새 창에 출력
    // const origWin = window.open('', '_blank');
    // if (origWin) {
    //   origWin.document.write('<pre>' + formattedOriginal.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>');
    // }

    // 3) OOXML을 JSON으로 변환
    const json = convertOoxmlToJson(docXml);
    const mappingString = JSON.stringify(json, null, 2);
    console.log('Mapping JSON (string):\n', mappingString);
    // console.log('Updated Document XML:\n', updatedXml);

    return json;
  });
}

/**
 * JSON-Patch 배열을 받아, id 기반으로 콘텐츠 컨트롤 내부 요소를 수정 후 문서에 반영합니다.
 */
export async function importDocumentWithPatch(patch: Operation[]): Promise<void> {
  return Word.run(async ctx => {
    const flat = ctx.document.body.getOoxml();
    await ctx.sync();
    const fullFlatXml = flat.value;

    const docXml = extractDocumentXml(fullFlatXml);

  });
}
