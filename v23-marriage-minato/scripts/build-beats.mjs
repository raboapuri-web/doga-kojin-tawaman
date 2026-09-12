import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const text=fs.readFileSync(path.join(root,'script.txt'),'utf8').trim();
const paragraphs=text.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);

let phase='yakitori';
const phaseFor=(p)=>{
  if(p.startsWith('僕は中野駅')) phase='nakano';
  if(p.startsWith('彼女の実家は世田谷')) phase='class_gap';
  if(p.startsWith('その焼き鳥屋で')) phase='marriage_talk';
  if(p.startsWith('付き合って一年くらい')) phase='weddings';
  if(p.startsWith('二十八歳の誕生日')) phase='daikanyama';
  if(p.startsWith('二十九歳になる頃')) phase='conflict';
  if(p.startsWith('最後の喧嘩は麻布十番')) phase='italian';
  if(p.startsWith('店を出ると、十番商店街')) phase='split_walk';
  if(p.startsWith('一ヶ月後に別れた')) phase='breakup';
  if(p.startsWith('翌年、彼女は三十歳')) phase='instagram_hotel';
  if(p.startsWith('その頃、僕には新しい彼女')) phase='saitama_family';
  if(p.startsWith('彼女と再会したのは')) phase='reunion_arrival';
  if(p.startsWith('仕事はまだ同じ会社')) phase='reunion_talk';
  if(p.startsWith('彼女は楽しそうだった')) phase='envy';
  if(p.startsWith('別れ際')) phase='goodbye';
  if(p.startsWith('僕は麻布十番駅へ向かった')) phase='train_route';
  if(p.startsWith('帰宅したのは')) phase='home_family';
  if(p.startsWith('風呂に入ったあと')) phase='phone_memory';
  if(p.startsWith('三十五歳の彼女には')) phase='life_compare';
  if(p.startsWith('僕たちはあの夜')) phase='split_paths';
  if(p.startsWith('娘が寝室で泣いた')) phase='final_home';
  return phase;
};

const raw=paragraphs.map((p,i)=>({p,phase:phaseFor(p),i}));
const grouped=[];
let cur=null;
for(const item of raw){
  const hardDialogue=/^「/.test(item.p);
  const max=hardDialogue?72:118;
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
