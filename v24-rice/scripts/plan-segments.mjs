import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sync=JSON.parse(fs.readFileSync(path.join(root,'src/sync-timing.json'),'utf8'));
const fps=30;
const maxWorkers=8;
const targetSeconds=Math.max(70,Math.ceil(sync.durationSeconds/maxWorkers));
const maxSeconds=Math.ceil(targetSeconds*1.28);
const segments=[];
let startFrame=0,segmentStartSec=0,lastEndFrame=-1;
const finalFrame=Math.ceil(sync.durationSeconds*fps)-1;
for(let i=0;i<sync.beats.length;i++){
  const beat=sync.beats[i];
  const elapsed=beat.end-segmentStartSec;
  const isLast=i===sync.beats.length-1;
  const nextWouldBeTooLong=!isLast&&(sync.beats[i+1].end-segmentStartSec)>maxSeconds;
  const remainingBeats=sync.beats.length-i-1;
  const remainingSlots=maxWorkers-segments.length-1;
  const shouldSplit=(elapsed>=targetSeconds||nextWouldBeTooLong)&&remainingSlots>0&&remainingBeats>0;
  if(isLast||shouldSplit){
    const endFrame=isLast?finalFrame:Math.max(startFrame,Math.round(beat.end*fps)-1);
    segments.push({id:String(segments.length).padStart(2,'0'),start:startFrame,end:endFrame});
    lastEndFrame=endFrame;
    startFrame=endFrame+1;
    segmentStartSec=(endFrame+1)/fps;
  }
}
if(lastEndFrame<finalFrame) segments.push({id:String(segments.length).padStart(2,'0'),start:lastEndFrame+1,end:finalFrame});
console.error(`Adaptive parallel plan: ${sync.durationSeconds.toFixed(2)}s / target ${targetSeconds}s / ${segments.length} segment(s)`);
console.log(JSON.stringify({include:segments}));
