import * as SaxonJS from 'saxon-js'; // Saxon-JS 라이브러리 임포트
// import * as fs from 'fs'; // Node.js 'fs' 모듈은 웹뷰 환경에서 사용 불가
// import * as path from 'path'; // Node.js 'path' 모듈도 웹뷰 환경에서 사용 불가

/**
 * 주어진 OOXML 문자열에 XSLT 변환을 적용하여 정규화합니다.
 * @param ooxmlString 원본 OOXML 문자열
 * @param sefFileUrl 적용할 SEF JSON 파일의 (웹 접근 가능) URL 또는 상대 경로
 * @returns 정규화된 OOXML 문자열
 */
export async function normalizeOoxml(ooxmlString: string, sefFileUrl: string): Promise<string> {
  try {
    console.log(`Fetching SEF file for normalization: ${sefFileUrl}`);
    const response = await fetch(sefFileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch SEF file at ${sefFileUrl}: ${response.statusText}`);
    }
    const sefJson = await response.json(); // SEF 파일은 JSON 형식이므로 .json()으로 파싱
    
    console.log(`XSLT 정규화 (SEF 로드) 시작: ${sefFileUrl}`);
    const result = await SaxonJS.transform({
      stylesheetInternal: sefJson, // 파싱된 SEF JSON 객체 전달
      sourceText: ooxmlString,
      destination: "serialized",
    });
    
    console.log("XSLT 정규화 완료.");
    return (result as any).principalResult;

  } catch (error) {
    console.error("OOXML 정규화 중 오류 발생 (SaxonJS with SEF in Add-in):", error);
    // 실제 프로덕션에서는 사용자에게 좀 더 친화적인 오류 메시지를 표시하거나,
    // 정규화 없이 원본 XML로 진행하는 등의 폴백 로직을 고려할 수 있습니다.
    throw error; 
  }
}