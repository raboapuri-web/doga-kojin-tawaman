import React from 'react';
import {AbsoluteFill} from 'remotion';

export const C={ink:'#111722',paper:'#f2eee5',night:'#0b1220',blue:'#2e6f9e',cyan:'#62b4d2',red:'#c34f4f',gold:'#d2a24f',green:'#4f8d6e',muted:'#7d8792',white:'#f8f5ee',skin:'#d1aa8d',road:'#242b34',glass:'#9fc7d6'};
export const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export const ease=(v:number)=>1-Math.pow(1-clamp(v),3);
export const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
export const pulse=(p:number,f=2)=>.5+.5*Math.sin(p*Math.PI*2*f);

export const Txt=({x,y,w=1000,size=48,color=C.ink,align='left',weight=800,children,opacity=1}:{x:number;y:number;w?:number;size?:number;color?:string;align?:'left'|'center'|'right';weight?:number;children:React.ReactNode;opacity?:number})=>(
  <div style={{position:'absolute',left:x,top:y,width:w,fontFamily:'Noto Sans CJK JP, sans-serif',fontSize:size,fontWeight:weight,lineHeight:1.3,letterSpacing:.3,textAlign:align,color,opacity}}>{children}</div>
);

export const Source=({text}:{text?:string})=>text?<div style={{position:'absolute',right:45,top:36,padding:'8px 14px',borderRadius:10,background:'rgba(8,12,18,.76)',color:'#e1e8ee',fontFamily:'Noto Sans CJK JP, sans-serif',fontSize:19,fontWeight:700}}>出典: {text}</div>:null;

export const SceneShell=({chapter,source,bg=C.paper,children,cameraX=0,cameraY=0,zoom=1}:{chapter:string;source?:string;bg?:string;children:React.ReactNode;cameraX?:number;cameraY?:number;zoom?:number})=>(
  <AbsoluteFill style={{background:bg,overflow:'hidden'}}>
    <div style={{position:'absolute',inset:-80,transform:`translate(${cameraX}px,${cameraY}px) scale(${zoom})`,transformOrigin:'50% 50%'}}>{children}</div>
    <div style={{position:'absolute',left:42,top:34,padding:'9px 15px',borderRadius:12,background:'rgba(255,255,255,.84)',fontFamily:'Noto Sans CJK JP, sans-serif',fontSize:21,fontWeight:900,color:C.ink,boxShadow:'0 7px 24px rgba(0,0,0,.08)'}}>{chapter}</div>
    <Source text={source}/>
  </AbsoluteFill>
);

export const Caption=({text,p}:{text:string;p:number})=>{
  const parts=text.split(/(?<=[。！？])/).filter(Boolean);
  const idx=Math.min(parts.length-1,Math.floor(clamp(p)*parts.length));
  return <div style={{position:'absolute',left:175,right:175,bottom:30,minHeight:86,padding:'17px 26px',borderRadius:18,background:'rgba(7,11,18,.86)',color:C.white,fontFamily:'Noto Sans CJK JP, sans-serif',fontSize:34,fontWeight:700,lineHeight:1.45,textAlign:'center',boxShadow:'0 14px 42px rgba(0,0,0,.28)'}}>{parts[idx]||text}</div>;
};

