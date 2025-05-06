// src/taskpane/parser.ts
import { DocumentBlock } from './document';

export function normalizeText(t = ''): string {
  return t.replace(/\s+/g, ' ').trim();
}

export function parseFlowNodes(nodes: NodeList, blocks: DocumentBlock[]): void {
  Array.from(nodes).forEach(node => {
    if (node.nodeName === 'P') {
      blocks.push({
        id: '',
        type: 'paragraph',
        content: {
          text: normalizeText((node as HTMLElement).textContent || ''),
          style: (node as HTMLElement).getAttribute('data-style')
              || (node as HTMLElement).getAttribute('class')
              || 'Normal',
        }
      });
    }
    else if (node.nodeName === 'TABLE') {
      const rows = Array.from((node as HTMLTableElement).rows).map(r =>
        Array.from(r.cells).map(c => normalizeText(c.textContent || '')));
      blocks.push({ id:'', type:'table', content:{ rows } });
    }
    else if (node.nodeName === 'IMG') {
      blocks.push({
        id:'', type:'image',
        content:{ src:(node as HTMLImageElement).src }
      });
    }
    else if (node.nodeType === Node.ELEMENT_NODE) {
      parseFlowNodes((node as Element).childNodes, blocks);
    }
  });
}
