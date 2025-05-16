/* ------------------------------------------------------------------
 *  OOXML ↔ JSON 변환 + shortId 동기화 (bookmark-less, custom namespace)
 *
 *  ✅ 커스텀 네임스페이스 `cust` + `mc:Ignorable="cust"` 로 shortId 보존
 *     + 파라그래프/런 속성 화이트리스트에도 shortId 주입 (재도입)
 *       - WHITELISTED_PARA_PROPS / WHITELISTED_RUN_PROPS 항목마다
 *         <w:…> 노드에 `cust:id="<shortid>"` 자동 부여
 *  ✅ 북마크·w14:paraId 등 재활용 X ―> 완전히 독립적인 `cust:id` 속성만 사용
 *  ✅ XML 스냅숏을 console.debug 로 실시간 확인  ── (rev.6)
 *      ↳ 2025-05-17  fix: attributeNamePrefix → "" (no prefix) + grouped `:@`
 *        so builder 미리보기에 더 이상 `[object Object]` 가 안 보임
 * ----------------------------------------------------------------*/
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import * as shortid from 'shortid';

/* ---------- 상수 ---------- */
const CUST_PREFIX   = 'cust';            // 커스텀 prefix
const CUST_NS_URI   = 'urn:shortids';    // 임의 URI (고유하면 OK)
const IGNORABLE_VAL = CUST_PREFIX;       // mc:Ignorable 값

// *** attributeNamePrefix 를 비우고 (""),
//     attributesGroupName = ':@'  →   attr 키는 plain name (접두사 없음)
// -----------------------------------------------------------------
const ATTR_PREFIX = '';                  // ← 핵심 변경
const ATTR_GROUP  = ':@';

/* ---------- 속성 화이트리스트 ---------- */
const WHITELISTED_PARA_PROPS = ['w:spacing', 'w:jc', 'w:rPr'];
const WHITELISTED_RUN_PROPS  = ['w:b', 'w:i', 'w:u', 'w:sz', 'w:color', 'w:rFonts'];

/* ---------- 타입 요약 ---------- */
interface Base { type:string; order:number; parentId?:string }
interface ParagraphJson extends Base { type:'paragraph'; properties:any; [rid:string]:any }
interface TableJson     extends Base { type:'table';     [rid:string]:any }
export interface DocumentJson  { [id:string]:ParagraphJson|TableJson }

/* ---------- ID 주입 대상 & 경로 ---------- */
export const ID_TARGET_MAP: Record<string,{ path:string[]; attr:string }> = {
  paragraph:{ path:['w:pPr'],  attr:`${CUST_PREFIX}:id` },
  table:    { path:['w:tblPr'],attr:`${CUST_PREFIX}:id` },
  tableRow: { path:['w:trPr'], attr:`${CUST_PREFIX}:id` },
  tableCell:{ path:['w:tcPr'], attr:`${CUST_PREFIX}:id` }
};

/* ---------- 전역 ---------- */
let orderCnt = 0;

/* ---------- util helpers ---------- */
const genId = () => shortid.generate();
const tagOf = (o:any)=> typeof o==='object'&&o?Object.keys(o).find(k=>k!==ATTR_GROUP&&k!=='#text')||null:null;
const kids  = (arr:any[])=> (Array.isArray(arr)?arr:[]).filter(n=>typeof n==='object'&&tagOf(n));
const content = (obj:any,tg:string)=>Array.isArray(obj?.[tg])?obj[tg]:[];

/**
 * attrNode()
 *  preserveOrder 모드에서 **요소自身** 객체의 `:@` 속성 맵을 보장.
 */
function attrNode(elem:any):any {
  if(!elem[ATTR_GROUP]) elem[ATTR_GROUP] = {};
  return elem[ATTR_GROUP];
}

function getOrCreatePath(base:any, path:string[]):any{
  let cur=base;
  for(const tg of path){
    let arr = content(cur,tg);
    if(!arr.length) arr.push({});
    cur = arr[0];
  }
  return cur;
}

/* ---------- mc:Ignorable / 네임스페이스 보장 ---------- */
function ensureNamespaceOnDocument(docObj:any){
  const arr = content(docObj,'w:document');
  if(!arr.length) arr.push({});
  const attrs = attrNode(arr[0]);
  if(!attrs[`xmlns:${CUST_PREFIX}`]) attrs[`xmlns:${CUST_PREFIX}`] = CUST_NS_URI;
  const prev = attrs['mc:Ignorable'];
  if(!prev)      attrs['mc:Ignorable'] = IGNORABLE_VAL;
  else if(!prev.split(/\s+/).includes(IGNORABLE_VAL)) attrs['mc:Ignorable'] = prev+` ${IGNORABLE_VAL}`;
}

