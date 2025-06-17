import type { IHostConfig, ElementConfig } from './config.interface';

// ✅ FIX: 런 속성(rPr)과 단락 기본 런 속성(defRPr)에서 중복 사용될 설정을 상수로 정의
const runPropertiesConfig: Record<string, ElementConfig> = {
  sz: { type: 'leaf', xmlTag: 'a:sz', jsonKey: 'fontSize', parameters: ['val'] },
  b: { type: 'leaf', xmlTag: 'a:b', jsonKey: 'bold', parameters: ['val'] },
  i: { type: 'leaf', xmlTag: 'a:i', jsonKey: 'italic', parameters: ['val'] },
  u: { type: 'leaf', xmlTag: 'a:u', jsonKey: 'underline', parameters: ['val'] },
  solidFill: {
    type: 'property', xmlTag: 'a:solidFill', jsonKey: 'color',
    children: {
      srgbClr: { type: 'leaf', xmlTag: 'a:srgbClr', jsonKey: 'srgbColor', parameters: ['val'] }
    }
  },
  latin: { type: 'leaf', xmlTag: 'a:latin', jsonKey: 'font', parameters: ['typeface'] },
  ea: { type: 'leaf', xmlTag: 'a:ea', jsonKey: 'eastAsianFont', parameters: ['typeface'] }
};


