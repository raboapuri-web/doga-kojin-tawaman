import React from 'react';
import {AbsoluteFill,Composition,interpolate,registerRoot,useCurrentFrame,useVideoConfig} from 'remotion';
import scriptRaw from './script-data.json';
import timingRaw from './sync-timing.json';
import {SceneArt} from './scenes';

type Beat={id:string;visual:string;chapter:string;subtitle:string};
type TimingBeat={id:string;index:number;start:number;end:number};
const script=scriptRaw as {title:string;beats:Beat[]};
const timing=timingRaw as {durationSeconds:number;beats:TimingBeat[]};
const C={paper:'#f1ede3',muted:'#a9b0bd',accent:'#e3b45c'};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));

const splitSubtitle=(text:string)=>{
  const raw=text.match(/[^。！？!?]+[。！？!?]?/g)??[text];
  const chunks:string[]=[];let buf='';
  for(const s0 of raw){const s=s0.trim();if(!s)continue;if((buf+s).length<=34){buf+=s;}else{if(buf)chunks.push(buf);if(s.length<=38)buf=s;else{for(let i=0;i<s.length;i+=34)chunks.push(s.slice(i,i+34));buf='';}}}
  if(buf)chunks.push(buf);return chunks.length?chunks:[text];
};

const Subtitle=({beat,p}:{beat:Beat;p:number})=>{
  const chunks=splitSubtitle(beat.subtitle);
  const idx=Math.min(chunks.length-1,Math.floor(clamp(p*.9999)*chunks.length));
  const local=clamp(p*chunks.length-idx);
  const opacity=interpolate(local,[0,.08,.9,1],[0,1,1,.1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <>
    <div style={{position:'absolute',left:72,top:55,padding:'9px 18px',border:'1px solid rgba(241,237,227,.25)',borderRadius:999,background:'rgba(9,11,16,.62)',color:C.muted,fontFamily:'Noto Sans CJK JP, sans-serif',fontSize:22,fontWeight:700,letterSpacing:2}}>{beat.chapter}　/　{beat.id}</div>
    <div style={{position:'absolute',left:110,right:110,bottom:68,minHeight:126,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px 46px',borderTop:'1px solid rgba(241,237,227,.22)',borderBottom:'1px solid rgba(241,237,227,.10)',background:'linear-gradient(90deg,rgba(5,7,10,.1),rgba(5,7,10,.82) 12%,rgba(5,7,10,.82) 88%,rgba(5,7,10,.1))',color:C.paper,fontFamily:'Noto Sans CJK JP, sans-serif',fontSize:42,fontWeight:800,lineHeight:1.55,textAlign:'center',letterSpacing:.6,textShadow:'0 3px 18px #000',opacity}}>{chunks[idx]}</div>
  </>;
};

const ProgressRail=({index,p}:{index:number;p:number})=><div style={{position:'absolute',left:0,right:0,bottom:0,height:5,background:'rgba(255,255,255,.08)'}}><div style={{height:'100%',width:`${((index+p)/script.beats.length)*100}%`,background:C.accent,opacity:.72}}/></div>;

const Film=()=>{
  const frame=useCurrentFrame();const {fps}=useVideoConfig();const t=frame/fps;
  const ts=timing.beats.length?timing.beats:script.beats.map((b,i)=>({id:b.id,index:i,start:i*18,end:(i+1)*18}));
  let ti=ts.findIndex(b=>t>=b.start&&t<b.end);if(ti<0)ti=t>=ts[ts.length-1].end?ts.length-1:0;
  const tb=ts[ti];const beat=script.beats[tb.index]??script.beats[ti]??script.beats[0];
  const p=clamp((t-tb.start)/Math.max(.001,tb.end-tb.start));
  const entry=clamp(p/.07);const exit=clamp((1-p)/.06);const sceneOpacity=Math.min(entry,exit);
  return <AbsoluteFill style={{background:'#090b10',overflow:'hidden',fontFamily:'Noto Sans CJK JP, sans-serif'}}>
    <div style={{position:'absolute',inset:0,opacity:sceneOpacity}}><SceneArt visual={beat.visual} p={p}/></div>
    <div style={{position:'absolute',inset:0,boxShadow:'inset 0 0 160px rgba(0,0,0,.62)',pointerEvents:'none'}}/>
    <Subtitle beat={beat} p={p}/><ProgressRail index={tb.index} p={p}/>
  </AbsoluteFill>;
};

const Root=()=> <Composition id="V19ChildLuxury" component={Film} width={1920} height={1080} fps={30} durationInFrames={Math.max(1,Math.ceil(timing.durationSeconds*30))}/>;
registerRoot(Root);
