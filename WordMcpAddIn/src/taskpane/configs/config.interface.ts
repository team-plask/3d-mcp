// src/configs/config.interface.ts

/**
 * 개별 XML 요소의 분석 방법을 정의하는 인터페이스
 */
export interface ElementConfig {
    type: 'structural' | 'property' | 'leaf';
    xmlTag: string; // 예: "w:p", "a:p"
    jsonKey?: string;
    parameters?: string[]; // 예: ["w:val"]
    children?: Record<string, ElementConfig>; 
    isList?: boolean;
    // --- 호스트별 특수 처리 플래그 ---
    processRowsImplicitly?: boolean; // (Word) 테이블 행을 암시적으로 처리할지 여부
    requiresPrwWrapper?: boolean;    // (Word) 더미 단락/런 래퍼가 필요한지 여부
    // --- 식별자/래핑 관련 설정 (Word의 SDT에 해당) ---
    sdtType?: string; // 내부 식별자 (예: 'block', 'cell')
    sdtSpecificConfig?: Record<string, any>; // sdt 종류별 세부 설정
    patchActions?: IPropertyActions;
  }
  
  /**
   * 각 Office 호스트(Word, Excel, PPT)의 XML 처리 방법을 정의하는 메인 설정 인터페이스
   */
  export interface IHostConfig {
    /**
     * 호스트 애플리케이션의 종류
     */
    hostType: 'Word' | 'Excel' | 'PowerPoint';
  
    /**
     * OOXML 패키지 내에서 주 콘텐츠가 담긴 XML 파트의 경로
     */
    mainPartPath: string;
  
    /**
     * 해당 호스트의 XML 스키마에서 사용하는 네임스페이스
     */
    namespaces: Record<string, string>;
  
    /**
     * XML 태그를 내부 분석 타입으로 변환하는 맵
     * 예: { "w:p": "paragraph" }
     */
    tagToType: Record<string, string>;
  
    /**
     * 각 내부 분석 타입별로 XML 요소를 어떻게 처리할지 상세하게 정의한 객체
     */
    elementConfig: Record<string, ElementConfig>;
  
    /**
     * (Word 전용) SDT(Content Control) 관련 설정
     */
    sdtConfig?: {
      choiceTagMap: Record<string, string | null>;
      defaultSdtIdByType: Record<string, string>;
      universalDefaultSdtId: string;
    };
    bodyTag: string;

    /**
     * ✅ [추가] 요소를 감싸서 ID를 부여하는 래퍼(Wrapper) 요소에 대한 설정
     * Word의 경우 Content Control(SDT)에 해당합니다.
     * 이 설정이 없으면 래핑 기능을 사용하지 않는 호스트로 간주됩니다.
     */
    wrapperConfig?: {
      tagName: string;      // 예: 'w:sdt'
      prTagName: string;    // 예: 'w:sdtPr'
      contentTagName: string; // 예: 'w:sdtContent'
      idTagName: string;      // 예: 'w:tag'
      aliasTagName: string;   // 예: 'w:alias'
    };
  }

  export type PatchAction = (
    context: Excel.RequestContext, 
    target: any, // Worksheet, Range 등 API 호출의 대상이 되는 객체
    value: any,  // patch operation에 담긴 새로운 값
    fullTargetJson?: any // 전체 JSON 컨텍스트가 필요한 경우 (예: styleId로 styles 객체 참조)
) => void | Promise<void>;

// 속성별 'add', 'replace', 'remove' 액션을 정의
export interface IPropertyActions {
    add?: PatchAction;
    replace?: PatchAction;
    remove?: PatchAction;
}