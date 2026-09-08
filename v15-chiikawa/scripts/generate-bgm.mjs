import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sync=JSON.parse(fs.readFileSync(path.join(root,'src/sync-timing.json'),'utf8'));
const out=path.join(root,'public/audio');
fs.mkdirSync(out,{recursive:true});
const d=Math.ceil(sync.durationSeconds+2);
const fadeOut=Math.max(0,d-8);
const target=path.join(out,'bgm.m4a');

execFileSync('ffmpeg',[
  '-y','-loglevel','error',
  '-f','lavfi','-i',`sine=frequency=52:duration=${d}`,
  '-f','lavfi','-i',`sine=frequency=78:duration=${d}`,
  '-f','lavfi','-i',`anoisesrc=color=brown:duration=${d}:amplitude=0.014`,
  '-filter_complex',
  `[0:a]volume=0.009,lowpass=f=180[a0];`+
  `[1:a]volume=0.0035,lowpass=f=250[a1];`+
  `[2:a]lowpass=f=560,highpass=f=45,volume=0.34[a2];`+
  `[a0][a1][a2]amix=inputs=3,afade=t=in:st=0:d=4,afade=t=out:st=${fadeOut}:d=8,`+
  `acompressor=threshold=-24dB:ratio=2.2:attack=30:release=400`,
  '-c:a','aac','-b:a','128k','-ar','48000',target
]);
console.log(`BGM ready: ${d}s (narration + BGM only; no SFX)`);
