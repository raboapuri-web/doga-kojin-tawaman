import React from 'react';
import {AbsoluteFill,interpolate} from 'remotion';

const C={bg:'#07090d',night:'#0b1020',paper:'#eee7da',muted:'#9da7b5',gold:'#d8ad66',red:'#d45d58',blue:'#6f9fbd',teal:'#6fa89a',violet:'#8d78aa',warm:'#b98462',glass:'rgba(19,26,38,.74)'};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const lerp=(p:number,a:number,b:number)=>interpolate(p,[0,1],[a,b],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const ease=(p:number)=>1-Math.pow(1-clamp(p),3);

const Grain=()=> <AbsoluteFill style={{opacity:.045,backgroundImage:'radial-gradient(circle,rgba(255,255,255,.75) 0 1px,transparent 1.3px)',backgroundSize:'23px 23px',mixBlendMode:'soft-light'}}/>;
const Glow=()=> <AbsoluteFill style={{background:'radial-gradient(circle at 67% 38%,rgba(214,70,50,.09),transparent 26%),radial-gradient(circle at 30% 25%,rgba(76,112,155,.08),transparent 32%)'}}/>;

const TokyoTower=({x=1320,y=220,s=1,opacity=1}:{x?:number;y?:number;s?:number;opacity?:number})=>
  <svg width="260" height="690" viewBox="0 0 260 690" style={{position:'absolute',left:x,top:y,transform:`scale(${s})`,transformOrigin:'50% 100%',opacity,filter:'drop-shadow(0 0 22px rgba(221,80,53,.28))'}}>
    <path d="M130 15 L165 160 L145 160 L180 310 L155 310 L224 650 L36 650 L105 310 L80 310 L115 160 L95 160 Z" fill="none" stroke="#d65b46" strokeWidth="12"/>
    <path d="M60 545 H200 M77 460 H183 M94 375 H166 M107 290 H153 M115 205 H145 M45 650 H215" stroke="#e6c8a9" strokeWidth="8"/>
    <path d="M80 650 L180 310 M180 650 L80 310" stroke="#b94338" strokeWidth="7" opacity=".8"/>
    <circle cx="130" cy="18" r="9" fill="#f3ddd1"/>
  </svg>;

const Skyline=({p=0,low=false}:{p?:number;low?:boolean})=>{
  const blocks=Array.from({length:16},(_,i)=>({x:i*135-80,w:92+(i%4)*24,h:(low?130:210)+(i%5)*52}));
  return <div style={{position:'absolute',inset:0,overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,background:low?'linear-gradient(180deg,#172033,#4b5361 58%,#14181d 59%)':'linear-gradient(180deg,#090e1b,#151b28 60%,#07090d 61%)'}}/>
    <div style={{position:'absolute',left:-80+lerp(p,0,-35),right:-80,bottom:205,height:500}}>
      {blocks.map((b,i)=><div key={i} style={{position:'absolute',left:b.x,bottom:0,width:b.w,height:b.h,background:i%3===0?'#17212d':'#101720',boxShadow:'inset 0 0 0 1px rgba(255,255,255,.035)'}}>
        {Array.from({length:Math.floor(b.h/38)}).map((_,j)=><div key={j} style={{position:'absolute',left:15+(j%3)*23,top:18+j*33,width:9,height:15,background:(i+j)%4===0?'rgba(235,194,123,.6)':'rgba(112,143,172,.12)'}}/>)}
      </div>)}
    </div>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:210,background:low?'#262b2d':'#080a0d'}}/>
  </div>;
};

const Person=({x,y,s=1,coat=false,side=false}:{x:number;y:number;s?:number;coat?:boolean;side?:boolean})=>
  <div style={{position:'absolute',left:x,top:y,transform:`scale(${s})`,transformOrigin:'50% 100%',filter:'drop-shadow(0 12px 18px rgba(0,0,0,.35))'}}>
    <div style={{position:'absolute',left:-31,top:-188,width:62,height:62,borderRadius:'48% 48% 45% 45%',background:'#c49b82'}}/>
    <div style={{position:'absolute',left:-40,top:-132,width:80,height:102,borderRadius:coat?'25px 25px 10px 10px':'18px',background:coat?'#252c37':'#313846'}}/>
    <div style={{position:'absolute',left:-31,top:-38,width:22,height:72,borderRadius:9,background:'#202632',transform:`rotate(${side?-6:2}deg)`}}/>
    <div style={{position:'absolute',left:9,top:-38,width:22,height:72,borderRadius:9,background:'#202632',transform:`rotate(${side?8:-2}deg)`}}/>
  </div>;

const ApartmentWindow=({p,floor=27,towerScale=.82,curtain=0,boxes=false}:{p:number;floor?:number;towerScale?:number;curtain?:number;boxes?:boolean})=>
  <AbsoluteFill style={{background:'linear-gradient(180deg,#17191c,#0a0b0e)'}}>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:255,background:'#17130f'}}/>
    <div style={{position:'absolute',left:120,top:96,width:1420,height:760,border:'14px solid #252a30',overflow:'hidden',background:'#090d18'}}>
      <Skyline p={p}/>
      <TokyoTower x={900+lerp(p,12,-10)} y={70} s={towerScale}/>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(100deg,rgba(255,255,255,.035),transparent 24%,transparent 75%,rgba(255,255,255,.025))'}}/>
      <div style={{position:'absolute',left:0,top:0,bottom:0,width:`${curtain*54}%`,background:'linear-gradient(90deg,#2b2928,#18191c)',boxShadow:'10px 0 30px rgba(0,0,0,.5)'}}/>
      <div style={{position:'absolute',right:0,top:0,bottom:0,width:`${curtain*54}%`,background:'linear-gradient(270deg,#2b2928,#18191c)',boxShadow:'-10px 0 30px rgba(0,0,0,.5)'}}/>
    </div>
    <div style={{position:'absolute',right:90,top:105,fontSize:34,color:'rgba(238,231,218,.55)',fontWeight:800,letterSpacing:4}}>FLOOR {floor}</div>
    {boxes&&<>{[0,1,2,3].map(i=><div key={i} style={{position:'absolute',left:220+i*155,bottom:170+(i%2)*45,width:125,height:95,border:'3px solid #765e43',background:'#705a41',transform:`translateY(${(1-ease(p))*120}px) rotate(${i%2?2:-2}deg)`}}/>)}</>}
    <Person x={950} y={858} s={1.25} coat/>
    <Grain/>
  </AbsoluteFill>;

