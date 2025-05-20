import { 
  processDocument, 
  replaceOriginalWithUpdated, 
  applyJsonChangesToXml,
  DocumentJson,
  ParagraphJson,
  TextRunJson,
  ConversionResult,
  isValidXml
} from './converter';
import { applyPatch, Operation } from 'fast-json-patch';

const wNs = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

const docPartRegex = /(<pkg:part[^>]*pkg:name="\/word\/document\.xml"[^>]*>\s*<pkg:xmlData>)[\s\S]*?(<\/pkg:xmlData>\s*<\/pkg:part>)/;

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

function extractDocumentXml(flatXml: string): string {
  if (flatXml.indexOf('<pkg:package') === -1) {
    return flatXml.trim();
  }

  const partMatch = flatXml.match(
    /<pkg:part[^>]*pkg:name="\/word\/document\.xml"[^>]*>[\s\S]*?<\/pkg:part>/i
  );
  if (!partMatch) throw new Error('document.xml part not found in Flat-OPC');
  const part: string = partMatch[0];

  const xmlMatch = part.match(
    /<pkg:xmlData[^>]*>([\s\S]*?)<\/pkg:xmlData>/i
  );
  if (!xmlMatch) throw new Error('pkg:xmlData section missing');

  return xmlMatch[1].trim();
}

export async function updateDocumentStructure(): Promise<Record<string, any>> {
  return Word.run(async ctx => {
    try {
      console.log("=== Starting document structure update ===");
      
      const flat = ctx.document.body.getOoxml();
      await ctx.sync();
      const fullFlatXml = flat.value;
      console.log("원본 Flat OPC 로드");

      // 2) document.xml 파트 추출
      const docXml = extractDocumentXml(fullFlatXml);
      console.log("Document XML 추출 완료");
      console.log("Document XML:\n", docXml);

      // 3) OOXML을 JSON으로 변환 (ID 주입 포함)
      const { json: originalJson, xml: updatedXmlWithIds } = processDocument(docXml);
      
      // 로깅
      const mappingString = JSON.stringify(originalJson, null, 2);
      console.log('Mapping JSON (string):\n', mappingString);
      console.log('Updated Document XML with IDs:\n', updatedXmlWithIds);
      console.log("Document 구조 변환 및 ID 주입 완료");
      
      // 4) JSON 구조 수정 (원하는 수정 로직 구현)
      const modifiedJson = { ...originalJson };
      
      // 첫 번째 문단 찾기
      const paragraphKeys = Object.keys(modifiedJson).filter(
        key => typeof modifiedJson[key] === 'object' && 
               (modifiedJson[key] as any).type === 'paragraph'
      );
      
      // 6) 전체 Flat OPC에 업데이트된 XML 적용
      const updatedFlatOpc = replaceOriginalWithUpdated(fullFlatXml, updatedXmlWithIds);
      console.log("Flat OPC에 업데이트된 XML 적용 완료");
      isValidXml(updatedFlatOpc);
      // 7) 문서에 적용
      try {
        await ctx.document.body.insertOoxml(updatedFlatOpc, Word.InsertLocation.replace);
        await ctx.sync();
        console.log("기본 OOXML 삽입 성공");
      } catch (error) {
        console.error("기본 OOXML 삽입 실패:", error);
      }

      console.log("문서에 수정 내용 적용 완료");
      
      // 8) 적용 후 다시 OOXML 가져와서 확인
      const updatedFlat = ctx.document.body.getOoxml();
      await ctx.sync();
      
      // 9) 최종 적용된 document.xml 확인
      const finalDocXml = extractDocumentXml(updatedFlat.value);
      console.log("최종 적용된 Document XML:\n", finalDocXml);
      
      console.log("=== 문서 구조 수정 및 적용 완료 ===");
      
      // 수정된 JSON 반환
      return modifiedJson;
      
    } catch (error) {
      console.error("문서 구조 처리 중 오류 발생:", error);
      throw error;
    }
  });
}

/**
 * 원본 문서 구조 JSON 추출 함수
 * 문서 수정 없이 JSON 구조만 반환
 */
export async function exportDocumentStructureJson(): Promise<Record<string, any>> {
  return Word.run(async ctx => {
    // 1) 원본 OOXML 가져오기
    const flat = ctx.document.body.getOoxml();
    await ctx.sync();
    const fullFlatXml = flat.value;

    // 2) document.xml 파트 추출
    const docXml = extractDocumentXml(fullFlatXml);

    // 3) OOXML을 JSON으로 변환
    const { json, xml } = processDocument(docXml);
    const mappingString = JSON.stringify(json, null, 2);
    console.log('Mapping JSON (string):\n', mappingString);
    console.log('Updated Document XML:\n', xml);

    return json;
  });
}

/**
 * 특정 문단의 텍스트 수정하기 (유틸리티 함수)
 * @param paragraphIndex 수정할 문단의 인덱스 (0부터 시작)
 * @param newText 새로 설정할 텍스트
 */
export async function updateParagraphText(paragraphIndex: number, newText: string): Promise<void> {
  return Word.run(async ctx => {
    try {
      // 1) 원본 OOXML 가져오기
      const flat = ctx.document.body.getOoxml();
      await ctx.sync();
      const fullFlatXml = flat.value;
      
      // 2) document.xml 파트 추출 및 JSON 변환
      const docXml = extractDocumentXml(fullFlatXml);
      const { json: originalJson, xml: updatedXmlWithIds } = processDocument(docXml);
      
      // 3) 문단 찾기
      const paragraphKeys = Object.keys(originalJson).filter(
        key => typeof originalJson[key] === 'object' && 
               (originalJson[key] as any).type === 'paragraph'
      );
      
      if (paragraphIndex >= paragraphKeys.length) {
        throw new Error(`문단 인덱스 범위 초과: ${paragraphIndex}, 전체 문단 수: ${paragraphKeys.length}`);
      }
      
      const targetParagraphKey = paragraphKeys[paragraphIndex];
      
      // 4) JSON 수정
      const modifiedJson = { ...originalJson };
      const paragraph = modifiedJson[targetParagraphKey] as ParagraphJson;
      
      // 모든 텍스트 실행을 찾아서 첫 번째 실행의 텍스트 수정
      const textRunKeys = Object.keys(paragraph).filter(
        key => typeof paragraph[key] === 'object' && 
              (paragraph[key] as any).type === 'textRun'
      );
      
      if (textRunKeys.length > 0) {
        const firstRunKey = textRunKeys[0];
        (paragraph[firstRunKey] as TextRunJson).text = newText;
        console.log(`문단 ${paragraphIndex+1}의 텍스트를 "${newText}"로 수정했습니다.`);
      } else {
        console.log(`문단 ${paragraphIndex+1}에 텍스트 실행이 없습니다.`);
      }
      
      // 5) XML 업데이트 및 적용
      const finalXml = applyJsonChangesToXml(updatedXmlWithIds, originalJson, modifiedJson);
      const updatedFlatOpc = replaceOriginalWithUpdated(fullFlatXml, finalXml);
      
      ctx.document.body.insertOoxml(updatedFlatOpc, Word.InsertLocation.replace);
      await ctx.sync();
      
    } catch (error) {
      console.error("문단 텍스트 수정 중 오류 발생:", error);
      throw error;
    }
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
