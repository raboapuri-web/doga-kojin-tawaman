import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sync=JSON.parse(fs.readFileSync(path.join(root,'src/sync-timing.json'),'utf8'));
const fps=30;
const targetSeconds=150;
const maxSeconds=190;
const previewSeconds=Number(process.env.PREVIEW_SECONDS||0);
const durationSeconds=previewSeconds>0?Math.min(previewSeconds,sync.durationSeconds):sync.durationSeconds;
const beats=sync.beats.filter((beat)=>beat.start<durationSeconds);
const segments=[];
let startFrame=0,segmentStartSec=0,lastEndFrame=-1;
const finalFrame=Math.ceil(durationSeconds*fps)-1;

for(let i=0;i<beats.length;i++){
  const beat=beats[i];
  const beatEnd=Math.min(beat.end,durationSeconds);
  const elapsed=beatEnd-segmentStartSec;
  const isLast=i===beats.length-1||beat.end>=durationSeconds;
  const nextWouldBeTooLong=!isLast&&(Math.min(beats[i+1].end,durationSeconds)-segmentStartSec)>maxSeconds;
  if(isLast||elapsed>=targetSeconds||nextWouldBeTooLong){
    const endFrame=isLast?finalFrame:Math.max(startFrame,Math.round(beatEnd*fps)-1);
    segments.push({id:String(segments.length).padStart(2,'0'),start:startFrame,end:endFrame});
    lastEndFrame=endFrame;
    startFrame=endFrame+1;
    segmentStartSec=(endFrame+1)/fps;
  }
}

if(lastEndFrame<finalFrame){
  segments.push({id:String(segments.length).padStart(2,'0'),start:lastEndFrame+1,end:finalFrame});
}

console.error(`Render plan: ${durationSeconds.toFixed(2)}s / ${segments.length} segment(s)`);
console.log(JSON.stringify({include:segments}));