const ELEMENT_CONFIG: Record<string, ElementConfig> = {
  shape: {
    type: 'structural',
    xmlTag: 'p:sp',
    children: {
      nvSpPr: {
        type: 'property',
        xmlTag: 'p:nvSpPr',
        jsonKey: 'nonVisualProperties',
        children: {
          cNvPr: {
            type: 'leaf',
            xmlTag: 'p:cNvPr',
            jsonKey: 'docProperties',
            parameters: ['id', 'name', 'descr']
          },
        }
      },
      spPr: {
        type: 'property',
        xmlTag: 'p:spPr',
        jsonKey: 'properties',
        children: {
          xfrm: {
            type: 'property', xmlTag: 'a:xfrm', jsonKey: 'transform',
            children: {
              off: { type: 'leaf', xmlTag: 'a:off', jsonKey: 'offset', parameters: ['x', 'y']},
              ext: { type: 'leaf', xmlTag: 'a:ext', jsonKey: 'extent', parameters: ['cx', 'cy']},
            }
          },
          solidFill: {
             type: 'property', xmlTag: 'a:solidFill', jsonKey: 'fill',
             children: {
                srgbClr: { type: 'leaf', xmlTag: 'a:srgbClr', jsonKey: 'srgbColor', parameters: ['val'] }
             }
          },
          ln: {
            type: 'property', xmlTag: 'a:ln', jsonKey: 'line',
            parameters: ['w'],
            children: {
              solidFill: {
                type: 'property', xmlTag: 'a:solidFill', jsonKey: 'fill',
                children: {
                   srgbClr: { type: 'leaf', xmlTag: 'a:srgbClr', jsonKey: 'srgbColor', parameters: ['val'] }
                }
              }
            }
          }
        }
      },
      // ✅ FIX: txBody의 자식으로 paragraph가 올 수 있음을 명시
      txBody: {
        type: 'structural',
        xmlTag: 'p:txBody',
        jsonKey: 'textBody',
        children: {
           // a:bodyPr (텍스트박스 속성), a:lstStyle (리스트 스타일) 등
           // paragraph는 여기서 직접 정의하지 않고, 엔진이 자식 노드를 순회하며 TAG_TO_TYPE을 통해 찾도록 함
        }
      }
    }
  },

  paragraph: {
    type: 'structural',
    xmlTag: 'a:p',
    children: {
      pPr: {
        type: 'property',
        xmlTag: 'a:pPr',
        jsonKey: 'properties',
        parameters: ['algn'],
        children: {
          // ✅ FIX: 비어있던 defRPr을 runPropertiesConfig로 구체화
          defRPr: {
            type: 'property',
            xmlTag: 'a:defRPr',
            jsonKey: 'defaultRunProperties',
            children: runPropertiesConfig
          }
        }
      },
      // 엔진이 a:r 자식 노드를 순회하며 TAG_TO_TYPE을 통해 'run'으로 인식
    }
  },

  run: {
    type: 'structural',
    xmlTag: 'a:r',
    children: {
      rPr: {
        type: 'property',
        xmlTag: 'a:rPr',
        jsonKey: 'properties',
        // ✅ FIX: sz,b,i,u 등 일부 속성이 leaf가 아닌 property의 parameters로 잘못 지정되었던 것을 수정
        children: runPropertiesConfig
      },
      t: { type: 'leaf', xmlTag: 'a:t', jsonKey: 'text' }
    }
  },

  picture: {
    type: 'structural',
    xmlTag: 'p:pic',
    children: {
      nvPicPr: {
        type: 'property', xmlTag: 'p:nvPicPr', jsonKey: 'nonVisualProperties',
        children: {
          cNvPr: {
            type: 'leaf', xmlTag: 'p:cNvPr', jsonKey: 'docProperties',
            parameters: ['id', 'name', 'descr']
          },
        }
      },
      blipFill: {
        type: 'property', xmlTag: 'p:blipFill', jsonKey: 'blipFill',
        children: {
          // ✅ FIX: 'blip'이 children의 키가 되도록 수정. 값은 ElementConfig.
          blip: {
            type: 'leaf', xmlTag: 'a:blip', jsonKey: 'blipReference', parameters: ['r:embed']
          }
        }
      },
      spPr: {
        type: 'property', xmlTag: 'p:spPr', jsonKey: 'properties',
        children: {
          xfrm: {
            type: 'property', xmlTag: 'a:xfrm', jsonKey: 'transform',
            children: {
              off: { type: 'leaf', xmlTag: 'a:off', jsonKey: 'offset', parameters: ['x', 'y']},
              ext: { type: 'leaf', xmlTag: 'a:ext', jsonKey: 'extent', parameters: ['cx', 'cy']},
            }
          },
        }
      }
    }
  },

  table: {
    type: 'structural',
    xmlTag: 'a:tbl',
    children: {
        tblPr: {
          type: 'property', xmlTag: 'a:tblPr', jsonKey: 'properties',
          // ✅ FIX: 비어있던 객체를 완전한 ElementConfig로 수정
          children: {
            tblStyleId: { type: 'leaf', xmlTag: 'a:tblStyleId', jsonKey: 'styleId' }
          }
        },
        tblGrid: {
          type: 'property', xmlTag: 'a:tblGrid', jsonKey: 'grid',
          children: {
            gridCol: { type: 'leaf', xmlTag: 'a:gridCol', jsonKey: 'columns', parameters: ['w'], isList: true }
          }
        },
    }
  },
  tableRow: {
    type: 'structural',
    xmlTag: 'a:tr',
    parameters: ['h'],
    children: {
        // 엔진이 a:tc 자식 노드를 순회하여 'tableCell'로 인식
    }
  },
  tableCell: {
    type: 'structural',
    xmlTag: 'a:tc',
    children: {
      txBody: {
        type: 'structural', xmlTag: 'a:txBody', jsonKey: 'textBody',
      },
      tcPr: {
        type: 'property', xmlTag: 'a:tcPr', jsonKey: 'properties',
        // ✅ FIX: 비어있던 객체를 완전한 ElementConfig로 수정
        children: {
          solidFill: {
             type: 'property', xmlTag: 'a:solidFill', jsonKey: 'fill',
             children: {
                srgbClr: { type: 'leaf', xmlTag: 'a:srgbClr', jsonKey: 'srgbColor', parameters: ['val'] }
             }
          }
        }
      },
    }
  }
};


export const TAG_TO_TYPE: Record<string, string> = {
  'p:sp': 'shape',
  'a:p': 'paragraph',
  'a:r': 'run',
  'p:pic': 'picture',
  'a:tbl': 'table',
  'a:tr': 'tableRow',
  'a:tc': 'tableCell'
};


export const powerpointConfig: IHostConfig = {
    hostType: 'PowerPoint',
    mainPartPath: '/ppt/slides/slide1.xml',
    namespaces: {
        p: "http://schemas.openxmlformats.org/presentationml/2006/main",
        a: "http://schemas.openxmlformats.org/drawingml/2006/main",
        r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
    },
    tagToType: TAG_TO_TYPE,
    elementConfig: ELEMENT_CONFIG,
    bodyTag: 'p:spTree',
    attributeIdentifierConfig: {
      targetElementTags: ['p:sp', 'p:pic'],
      pathToIdContainer: ['p:nvSpPr', 'p:cNvPr'],
      idAttributeName: 'name',
      aliasAttributeName: 'descr'
    },
};