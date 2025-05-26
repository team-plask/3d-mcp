import { TRACKED_ELEMENTS, TAG_TYPE_MAP } from './converter';
import { updateDocumentStructure } from './document'; // 명시적으로 가져옴

/**
 * 요소 ID에서 타입 추출
 */
function getElementTypeFromId(id: string): string {
  if (id.startsWith('p_')) return 'paragraph';
  if (id.startsWith('t_')) return 'table';
  if (id.startsWith('r_')) return 'run';
  if (id.startsWith('i_')) return 'image';
  if (id.startsWith('d_')) return 'drawing';
  return 'unknown';
}

/**
 * 요소 업데이트 (타입에 따라 적절한 처리)
 */
async function updateElement(
  context: Word.RequestContext,
  id: string,
  patches: any,
  currentDoc: Record<string, any>
): Promise<void> {
  try {
    console.log(`Content Control ID: ${id}`);
    
    // Content Control 찾기
    const contentControl = await findContentControlById(context, id);
    if (!contentControl) {
      console.warn(`ID가 ${id}인 Content Control을 찾을 수 없습니다.`);
      return;
    }
    
    // 요소 타입 확인
    const elementType = getElementTypeFromId(id);
    const currentElement = currentDoc[id];
    
    if (!currentElement) {
      console.warn(`ID가 ${id}인 요소를 현재 문서에서 찾을 수 없습니다.`);
      return;
    }
    
    // 요소 타입별 업데이트 처리
    switch (elementType) {
      case 'paragraph':
        await updateParagraph(context, contentControl, patches, currentElement);
        break;
        
      case 'table':
        await updateTable(context, contentControl, patches, currentElement);
        break;
        
      case 'run':
        await updateRun(context, contentControl, patches, currentElement);
        break;
        
      case 'drawing':
      case 'image':
        await updateDrawing(context, contentControl, patches, currentElement);
        break;
        
      default:
        console.warn(`지원하지 않는 요소 타입: ${elementType}, ID: ${id}`);
    }
    
    await context.sync();
    
  } catch (error) {
    console.error(`요소 업데이트 실패 (ID: ${id}):`, error);
    throw error;
  }
}

/**
 * 단락 요소 업데이트
 */
async function updateParagraph(
  context: Word.RequestContext,
  contentControl: Word.ContentControl,
  patches: any,
  currentElement: any
): Promise<void> {
  try {
    const paragraph = contentControl.paragraphs.getFirst();
    
    // 속성 업데이트
    if (patches.attributes) {
      await applyAttributesFromWhitelist(context, paragraph, patches.attributes, 'paragraph');
    }
    
    // Run 요소 업데이트
    for (const key in patches) {
      if (key.startsWith('r_')) {
        const runPatch = patches[key];
        
        // null이면 Run 요소 삭제
        if (runPatch === null) {
          await deleteRunElement(context, contentControl, key);
          continue;
        }
        
        // 현재 문단에서 해당 run 찾기
        const runContentControl = await findContentControlById(context, key);
        
        if (runContentControl) {
          // Run 요소 업데이트
          await updateRun(context, runContentControl, runPatch, currentElement[key]);
        } else {
          console.warn(`Run 요소를 찾을 수 없음: ${key}`);
        }
      }
    }
    
    await context.sync();
  } catch (error) {
    console.error(`단락 업데이트 실패:`, error);
    throw error;
  }
}

/**
 * 테이블 요소 업데이트
 */
async function updateTable(
  context: Word.RequestContext,
  contentControl: Word.ContentControl,
  patches: any,
  currentElement: any
): Promise<void> {
  try {
    const tables = contentControl.tables;
    tables.load("items");
    await context.sync();
    
    if (tables.items.length === 0) {
      console.warn("테이블 요소를 찾을 수 없습니다.");
      return;
    }
    
    const table = tables.items[0];
    
    // 속성 업데이트
    if (patches.attributes) {
      await applyAttributesFromWhitelist(context, table, patches.attributes, 'table');
    }
    
    // 테이블 내 셀/행 업데이트는 별도 구현 필요 (복잡성 때문에)
    
    await context.sync();
  } catch (error) {
    console.error(`테이블 업데이트 실패:`, error);
    throw error;
  }
}

/**
 * 그림 요소 업데이트 (drawing 또는 image)
 */
