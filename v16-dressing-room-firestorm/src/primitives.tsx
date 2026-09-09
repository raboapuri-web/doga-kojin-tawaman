import React from 'react';
import {AbsoluteFill,interpolate} from 'remotion';

export const C={night:'#0b1020',night2:'#17233a',ink:'#111827',paper:'#f3eadb',cream:'#fff1cf',white:'#fffdf7',wood:'#8f6748',wood2:'#5f4333',red:'#db4b4b',orange:'#e58c48',gold:'#d5ad55',blue:'#6d9fd0',cyan:'#77c3d9',green:'#6fa879',gray:'#8d97a6',light:'#dfe7ef',purple:'#806fa8',black:'#10141d',pink:'#d997a7'};
export const F='"Noto Sans CJK JP","Yu Gothic",sans-serif';
export const clamp=(v:number,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const ease=(p:number)=>{const q=clamp(p);return q*q*(3-2*q)};
export const lerp=(a:number,b:number,p:number)=>a+(b-a)*clamp(p);
export const wave=(p:number,f=1)=>Math.sin(p*Math.PI*2*f);
export const fade=(p:number)=>interpolate(p,[0,.025,.965,1],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});

export function Txt({x,y,size=48,color=C.ink,children,weight=800,opacity=1,align='left',width,rotate=0,z=20}:{x:number;y:number;size?:number;color?:string;children:React.ReactNode;weight?:number;opacity?:number;align?:'left'|'center'|'right';width?:number;rotate?:number;z?:number}){
  return <div style={{position:'absolute',left:x,top:y,width,fontFamily:F,fontSize:size,fontWeight:weight,lineHeight:1.35,color,opacity,textAlign:align,transform:`rotate(${rotate}deg)`,textShadow:color===C.white?'0 3px 16px rgba(0,0,0,.72)':'none',zIndex:z}}>{children}</div>;
}

export function Chapter({text}:{text:string}){return <div style={{position:'absolute',left:56,top:36,maxWidth:1260,fontFamily:F,fontSize:20,fontWeight:800,letterSpacing:1.6,color:'rgba(255,255,255,.76)',textShadow:'0 2px 10px rgba(0,0,0,.65)',zIndex:95}}>{text}</div>}
export function Shell({p,chapter,bg=C.paper,children}:{p:number;chapter:string;bg?:string;children:React.ReactNode}){return <AbsoluteFill style={{background:bg,overflow:'hidden',opacity:fade(p)}}>{children}<Chapter text={chapter}/></AbsoluteFill>}

export function Caption({text,p}:{text:string;p:number}){
  const sentences=(text.match(/[^。！？]+[。！？]?/g)??[text]).map(s=>s.trim()).filter(Boolean);
  const chunks:string[]=[];
  for(const s of sentences){if(!chunks.length||chunks[chunks.length-1].length+s.length>36)chunks.push(s);else chunks[chunks.length-1]+=s;}
  const idx=Math.min(chunks.length-1,Math.floor(clamp(p)*chunks.length));
  return <div style={{position:'absolute',left:110,right:110,bottom:28,minHeight:88,display:'flex',alignItems:'center',justifyContent:'center',padding:'8px 24px',fontFamily:F,fontSize:34,fontWeight:850,lineHeight:1.46,textAlign:'center',color:'#fff',textShadow:'0 4px 18px rgba(0,0,0,.98)',zIndex:120}}>{chunks[Math.max(0,idx)]??text}</div>
}

