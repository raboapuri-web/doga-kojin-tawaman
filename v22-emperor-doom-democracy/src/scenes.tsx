import React from 'react';
import {AbsoluteFill,interpolate} from 'remotion';

const C={bg:'#050707',deep:'#07100c',green:'#173d2c',green2:'#2c6246',emerald:'#5ba675',metal:'#9aa3a1',paper:'#eee6d6',muted:'#9da59f',gold:'#d3aa5d',red:'#b74a43',blue:'#7395a9',ink:'#020404'};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const lerp=(p:number,a:number,b:number)=>interpolate(clamp(p),[0,1],[a,b],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const ease=(p:number)=>1-Math.pow(1-clamp(p),3);
const hash=(s:string)=>s.split('').reduce((a,c)=>(a*31+c.charCodeAt(0))%997,17);

export const KNOWN_VISUALS=[
'lab-awakening','sealed-experiment','peace-news','economy-stable','doom-reveal','emperor-doom-1987','purple-man-capture','psychoprism-wave','world-kneels','doom-fixes-world','wonderman-dilemma','world-latveria','global-move-joke','consent-erased','bad-system-good-result','democracy-can-fail','results-question','fair-comparison','company-meeting','genius-ceo','profits-up','centralized-power','doom-decides','project-management-joke','perfect-dictator-speed','genius-supply-problem','wonderman-observes','heroes-idle','return-cost','freedom-to-be-foolish','wonderman-chooses','avengers-awaken','prism-breaks','doom-bored','admin-burnout-joke','freedom-returns','bad-dashboard','before-after-chart','hero-presentation','freedom-price-tag','state-purpose','happiness-vs-agency','kind-master','golden-cage','pettit-nondomination','permission-vs-right','doom-can-change','avengers-object','popper-question','good-king-bad-king','democracy-no-genius','replace-leader','insurance-system','insurance-boring','system-under-failure','crisis-fastlane','emergency-siren','temporary-power','car-no-brakes','doom-speed','fast-is-not-safe','long-road','information-room','bad-news-filter','bright-report','dictator-deaf','democracy-alarms','feedback-loop','silent-palace','democracy-mess','short-term-politics','voter-limits','not-optimal-machine','distributed-power','slow-because-safe','messy-safety','data-world-map','growth-twenty','not-magic-money','famine-accountability','election-incentive','institutional-incentives','scoreboard','dictatorship-wins-speed','democracy-wins-repair','maximize-vs-minimize','doom-requirements','character-sheet-joke','failure-first-design','doom-2025','united-latveria','people-welcome-doom','same-question-again','can-doom-leave','awkward-silence','wonderman-final-look','right-to-fail','freedom-mess','doom-clean-world','marathon-state','democracy-imperfect-humans','perfect-vs-imperfect','two-lines','doom-trap','who-decides','doom-self-judges','failure-day','final-mask'
] as const;

const Grain=()=> <AbsoluteFill style={{opacity:.04,backgroundImage:'radial-gradient(circle,rgba(255,255,255,.75) 0 1px,transparent 1.3px)',backgroundSize:'22px 22px',mixBlendMode:'soft-light'}}/>;
const Vignette=()=> <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 45%,transparent 28%,rgba(0,0,0,.24) 70%,rgba(0,0,0,.78) 100%)'}}/>;

const DoomMask=({x=1370,y=500,s=1,glow=0}:{x?:number;y?:number;s?:number;glow?:number})=><div style={{position:'absolute',left:x,top:y,width:240*s,height:300*s,transform:'translate(-50%,-50%)'}}>
  <div style={{position:'absolute',inset:0,clipPath:'polygon(22% 0,78% 0,94% 22%,85% 82%,66% 100%,34% 100%,15% 82%,6% 22%)',background:'linear-gradient(135deg,#c0c6c3 0%,#7d8784 40%,#4e5754 100%)',border:`${5*s}px solid #2e3633`,boxShadow:`0 0 ${60+glow*60}px rgba(73,168,105,${.16+.16*glow})`}}/>
  <div style={{position:'absolute',left:'20%',right:'20%',top:'32%',height:'8%',background:'#16211b',clipPath:'polygon(0 10%,42% 35%,50% 100%,58% 35%,100% 10%,94% 70%,58% 72%,50% 100%,42% 72%,6% 70%)'}}/>
  <div style={{position:'absolute',left:'42%',top:'48%',width:'16%',height:'24%',borderLeft:'4px solid #3a4340',borderRight:'4px solid #3a4340'}}/>
  <div style={{position:'absolute',left:'31%',right:'31%',bottom:'14%',height:'4%',borderBottom:'4px solid #2f3835'}}/>
  <div style={{position:'absolute',left:'-12%',top:'-9%',width:'124%',height:'55%',border:'22px solid #1b553a',borderBottom:0,borderRadius:'50% 50% 15% 15%'}}/>