async function updateDrawing(
  context: Word.RequestContext,
  contentControl: Word.ContentControl,
  patches: any,
  currentElement: any
): Promise<void> {
  try {
    // 인라인 그림 가져오기
    const inlinePictures = contentControl.inlinePictures;
    inlinePictures.load("items");
    await context.sync();
    
    if (inlinePictures.items.length === 0) {
      console.warn("그림 요소를 찾을 수 없습니다.");
      return;
    }
    
    const picture = inlinePictures.items[0];
    
    // 속성 업데이트
    if (patches.attributes) {
      await applyAttributesFromWhitelist(context, picture, patches.attributes, 'drawing');
    }
    
    await context.sync();
  } catch (error) {
    console.error(`그림 업데이트 실패:`, error);
    throw error;
  }
}

/**
 * Run 요소 삭제 - 개선된 버전
 */
async function deleteRunElement(
  context: Word.RequestContext,
  paragraphContentControl: Word.ContentControl,
  runId: string
): Promise<void> {
  try {
    // Run Content Control 찾기
    const runContentControl = await findContentControlById(context, runId);
    
    if (runContentControl) {
      // 현재 Range 로드
      const range = runContentControl.getRange();
      range.load("text,font");
      await context.sync();
      
      // 빈 문자열로 대체
      range.insertText("", Word.InsertLocation.replace);
      await context.sync();
      
      console.log(`Run 요소 ${runId} 삭제 완료`);
    } else {
      console.warn(`삭제할 Run 요소를 찾을 수 없음: ${runId}`);
    }
  } catch (error) {
    console.error(`Run 요소 삭제 실패 (ID: ${runId}):`, error);
    // 오류를 throw하지 않고 처리 - 다른 요소 업데이트가 계속 진행되도록 함
  }
}

/**
 * 단락 속성 적용 (화이트리스트 기반)
 */
async function applyParagraphAttributes(
  context: Word.RequestContext,
  paragraph: Word.Paragraph,
  attributes: any
): Promise<void> {
  try {
    // TRACKED_ELEMENTS에서 paragraph 타입의 속성 목록 확인
    const allowedAttrs = TRACKED_ELEMENTS['paragraph'].children;
    
    // 정렬 (w:jc)
    if (attributes['w:jc'] && allowedAttrs['w:jc']) {
      const alignment = attributes['w:jc']['w:val'];
      if (alignment) {
        switch (alignment) {
          case 'left':
            paragraph.alignment = Word.Alignment.left;
            break;
          case 'center':
            paragraph.alignment = Word.Alignment.centered;
            break;
          case 'right':
            paragraph.alignment = Word.Alignment.right;
            break;
          case 'justify':
            paragraph.alignment = Word.Alignment.justified;
            break;
          // distributed는 Word JS API에서 지원하지 않음
          case 'distributed':
            // Word.Alignment.justified로 대체 (가장 유사한 옵션)
            paragraph.alignment = Word.Alignment.justified;
            break;
        }
      }
    }
    
    // 단락 간격 (w:spacing)
    if (attributes['w:spacing'] && allowedAttrs['w:spacing']) {
      const spacing = attributes['w:spacing'];
      
      // 줄 간격
      if (spacing['w:line'] !== undefined) {
        paragraph.lineSpacing = parseInt(spacing['w:line']) / 240; // Word 단위 변환
      }
      
      // 단락 뒤 간격
      if (spacing['w:after'] !== undefined) {
        paragraph.spaceAfter = parseInt(spacing['w:after']) / 20; // Word 단위 변환
      }
      
      // 단락 앞 간격
      if (spacing['w:before'] !== undefined) {
        paragraph.spaceBefore = parseInt(spacing['w:before']) / 20; // Word 단위 변환
      }
    }
    
    // 들여쓰기 (w:ind)
    if (attributes['w:ind'] && allowedAttrs['w:ind']) {
      const indent = attributes['w:ind'];
      
      // 왼쪽 들여쓰기
      if (indent['w:left'] !== undefined) {
        paragraph.leftIndent = parseInt(indent['w:left']) / 20; // Word 단위 변환
      }
      
      // 오른쪽 들여쓰기
      if (indent['w:right'] !== undefined) {
        paragraph.rightIndent = parseInt(indent['w:right']) / 20; // Word 단위 변환
      }
      
      // 첫 줄 들여쓰기
      if (indent['w:firstLine'] !== undefined) {
        paragraph.firstLineIndent = parseInt(indent['w:firstLine']) / 20; // Word 단위 변환
      }
      
      // 내어쓰기
      if (indent['w:hanging'] !== undefined) {
        paragraph.firstLineIndent = -parseInt(indent['w:hanging']) / 20; // Word 단위 변환
      }
    }
  } catch (error) {
    console.error("단락 속성 적용 실패:", error);
    throw error;
  }
}

