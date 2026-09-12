import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const beats=JSON.parse(fs.readFileSync(path.join(root,'src/beats.json'),'utf8'));
const audioDir=path.join(root,'public/audio');
const tmp=path.join(root,'.voice-tmp');
fs.mkdirSync(audioDir,{recursive:true});fs.mkdirSync(tmp,{recursive:true});
const base='http://127.0.0.1:50021';
const speakers=await fetch(`${base}/speakers`).then(r=>r.json());
const speaker=speakers.find(s=>s.name==='青山龍星')??speakers[0];
const style=speaker.styles.find(s=>s.name==='ノーマル')??speaker.styles[0];
console.log(`VOICEVOX ${speaker.name}/${style.name}/${style.id}`);

const normalize=(s)=>s
 .replaceAll('LINE','ライン').replaceAll('Netflix','ネットフリックス').replaceAll('IT企業','アイティー企業')
 .replaceAll('1K','ワンケー').replaceAll('A判定','エー判定')
 .replaceAll('法政大学','ほうせいだいがく').replaceAll('上智','じょうち').replaceAll('慶應','けいおう').replaceAll('早稲田','わせだ')
 .replaceAll('新潟','にいがた').replaceAll('信用金庫','しんようきんこ').replaceAll('練馬','ねりま')
 .replaceAll('上野','うえの').replaceAll('広小路口','ひろこうじぐち').replaceAll('アメ横','あめよこ')
 .replaceAll('表参道','おもてさんどう').replaceAll('青山','あおやま').replaceAll('恵比寿','えびす').replaceAll('六本木','ろっぽんぎ')
 .replaceAll('代々木公園','よよぎこうえん').replaceAll('神保町','じんぼうちょう')
 .replaceAll('丸の内','まるのうち').replaceAll('日比谷','ひびや').replaceAll('ペニンシュラ','ぺにんしゅら')
 .replaceAll('中目黒','なかめぐろ').replaceAll('目黒川','めぐろがわ').replaceAll('東横線','とうよこせん').replaceAll('日比谷線','ひびやせん')
 .replaceAll('日東駒専','にっとうこません').replaceAll('大井町','おおいまち').replaceAll('阪急','はんきゅう')
 .replaceAll('白金高輪','しろかねたかなわ').replaceAll('横浜','よこはま').replaceAll('虎ノ門ヒルズ','とらのもんヒルズ').replaceAll('虎ノ門','とらのもん')
 .replaceAll('ニューバランス','にゅーばらんす').replaceAll('イトーヨーカドー','いとーよーかどー');

const files=[];const timings=[];let cursor=0;
for(let i=0;i<beats.length;i++){
  const beat=beats[i];const text=normalize(beat.narration);
  const qRes=await fetch(`${base}/audio_query?speaker=${style.id}&text=${encodeURIComponent(text)}`,{method:'POST'});
  if(!qRes.ok)throw new Error(`audio_query ${qRes.status} ${beat.id}`);
  const q=await qRes.json();q.speedScale=1.03;q.pitchScale=-0.015;q.intonationScale=.86;q.volumeScale=.97;q.prePhonemeLength=.05;q.postPhonemeLength=.08;
  const sRes=await fetch(`${base}/synthesis?speaker=${style.id}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(q)});
  if(!sRes.ok)throw new Error(`synthesis ${sRes.status} ${beat.id}`);
  const raw=path.join(tmp,`${beat.id}.wav`);fs.writeFileSync(raw,Buffer.from(await sRes.arrayBuffer()));
  const pad=path.join(tmp,`${beat.id}-pad.wav`);
  execFileSync('ffmpeg',['-y','-loglevel','error','-i',raw,'-af','apad=pad_dur=0.12',pad]);
  const d=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',pad],{encoding:'utf8'}).trim());
  timings.push({id:beat.id,index:i,start:cursor,end:cursor+d});cursor+=d;files.push(pad);
  console.log(`${beat.id} ${beat.scene} ${d.toFixed(2)}s`);
}
const list=path.join(tmp,'concat.txt');fs.writeFileSync(list,files.map(f=>`file '${f.replaceAll("'","'\\''")}'`).join('\n'));
const wav=path.join(tmp,'narration.wav');execFileSync('ffmpeg',['-y','-loglevel','error','-f','concat','-safe','0','-i',list,'-c','copy',wav]);
const measured=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',wav],{encoding:'utf8'}).trim());
fs.writeFileSync(path.join(root,'src/sync-timing.json'),JSON.stringify({durationSeconds:measured+.3,beats:timings},null,2));
execFileSync('ffmpeg',['-y','-loglevel','error','-i',wav,'-c:a','aac','-b:a','160k','-ar','48000',path.join(audioDir,'narration.m4a')]);
console.log(`Narration ${measured.toFixed(2)} sec, ${beats.length} beats`);