</div>;

const Person=({x,y,s=1,hero=false}:{x:number;y:number;s?:number;hero?:boolean})=><div style={{position:'absolute',left:x,top:y,transform:`scale(${s})`,transformOrigin:'50% 100%'}}>
  <div style={{position:'absolute',left:-27,top:-154,width:54,height:54,borderRadius:'50%',background:hero?'#bda083':'#a78470'}}/>
  <div style={{position:'absolute',left:-42,top:-105,width:84,height:105,borderRadius:'20px 20px 8px 8px',background:hero?'#294c60':'#313b37',border:hero?'3px solid #789bb0':'none'}}/>
  <div style={{position:'absolute',left:-34,top:-18,width:24,height:78,background:'#17201d',borderRadius:10}}/><div style={{position:'absolute',right:-34,top:-18,width:24,height:78,background:'#17201d',borderRadius:10}}/>
</div>;

const World=({p,controlled=false}:{p:number;controlled?:boolean})=> <div style={{position:'absolute',left:960,top:500,width:760,height:760,transform:`translate(-50%,-50%) rotate(${lerp(p,-7,7)}deg)`,borderRadius:'50%',background:'radial-gradient(circle at 35% 28%,#3f7256,#193729 48%,#09120f 72%)',boxShadow:'inset -70px -45px 120px #020403,0 0 90px rgba(63,145,93,.16)',overflow:'hidden'}}>
  {Array.from({length:10}).map((_,i)=><div key={i} style={{position:'absolute',left:80+(i%5)*130,top:90+Math.floor(i/5)*250+(i%2)*50,width:130+(i%3)*35,height:80+(i%4)*20,borderRadius:'55% 38% 50% 42%',background:i%3===0?'#64866a':'#4e745b',transform:`rotate(${i*23}deg)`}}/>)}
  {controlled&&Array.from({length:7}).map((_,i)=><div key={'r'+i} style={{position:'absolute',left:370,top:370,width:4,height:340,background:'rgba(186,71,65,.6)',transformOrigin:'50% 0',transform:`rotate(${i*51+lerp(p,0,18)}deg)`}}/>)}
</div>;

const LabScene=({visual,p}:{visual:string;p:number})=> <AbsoluteFill style={{background:'linear-gradient(180deg,#101516,#050707)'}}>
  <div style={{position:'absolute',left:120,top:105,width:1680,height:750,border:'8px solid #313b3a',background:'linear-gradient(180deg,#182221,#0b1010)',overflow:'hidden'}}>
    {Array.from({length:7}).map((_,i)=><div key={i} style={{position:'absolute',left:110+i*220,top:80,width:130,height:520,border:'3px solid #46504e',background:i===3?'rgba(59,129,91,.12)':'rgba(255,255,255,.02)',boxShadow:i===3?'0 0 60px rgba(80,170,110,.24)':'none'}}/>)}
    <div style={{position:'absolute',left:730,top:170,width:220,height:360,borderRadius:110,background:'rgba(52,94,78,.25)',border:'4px solid #577066'}}/>
    <Person x={840} y={640} s={1.25} hero/>
    <div style={{position:'absolute',left:1150,top:140,width:360,height:200,background:'#08100d',border:'3px solid #42604f'}}><div style={{position:'absolute',left:30,right:30,top:94,height:3,background:C.emerald,boxShadow:'0 0 16px '+C.emerald,transform:`scaleX(${.35+.65*Math.abs(Math.sin(p*10))})`,transformOrigin:'0 50%'}}/></div>
  </div><Grain/><Vignette/>
</AbsoluteFill>;

