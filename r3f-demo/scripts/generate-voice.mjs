import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const scenes=[
  ['S01',4,'三十五歳になって、友達が減った。'],
  ['S02',5,'正確に言うと、減ったというより、会わなくなった。'],
  ['S03',6,'誰かと喧嘩したわけではない。絶交した相手もいない。'],
  ['S04',3,'LINEをブロックしたこともない。'],
  ['S05',6,'ただ、「今月ちょっと忙しくて」という言葉を、何度も使っているうちに、'],
  ['S06',5,'気づけば、一年くらい会っていない人が増えていた。'],
  ['S07',5,'先週も、大学時代のグループLINEにメッセージが来た。'],
  ['S08',6,'「久しぶりに四人で飲まない？」送ってきたのは佐々木だった。'],
  ['S09',6,'僕はその通知を、目黒の自宅のソファで見た。土曜日の午後十一時。'],
  ['S10',5,'テレビでは、見たいわけでもないYouTubeが流れていた。'],
  ['S11',4,'カレンダーを開く。来週の土曜日。何も入っていない。'],
  ['S12',5,'その次の土曜日も空いていた。それでも僕は、「今月ちょっとバタバタしてる」と打った。'],
];
const root=process.cwd();
const raw=path.join(root,'public/audio/raw');
const fit=path.join(root,'public/audio/fit');
fs.mkdirSync(raw,{recursive:true});fs.mkdirSync(fit,{recursive:true});
const ffprobe=(p)=>Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nk=1:nw=1',p],{encoding:'utf8'}).trim());
const atempo=(x)=>{const arr=[];let r=x;while(r>2){arr.push(2);r/=2;}while(r<.5){arr.push(.5);r/=.5;}arr.push(r);return arr.map(v=>`atempo=${v.toFixed(6)}`).join(',');};
for(const [id,sec,text] of scenes){
  const qRes=await fetch(`http://127.0.0.1:50021/audio_query?text=${encodeURIComponent(text)}&speaker=13`,{method:'POST'});
  if(!qRes.ok)throw new Error(`audio_query ${id}: ${qRes.status}`);
  const q=await qRes.json(); q.speedScale=1.04; q.pitchScale=-0.015; q.intonationScale=.92;
  const sRes=await fetch('http://127.0.0.1:50021/synthesis?speaker=13',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(q)});
  if(!sRes.ok)throw new Error(`synthesis ${id}: ${sRes.status}`);
  const buf=Buffer.from(await sRes.arrayBuffer()); const rp=path.join(raw,`${id}.wav`);fs.writeFileSync(rp,buf);
  const d=ffprobe(rp); const ratio=d/Number(sec); const fp=path.join(fit,`${id}.wav`);
  execFileSync('ffmpeg',['-y','-loglevel','error','-i',rp,'-filter:a',`${atempo(ratio)},apad=pad_dur=10,atrim=0:${sec}`,'-ar','48000','-ac','1',fp]);
}
const list=path.join(fit,'concat.txt');
fs.writeFileSync(list,scenes.map(([id])=>`file '${path.join(fit,`${id}.wav`).replaceAll("'","'\\''")}'`).join('\n'));
const joined=path.join(root,'public/audio/narration.wav');
execFileSync('ffmpeg',['-y','-loglevel','error','-f','concat','-safe','0','-i',list,'-t','60','-ar','48000','-ac','1',joined]);
execFileSync('ffmpeg',['-y','-loglevel','error','-i',joined,'-c:a','aac','-b:a','160k','-t','60',path.join(root,'public/audio/narration.m4a')]);
console.log('narration ready',ffprobe(path.join(root,'public/audio/narration.m4a')));
