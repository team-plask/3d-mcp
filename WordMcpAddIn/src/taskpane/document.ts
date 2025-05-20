import { 
  processDocument as processDocumentOriginal,
  addContentControlsWithWordApi,
  replaceOriginalWithUpdated,
  applyJsonChangesToXml,
  isValidXml
} from './converter';
import { applyPatch, Operation } from 'fast-json-patch';
import { normalizeOoxml } from '../xml-converter/normalizer';

/**
 * document.xml 파트 추출 함수
 */
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

function formatXML(xml, tab = '  ') {
  let formatted = '';
  let indent = '';
  
  // 문자열에서 줄바꿈과 공백을 정리
  xml = xml.replace(/(>)(<)(\/*)/g, '$1\n$2$3');
  
  // 각 줄에 대해 처리
  xml.split('\n').forEach(line => {
    // 태그가 닫히는 경우 들여쓰기 감소
    if (line.match(/^<\//)) {
      indent = indent.substring(tab.length);
    }
    
    // 현재 들여쓰기 적용 후 라인 추가
    formatted += indent + line + '\n';
    
    // 닫는 태그나 자체 닫는 태그가 아닌 경우 들여쓰기 증가
    if (line.match(/^<[^\/].*[^\/]>$/)) {
      indent += tab;
    }
  });
  
  return formatted.trim();
}

export async function updateDocumentStructure(): Promise<Record<string, any>> {
  return Word.run(async ctx => {
    try {
      console.log("=== 문서 구조 업데이트 시작 ===");
      
      // 1. 원본 OOXML 가져오기
      const flat = ctx.document.body.getOoxml();
      await ctx.sync();
      const fullFlatXml = flat.value;
      console.log("원본 Flat OPC 로드");

      // 2. document.xml 파트 추출
      const docXml = extractDocumentXml(fullFlatXml);
      console.log("Document XML 추출 완료");
      console.log("Document XML:\n", formatXML(docXml));

      // 3. XML 정규화 (옵션)
      let normalizedXml = docXml;
      if (typeof normalizeOoxml === 'function') {
        try {
          normalizedXml = await normalizeOoxml(docXml, 'assets/normalize-runs.sef.json');
          console.log("정규화된 Document XML:\n", formatXML(normalizedXml));
        } catch (error) {
          console.warn("XML 정규화 실패, 원본 XML 사용:", error);
        }
      }

      // 4. OOXML을 JSON으로 변환
      const { json: originalJson, xml: updatedXmlWithIds } = processDocumentOriginal(normalizedXml);
      
      // 로깅
      const mappingString = JSON.stringify(originalJson, null, 2);
      console.log('문서 구조 JSON:\n', mappingString);
      console.log('업데이트된 Document XML:\n', formatXML(updatedXmlWithIds));
      console.log("문서 구조 분석 및 매핑 완료");
      
      // 5. 전체 Flat OPC에 업데이트된 XML 적용
      const updatedFlatOpc = replaceOriginalWithUpdated(fullFlatXml, updatedXmlWithIds);
      console.log("Flat OPC에 업데이트된 XML 적용 완료");
      
      // 6. XML 유효성 검사
      const isValid = isValidXml(updatedFlatOpc);
      if (!isValid) {
        console.warn("업데이트된 XML에 유효성 문제가 있을 수 있습니다.");
      }
      
      // 7. 문서에 XML 적용 시도
      try {
        await ctx.document.body.insertOoxml(updatedFlatOpc, Word.InsertLocation.replace);
        await ctx.sync();
        console.log("OOXML 삽입 성공");
      } catch (error) {
        console.error("OOXML 삽입 실패:", error);
        
        // 8. 대안 방법: Word API를 사용하여 콘텐츠 컨트롤 추가
        console.log("Word API를 사용하여 콘텐츠 컨트롤 추가 시도");
        try {
          await addContentControlsWithWordApi(originalJson);
          console.log("Word API를 통한 콘텐츠 컨트롤 추가 성공");
        } catch (apiError) {
          console.error("Word API를 통한 콘텐츠 컨트롤 추가 실패:", apiError);
        }
      }

      // 9. 최종 적용된 상태 확인
      const updatedFlat = ctx.document.body.getOoxml();
      await ctx.sync();
      const finalDocXml = extractDocumentXml(updatedFlat.value);
      console.log("최종 적용된 Document XML:\n", formatXML(finalDocXml));
      
      console.log("=== 문서 구조 업데이트 완료 ===");
      
      return originalJson;
      
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
    // 1. 원본 OOXML 가져오기
    const flat = ctx.document.body.getOoxml();
    await ctx.sync();
    const fullFlatXml = flat.value;

    // 2. document.xml 파트 추출
    const docXml = extractDocumentXml(fullFlatXml);

    // 3. 정규화 (옵션)
    let normalizedXml = docXml;
    if (typeof normalizeOoxml === 'function') {
      try {
        normalizedXml = await normalizeOoxml(docXml, 'assets/normalize-runs.sef.json');
      } catch (error) {
        console.warn("XML 정규화 실패, 원본 XML 사용:", error);
      }
    }

    // 4. OOXML을 JSON으로 변환
    const { json } = processDocumentOriginal(normalizedXml);
    
    // 로깅
    const mappingString = JSON.stringify(json, null, 2);
    console.log('문서 구조 JSON:\n', mappingString);

    return json;
  });
}

/**
 * 특정 요소의 텍스트 업데이트 함수
 * @param elementId 업데이트할 요소의 ID
 * @param newText 새로운 텍스트
 */
export async function updateElementText(elementId: string, newText: string): Promise<boolean> {
  return Word.run(async ctx => {
    try {
      // 1. 콘텐츠 컨트롤 검색
      const contentControls = ctx.document.contentControls;
      contentControls.load("items");
      await ctx.sync();
      
      // 2. 콘텐츠 컨트롤 ID로 찾기
      let targetControl = null;
      for (let i = 0; i < contentControls.items.length; i++) {
        const control = contentControls.items[i];
        control.load("tag");
        await ctx.sync();
        
        if (control.tag === elementId) {
          targetControl = control;
          break;
        }
      }
      
      // 3. 콘텐츠 컨트롤을 찾지 못한 경우
      if (!targetControl) {
        console.error(`ID '${elementId}'를 가진 콘텐츠 컨트롤을 찾을 수 없습니다.`);
        return false;
      }
      
      // 4. 텍스트 업데이트
      targetControl.insertText(newText, Word.InsertLocation.replace);
      await ctx.sync();
      
      console.log(`요소 '${elementId}'의 텍스트를 '${newText}'로 업데이트했습니다.`);
      return true;
      
    } catch (error) {
      console.error("요소 텍스트 업데이트 중 오류 발생:", error);
      return false;
    }
  });
}

/**
 * 특정 문단의 텍스트 수정 함수
 * @param paragraphIndex 수정할 문단의 인덱스 (0부터 시작)
 * @param newText 새로 설정할 텍스트
 */
export async function updateParagraphText(paragraphIndex: number, newText: string): Promise<void> {
  return Word.run(async ctx => {
    try {
      // 1. 문단 목록 가져오기
      const paragraphs = ctx.document.body.paragraphs;
      paragraphs.load("items");
      await ctx.sync();
      
      // 2. 인덱스 범위 확인
      if (paragraphIndex < 0 || paragraphIndex >= paragraphs.items.length) {
        throw new Error(`문단 인덱스 범위 초과: ${paragraphIndex}, 전체 문단 수: ${paragraphs.items.length}`);
      }
      
      // 3. 문단 텍스트 업데이트
      paragraphs.items[paragraphIndex].insertText(newText, Word.InsertLocation.replace);
      await ctx.sync();
      
      console.log(`문단 ${paragraphIndex+1}의 텍스트를 "${newText}"로 수정했습니다.`);
    } catch (error) {
      console.error("문단 텍스트 수정 중 오류 발생:", error);
      throw error;
    }
  });
}

/**
 * 콘텐츠 컨트롤 목록 반환 함수
 */
export async function listContentControls(): Promise<any[]> {
  return Word.run(async ctx => {
    const contentControls = ctx.document.contentControls;
    contentControls.load("items, tag, title, id, text");
    await ctx.sync();
    
    const results = [];
    for (let i = 0; i < contentControls.items.length; i++) {
      const control = contentControls.items[i];
      results.push({
        id: control.id,
        tag: control.tag,
        title: control.title,
        text: control.text
      });
    }
    
    return results;
  });
}

/**
 * 특정 ID를 가진 요소 업데이트 함수
 * @param elementId 요소 ID
 * @param updates 업데이트할 속성 (텍스트, 스타일 등)
 */
export async function updateDocumentElement(elementId: string, updates: any): Promise<boolean> {
  return Word.run(async ctx => {
    try {
      // 1. 콘텐츠 컨트롤 검색
      const contentControls = ctx.document.contentControls;
      contentControls.load("items");
      await ctx.sync();
      
      // 2. 콘텐츠 컨트롤 ID로 찾기
      let targetControl = null;
      for (let i = 0; i < contentControls.items.length; i++) {
        const control = contentControls.items[i];
        control.load("tag");
        await ctx.sync();
        
        if (control.tag === elementId) {
          targetControl = control;
          break;
        }
      }
      
      // 3. 콘텐츠 컨트롤을 찾지 못한 경우
      if (!targetControl) {
        console.error(`ID '${elementId}'를 가진 콘텐츠 컨트롤을 찾을 수 없습니다.`);
        return false;
      }
      
      // 4. 업데이트 적용
      if (updates.text) {
        targetControl.insertText(updates.text, Word.InsertLocation.replace);
      }
      
      // 문단 속성 업데이트
      if (elementId.startsWith('p_') && updates.properties) {
        const paragraph = targetControl.paragraphs.getFirst();
        
        if (updates.properties.style) {
          paragraph.style = updates.properties.style;
        }
        
        if (updates.properties.alignment) {
          paragraph.alignment = updates.properties.alignment;
        }
      }
      
      // 테이블 속성 업데이트 (제한적으로 지원)
      if (elementId.startsWith('t_') && updates.properties) {
        console.log("테이블 속성 업데이트는 제한적으로 지원됩니다.");
      }
      
      await ctx.sync();
      console.log(`요소 '${elementId}' 업데이트 완료`);
      return true;
      
    } catch (error) {
      console.error("요소 업데이트 중 오류 발생:", error);
      return false;
    }
  });
}

/**
 * ID로 요소 찾기 함수
 * @param elementId 찾을 요소의 ID
 */
export async function findElementById(elementId: string): Promise<any> {
  return Word.run(async ctx => {
    try {
      // 콘텐츠 컨트롤 검색
      const contentControls = ctx.document.contentControls;
      contentControls.load("items");
      await ctx.sync();
      
      for (let i = 0; i < contentControls.items.length; i++) {
        const control = contentControls.items[i];
        control.load("tag, text, id");
        await ctx.sync();
        
        if (control.tag === elementId) {
          // 요소 유형에 따른 추가 정보 로드
          if (elementId.startsWith('p_')) {
            const paragraph = control.paragraphs.getFirst();
            paragraph.load("style, alignment, text");
            await ctx.sync();
            
            return {
              id: elementId,
              type: 'paragraph',
              text: paragraph.text,
              style: paragraph.style,
              alignment: paragraph.alignment
            };
          }
          
          if (elementId.startsWith('t_')) {
            const table = control.tables.getFirst();
            table.load("rowCount");
            
            // 테이블의 첫 번째 행을 로드하여 셀 수(열 수) 확인
            const firstRow = table.rows.getFirst();
            firstRow.load("cellCount");
            
            await ctx.sync();
            
            return {
              id: elementId,
              type: 'table',
              rowCount: table.rowCount,
              columnCount: firstRow.cellCount // 첫 번째 행의 셀 수로 열 수 대체
            };
          }
          
          // 기본 정보 반환
          return {
            id: elementId,
            text: control.text
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("요소 찾기 중 오류 발생:", error);
      return null;
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
