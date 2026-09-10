import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sync=JSON.parse(fs.readFileSync(path.join(root,'src/sync-timing.json'),'utf8'));
const out=path.join(root,'public/audio');fs.mkdirSync(out,{recursive:true});
const d=Math.ceil(sync.durationSeconds+4);const fadeOut=Math.max(0,d-12);
execFileSync('ffmpeg',['-y','-loglevel','error',
 '-f','lavfi','-i',`sine=frequency=41:duration=${d}`,
 '-f','lavfi','-i',`sine=frequency=62:duration=${d}`,
 '-f','lavfi','-i',`sine=frequency=123:duration=${d}`,
 '-f','lavfi','-i',`sine=frequency=246:duration=${d}`,
 '-f','lavfi','-i',`anoisesrc=color=brown:duration=${d}:amplitude=0.010`,
 '-filter_complex',`[0:a]volume=0.0055,lowpass=f=120[a0];[1:a]volume=0.0035,lowpass=f=180,tremolo=f=0.06:d=0.25[a1];[2:a]volume=0.0015,lowpass=f=300,tremolo=f=0.11:d=0.35[a2];[3:a]volume=0.0007,highpass=f=180,lowpass=f=700,tremolo=f=0.045:d=0.65[a3];[4:a]lowpass=f=580,highpass=f=30,volume=0.18[a4];[a0][a1][a2][a3][a4]amix=inputs=5,afade=t=in:st=0:d=7,afade=t=out:st=${fadeOut}:d=12,acompressor=threshold=-28dB:ratio=1.7:attack=50:release=600`,
 '-c:a','aac','-b:a','144k','-ar','48000',path.join(out,'bgm.m4a')]);
console.log(`V24 ambient score ready: ${d}s`);
