import sync from './sync-timing.json';

type BeatTiming={id:string;index:number;start:number;end:number};
export const syncTiming=sync as {durationSeconds:number;beats:BeatTiming[]};
export const getActiveShotAtSeconds=(seconds:number)=>{
  const beats=syncTiming.beats;
  const beat=beats.find((b)=>seconds>=b.start&&seconds<b.end)??beats[beats.length-1];
  const duration=Math.max(.001,beat.end-beat.start);
  const progress=Math.max(0,Math.min(1,(seconds-beat.start)/duration));
  return {index:beat.index,id:beat.id,progress,start:beat.start,end:beat.end,duration};
};
export const getRenderDurationSeconds=()=>syncTiming.durationSeconds;