const Phone=({x=1220,y=160,p=1,title,lines}:{x?:number;y?:number;p?:number;title:string;lines:string[]})=>
  <div style={{position:'absolute',left:x,top:y,width:405,height:700,border:'11px solid #22262d',borderRadius:52,background:'#0d1117',boxShadow:'0 25px 60px rgba(0,0,0,.48)',transform:`translateY(${(1-ease(p))*70}px) rotate(${lerp(ease(p),-5,0)}deg)`}}>
    <div style={{position:'absolute',left:22,right:22,top:28,bottom:28,borderRadius:35,background:'linear-gradient(180deg,#f0eee8,#d9d5cc)',padding:'42px 32px',boxSizing:'border-box',color:'#191b1f'}}>
      <div style={{fontSize:31,fontWeight:900,marginBottom:32}}>{title}</div>
      {lines.map((t,i)=><div key={i} style={{margin:'20px 0',fontSize:22,fontWeight:i===0?800:600,opacity:clamp(p*2-i*.14),transform:`translateX(${(1-clamp(p*2-i*.14))*26}px)`}}>{t}</div>)}
    </div>
  </div>;

const SceneTitle=({text,sub}:{text:string;sub?:string})=><div style={{position:'absolute',left:160,top:140,width:940}}>
  <div style={{fontSize:76,fontWeight:900,lineHeight:1.18,color:C.paper,letterSpacing:1,textShadow:'0 8px 28px #000',whiteSpace:'pre-line'}}>{text}</div>
  {sub&&<div style={{marginTop:24,fontSize:30,color:C.gold,fontWeight:700,letterSpacing:2}}>{sub}</div>}
</div>;

const IntroScene=({visual,p}:{visual:string;p:number})=>{
  if(visual==='arrival-tower') return <ApartmentWindow p={p} floor={27} towerScale={.82} boxes/>;
  if(visual==='apartment-27') return <ApartmentWindow p={p} floor={27} towerScale={.82} boxes/>;
  if(visual==='sns-newlife') return <AbsoluteFill><ApartmentWindow p={p} floor={27} towerScale={.82}/><Phone p={p} title="新生活。" lines={['♡  427','すげえ','完全に成功者じゃん','いい眺め！']}/></AbsoluteFill>;
  if(visual==='success-photo') return <AbsoluteFill style={{background:'#090b0f'}}><div style={{position:'absolute',left:410,top:100,width:1100,height:760,background:'#151a20',transform:`rotate(${lerp(p,-2,0)}deg) scale(${lerp(p,.92,1)})`,boxShadow:'0 40px 90px #000'}}><div style={{position:'absolute',inset:32,overflow:'hidden'}}><Skyline p={p}/><TokyoTower x={680} y={70} s={.72}/></div><div style={{position:'absolute',left:54,bottom:43,fontSize:33,color:C.paper,fontWeight:800}}>NEW LIFE</div></div><Grain/></AbsoluteFill>;
  if(visual==='elevator-42') return <AbsoluteFill style={{background:'linear-gradient(180deg,#171b22,#07090d)'}}><div style={{position:'absolute',left:420,top:110,width:1080,height:790,border:'9px solid #343b45',background:'#11151a'}}><div style={{position:'absolute',left:'50%',top:0,bottom:0,width:5,background:'#323943'}}/><div style={{position:'absolute',left:84,top:100,fontSize:54,color:C.muted,fontWeight:900}}>27</div><div style={{position:'absolute',right:84,top:100,fontSize:98,color:C.gold,fontWeight:900,opacity:ease(p)}}>42</div><div style={{position:'absolute',left:480,top:150,width:120,height:460,background:'#1f252d'}}/><div style={{position:'absolute',left:513,top:lerp(ease(p),540,110),width:54,height:54,borderRadius:'50%',background:C.gold,boxShadow:'0 0 30px rgba(216,173,102,.45)'}}/></div><Person x={960} y={880} s={1.28}/><Grain/></AbsoluteFill>;
  if(visual==='tower-comparison') return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:90,top:120,width:820,height:730,borderRight:'1px solid rgba(255,255,255,.12)'}}><div style={{position:'absolute',left:100,top:30,fontSize:34,color:C.muted,fontWeight:800}}>27階</div><Skyline p={p}/><TokyoTower x={450} y={120} s={.58}/></div><div style={{position:'absolute',right:90,top:120,width:820,height:730}}><div style={{position:'absolute',left:100,top:30,fontSize:34,color:C.gold,fontWeight:800}}>42階</div><Skyline p={p}/><TokyoTower x={400} y={70} s={.78}/></div><div style={{position:'absolute',left:840,top:440,fontSize:72,color:C.paper,fontWeight:900}}>ほんの少し</div><Grain/></AbsoluteFill>;
  if(visual==='nothing-lost') return <ApartmentWindow p={p} floor={27} towerScale={.6}/>;
  return <AbsoluteFill style={{background:'radial-gradient(circle at 70% 38%,#20151a,#07090d 58%)'}}><TokyoTower x={1325} y={150} s={.84}/><SceneTitle text={'なぜ人は、幸せになるために\n港区へ行き、不幸になるのか'} sub="幸福と順位の社会科学"/><div style={{position:'absolute',left:160,top:535,width:720,height:2,background:`linear-gradient(90deg,${C.gold},transparent)`}}/><Grain/></AbsoluteFill>;
};

