import { 
  processDocument as processDocumentOriginal,
  extractJsonFromContentControls,
} from './converter';
import { applyPatch, Operation } from 'fast-json-patch';
import { normalizeOoxml } from '../xml-converter/normalizer';

let cachedDocumentJson: Record<string, any> = {};

/**
 * XML 유효성 검사
 * @param xmlString XML 문자열
 * @returns 유효성 여부
 */
export function isValidXml(xmlString: string): boolean {
  try {
    // DOMParser를 사용해 XML 파싱
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // 파싱 오류 확인
    const parserError = xmlDoc.querySelector("parsererror");
    if (parserError) {
      console.error("XML 파싱 오류:", parserError.textContent);
      return false;
    }

    // Flat OPC 형식인 경우 document.xml 부분 추가 검사
    if (xmlString.indexOf('<pkg:package') !== -1) {
      // document.xml 부분 추출
      const documentPart = xmlString.match(
        /<pkg:part[^>]*pkg:name="\/word\/document\.xml"[^>]*>[\s\S]*?<\/pkg:part>/i
      );
      if (documentPart) {
        const xmlDataMatch = documentPart[0].match(
          /<pkg:xmlData[^>]*>([\s\S]*?)<\/pkg:xmlData>/i
        );
        if (xmlDataMatch && xmlDataMatch[1]) {
          // 개별 XML 부분 검사
          const docXml = xmlDataMatch[1];
          const docXmlDoc = parser.parseFromString(docXml, "text/xml");
          const docXmlError = docXmlDoc.querySelector("parsererror");
          if (docXmlError) {
            console.error("document.xml 파싱 오류:", docXmlError.textContent);
            return false;
          }
        }
      }
    }

    return true;
  } catch (error) {
    console.error("XML 유효성 검사 오류:", error);
    return false;
  }
}

/**
 * 원본 XML에서 업데이트된 XML 부분만 교체
 * @param originalXml 원본 XML 문자열
 * @param updatedXml 업데이트된 XML 문자열
 * @returns 병합된 XML 문자열
 */
export function replaceOriginalWithUpdated(originalXml: string, updatedXml: string): string {
  try {
    // Flat OPC 형식인 경우 document.xml 부분만 교체
    if (originalXml.indexOf('<pkg:package') !== -1) {
      // '/word/document.xml' 파트 찾기
      const partMatch = originalXml.match(
        /<pkg:part[^>]*pkg:name="\/word\/document\.xml"[^>]*>[\s\S]*?<\/pkg:part>/i
      );
      if (!partMatch) {
        throw new Error('document.xml part not found in Flat-OPC');
      }

      // XML 데이터 부분 찾기
      const xmlDataMatch = partMatch[0].match(
        /(<pkg:xmlData[^>]*>)([\s\S]*?)(<\/pkg:xmlData>)/i
      );
      if (!xmlDataMatch) {
        throw new Error('pkg:xmlData section missing');
      }

      // xmlData 내용만 업데이트 (네임스페이스 보존)
      const originalDocXml = xmlDataMatch[2];
      let processedXml = updatedXml;

      // 원본 XML의 루트 요소와 속성 찾기
      const rootElemMatch = originalDocXml.match(/<w:document([^>]*)>/);
      if (rootElemMatch && rootElemMatch[1]) {
        // 업데이트된 XML의 루트 요소 찾기
        const newRootMatch = processedXml.match(/<w:document[^>]*>/);
        if (newRootMatch) {
          // 원본 네임스페이스 및 속성 보존
          processedXml = processedXml.replace(
            newRootMatch[0],
            `<w:document${rootElemMatch[1]}>`
          );
        }
      }

      const updatedPart = partMatch[0].replace(
        xmlDataMatch[0],
        `${xmlDataMatch[1]}${processedXml}${xmlDataMatch[3]}`
      );

      // 전체 문서에서 해당 부분 교체
      return originalXml.replace(partMatch[0], updatedPart);
    }

    // 이미 document 부분만 있는 경우 직접 교체
    return updatedXml;
  } catch (error) {
    console.error("XML 교체 중 오류 발생:", error);
    // 오류 발생 시 원본 반환
    return originalXml;
  }
}

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

