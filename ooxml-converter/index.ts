import * as fs from 'fs'; // Node.js 파일 시스템 모듈
import * as path from 'path'; // Node.js 경로 모듈
import { convertOoxmlToJson } from './converter'; // converter.ts 에서 함수 가져오기
import { normalizeOoxml } from './normalizer'; // 정규화 함수 임포트

const projectRoot = path.resolve(__dirname, '..'); // dist 폴더의 부모, 즉 ooxml-converter 폴더

// 기존 XML 파일 경로
const xmlFilePath = path.join(projectRoot, 'dist', 'document.xml');
// 기존 정규화된 XML을 저장할 파일 경로
const normalizedXmlOutputPath = path.join(projectRoot, 'dist', 'document_normalized.xml');

// 콘텐츠 컨트롤이 포함된 XML 파일 경로
const contentControlXmlFilePath = path.join(projectRoot, 'dist', 'document_content_control.xml');
// 콘텐츠 컨트롤이 포함된 XML의 정규화된 결과를 저장할 파일 경로
const contentControlNormalizedXmlOutputPath = path.join(projectRoot, 'dist', 'document_content_control_normalized.xml');

// 변환된 JSON을 저장할 파일 경로 (이 부분은 어떤 XML을 기준으로 할지 명확하지 않아 일단 유지합니다.)
const jsonOutputPath = path.join(projectRoot, 'dist', 'output.json');
// dist 폴더 내의 컴파일된 SEF JSON 파일 경로
const xsltSefFilePath = path.join(projectRoot, 'dist', 'normalize-runs.sef.json'); 

async function main() {
    try {
        // --- 기존 document.xml 정규화 로직 ---
        console.log(`XML 파일 읽는 중: ${xmlFilePath}`);
        const originalXmlString = fs.readFileSync(xmlFilePath, 'utf-8');
        console.log('XML 파일 읽기 완료.');

        console.log('OOXML 정규화 시작 (document.xml)...');
        const normalizedXmlString = await normalizeOoxml(originalXmlString, xsltSefFilePath);
        console.log('OOXML 정규화 완료 (document.xml).');

        fs.writeFileSync(normalizedXmlOutputPath, normalizedXmlString, 'utf-8');
        console.log(`정규화된 XML 저장 완료: ${normalizedXmlOutputPath}`);

        // --- document_content_control.xml 정규화 로직 추가 ---
        if (fs.existsSync(contentControlXmlFilePath)) {
            console.log(`\nXML 파일 읽는 중 (콘텐츠 컨트롤 포함): ${contentControlXmlFilePath}`);
            let contentControlXmlString = fs.readFileSync(contentControlXmlFilePath, 'utf-8');
            console.log('XML 파일 읽기 완료 (콘텐츠 컨트롤 포함).');

            // 잘못된 이스케이프된 따옴표가 있는지 확인하고, 있다면 수정 후 파일에 다시 씀
            if (contentControlXmlString.includes('\\"')) {
                console.log('잘못된 이스케이프 따옴표 감지. 파일을 수정합니다...');
                const correctedXmlString = contentControlXmlString.replace(/\\"/g, '"');
                fs.writeFileSync(contentControlXmlFilePath, correctedXmlString, 'utf-8');
                console.log(`파일 수정 완료: ${contentControlXmlFilePath}`);
                // 수정된 내용을 다시 읽어옴 (혹은 correctedXmlString을 계속 사용)
                contentControlXmlString = correctedXmlString; 
            } else {
                console.log('잘못된 이스케이프 따옴표가 발견되지 않았습니다.');
            }

            // 현재 문자열에 혹시 남아있을 수 있는 (또는 새로 유입될 수 있는) 잘못된 이스케이프 따옴표 수정 (기존 로직 유지)
            contentControlXmlString = contentControlXmlString.replace(/\\"/g, '"');
            console.log('메모리 내 문자열의 잘못된 이스케이프 따옴표 수정 완료.');

            console.log('OOXML 정규화 시작 (document_content_control.xml)...');
            const normalizedContentControlXmlString = await normalizeOoxml(contentControlXmlString, xsltSefFilePath);
            console.log('OOXML 정규화 완료 (document_content_control.xml).');

            fs.writeFileSync(contentControlNormalizedXmlOutputPath, normalizedContentControlXmlString, 'utf-8');
            console.log(`정규화된 XML 저장 완료 (콘텐츠 컨트롤 포함): ${contentControlNormalizedXmlOutputPath}`);
        } else {
            console.warn(`\n경고: ${contentControlXmlFilePath} 파일을 찾을 수 없습니다. 해당 파일의 정규화를 건너<0xEB><0x9C><0x85>니다.`);
        }

        // 3. 정규화된 OOXML -> JSON 변환 함수 호출 (어떤 XML을 기준으로 할지는 추후 결정 필요)
        // 여기서는 기존 로직대로 normalizedXmlString (document.xml 기반)을 사용합니다.
        console.log('\n정규화된 OOXML (document.xml 기반) -> JSON 변환 시작...');
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