/**
 * 테이블 속성 적용 (화이트리스트 기반)
 */
async function applyTableAttributes(
  context: Word.RequestContext,
  table: Word.Table,
  attributes: any
): Promise<void> {
  try {
    // TRACKED_ELEMENTS에서 table 타입의 속성 목록 확인
    const allowedAttrs = TRACKED_ELEMENTS['table'].children;
    
    // 현재는 Word API에서 테이블 속성을 직접 변경하기 어려움
    // 추후 필요에 따라 구현
    console.log("테이블 속성 적용 - API 제한으로 인해 대부분의 속성 변경이 제한됩니다.");
    
    // 테이블 너비 등은 Word JavaScript API 2.0에서 지원 예정
  } catch (error) {
    console.error("테이블 속성 적용 실패:", error);
    throw error;
  }
}

/**
 * 그림 속성 적용 (화이트리스트 기반)
 */
async function applyDrawingAttributes(
  context: Word.RequestContext,
  picture: Word.InlinePicture,
  attributes: any
): Promise<void> {
  try {
    // TRACKED_ELEMENTS에서 drawing 타입의 속성 목록 확인
    const allowedAttrs = TRACKED_ELEMENTS['drawing'].children;
    
    // 높이/너비 (wp:extent)
    if (attributes['wp:extent'] && allowedAttrs['wp:extent']) {
      const extent = attributes['wp:extent'];
      
      // cx는 너비, cy는 높이 (EMU 단위, 1 인치 = 914,400 EMU)
      if (extent['cx'] !== undefined) {
        const widthInPoints = parseInt(extent['cx']) / 12700; // EMU → 포인트 변환
        picture.width = widthInPoints;
      }
      
      if (extent['cy'] !== undefined) {
        const heightInPoints = parseInt(extent['cy']) / 12700; // EMU → 포인트 변환
        picture.height = heightInPoints;
      }
    }
    
    // 설명 (wp:docPr)
    if (attributes['wp:docPr'] && allowedAttrs['wp:docPr']) {
      const docPr = attributes['wp:docPr'];
      
      if (docPr['descr'] !== undefined) {
        picture.altTextDescription = docPr['descr'];
      }
      
      if (docPr['name'] !== undefined) {
        picture.altTextTitle = docPr['name'];
      }
    }
  } catch (error) {
    console.error("그림 속성 적용 실패:", error);
    throw error;
  }
}

/**
 * Content Control ID로 요소 찾기
 */