const HometownScene=({visual,p}:{visual:string;p:number})=>{
  if(visual==='hometown-lowrise') return <AbsoluteFill><Skyline p={p} low/><div style={{position:'absolute',left:120,bottom:205,width:560,height:250,background:'#b19a78',clipPath:'polygon(0 35%,50% 0,100% 35%,100% 100%,0 100%)'}}/><Person x={930} y={810} s={1.05}/><div style={{position:'absolute',left:1100,top:180,fontSize:56,fontWeight:900,color:C.paper}}>高い建物のない町</div><Grain/></AbsoluteFill>;
  if(visual==='tokyo-tv') return <AbsoluteFill style={{background:'#24211d'}}><div style={{position:'absolute',left:250,top:185,width:870,height:560,border:'18px solid #312d27',background:'#080c13',overflow:'hidden'}}><Skyline p={p}/><TokyoTower x={530} y={50} s={.55}/></div><Person x={1360} y={850} s={1.18}/><div style={{position:'absolute',right:240,top:170,fontSize:46,color:C.paper,fontWeight:900}}>画面の向こうの東京</div><Grain/></AbsoluteFill>;
  if(visual==='teacher-arrow'||visual==='hope-command') return <AbsoluteFill style={{background:'linear-gradient(180deg,#1b2230,#0b0d11)'}}><div style={{position:'absolute',left:140,top:120,width:1640,height:660,background:'#1f352e',boxShadow:'inset 0 0 0 12px #4e4235'}}/><div style={{position:'absolute',left:260,top:245,fontSize:visual==='teacher-arrow'?61:78,fontWeight:900,color:'#e6e1d7',whiteSpace:'pre-line'}}>{visual==='teacher-arrow'?'「お前なら東京の大学も狙えるぞ」':'「もっと上へ行ける」'}</div><div style={{position:'absolute',left:340,top:470,width:920,height:10,background:C.gold,transformOrigin:'0 50%',transform:`scaleX(${ease(p)})`}}/><div style={{position:'absolute',left:1250,top:425,width:0,height:0,borderTop:'42px solid transparent',borderBottom:'42px solid transparent',borderLeft:`72px solid ${C.gold}`,opacity:ease(p)}}/><Person x={520} y={880} s={1.15}/><Person x={1380} y={880} s={1.15}/><Grain/></AbsoluteFill>;
  if(visual==='career-escalator'||visual==='moving-neighborhoods'||visual==='shrinking-success') {
    const stages=visual==='moving-neighborhoods'?['板橋','中野','恵比寿','港区']:['大学','大手企業','外資','その先'];
    return <AbsoluteFill style={{background:C.bg}}><Skyline p={p}/><div style={{position:'absolute',left:170,top:660,width:1520,height:12,background:'#2c3440',transform:'rotate(-12deg)',transformOrigin:'0 50%'}}/>{stages.map((t,i)=><div key={t} style={{position:'absolute',left:280+i*355,top:650-i*75,fontSize:31,color:i===stages.length-1?C.gold:C.paper,fontWeight:900,opacity:clamp(p*2-i*.15)}}>{t}</div>)}<Person x={420+ease(p)*980} y={720-ease(p)*200} s={1.08}/>{visual==='shrinking-success'&&<div style={{position:'absolute',right:190,top:150,fontSize:68,fontWeight:900,color:C.paper}}>成功の賞味期限が<br/><span style={{color:C.red}}>短くなる</span></div>}<Grain/></AbsoluteFill>;
  }
  return null;
};

