import React from 'react';
import {AbsoluteFill,Composition,interpolate,registerRoot,useCurrentFrame,useVideoConfig} from 'remotion';
import scriptRaw from './script-data.json';
import timingRaw from './sync-timing.json';
import {SceneArt} from './scenes';

type Beat={id:string;visual:string;chapter:string;subtitle:string};
type TimingBeat={id:string;index:number;start:number;end:number};
const script=scriptRaw as {title:string;beats:Beat[]};
const timing=timingRaw as {durationSeconds:number;beats:TimingBeat[]};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));

const splitSubtitle=(text:string)=>{
  const sentences=text.match(/[^。！？!?]+[。！？!?]?/g)??[text];
  const out:string[]=[];let buf='';
  for(const raw of sentences){const s=raw.trim();if(!s)continue;
    if((buf+s).length<=31)buf+=s;
    else{if(buf)out.push(buf);if(s.length<=34)buf=s;else{for(let i=0;i<s.length;i+=31)out.push(s.slice(i,i+31));buf='';}}
  }
  if(buf)out.push(buf);return out.length?out:[text];
};

const Subtitle=({beat,p}:{beat:Beat;p:number})=>{
  const chunks=splitSubtitle(beat.subtitle);
  const i=Math.min(chunks.length-1,Math.floor(clamp(p*.9999)*chunks.length));
  const local=clamp(p*chunks.length-i);
  const opacity=interpolate(local,[0,.08,.92,1],[0,1,1,.05],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <>
    <div style={{position:'absolute',left:70,top:54,color:'rgba(232,226,215,.58)',fontFamily:'Noto Sans CJK JP, sans-serif',fontSize:20,fontWeight:700,letterSpacing:3}}>{beat.chapter} / {beat.id}</div>
    <div style={{position:'absolute',left:140,right:140,bottom:58,display:'flex',justifyContent:'center',pointerEvents:'none'}}>
      <div style={{maxWidth:1540,padding:'16px 34px 19px',borderRadius:12,background:'rgba(3,6,5,.67)',backdropFilter:'blur(8px)',color:'#f1ece2',fontFamily:'Noto Sans CJK JP, sans-serif',fontSize:40,fontWeight:800,lineHeight:1.48,textAlign:'center',letterSpacing:.5,textShadow:'0 3px 18px #000',opacity}}>{chunks[i]}</div>
    </div>
  </>;
};

const Film=()=>{
  const frame=useCurrentFrame();const {fps}=useVideoConfig();const t=frame/fps;
  const ts=timing.beats.length?timing.beats:script.beats.map((b,i)=>({id:b.id,index:i,start:i*12,end:(i+1)*12}));
  let ti=ts.findIndex(b=>t>=b.start&&t<b.end);if(ti<0)ti=t>=ts[ts.length-1].end?ts.length-1:0;
  const tb=ts[ti];const beat=script.beats[tb.index]??script.beats[ti]??script.beats[0];
  const p=clamp((t-tb.start)/Math.max(.001,tb.end-tb.start));
  const enter=clamp(p/.055),exit=clamp((1-p)/.045),opacity=Math.min(enter,exit);
  return <AbsoluteFill style={{background:'#050807',overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,opacity}}><SceneArt visual={beat.visual} p={p}/></div>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 46%,transparent 35%,rgba(0,0,0,.18) 70%,rgba(0,0,0,.72) 100%)',pointerEvents:'none'}}/>
    <Subtitle beat={beat} p={p}/>
  </AbsoluteFill>;
};

const Root=()=> <Composition id="V21DoomFreedom" component={Film} width={1920} height={1080} fps={30} durationInFrames={Math.max(1,Math.ceil(timing.durationSeconds*30))}/>;
registerRoot(Root);
