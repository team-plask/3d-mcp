import * as fs from 'fs'; // Node.js 파일 시스템 모듈
import * as path from 'path'; // Node.js 경로 모듈
import { convertOoxmlToJson } from './converter'; // converter.ts 에서 함수 가져오기

// 변환할 XML 파일 경로 (이 스크립트와 같은 폴더에 있다고 가정)
const xmlFilePath = path.join(__dirname, 'document.xml');
// 변환된 JSON을 저장할 파일 경로
const jsonOutputPath = path.join(__dirname, 'output.json');

try {
    // 1. XML 파일 읽기 (UTF-8 인코딩으로)
    console.log(`XML 파일 읽는 중: ${xmlFilePath}`);
    const xmlString = fs.readFileSync(xmlFilePath, 'utf-8');
    console.log('XML 파일 읽기 완료.');

    // 2. OOXML -> JSON 변환 함수 호출
    console.log('OOXML -> JSON 변환 시작...');
    const documentJson = convertOoxmlToJson(xmlString);
    console.log('OOXML -> JSON 변환 완료.');

    // 3. 변환된 JSON 결과를 파일로 저장 (예쁘게 출력)
    console.log(`JSON 결과 저장 중: ${jsonOutputPath}`);
    // JSON.stringify의 세 번째 인자 '2'는 가독성을 위한 들여쓰기 공백 수입니다.
    fs.writeFileSync(jsonOutputPath, JSON.stringify(documentJson, null, 2), 'utf-8');
    console.log(`JSON 결과 저장 완료: ${jsonOutputPath}`);

    // 4. (선택 사항) 콘솔에도 JSON 일부 출력 (매우 클 수 있으니 주의)
    // console.log('\n변환된 JSON 일부:');
    // console.log(JSON.stringify(documentJson, null, 2).substring(0, 1000) + '...');

} catch (error) {
    console.error('변환 중 오류 발생:', error);
}