const ComparisonScene=({visual,p}:{visual:string;p:number})=>{
  if(visual==='mirror-self') return <AbsoluteFill style={{background:'linear-gradient(180deg,#10151e,#07090d)'}}><div style={{position:'absolute',left:720,top:120,width:480,height:750,border:'13px solid #303844',background:'linear-gradient(90deg,#0c1119,#192434)'}}><Person x={240} y={700} s={1.32}/><div style={{position:'absolute',left:35,top:50,width:400,height:620,border:'1px solid rgba(255,255,255,.18)',background:'linear-gradient(110deg,rgba(255,255,255,.08),transparent 40%)'}}/></div><SceneTitle text="自分の価値は、\n他人の中で測られる"/><Grain/></AbsoluteFill>;
  if(visual==='salary-800-a'||visual==='salary-800-b') {
    const high=visual==='salary-800-b';return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:250,top:250,width:1420,height:470,borderBottom:'3px solid #343b46'}}>{[0,1,2].map(i=>{const vals=high?[800,800,2000]:[800,800,400];const h=vals[i]/2000*390;return <div key={i} style={{position:'absolute',left:150+i*430,bottom:0,width:180,height:h*ease(p),background:i===1?C.gold:(i===2?(high?C.red:C.blue):'#46505d'),borderRadius:'10px 10px 0 0'}}><div style={{position:'absolute',top:-55,width:'100%',textAlign:'center',fontSize:34,fontWeight:900,color:C.paper}}>{vals[i]}万</div></div>})}</div><SceneTitle text={high?'同じ800万円が、小さくなる':'同じ800万円が、大きくなる'} sub="口座残高は変わっていない"/><Grain/></AbsoluteFill>;
  }
  if(visual==='elevator-reference') return <AbsoluteFill style={{background:'linear-gradient(180deg,#121822,#07090d)'}}><div style={{position:'absolute',left:250,top:110,width:1420,height:780,border:'7px solid #2d3540',background:'#10141a'}}><Person x={420} y={680} s={1.18}/><Person x={720} y={680} s={1.3}/><Person x={1030} y={680} s={1.42}/><Person x={1320} y={680} s={1.55}/><div style={{position:'absolute',right:70,top:70,fontSize:90,fontWeight:900,color:C.gold}}>↑</div></div><Grain/></AbsoluteFill>;
  return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:220,top:150,width:1480,height:720}}><div style={{position:'absolute',left:180+ease(p)*760,top:30,bottom:40,width:6,background:C.gold,boxShadow:'0 0 25px rgba(216,173,102,.35)'}}/>{Array.from({length:11}).map((_,i)=><div key={i} style={{position:'absolute',left:170+i*110,top:280+(i%2)*45,width:3,height:i%5===0?90:50,background:'#7f8995'}}/>)}<div style={{position:'absolute',left:120,top:430,fontSize:44,color:C.paper,fontWeight:900}}>「十分」</div><div style={{position:'absolute',left:930,top:150,fontSize:54,color:C.red,fontWeight:900}}>基準が動く</div></div><Grain/></AbsoluteFill>;
};

const IzakayaScene=({visual,p}:{visual:string;p:number})=>{
  if(visual==='taxi-mortgage') return <AbsoluteFill style={{background:'linear-gradient(180deg,#0a0d13,#050608)'}}><div style={{position:'absolute',left:0,right:0,bottom:0,height:300,background:'#0b0c0e'}}/><div style={{position:'absolute',left:100,top:150,width:1720,height:520,borderRadius:'80px 80px 0 0',background:'#15191e',border:'8px solid #292f36'}}><Person x={650} y={500} s={1.05}/><Phone x={980} y={80} p={p} title="住宅ローン" lines={['購入価格','自己資金','返済期間','月々の返済額']}/></div><div style={{position:'absolute',top:80,left:0,right:0,height:5,background:'repeating-linear-gradient(90deg,#d7b15f 0 80px,transparent 80px 155px)',transform:`translateX(${lerp(p,0,-220)}px)`}}/><Grain/></AbsoluteFill>;
  if(visual==='enough-line'||visual==='relative-deprivation') return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:230,top:220,width:1460,height:470}}><div style={{position:'absolute',left:90,top:260,width:1260,height:8,background:'#303743'}}/><div style={{position:'absolute',left:400+ease(p)*580,top:190,width:8,height:150,background:C.gold}}/><div style={{position:'absolute',left:330,top:355,fontSize:39,color:C.paper,fontWeight:900}}>十分</div><div style={{position:'absolute',left:980,top:355,fontSize:39,color:C.red,fontWeight:900}}>「普通」が押し上げる</div></div><SceneTitle text={visual==='relative-deprivation'?'持っている量ではなく、\n持っていない差を見る':'「豊か」の基準が移動する'}/><Grain/></AbsoluteFill>;
  return <AbsoluteFill style={{background:'linear-gradient(180deg,#2a1c16,#100b09)'}}><div style={{position:'absolute',left:170,top:160,width:1580,height:650,background:'#321d13',borderTop:'14px solid #5f3d26'}}><div style={{position:'absolute',left:120,right:120,bottom:170,height:34,background:'#7a4a2b'}}/><Person x={520} y={690} s={1.08}/><Person x={910} y={690} s={1.08}/><Person x={1300} y={690} s={1.08}/><div style={{position:'absolute',left:540,top:180,fontSize:visual==='ordinary-price'?69:55,fontWeight:900,color:C.paper}}>{visual==='ordinary-price'?'「まあ、それくらい」':'1億2000万'}</div><div style={{position:'absolute',left:600,top:310,fontSize:33,color:C.gold,fontWeight:800}}>値段が、会話で普通になる</div></div><Grain/></AbsoluteFill>;
};

