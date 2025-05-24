/**
 * 단축 ID 생성
 * @param prefix ID 접두어 (p_, t_, r_ 등)
 * @returns 생성된 단축 ID
 */
export function generateShortId(prefix: string = ''): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}${result}`;
  }
  
  /**
   * 단락 ID 생성
   * @returns 생성된 단락 ID
   */
  export function generateParagraphId(): string {
    return generateShortId('p_');
  }
  
  /**
   * 테이블 ID 생성
   * @returns 생성된 테이블 ID
   */
  export function generateTableId(): string {
    return generateShortId('t_');
  }
  
  /**
   * Run ID 생성
   * @returns 생성된 Run ID
   */
  export function generateRunId(): string {
    return generateShortId('r_');
  }