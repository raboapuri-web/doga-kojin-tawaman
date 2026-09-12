import sync from './sync-timing.json';
import beats from './beats.json';

type T={id:string;index:number;start:number;end:number};
type Sync={durationSeconds:number;beats:T[]};
const measured=sync as Sync;
const fallback:Sync={durationSeconds:Math.max(1,(beats as any[]).length*8.2),beats:(beats as any[]).map((b:any,index:number)=>({id:b.id,index,start:index*8.2,end:(index+1)*8.2}))};
export const syncTiming:Sync=measured.beats.length===(beats as any[]).length?measured:fallback;
export const getActiveBeat=(seconds:number)=>{
  const arr=syncTiming.beats;
  const b=arr.find(x=>seconds>=x.start&&seconds<x.end)??arr[arr.length-1]??{id:'b001',index:0,start:0,end:8};
  const d=Math.max(.001,b.end-b.start);
  return {...b,progress:Math.max(0,Math.min(1,(seconds-b.start)/d))};
};
export const getDuration=()=>syncTiming.durationSeconds;