export const Person=({x,y,s=1,shirt='#566d84',pants='#313942',walk=0,face=true,flip=false,arm=0}:{x:number;y:number;s?:number;shirt?:string;pants?:string;walk?:number;face?:boolean;flip?:boolean;arm?:number})=>{
  const leg=Math.sin(walk*Math.PI*2)*20;
  const armSwing=Math.sin(walk*Math.PI*2+Math.PI)*18+arm;
  return <div style={{position:'absolute',left:x,top:y,width:140,height:390,transform:`scaleX(${flip?-1:1}) scale(${s})`,transformOrigin:'50% 100%'}}>
    <div style={{position:'absolute',left:30,top:0,width:78,height:78,borderRadius:'50%',background:C.skin,border:'3px solid rgba(0,0,0,.08)'}}>{face&&<><div style={{position:'absolute',left:22,top:29,width:7,height:7,borderRadius:8,background:'#30343a'}}/><div style={{position:'absolute',right:22,top:29,width:7,height:7,borderRadius:8,background:'#30343a'}}/></>}</div>
    <div style={{position:'absolute',left:10,top:72,width:120,height:178,borderRadius:'42px 42px 24px 24px',background:shirt}}/>
    <div style={{position:'absolute',left:8,top:90,width:28,height:155,borderRadius:18,background:shirt,transform:`rotate(${armSwing}deg)`,transformOrigin:'14px 12px'}}/>
    <div style={{position:'absolute',right:8,top:90,width:28,height:155,borderRadius:18,background:shirt,transform:`rotate(${-armSwing}deg)`,transformOrigin:'14px 12px'}}/>
    <div style={{position:'absolute',left:28,top:238,width:34,height:140,borderRadius:18,background:pants,transform:`rotate(${leg}deg)`,transformOrigin:'17px 8px'}}/>
    <div style={{position:'absolute',right:28,top:238,width:34,height:140,borderRadius:18,background:pants,transform:`rotate(${-leg}deg)`,transformOrigin:'17px 8px'}}/>
  </div>;
};

export const Building=({x,y,w=180,h=520,lit=.45,label,color='#203045'}:{x:number;y:number;w?:number;h?:number;lit?:number;label?:string;color?:string})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,background:`linear-gradient(${color},#101823)`,border:'2px solid #4c5e70',boxShadow:'0 18px 46px rgba(0,0,0,.28)'}}>
  {Array.from({length:Math.max(2,Math.floor(h/66))},(_,r)=>Array.from({length:Math.max(2,Math.floor(w/52))},(_,c)=><div key={`${r}-${c}`} style={{position:'absolute',left:15+c*49,top:22+r*61,width:23,height:27,background:((r*7+c*3)%10)/10<lit?'#e9c879':'#31445a'}}/>))}
  {label&&<Txt x={12} y={h*.46} w={w-24} size={22} color={C.white} align="center">{label}</Txt>}
</div>;

export const Car=({x,y,s=1,p=0,color='#7b8fa5'}:{x:number;y:number;s?:number;p?:number;color?:string})=><div style={{position:'absolute',left:x,top:y,width:220,height:100,transform:`translateX(${p}px) scale(${s})`,transformOrigin:'50% 100%'}}>
  <div style={{position:'absolute',left:14,top:32,width:190,height:58,borderRadius:'24px 40px 18px 18px',background:color}}/><div style={{position:'absolute',left:58,top:7,width:98,height:45,borderRadius:'30px 30px 4px 4px',background:color}}/><div style={{position:'absolute',left:74,top:15,width:62,height:30,background:'#a9d0df'}}/><div style={{position:'absolute',left:42,top:73,width:34,height:34,borderRadius:'50%',background:'#15191f'}}/><div style={{position:'absolute',right:34,top:73,width:34,height:34,borderRadius:'50%',background:'#15191f'}}/>
</div>;

export const Train=({x,y,p=0,s=1}:{x:number;y:number;p?:number;s?:number})=><div style={{position:'absolute',left:x+p,top:y,width:720,height:190,transform:`scale(${s})`,transformOrigin:'0 100%'}}>
  <div style={{position:'absolute',inset:0,borderRadius:'26px 56px 18px 18px',background:'#d8dadd',border:'5px solid #565e67'}}/>
  <div style={{position:'absolute',left:0,right:0,top:92,height:18,background:'#ef8b2d'}}/>
  {Array.from({length:6},(_,i)=><div key={i} style={{position:'absolute',left:55+i*105,top:30,width:72,height:55,background:'#8ab4c8',border:'3px solid #607680'}}/>)}
  <div style={{position:'absolute',left:80,bottom:-15,width:56,height:56,borderRadius:'50%',background:'#222a31'}}/><div style={{position:'absolute',right:90,bottom:-15,width:56,height:56,borderRadius:'50%',background:'#222a31'}}/>
