import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export type Beat={id:string;scene:string;narration:string};

type P={p:number};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const smooth=(v:number)=>{const x=clamp(v);return x*x*(3-2*x)};
const phase=(p:number,a:number,b:number)=>smooth((p-a)/(b-a));
const hash=(i:number)=>{const x=Math.sin(i*91.73+17.41)*43758.5453;return x-Math.floor(x)};
const FONT='"Noto Sans CJK JP","Hiragino Sans",sans-serif';

const palette={ink:'#14171b',paper:'#e9e6df',warm:'#c98d56',rice:'#f7f4e8',blue:'#253343',glass:'#a8b5bd',green:'#516052',red:'#9b4f44'};

const FilmLayer:React.FC=()=>{
  const f=useCurrentFrame();
  const drift=(f%41)*7;
  return <>
    <AbsoluteFill style={{pointerEvents:'none',background:'radial-gradient(circle at 50% 43%,transparent 35%,rgba(0,0,0,.28) 100%)'}}/>
    <AbsoluteFill style={{pointerEvents:'none',opacity:.055,mixBlendMode:'screen',backgroundImage:'repeating-radial-gradient(circle at 20% 30%,rgba(255,255,255,.55) 0 1px,transparent 1px 4px)',backgroundSize:'9px 9px',transform:`translate(${drift%9}px,${(drift*1.7)%9}px)`}}/>
    <AbsoluteFill style={{pointerEvents:'none',opacity:.09,backgroundImage:'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px)',backgroundSize:'100% 4px'}}/>
  </>;
};

const SceneShell:React.FC<React.PropsWithChildren<{tone?:'city'|'home'|'store'|'memory';p:number}>>=({tone='city',p,children})=>{
  const f=useCurrentFrame();
  const bg=tone==='home'?'#2b2722':tone==='store'?'#202528':tone==='memory'?'#312a22':'#151b20';
  const x=Math.sin(f*.011)*7+Math.sin(f*.0043)*4;
  const y=Math.cos(f*.009)*4;
  const scale=1.018+Math.sin(f*.006)*.006+phase(p,.05,.95)*.012;
  return <AbsoluteFill style={{background:bg,overflow:'hidden',fontFamily:FONT,color:palette.paper}}>
    <div style={{position:'absolute',inset:-35,transform:`translate(${x}px,${y}px) scale(${scale})`,transformOrigin:'50% 50%'}}>{children}</div>
    <FilmLayer/>
  </AbsoluteFill>;
};

const WindowLights:React.FC<{count?:number;opacity?:number}>=({count=70,opacity=.8})=>{
  const f=useCurrentFrame();
  return <>{Array.from({length:count},(_,i)=>{
    const left=hash(i)*100, top=hash(i+99)*70+5, w=3+hash(i+42)*7;
    const blink=.45+.55*Math.max(0,Math.sin(f*.025+i*2.1));
    return <div key={i} style={{position:'absolute',left:`${left}%`,top:`${top}%`,width:w,height:2+hash(i+3)*4,background:i%7===0?'#f1c98e':'#d6e0e6',opacity:opacity*(.28+.72*blink),filter:'blur(.2px)'}}/>;
  })}</>;
};

const RiceBox:React.FC<{p:number;small?:boolean}>=({p,small=false})=>{
  const lift=interpolate(p,[0,1],[24,-10]);
  const rot=interpolate(p,[0,1],[-2.3,1.4]);
  const s=small?.68:1;
  return <div style={{position:'relative',width:520*s,height:330*s,transform:`translateY(${lift}px) rotate(${rot}deg)`,filter:'drop-shadow(0 28px 30px rgba(0,0,0,.38))'}}>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,#a96f3e,#c88f54 54%,#9c6337)',border:'3px solid #714829',borderRadius:7}}/>
    <div style={{position:'absolute',left:'47%',top:0,width:'10%',height:'100%',background:'rgba(230,205,160,.42)'}}/>
    <div style={{position:'absolute',left:34*s,top:38*s,fontSize:31*s,fontWeight:800,letterSpacing:8*s,color:'#482e21',opacity:.55}}>越後</div>
    <div style={{position:'absolute',left:105*s,top:138*s,fontSize:48*s,fontWeight:900,letterSpacing:4*s,color:'#2d211b',transform:'rotate(-4deg)',fontFamily:'serif'}}>米　われもの注意</div>
    <div style={{position:'absolute',right:32*s,bottom:26*s,fontSize:19*s,color:'#52382a',opacity:.7}}>30kg</div>
  </div>;
};

const RiceSack:React.FC<{x:number;y:number;scale?:number;label?:string;p?:number}>=({x,y,scale=1,label,p=.5})=>{
  const bulge=1+Math.sin(p*Math.PI)*.025;
  return <div style={{position:'absolute',left:x,top:y,width:230*scale,height:300*scale,borderRadius:`${38*scale}px ${38*scale}px ${24*scale}px ${24*scale}px`,background:'linear-gradient(100deg,#dcd8cc,#faf8ef 55%,#c7c2b5)',boxShadow:'0 28px 40px rgba(0,0,0,.22)',border:'1px solid rgba(255,255,255,.4)',transform:`scale(${bulge})`}}>
    <div style={{position:'absolute',left:'14%',right:'14%',top:'8%',height:2,background:'#9a9589',opacity:.4}}/>
    {label&&<div style={{position:'absolute',top:'24%',left:0,right:0,textAlign:'center',fontSize:25*scale,color:'#56534e',fontWeight:700,letterSpacing:4*scale}}>{label}</div>}
  </div>;
};

const Person:React.FC<{x:number;y:number;scale?:number;coat?:string;lean?:number;opacity?:number}>=({x,y,scale=1,coat='#303840',lean=0,opacity=1})=>
  <div style={{position:'absolute',left:x,top:y,width:100*scale,height:260*scale,opacity,transform:`rotate(${lean}deg)`,transformOrigin:'50% 100%'}}>
    <div style={{position:'absolute',left:30*scale,top:0,width:42*scale,height:52*scale,borderRadius:'48%',background:'#c7aa95'}}/>
    <div style={{position:'absolute',left:19*scale,top:44*scale,width:64*scale,height:126*scale,borderRadius:`${19*scale}px ${19*scale}px ${9*scale}px ${9*scale}px`,background:coat,boxShadow:'0 10px 25px rgba(0,0,0,.2)'}}/>
    <div style={{position:'absolute',left:27*scale,top:160*scale,width:18*scale,height:92*scale,background:'#1d2328',borderRadius:8*scale}}/>
    <div style={{position:'absolute',left:58*scale,top:160*scale,width:18*scale,height:92*scale,background:'#1d2328',borderRadius:8*scale}}/>
  </div>;