const ComicWorldScene=({visual,p}:{visual:string;p:number})=>{
 const controlled=visual.includes('prism')||visual.includes('kneels')||visual.includes('capture')||visual.includes('consent');
 const peaceful=visual.includes('peace')||visual.includes('fixes')||visual.includes('stable')||visual.includes('returns');
 return <AbsoluteFill style={{background:'linear-gradient(180deg,#0c1511,#030505)'}}>
   <World p={p} controlled={controlled}/>
   {controlled&&<><div style={{position:'absolute',left:140,top:280,width:260,height:430,background:'linear-gradient(180deg,#8a48a1,#30173a)',clipPath:'polygon(50% 0,100% 30%,84% 100%,16% 100%,0 30%)',boxShadow:'0 0 70px rgba(145,72,180,.35)'}}/><div style={{position:'absolute',left:205,top:390,width:130,height:130,borderRadius:'50%',background:'#b66bd0',filter:'blur(2px)',opacity:.7+.2*Math.sin(p*10)}}/></>}
   {peaceful&&Array.from({length:7}).map((_,i)=><div key={i} style={{position:'absolute',left:210+i*220,top:820-Math.sin(i)*80,width:110,height:5,background:C.gold,opacity:.75,transform:`scaleX(${lerp(p,.1,1)})`,transformOrigin:'0 50%'}}/>)}
   {(visual.includes('doom')||visual.includes('latveria')||visual.includes('kneels'))&&<DoomMask x={1450} y={390} s={1.35} glow={p}/>} 
   {(visual.includes('wonderman')||visual.includes('avengers')||visual.includes('return')||visual.includes('freedom'))&&<><Person x={350} y={870} s={1.35} hero/><Person x={500} y={880} s={1.15} hero/><Person x={650} y={900} s={1.05} hero/></>}
   <Grain/><Vignette/>
 </AbsoluteFill>;
};

const ChartScene=({visual,p}:{visual:string;p:number})=>{
 const s=hash(visual);const bars=[.45,.72,.34,.86,.6];
 return <AbsoluteFill style={{background:'linear-gradient(180deg,#0a0d0c,#050606)'}}>
  <div style={{position:'absolute',left:170,right:170,top:150,bottom:170,borderLeft:'2px solid #46504d',borderBottom:'2px solid #46504d'}}>
    {bars.map((b,i)=><div key={i} style={{position:'absolute',left:150+i*260,bottom:0,width:125,height:`${lerp(p,.03,b)*100}%`,background:i===(s%5)?C.red:'linear-gradient(180deg,#568f69,#1d4934)',boxShadow:'0 0 30px rgba(80,150,100,.12)'}}/>)}
    <svg width="1500" height="600" style={{position:'absolute',left:40,top:20,overflow:'visible'}}><polyline points={`20,${470-lerp(p,0,130)} 280,${410-lerp(p,0,180)} 550,${455-lerp(p,0,80)} 820,${300-lerp(p,0,120)} 1110,${350-lerp(p,0,190)} 1420,${190-lerp(p,0,120)}`} fill="none" stroke={C.gold} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/></svg>
  </div><Grain/><Vignette/>
 </AbsoluteFill>;
};

const CageScene=({visual,p}:{visual:string;p:number})=> <AbsoluteFill style={{background:'radial-gradient(circle at 50% 45%,#18231d,#040606 68%)'}}>
  <div style={{position:'absolute',left:520,top:140,width:880,height:700,border:`8px solid ${C.gold}`,boxShadow:'0 0 80px rgba(207,168,88,.12)'}}>
    {Array.from({length:12}).map((_,i)=><div key={i} style={{position:'absolute',left:50+i*70,top:0,bottom:0,width:5,background:'rgba(216,182,111,.55)'}}/>)}
    <div style={{position:'absolute',left:120,top:110,width:640,height:430,background:'linear-gradient(180deg,#2a312b,#161c18)',borderRadius:26,boxShadow:'inset 0 0 80px #090b09'}}/>
    <Person x={440} y={590} s={1.2}/>
    <div style={{position:'absolute',right:65,top:290,fontSize:74,color:C.gold,fontWeight:900,transform:`rotate(${visual.includes('permission')?lerp(p,-12,8):0}deg)`}}>{visual.includes('permission')?'許可':'自由?'}</div>
  </div><Grain/><Vignette/>
</AbsoluteFill>;