</div>;

export const Paper=({x,y,rot=0,p=0,text=''}:{x:number;y:number;rot?:number;p?:number;text?:string})=><div style={{position:'absolute',left:x+p*120,top:y+Math.sin(p*Math.PI*2)*14,width:120,height:150,background:'#f8f6ef',border:'2px solid #bbb6aa',transform:`rotate(${rot+p*8}deg)`,boxShadow:'0 8px 18px rgba(0,0,0,.16)'}}>{text&&<Txt x={8} y={55} w={104} size={18} align="center">{text}</Txt>}</div>;

export const Desk=({x,y,w=520}:{x:number;y:number;w?:number})=><><div style={{position:'absolute',left:x,top:y,width:w,height:52,background:'#86674d',boxShadow:'0 12px 25px rgba(0,0,0,.22)'}}/><div style={{position:'absolute',left:x+35,top:y+48,width:34,height:200,background:'#76563f'}}/><div style={{position:'absolute',left:x+w-69,top:y+48,width:34,height:200,background:'#76563f'}}/></>;

export const MoneyStack=({x,y,count=6,s=1,color='#6f9b70'}:{x:number;y:number;count?:number;s?:number;color?:string})=><div style={{position:'absolute',left:x,top:y,transform:`scale(${s})`,transformOrigin:'0 100%'}}>{Array.from({length:count},(_,i)=><div key={i} style={{position:'absolute',left:i*12,top:-i*27,width:250,height:82,borderRadius:10,background:color,border:'3px solid rgba(0,0,0,.13)'}}/>)}</div>;

export const House=({x,y,s=1,roof='#8d5a4c',wall='#ddd1ba'}:{x:number;y:number;s?:number;roof?:string;wall?:string})=><div style={{position:'absolute',left:x,top:y,width:480,height:420,transform:`scale(${s})`,transformOrigin:'50% 100%'}}>
  <div style={{position:'absolute',left:70,top:145,width:340,height:250,background:wall,border:'5px solid #7b6c5d'}}/><div style={{position:'absolute',left:30,top:50,width:420,height:170,background:roof,clipPath:'polygon(50% 0,100% 100%,0 100%)'}}/><div style={{position:'absolute',left:115,top:230,width:80,height:165,background:'#725441'}}/><div style={{position:'absolute',right:100,top:225,width:100,height:90,background:C.glass,border:'5px solid #71848b'}}/>
</div>;

export const Tree=({x,y,s=1,sway=0}:{x:number;y:number;s?:number;sway?:number})=><div style={{position:'absolute',left:x,top:y,width:180,height:350,transform:`scale(${s}) rotate(${sway}deg)`,transformOrigin:'50% 100%'}}><div style={{position:'absolute',left:72,top:135,width:38,height:210,background:'#76583c'}}/><div style={{position:'absolute',left:20,top:20,width:145,height:170,borderRadius:'50%',background:'#668b5f'}}/><div style={{position:'absolute',left:0,top:85,width:110,height:120,borderRadius:'50%',background:'#5e8358'}}/></div>;

export const RobotArm=({x,y,p=0,s=1}:{x:number;y:number;p?:number;s?:number})=>{
  const a=-25+Math.sin(p*Math.PI*2)*32; const b=28+Math.sin(p*Math.PI*2+1)*30;
  return <div style={{position:'absolute',left:x,top:y,width:260,height:300,transform:`scale(${s})`,transformOrigin:'50% 100%'}}><div style={{position:'absolute',left:90,top:230,width:100,height:50,borderRadius:16,background:'#5b6874'}}/><div style={{position:'absolute',left:120,top:110,width:34,height:140,borderRadius:18,background:'#c78638',transform:`rotate(${a}deg)`,transformOrigin:'17px 130px'}}><div style={{position:'absolute',left:-2,top:-100,width:34,height:120,borderRadius:18,background:'#dda04e',transform:`rotate(${b}deg)`,transformOrigin:'17px 110px'}}><div style={{position:'absolute',left:-12,top:-18,width:60,height:22,background:'#555f68'}}/></div></div></div>;
};