const RiceDelivery:React.FC<P>=({p})=>{
  const f=useCurrentFrame();
  const boxX=interpolate(p,[0,.65,1],[1220,760,720]);
  const floorGlow=.4+.15*Math.sin(f*.04);
  return <SceneShell p={p} tone="home">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(115deg,#1f1b18 0%,#40362d 52%,#171514 100%)'}}/>
    <div style={{position:'absolute',left:0,bottom:0,width:'100%',height:'32%',background:'linear-gradient(#3a322b,#211d19)',transform:'skewY(-2deg)',transformOrigin:'0 100%'}}/>
    <div style={{position:'absolute',left:180,top:120,width:550,height:680,background:'#252421',border:'2px solid #4a4944',boxShadow:'inset -40px 0 70px rgba(0,0,0,.3)'}}/>
    <div style={{position:'absolute',left:170,top:105,width:600,height:5,background:'#d9caaa',opacity:floorGlow,filter:'blur(9px)'}}/>
    <div style={{position:'absolute',left:boxX,top:575}}><RiceBox p={p}/></div>
    <div style={{position:'absolute',left:860,top:170,width:760,height:400,opacity:.35}}><WindowLights count={45}/></div>
  </SceneShell>;
};

const Kinship:React.FC<P>=({p})=>{
  const pts=[{x:310,y:260},{x:620,y:160},{x:915,y:270},{x:1210,y:150},{x:1500,y:280}];
  return <SceneShell p={p} tone="memory">
    <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 46% 40%,#514438 0,#2c251f 55%,#191613 100%)'}}/>
    <svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      {pts.slice(0,-1).map((a,i)=>{const b=pts[i+1];const grow=phase(p,i*.13,.36+i*.13);return <line key={i} x1={a.x} y1={a.y} x2={a.x+(b.x-a.x)*grow} y2={a.y+(b.y-a.y)*grow} stroke="#b7a68f" strokeWidth="3" opacity=".48"/>})}
    </svg>
    {pts.map((pt,i)=><div key={i} style={{position:'absolute',left:pt.x-44,top:pt.y-44,width:88,height:88,borderRadius:'50%',background:i===0?'#a17a5e':'#55483d',border:'2px solid #9a8876',boxShadow:'0 12px 30px rgba(0,0,0,.28)',transform:`scale(${.82+phase(p,i*.11,.28+i*.11)*.18})`}}/>) }
    <div style={{position:'absolute',left:1410,top:450}}><RiceSack x={0} y={0} scale={.8} p={p}/></div>
    <div style={{position:'absolute',left:150,top:620,width:1450,height:2,background:'linear-gradient(90deg,transparent,#9f8b74,transparent)',opacity:.35}}/>
  </SceneShell>;
};

const RiceStack:React.FC<P>=({p})=>
  <SceneShell p={p} tone="home">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(130deg,#26221e,#383028 60%,#191614)'}}/>
    <RiceSack x={610} y={490-interpolate(p,[0,1],[0,18])} label="10kg" p={p}/>
    <RiceSack x={845} y={430-interpolate(p,[0,1],[0,28])} label="10kg" p={p}/>
    <RiceSack x={1080} y={500-interpolate(p,[0,1],[0,22])} label="10kg" p={p}/>
    <div style={{position:'absolute',left:320,top:220,width:1050,height:520,border:'1px solid rgba(255,255,255,.09)',borderRadius:14,transform:'perspective(900px) rotateX(7deg)',boxShadow:'inset 0 -100px 170px rgba(0,0,0,.35)'}}/>
  </SceneShell>;

const HirooApartment:React.FC<P>=({p})=>{
  const z=1+phase(p,0,1)*.05;
  return <SceneShell p={p} tone="city">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#182128,#101418)'}}/>
    <div style={{position:'absolute',left:90,top:95,width:690,height:810,background:'linear-gradient(145deg,#313a3f,#1d252a)',boxShadow:'0 45px 90px rgba(0,0,0,.45)',transform:`perspective(1300px) translateZ(${p*18}px) rotateY(5deg) scale(${z})`}}>
      <div style={{position:'absolute',left:45,top:55,width:300,height:210,background:'#202a30',border:'8px solid #49545b'}}><WindowLights count={22} opacity={.6}/></div>
      <div style={{position:'absolute',left:80,bottom:120,width:340,height:120,borderRadius:22,background:'#676d6f'}}/>
      <div style={{position:'absolute',right:90,bottom:105,width:140,height:250,background:'#1f2424',borderRadius:8}}/>
      <div style={{position:'absolute',right:130,bottom:350,width:9,height:270,background:'#a7a18d'}}/><div style={{position:'absolute',right:83,bottom:600,width:100,height:36,borderRadius:'50%',background:'#d9cda9',boxShadow:'0 0 45px #d4bd78'}}/>
    </div>
    <div style={{position:'absolute',right:95,top:80,width:850,height:800,opacity:.9}}><WindowLights count={90}/></div>
    <div style={{position:'absolute',right:110,bottom:160,width:740,height:3,background:'linear-gradient(90deg,transparent,#718b9c,transparent)',opacity:.35}}/>
  </SceneShell>;
};

const HirooMap:React.FC<P>=({p})=>{
  const road=phase(p,.05,.9);
  return <SceneShell p={p} tone="city">
    <div style={{position:'absolute',inset:0,background:'#182126'}}/>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{opacity:.8}}>
      {Array.from({length:14},(_,i)=>{const y=100+i*70;return <path key={i} d={`M -50 ${y} C 450 ${y-80}, 750 ${y+85}, 1150 ${y-30} S 1750 ${y+55}, 1980 ${y-10}`} fill="none" stroke={i%4===0?'#75838a':'#38454b'} strokeWidth={i%4===0?5:2} opacity={.45}/>})}
      <path d="M200 980 C500 650 620 430 930 500 C1200 560 1250 240 1720 120" fill="none" stroke="#c2b18a" strokeWidth="8" strokeDasharray="16 18" strokeDashoffset={-p*600} opacity={.75}/>
      <circle cx={1050} cy={470} r={18+8*Math.sin(p*Math.PI)} fill="#d8c39b"/>
      <circle cx={1050} cy={470} r={80*road} fill="none" stroke="#d8c39b" strokeWidth="2" opacity={1-road}/>
    </svg>
  </SceneShell>;
};

const Consulting:React.FC<P>=({p})=>{
  const slide=interpolate(p,[0,1],[0,-160]);
  return <SceneShell p={p} tone="city">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#12171c,#202932)'}}/>
    <div style={{position:'absolute',left:190,top:130,width:1510,height:710,background:'rgba(18,24,30,.72)',border:'1px solid rgba(255,255,255,.12)',backdropFilter:'blur(7px)',boxShadow:'0 35px 100px rgba(0,0,0,.45)'}}>
      {Array.from({length:10},(_,i)=><div key={i} style={{position:'absolute',left:80+i*145+slide%145,top:125+(i%3)*142,width:88,height:255-(i%4)*36,background:'linear-gradient(#4d5d69,#26323a)',opacity:.5,borderRadius:6}}/>) }
      <div style={{position:'absolute',left:120,bottom:100,width:1180,height:2,background:'#71818b',opacity:.35}}/>
      <div style={{position:'absolute',right:170,bottom:105,width:230,height:315,background:'rgba(5,8,10,.8)',boxShadow:'0 22px 50px rgba(0,0,0,.4)'}}><div style={{position:'absolute',left:40,top:50,width:150,height:5,background:'#9ca8ad'}}/><div style={{position:'absolute',left:40,top:80,width:120,height:5,background:'#68747b'}}/></div>
    </div>
  </SceneShell>;
};

const GossipChain:React.FC<P>=({p})=>{
  const nodes=[250,540,850,1170,1510];
  return <SceneShell p={p} tone="memory">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(120deg,#2c2521,#1d1917)'}}/>
    {nodes.map((x,i)=><React.Fragment key={i}>
      <Person x={x} y={410+((i%2)*35)} scale={.8} coat={i===2?'#69584e':'#3b4145'} opacity={.55+.45*phase(p,i*.12,.35+i*.12)}/>
      {i<nodes.length-1&&<div style={{position:'absolute',left:x+90,top:500,width:nodes[i+1]-x-80,height:2,background:'linear-gradient(90deg,#b49d84,transparent)',transform:`scaleX(${phase(p,i*.12+.08,.42+i*.12)})`,transformOrigin:'0 50%',opacity:.5}}/>}
    </React.Fragment>)}
    <div style={{position:'absolute',left:190,top:210,width:1500,height:460,borderTop:'1px solid rgba(255,255,255,.06)',borderBottom:'1px solid rgba(255,255,255,.06)',transform:`translateX(${Math.sin(p*Math.PI*2)*12}px)`}}/>
  </SceneShell>;
};

const TokyoMachine:React.FC<P>=({p})=>{
  const f=useCurrentFrame();
  return <SceneShell p={p} tone="city">
    <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 55% 50%,#35414a,#151b20 60%,#0c0f12)'}}/>
    {Array.from({length:7},(_,i)=>{
      const r=140+i*82;const rot=f*(.16+(i%2)*-.1)*(i%2?1:-1);
      return <div key={i} style={{position:'absolute',left:960-r,top:540-r,width:r*2,height:r*2,border:`${i%2?3:2}px solid rgba(147,165,175,${.18+i*.018})`,borderRadius:'50%',transform:`rotate(${rot}deg)`}}>{Array.from({length:8},(_,j)=><div key={j} style={{position:'absolute',left:'50%',top:-8,width:10,height:16,background:'#718590',transformOrigin:`0 ${r+8}px`,transform:`rotate(${j*45}deg)`}}/>)}</div>})}
    {Array.from({length:18},(_,i)=>{const a=hash(i)*Math.PI*2;const r=180+hash(i+3)*500;const t=(f*.7+i*37)%360;return <div key={i} style={{position:'absolute',left:960+Math.cos(a)*r+Math.sin(t*.01)*20,top:540+Math.sin(a)*r,width:48,height:28,borderRadius:4,background:i%3===0?'#ba8b5d':'#6f7e86',opacity:.5,transform:`rotate(${(a*180/Math.PI)+90}deg) scale(${.7+hash(i+5)*.5})`}}/>})}
  </SceneShell>;
};

const MilkCompare:React.FC<P>=({p})=>{
  const x=interpolate(p,[0,1],[120,-40]);
  return <SceneShell p={p} tone="store">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#2d3438,#171b1d)'}}/>
    <div style={{position:'absolute',left:210,top:150,width:1500,height:680,border:'1px solid #535d62',background:'#202629',boxShadow:'inset 0 40px 90px rgba(255,255,255,.025)'}}>
      {[0,1,2].map(row=><div key={row} style={{position:'absolute',left:0,right:0,top:180+row*190,height:8,background:'#5f686c'}}/>) }
      {Array.from({length:18},(_,i)=><div key={i} style={{position:'absolute',left:70+(i%6)*230+x,top:90+Math.floor(i/6)*190,width:76,height:148,background:i%3===0?'#e5ebe9':'#cfd8d7',clipPath:'polygon(18% 0,82% 0,100% 20%,100% 100%,0 100%,0 20%)',boxShadow:'0 8px 18px rgba(0,0,0,.25)'}}><div style={{position:'absolute',left:8,right:8,top:58,height:22,background:i%2?'#658299':'#84967b',opacity:.75}}/></div>)}
    </div>
  </SceneShell>;
};

const NationalAzabu:React.FC<P>=({p})=>{
  const move=interpolate(p,[0,1],[0,-330]);
  return <SceneShell p={p} tone="store">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#32393c,#191d20)'}}/>
    <div style={{position:'absolute',left:90,top:80,width:1740,height:850,transform:'perspective(1000px) rotateX(2deg)'}}>
      {[0,1].map(side=><div key={side} style={{position:'absolute',top:0,bottom:0,left:side?1040:0,width:640,transform:`translateX(${side?move:-move*.35}px)`,background:'linear-gradient(90deg,#1a1e20,#343b3f)',border:'1px solid #4c5559'}}>
        {[0,1,2,3].map(row=><div key={row} style={{position:'absolute',left:18,right:18,top:140+row*165,height:5,background:'#717a7e'}}/>) }
        {Array.from({length:24},(_,i)=><div key={i} style={{position:'absolute',left:38+(i%6)*92,top:60+Math.floor(i/6)*165,width:56,height:105,background:['#dbd6c7','#8da1a8','#9b745e','#71806e'][i%4],borderRadius:i%3===0?28:4,boxShadow:'0 6px 10px rgba(0,0,0,.25)'}}/>) }
      </div>)}
      <div style={{position:'absolute',left:690,top:0,width:350,height:850,background:'linear-gradient(180deg,#444d51 0,#22272a 80%)',clipPath:'polygon(28% 0,72% 0,100% 100%,0 100%)'}}/>
      <Person x={810} y={420} scale={.9} coat="#525a5d"/>
      <Person x={915} y={445} scale={.78} coat="#8b806f"/>
    </div>
  </SceneShell>;
};

const LuxuryShelf:React.FC<P>=({p})=>{
  const f=useCurrentFrame();
  const items=[{shape:'cheese',x:320,c:'#d8bd68'},{shape:'water',x:730,c:'#aac5ce'},{shape:'soap',x:1160,c:'#a4ae95'}];
  return <SceneShell p={p} tone="store">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(160deg,#242b2e,#161a1c)'}}/>
    <div style={{position:'absolute',left:170,top:190,width:1580,height:620,background:'#2d3335',border:'1px solid #5a6265',boxShadow:'0 30px 80px rgba(0,0,0,.4)'}}>
      <div style={{position:'absolute',left:40,right:40,bottom:110,height:9,background:'#787f80'}}/>
      {items.map((it,i)=>{const bob=Math.sin(f*.03+i)*8;return <div key={it.shape} style={{position:'absolute',left:it.x,top:250+bob,width:230,height:250}}>
        {i===0?<div style={{position:'absolute',left:20,top:60,width:190,height:120,background:it.c,clipPath:'polygon(0 10%,100% 0,88% 100%,10% 92%)',boxShadow:'0 16px 25px rgba(0,0,0,.3)'}}/>:i===1?<div style={{position:'absolute',left:80,top:0,width:74,height:220,borderRadius:30,background:`linear-gradient(90deg,#6f8d98,${it.c},#68808a)`,boxShadow:'inset 12px 0 18px rgba(255,255,255,.18)'}}/>:<div style={{position:'absolute',left:65,top:25,width:105,height:190,borderRadius:20,background:it.c,boxShadow:'inset 15px 0 22px rgba(255,255,255,.14)'}}/>}
        <div style={{position:'absolute',left:55,right:55,bottom:-25,height:44,background:'#ede7d7',color:'#303234',fontSize:18,fontWeight:700,textAlign:'center',paddingTop:9,borderRadius:3}}>{i===0?'¥2,000':i===1?'¥500':'IMPORT'}</div>
      </div>})}
    </div>
  </SceneShell>;
};

const BoxArrival:React.FC<P>=({p})=>
  <SceneShell p={p} tone="home">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(120deg,#211d1a,#37312b 62%,#161413)'}}/>
    <div style={{position:'absolute',left:180,top:100,width:560,height:780,background:'#24221f',border:'1px solid #55504a'}}/>
    <div style={{position:'absolute',left:830,top:575}}><RiceBox p={p}/></div>
    <div style={{position:'absolute',left:740,top:160,width:760,height:4,background:'linear-gradient(90deg,#d1bc91,transparent)',opacity:.55,filter:'blur(7px)',transform:'rotate(15deg)'}}/>
  </SceneShell>;

const CourierMemory:React.FC<P>=({p})=>{
  const door=interpolate(p,[0,1],[-6,15]);
  return <SceneShell p={p} tone="memory">
    <div style={{position:'absolute',inset:0,background:'#2e2925'}}/>
    <div style={{position:'absolute',left:240,top:120,width:650,height:760,background:'#292725',transform:`perspective(900px) rotateY(${door}deg)`,transformOrigin:'0 50%',border:'4px solid #56504a'}}/>
    <Person x={1020} y={340} scale={1.15} coat="#3b556c" lean={-1}/>
    <div style={{position:'absolute',left:780,top:610}}><RiceBox p={p} small/></div>
    <div style={{position:'absolute',left:1325,top:445,width:170,height:65,border:'2px solid #748aa0',borderRadius:8,background:'#263643',opacity:.8}}/>
  </SceneShell>;
};

const InteriorContrast:React.FC<P>=({p})=>{
  const boxPulse=1+Math.sin(p*Math.PI*4)*.008;
  return <SceneShell p={p} tone="home">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(150deg,#2a2926,#171615)'}}/>
    <div style={{position:'absolute',left:720,top:150,width:1000,height:690,background:'#292b29',boxShadow:'inset 0 -160px 220px rgba(0,0,0,.3)'}}>
      <div style={{position:'absolute',left:120,bottom:100,width:410,height:155,borderRadius:28,background:'#707273'}}/>
      <div style={{position:'absolute',left:530,bottom:90,width:180,height:55,borderRadius:'50%',background:'#4c4439'}}/>
      <div style={{position:'absolute',right:190,bottom:100,width:90,height:340,background:'#283126'}}/>
      {Array.from({length:8},(_,i)=><div key={i} style={{position:'absolute',right:210+Math.sin(i)*70,bottom:420+i*30,width:160,height:40,background:'#405245',borderRadius:'50%',transform:`rotate(${i*27}deg)`}}/>)}
      <div style={{position:'absolute',left:610,top:120,width:8,height:340,background:'#99927f'}}/><div style={{position:'absolute',left:540,top:90,width:150,height:45,borderRadius:'50%',background:'#d7c99c',boxShadow:'0 0 45px rgba(235,208,145,.45)'}}/>
    </div>
    <div style={{position:'absolute',left:240,top:560,transform:`scale(${boxPulse})`}}><RiceBox p={p}/></div>
  </SceneShell>;
};

const WifeBackground:React.FC<P>=({p})=>
  <SceneShell p={p} tone="memory">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(110deg,#332b26,#1b1918)'}}/>
    <Person x={390} y={365} scale={1.1} coat="#8a8176"/>
    <Person x={1010} y={390} scale={1.0} coat="#47413b"/>
    <Person x={1240} y={400} scale={.92} coat="#57504a"/>
    <div style={{position:'absolute',left:770,top:560,width:260,height:120,borderRadius:'50%',background:'#665b4e',boxShadow:'0 20px 40px rgba(0,0,0,.3)'}}>
      {Array.from({length:7},(_,i)=><div key={i} style={{position:'absolute',left:35+i*25,top:40+(i%2)*18,width:30,height:18,borderRadius:'50%',background:i%2?'#9a805e':'#778366'}}/>) }
    </div>
  </SceneShell>;

const BoxHide:React.FC<P>=({p})=>{
  const x=interpolate(p,[0,.8,1],[650,1140,1170]);
  return <SceneShell p={p} tone="home">
    <div style={{position:'absolute',inset:0,background:'#262522'}}/>
    <div style={{position:'absolute',right:160,top:190,width:650,height:600,border:'2px solid #494744',background:'#1d1d1b'}}><div style={{position:'absolute',left:310,top:0,bottom:0,width:2,background:'#474542'}}/></div>
    <div style={{position:'absolute',left:x,top:500,transform:`scale(${.8})`}}><RiceBox p={p}/></div>
    <Person x={480} y={380} scale={1.0} coat="#343b40" lean={-phase(p,.2,.8)*6}/>
  </SceneShell>;
};

const RiceNotDecreasing:React.FC<P>=({p})=>{
  const cycle=p*4;
  return <SceneShell p={p} tone="city">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#20272b,#131618)'}}/>
    <div style={{position:'absolute',left:280,top:120,width:1360,height:760,border:'1px solid #475157',background:'#1a2023'}}>
      {['coffee','office','delivery','restaurant'].map((_,i)=>{
        const op=Math.max(0,1-Math.abs(cycle-i-.5)*1.5);const x=390+i*300;
        return <div key={i} style={{position:'absolute',left:x,top:250,width:180,height:250,opacity:op,transform:`translateY(${(1-op)*35}px)`}}>
          {i===0?<><div style={{position:'absolute',left:45,top:80,width:90,height:90,borderRadius:'50%',border:'10px solid #d0c7b4'}}/><div style={{position:'absolute',left:120,top:110,width:55,height:35,border:'10px solid #d0c7b4',borderLeft:0,borderRadius:'0 20px 20px 0'}}/></>:i===1?<div style={{position:'absolute',left:30,top:35,width:120,height:190,background:'#4b5c67',boxShadow:'0 0 40px rgba(142,173,190,.13)'}}/>:i===2?<div style={{position:'absolute',left:25,top:80,width:140,height:105,background:'#8b6a4b',borderRadius:10,boxShadow:'0 15px 25px rgba(0,0,0,.3)'}}/>:<><div style={{position:'absolute',left:10,top:125,width:160,height:8,background:'#9c907a'}}/><div style={{position:'absolute',left:25,top:80,width:130,height:20,borderRadius:'50%',background:'#c6b58c'}}/></>}
        </div>;
      })}
      <RiceSack x={85} y={390} scale={.75} label="30kg" p={.15}/>
    </div>
  </SceneShell>;
};

const PhoneCall:React.FC<P>=({p})=>{
  const pulse=1+Math.sin(p*Math.PI*10)*.018;
  return <SceneShell p={p} tone="home">
    <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 50%,#3a342d,#1d1a17 65%)'}}/>
    <div style={{position:'absolute',left:735,top:120,width:450,height:820,borderRadius:62,background:'#111517',border:'8px solid #5b6164',boxShadow:'0 35px 85px rgba(0,0,0,.5)',transform:`scale(${pulse})`}}>
      <div style={{position:'absolute',left:18,right:18,top:18,bottom:18,borderRadius:48,background:'linear-gradient(180deg,#20282c,#121719)'}}/>
      <div style={{position:'absolute',left:'50%',top:230,width:150,height:150,marginLeft:-75,borderRadius:'50%',background:'#807261',boxShadow:'0 0 0 18px rgba(255,255,255,.025)'}}/>
      <div style={{position:'absolute',left:'50%',bottom:150,width:80,height:80,marginLeft:-40,borderRadius:'50%',background:'#8c4b43',boxShadow:'0 0 20px rgba(140,75,67,.3)'}}/>
    </div>
  </SceneShell>;
};

const HometownRice:React.FC<P>=({p})=>{
  const f=useCurrentFrame();
  return <SceneShell p={p} tone="memory">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#4a4032,#28231c)'}}/>
    <div style={{position:'absolute',left:180,top:120,width:1560,height:760,background:'#3a3329',border:'2px solid #5b5041',boxShadow:'inset 0 -120px 160px rgba(0,0,0,.25)'}}>
      <div style={{position:'absolute',left:120,top:90,width:520,height:520,background:'#2d2922',border:'15px solid #594c3c'}}><div style={{position:'absolute',left:0,right:0,top:'50%',height:4,background:'#594c3c'}}/><div style={{position:'absolute',top:0,bottom:0,left:'50%',width:4,background:'#594c3c'}}/></div>
      {[0,1,2,3].map((i)=><RiceSack key={i} x={820+(i%2)*245} y={410-Math.floor(i/2)*75+Math.sin(f*.02+i)*4} scale={.72} p={p}/>) }
    </div>
  </SceneShell>;
};

const StudentSupermarket:React.FC<P>=({p})=>
  <SceneShell p={p} tone="memory">
    <div style={{position:'absolute',inset:0,background:'#39332c'}}/>
    <div style={{position:'absolute',left:160,top:150,width:1600,height:700,background:'#2e2b27',border:'1px solid #625a50'}}>
      <div style={{position:'absolute',left:80,right:80,top:420,height:8,background:'#786d60'}}/>
      {[0,1,2,3,4].map((i)=><div key={i} style={{position:'absolute',left:180+i*260,top:260,width:150,height:220,background:'linear-gradient(100deg,#d8d5c9,#f4f1e7,#b9b5aa)',borderRadius:24,boxShadow:'0 18px 30px rgba(0,0,0,.25)'}}><div style={{position:'absolute',left:20,right:20,top:85,textAlign:'center',color:'#44413b',fontSize:22,fontWeight:700}}>5kg</div><div style={{position:'absolute',left:25,right:25,bottom:-70,height:50,background:'#efe9da',color:'#333',fontSize:24,textAlign:'center',paddingTop:9}}>¥1,980</div></div>)}
      <Person x={80} y={350} scale={.85} coat="#38424a"/>
    </div>
  </SceneShell>;

const TakadanobabaRoom:React.FC<P>=({p})=>{
  const steam=phase(p,.2,1);
  return <SceneShell p={p} tone="memory">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(145deg,#3c3429,#211d18)'}}/>
    <div style={{position:'absolute',left:230,top:140,width:1450,height:730,background:'#332e26',border:'1px solid #5c5141'}}>
      <div style={{position:'absolute',left:100,bottom:100,width:520,height:230,background:'#756d5d',borderRadius:9}}/>
      <div style={{position:'absolute',right:260,bottom:130,width:270,height:160,background:'#ddd8cd',borderRadius:'42% 42% 20% 20%',boxShadow:'0 20px 40px rgba(0,0,0,.25)'}}><div style={{position:'absolute',left:35,right:35,top:38,height:42,borderRadius:'50%',background:'#999990'}}/><div style={{position:'absolute',left:65,bottom:27,width:140,height:10,background:'#7d817a'}}/></div>
      {Array.from({length:8},(_,i)=>{const x=1320+Math.sin(i*1.3)*70+Math.sin(p*8+i)*8;const y=400-i*48-steam*110;return <div key={i} style={{position:'absolute',left:x,top:y,width:28+i*4,height:80,borderRadius:'50%',border:'3px solid rgba(240,235,220,.18)',borderLeftColor:'transparent',borderBottomColor:'transparent',transform:`rotate(${i%2?14:-12}deg)`,opacity:steam*.75}}/>})}
    </div>
  </SceneShell>;
};

const JobCall:React.FC<P>=({p})=>{
  const split=phase(p,.38,.62);
  return <SceneShell p={p} tone="memory">
    <div style={{position:'absolute',inset:0,background:'#2e2923'}}/>
    <div style={{position:'absolute',left:0,top:0,bottom:0,width:960,background:'linear-gradient(130deg,#41382d,#242019)',transform:`translateX(${-split*18}px)`}}><Person x={520} y={400} scale={1.0} coat="#37414a"/><div style={{position:'absolute',left:645,top:400,width:18,height:160,background:'#16191b',borderRadius:10}}/></div>
    <div style={{position:'absolute',right:0,top:0,bottom:0,width:960,background:'linear-gradient(210deg,#4c4030,#29231b)',transform:`translateX(${split*18}px)`}}><Person x={280} y={405} scale={.95} coat="#6a5b4d"/><div style={{position:'absolute',left:225,top:410,width:18,height:160,background:'#16191b',borderRadius:10}}/></div>
    <div style={{position:'absolute',left:'50%',top:120,bottom:120,width:1,background:'#9b8a73',opacity:.35}}/>
  </SceneShell>;
};

const AddressJourney:React.FC<P>=({p})=>{
  const stations=[{x:250,y:720},{x:620,y:560},{x:1020,y:420},{x:1500,y:270}];
  return <SceneShell p={p} tone="city">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#172027,#101418)'}}/>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080">
      <path d="M180 790 C500 720 470 600 720 555 S980 510 1090 410 S1380 360 1560 220" fill="none" stroke="#596b75" strokeWidth="8" opacity=".5"/>
      <path d="M180 790 C500 720 470 600 720 555 S980 510 1090 410 S1380 360 1560 220" pathLength="1" fill="none" stroke="#d0bd91" strokeWidth="7" strokeDasharray={`${Math.max(.001,p)} 1`} opacity=".85"/>
    </svg>
    {stations.map((s,i)=><div key={i} style={{position:'absolute',left:s.x-14,top:s.y-14,width:28,height:28,borderRadius:'50%',background:i/3<=p?'#d5c399':'#41505a',boxShadow:i/3<=p?'0 0 26px rgba(213,195,153,.45)':'none'}}/>)}
    <div style={{position:'absolute',left:80,bottom:90}}><RiceBox p={p} small/></div>
  </SceneShell>;
};

const NewRice:React.FC<P>=({p})=>
  <SceneShell p={p} tone="home">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(150deg,#2e2923,#171513)'}}/>
    <div style={{position:'absolute',left:440,top:160,width:1040,height:720,background:'#24211d',border:'1px solid #51483e'}}>
      <RiceSack x={110} y={300} scale={.9} label="新米" p={p}/><RiceSack x={395} y={300} scale={.9} label="新米" p={p}/><RiceSack x={680} y={300} scale={.9} label="新米" p={p}/>
      <div style={{position:'absolute',left:550,top:520,width:280,fontFamily:'serif',fontSize:24,color:'#5a554d',transform:'rotate(-4deg)',textAlign:'center'}}>今年はよくできました</div>
    </div>
  </SceneShell>;

const Storage:React.FC<P>=({p})=>{
  const a=phase(p,.02,.35),b=phase(p,.28,.62);
  return <SceneShell p={p} tone="home">
    <div style={{position:'absolute',inset:0,background:'#292622'}}/>
    <div style={{position:'absolute',left:250,top:120,width:560,height:800,border:'2px solid #4f4942',background:'#1d1c19'}}>
      <RiceSack x={120} y={430-interpolate(a,[0,1],[0,170])} scale={.8} p={a}/>
    </div>
    <div style={{position:'absolute',left:1040,top:150,width:620,height:730,border:'2px solid #4f4942',background:'#1b1a18'}}><RiceSack x={160} y={440-interpolate(b,[0,1],[0,145])} scale={.8} p={b}/></div>
    <RiceSack x={825} y={570} scale={.82} label="10kg" p={p}/>
  </SceneShell>;
};

const LingeringBag:React.FC<P>=({p})=>{
  const light=interpolate(p,[0,.48,.52,1],[.35,.05,.58,.72]);
  return <SceneShell p={p} tone="home">
    <div style={{position:'absolute',inset:0,background:`linear-gradient(120deg,rgba(215,188,139,${light*.12}),#211f1c 60%)`}}/>
    <div style={{position:'absolute',left:300,top:130,width:1350,height:730,background:'#292724',border:'1px solid #4b4741'}}>
      <div style={{position:'absolute',right:160,top:120,width:420,height:450,background:'#20211f',boxShadow:'inset 0 0 60px rgba(0,0,0,.25)'}}/>
      <RiceSack x={560} y={430} scale={.9} p={p}/>
      <div style={{position:'absolute',left:0,top:0,right:0,height:250,background:`linear-gradient(180deg,rgba(238,211,161,${light*.14}),transparent)`}}/>
    </div>
  </SceneShell>;
};

const TrashBag:React.FC<P>=({p})=>{
  const sink=interpolate(phase(p,.12,.75),[0,1],[0,70]);
  return <SceneShell p={p} tone="home">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(130deg,#342f28,#1d1a17)'}}/>
    <div style={{position:'absolute',left:680,top:260,width:560,height:650,background:'linear-gradient(120deg,rgba(25,28,29,.88),rgba(5,7,7,.95))',clipPath:'polygon(15% 0,85% 0,100% 100%,0 100%)',filter:'drop-shadow(0 30px 45px rgba(0,0,0,.45))',transform:`translateY(${sink}px)`}}/>
    {Array.from({length:16},(_,i)=>{const t=phase(p,.42+.015*i,.8+.008*i);const x=710+hash(i)*520;const y=250+t*(560+hash(i+2)*170);return <div key={i} style={{position:'absolute',left:x,top:y,width:10,height:22,borderRadius:'50%',background:'#f4f0dd',boxShadow:'0 0 10px rgba(255,235,188,.25)',transform:`rotate(${hash(i+4)*180}deg)`,opacity:t<1?.95:.55}}/>})}
  </SceneShell>;
};

const ElevatorDog:React.FC<P>=({p})=>{
  const door=phase(p,.05,.55);
  const sniff=Math.sin(p*Math.PI*8)*8;
  return <SceneShell p={p} tone="city">
    <div style={{position:'absolute',inset:0,background:'#252a2d'}}/>
    <div style={{position:'absolute',left:260,top:80,width:1400,height:900,background:'linear-gradient(90deg,#4a5053,#2f3437 48%,#4d5356)',border:'6px solid #62696c'}}>
      <div style={{position:'absolute',left:'50%',top:0,bottom:0,width:3,background:'#707679'}}/>
      <div style={{position:'absolute',left:0,top:0,bottom:0,width:700,background:'#3a4043',transform:`translateX(${-door*620}px)`}}/><div style={{position:'absolute',right:0,top:0,bottom:0,width:700,background:'#3a4043',transform:`translateX(${door*620}px)`}}/>
      <Person x={260} y={430} scale={.85} coat="#6f746e"/><Person x={410} y={430} scale={.85} coat="#4e5961"/>
      <div style={{position:'absolute',left:500+sniff,top:700,width:120,height:72,borderRadius:'50%',background:'#f0eee7',boxShadow:'0 12px 20px rgba(0,0,0,.25)'}}><div style={{position:'absolute',right:-22,top:17,width:45,height:38,borderRadius:'50%',background:'#f0eee7'}}/><div style={{position:'absolute',right:-28,top:26,width:7,height:7,borderRadius:'50%',background:'#1d1d1d'}}/><div style={{position:'absolute',left:48,top:70,width:56,height:4,background:'#b5b8bb',transform:'rotate(12deg)'}}/></div>
      <div style={{position:'absolute',right:190,top:560,width:250,height:360,background:'rgba(8,10,11,.88)',clipPath:'polygon(14% 0,86% 0,100% 100%,0 100%)'}}/>
    </div>
  </SceneShell>;
};

const GarbageRoom:React.FC<P>=({p})=>{
  const drop=phase(p,.25,.78);
  return <SceneShell p={p} tone="city">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#2a3439,#161c1f)'}}/>
    <div style={{position:'absolute',left:120,top:90,width:1680,height:860,background:'#222a2e',border:'1px solid #465258'}}>
      {Array.from({length:5},(_,i)=><div key={i} style={{position:'absolute',left:90+i*300,top:500,width:240,height:250,background:['#4a5960','#59646a','#6f6455','#3e4b50','#4f5659'][i],borderRadius:10,boxShadow:'0 18px 35px rgba(0,0,0,.32)'}}><div style={{position:'absolute',left:20,right:20,top:35,height:4,background:'rgba(255,255,255,.22)'}}/></div>)}
      <div style={{position:'absolute',left:890,top:260+drop*250,width:300,height:390,background:'rgba(7,9,10,.92)',clipPath:'polygon(15% 0,85% 0,100% 100%,0 100%)',filter:'drop-shadow(0 25px 35px rgba(0,0,0,.4))'}}/>
      <div style={{position:'absolute',left:0,right:0,top:0,height:90,background:'linear-gradient(180deg,rgba(170,210,225,.08),transparent)'}}/>
    </div>
  </SceneShell>;
};

const RiceShelf:React.FC<P>=({p})=>{
  const select=phase(p,.35,.85);
  return <SceneShell p={p} tone="store">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#30373a,#191d1f)'}}/>
    <div style={{position:'absolute',left:170,top:160,width:1580,height:690,background:'#262c2f',border:'1px solid #545d61'}}>
      {[0,1,2].map(row=><div key={row} style={{position:'absolute',left:60,right:60,top:195+row*180,height:7,background:'#6b7477'}}/>) }
      {Array.from({length:14},(_,i)=><div key={i} style={{position:'absolute',left:100+(i%7)*205,top:75+Math.floor(i/7)*180,width:130,height:170,borderRadius:18,background:i===10?'linear-gradient(100deg,#e9e7df,#fefdf8,#ccc9c0)':'linear-gradient(100deg,#b9b6ad,#dad7ce,#a9a59c)',boxShadow:'0 13px 25px rgba(0,0,0,.26)',transform:i===10?`translateY(${-select*34}px) scale(${1+select*.16})`:'none',zIndex:i===10?4:1}}>{i===10&&<><div style={{position:'absolute',left:15,right:15,top:48,textAlign:'center',color:'#202326',fontSize:15,fontWeight:800,letterSpacing:2}}>新潟県産<br/>コシヒカリ</div><div style={{position:'absolute',left:0,right:0,bottom:18,textAlign:'center',color:'#222',fontSize:16}}>2kg</div></>}</div>)}
      <div style={{position:'absolute',left:1050,top:470,width:150,height:50,background:'#eee9db',color:'#222',fontWeight:800,fontSize:24,textAlign:'center',paddingTop:9,transform:`scale(${1+select*.08})`}}>¥1,980</div>
    </div>
  </SceneShell>;
};

const Checkout:React.FC<P>=({p})=>{
  const scan=phase(p,.25,.62); const beep=phase(p,.56,.68)*(1-phase(p,.75,.9));
  return <SceneShell p={p} tone="store">
    <div style={{position:'absolute',inset:0,background:'#252b2e'}}/>
    <div style={{position:'absolute',left:120,top:610,width:1680,height:210,background:'linear-gradient(#4a5052,#2d3234)',transform:'perspective(800px) rotateX(5deg)',boxShadow:'0 25px 45px rgba(0,0,0,.4)'}}/>
    <div style={{position:'absolute',left:360+scan*620,top:520,width:190,height:240,borderRadius:22,background:'linear-gradient(100deg,#e9e7df,#fffef9,#cbc8bd)',boxShadow:'0 18px 35px rgba(0,0,0,.3)'}}><div style={{position:'absolute',left:20,right:20,top:75,textAlign:'center',color:'#222',fontSize:20,fontWeight:800}}>新潟県産<br/>コシヒカリ</div></div>
    <div style={{position:'absolute',right:310,top:330,width:260,height:190,background:'#171c1f',border:'6px solid #596266'}}><div style={{position:'absolute',inset:20,background:'#232d31',boxShadow:`0 0 ${40*beep}px rgba(150,215,190,${beep*.5})`}}/></div>
    <div style={{position:'absolute',left:890,top:480,width:4,height:280,background:`rgba(210,70,60,${.15+.85*beep})`,boxShadow:`0 0 18px rgba(255,80,70,${beep})`}}/>
  </SceneShell>;
};

const JarFill:React.FC<P>=({p})=>{
  const fill=phase(p,.12,.88);
  return <SceneShell p={p} tone="home">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,#322e28,#191715)'}}/>
    <div style={{position:'absolute',left:560,top:180,width:800,height:700,background:'#23211e',border:'1px solid #4c4842'}}>
      <div style={{position:'absolute',left:245,top:130,width:310,height:470,borderRadius:'34px 34px 22px 22px',border:'8px solid rgba(206,221,221,.48)',background:'linear-gradient(90deg,rgba(210,230,230,.06),rgba(255,255,255,.12),rgba(130,150,150,.05))',overflow:'hidden',boxShadow:'inset 18px 0 35px rgba(255,255,255,.05),0 28px 42px rgba(0,0,0,.3)'}}>
        <div style={{position:'absolute',left:7,right:7,bottom:7,height:`${fill*78}%`,background:'linear-gradient(180deg,#f5f1df,#ddd7c1)',borderRadius:'0 0 14px 14px'}}/>
        {Array.from({length:80},(_,i)=>{const base=hash(i);const y=1-((fill*1.25+base)%1);return <div key={i} style={{position:'absolute',left:`${10+hash(i+22)*80}%`,top:`${10+y*84}%`,width:6,height:15,borderRadius:'50%',background:'#faf5df',opacity:fill>.05?.72:0,transform:`rotate(${hash(i+9)*160}deg)`}}/>})}
      </div>
      <div style={{position:'absolute',left:480,top:10,width:160,height:270,background:'linear-gradient(100deg,#e8e5dc,#fffdf8,#cbc8bf)',borderRadius:20,transform:`rotate(${interpolate(fill,[0,1],[-48,-68])}deg) translateY(${fill*20}px)`,transformOrigin:'50% 100%',boxShadow:'0 18px 30px rgba(0,0,0,.25)'}}/>
    </div>
  </SceneShell>;
};

const LineChat:React.FC<P>=({p})=>{
  const msgs=[{t:'お米ついた？',side:'l'},{t:'ついたよ',side:'r'},{t:'今年の美味しい？',side:'l'},{t:'美味しいよ',side:'r'},{t:'😸',side:'l'}];
  return <SceneShell p={p} tone="home">
    <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 45%,#3a423f,#1d2220 70%)'}}/>
    <div style={{position:'absolute',left:660,top:95,width:600,height:890,borderRadius:55,background:'#101416',border:'8px solid #565c5f',boxShadow:'0 35px 80px rgba(0,0,0,.5)',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:18,borderRadius:40,background:'#cad7ca'}}>
        {msgs.map((m,i)=>{const show=phase(p,i*.16,.18+i*.16);return <div key={i} style={{position:'absolute',top:130+i*130,left:m.side==='l'?45:210,right:m.side==='r'?45:210,minHeight:70,borderRadius:24,background:m.side==='l'?'#f7f6f1':'#87d76e',color:'#222',fontSize:m.t==='😸'?48:24,padding:'18px 24px',opacity:show,transform:`translateY(${(1-show)*20}px)`,boxShadow:'0 5px 10px rgba(0,0,0,.08)'}}>{m.t}</div>})}
      </div>
    </div>
  </SceneShell>;
};

const SilentEntry:React.FC<P>=({p})=>{
  const months=Math.min(3,Math.floor(p*3.2)+1);
  return <SceneShell p={p} tone="home">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(130deg,#282521,#171513)'}}/>
    <div style={{position:'absolute',left:270,top:120,width:620,height:790,background:'#22211e',border:'2px solid #4b4741'}}/>
    <div style={{position:'absolute',right:240,top:190,width:600,height:520,background:'#2b2b28',border:'1px solid #4a4944'}}/>
    {Array.from({length:months},(_,i)=><div key={i} style={{position:'absolute',right:350+i*120,top:770-i*25,width:80,height:4,background:'#a99b82',opacity:.18}}/>)}
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:240,background:'linear-gradient(transparent,rgba(0,0,0,.3))'}}/>
  </SceneShell>;
};

const FatherCall:React.FC<P>=({p})=>
  <SceneShell p={p} tone="memory">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(110deg,#393126,#1c1814)'}}/>
    <Person x={840} y={360} scale={1.15} coat="#51483d" lean={phase(p,.45,.8)*7}/>
    <div style={{position:'absolute',left:1010,top:510,width:120,height:200,borderRadius:'50%',border:'8px solid rgba(185,130,100,.35)',borderLeftColor:'transparent',transform:`rotate(${20+phase(p,.4,.9)*20}deg)`}}/>
    <div style={{position:'absolute',left:390,top:430,width:390,height:300,background:'#2c2822',border:'1px solid #594e40'}}/>
  </SceneShell>;

const FatherCarry:React.FC<P>=({p})=>{
  const walk=interpolate(p,[0,1],[-120,430]);
  return <SceneShell p={p} tone="memory">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#463b2e,#242019)'}}/>
    <div style={{position:'absolute',left:120,top:170,width:680,height:630,background:'#302a22',border:'1px solid #5b4d3c'}}/>
    <div style={{position:'absolute',right:160,bottom:180,width:600,height:260,background:'#20282d',borderRadius:'90px 80px 40px 40px',boxShadow:'0 28px 50px rgba(0,0,0,.35)'}}><div style={{position:'absolute',left:90,bottom:-35,width:110,height:110,borderRadius:'50%',background:'#111619',border:'14px solid #333b3f'}}/><div style={{position:'absolute',right:90,bottom:-35,width:110,height:110,borderRadius:'50%',background:'#111619',border:'14px solid #333b3f'}}/></div>
    <div style={{position:'absolute',left:450+walk,top:430}}><Person x={0} y={0} scale={.95} coat="#4e463b" lean={5}/><div style={{position:'absolute',left:70,top:75,transform:'scale(.57) rotate(-3deg)',transformOrigin:'0 0'}}><RiceBox p={p}/></div></div>
  </SceneShell>;
};

const NightStorefront:React.FC<P>=({p})=>{
  const refl=interpolate(p,[0,1],[-120,160]);
  return <SceneShell p={p} tone="city">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#11171c,#182027)'}}/>
    <div style={{position:'absolute',left:170,top:150,width:1580,height:690,background:'rgba(65,76,81,.18)',border:'2px solid #637077',boxShadow:'inset 0 0 90px rgba(170,200,210,.05)'}}>
      {Array.from({length:35},(_,i)=><div key={i} style={{position:'absolute',left:70+(i%7)*205,top:85+Math.floor(i/7)*105,width:120,height:58,background:['#b7aa8f','#87989c','#7d876f','#a27864'][i%4],opacity:.55}}/>) }
      <div style={{position:'absolute',left:refl,top:-100,width:360,height:1000,background:'linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent)',transform:'rotate(12deg)'}}/>
    </div>
  </SceneShell>;
};

const PriceRise:React.FC<P>=({p})=>{
  const pulse=1+Math.sin(phase(p,.25,.9)*Math.PI)*.07;
  return <SceneShell p={p} tone="store">
    <div style={{position:'absolute',inset:0,background:'#252b2e'}}/>
    <div style={{position:'absolute',left:720,top:210,width:480,height:600,borderRadius:26,background:'linear-gradient(100deg,#ebe9e1,#fffef9,#ccc9c0)',boxShadow:'0 28px 60px rgba(0,0,0,.4)',transform:`scale(${pulse})`}}><div style={{position:'absolute',left:40,right:40,top:150,textAlign:'center',color:'#202326',fontSize:38,fontWeight:800,letterSpacing:4}}>新潟県産<br/>コシヒカリ</div><div style={{position:'absolute',left:0,right:0,bottom:80,textAlign:'center',color:'#222',fontSize:28}}>2kg</div></div>
    <div style={{position:'absolute',left:830,top:840,width:260,height:75,background:'#efe9da',color:'#222',fontWeight:900,fontSize:36,textAlign:'center',paddingTop:12,transform:`scale(${pulse})`}}>¥2,180</div>
  </SceneShell>;
};

const HirooNight:React.FC<P>=({p})=>{
  const f=useCurrentFrame();
  const pan=interpolate(p,[0,1],[0,-260]);
  return <SceneShell p={p} tone="city">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#10171d,#18222a 60%,#11161a)'}}/>
    <div style={{position:'absolute',left:0,top:80,width:2200,height:540,transform:`translateX(${pan}px)`}}><WindowLights count={150}/></div>
    <div style={{position:'absolute',left:-100,bottom:0,width:2200,height:370,background:'linear-gradient(#242a2e,#14181b)',transform:`translateX(${pan*.2}px)`}}>
      <div style={{position:'absolute',left:260,bottom:100,width:440,height:120,background:'#0e1317',borderRadius:'65px 100px 24px 24px',transform:`translateX(${Math.sin(f*.015)*15}px)`}}/><Person x={910} y={90} scale={.7} coat="#766d62"/><div style={{position:'absolute',left:1040,top:235,width:160,height:90,borderRadius:'50%',background:'#3d332b'}}/><Person x={1400} y={95} scale={.72} coat="#4a555b"/>
      <div style={{position:'absolute',left:1540,top:230,width:130,height:85,border:'4px solid #677178',borderRadius:'50% 50% 20% 20%',background:'#252c30'}}/>
    </div>
    <div style={{position:'absolute',right:110,top:170,width:300,height:130,background:'radial-gradient(circle,rgba(220,180,115,.18),transparent 65%)',filter:'blur(8px)',transform:`scale(${1+.08*Math.sin(f*.02)})`}}/>
  </SceneShell>;
};

const OverflowMemory:React.FC<P>=({p})=>{
  const spill=phase(p,.15,.9);
  return <SceneShell p={p} tone="home">
    <div style={{position:'absolute',inset:0,background:'#282521'}}/>
    <div style={{position:'absolute',left:520,top:160,width:900,height:720,background:'#1f1e1b',border:'2px solid #4b4842',overflow:'visible'}}>
      <div style={{position:'absolute',left:80,right:80,top:420,height:6,background:'#5f5b54'}}/>
      <RiceSack x={220} y={330} scale={.88} p={p}/><RiceSack x={470} y={330} scale={.88} p={p}/>
      <div style={{position:'absolute',left:680,top:350,transform:`translateX(${spill*250}px) rotate(${spill*7}deg)`}}><RiceSack x={0} y={0} scale={.88} p={p}/></div>
      {Array.from({length:26},(_,i)=>{const t=phase(p,.42+hash(i)*.15,.8+hash(i)*.15);return <div key={i} style={{position:'absolute',left:780+hash(i)*430*t,top:600+hash(i+3)*170*t,width:7,height:17,borderRadius:'50%',background:'#f0ecd9',opacity:t*.65,transform:`rotate(${hash(i+5)*180}deg)`}}/>})}
    </div>
  </SceneShell>;
};

const CleanShelf:React.FC<P>=({p})=>{
  const close=phase(p,.36,.88);
  return <SceneShell p={p} tone="home">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(130deg,#312d27,#181614)'}}/>
    <div style={{position:'absolute',left:540,top:120,width:840,height:800,background:'#22211e',border:'2px solid #514d47'}}>
      <div style={{position:'absolute',left:110,top:220,width:300,height:420,borderRadius:30,border:'7px solid rgba(210,222,220,.42)',background:'linear-gradient(90deg,rgba(255,255,255,.06),rgba(255,255,255,.13),rgba(255,255,255,.03))'}}><div style={{position:'absolute',left:8,right:8,bottom:8,height:'62%',background:'#e8e3d1',borderRadius:'0 0 18px 18px'}}/></div>
      <div style={{position:'absolute',right:0,top:0,bottom:0,width:'50%',background:'#34322d',borderLeft:'2px solid #5c5850',transform:`perspective(1100px) rotateY(${-close*87}deg)`,transformOrigin:'100% 50%',boxShadow:'-20px 0 35px rgba(0,0,0,.22)'}}/>
      <div style={{position:'absolute',left:0,top:0,bottom:0,width:'50%',background:'#35332e',borderRight:'2px solid #5c5850',transform:`perspective(1100px) rotateY(${close*87}deg)`,transformOrigin:'0% 50%',boxShadow:'20px 0 35px rgba(0,0,0,.22)'}}/>
    </div>
  </SceneShell>;
};

const RiceCooker:React.FC<P>=({p})=>{
  const f=useCurrentFrame(); const steam=phase(p,.25,1);
  return <SceneShell p={p} tone="home">
    <div style={{position:'absolute',inset:0,background:'linear-gradient(130deg,#302b25,#171513)'}}/>
    <div style={{position:'absolute',left:250,top:680,width:1420,height:130,background:'#35312b',boxShadow:'0 -10px 30px rgba(0,0,0,.25)'}}/>
    <div style={{position:'absolute',left:760,top:455,width:400,height:300,background:'linear-gradient(120deg,#e2dfd7,#b8b7b3)',borderRadius:'46% 46% 18% 18%',boxShadow:'0 28px 50px rgba(0,0,0,.35)'}}><div style={{position:'absolute',left:65,right:65,top:62,height:76,borderRadius:'50%',background:'#868783'}}/><div style={{position:'absolute',left:115,bottom:48,width:170,height:14,background:'#6f746f',borderRadius:7}}/><div style={{position:'absolute',left:183,bottom:75,width:34,height:16,borderRadius:3,background:'#89a26f',boxShadow:'0 0 18px rgba(150,190,105,.4)'}}/></div>
    {Array.from({length:9},(_,i)=>{const x=930+Math.sin(i*1.5+f*.012)*90;const y=450-i*50-steam*150;return <div key={i} style={{position:'absolute',left:x,top:y,width:45+i*7,height:120,borderRadius:'50%',border:'4px solid rgba(238,232,215,.13)',borderLeftColor:'transparent',borderBottomColor:'transparent',transform:`rotate(${Math.sin(i)*22}deg)`,opacity:steam*(.35+i*.035)}}/>})}
  </SceneShell>;
};

const FinalMemory:React.FC<P>=({p})=>{
  const dissolve=phase(p,.18,.92);
  return <SceneShell p={p} tone="memory">
    <div style={{position:'absolute',inset:0,background:`linear-gradient(145deg,rgba(55,48,38,${dissolve}),#1c1915)`}}/>
    <div style={{position:'absolute',left:245,top:150,width:1430,height:720,background:'#312b24',border:'1px solid #584d3e',opacity:dissolve}}>
      <div style={{position:'absolute',left:120,bottom:100,width:500,height:220,background:'#6a6254',borderRadius:8}}/>
      <div style={{position:'absolute',right:250,bottom:125,width:280,height:170,background:'#d7d3c9',borderRadius:'44% 44% 20% 20%'}}/>
      <div style={{position:'absolute',left:800,top:100,width:8,height:470,background:'linear-gradient(transparent,rgba(240,229,205,.16),transparent)',filter:'blur(4px)',transform:`rotate(${8+dissolve*5}deg) scaleX(${1+dissolve})`}}/>
    </div>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 70% 55%,rgba(226,204,166,.12),transparent 45%)',opacity:dissolve}}/>
  </SceneShell>;
};

export const Visual:React.FC<{beat:Beat;p:number}>=({beat,p})=>{
  switch(beat.scene){
    case 'rice_delivery': return <RiceDelivery p={p}/>;
    case 'kinship': return <Kinship p={p}/>;
    case 'rice_stack': return <RiceStack p={p}/>;
    case 'hiroo_apartment': return <HirooApartment p={p}/>;
    case 'hiroo_map': return <HirooMap p={p}/>;
    case 'consulting': return <Consulting p={p}/>;
    case 'gossip_chain': return <GossipChain p={p}/>;
    case 'tokyo_machine': return <TokyoMachine p={p}/>;
    case 'milk_compare': return <MilkCompare p={p}/>;
    case 'national_azabu': return <NationalAzabu p={p}/>;
    case 'luxury_shelf': return <LuxuryShelf p={p}/>;
    case 'box_arrival': return <BoxArrival p={p}/>;
    case 'courier_memory': return <CourierMemory p={p}/>;
    case 'interior_contrast': return <InteriorContrast p={p}/>;
    case 'wife_background': return <WifeBackground p={p}/>;
    case 'box_hide': return <BoxHide p={p}/>;
    case 'rice_not_decreasing': return <RiceNotDecreasing p={p}/>;
    case 'phone_call': return <PhoneCall p={p}/>;
    case 'hometown_rice': return <HometownRice p={p}/>;
    case 'student_supermarket': return <StudentSupermarket p={p}/>;
    case 'takadanobaba_room': return <TakadanobabaRoom p={p}/>;
    case 'job_call': return <JobCall p={p}/>;
    case 'address_journey': return <AddressJourney p={p}/>;
    case 'new_rice': return <NewRice p={p}/>;
    case 'storage': return <Storage p={p}/>;
    case 'lingering_bag': return <LingeringBag p={p}/>;
    case 'trash_bag': return <TrashBag p={p}/>;
    case 'elevator_dog': return <ElevatorDog p={p}/>;
    case 'garbage_room': return <GarbageRoom p={p}/>;
    case 'rice_shelf': return <RiceShelf p={p}/>;
    case 'checkout': return <Checkout p={p}/>;
    case 'jar_fill': return <JarFill p={p}/>;
    case 'line_chat': return <LineChat p={p}/>;
    case 'silent_entry': return <SilentEntry p={p}/>;
    case 'father_call': return <FatherCall p={p}/>;
    case 'father_carry': return <FatherCarry p={p}/>;
    case 'night_storefront': return <NightStorefront p={p}/>;
    case 'price_rise': return <PriceRise p={p}/>;
    case 'hiroo_night': return <HirooNight p={p}/>;
    case 'overflow_memory': return <OverflowMemory p={p}/>;
    case 'clean_shelf': return <CleanShelf p={p}/>;
    case 'rice_cooker': return <RiceCooker p={p}/>;
    case 'final_memory': return <FinalMemory p={p}/>;
    default:return <RiceDelivery p={p}/>;
  }
};

const captionSegments=(text:string)=>{
  const raw=text.match(/[^。！？]+[。！？]?/g)??[text];
  const out:string[]=[];
  for(const s of raw){
    if(s.length<=29){out.push(s);continue;}
    for(let i=0;i<s.length;i+=27)out.push(s.slice(i,i+27));
  }
  return out.length?out:[text];
};

export const CaptionLayer:React.FC<{beat:Beat;p:number}>=({beat,p})=>{
  const segs=captionSegments(beat.narration);
  const n=Math.min(segs.length-1,Math.floor(p*segs.length));
  const local=(p*segs.length)-n;
  const opacity=clamp(interpolate(local,[0,.08,.88,1],[0,1,1,0]));
  return <div style={{position:'absolute',left:180,right:180,bottom:42,display:'flex',justifyContent:'center',pointerEvents:'none'}}>
    <div style={{maxWidth:1180,color:'#f4f1e9',fontFamily:FONT,fontSize:26,lineHeight:1.62,fontWeight:500,letterSpacing:'.045em',textAlign:'center',textShadow:'0 2px 4px rgba(0,0,0,.95),0 0 12px rgba(0,0,0,.9)',opacity,transform:`translateY(${(1-opacity)*8}px)`}}>{segs[n]}</div>
  </div>;
};
