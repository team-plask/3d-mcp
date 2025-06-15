import type { IHostConfig, ElementConfig } from './config.interface';

const ELEMENT_CONFIG: Record<string, ElementConfig> = {
  paragraph: {
    type: 'structural',
    xmlTag: 'w:p',
    requiresPrwWrapper: true, // ❗ 행(row)을 SDT로 감싸지 않고 암시적으로 처리
    sdtType: 'block',
    children: {
      pPr: {
        type: 'property',
        xmlTag: 'w:pPr',
        jsonKey: 'properties',
        children: {
          jc: { type: 'leaf', xmlTag: 'w:jc', jsonKey: 'justification', parameters: ['w:val'] },
          spacing: { type: 'leaf', xmlTag: 'w:spacing', jsonKey: 'spacing', parameters: ['w:after', 'w:before', 'w:line', 'w:lineRule'] },
          ind: { type: 'leaf', xmlTag: 'w:ind', jsonKey: 'indentation', parameters: ['w:left', 'w:right', 'w:firstLine', 'w:hanging'] },
          rPr: { // 단락 기본 런 속성
            type: 'property',
            xmlTag: 'w:rPr',
            jsonKey: 'runProperties',
            children: {
              rFonts: { type: 'leaf', xmlTag: 'w:rFonts', jsonKey: 'fonts', parameters: ['w:ascii', 'w:hAnsi', 'w:cs', 'w:eastAsia', 'w:hint'] },
              b: { type: 'leaf', xmlTag: 'w:b', jsonKey: 'bold', parameters: ['w:val'] },
              i: { type: 'leaf', xmlTag: 'w:i', jsonKey: 'italic', parameters: ['w:val'] },
              u: { type: 'leaf', xmlTag: 'w:u', jsonKey: 'underline', parameters: ['w:val'] },
              color: { type: 'leaf', xmlTag: 'w:color', jsonKey: 'color', parameters: ['w:val'] },
              sz: { type: 'leaf', xmlTag: 'w:sz', jsonKey: 'fontSize', parameters: ['w:val'] },
              szCs: { type: 'leaf', xmlTag: 'w:szCs', jsonKey: 'fontSizeCs', parameters: ['w:val'] },
              lang: { type: 'leaf', xmlTag: 'w:lang', jsonKey: 'language', parameters: ['w:val'] }
            }
          }
        }
      }
    }
  },
  run: {
    type: 'structural',
    xmlTag: 'w:r',
    sdtType: 'richText',
    children: {
      rPr: {
        type: 'property',
        xmlTag: 'w:rPr',
        jsonKey: 'properties',
        children: {
          b: { type: 'leaf', xmlTag: 'w:b', jsonKey: 'bold', parameters: ['w:val'] },
          i: { type: 'leaf', xmlTag: 'w:i', jsonKey: 'italic', parameters: ['w:val'] },
          u: { type: 'leaf', xmlTag: 'w:u', jsonKey: 'underline', parameters: ['w:val'] },
          color: { type: 'leaf', xmlTag: 'w:color', jsonKey: 'color', parameters: ['w:val'] },
          sz: { type: 'leaf', xmlTag: 'w:sz', jsonKey: 'fontSize', parameters: ['w:val'] },
          szCs: { type: 'leaf', xmlTag: 'w:szCs', jsonKey: 'fontSizeCs', parameters: ['w:val'] },
          rFonts: { type: 'leaf', xmlTag: 'w:rFonts', jsonKey: 'fonts', parameters: ['w:ascii', 'w:hAnsi', 'w:cs', 'w:eastAsia', 'w:hint'] },
          lang: { type: 'leaf', xmlTag: 'w:lang', jsonKey: 'language', parameters: ['w:val'] }
        }
      },
      t: { type: 'leaf', xmlTag: 'w:t', jsonKey: 'text' },
    }
  },
  table: {
    type: 'structural',
    xmlTag: 'w:tbl',
    processRowsImplicitly: true, // ❗ 행(row)을 SDT로 감싸지 않고 암시적으로 처리
    sdtType: 'block',
    children: {
      tblPr: {
        type: 'property',
        xmlTag: 'w:tblPr',
        jsonKey: 'properties',
        children: {
          tblStyle: { type: 'leaf', xmlTag: 'w:tblStyle', jsonKey: 'style', parameters: ['w:val'] },
          tblW: { type: 'leaf', xmlTag: 'w:tblW', jsonKey: 'width', parameters: ['w:w', 'w:type'] },
          tblInd: { type: 'leaf', xmlTag: 'w:tblInd', jsonKey: 'indentation', parameters: ['w:w', 'w:type'] },
          tblBorders: {
            type: 'property', xmlTag: 'w:tblBorders', jsonKey: 'borders',
            children: {
              top: { type: 'leaf', xmlTag: 'w:top', jsonKey: 'top', parameters: ['w:val', 'w:sz', 'w:space', 'w:color'] },
              left: { type: 'leaf', xmlTag: 'w:left', jsonKey: 'left', parameters: ['w:val', 'w:sz', 'w:space', 'w:color'] },
              bottom: { type: 'leaf', xmlTag: 'w:bottom', jsonKey: 'bottom', parameters: ['w:val', 'w:sz', 'w:space', 'w:color'] },
              right: { type: 'leaf', xmlTag: 'w:right', jsonKey: 'right', parameters: ['w:val', 'w:sz', 'w:space', 'w:color'] },
              insideH: { type: 'leaf', xmlTag: 'w:insideH', jsonKey: 'insideH', parameters: ['w:val', 'w:sz', 'w:space', 'w:color'] },
              insideV: { type: 'leaf', xmlTag: 'w:insideV', jsonKey: 'insideV', parameters: ['w:val', 'w:sz', 'w:space', 'w:color'] }
            }
          },
          tblLook: { type: 'leaf', xmlTag: 'w:tblLook', jsonKey: 'look', parameters: ['w:val', 'w:firstRow', 'w:lastRow', 'w:firstColumn', 'w:lastColumn', 'w:noHBand', 'w:noVBand'] }
        }
      },
      tblGrid: {
        type: 'property', xmlTag: 'w:tblGrid', jsonKey: 'grid',
        children: {
          gridCol: { type: 'leaf', xmlTag: 'w:gridCol', jsonKey: 'columns', parameters: ['w:w'], isList: true }
        }
      }
      // <w:tr> 자식 설정은 여기서 직접 다루지 않음
    },
    requiresPrwWrapper: true, // 👈 이 줄 추가
  },
  tableRow: {
    type: 'structural', // 행 자체는 구조적 요소
    xmlTag: 'w:tr',
    children: {
        properties: {
            type: 'property',
            xmlTag: 'w:trPr', // 행 속성은 <w:trPr> 안에 정의됨
            jsonKey: 'properties',
            children: {
                // 여기에 추가하고 싶은 행 속성을 정의합니다.
                trHeight: {
                    type: 'leaf',
                    xmlTag: 'w:trHeight',
                    jsonKey: 'height', // JSON에서 사용할 키 이름
                    parameters: ['w:val', 'w:hRule'] // <w:trHeight>가 가질 수 있는 XML 속성들
                },
                cantSplit: { // 예: 행 나눠짐 방지
                    type: 'leaf',
                    xmlTag: 'w:cantSplit',
                    jsonKey: 'cantSplit',
                    parameters: ['w:val']
                },
                tblHeader: { // 예: 머리글 행 반복
                    type: 'leaf',
                    xmlTag: 'w:tblHeader',
                    jsonKey: 'isHeader',
                    parameters: [] // <w:tblHeader/> 처럼 속성 없이 존재만으로 의미를 가짐
                }
            }
        }
    }
  },
  tableCell: {
    type: 'structural',
    xmlTag: 'w:tc',
    sdtType: 'cell',
    children: {
      tcPr: {
        type: 'property', xmlTag: 'w:tcPr', jsonKey: 'properties',
        children: {
          tcW: { type: 'leaf', xmlTag: 'w:tcW', jsonKey: 'width', parameters: ['w:w', 'w:type'] },
          gridSpan: { type: 'leaf', xmlTag: 'w:gridSpan', jsonKey: 'gridSpan', parameters: ['w:val'] },
          vMerge: { type: 'leaf', xmlTag: 'w:vMerge', jsonKey: 'vMerge', parameters: ['w:val'] },
          tcBorders: {
            type: 'property', xmlTag: 'w:tcBorders', jsonKey: 'borders',
            children: {
              top: { type: 'leaf', xmlTag: 'w:top', jsonKey: 'top', parameters: ['w:val', 'w:sz', 'w:space', 'w:color'] },
              left: { type: 'leaf', xmlTag: 'w:left', jsonKey: 'left', parameters: ['w:val', 'w:sz', 'w:space', 'w:color'] },
              bottom: { type: 'leaf', xmlTag: 'w:bottom', jsonKey: 'bottom', parameters: ['w:val', 'w:sz', 'w:space', 'w:color'] },
              right: { type: 'leaf', xmlTag: 'w:right', jsonKey: 'right', parameters: ['w:val', 'w:sz', 'w:space', 'w:color'] }
            }
          },
          vAlign: { type: 'leaf', xmlTag: 'w:vAlign', jsonKey: 'vAlign', parameters: ['w:val'] },
          shd: { type: 'leaf', xmlTag: 'w:shd', jsonKey: 'shading', parameters: ['w:val', 'w:color', 'w:fill', 'w:themeFill', 'w:themeFillShade'] }
        }
      }
    }
  },
  hyperlink: {
    type: 'structural',
    xmlTag: 'w:hyperlink',
    sdtType: 'richText',
    parameters: ['r:id', 'w:anchor', 'w:history'],
    children: {}
  },
  drawing: {
    type: 'structural',
    xmlTag: 'w:drawing',
    sdtType: 'block',
    children: {
      inline: {
        type: 'property', // drawing의 세부 속성으로 취급
        xmlTag: 'wp:inline',
        jsonKey: 'inline', // JSON에서 사용할 키
        // wp:inline의 직접 속성들 (예: distT, distB 등)
        parameters: ['distT', 'distB', 'distL', 'distR'],
        children: {
          extent: { type: 'leaf', xmlTag: 'wp:extent', jsonKey: 'extent', parameters: ['cx', 'cy'] },
          docPr: { type: 'leaf', xmlTag: 'wp:docPr', jsonKey: 'docProperties', parameters: ['id', 'name', 'descr'] },
          graphic: {
            type: 'property', xmlTag: 'a:graphic', jsonKey: 'graphic',
            children: {
              graphicData: {
                type: 'property', xmlTag: 'a:graphicData', parameters: ['uri'], jsonKey: 'graphicData',
                children: {
                  pic: {
                    type: 'property', xmlTag: 'pic:pic', jsonKey: 'picture',
                    children: {
                      blipFill: {
                        type: 'property', xmlTag: 'pic:blipFill', jsonKey: 'blipFill',
                        children: {
                          blip: { // a:blip에서 r:embed 추출
                            type: 'leaf',
                            xmlTag: 'a:blip',
                            jsonKey: 'blipReference',
                            parameters: ['r:embed', 'cstate'] // ❗ r:embed 필수 추출
                          }
                        }
                      },
                      spPr: { type: 'property', xmlTag: 'pic:spPr', jsonKey: 'shapeProperties', children: { /* 상세 정의 필요시 */ } }
                    }
                  }
                }
              }
            }
          }
        }
      },
      anchor: { // wp:anchor도 inline과 유사하게 상세 정의
        type: 'property',
        xmlTag: 'wp:anchor',
        jsonKey: 'anchor',
        // ... (inline과 유사한 상세 자식 구조 정의) ...
        parameters: ['simplePos', 'relativeHeight', 'behindDoc', 'locked', 'layoutInCell', 'allowOverlap'],
        children: {
          extent: { type: 'leaf', xmlTag: 'wp:extent', jsonKey: 'extent', parameters: ['cx', 'cy'] },
          docPr: { type: 'leaf', xmlTag: 'wp:docPr', jsonKey: 'docProperties', parameters: ['id', 'name', 'descr'] },
          graphic: {
            type: 'property', xmlTag: 'a:graphic', jsonKey: 'graphic',
            children: {
              graphicData: {
                type: 'property', xmlTag: 'a:graphicData', parameters: ['uri'], jsonKey: 'graphicData',
                children: {
                  pic: {
                    type: 'property', xmlTag: 'pic:pic', jsonKey: 'picture',
                    children: {
                      blipFill: {
                        type: 'property', xmlTag: 'pic:blipFill', jsonKey: 'blipFill',
                        children: {
                          blip: { // a:blip에서 r:embed 추출
                            type: 'leaf',
                            xmlTag: 'a:blip',
                            jsonKey: 'blipReference',
                            parameters: ['r:embed', 'cstate'] // ❗ r:embed 필수 추출
                          }
                        }
                      },
                      spPr: { type: 'property', xmlTag: 'pic:spPr', jsonKey: 'shapeProperties', children: { /* 상세 정의 필요시 */ } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    // requiresPrwWrapper: true,
  },
};

export const TAG_TO_TYPE: Record<string, string> = {
    'w:p': 'paragraph', 'w:r': 'run', 'w:tbl': 'table',
    'w:tc': 'tableCell', 'w:hyperlink': 'hyperlink', 'w:drawing': 'drawing'
  };
  
  // IHostConfig 인터페이스를 구현하는 단일 설정 객체 생성
export const wordConfig: IHostConfig = {
    hostType: 'Word',
    mainPartPath: '/word/document.xml',
    namespaces: {
        w: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
        wp: "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
        a: "http://schemas.openxmlformats.org/drawingml/2006/main",
        pic: "http://schemas.openxmlformats.org/drawingml/2006/picture",
        r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
    },
    tagToType: TAG_TO_TYPE,
    elementConfig: ELEMENT_CONFIG,
    sdtConfig: { // Word 전용 SDT 관련 설정을 그룹화
        choiceTagMap: {
        richText: "richText", text: "text", picture: "picture", date: "date",
        comboBox: "comboBox", dropDownList: "dropDownList", equation: "equation",
        citation: "citation", group: "group", bibliography: "bibliography",
        docPartObj: "docPartObj", docPartList: "docPartList", block: "richText",
        cell: "richText", inline: "richText", row: null, repeatingSection: null,
        repeatingSectionItem: null, docPartGallery: null,
        },
        defaultSdtIdByType: {
        paragraph: 'block', run: 'richText', table: 'block',
        tableCell: 'cell', hyperlink: 'richText', drawing: 'picture',
        },
        universalDefaultSdtId: 'richText'
    },

    bodyTag: 'w:body',

    /**
     * ✅ [추가] Word의 Content Control(SDT)을 래퍼로 사용하기 위한 설정
     */
    wrapperConfig: {
      tagName: 'w:sdt',
      prTagName: 'w:sdtPr',
      contentTagName: 'w:sdtContent',
      idTagName: 'w:tag',
      aliasTagName: 'w:alias',
    },
};