import * as SaxonJS from 'saxon-js'; // Saxon-JS 라이브러리 임포트
import * as fs from 'fs';
import * as path from 'path';

/**
 * 주어진 OOXML 문자열에 XSLT 변환을 적용하여 정규화합니다.
 * @param ooxmlString 원본 OOXML 문자열
 * @param xsltSefFilePath 적용할 XSLT 파일의 경로 (SEF 파일이 아닌 .sef.json 파일)
 * @returns 정규화된 OOXML 문자열
 */
export async function normalizeOoxml(ooxmlString: string, xsltSefFilePath: string): Promise<string> {
  try {
    // SEF 파일을 사용하므로, xsltSefFilePath는 .sef.json 파일의 경로여야 합니다.
    // dist 폴더 내의 경로를 사용하도록 index.ts에서 조정 필요
    const sefJson = JSON.parse(fs.readFileSync(xsltSefFilePath, 'utf-8'));

    console.log(`XSLT 정규화 (SEF 파일 사용) 시작: ${xsltSefFilePath}`);
    const result = await SaxonJS.transform({
      stylesheetInternal: sefJson, // 파싱된 SEF JSON 객체 전달
      sourceText: ooxmlString,
      destination: "serialized",
    });
    
    console.log("XSLT 정규화 완료.");
    return (result as any).principalResult;
  } catch (error) {
    console.error("OOXML 정규화 중 오류 발생 (SaxonJS with SEF):", error);
    throw error;
  }
}