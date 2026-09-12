import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const text=fs.readFileSync(path.join(root,'script.txt'),'utf8').trim();
const paragraphs=text.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);

let phase='ueno_yakitori';
const phaseFor=(p)=>{
  if(p.startsWith('僕は三十三歳だった。')) phase='ordinary_profile';
  if(p.startsWith('彼女とは大学時代からの友達だった。')) phase='niigata_origin';
  if(p.startsWith('十年以上経って、')) phase='tokyo_shift';
  if(p.startsWith('彼女の最初の彼氏は、')) phase='dating_history';
  if(p.startsWith('三十三歳になった彼女は婚活を始めた。')) phase='matching_app';
  if(p.startsWith('ある男は、地方銀行に勤めていた。')) phase='matching_app';
  if(p==='一度、') phase='nakameguro';
  if(p.startsWith('その日、')) phase='nakameguro';
  if(p.startsWith('僕はそこにいた。')) phase='invisible_narrator';
  if(p.startsWith('三十四歳の夏。')) phase='engagement_photo';
  if(p.startsWith('その夜、')) phase='oimachi_solo';
  if(p.startsWith('彼女の結婚式は、虎ノ門だった。')) phase='toranomon_wedding';
  if(p.startsWith('披露宴で新郎の上司が、')) phase='toranomon_wedding';
  if(p.startsWith('普通に働いている。')) phase='ordinary_shift';
  if(p.startsWith('披露宴が終わって、')) phase='oimachi_solo';
  if(p.startsWith('地下へ降りるエスカレーターで、')) phase='escalator';
  if(p.startsWith('嘘ではなかったのだと思う。')) phase='ordinary_shift';
  if(p.startsWith('東京は、')) phase='ordinary_shift';
  if(p.startsWith('僕の普通と、')) phase='ordinary_shift';
  if(p.startsWith('日比谷線に乗った。')) phase='final_tunnel';
  if(p.startsWith('普通の人と結婚したいと言った彼女の瞳に、')) phase='final_tunnel';
  return phase;
};

const raw=paragraphs.map((p,i)=>({p,phase:phaseFor(p),i}));
const grouped=[];
let cur=null;
for(const item of raw){
  const hardDialogue=/^「/.test(item.p);
  const max=hardDialogue?68:112;
  if(!cur || cur.phase!==item.phase || (cur.text.length+item.p.length+1)>max){
    cur={phase:item.phase,text:item.p,source:[item.i]};
    grouped.push(cur);
  }else{
    cur.text += ' '+item.p;
    cur.source.push(item.i);
  }
}

const beats=grouped.map((g,index)=>({
  id:`b${String(index+1).padStart(3,'0')}`,
  index,
  scene:g.phase,
  narration:g.text,
  sourceParagraphs:g.source
}));
fs.mkdirSync(path.join(root,'src'),{recursive:true});
fs.writeFileSync(path.join(root,'src/beats.json'),JSON.stringify(beats,null,2));
console.log(`Built ${beats.length} beats from ${paragraphs.length} paragraphs.`);
console.log([...new Set(beats.map(b=>b.scene))].join(', '));