const DemocracyScene=({visual,p}:{visual:string;p:number})=>{
 const replace=visual.includes('replace')||visual.includes('insurance')||visual.includes('failure')||visual.includes('popper');
 return <AbsoluteFill style={{background:'linear-gradient(180deg,#101314,#050606)'}}>
  <div style={{position:'absolute',left:130,top:170,width:720,height:610,borderRadius:360,background:'radial-gradient(circle,#263c35,#0a0f0d 70%)',border:'4px solid #495850'}}>
    {Array.from({length:8}).map((_,i)=><div key={i} style={{position:'absolute',left:320+Math.cos(i*Math.PI/4)*245,top:300+Math.sin(i*Math.PI/4)*245,width:100,height:100,borderRadius:'50%',background:i%2?C.blue:C.green2,border:'3px solid #718079',transform:`translate(-50%,-50%) scale(${lerp(p,.55,1)})`}}/>)}
  </div>
  <div style={{position:'absolute',right:190,top:180,width:600,height:600}}><div style={{position:'absolute',left:170,top:40,width:260,height:510,background:'linear-gradient(180deg,#313b38,#111716)',clipPath:'polygon(16% 0,84% 0,100% 100%,0 100%)'}}/><DoomMask x={300} y={250} s={.9}/>{replace&&<div style={{position:'absolute',left:80,top:420,width:440,height:18,background:C.red,transform:`translateX(${lerp(p,-260,260)}px) rotate(-7deg)`}}/>}</div>
  <Grain/><Vignette/>
 </AbsoluteFill>;
};

const SpeedScene=({visual,p}:{visual:string;p:number})=>{
 const car=visual.includes('car')||visual.includes('speed')||visual.includes('fast')||visual.includes('road');
 if(car)return <AbsoluteFill style={{background:'linear-gradient(180deg,#0c1113,#050606)'}}><div style={{position:'absolute',left:0,right:0,bottom:170,height:330,background:'#111715',transform:'skewY(-2deg)'}}>{Array.from({length:8}).map((_,i)=><div key={i} style={{position:'absolute',left:i*310-lerp(p,0,300),top:155,width:170,height:10,background:'#d4c27d'}}/>)}</div><div style={{position:'absolute',left:lerp(p,150,1180),top:560,width:440,height:150,borderRadius:'90px 130px 40px 35px',background:'linear-gradient(180deg,#315b48,#13271e)',boxShadow:'0 15px 50px #000'}}><div style={{position:'absolute',left:70,bottom:-35,width:90,height:90,borderRadius:'50%',background:'#050606',border:'12px solid #39413e'}}/><div style={{position:'absolute',right:70,bottom:-35,width:90,height:90,borderRadius:'50%',background:'#050606',border:'12px solid #39413e'}}/>{visual.includes('no-brakes')&&<div style={{position:'absolute',right:-40,top:-120,fontSize:96,color:C.red,fontWeight:1000}}>×</div>}</div><Grain/><Vignette/></AbsoluteFill>;
 return <AbsoluteFill style={{background:'linear-gradient(180deg,#191b19,#070808)'}}>{Array.from({length:8}).map((_,i)=><div key={i} style={{position:'absolute',left:120+(i%4)*420,top:130+Math.floor(i/4)*370,width:320,height:240,border:'3px solid #45504b',background:'#0e1311',transform:`translateY(${(1-ease(p))*50*(i%3)}px)`}}/>)}<div style={{position:'absolute',left:790,top:300,width:340,height:360,background:C.green,clipPath:'polygon(50% 0,100% 24%,88% 100%,12% 100%,0 24%)'}}/><Grain/><Vignette/></AbsoluteFill>;
};

const InfoScene=({visual,p}:{visual:string;p:number})=> <AbsoluteFill style={{background:'linear-gradient(180deg,#0b1010,#040505)'}}>
  <div style={{position:'absolute',left:130,top:130,width:1660,height:700,display:'flex',gap:34}}>{Array.from({length:5}).map((_,i)=>{const bad=visual.includes('filter')||visual.includes('deaf')||visual.includes('silent');return <div key={i} style={{flex:1,border:'2px solid #3c4743',background:'#0d1411',position:'relative',overflow:'hidden'}}><div style={{position:'absolute',left:22,right:22,top:38,height:10,background:i===4&&bad?C.red:C.emerald,opacity:.75}}/>{Array.from({length:7}).map((_,j)=><div key={j} style={{position:'absolute',left:24,top:90+j*70,width:`${40+((i+j)*17)%50}%`,height:8,background:'#56615c',opacity:bad&&i>1?lerp(p,.8,.05):.75}}/>)}{bad&&i>1&&<div style={{position:'absolute',inset:0,background:`rgba(0,0,0,${lerp(p,.05,.65)})`}}/>}</div>})}</div><Grain/><Vignette/>
</AbsoluteFill>;

