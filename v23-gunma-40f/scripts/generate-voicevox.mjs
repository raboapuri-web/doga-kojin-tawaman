import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const source=fs.readFileSync(path.join(root,'src/story.ts'),'utf8');
const body=source.match(/export const shots:StoryShot\[]=\[(.*)\];/s)?.[1];
if(!body) throw new Error('Could not parse story shots');
const rows=[...body.matchAll(/\{id:'([^']+)',visual:'([^']+)',tone:'([^']+)',narration:'((?:\\'|[^'])*)'(?:,emphasis:'((?:\\'|[^'])*)')?\}/g)].map((m,i)=>({id:m[1],index:i,narration:m[4].replaceAll("\\'","'")}));
if(rows.length<60) throw new Error(`Expected 60+ shots, parsed ${rows.length}`);

const audioDir=path.join(root,'public/audio');
const tmp=path.join(root,'.voice-tmp');
fs.mkdirSync(audioDir,{recursive:true});fs.mkdirSync(tmp,{recursive:true});
const base='http://127.0.0.1:50021';
const speakers=await fetch(`${base}/speakers`).then(r=>r.json());
const speaker=speakers.find(s=>s.name==='青山龍星')??speakers[0];
const style=speaker.styles.find(s=>s.name==='ノーマル')??speaker.styles[0];
console.log(`VOICEVOX: ${speaker.name} / ${style.name} / ${style.id}`);

const files=[];const timings=[];let cursor=0;
for(const row of rows){
  const q=await fetch(`${base}/audio_query?speaker=${style.id}&text=${encodeURIComponent(row.narration)}`,{method:'POST'}).then(r=>r.json());
  q.speedScale=1.08;q.pitchScale=-0.026;q.intonationScale=0.84;q.volumeScale=0.98;q.prePhonemeLength=0.08;q.postPhonemeLength=0.10;
  const wav=Buffer.from(await fetch(`${base}/synthesis?speaker=${style.id}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(q)}).then(r=>r.arrayBuffer()));
  const raw=path.join(tmp,`${row.id}.wav`);const padded=path.join(tmp,`${row.id}-pad.wav`);
  fs.writeFileSync(raw,wav);
  execFileSync('ffmpeg',['-y','-loglevel','error','-i',raw,'-af','apad=pad_dur=0.14',padded]);
  const duration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',padded],{encoding:'utf8'}).trim());
  timings.push({id:row.id,index:row.index,start:cursor,end:cursor+duration});cursor+=duration;files.push(padded);
  console.log(`${row.id}: ${duration.toFixed(2)}s / total ${cursor.toFixed(2)}s`);
}
const list=path.join(tmp,'concat.txt');
fs.writeFileSync(list,files.map(f=>`file '${f.replaceAll("'","'\\''")}'`).join('\n'));
const narrationWav=path.join(tmp,'narration.wav');
execFileSync('ffmpeg',['-y','-loglevel','error','-f','concat','-safe','0','-i',list,'-c','copy',narrationWav]);
const measured=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',narrationWav],{encoding:'utf8'}).trim());
fs.writeFileSync(path.join(root,'src/sync-timing.json'),JSON.stringify({durationSeconds:measured+0.25,beats:timings},null,2));
execFileSync('ffmpeg',['-y','-loglevel','error','-i',narrationWav,'-c:a','aac','-b:a','176k','-ar','48000',path.join(audioDir,'narration.m4a')]);
console.log(`Narration duration: ${measured.toFixed(2)}s across ${timings.length} shots`);