export function formatXML(xml, tab = '  ') {
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
      try {
        normalizedXml = await normalizeOoxml(docXml, 'assets/normalize-runs.sef.json');
        console.log("정규화된 Document XML:\n", formatXML(normalizedXml));
      } catch (error) {
        console.warn("XML 정규화 실패, 원본 XML 사용:", error);
      }

      // 4. OOXML을 JSON으로 변환
      const existingJson = loadDocumentState();
      console.log("기존 문서 구조 JSON 로드 완료");
      console.log("기존 문서 구조 JSON:\n", JSON.stringify(existingJson, null, 2));
      
      const { json: originalJson, xml: updatedXmlWithIds } = processDocumentOriginal(normalizedXml, existingJson);
      
      // 로깅
      const mappingString = JSON.stringify(originalJson, null, 2);
      console.log('문서 구조 JSON\n', mappingString);
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
        // 문서에 XML 적용 부분 수정
        await ctx.document.body.insertOoxml(updatedFlatOpc, Word.InsertLocation.replace);
        await ctx.sync();
        console.log("OOXML 삽입 성공");
        
        // 7.1 모든 ContentControl 숨김 처리
        await hideAllContentControls(ctx);
        console.log("모든 ContentControl 숨김 처리 완료");
      } catch (error) {
        console.error("OOXML 삽입 또는 ContentControl 숨김 처리 실패:", error);
      }

      // 8. 최종 적용된 상태 확인
      const updatedFlat = ctx.document.body.getOoxml();
      await ctx.sync();
      const finalDocXml = extractDocumentXml(updatedFlat.value);
      console.log("최종 적용된 Document XML:\n", formatXML(finalDocXml));
      
      // 9. 최종 XML에서 다시 JSON 구조 추출 (중요 변경점!)
      const finalXmlDoc = new DOMParser().parseFromString(finalDocXml, "text/xml");
      const finalJson = extractJsonFromContentControls(finalXmlDoc);
      console.log("최종 문서에서 추출한 JSON 구조:\n", JSON.stringify(finalJson, null, 2));
      
      console.log("=== 문서 구조 업데이트 완료 ===");
      saveDocumentState(finalJson); // 최종 문서 상태 저장
      return finalJson;
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

/**
 * 모든 ContentControl을's appearance 속성을 Hidden으로 설정
 * @param context Word 실행 컨텍스트
 */
async function hideAllContentControls(context: Word.RequestContext): Promise<void> {
  try {
    // 모든 ContentControl 가져오기
    const contentControls = context.document.contentControls;
    contentControls.load("items");
    await context.sync();
    
    // console.log(`총 ${contentControls.items.length}개의 ContentControl을 발견했습니다.`);
    
    // 각 ContentControl의 appearance 속성을 hidden으로 설정
    for (let i = 0; i < contentControls.items.length; i++) {
      const control = contentControls.items[i];
      control.appearance = Word.ContentControlAppearance.boundingBox;
    }
    
    // 변경사항 동기화
    await context.sync();
    
    // console.log(`${contentControls.items.length}개의 ContentControl을 hidden으로 설정했습니다.`);
  } catch (error) {
    console.error("ContentControl 숨김 처리 중 오류 발생:", error);
    throw error;
  }
}

/**
 * 모든 ContentControl 숨김 처리 함수 (단독 실행용)
 */
export async function hideAllContentControlsInDocument(): Promise<void> {
  return Word.run(async context => {
    try {
      await hideAllContentControls(context);
      console.log("모든 ContentControl 숨김 처리 완료");
    } catch (error) {
      console.error("ContentControl 숨김 처리 중 오류 발생:", error);
      throw error;
    }
  });
}

// 문서 상태 저장 함수 개선
/**
 * 문서 JSON 상태 저장
 * @param json 저장할 JSON 객체
 */
export function saveDocumentState(json: Record<string, any>): void {
  try {
    // 저장 전에 메타 정보 추가
    // json._meta = {
    //   version: "1.0",
    //   timestamp: new Date().toISOString(),
    //   documentUrl: Office.context.document.url || "unknown"
    // };
    
    // _idMapping은 더 이상 필요하지 않으므로 제거
    // Content Control의 w:tag 값이 직접 JSON의 키로 사용되므로 매핑이 불필요
    if (json._idMapping) {
      delete json._idMapping;
    }
    
    console.log("문서 상태 저장 (요소 수):", Object.keys(json).filter(key => !key.startsWith('_')).length);
    
    // Office 문서 설정에 저장
    Office.context.document.settings.set('documentJsonStructure', json);
    Office.context.document.settings.saveAsync();
    
    // 백업용 로컬 스토리지 저장
    const documentId = Office.context.document.url || 'current-document';
    localStorage.setItem(`document-${documentId}-json`, JSON.stringify(json));
  } catch (error) {
    console.error("문서 상태 저장 중 오류:", error);
  }
}

// 문서 상태 불러오기
export function loadDocumentState(): Record<string, any> {
  try {
    // 먼저 Office 설정에서 불러오기 시도
    const savedJson = Office.context.document.settings.get('documentJsonStructure');
    if (savedJson) {
      cachedDocumentJson = savedJson;
      return savedJson;
    }
    
    // 실패하면 로컬 스토리지 백업 시도
    const documentId = Office.context.document.url || 'current-document';
    const backupJson = localStorage.getItem(`document-${documentId}-backup`);
    if (backupJson) {
      const parsed = JSON.parse(backupJson);
      cachedDocumentJson = parsed;
      return parsed;
    }
    
    return {};
  } catch (error) {
    console.error('Error loading document state:', error);
    return {};
  }
}

/**
 * Word 문서의 document.xml 콘텐츠를 추출하는 함수
 * @returns document.xml의 내용을 담은 Promise
 */
export async function getDocumentXml(): Promise<string> {
  try {
    // Word API 컨텍스트 생성
    const ctx = new Word.RequestContext();
    
    // 문서 본문의 OOXML 가져오기
    const flat = ctx.document.body.getOoxml();
    await ctx.sync();
    
    // 전체 Flat OPC XML
    const fullFlatXml = flat.value;
    
    // document.xml 부분만 추출
    const docXml = extractDocumentXml(fullFlatXml);
    return docXml;
  } catch (error) {
    console.error("문서 XML 추출 중 오류 발생:", error);
    throw error;
  }
}