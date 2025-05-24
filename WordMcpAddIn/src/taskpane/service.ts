/// <reference types="office-js" />

import { updateDocumentStructure } from './document';

/**
 * JSON RFC Merge Patch를 사용하여 문서 업데이트
 * @param patchData 패치 데이터 (RFC 7396 형식)
 * @returns 성공 여부 및 업데이트된 문서 상태
 */
export async function applyDocumentPatch(patchData: Record<string, any>): Promise<{ success: boolean; document: any, error?: string }> {
  try {
    // 1. 현재 문서 상태 가져오기
    const currentDocument = await updateDocumentStructure();
    
    // 2. 패치 분석 및 변경 사항 식별
    const changes = analyzePatches(currentDocument, patchData);
    console.log("분석된 변경 사항:", changes);
    
    // 3. Word API를 사용하여 변경 사항 적용
    return Word.run(async context => {
      try {
        // 3.1 요소 업데이트
        for (const item of changes.updates) {
          await updateElement(context, item.id, item.patches, currentDocument);
        }
        
        // 3.2 요소 삭제
        for (const id of changes.deletions) {
          await deleteElement(context, id);
        }
        
        await context.sync();
        
        // 4. 업데이트된 문서 상태 반환
        const updatedDocument = await updateDocumentStructure();
        return { 
          success: true, 
          document: updatedDocument 
        };
      } catch (error) {
        console.error("문서 변경 적용 실패:", error);
        throw error;
      }
    });
  } catch (error) {
    console.error("문서 패치 오류:", error);
    return { 
      success: false, 
      document: await updateDocumentStructure(),
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * JSON RFC Merge Patch 분석
 */
function analyzePatches(currentDoc: Record<string, any>, patchData: Record<string, any>): {
  updates: Array<{ id: string; patches: any }>;
  deletions: string[];
} {
  console.log("현재 문서 상태:", currentDoc);
  console.log("패치 데이터:", patchData);
  const updates: Array<{ id: string; patches: any }> = [];
  const deletions: string[] = [];
  
  // 각 패치 키 처리
  for (const key in patchData) {
    // null인 경우 삭제 요청으로 처리
    if (patchData[key] === null) {
      deletions.push(key);
      continue;
    }
    
    // 기존 요소가 있는 경우 업데이트로 처리
    if (currentDoc[key]) {
      updates.push({
        id: key,
        patches: patchData[key]
      });
    } 
    // 기존 요소가 없는 경우는 삽입 로직이 필요하나 현재는 구현하지 않음
  }
  
  return { updates, deletions };
}

/**
 * Content Control ID로 요소 찾기
 */
async function findContentControlById(context: Word.RequestContext, id: string): Promise<Word.ContentControl | null> {
  try {
    // 모든 Content Control 가져오기
    const contentControls = context.document.contentControls;
    contentControls.load("items, tag");
    await context.sync();
    
    // ID(tag 속성값)와 일치하는 Content Control 찾기
    for (const cc of contentControls.items) {
      console.log(`Content Control ID: ${cc.tag}`);
      if (cc.tag === id) {
        return cc;
      }
    }
    
    console.warn(`ID가 ${id}인 Content Control을 찾을 수 없습니다.`);
    return null;
  } catch (error) {
    console.error(`Content Control 찾기 실패 (ID: ${id}):`, error);
    return null;
  }
}

/**
 * 요소 ID에서 타입 추출
 */
function getElementTypeFromId(id: string): string {
  if (id.startsWith('p_')) return 'paragraph';
  if (id.startsWith('t_')) return 'table';
  if (id.startsWith('r_')) return 'run';
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
    // Content Control 찾기
    const contentControl = await findContentControlById(context, id);
    if (!contentControl) {
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
        console.warn(`Run 요소는 직접 업데이트할 수 없습니다: ${id}`);
        break;
        
      default:
        console.warn(`지원하지 않는 요소 타입: ${elementType}, ID: ${id}`);
    }
    
    await context.sync();
    console.log(`요소 업데이트 완료: ${id}`);
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
      applyParagraphAttributes(paragraph, patches.attributes);
    }
    
    // Run 요소 업데이트
    for (const key in patches) {
      if (key.startsWith('r_')) {
        const runPatch = patches[key];
        
        // 현재 문단에서 해당 run 찾기
        const runContentControl = await findContentControlById(context, key);
        
        if (runContentControl) {
          // Run 요소 업데이트
          await updateRun(context, runContentControl, runPatch);
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
 * Run 요소 업데이트
 */
async function updateRun(
  context: Word.RequestContext,
  contentControl: Word.ContentControl,
  patches: any
): Promise<void> {
  try {
    // 텍스트 내용 업데이트
    if (patches.attributes && patches.attributes['w:t'] !== undefined) {
      // 텍스트 교체
      const range = contentControl.getRange();
      range.insertText(patches.attributes['w:t'], Word.InsertLocation.replace);
    }
    
    // 서식 업데이트
    if (patches.attributes) {
      const range = contentControl.getRange();
      applyRunAttributes(range, patches.attributes);
    }
    
    await context.sync();
  } catch (error) {
    console.error(`Run 업데이트 실패:`, error);
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
    const table = contentControl.tables.getFirst();
    
    // 테이블 속성 로드
    table.load("rowCount");
    await context.sync();
    
    // 테이블 첫 번째 행 가져오기
    let columnCount = 1; // 기본값
    if (table.rowCount > 0) {
      try {
        const firstRow = table.rows.getFirst();
        firstRow.load("cellCount");
        await context.sync();
        columnCount = firstRow.cellCount;
      } catch (e) {
        console.error("테이블 행 로드 실패:", e);
      }
    }
    
    // 테이블 속성 업데이트
    if (patches.attributes) {
      applyTableAttributes(table, patches.attributes);
    }
    
    // 셀 업데이트
    if (patches.cells) {
      for (const cellKey in patches.cells) {
        const cellPatch = patches.cells[cellKey];
        
        // 셀 인덱스 추출 (예: cell_0 -> 0)
        const cellIndex = parseInt(cellKey.replace('cell_', ''));
        if (isNaN(cellIndex)) {
          console.warn(`유효하지 않은 셀 키: ${cellKey}`);
          continue;
        }
        
        // 테이블 행과 열 계산
        const row = Math.floor(cellIndex / columnCount);
        const col = cellIndex % columnCount;
        
        // 테이블 범위 확인
        if (row < 0 || row >= table.rowCount || col < 0 || col >= columnCount) {
          console.warn(`테이블 범위를 벗어난 셀: ${cellKey} (행: ${row}, 열: ${col}, 테이블 크기: ${table.rowCount}x${columnCount})`);
          continue;
        }
        
        try {
          // 셀 가져오기
          const cell = table.getCell(row, col);
          
          // null 패치는 셀 내용 삭제로 처리
          if (cellPatch === null) {
            cell.body.clear();
            await context.sync();
            continue;
          }
          
          // 셀 내용 업데이트 (배열 형태의 단락 ID 목록)
          if (Array.isArray(cellPatch)) {
            // 기존 셀 내용 비우기
            cell.body.clear();
            await context.sync();
            
            // 셀에 포함될 단락 ID 목록
            for (const paragraphId of cellPatch) {
              // 현재 문서에 있는 단락인지 확인
              if (currentElement.cells && 
                  currentElement.cells[cellKey] && 
                  currentElement.cells[cellKey].includes(paragraphId)) {
                
                // 문단 ID로 Content Control 찾기
                const paragraphCC = await findContentControlById(context, paragraphId);
                if (paragraphCC) {
                  // Content Control 내용 가져오기
                  const range = paragraphCC.getRange();
                  range.load("text");
                  await context.sync();
                  
                  // 텍스트 복사하여 셀에 삽입
                  cell.body.insertText(range.text, Word.InsertLocation.end);
                } else {
                  console.warn(`단락 ID를 찾을 수 없음: ${paragraphId}`);
                }
              } else {
                console.log(`새 단락 추가 필요: ${paragraphId}`);
              }
            }
          } else {
            console.warn(`셀 패치가 배열이 아님: ${cellKey}`);
          }
        } catch (cellError) {
          console.error(`셀 업데이트 중 오류 발생 (${cellKey}):`, cellError);
        }
      }
    }
    
    await context.sync();
    console.log(`테이블 업데이트 완료: ${contentControl.tag}`);
  } catch (error) {
    console.error(`테이블 업데이트 실패:`, error);
    throw error;
  }
}

/**
 * 요소 삭제
 */
async function deleteElement(context: Word.RequestContext, id: string): Promise<void> {
  try {
    // Content Control 찾기
    const contentControl = await findContentControlById(context, id);
    if (!contentControl) {
      return;
    }
    
    // 요소 삭제 (true: 내용도 함께 삭제)
    contentControl.delete(true);
    
    await context.sync();
    console.log(`요소 삭제 완료: ${id}`);
  } catch (error) {
    console.error(`요소 삭제 실패 (ID: ${id}):`, error);
    throw error;
  }
}

/**
 * 단락에 속성 적용
 */
function applyParagraphAttributes(paragraph: Word.Paragraph, attributes: any): void {
  // 정렬
  if (attributes['w:jc'] && attributes['w:jc']['w:val']) {
    const alignment = attributes['w:jc']['w:val'];
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
    }
  }
  
  // 간격
  if (attributes['w:spacing']) {
    const spacing = attributes['w:spacing'];
    
    // 줄 간격
    if (spacing['w:line']) {
      paragraph.lineSpacing = parseInt(spacing['w:line']) / 240; // Word 단위 변환
    }
    
    // 단락 뒤 간격
    if (spacing['w:after']) {
      paragraph.spaceAfter = parseInt(spacing['w:after']) / 20; // Word 단위 변환
    }
    
    // 단락 앞 간격
    if (spacing['w:before']) {
      paragraph.spaceBefore = parseInt(spacing['w:before']) / 20; // Word 단위 변환
    }
  }
  
  // 들여쓰기
  if (attributes['w:ind']) {
    const indentation = attributes['w:ind'];
    
    // 왼쪽 들여쓰기
    if (indentation['w:left']) {
      paragraph.leftIndent = parseInt(indentation['w:left']) / 20; // Word 단위 변환
    }
    
    // 오른쪽 들여쓰기
    if (indentation['w:right']) {
      paragraph.rightIndent = parseInt(indentation['w:right']) / 20; // Word 단위 변환
    }
    
    // 첫 줄 들여쓰기
    if (indentation['w:firstLine']) {
      paragraph.firstLineIndent = parseInt(indentation['w:firstLine']) / 20; // Word 단위 변환
    }
  }
}

/**
 * Run에 속성 적용 (밑줄 타입 문제 해결)
 */
function applyRunAttributes(range: Word.Range, attributes: any): void {
  // 글꼴 크기
  if (attributes['w:sz'] && attributes['w:sz']['w:val']) {
    range.font.size = parseInt(attributes['w:sz']['w:val']) / 2; // 포인트 단위로 변환
  }
  
  // 밑줄 - Word API 타입에 맞게 수정
  if (attributes['w:u']) {
    const underlineValue = attributes['w:u'];
    
    if (underlineValue === true) {
      // 단순히 true면 기본 밑줄 스타일 적용
      range.font.underline = "Single";
    } else if (typeof underlineValue === 'object' && underlineValue['w:val']) {
      // OOXML 밑줄 값을 Word API 값으로 변환
      const xmlValue = underlineValue['w:val'];
      if (xmlValue === 'none' || xmlValue === 'false') {
        range.font.underline = "None";
      } else if (xmlValue === 'single') {
        range.font.underline = "Single";
      } else if (xmlValue === 'double') {
        range.font.underline = "Double";
      } else {
        // 기본값
        range.font.underline = "Single";
      }
    } else {
      // 밑줄 없음
      range.font.underline = "None";
    }
  }
  
  // 굵게
  if (attributes['w:b'] !== undefined) {
    range.font.bold = attributes['w:b'] === true || 
                    (attributes['w:b']['w:val'] && attributes['w:b']['w:val'] !== 'false');
  }
  
  // 기울임
  if (attributes['w:i'] !== undefined) {
    range.font.italic = attributes['w:i'] === true || 
                       (attributes['w:i']['w:val'] && attributes['w:i']['w:val'] !== 'false');
  }
  
  // 글꼴
  if (attributes['w:rFonts']) {
    if (attributes['w:rFonts']['w:ascii']) {
      range.font.name = attributes['w:rFonts']['w:ascii'];
    }
  }
  
  // 글자색
  if (attributes['w:color'] && attributes['w:color']['w:val']) {
    range.font.color = attributes['w:color']['w:val'];
  }
}

/**
 * 테이블에 속성 적용
 */
function applyTableAttributes(table: Word.Table, attributes: any): void {
  // Word API는 테이블 속성 직접 설정이 제한적임
  // 필요한 테이블 속성이 있다면 여기에 추가
}

/**
 * write_doc 명령으로 문서 편집 (JSON RFC Merge Patch 형식)
 */
export async function writeDocContent(patchData: Record<string, any>): Promise<any> {
  try {
    // 패치 데이터 유효성 검사
    if (!patchData || typeof patchData !== 'object') {
      throw new Error("유효한 패치 데이터가 필요합니다.");
    }
    console.log("문서 편집 패치 데이터:", patchData);
    // 패치 적용
    const result = await applyDocumentPatch(patchData);
    
    // 결과 로깅
    console.log(`문서 편집 결과: ${result.success ? '성공' : '실패'}`);
    if (!result.success && result.error) {
      console.error("편집 오류:", result.error);
    }
    
    return result;
  } catch (error) {
    console.error("문서 내용 편집 실패:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      document: null
    };
  }
}

/**
 * 테스트용 패치 샘플
 */
export function getSamplePatch(): Record<string, any> {
  return {
    // 단락 업데이트 예시
    "p_QodjOgfRsFE": {
      "attributes": {
        "w:jc": { "w:val": "left" } // 가운데 정렬에서 왼쪽 정렬로 변경
      },
      // Run 업데이트 예시
      "r_t8vrovNVre": {
        "attributes": {
          "w:t": "학기제 안내 및 유의사항 (수정됨)"
        }
      }
    },
    
    // 요소 삭제 예시
    "p_fzqduZ0iLVK": null
  };
}

/**
 * 테스트 패치 실행
 */
export async function testPatch(): Promise<void> {
  try {
    const samplePatch = getSamplePatch();
    console.log("테스트 패치 적용:", samplePatch);
    
    const result = await writeDocContent(samplePatch);
    console.log("테스트 패치 결과:", result);
  } catch (error) {
    console.error("테스트 패치 실패:", error);
  }
}