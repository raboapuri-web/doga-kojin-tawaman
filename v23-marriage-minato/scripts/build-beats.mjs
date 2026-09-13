import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const text=fs.readFileSync(path.join(root,'script.txt'),'utf8').trim();
const paragraphs=text.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);

let phase='baba_room';
const phaseFor=(p)=>{
  if(p.startsWith('それでも、東京にいる')) phase='tokyo_wonder';
  if(p.startsWith('麻布十番なんて')) phase='tokyo_icons';
  if(p.startsWith('東京に来て四年目')) phase='first_job';
  if(p.startsWith('別の同期は')) phase='young_wedding';
  if(p.startsWith('二十七歳で転職した')) phase='ebisu_move';
  if(p.startsWith('その頃から')) phase='negative_reflex';
  if(p.startsWith('東京に長く住むと')) phase='city_roast';
  if(p.startsWith('三十歳になった')) phase='roppongi_work';
  if(p.startsWith('三十二歳のとき')) phase='toyosu_visit';
  if(p.startsWith('「すげえな」')) phase='toyosu_deflect';
  if(p.startsWith('友達は笑った')) phase='seen_through';
  if(p.startsWith('帰りの有楽町線で')) phase='price_search';
  if(p.startsWith('三十四歳で')) phase='meguro_home';
  if(p.startsWith('ある日、')) phase='hometown_house';
  if(p.startsWith('三十五歳の春')) phase='friends_dinner';
  if(p.startsWith('帰り道、')) phase='shinjuku_night';
  if(p.startsWith('その夜、')) phase='instagram_scroll';
  if(p.startsWith('部屋は静かだった')) phase='quiet_meguro';
  if(p.startsWith('東京で十年暮らした')) phase='realization';
  if(p.startsWith('大学一年の頃')) phase='nakame_memory';
  if(p.startsWith('この前、')) phase='ebisu_students';
  if(p.startsWith('少し歩いてから振り返った')) phase='final_lookback';
  return phase;
};

const raw=paragraphs.map((p,i)=>({p,phase:phaseFor(p),i}));
const grouped=[];
let cur=null;
for(const item of raw){
  const isDialogue=/^「/.test(item.p);
  const max=isDialogue?78:128;
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