export const Conveyor=({x,y,w=850,p=0}:{x:number;y:number;w?:number;p?:number})=><div style={{position:'absolute',left:x,top:y,width:w,height:110}}><div style={{position:'absolute',left:0,right:0,top:38,height:34,background:'#4c5660'}}/>{Array.from({length:Math.ceil(w/90)},(_,i)=><div key={i} style={{position:'absolute',left:i*90,top:34,width:56,height:42,borderRadius:'50%',background:'#252b32',transform:`rotate(${p*360}deg)`}}/>)}{Array.from({length:5},(_,i)=><div key={`box-${i}`} style={{position:'absolute',left:(i*180+(p*170))%(w-80),top:0,width:80,height:55,background:'#c19c6b',border:'3px solid #8f714c'}}/>)}</div>;

export const Big=({x,y,value,label,color=C.blue,size=88}:{x:number;y:number;value:string;label?:string;color?:string;size?:number})=><div style={{position:'absolute',left:x,top:y,width:620}}><div style={{fontFamily:'Noto Sans CJK JP, sans-serif',fontSize:size,fontWeight:900,color,lineHeight:1}}>{value}</div>{label&&<div style={{marginTop:12,fontFamily:'Noto Sans CJK JP, sans-serif',fontSize:27,fontWeight:800,color:C.muted}}>{label}</div>}</div>;

export const Pill=({x,y,text,color=C.blue}:{x:number;y:number;text:string;color?:string})=><div style={{position:'absolute',left:x,top:y,padding:'13px 22px',borderRadius:999,background:color,color:C.white,fontFamily:'Noto Sans CJK JP, sans-serif',fontSize:27,fontWeight:900,boxShadow:'0 10px 25px rgba(0,0,0,.16)'}}>{text}</div>;

export const Arrow=({x,y,w=300,color=C.red,reverse=false}:{x:number;y:number;w?:number;color?:string;reverse?:boolean})=><div style={{position:'absolute',left:x,top:y,width:w,height:13,background:color,transform:reverse?'scaleX(-1)':'none'}}><div style={{position:'absolute',right:-5,top:-15,borderTop:'22px solid transparent',borderBottom:'22px solid transparent',borderLeft:`32px solid ${color}`}}/></div>;

export const WindowGlow=({x,y,w,h,on=1}:{x:number;y:number;w:number;h:number;on?:number})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,background:`rgba(238,203,118,${on})`,boxShadow:`0 0 ${28*on}px rgba(239,199,100,${on*.65})`}}/>;

export const Wave=({p,height=400,color='#467a9f'}:{p:number;height?:number;color?:string})=><svg style={{position:'absolute',left:0,right:0,bottom:0,width:'100%',height}} viewBox={`0 0 1920 ${height}`} preserveAspectRatio="none"><path d={`M0 ${height*.55} C 320 ${height*(.35+.08*Math.sin(p*6))},640 ${height*(.78+.05*Math.cos(p*7))},960 ${height*.48} C 1280 ${height*(.2+.08*Math.cos(p*5))},1600 ${height*.72},1920 ${height*.42} L1920 ${height} L0 ${height}Z`} fill={color}/></svg>;

export const TimelineDot=({x,y,label,color=C.red,active=1}:{x:number;y:number;label:string;color?:string;active?:number})=><div style={{position:'absolute',left:x,top:y,width:26,height:26,borderRadius:'50%',background:color,boxShadow:`0 0 ${20*active}px ${color}`}}><Txt x={-80} y={38} w={190} size={24} align="center">{label}</Txt></div>;
