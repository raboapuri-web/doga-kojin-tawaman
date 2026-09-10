import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sync=JSON.parse(fs.readFileSync(path.join(root,'src/sync-timing.json'),'utf8'));
const out=path.join(root,'public/audio');fs.mkdirSync(out,{recursive:true});
const d=Math.ceil(sync.durationSeconds+3);const fadeOut=Math.max(0,d-10);
execFileSync('ffmpeg',['-y','-loglevel','error',
 '-f','lavfi','-i',`sine=frequency=41:duration=${d}`,
 '-f','lavfi','-i',`sine=frequency=61:duration=${d}`,
 '-f','lavfi','-i',`sine=frequency=123:duration=${d}`,
 '-f','lavfi','-i',`anoisesrc=color=brown:duration=${d}:amplitude=0.012`,
 '-filter_complex',`[0:a]volume=0.006,lowpass=f=130[a0];[1:a]volume=0.003,lowpass=f=190[a1];[2:a]volume=0.0015,lowpass=f=260[a2];[3:a]lowpass=f=520,highpass=f=35,volume=0.21[a3];[a0][a1][a2][a3]amix=inputs=4,afade=t=in:st=0:d=6,afade=t=out:st=${fadeOut}:d=10,acompressor=threshold=-27dB:ratio=1.8:attack=40:release=500`,
 '-c:a','aac','-b:a','128k','-ar','48000',path.join(out,'bgm.m4a')]);
console.log(`BGM ready: ${d}s`);