async function findContentControlById(
  context: Word.RequestContext,
  id: string
): Promise<Word.ContentControl | null> {
  try {
    // 문서 전체 Content Control 가져오기
    const contentControls = context.document.contentControls;
    contentControls.load("items,tag");
    await context.sync();
    
    // ID와 일치하는 Content Control 찾기
    for (let i = 0; i < contentControls.items.length; i++) {
      const contentControl = contentControls.items[i];
      if (contentControl.tag === id) {
        return contentControl;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Content Control 검색 실패 (ID: ${id}):`, error);
    return null;
  }
}

/**
 * 요소 삭제 - 오류 처리 강화
 */
async function deleteElement(
  context: Word.RequestContext,
  id: string
): Promise<void> {
  try {
    console.log(`요소 ${id} 삭제 시작`);
    
    const contentControl = await findContentControlById(context, id);
    if (!contentControl) {
      console.warn(`삭제할 요소를 찾을 수 없음: ${id}`);
      return;
    }
    
    // 최대한 안전한 삭제 방법 사용
    try {
      // 방법: 내용만 삭제하고 컨트롤은 유지 (가장 안전한 방법)
      // 이 방법은 Word API의 예외 발생을 최소화함
      const range = contentControl.getRange();
      
      // 안전하게 공백으로 대체 (공백 하나)
      range.insertText(" ", Word.InsertLocation.replace);
      await context.sync();
      
      console.log(`요소 ${id} 내용물 삭제 완료 (공백으로 대체)`);
    } catch (error) {
      console.error(`요소 ${id} 삭제 실패:`, error);
    }
  } catch (error) {
    console.error(`요소 ${id} 삭제 프로세스 실패:`, error);
  }
}

/**
 * Run 속성 적용 - Null 체크 강화
 */
async function applyRunAttributes(
  context: Word.RequestContext,
  range: Word.Range,
  attributes: any
): Promise<void> {
  try {
    // 현재 서식 정보 로드
    range.load("font");
    await context.sync();
    
    // 현재 서식 저장
    const currentFont = {
      bold: range.font.bold,
      italic: range.font.italic,
      underline: range.font.underline,
      color: range.font.color,
      size: range.font.size,
      name: range.font.name
    };
    
    console.log(`현재 서식 정보:`, currentFont);
    
    // TRACKED_ELEMENTS에서 run 타입의 속성 목록 확인
    const allowedAttrs = TRACKED_ELEMENTS['run'].children;
    
    // 굵게 (w:b)
    if ('w:b' in attributes && allowedAttrs['w:b']) {
      const isBold = attributes['w:b'] === true || 
                    (typeof attributes['w:b'] === 'object' && 
                     attributes['w:b']['w:val'] !== 'false' && 
                     attributes['w:b']['w:val'] !== '0');
      range.font.bold = isBold;
    }
    
    // 기울임 (w:i)
    if ('w:i' in attributes && allowedAttrs['w:i']) {
      const isItalic = attributes['w:i'] === true || 
                      (typeof attributes['w:i'] === 'object' && 
                       attributes['w:i']['w:val'] !== 'false' && 
                       attributes['w:i']['w:val'] !== '0');
      range.font.italic = isItalic;
    }
    
    // 밑줄 (w:u) - Null 체크 강화
    if ('w:u' in attributes && allowedAttrs['w:u']) {
      let underlineType: Word.UnderlineType | string = "None";
      
      if (attributes['w:u'] === true) {
        underlineType = "Single";
      } else if (attributes['w:u'] === false || attributes['w:u'] === null) {
        underlineType = "None";
      } else if (typeof attributes['w:u'] === 'object' && attributes['w:u']) {
        // null 체크 추가
        if (attributes['w:u']['w:val']) {
          const val = attributes['w:u']['w:val'];
          // Word JS API에서 지원하는 밑줄 유형으로 매핑
          switch (val) {
            case 'single':
              underlineType = "Single";
              break;
            case 'double':
              underlineType = "Double";
              break;
            case 'thick':
              underlineType = "Thick";
              break;
            case 'dotted':
              underlineType = "Dotted";
              break;
            case 'dash':
            case 'dashed':
              underlineType = "Dash";
              break;
            case 'dotDash':
              underlineType = "DotDash";
              break;
            case 'dotDotDash':
              underlineType = "DotDotDash";
              break;
            case 'wave':
              underlineType = "Wave";
              break;
            case 'none':
            case 'false':
            case '0':
              underlineType = "None";
              break;
            default:
              underlineType = "Single";
          }
        } else {
          // w:val이 없으면 기본값 Single 사용
          underlineType = "Single";
        }
      }
      
      // Word.UnderlineType 타입으로 명시적 캐스팅
      range.font.underline = underlineType as Word.UnderlineType;
    }
    
    // 색상 (w:color) - Null 체크 강화
    if ('w:color' in attributes && allowedAttrs['w:color']) {
      if (typeof attributes['w:color'] === 'object' && attributes['w:color'] && attributes['w:color']['w:val']) {
        range.font.color = attributes['w:color']['w:val'];
      }
    }
    
    // 글꼴 크기 (w:sz) - Null 체크 강화
    if ('w:sz' in attributes && allowedAttrs['w:sz']) {
      if (typeof attributes['w:sz'] === 'object' && attributes['w:sz'] && attributes['w:sz']['w:val']) {
        // OOXML의 글꼴 크기는 1/2 포인트 단위
        const fontSize = parseInt(attributes['w:sz']['w:val']) / 2;
        range.font.size = fontSize;
      }
    }
    
    // 글꼴 (w:rFonts) - Null 체크 강화
    if ('w:rFonts' in attributes && allowedAttrs['w:rFonts']) {
      if (typeof attributes['w:rFonts'] === 'object' && attributes['w:rFonts']) {
        // ASCII 글꼴
        if (attributes['w:rFonts']['w:ascii']) {
          range.font.name = attributes['w:rFonts']['w:ascii'];
        }
      }
    }
    
    // 패치에 명시되지 않은 속성은 기존 값 유지
    if (!('w:b' in attributes) && currentFont.bold !== undefined) range.font.bold = currentFont.bold;
    if (!('w:i' in attributes) && currentFont.italic !== undefined) range.font.italic = currentFont.italic;
    if (!('w:u' in attributes) && currentFont.underline !== undefined) range.font.underline = currentFont.underline;
    if (!('w:color' in attributes) && currentFont.color) range.font.color = currentFont.color;
    if (!('w:sz' in attributes) && currentFont.size) range.font.size = currentFont.size;
    if (!('w:rFonts' in attributes) && currentFont.name) range.font.name = currentFont.name;
    
  } catch (error) {
    console.error("Run 속성 적용 실패:", error);
    // 오류 전파하지 않음 - 프로세스가 계속 진행되도록 함
  }
}

/**
 * Run 요소 업데이트 - Content Control 유지하면서 텍스트 변경
 */
async function updateRun(
  context: Word.RequestContext,
  contentControl: Word.ContentControl,
  patches: any,
  currentElement: any
): Promise<void> {
  try {
    console.log(`Content Control ID: ${contentControl.tag}`);
    
    // 속성 업데이트
    if (patches.attributes) {
      try {
        // 텍스트 변경이 있는지 확인
        if (patches.attributes['w:t'] !== undefined) {
          const newText = patches.attributes['w:t'];
          console.log(`텍스트 업데이트: "${newText}"`);
          
          // 중요: 기존 Content Control의 텍스트만 변경하는 안전한 방법
          contentControl.insertText(newText, Word.InsertLocation.replace);
          await context.sync();
          
          // 포맷 적용을 위한 범위 다시 가져오기
          const range = contentControl.getRange();
          range.load("font");
          await context.sync();
          
          // 텍스트 이외의 속성 업데이트
          const formatAttributes = { ...patches.attributes };
          delete formatAttributes['w:t']; // 텍스트는 이미 처리했으므로 제외
          
          if (Object.keys(formatAttributes).length > 0) {
            await applyAttributesFromWhitelist(context, range, formatAttributes, 'run');
          }
        } else {
          // 텍스트 변경이 없는 경우 일반 속성만 업데이트
          const range = contentControl.getRange();
          await applyAttributesFromWhitelist(context, range, patches.attributes, 'run');
        }
      } catch (attributeError) {
        console.error(`Run 속성 업데이트 오류:`, attributeError);
      }
    }
    
    await context.sync();
  } catch (error) {
    console.error(`Run 업데이트 실패:`, error);
  }
}
/**
 * 화이트리스트를 기반으로 속성 적용 - 예외 처리 강화
 */
async function applyAttributesFromWhitelist(
  context: Word.RequestContext,
  element: any,
  attributes: any,
  elementType: string
): Promise<void> {
  try {
    // 화이트리스트에 없는 요소 타입이면 처리하지 않음
    if (!TRACKED_ELEMENTS[elementType]) {
      console.warn(`정의되지 않은 요소 타입: ${elementType}`);
      return;
    }
    
    // 요소 타입별 처리 (화이트리스트 기반)
    try {
      if (elementType === 'paragraph') {
        await applyParagraphAttributes(context, element, attributes);
      } else if (elementType === 'run') {
        await applyRunAttributes(context, element, attributes);
      } else if (elementType === 'table') {
        await applyTableAttributes(context, element, attributes);
      } else if (elementType === 'drawing') {
        await applyDrawingAttributes(context, element, attributes);
      }
    } catch (applyError) {
      console.error(`${elementType} 속성 적용 중 오류:`, applyError);
      // 오류가 발생해도 계속 진행
    }
    
    await context.sync();
  } catch (error) {
    console.error(`속성 적용 실패 (타입: ${elementType}):`, error);
    // 오류를 throw하지 않음 - 상위 함수에서 처리
  }
}

/**
 * 샘플 패치 데이터 제공 - 따옴표 문제 수정
 */
export function getSamplePatch(): Record<string, any> {
  return {
    // 첫 번째 단락 - 제목 수정 및 정렬 변경
    "p_kq1zBkClrT": {
      "attributes": {
        "w:jc": { "w:val": "left" }  // 중앙 정렬에서 왼쪽 정렬로 변경
      },
      "r_5zbnXRBI9j": {  // 제목 텍스트 수정
        "attributes": {
          "w:t": "Off-Campus 학기제 안내 (2024 개정)",
          "w:sz": { "w:val": "40" }  // 글꼴 크기 증가 (OOXML 단위)
        }
      }
    },
    
    // 두 번째 단락 - 관련 지침 텍스트 업데이트
    "p_FXWOB8hqZR": {
      "attributes": {
        "w:jc": { "w:val": "right" }  // 중앙 정렬에서 오른쪽 정렬로 변경
      },
      "r_jIX8EPuJG6": {  // "관련 지침:" 텍스트 굵게 및 색상 변경
        "attributes": {
          "w:b": true,  // 굵게 설정
          "w:color": { "w:val": "2E74B5" }  // 파란색으로 변경
        }
      },
      "r_t50w0mAVg": {  // 지침 텍스트 업데이트
        "attributes": {
          "w:t": "학사운영지침 (2024-2025) VIII. Off-Campus 학기제",
          "w:u": { "w:val": "single" }  // 밑줄 추가
        }
      }
    },
    
    // 세 번째 빈 단락 삭제
    "p_GfKluaDgRHS": null
  };
}

/**
 * 문서 패치 적용 (외부에서 호출하는 주 함수) - 에러 처리 개선
 */
export async function writeDocContent(
  patchData: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    // 현재 문서 상태 가져오기
    const documentStructure = await updateDocumentStructure();
    console.log("현재 문서 상태:", documentStructure);
    
    // 패치 적용
    console.log("패치 데이터:", patchData);
    
    // 패치 분석 (변경/삭제 요소 식별)
    const changes = analyzeChanges(patchData);
    console.log("분석된 변경 사항:", changes);
    
    // 변경 적용 결과 추적
    const results = {
      success: 0,
      failed: 0,
      details: [] as Array<{id: string, operation: string, success: boolean, error?: string}>
    };
    
    // Word 문서 작업 컨텍스트 생성
    await Word.run(async context => {
      // 삭제 먼저 처리
      for (const deleteId of changes.deletions) {
        try {
          await deleteElement(context, deleteId);
          results.success++;
          results.details.push({
            id: deleteId,
            operation: 'delete',
            success: true
          });
        } catch (deleteError) {
          results.failed++;
          results.details.push({
            id: deleteId,
            operation: 'delete',
            success: false,
            error: deleteError instanceof Error ? deleteError.message : String(deleteError)
          });
          console.error(`요소 ${deleteId} 삭제 실패:`, deleteError);
          // 오류가 발생해도 계속 진행
        }
      }
      
      // 변경 처리
      for (const updateId of changes.updates) {
        try {
          await updateElement(
            context,
            updateId,
            patchData[updateId],
            documentStructure
          );
          results.success++;
          results.details.push({
            id: updateId,
            operation: 'update',
            success: true
          });
        } catch (updateError) {
          results.failed++;
          results.details.push({
            id: updateId,
            operation: 'update',
            success: false,
            error: updateError instanceof Error ? updateError.message : String(updateError)
          });
          console.error(`요소 ${updateId} 업데이트 실패:`, updateError);
          // 오류가 발생해도 계속 진행
        }
      }
      
      await context.sync();
    });
    
    // 결과 로깅
    console.log(`패치 적용 결과: 성공=${results.success}, 실패=${results.failed}`);
    if (results.failed > 0) {
      console.error("실패한 작업:", results.details.filter(d => !d.success));
    }
    
    return { 
      success: results.failed === 0,
      error: results.failed > 0 ? `${results.failed}개 작업 실패` : undefined
    };
  } catch (error) {
    console.error("문서 내용 편집 실패:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * 패치 변경사항 분석
 */
function analyzeChanges(
  patchData: Record<string, any>
): { updates: string[]; deletions: string[] } {
  const updates: string[] = [];
  const deletions: string[] = [];
  
  for (const id in patchData) {
    if (patchData[id] === null) {
      deletions.push(id);
    } else {
      updates.push(id);
    }
  }
  
  return { updates, deletions };
}

/**
 * 문서 패치 적용 (이전 버전과 호환성 유지)
 */
export async function applyDocumentPatch(
  patchData: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  return writeDocContent(patchData);
}