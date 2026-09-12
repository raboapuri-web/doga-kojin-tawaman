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
 .replaceAll('Instagram','インスタグラム').replaceAll('LINE','ライン').replaceAll('Amazon','アマゾン')
 .replaceAll('T-SITE','ティーサイト').replaceAll('青学','あおがく').replaceAll('三菱商事','みつびししょうじ')
 .replaceAll('三LDK','さんえるでぃーけー').replaceAll('一LDK','いちえるでぃーけー')
 .replaceAll('浪花家','なにわや').replaceAll('豆源','まめげん').replaceAll('仙台坂','せんだいざか')
 .replaceAll('別所沼公園','べっしょぬまこうえん').replaceAll('武蔵浦和','むさしうらわ')
 .replaceAll('六本木ヒルズ','ろっぽんぎヒルズ').replaceAll('麻布十番','あざぶじゅうばん')
 .replaceAll('南北線','なんぼくせん').replaceAll('大江戸線','おおえどせん').replaceAll('埼京線','さいきょうせん')
 .replaceAll('Instagram','インスタグラム');

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