const ReferenceScene=({visual,p}:{visual:string;p:number})=>{
  if(visual==='mountain-view') return <AbsoluteFill style={{background:'linear-gradient(180deg,#111a27,#c2a679 70%,#3e433b 71%)'}}><svg width="1920" height="1080" style={{position:'absolute',inset:0}}><path d="M0 820 L380 440 L690 760 L1060 280 L1430 760 L1720 390 L1920 650 L1920 1080 L0 1080 Z" fill="#303944"/><path d="M830 510 L1060 280 L1260 500" fill="none" stroke="#d9d4c7" strokeWidth="18" opacity=".7"/></svg><Person x={740+ease(p)*270} y={780-ease(p)*300} s={1.06}/><div style={{position:'absolute',left:1180,top:170,fontSize:58,color:C.paper,fontWeight:900}}>登るほど、<br/>高い山が見える。</div><Grain/></AbsoluteFill>;
  if(visual==='reference-groups'||visual==='group-shift') {
    const groups=visual==='group-shift'?['地元','大学','会社','港区']:['自分と同じ世界','自分と同じ世界','自分と同じ世界','自分と同じ世界'];
    return <AbsoluteFill style={{background:C.bg}}>{groups.map((t,i)=>{const r=125+i*65;return <div key={i} style={{position:'absolute',left:960-r,top:520-r,width:r*2,height:r*2,borderRadius:'50%',border:`${i===Math.floor(ease(p)*3)?5:2}px solid ${i===Math.floor(ease(p)*3)?C.gold:'#39424e'}`,opacity:.9}}><div style={{position:'absolute',left:'50%',top:-20,transform:'translateX(-50%)',fontSize:27,fontWeight:900,color:i===Math.floor(ease(p)*3)?C.gold:C.muted,whiteSpace:'nowrap'}}>{t}</div></div>})}<Person x={960} y={610} s={.9}/><Grain/></AbsoluteFill>;
  }
  if(visual==='success-network') return <AbsoluteFill style={{background:C.bg}}><Person x={960} y={610} s={1.0}/>{Array.from({length:9}).map((_,i)=>{const a=i/9*Math.PI*2;const x=960+Math.cos(a)*430,y=520+Math.sin(a)*280;return <React.Fragment key={i}><div style={{position:'absolute',left:960,top:520,width:Math.hypot(x-960,y-520),height:2,background:'rgba(216,173,102,.2)',transformOrigin:'0 50%',transform:`rotate(${Math.atan2(y-520,x-960)}rad) scaleX(${ease(p)})`}}/><Person x={x} y={y+100} s={.72+i*.018}/></React.Fragment>})}<Grain/></AbsoluteFill>;
  return <AbsoluteFill><Skyline p={p} low/><div style={{position:'absolute',left:180,top:160,fontSize:66,color:C.paper,fontWeight:900}}>「東京で成功した子」</div><div style={{position:'absolute',right:230,top:220,fontSize:40,color:C.gold,fontWeight:800}}>本人には、もう見えない。</div><Person x={980} y={850} s={1.15}/><Grain/></AbsoluteFill>;
};

const SignalScene=({visual,p}:{visual:string;p:number})=>{
  if(visual==='date-restaurant') return <AbsoluteFill style={{background:'linear-gradient(180deg,#19120f,#090806)'}}><div style={{position:'absolute',left:220,top:140,width:1480,height:690,borderRadius:20,background:'#281914',boxShadow:'0 30px 100px #000'}}><div style={{position:'absolute',left:160,right:160,top:380,height:28,background:'#754c34'}}/><Person x={620} y={720} s={1.08}/><Person x={1190} y={720} s={1.03}/><div style={{position:'absolute',left:800,top:210,fontSize:65,fontWeight:900,color:C.paper}}>「港区っぽいですね」</div><div style={{position:'absolute',left:806,top:300,fontSize:30,color:C.gold}}>住所が人格を説明する</div></div><Grain/></AbsoluteFill>;
  if(visual==='address-personality') return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:450,top:150,width:1020,height:700,border:'1px solid #303844',background:'#10151d'}}><div style={{position:'absolute',left:100,top:90,fontSize:31,color:C.muted}}>PROFILE</div><div style={{position:'absolute',left:100,top:180,fontSize:76,color:C.paper,fontWeight:900}}>港区</div><div style={{position:'absolute',left:100,top:310,width:820,height:2,background:'#3b444f'}}/><div style={{position:'absolute',left:100,top:380,fontSize:40,color:C.gold,fontWeight:800}}>住所 → 人物像</div><div style={{position:'absolute',left:100,top:470,fontSize:30,color:C.muted,lineHeight:1.9}}>本人が語っていないことまで<br/>他人が補完していく</div></div><Grain/></AbsoluteFill>;
  if(visual==='signal-window'||visual==='profile-life') return <AbsoluteFill style={{background:C.bg}}><Skyline p={p}/><div style={{position:'absolute',left:210,top:170,width:460,height:600,border:'5px solid #323a45',background:'rgba(7,9,13,.58)'}}><div style={{position:'absolute',left:70,top:70,fontSize:42,color:C.paper,fontWeight:900}}>住む場所</div><div style={{position:'absolute',left:70,top:170,fontSize:42,color:C.paper,fontWeight:900}}>働く会社</div><div style={{position:'absolute',left:70,top:270,fontSize:42,color:C.paper,fontWeight:900}}>振る舞い</div><div style={{position:'absolute',left:70,top:405,fontSize:33,color:C.gold,fontWeight:900}}>全部が同じ人物を<br/>説明し始める</div></div><Person x={1270} y={820} s={1.23}/><Grain/></AbsoluteFill>;
  return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 45%,#1a202b,#07090d 65%)'}}><div style={{position:'absolute',left:450,top:150,width:1020,height:720,border:'1px solid #35404d'}}><div style={{position:'absolute',left:90,top:90,fontSize:66,fontWeight:900,color:C.paper}}>矛盾のないプロフィール</div><div style={{position:'absolute',left:90,top:220,fontSize:36,color:C.muted,lineHeight:1.8}}>幸せだから選ぶのではなく、<br/>選んだ自分と矛盾しないために選ぶ。</div><div style={{position:'absolute',left:90,top:430,right:90,height:8,background:'#313a46'}}><div style={{height:'100%',width:`${ease(p)*100}%`,background:C.gold}}/></div></div><Grain/></AbsoluteFill>;
};