const ChoiceScene=({visual,p}:{visual:string;p:number})=> <AbsoluteFill style={{background:'radial-gradient(circle at 50% 48%,#1b2923,#040606 70%)'}}>
  <div style={{position:'absolute',left:960,top:510,width:10,height:520,background:C.paper,transform:'translate(-50%,-50%)'}}/>
  <div style={{position:'absolute',left:960,top:230,width:510,height:10,background:C.paper,transform:'translate(-50%,-50%) rotate(-22deg)',transformOrigin:'50% 50%'}}/>
  <div style={{position:'absolute',left:960,top:230,width:510,height:10,background:C.paper,transform:'translate(-50%,-50%) rotate(22deg)',transformOrigin:'50% 50%'}}/>
  <div style={{position:'absolute',left:395,top:245,fontSize:58,color:C.paper,fontWeight:900}}>幸福</div><div style={{position:'absolute',right:380,top:245,fontSize:58,color:C.gold,fontWeight:900}}>自由</div>
  <Person x={960} y={790} s={1.45}/><Grain/><Vignette/>
</AbsoluteFill>;

const FinalScene=({visual,p}:{visual:string;p:number})=> <AbsoluteFill style={{background:'radial-gradient(circle at 72% 42%,#163826,#030404 62%)'}}>
  <DoomMask x={visual==='final-mask'?960:1370} y={visual==='final-mask'?490:450} s={visual==='final-mask'?2.15:1.45} glow={1}/>
  {visual!=='final-mask'&&<div style={{position:'absolute',left:150,top:180,width:930,fontSize:72,lineHeight:1.18,fontWeight:1000,color:C.paper}}>{visual==='who-decides'?'有能かどうかを、誰が決める？':visual==='doom-trap'?'「有能なら独裁でいい？」':visual==='failure-day'?'制度の性能は、失敗した日に分かる。':'完璧な人間か、壊れにくい制度か。'}</div>}
  {visual==='final-mask'&&<><div style={{position:'absolute',left:0,right:0,bottom:210,textAlign:'center',fontSize:46,fontWeight:900,color:C.paper,letterSpacing:5,opacity:lerp(p,0,1)}}>EMPEROR DOOM</div><div style={{position:'absolute',left:0,right:0,bottom:145,textAlign:'center',fontSize:25,color:C.gold,letterSpacing:4}}>THE TRAP OF A PERFECT RULER</div></>}
  <Grain/><Vignette/>
</AbsoluteFill>;

const is=(v:string,keys:string[])=>keys.some(k=>v.includes(k));

export const SceneArt=({visual,p}:{visual:string;p:number})=>{
  if(is(visual,['lab-','sealed-']))return <LabScene visual={visual} p={p}/>;
  if(is(visual,['wonderman','avengers','prism','doom-','world-','latveria','consent','peace-news','economy-stable','freedom-returns','purple-man','psychoprism','united-latveria','people-welcome']))return <ComicWorldScene visual={visual} p={p}/>;
  if(is(visual,['chart','dashboard','growth','profits','scoreboard','twenty','data-world','hero-presentation']))return <ChartScene visual={visual} p={p}/>;
  if(is(visual,['master','cage','pettit','permission']))return <CageScene visual={visual} p={p}/>;
  if(is(visual,['popper','democracy','replace','insurance','distributed','election','institutional','failure-first','system-under','good-king','voter','messy-safety','short-term','not-optimal','slow-because']))return <DemocracyScene visual={visual} p={p}/>;
  if(is(visual,['company','ceo','centralized','project-management','speed','genius-supply','crisis','emergency','temporary','car-','fast-','long-road']))return <SpeedScene visual={visual} p={p}/>;
  if(is(visual,['information','news-filter','bright-report','dictator-deaf','alarms','feedback','silent-palace']))return <InfoScene visual={visual} p={p}/>;
  if(is(visual,['state-purpose','happiness-vs-agency','fair-comparison','results-question','right-to-fail','maximize-vs-minimize']))return <ChoiceScene visual={visual} p={p}/>;
  if(is(visual,['trap','who-decides','self-judges','failure-day','final-mask','perfect-vs-imperfect','two-lines','imperfect-humans','marathon-state']))return <FinalScene visual={visual} p={p}/>;
  const s=hash(visual);
  return <AbsoluteFill style={{background:'linear-gradient(180deg,#101511,#040606)'}}>
    <World p={p} controlled={s%2===0}/><div style={{position:'absolute',left:130+(s%4)*80,top:150+(s%3)*55,width:480,height:480,border:`4px solid ${s%3===0?C.gold:C.green2}`,transform:`rotate(${lerp(p,-8,8)}deg)`,opacity:.55}}/><DoomMask x={1480} y={420} s={1.2}/><Grain/><Vignette/>
  </AbsoluteFill>;
};
