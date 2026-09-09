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
  '-f','lavfi','-i',`sine=frequency=46:duration=${d}`,
  '-f','lavfi','-i',`sine=frequency=69:duration=${d}`,
  '-f','lavfi','-i',`anoisesrc=color=brown:duration=${d}:amplitude=0.012`,
  '-filter_complex',
  `[0:a]volume=0.008,lowpass=f=165[a0];`+
  `[1:a]volume=0.0032,lowpass=f=220[a1];`+
  `[2:a]lowpass=f=520,highpass=f=42,volume=0.30[a2];`+
  `[a0][a1][a2]amix=inputs=3,afade=t=in:st=0:d=5,afade=t=out:st=${fadeOut}:d=8,`+
  `acompressor=threshold=-25dB:ratio=2.0:attack=35:release=450`,
  '-c:a','aac','-b:a','128k','-ar','48000',target
]);
console.log(`BGM ready: ${d}s (narration + BGM only; no SFX)`);