const AdaptationScene=({visual,p}:{visual:string;p:number})=>{
  if(visual==='old-phone'||visual==='dreams-realized') return <AbsoluteFill style={{background:'#171512'}}><div style={{position:'absolute',left:250,top:130,width:520,height:780,border:'10px solid #27292d',borderRadius:46,background:'#e7e2d8',transform:`rotate(${lerp(p,-7,-2)}deg)`}}><div style={{position:'absolute',left:50,top:90,fontSize:33,color:'#25272b',fontWeight:900}}>30歳までにやりたいこと</div><div style={{position:'absolute',left:50,top:180,fontSize:27,color:'#3d4147',lineHeight:2.4}}>東京で働く<br/>十分な収入<br/>いい部屋<br/>好きな時に旅行</div></div><div style={{position:'absolute',left:930,top:210,fontSize:73,color:C.paper,fontWeight:900}}>ほとんど、<br/><span style={{color:C.gold}}>叶っている。</span></div><Person x={1260} y={840} s={1.14}/><Grain/></AbsoluteFill>;
  if(visual==='tower-wallpaper') return <AbsoluteFill><ApartmentWindow p={p} floor={27} towerScale={.62}/><div style={{position:'absolute',left:170,top:150,fontSize:66,fontWeight:900,color:C.paper,opacity:1-ease(p)*.72}}>夢だった景色</div><div style={{position:'absolute',left:170,top:245,fontSize:66,fontWeight:900,color:C.muted,opacity:ease(p)}}>ただの景色</div></AbsoluteFill>;
  if(visual==='next-happiness') return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:280,top:560,width:1300,height:9,background:'#343d49',transform:'rotate(-13deg)',transformOrigin:'0 50%'}}/><Person x={450+ease(p)*930} y={620-ease(p)*210} s={1.1}/><div style={{position:'absolute',right:250,top:160,fontSize:62,color:C.paper,fontWeight:900}}>「もっと上なら、<br/>今度こそ」</div><div style={{position:'absolute',right:280,top:350,fontSize:31,color:C.gold}}>次の幸福を探す能力だけは失わない</div><Grain/></AbsoluteFill>;
  return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:960,top:500,width:520,height:520,borderRadius:'50%',border:'8px solid #3c4652',transform:`translate(-50%,-50%) rotate(${ease(p)*340}deg)`}}><div style={{position:'absolute',left:230,top:-18,width:46,height:46,borderRadius:'50%',background:C.gold,boxShadow:'0 0 35px rgba(216,173,102,.5)'}}/></div><SceneTitle text="人間は、幸福にも慣れる。" sub="快楽順応"/><Grain/></AbsoluteFill>;
};

const PropertyScene=({visual,p}:{visual:string;p:number})=>{
  if(visual==='property-scroll'||visual==='what-searching') return <AbsoluteFill style={{background:'linear-gradient(180deg,#12151a,#08090c)'}}><Person x={500} y={830} s={1.1}/><div style={{position:'absolute',left:810,top:100,width:820,height:760,borderRadius:28,background:'#ece8df',overflow:'hidden',boxShadow:'0 30px 90px #000'}}><div style={{position:'absolute',left:45,top:45,fontSize:34,color:'#1b1d20',fontWeight:900}}>マンション検索</div>{Array.from({length:5}).map((_,i)=><div key={i} style={{position:'absolute',left:45,top:125+i*135-ease(p)*120,width:730,height:110,borderBottom:'1px solid #c8c2b8',display:'flex',alignItems:'center'}}><div style={{width:140,height:82,background:i%2?'#9e968b':'#837b70'}}/><div style={{marginLeft:28,fontSize:24,color:'#24262a',fontWeight:800}}>高層階・角部屋・眺望良好</div></div>)}</div>{visual==='what-searching'&&<div style={{position:'absolute',left:210,top:150,fontSize:62,fontWeight:900,color:C.paper}}>何を探している？</div>}<Grain/></AbsoluteFill>;
  if(visual==='position-goods'||visual==='rank-ladder') return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:320,top:790,width:1280,height:11,background:'#333b47'}}>{Array.from({length:7}).map((_,i)=><div key={i} style={{position:'absolute',left:i*180,top:-i*86,width:180,height:86,borderTop:'2px solid #3d4652',borderLeft:'2px solid #3d4652',background:'rgba(20,25,33,.55)'}}/>)}<Person x={430+ease(p)*980} y={780-ease(p)*465} s={1.0}/><div style={{position:'absolute',right:190,top:130,fontSize:62,color:C.paper,fontWeight:900}}>順位には<br/><span style={{color:C.red}}>「十分」がない</span></div><Grain/></AbsoluteFill>;
  return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 45%,#1a1e27,#07090d 64%)'}}><div style={{position:'absolute',left:520,top:100,width:880,height:790,border:'9px solid #333b46',background:'linear-gradient(90deg,#0d1117,#17202c)'}}><Skyline p={p}/><TokyoTower x={510} y={130} s={.5}/><div style={{position:'absolute',inset:0,background:'linear-gradient(115deg,rgba(255,255,255,.08),transparent 33%,transparent 65%,rgba(255,255,255,.04))'}}/></div><Person x={960} y={850} s={1.18}/><Grain/></AbsoluteFill>;
};

