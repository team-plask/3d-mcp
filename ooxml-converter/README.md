# OOXML (document.xml) to JSON Converter

Word 문서 파일(.docx) `ooxml-converter/document.xml` 파일을 JSON 형식으로 변환

## 사전 준비 사항

1.  **Node.js 및 npm 설치:**
    이 스크립트를 실행하려면 Node.js 런타임 환경과 npm(Node Package Manager)이 필요합니다. 시스템에 설치되어 있지 않다면 [Node.js 공식 웹사이트](https://nodejs.org/)에서 LTS 버전을 다운로드하여 설치하십시오. Node.js를 설치하면 npm도 함께 설치됩니다.
    설치 확인:
    ```bash
    node -v
    npm -v
    ```

## 실행 방법

1.  **의존성 패키지 설치:**
    프로젝트 루트 디렉토리에서 다음 명령어를 실행하여 필요한 라이브러리(`fast-xml-parser` 등)와 개발 의존성(`typescript` 등)을 설치합니다.
    ```bash
    npm install
    ```

2.  **TypeScript 컴파일:**
    다음 명령어를 실행하여 TypeScript 소스 코드 (`.ts`)를 JavaScript 코드 (`.js`)로 컴파일합니다. 컴파일된 파일들은 `dist` 폴더에 생성됩니다.
    ```bash
    npx tsc
    ```
    또는, `package.json`에 `scripts` 항목이 정의되어 있다면 해당 스크립트(예: `npm run build`)를 사용할 수도 있습니다. (현재 `package.json`에는 별도 빌드 스크립트가 없는 것으로 가정)

3.  **변환 스크립트 실행:**
    컴파일이 성공적으로 완료되면, 다음 명령어를 실행하여 변환 프로세스를 시작합니다.
    ```bash
    node dist/index.js
    ```

4.  **결과 확인:**
    스크립트 실행이 완료되면, 프로젝트 루트 디렉토리에 `output.json` 파일이 생성됩니다. 이 파일에 `document.xml`로부터 변환된 JSON 데이터가 저장됩니다.
    터미널에도 변환 과정에 대한 로그가 출력됩니다.

## 스크립트 개요

*   `converter.ts`: 핵심 변환 로직을 담고 있는 TypeScript 파일입니다. OOXML 태그를 파싱하고 지정된 JSON 구조로 매핑합니다.
*   `taskpane.ts`: `document.xml` 파일을 읽어 `converter.ts`의 변환 함수를 호출하고, 결과를 `output.json` 파일로 저장하는 메인 실행 파일입니다.
*   `tsconfig.json`: TypeScript 컴파일러 옵션 설정 파일입니다.

## 참고 사항
**일반 워드 파일을 ooxml로 변형하는 방법:**
1. 변환하고자 하는 Word 문서(.docx)를 압축. (`.docx` 확장자를 `.zip`으로 변경)

2. 터미널에서 unzip 변환하려는워드.zip 실행

3. 생성된 폴더중 'word'폴더의 document.xml이 생성되었는지 확인



