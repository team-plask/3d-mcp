declare module 'saxon-js' {
    // 가장 기본적인 선언: 모듈이 존재함을 알리고, 모든 export를 any 타입으로 처리
    const SaxonJS: any;
    export default SaxonJS; // 만약 'import SaxonJS from "saxon-js"' 형태로 사용한다면
    
    // 또는 이전 답변에서 사용한 'import * as SaxonJS from "saxon-js"' 방식과
    // 'SaxonJS.transform' 호출을 고려한 좀 더 구체적인 (하지만 여전히 단순화된) 선언:
    export interface TransformOptions {
      stylesheetText?: string;
      stylesheetLocation?: string;
      stylesheetInternal?: object | any; // stylesheetInternal 속성 추가 또는 수정 (SEF JSON 객체)
      sourceText?: string;
      sourceNode?: Node; // 브라우저 환경의 Node일 경우
      destination?: 'serialized' | 'document' | 'application' | 'json'; // Saxon-JS 문서 참조
      stylesheetParams?: { [key: string]: any };
      deliveryFormat?: 'raw' | 'wrapped' | 'default'; // destination이 'json'일 때 사용될 수 있는 옵션
      initialTemplate?: string; // QName (예: "Q{uri}localName") 또는 unprefixed name
      templateParams?: { [key: string]: any };
      tunnelParams?: { [key: string]: any };
      globalContextItem?: any; // XPath 값
      // ... Saxon-JS 문서에서 제공하는 다른 옵션들
    }
  
    export interface TransformResult {
      principalResult: string | Document | object | null; // destination에 따라 달라짐
      resultDocuments?: { [uri: string]: Document | string };
      outputProperties?: { [key: string]: string };
      // ... Saxon-JS 문서에서 제공하는 다른 결과 속성들
    }
  
    export function transform(options: TransformOptions, s9apiVersion?: string): Promise<TransformResult>;
    
    // 만약 SaxonJS.HE와 같은 다른 객체를 직접 사용한다면, 해당 객체도 선언에 추가
    // export const HE: any; 
  }
  