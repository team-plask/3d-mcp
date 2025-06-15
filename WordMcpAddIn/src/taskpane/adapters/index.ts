import { IDocumentAdapter } from './adapter.interface';
import { WordAdapter } from './word.adapter';
import { ExcelAdapter } from './excel.adapter';
import { PowerPointAdapter } from './powerpoint.adapter';

/**
 * 현재 Office 호스트에 맞는 적절한 문서 어댑터 인스턴스를 반환합니다.
 * @param host - Office.HostType (예: Office.HostType.Word)
 * @returns 호스트에 맞는 IDocumentAdapter 구현체 또는 지원하지 않는 경우 null
 */
export function getDocumentAdapter(host: Office.HostType): IDocumentAdapter | null {
  switch (host) {
    case Office.HostType.Word:
      return new WordAdapter();

    case Office.HostType.Excel:
      return new ExcelAdapter();

    case Office.HostType.PowerPoint:
      return new PowerPointAdapter();

    default:
      console.error(`[AdapterFactory] Unsupported host application: ${host}`);
      return null;
  }
}
