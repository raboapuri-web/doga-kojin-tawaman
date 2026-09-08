import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'public/audio');
fs.mkdirSync(out,{recursive:true});
const run=(args)=>execFileSync('ffmpeg',['-y','-loglevel','error',...args]);
run(['-f','lavfi','-i','sine=frequency=58:duration=300','-f','lavfi','-i','sine=frequency=87:duration=300','-f','lavfi','-i','anoisesrc=color=brown:duration=300:amplitude=0.018','-filter_complex','[0:a]volume=0.010[a0];[1:a]volume=0.006[a1];[2:a]lowpass=f=420,volume=0.7[a2];[a0][a1][a2]amix=inputs=3,afade=t=in:st=0:d=2,afade=t=out:st=294:d=6','-ar','48000',path.join(out,'bgm.wav')]);
const specs={
  room:'anoisesrc=color=brown:duration=0.55:amplitude=0.025',
  swipe:'anoisesrc=color=pink:duration=0.28:amplitude=0.10',
  sting:'sine=frequency=930:duration=0.22',
  whoosh:'anoisesrc=color=pink:duration=0.38:amplitude=0.12',
  bell:'sine=frequency=1180:duration=0.32',
  murmur:'anoisesrc=color=brown:duration=0.62:amplitude=0.055',
  gong:'sine=frequency=125:duration=0.78',
  crowd:'anoisesrc=color=pink:duration=0.70:amplitude=0.07',
  pulse:'sine=frequency=78:duration=0.32',
  boo:'sine=frequency=185:duration=0.48',
  cheer:'sine=frequency=690:duration=0.46',
  tick:'sine=frequency=1500:duration=0.08',
  cut:'sine=frequency=350:duration=0.16',
  impact:'sine=frequency=68:duration=0.30',
  riser:'sine=frequency=420:duration=0.52'
};
for(const [name,src] of Object.entries(specs)) run(['-f','lavfi','-i',src,'-af','volume=0.32','-ar','48000',path.join(out,`${name}.wav`)]);
console.log('V13 BGM/SFX ready');