export function Person({x,y,s=1,shirt=C.blue,hair=C.black,walk=0,opacity=1,rot=0,phone=false}:{x:number;y:number;s?:number;shirt?:string;hair?:string;walk?:number;opacity?:number;rot?:number;phone?:boolean}){
  const leg=wave(walk,2)*11*s;
  return <div style={{position:'absolute',left:x,top:y,width:110*s,height:260*s,opacity,transform:`rotate(${rot}deg)`,transformOrigin:'50% 100%'}}>
    <div style={{position:'absolute',left:31*s,top:8*s,width:50*s,height:58*s,borderRadius:'48%',background:'#d0a07f'}}/>
    <div style={{position:'absolute',left:27*s,top:2*s,width:58*s,height:28*s,borderRadius:'55% 55% 35% 35%',background:hair}}/>
    <div style={{position:'absolute',left:18*s,top:64*s,width:76*s,height:112*s,borderRadius:'20px 20px 9px 9px',background:shirt}}/>
    <div style={{position:'absolute',left:20*s,top:169*s,width:26*s,height:82*s,borderRadius:13*s,background:'#293243',transform:`translateX(${leg}px)`}}/>
    <div style={{position:'absolute',right:20*s,top:169*s,width:26*s,height:82*s,borderRadius:13*s,background:'#293243',transform:`translateX(${-leg}px)`}}/>
    {phone&&<div style={{position:'absolute',left:84*s,top:100*s,width:25*s,height:45*s,borderRadius:5*s,background:'#161b25',border:`${2*s}px solid #78879b`,transform:'rotate(-12deg)'}}/>}
  </div>
}

export function Camera({x,y,s=1,recording=false,rot=0,opacity=1}:{x:number;y:number;s?:number;recording?:boolean;rot?:number;opacity?:number}){
 return <div style={{position:'absolute',left:x,top:y,width:180*s,height:115*s,opacity,transform:`rotate(${rot}deg)`}}>
   <div style={{position:'absolute',left:0,top:20*s,width:150*s,height:90*s,borderRadius:14*s,background:'#232936',boxShadow:'0 18px 38px rgba(0,0,0,.35)'}}/>
   <div style={{position:'absolute',left:52*s,top:32*s,width:68*s,height:68*s,borderRadius:'50%',background:'radial-gradient(circle,#8ac1d7 0 18%,#273b50 21% 53%,#0e1117 55%)',border:`${5*s}px solid #10141d`}}/>
   <div style={{position:'absolute',right:4*s,top:40*s,width:40*s,height:50*s,background:'#303849',clipPath:'polygon(0 12%,100% 0,100% 100%,0 88%)'}}/>
   {recording&&<div style={{position:'absolute',left:12*s,top:32*s,width:15*s,height:15*s,borderRadius:'50%',background:'#ff4c4c',boxShadow:'0 0 16px #ff3434'}}/>}
 </div>
}

export function Phone({x,y,s=1,screen='#111827',rot=0,children}:{x:number;y:number;s?:number;screen?:string;rot?:number;children?:React.ReactNode}){
 return <div style={{position:'absolute',left:x,top:y,width:250*s,height:490*s,borderRadius:34*s,background:'#171b24',padding:14*s,boxShadow:'0 24px 60px rgba(0,0,0,.38)',transform:`rotate(${rot}deg)`}}><div style={{position:'relative',width:'100%',height:'100%',borderRadius:25*s,background:screen,overflow:'hidden'}}>{children}</div></div>
}

export function CommentBubble({x,y,w=500,text,accent=C.red,opacity=1,scale=1}:{x:number;y:number;w?:number;text:string;accent?:string;opacity?:number;scale?:number}){
 return <div style={{position:'absolute',left:x,top:y,width:w,padding:'18px 24px',borderRadius:22,background:'rgba(255,255,255,.94)',borderLeft:`8px solid ${accent}`,boxShadow:'0 16px 40px rgba(0,0,0,.2)',opacity,transform:`scale(${scale})`,fontFamily:F,fontSize:28,fontWeight:850,color:C.ink}}>{text}</div>
}