const MeritScene=({visual,p}:{visual:string;p:number})=>{
  if(visual==='effort-desk') return <AbsoluteFill style={{background:'linear-gradient(180deg,#141922,#07090d)'}}><div style={{position:'absolute',left:210,top:650,width:1500,height:35,background:'#55463a'}}/><Person x={850} y={670} s={1.15}/><div style={{position:'absolute',left:1040,top:300,width:460,height:300,background:'#dad6cd',transform:'rotate(2deg)',padding:45,boxSizing:'border-box',color:'#24262a',fontSize:34,fontWeight:900}}>努力してきた。<br/><br/>だから、まだ足りない。</div><Grain/></AbsoluteFill>;
  if(visual==='self-review') return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:410,top:120,width:1100,height:760,background:'#e6e2d8',transform:'rotate(-1deg)',padding:'75px 100px',boxSizing:'border-box',color:'#202226'}}><div style={{fontSize:48,fontWeight:900}}>人生　自己採点</div>{['あの転職は正しかったか','もっと早く投資すべきだったか','起業すべきだったか'].map((t,i)=><div key={i} style={{marginTop:70,fontSize:34,borderBottom:'2px solid #b6b0a5',paddingBottom:18,opacity:clamp(p*2-i*.2)}}>{t}</div>)}</div><Grain/></AbsoluteFill>;
  if(visual==='effort-trap') return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:290,top:760,width:1300,height:10,background:'#333b46',transform:'rotate(-14deg)',transformOrigin:'0 50%'}}/><Person x={470+ease(p)*840} y={710-ease(p)*220} s={1.08}/><div style={{position:'absolute',right:250,top:180,fontSize:74,fontWeight:900,color:C.red}}>まだ足りない</div><div style={{position:'absolute',right:250,top:300,fontSize:31,color:C.muted}}>努力が、自己否定の根拠になる</div><Grain/></AbsoluteFill>;
  return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:300,top:180,width:1320,height:610,border:'2px solid #38414c'}}><div style={{position:'absolute',left:160,top:260,width:1000,height:12,background:'#343d49'}}><div style={{height:'100%',width:`${ease(p)*100}%`,background:C.gold}}/></div><div style={{position:'absolute',left:120,top:100,fontSize:50,fontWeight:900,color:C.paper}}>努力 → 成功</div><div style={{position:'absolute',right:120,top:420,fontSize:50,fontWeight:900,color:C.red}}>不足 → 自己責任</div><div style={{position:'absolute',left:640,top:250,width:70,height:70,borderRadius:'50%',background:C.paper}}/></div><Grain/></AbsoluteFill>;
};

const OrdinaryScene=({visual,p}:{visual:string;p:number})=>{
  if(visual==='shinkansen-thought') return <AbsoluteFill style={{background:'#11161d'}}><div style={{position:'absolute',left:0,right:0,top:170,height:410,overflow:'hidden'}}><Skyline p={p} low/></div><div style={{position:'absolute',left:0,right:0,bottom:0,height:450,background:'#24282d'}}/><div style={{position:'absolute',left:230,top:180,width:720,height:470,border:'14px solid #343a42',overflow:'hidden'}}><div style={{position:'absolute',inset:0,transform:`translateX(${lerp(p,0,-140)}px)`}}><Skyline p={p} low/></div></div><Person x={1200} y={830} s={1.18}/><div style={{position:'absolute',right:190,top:170,fontSize:69,fontWeight:900,color:C.paper}}>「普通」</div><Grain/></AbsoluteFill>;
  if(visual==='no-ending-game') return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:260,top:770,width:1420,height:9,background:'#343d49',transform:'rotate(-12deg)',transformOrigin:'0 50%'}}/>{[0,1,2,3].map(i=><Person key={i} x={420+i*330} y={740-i*80} s={.9+i*.1}/>) }<div style={{position:'absolute',right:170,top:120,fontSize:64,color:C.paper,fontWeight:900}}>何者かになった先に、<br/>もっと大きな何者かがいる。</div><Grain/></AbsoluteFill>;
  return <AbsoluteFill style={{background:'linear-gradient(180deg,#2b1b13,#0e0907)'}}><div style={{position:'absolute',left:170,top:140,width:1580,height:690,background:'#3a2116',borderTop:'13px solid #69442a'}}><div style={{position:'absolute',left:140,right:140,bottom:190,height:32,background:'#7b4c2c'}}/><Person x={610} y={690} s={1.04}/><Person x={1150} y={690} s={1.04}/>{visual==='child-drawing'?<div style={{position:'absolute',left:760,top:180,width:380,height:280,background:'#eee5d8',transform:`rotate(${lerp(p,-8,-2)}deg)`,padding:20}}><svg width="340" height="240"><path d="M30 190 Q90 30 150 170 T310 120" fill="none" stroke="#4e7bb3" strokeWidth="12"/><circle cx="190" cy="80" r="36" fill="#db8f67"/><path d="M60 70 L120 120 L180 45" fill="none" stroke="#6a9b69" strokeWidth="10"/></svg></div>:<div style={{position:'absolute',left:760,top:190,fontSize:66,color:C.paper,fontWeight:900}}>「まあ普通」</div>}</div><Grain/></AbsoluteFill>;
};