/* ---------- 화이트리스트 속성 shortId 주입 ---------- */
function ensureWhitelistIds(propsObj:any, whitelist:string[]){
  if(!propsObj || typeof propsObj!=='object') return;
  for(const key of Object.keys(propsObj)){
    if(!whitelist.includes(key)) continue;
    const propArr = propsObj[key];
    if(Array.isArray(propArr) && propArr.length){
      const at = attrNode(propArr[0]);
      if(!at[`${CUST_PREFIX}:id`]){
        const newId = genId();
        at[`${CUST_PREFIX}:id`] = newId;
        console.debug(`    + whitelist ${key} ⇒ ${newId}`);
      }
    }
  }
}

/* ---------- ID 주입 ---------- */
function injectId(tagObj:any, blockType:keyof typeof ID_TARGET_MAP, id:string){
  const map = ID_TARGET_MAP[blockType];
  const target = getOrCreatePath(tagObj, map.path);
  const at = attrNode(target);
  if(at[map.attr]) console.debug(`  ↻ 덮어쓰기 ${map.attr}=${at[map.attr]} → ${id}`);
  at[map.attr] = id;
  console.debug(`  ↻ ${map.attr}=${id}`);
}

/* ---------- 파서 ---------- */
function parseParagraph(pObj:any,parent?:string){
  if(tagOf(pObj)!=='w:p')return null;
  orderCnt++;
  const id=genId();
  injectId(pObj,'paragraph',id);
  const pPr     = pObj['w:p']?.[0]?.['w:pPr']?.[0];
  const pPrAttr = pPr?.[':@'] ?? {};
  console.debug('[w:pPr attr] ', pPrAttr); 
  /* 화이트리스트 속성 처리 */
  const pChildren = content(pObj,'w:p');
  for(const child of kids(pChildren)){
    const tg = tagOf(child);
    if(tg==='w:pPr'){
      const inner = child['w:pPr']?.[0] || {};
      ensureWhitelistIds(inner, WHITELISTED_PARA_PROPS);
    }
    else if(tg==='w:r'){
      const rArr = child['w:r'];
      if(Array.isArray(rArr)){
        for(const runChild of rArr){
          if(runChild['w:rPr']){
            const rInner = runChild['w:rPr'][0] || {};
            ensureWhitelistIds(rInner, WHITELISTED_RUN_PROPS);
          }
        }
      }
    }
  }

  const para:ParagraphJson={type:'paragraph',order:orderCnt,parentId:parent,properties:{}};
  return {[id]:para};
}

function parseTable(tblObj:any,parent?:string){
  if(tagOf(tblObj)!=='w:tbl')return null;
  orderCnt++;
  const id=genId();
  injectId(tblObj,'table',id);
  const tbl:TableJson={type:'table',order:orderCnt,parentId:parent};
  return {[id]:tbl};
}

/* ---------- 메인 ---------- */
export function convertOoxmlToJson(xml:string):DocumentJson{
  console.debug('=== OOXML → JSON (cust:id + whitelist) ===');
  const parser=new XMLParser({preserveOrder:true,ignoreAttributes:false,attributesGroupName:ATTR_GROUP,attributeNamePrefix:ATTR_PREFIX});
  const tree:any[]=parser.parse(xml);

  const doc=tree.find(e=>tagOf(e)==='w:document'); if(!doc) throw new Error('w:document not found');
  ensureNamespaceOnDocument(doc);

  const body=content(doc,'w:document').find(e=>tagOf(e)==='w:body'); if(!body) throw new Error('w:body not found');

  orderCnt=0; const json:DocumentJson={};
  for(const child of kids(content(body,'w:body'))){
    const tg=tagOf(child);
    if(tg==='w:p')  Object.assign(json, parseParagraph(child));
    else if(tg==='w:tbl') Object.assign(json, parseTable(child));
  }

  console.debug(`=== 완료 (${Object.keys(json).length} blocks, ${orderCnt} ids) ===`);

  try{
    const builder=new XMLBuilder({preserveOrder:true,ignoreAttributes:false,attributesGroupName:ATTR_GROUP,attributeNamePrefix:ATTR_PREFIX,format:true,indentBy:'  '});
    console.debug('\n— XML preview —\n'+builder.build(tree).slice(0,1600)+'\n…');
  }catch(e){ console.warn('XML 직렬화 실패',e);}  

  return json;
}

/* ---------- Flat-OPC helper (변경 없음) ---------- */
export const pickDocumentPart=(flat:string)=>{
  if(flat.indexOf('<pkg:package')===-1) return flat.trim();
  const part=flat.match(/<pkg:part[^>]*pkg:name="\/word\/document\.xml"[\s\S]*?<\/pkg:part>/i)?.[0];
  if(!part) throw new Error('document.xml part not found');
  const xml=part.match(/<pkg:xmlData[^>]*>([\s\S]*?)<\/pkg:xmlData>/i)?.[1];
  if(!xml) throw new Error('pkg:xmlData section missing');
  return xml.trim();
};