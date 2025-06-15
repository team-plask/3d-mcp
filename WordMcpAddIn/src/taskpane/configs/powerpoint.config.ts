// src/configs/powerpoint.config.ts

import type { IHostConfig, ElementConfig } from './config.interface';

// PowerPoint의 주요 요소에 대한 설정 정의
const ELEMENT_CONFIG: Record<string, ElementConfig> = {
  slide: {
    type: 'structural',
    xmlTag: 'p:sld',
    children: {
      commonSlideData: {
        type: 'structural',
        xmlTag: 'p:cSld',
        children: {
          shapeTree: {
            type: 'structural',
            xmlTag: 'p:spTree',
            jsonKey: 'shapes'
          }
        }
      }
    }
  },
  shape: {
    type: 'structural',
    xmlTag: 'p:sp',
    children: {
      // 도형의 텍스트 본문
      textBody: {
        type: 'structural',
        xmlTag: 'p:txBody',
        jsonKey: 'textBody',
        // 텍스트 본문 안에는 DrawingML의 단락(a:p)이 들어감
        children: { /* a:p, a:r 에 대한 정의가 필요 (Word와 공유 가능) */ }
      }
    }
  },
  // DrawingML (a:p, a:r) 설정은 Word와 공유 가능하므로 별도 파일로 만들거나 여기에 복사
  paragraph: {
    type: 'structural',
    xmlTag: 'a:p',
    // ...
  },
  run: {
    type: 'structural',
    xmlTag: 'a:r',
    // ...
  }
};

const TAG_TO_TYPE: Record<string, string> = {
  'p:sp': 'shape',
  'a:p': 'paragraph',
  'a:r': 'run'
};

export const powerpointConfig: IHostConfig = {
  hostType: 'PowerPoint',
  mainPartPath: '/ppt/slides/slide1.xml', // 기본적으로 첫 번째 슬라이드
  namespaces: {
    p: "http://schemas.openxmlformats.org/presentationml/2006/main",
    a: "http://schemas.openxmlformats.org/drawingml/2006/main",
    r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  },
  tagToType: TAG_TO_TYPE,
  elementConfig: ELEMENT_CONFIG,
  sdtConfig: undefined,
  bodyTag: 'p:sld' // PowerPoint 문서의 루트 요소
};