export function OnsenRoom({camera=false,dark=false}:{camera?:boolean;dark?:boolean}){
 return <>
   <div style={{position:'absolute',inset:0,background:dark?'linear-gradient(180deg,#171724,#282739)':'linear-gradient(180deg,#d9cbb7,#efe4d0)'}}/>
   <div style={{position:'absolute',left:0,right:0,top:0,height:110,background:dark?'#332c2b':'#77563f'}}/>
   <div style={{position:'absolute',left:90,top:190,width:560,height:470,background:dark?'#3a3b45':'#c6aa84',border:'18px solid rgba(70,45,28,.45)',boxShadow:'inset 0 0 0 10px rgba(255,255,255,.08)'}}/>
   <div style={{position:'absolute',left:118,top:218,width:504,height:414,background:dark?'linear-gradient(90deg,#161a23,#2b303d)':'linear-gradient(90deg,#a8c2c8,#dce6e7)',opacity:.88}}/>
   {Array.from({length:5},(_,i)=><div key={i} style={{position:'absolute',left:760+i*205,top:210,width:165,height:250,borderRadius:12,background:dark?'#40362f':'#ae875f',border:'7px solid rgba(60,35,20,.34)'}}/>)}
   {Array.from({length:5},(_,i)=><div key={`b${i}`} style={{position:'absolute',left:770+i*205,top:515,width:145,height:105,borderRadius:'12px 12px 40px 40px',background:dark?'#58483a':'#b9946d',boxShadow:'0 14px 26px rgba(0,0,0,.13)'}}/>)}
   <div style={{position:'absolute',left:0,right:0,bottom:0,height:345,background:dark?'#22232c':'#b99a74'}}/>
   {Array.from({length:12},(_,i)=><div key={`f${i}`} style={{position:'absolute',left:i*175,bottom:0,width:2,height:345,background:'rgba(60,40,30,.13)'}}/>)}
   {camera&&<Camera x={1330} y={640} s={1.25} recording/>}
 </>
}

export function Signal({x,y,red=true,s=1}:{x:number;y:number;red?:boolean;s?:number}){return <div style={{position:'absolute',left:x,top:y,width:90*s,height:210*s,background:'#252c39',borderRadius:22*s,boxShadow:'0 12px 30px rgba(0,0,0,.4)'}}>{['#d94343','#d9b642','#4da268'].map((c,i)=><div key={c} style={{position:'absolute',left:18*s,top:(18+i*62)*s,width:54*s,height:54*s,borderRadius:'50%',background:(red?i===0:i===2)?c:'#3a414d',boxShadow:(red?i===0:i===2)?`0 0 ${30*s}px ${c}`:'none'}}/>)}</div>}

export function RuleLine({x,y,w,label,color=C.red,opacity=1}:{x:number;y:number;w:number;label?:string;color?:string;opacity?:number}){return <><div style={{position:'absolute',left:x,top:y,width:w,height:6,background:color,opacity,boxShadow:`0 0 22px ${color}`}}/>{label&&<Txt x={x} y={y-58} size={28} color={color} opacity={opacity}>{label}</Txt>}</>}

export function Badge({x,y,text,color=C.red,rot=0,opacity=1}:{x:number;y:number;text:string;color?:string;rot?:number;opacity?:number}){return <div style={{position:'absolute',left:x,top:y,padding:'14px 24px',border:`5px solid ${color}`,borderRadius:14,color,fontFamily:F,fontSize:30,fontWeight:950,letterSpacing:1.5,transform:`rotate(${rot}deg)`,opacity,background:'rgba(255,255,255,.86)'}}>{text}</div>}

export function CloudNode({x,y,label,scale=1,opacity=1}:{x:number;y:number;label:string;scale?:number;opacity?:number}){return <div style={{position:'absolute',left:x,top:y,width:130*scale,height:130*scale,borderRadius:'50%',background:'linear-gradient(145deg,#e9f3ff,#b9d0ea)',border:'5px solid #7b9abd',boxShadow:'0 14px 30px rgba(20,40,70,.23)',opacity,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:F,fontSize:22*scale,fontWeight:900,color:'#25415d',textAlign:'center'}}>{label}</div>}
