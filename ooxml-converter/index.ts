import * as fs from 'fs'; // Node.js 파일 시스템 모듈
import * as path from 'path'; // Node.js 경로 모듈
import { convertOoxmlToJson } from './converter'; // converter.ts 에서 함수 가져오기
import { normalizeOoxml } from './normalizer'; // 정규화 함수 임포트

const projectRoot = path.resolve(__dirname, '..'); // dist 폴더의 부모, 즉 ooxml-converter 폴더

// 변환할 XML 파일 경로 (이 스크립트와 같은 폴더에 있다고 가정)
const xmlFilePath = path.join(projectRoot, 'dist', 'document.xml');
// 정규화된 XML을 저장할 파일 경로 (선택 사항, 디버깅용)
const normalizedXmlOutputPath = path.join(projectRoot, 'dist', 'document_normalized.xml');
// 변환된 JSON을 저장할 파일 경로
const jsonOutputPath = path.join(projectRoot, 'dist', 'output.json');
// dist 폴더 내의 컴파일된 SEF JSON 파일 경로
const xsltSefFilePath = path.join(projectRoot, 'dist', 'normalize-runs.sef.json'); 

async function main() {
    try {
        // 1. XML 파일 읽기
        console.log(`XML 파일 읽는 중: ${xmlFilePath}`);
        const originalXmlString = fs.readFileSync(xmlFilePath, 'utf-8');
        console.log('XML 파일 읽기 완료.');

        // 2. OOXML 정규화 (XSLT 사용)
        console.log('OOXML 정규화 시작...');
        const normalizedXmlString = await normalizeOoxml(originalXmlString, xsltSefFilePath);
        console.log('OOXML 정규화 완료.');

        // (선택 사항) 정규화된 XML 파일로 저장
        fs.writeFileSync(normalizedXmlOutputPath, normalizedXmlString, 'utf-8');
        console.log(`정규화된 XML 저장 완료: ${normalizedXmlOutputPath}`);

        // 3. 정규화된 OOXML -> JSON 변환 함수 호출
        console.log('정규화된 OOXML -> JSON 변환 시작...');
        const documentJson = convertOoxmlToJson(normalizedXmlString);
        console.log('OOXML -> JSON 변환 완료.');

        // 4. 변환된 JSON 결과를 파일로 저장
        console.log(`JSON 결과 저장 중: ${jsonOutputPath}`);
        fs.writeFileSync(jsonOutputPath, JSON.stringify(documentJson, null, 2), 'utf-8');
        console.log(`JSON 결과 저장 완료: ${jsonOutputPath}`);

    } catch (error) {
        console.error('변환 중 오류 발생:', error);
    }
}

main();