const FinalScene=({visual,p}:{visual:string;p:number})=>{
  if(visual==='tower-return'||visual==='dream-to-stage') return <ApartmentWindow p={p} floor={27} towerScale={visual==='dream-to-stage'?.52:.68}/>;
  if(visual==='desire-stairs') return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:260,top:820,width:1450,height:10,background:'#333c48',transform:'rotate(-17deg)',transformOrigin:'0 50%'}}/>{Array.from({length:10}).map((_,i)=><div key={i} style={{position:'absolute',left:300+i*130,top:800-i*40,width:130,height:40,borderTop:'1px solid #515b67'}}/>)}<Person x={420+ease(p)*1010} y={760-ease(p)*300} s={1.04}/><div style={{position:'absolute',right:180,top:140,fontSize:66,fontWeight:900,color:C.paper}}>階段を上がるほど、<br/><span style={{color:C.red}}>ゴールが消える。</span></div><Grain/></AbsoluteFill>;
  if(visual==='close-curtain') return <ApartmentWindow p={p} floor={27} towerScale={.62} curtain={ease(p)}/>;
  if(visual==='quiet-room') return <AbsoluteFill style={{background:'linear-gradient(180deg,#17130f,#090806)'}}><div style={{position:'absolute',left:220,top:170,width:1480,height:620,background:'#151514'}}><div style={{position:'absolute',left:180,top:380,width:620,height:30,background:'#544638'}}/><div style={{position:'absolute',left:300,top:315,width:190,height:35,background:'#ded7ca',transform:'rotate(-5deg)'}}/><div style={{position:'absolute',left:620,top:322,width:55,height:60,borderRadius:'0 0 18px 18px',border:'6px solid #a69886'}}/><div style={{position:'absolute',right:220,top:100,width:360,height:440,background:'#272729'}}/></div><div style={{position:'absolute',left:250,top:150,fontSize:54,color:C.paper,fontWeight:900}}>静かな照明。<br/>読みかけの本。<br/>朝のコーヒーカップ。</div><Grain/></AbsoluteFill>;
  if(visual==='nothing-lost-final') return <AbsoluteFill style={{background:'#090a0c'}}><div style={{position:'absolute',left:420,top:140,width:1080,height:730,border:'10px solid #2d3137',background:'#171717'}}><div style={{position:'absolute',left:0,right:0,top:0,bottom:0,background:'linear-gradient(90deg,#282627 50%,#242326 50%)'}}/><div style={{position:'absolute',left:472,top:0,bottom:0,width:136,background:'#111215'}}/></div><div style={{position:'absolute',left:580,top:440,fontSize:64,color:C.paper,fontWeight:900}}>何も失われていない。</div><Grain/></AbsoluteFill>;
  if(visual==='fear-rank') return <AbsoluteFill style={{background:C.bg}}><Person x={960} y={820} s={1.15}/><div style={{position:'absolute',left:370,top:150,width:1180,height:500}}>{[0,1,2,3,4].map((_,i)=><div key={i} style={{position:'absolute',left:i*250,top:330-i*55,fontSize:54,fontWeight:900,color:i===2?C.gold:C.muted}}>{i+1}</div>)}</div><div style={{position:'absolute',left:370,top:160,fontSize:65,fontWeight:900,color:C.paper}}>恐れているのは、<br/>不幸ではなく<span style={{color:C.red}}>順位</span>かもしれない。</div><Grain/></AbsoluteFill>;
  return <AbsoluteFill style={{background:'radial-gradient(circle at 72% 38%,#1d1115,#06080c 60%)'}}><TokyoTower x={1290} y={150} s={.82}/><div style={{position:'absolute',left:160,top:190,width:1020,fontSize:65,lineHeight:1.28,color:C.paper,fontWeight:900}}>港区は、<br/>人間が作った<span style={{color:C.gold}}>幸福の物差し</span>を<br/>少し見えやすくしている。</div><div style={{position:'absolute',left:160,top:570,width:760,height:2,background:`linear-gradient(90deg,${C.gold},transparent)`}}/><Grain/></AbsoluteFill>;
};

export const SceneArt=({visual,p}:{visual:string;p:number})=>{
  const intro=['arrival-tower','apartment-27','sns-newlife','success-photo','elevator-42','tower-comparison','nothing-lost','title-question'];
  const hometown=['hometown-lowrise','tokyo-tv','teacher-arrow','hope-command','career-escalator','moving-neighborhoods','shrinking-success'];
  const compare=['mirror-self','salary-800-a','salary-800-b','elevator-reference','moving-ruler'];
  const izakaya=['izakaya-house','ordinary-price','relative-deprivation','taxi-mortgage','enough-line'];
  const reference=['relative-success-home','success-network','reference-groups','group-shift','mountain-view'];
  const signal=['date-restaurant','address-personality','signal-window','profile-life','consistent-profile'];
  const adapt=['old-phone','dreams-realized','hedonic-adaptation','tower-wallpaper','next-happiness'];
  const property=['property-scroll','what-searching','position-goods','rank-ladder','minato-mirror'];
  const merit=['effort-desk','meritocracy-logic','meritocracy-shadow','self-review','effort-trap'];
  const ordinary=['hometown-izakaya','ordinary-dialogue','child-drawing','shinkansen-thought','no-ending-game'];
  const final=['tower-return','dream-to-stage','desire-stairs','close-curtain','quiet-room','nothing-lost-final','fear-rank','final-tower'];
  let body:React.ReactNode=null;
  if(intro.includes(visual)) body=<IntroScene visual={visual} p={p}/>;
  else if(hometown.includes(visual)) body=<HometownScene visual={visual} p={p}/>;
  else if(compare.includes(visual)) body=<ComparisonScene visual={visual} p={p}/>;
  else if(izakaya.includes(visual)) body=<IzakayaScene visual={visual} p={p}/>;
  else if(reference.includes(visual)) body=<ReferenceScene visual={visual} p={p}/>;
  else if(signal.includes(visual)) body=<SignalScene visual={visual} p={p}/>;
  else if(adapt.includes(visual)) body=<AdaptationScene visual={visual} p={p}/>;
  else if(property.includes(visual)) body=<PropertyScene visual={visual} p={p}/>;
  else if(merit.includes(visual)) body=<MeritScene visual={visual} p={p}/>;
  else if(ordinary.includes(visual)) body=<OrdinaryScene visual={visual} p={p}/>;
  else if(final.includes(visual)) body=<FinalScene visual={visual} p={p}/>;
  else body=<AbsoluteFill style={{background:C.bg}}><SceneTitle text={visual}/></AbsoluteFill>;
  return <AbsoluteFill style={{fontFamily:'Noto Sans CJK JP, sans-serif',overflow:'hidden'}}><Glow/>{body}<Grain/></AbsoluteFill>;
};
