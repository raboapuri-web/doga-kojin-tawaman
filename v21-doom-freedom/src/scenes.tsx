import React from 'react';
import {AbsoluteFill,interpolate} from 'remotion';

const C={bg:'#050807',deep:'#07110d',green:'#143a2c',green2:'#255a40',emerald:'#4f9d6e',metal:'#9aa3a5',paper:'#efe8d9',muted:'#9aa39f',gold:'#d0a85e',red:'#b64640',blue:'#6e91a5',black:'#030504'};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(p:number)=>1-Math.pow(1-clamp(p),3);
const lerp=(p:number,a:number,b:number)=>interpolate(clamp(p),[0,1],[a,b],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});

const Grain=()=> <AbsoluteFill style={{opacity:.045,backgroundImage:'radial-gradient(circle,rgba(255,255,255,.7) 0 1px,transparent 1.4px)',backgroundSize:'21px 21px',mixBlendMode:'soft-light'}}/>;
const Vignette=()=> <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 45%,transparent 36%,rgba(0,0,0,.2) 70%,rgba(0,0,0,.7) 100%)'}}/>;

const Doom=({x=1360,y=860,s=1,throne=false}:{x?:number;y?:number;s?:number;throne?:boolean})=>
  <div style={{position:'absolute',left:x,top:y,transform:`scale(${s})`,transformOrigin:'50% 100%'}}>
    {throne&&<div style={{position:'absolute',left:-125,top:-420,width:250,height:420,background:'linear-gradient(180deg,#2a302f,#111715)',clipPath:'polygon(12% 0,88% 0,100% 100%,0 100%)',boxShadow:'0 0 0 5px #58615e'}}/>}
    <div style={{position:'absolute',left:-54,top:-310,width:108,height:108,borderRadius:'46% 46% 42% 42%',background:'linear-gradient(135deg,#bac0bd,#666e6c)',border:'6px solid #343b39',boxShadow:'0 0 25px rgba(120,170,140,.14)'}}>
      <div style={{position:'absolute',left:18,top:42,width:24,height:8,background:'#18251e',transform:'skewX(-20deg)'}}/>
      <div style={{position:'absolute',right:18,top:42,width:24,height:8,background:'#18251e',transform:'skewX(20deg)'}}/>
      <div style={{position:'absolute',left:40,top:67,width:28,height:12,borderBottom:'3px solid #303735'}}/>
    </div>
    <div style={{position:'absolute',left:-85,top:-330,width:170,height:260,borderRadius:'50% 50% 18% 18%',border:'18px solid #1d5a3d',borderBottomWidth:36,boxSizing:'border-box'}}/>
    <div style={{position:'absolute',left:-72,top:-205,width:144,height:180,borderRadius:'22px 22px 8px 8px',background:'linear-gradient(90deg,#535d5b,#8c9491,#444d4b)',border:'5px solid #2f3634'}}/>
    <div style={{position:'absolute',left:-108,top:-182,width:46,height:160,borderRadius:18,background:'#48514f',transform:'rotate(7deg)'}}/>
    <div style={{position:'absolute',right:-108,top:-182,width:46,height:160,borderRadius:18,background:'#48514f',transform:'rotate(-7deg)'}}/>
    <div style={{position:'absolute',left:-64,top:-38,width:46,height:110,background:'#26302d',borderRadius:14}}/>
    <div style={{position:'absolute',right:-64,top:-38,width:46,height:110,background:'#26302d',borderRadius:14}}/>
  </div>;

const Citizen=({x,y,s=1,child=false}:{x:number;y:number;s?:number;child?:boolean})=>
  <div style={{position:'absolute',left:x,top:y,transform:`scale(${s*(child ? .72 : 1)})`,transformOrigin:'50% 100%'}}>
    <div style={{position:'absolute',left:-26,top:-150,width:52,height:52,borderRadius:'50%',background:'#b9947d'}}/>
    <div style={{position:'absolute',left:-36,top:-102,width:72,height:90,borderRadius:16,background:'#343e3a'}}/>
    <div style={{position:'absolute',left:-28,top:-18,width:20,height:68,borderRadius:8,background:'#1d2623'}}/>
    <div style={{position:'absolute',left:8,top:-18,width:20,height:68,borderRadius:8,background:'#1d2623'}}/>
  </div>;

const Drone=({x,y,p,flip=false}:{x:number;y:number;p:number;flip?:boolean})=>
  <div style={{position:'absolute',left:x+Math.sin(p*6.28+(flip?2:0))*28,top:y+Math.cos(p*4.5)*18,transform:`scale(${flip?.85:1})`}}>
    <div style={{width:92,height:34,borderRadius:20,background:'#4c5a55',border:'3px solid #7b8782',boxShadow:'0 0 20px rgba(73,157,106,.22)'}}/>
    <div style={{position:'absolute',left:35,top:9,width:22,height:14,borderRadius:8,background:'#91d06b',boxShadow:'0 0 16px #77c759'}}/>
    <div style={{position:'absolute',left:-28,top:15,width:32,height:4,background:'#626e69'}}/><div style={{position:'absolute',right:-28,top:15,width:32,height:4,background:'#626e69'}}/>
  </div>;

const City=({p,night=false,calm=true}:{p:number;night?:boolean;calm?:boolean})=>
  <AbsoluteFill style={{background:night?'linear-gradient(180deg,#030707,#09150f 70%,#050807)':'linear-gradient(180deg,#9a9e91 0%,#55655c 45%,#12251d 72%,#080d0b 100%)'}}>
    <div style={{position:'absolute',left:-80+lerp(p,0,-45),right:-80,bottom:120,height:650}}>
      {Array.from({length:17}).map((_,i)=>{const h=190+(i%5)*72;return <div key={i} style={{position:'absolute',left:i*125,bottom:0,width:88+(i%3)*26,height:h,background:i%4===0?'#26332e':'#1b2723',borderTop:'4px solid #45534d',boxShadow:'inset 0 0 0 1px rgba(255,255,255,.04)'}}>
        {Array.from({length:8}).map((_,j)=><div key={j} style={{position:'absolute',left:14+(j%3)*24,top:24+Math.floor(j/3)*43,width:9,height:14,background:(i+j)%4===0?(night?'#c6a75e':'#7e9b82'):'#18211e'}}/>)}
      </div>})}
    </div>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:132,background:'#101813'}}/>
    {!calm&&<>{Array.from({length:8}).map((_,i)=><div key={i} style={{position:'absolute',left:180+i*210,top:420+(i%3)*60,width:80,height:12,background:C.red,transform:`rotate(${i%2?18:-14}deg) translateX(${Math.sin(p*8+i)*40}px)`}}/>)}</>}
  </AbsoluteFill>;

const WindowRoom=({p,night=false,door=0}:{p:number;night?:boolean;door?:number})=>
  <AbsoluteFill style={{background:night?'#11120f':'#25231d'}}>
    <div style={{position:'absolute',left:120,top:90,width:1220,height:720,border:'14px solid #333833',overflow:'hidden'}}>
      <City p={p} night={night}/>
      <Drone x={890} y={240} p={p}/><Drone x={1110} y={380} p={p} flip/>
      <div style={{position:'absolute',left:0,top:0,bottom:0,width:`${door*52}%`,background:'#20231f',boxShadow:'10px 0 30px #000'}}/>
      <div style={{position:'absolute',right:0,top:0,bottom:0,width:`${door*52}%`,background:'#20231f',boxShadow:'-10px 0 30px #000'}}/>
    </div>
    <Citizen x={760} y={910} s={1.15}/><Citizen x={920} y={910} s={1.02}/><Citizen x={1080} y={885} s={.88} child/>
    <div style={{position:'absolute',left:120,bottom:0,width:1220,height:160,background:'#191711'}}/>
  </AbsoluteFill>;

const SceneTitle=({text,sub}:{text:string;sub?:string})=><div style={{position:'absolute',left:150,top:130,width:1080,zIndex:5}}>
  <div style={{fontSize:70,lineHeight:1.18,fontWeight:900,color:C.paper,whiteSpace:'pre-line',textShadow:'0 8px 30px #000'}}>{text}</div>
  {sub&&<div style={{marginTop:24,fontSize:29,color:C.gold,fontWeight:800,letterSpacing:2}}>{sub}</div>}
</div>;

const BigWord=({text,p,color=C.paper}:{text:string;p:number;color?:string})=><div style={{position:'absolute',left:'50%',top:'47%',transform:`translate(-50%,-50%) scale(${lerp(ease(p),.72,1)})`,fontSize:126,fontWeight:1000,color,letterSpacing:4,textShadow:'0 14px 45px #000',whiteSpace:'nowrap'}}>{text}</div>;

const Intro=({visual,p}:{visual:string;p:number})=>{
  if(visual==='latveria-dawn'||visual==='quiet-city') return <AbsoluteFill><City p={p}/><div style={{position:'absolute',left:90,top:70,fontSize:22,letterSpacing:5,color:'rgba(239,232,217,.62)'}}>LATVERIA / 06:40</div><Citizen x={730} y={900} s={1.1}/>{visual==='quiet-city'&&<div style={{position:'absolute',left:1330,top:210,fontSize:64,color:C.paper,fontWeight:900}}>静かすぎる街</div>}<Grain/></AbsoluteFill>;
  if(visual==='family-security') return <WindowRoom p={p}/>;
  if(visual==='doom-statue') return <AbsoluteFill><City p={p}/><div style={{position:'absolute',left:980,bottom:110,width:320,height:90,background:'#1d2521',clipPath:'polygon(18% 0,82% 0,100% 100%,0 100%)'}}/><Doom x={1140} y={770} s={2.05}/><Citizen x={470} y={890} s={1.05}/><SceneTitle text={'この国には、\n自由がない。'}/><Grain/></AbsoluteFill>;
  if(visual==='no-choice-state') return <AbsoluteFill style={{background:C.bg}}><Doom x={960} y={920} s={1.75} throne/><div style={{position:'absolute',left:250,top:190,width:380,height:520,border:'2px solid #38423d'}}/><div style={{position:'absolute',right:250,top:190,width:380,height:520,border:'2px solid #38423d'}}/><div style={{position:'absolute',left:310,top:270,fontSize:42,color:C.muted}}>選挙</div><div style={{position:'absolute',right:315,top:270,fontSize:42,color:C.muted}}>討論</div><div style={{position:'absolute',left:310,top:390,fontSize:88,color:C.red}}>×</div><div style={{position:'absolute',right:315,top:390,fontSize:88,color:C.red}}>×</div><Grain/></AbsoluteFill>;
  if(visual==='review-paradox') return <AbsoluteFill style={{background:'#0b0d0c'}}><SceneTitle text={'「自由を愛している」'} sub="少なくともアンケートでは"/><div style={{position:'absolute',left:250,top:470,width:1420,height:16,background:'#303834'}}><div style={{height:'100%',width:`${lerp(p,0,84)}%`,background:C.emerald}}/></div><div style={{position:'absolute',left:250,top:530,fontSize:30,color:C.muted}}>自由は大切だ　84%</div><Grain/></AbsoluteFill>;
  if(visual==='choice-fatigue-breakfast') return <AbsoluteFill style={{background:'linear-gradient(180deg,#26221a,#100f0b)'}}><div style={{position:'absolute',left:250,top:650,width:1420,height:44,background:'#5d4d39'}}/><Citizen x={630} y={650} s={1.1}/>{['服A','服B','店★4.3','店★4.4'].map((t,i)=><div key={t} style={{position:'absolute',left:850+(i%2)*320,top:180+Math.floor(i/2)*230,width:260,height:150,borderRadius:18,border:'2px solid #59615c',background:'#151a17',display:'flex',alignItems:'center',justifyContent:'center',fontSize:34,color:i===3?C.gold:C.paper,transform:`translateY(${(1-ease(p))*40*(i+1)}px)`,opacity:clamp(p*2-i*.15)}}>{t}</div>)}<Grain/></AbsoluteFill>;
  return <AbsoluteFill style={{background:'radial-gradient(circle at 68% 45%,#19382a,#050807 60%)'}}><Doom x={1400} y={930} s={2.0} throne/><SceneTitle text={'自由より、\n幸福なのか。'} sub="DOCTOR DOOM / FREEDOM"/><Grain/></AbsoluteFill>;
};

const Choice=({visual,p}:{visual:string;p:number})=>{
  if(visual==='freedom-bill') return <AbsoluteFill style={{background:'#14120e'}}><div style={{position:'absolute',left:370,top:110,width:1180,height:800,background:'#e5dfd1',transform:`rotate(${lerp(p,-4,-1)}deg)`,padding:'80px 90px',boxSizing:'border-box',color:'#20231f'}}><div style={{fontSize:55,fontWeight:900}}>自由　ご利用明細</div><div style={{marginTop:90,fontSize:34,lineHeight:2}}>選択肢　無料<br/>自己決定　無料<br/>後悔　後日請求</div><div style={{position:'absolute',right:90,bottom:100,fontSize:88,fontWeight:1000,color:'#8d433e'}}>請求済</div></div><Grain/></AbsoluteFill>;
  if(visual==='blame-mirror') return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:700,top:90,width:520,height:800,border:'14px solid #39423e',background:'linear-gradient(90deg,#0b100e,#1c2a23)'}}><Citizen x={260} y={720} s={1.4}/></div>{['会社','親','政治','景気'].map((t,i)=><div key={t} style={{position:'absolute',left:220+i*390,top:170+(i%2)*450,fontSize:50,fontWeight:900,color:C.muted,opacity:clamp(p*2-i*.15)}}>{t}</div>)}<Grain/></AbsoluteFill>;
  if(visual==='choice-responsibility') return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:190,top:190,width:680,height:640,border:'2px solid #3b4540'}}><div style={{position:'absolute',left:100,top:100,fontSize:56,color:C.paper,fontWeight:900}}>選べる</div><div style={{position:'absolute',left:210,top:310,fontSize:150,color:C.emerald}}>→</div></div><div style={{position:'absolute',right:190,top:190,width:680,height:640,border:'2px solid #3b4540'}}><div style={{position:'absolute',left:100,top:100,fontSize:56,color:C.paper,fontWeight:900}}>責任</div><div style={{position:'absolute',left:235,top:310,fontSize:150,color:C.red}}>自分</div></div><Grain/></AbsoluteFill>;
  if(visual==='free-society-whisper') return <AbsoluteFill style={{background:'linear-gradient(180deg,#141a17,#070a08)'}}><Citizen x={960} y={870} s={1.2}/><div style={{position:'absolute',left:330,top:160,width:1260,height:420,borderRadius:'50%',border:'2px solid #415047',background:'rgba(20,38,29,.45)'}}><div style={{position:'absolute',left:170,top:130,fontSize:66,color:C.paper,fontWeight:900}}>「選択肢、ありましたよね？」</div></div><Grain/></AbsoluteFill>;
  if(visual==='roads-not-taken') return <AbsoluteFill style={{background:C.bg}}><Citizen x={960} y={900} s={1.05}/>{[-2,-1,0,1,2].map((d,i)=><div key={i} style={{position:'absolute',left:950,top:700,width:760,height:7,background:i===2?C.gold:'#34413b',transformOrigin:'0 50%',transform:`rotate(${d*18-90}deg) scaleX(${ease(p)})`}}/>)}<div style={{position:'absolute',left:180,top:150,fontSize:72,fontWeight:900,color:C.paper}}>選ばなかった人生が、<br/><span style={{color:C.red}}>全部残る。</span></div><Grain/></AbsoluteFill>;
  return <AbsoluteFill><City p={p}/><Doom x={1420} y={920} s={1.6}/><Citizen x={570} y={910} s={1.15}/><div style={{position:'absolute',left:220,top:160,fontSize:66,color:C.paper,fontWeight:900}}>失敗したら？</div><div style={{position:'absolute',left:220,top:270,fontSize:82,color:C.gold,fontWeight:1000}}>ドゥームのせい。</div><Grain/></AbsoluteFill>;
};

const Fromm=({visual,p}:{visual:string;p:number})=>{
  if(visual==='fromm-book') return <AbsoluteFill style={{background:'#17140f'}}><div style={{position:'absolute',left:560,top:120,width:800,height:780,background:'#d8d0bf',transform:`rotate(${lerp(p,-7,-2)}deg)`,boxShadow:'0 40px 90px #000'}}><div style={{position:'absolute',left:80,top:110,fontSize:40,color:'#25241f'}}>1941</div><div style={{position:'absolute',left:80,top:250,fontSize:80,color:'#1d201d',fontWeight:1000}}>自由からの逃走</div><div style={{position:'absolute',left:80,bottom:110,fontSize:38,color:'#39413c'}}>ERICH FROMM</div></div><Grain/></AbsoluteFill>;
  if(visual==='chains-fall') return <AbsoluteFill style={{background:C.bg}}>{Array.from({length:7}).map((_,i)=><div key={i} style={{position:'absolute',left:220+i*230,top:100+lerp(p,-200,900)+(i%2)*70,width:86,height:42,border:'12px solid #59615e',borderRadius:'50%',transform:`rotate(${i%2?40:-40}deg)`}}/>)}<Citizen x={960} y={880} s={1.3}/><BigWord text="解放" p={p} color={C.emerald}/><Grain/></AbsoluteFill>;
  if(visual==='identity-void') return <AbsoluteFill style={{background:'radial-gradient(circle,#0d1612,#020303 70%)'}}><Citizen x={960} y={890} s={1.2}/><div style={{position:'absolute',left:430,top:170,width:1060,textAlign:'center',fontSize:90,fontWeight:1000,color:C.paper,opacity:ease(p)}}>お前は何者になる？</div><Grain/></AbsoluteFill>;
  if(visual==='life-crossroads') return <AbsoluteFill style={{background:C.bg}}><Citizen x={960} y={900} s={1.05}/>{['進学','仕事','結婚','住む場所','生き方'].map((t,i)=>{const a=-135+i*22;return <div key={t} style={{position:'absolute',left:960,top:700,width:640,height:6,background:i===2?C.gold:'#34413b',transformOrigin:'0 50%',transform:`rotate(${a}deg) scaleX(${ease(p)})`}}><span style={{position:'absolute',right:0,top:-45,fontSize:29,color:C.muted,whiteSpace:'nowrap'}}>{t}</span></div>})}<Grain/></AbsoluteFill>;
  if(visual==='doom-decision') return <AbsoluteFill style={{background:'linear-gradient(180deg,#0c1711,#030504)'}}><Doom x={960} y={940} s={2.0} throne/><div style={{position:'absolute',left:220,top:170,fontSize:72,color:C.paper,fontWeight:900}}>優柔不断という言葉から<br/>最も遠い男</div><Grain/></AbsoluteFill>;
  if(visual==='escape-to-authority') return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:300,top:190,width:560,height:600,border:'3px solid #47514c'}}><Citizen x={280} y={560} s={1.1}/><div style={{position:'absolute',left:120,top:100,fontSize:45,color:C.paper,fontWeight:900}}>自由</div><div style={{position:'absolute',left:120,top:180,fontSize:30,color:C.red}}>不安</div></div><div style={{position:'absolute',right:300,top:190,width:560,height:600,border:'3px solid #47514c',background:'#0d1e16'}}><Doom x={280} y={610} s={1.2}/><div style={{position:'absolute',left:120,top:100,fontSize:45,color:C.paper,fontWeight:900}}>権威</div><div style={{position:'absolute',left:120,top:180,fontSize:30,color:C.emerald}}>「任せろ」</div></div><div style={{position:'absolute',left:850,top:430,fontSize:110,color:C.gold,transform:`translateX(${lerp(p,-90,90)}px)`}}>→</div><Grain/></AbsoluteFill>;
  return <AbsoluteFill style={{background:'#101511'}}><div style={{position:'absolute',left:390,top:150,width:1140,height:720,border:'2px solid #3a4840',background:'linear-gradient(180deg,#18251e,#0a0e0c)'}}><div style={{position:'absolute',left:120,top:100,fontSize:34,color:C.muted}}>PREMIUM SERVICE</div><div style={{position:'absolute',left:120,top:220,fontSize:76,color:C.paper,fontWeight:1000}}>もう、自分で<br/>決めなくていい。</div><div style={{position:'absolute',right:110,bottom:90,fontSize:44,color:C.gold,fontWeight:900}}>需要：非常に高い</div></div><Grain/></AbsoluteFill>;
};

const Command=({visual,p}:{visual:string;p:number})=>{
  if(visual==='crisis-console') return <AbsoluteFill style={{background:'#06100c'}}><Doom x={1510} y={930} s={1.6}/>{Array.from({length:6}).map((_,i)=><div key={i} style={{position:'absolute',left:180+(i%3)*360,top:150+Math.floor(i/3)*300,width:300,height:220,border:'2px solid #365244',background:'#0c1913'}}><div style={{position:'absolute',left:28,top:24,width:90,height:7,background:C.red}}/><div style={{position:'absolute',left:28,right:28,top:70,height:6,background:'#315143'}}/><div style={{position:'absolute',left:28,right:100,top:110,height:6,background:'#315143'}}/></div>)}<Grain/></AbsoluteFill>;
  if(visual==='doom-command') return <AbsoluteFill style={{background:C.bg}}><Doom x={960} y={940} s={2.1}/><div style={{position:'absolute',left:300,right:300,top:160,height:110,border:`3px solid ${C.green}`}}><BigWord text="決定" p={p} color={C.gold}/></div><Grain/></AbsoluteFill>;
  if(visual==='meeting-joke') return <AbsoluteFill style={{background:'#171713'}}><div style={{position:'absolute',left:170,top:610,width:1580,height:56,background:'#514634'}}/>{Array.from({length:8}).map((_,i)=><Citizen key={i} x={300+i*190} y={610} s={.88}/>) }<div style={{position:'absolute',left:380,top:170,fontSize:70,color:C.paper,fontWeight:900}}>「もう誰か決めてくれ」</div><div style={{position:'absolute',left:560,top:290,fontSize:32,color:C.gold}}>民主主義では言いにくい本音</div><Grain/></AbsoluteFill>;
  if(visual==='responsibility-transfer') return <AbsoluteFill style={{background:C.bg}}><Citizen x={480} y={830} s={1.2}/><Doom x={1440} y={900} s={1.45}/><div style={{position:'absolute',left:620,top:470,width:680,height:18,background:'#34423b'}}><div style={{width:`${ease(p)*100}%`,height:'100%',background:C.gold}}/></div><div style={{position:'absolute',left:710,top:380,fontSize:44,color:C.paper,fontWeight:900}}>責任</div><div style={{position:'absolute',right:230,top:250,fontSize:58,color:C.gold,fontWeight:900}}>引き受けます</div><Grain/></AbsoluteFill>;
  if(visual==='right-to-error') return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:270,top:170,width:600,height:700,border:'2px solid #46504a'}}><div style={{position:'absolute',left:95,top:90,fontSize:52,color:C.paper,fontWeight:900}}>自由社会</div><div style={{position:'absolute',left:95,top:250,fontSize:120,color:C.red}}>×</div><div style={{position:'absolute',left:95,top:420,fontSize:35,color:C.muted}}>間違える権利</div></div><div style={{position:'absolute',right:270,top:170,width:600,height:700,border:'2px solid #46504a',background:'#0b1812'}}><Doom x={300} y={650} s={1.1}/><div style={{position:'absolute',left:95,top:90,fontSize:52,color:C.paper,fontWeight:900}}>ドゥーム</div><div style={{position:'absolute',left:95,top:420,fontSize:35,color:C.gold}}>その権利も回収</div></div><Grain/></AbsoluteFill>;
  return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 45%,#173528,#040605 68%)'}}><Doom x={960} y={940} s={2.15} throne/><div style={{position:'absolute',left:280,top:155,fontSize:70,fontWeight:900,color:C.paper}}>「私が間違える？」</div><div style={{position:'absolute',left:410,top:275,fontSize:39,color:C.gold}}>その想定だけが、存在しない。</div><Grain/></AbsoluteFill>;
};

const Safety=({visual,p}:{visual:string;p:number})=>{
  if(visual==='family-evening'||visual==='surveillance-safety') return <AbsoluteFill><WindowRoom p={p} night/>{visual==='surveillance-safety'&&<SceneTitle text={'監視されている。\nそして、安心している。'}/>}</AbsoluteFill>;
  if(visual==='hobbes-chaos') return <AbsoluteFill><City p={p} night calm={false}/><div style={{position:'absolute',left:170,top:140,fontSize:68,color:C.paper,fontWeight:900}}>秩序のない自由</div><div style={{position:'absolute',left:170,top:250,fontSize:34,color:C.red}}>誰もあなたを守らない</div><Grain/></AbsoluteFill>;
  if(visual==='leviathan-bargain') return <AbsoluteFill style={{background:C.bg}}><Citizen x={470} y={850} s={1.2}/><Doom x={1450} y={910} s={1.5}/><div style={{position:'absolute',left:600,top:360,fontSize:40,color:C.paper,fontWeight:900}}>権限</div><div style={{position:'absolute',left:610,top:520,fontSize:90,color:C.gold}}>⇄</div><div style={{position:'absolute',right:570,top:360,fontSize:40,color:C.paper,fontWeight:900}}>安全</div><Grain/></AbsoluteFill>;
  if(visual==='protection-turns') return <AbsoluteFill style={{background:'#080c0a'}}><div style={{position:'absolute',left:250,top:210,fontSize:64,color:C.paper,fontWeight:900}}>あなたを守ります。</div><div style={{position:'absolute',left:250,top:390,fontSize:64,color:C.red,fontWeight:900,opacity:ease(p)}}>あなたから、あなたを。</div><div style={{position:'absolute',right:250,bottom:80}}><Doom x={0} y={0} s={1.6}/></div><Grain/></AbsoluteFill>;
  return <AbsoluteFill style={{background:'linear-gradient(180deg,#0b1310,#17130d)'}}><div style={{position:'absolute',left:260,top:170,width:640,height:700,border:'3px solid #39443e'}}><div style={{position:'absolute',left:100,top:120,fontSize:70,color:C.paper,fontWeight:900}}>自由</div><div style={{position:'absolute',left:100,top:270,fontSize:35,color:C.muted}}>未来の可能性</div></div><div style={{position:'absolute',right:260,top:170,width:640,height:700,border:'3px solid #594b35',background:'#18140e'}}><div style={{position:'absolute',left:100,top:120,fontSize:70,color:C.gold,fontWeight:900}}>安全</div><div style={{position:'absolute',left:100,top:270,fontSize:35,color:C.paper}}>今夜眠れる</div></div><Grain/></AbsoluteFill>;
};

const Perfect=({visual,p}:{visual:string;p:number})=>{
  if(visual==='perfect-dictator-lab') return <AbsoluteFill style={{background:'#07100c'}}><Doom x={960} y={940} s={1.65}/>{['賄賂 0','知性 MAX','善意 100','判断精度 99.9'].map((t,i)=><div key={t} style={{position:'absolute',left:i<2?230:1290,top:170+(i%2)*300,fontSize:38,color:i===3?C.gold:C.paper,fontWeight:900}}>{t}</div>)}<Grain/></AbsoluteFill>;
  if(visual==='ballot-or-genius') return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:260,top:250,width:550,height:520,border:'3px solid #414c46'}}><div style={{position:'absolute',left:130,top:100,fontSize:56,color:C.paper,fontWeight:900}}>投票箱</div><div style={{position:'absolute',left:160,top:250,width:220,height:150,background:'#353c39',borderTop:'12px solid #7a8580'}}/></div><div style={{position:'absolute',right:260,top:250,width:550,height:520,border:'3px solid #414c46'}}><Doom x={275} y={500} s={1.0}/></div><div style={{position:'absolute',left:850,top:440,fontSize:85,color:C.gold}}>OR</div><Grain/></AbsoluteFill>;
  if(visual==='freedom-price') return <AbsoluteFill style={{background:'#14110d'}}><div style={{position:'absolute',left:420,top:130,width:1080,height:820,background:'#e2dccf',padding:'80px',boxSizing:'border-box',color:'#1e211e'}}><div style={{fontSize:58,fontWeight:900}}>自由　価格表</div><div style={{marginTop:120,fontSize:38,lineHeight:2.1}}>投票する権利　￥0<br/>無能な代表を選ぶ可能性　付属<br/>結果に耐える責任　別料金</div></div><Grain/></AbsoluteFill>;
  if(visual==='doom-governs-well') return <AbsoluteFill><City p={p}/><Doom x={1470} y={930} s={1.65}/><div style={{position:'absolute',left:160,top:150,fontSize:72,color:C.paper,fontWeight:900}}>問題：<br/><span style={{color:C.gold}}>かなり上手く統治する。</span></div><Grain/></AbsoluteFill>;
  if(visual==='uncomfortable-question') return <AbsoluteFill style={{background:C.bg}}><BigWord text="迷惑" p={p} color={C.red}/><div style={{position:'absolute',left:560,top:700,fontSize:33,color:C.muted}}>独裁者には、分かりやすく無能でいてほしい。</div><Grain/></AbsoluteFill>;
  return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 45%,#102219,#030504 70%)'}}><div style={{position:'absolute',left:290,top:210,width:1340,height:620,border:'2px solid #3d4942'}}><div style={{position:'absolute',left:120,top:100,fontSize:84,color:C.paper,fontWeight:1000}}>幸福なら、</div><div style={{position:'absolute',left:120,top:260,fontSize:84,color:C.gold,fontWeight:1000}}>自由は必要か。</div></div><Grain/></AbsoluteFill>;
};

const Berlin=({visual,p}:{visual:string;p:number})=>{
  if(visual==='berlin-two-liberties') return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:220,top:180,width:660,height:650,border:'2px solid #43504a'}}><div style={{position:'absolute',left:100,top:100,fontSize:55,color:C.paper,fontWeight:900}}>邪魔されない</div><div style={{position:'absolute',left:100,top:220,fontSize:33,color:C.muted}}>消極的自由</div><div style={{position:'absolute',left:160,top:380,width:340,height:8,background:C.emerald}}/></div><div style={{position:'absolute',right:220,top:180,width:660,height:650,border:'2px solid #43504a'}}><div style={{position:'absolute',left:100,top:100,fontSize:55,color:C.paper,fontWeight:900}}>自分で生きる</div><div style={{position:'absolute',left:100,top:220,fontSize:33,color:C.muted}}>積極的自由</div><div style={{position:'absolute',left:160,top:380,width:340,height:8,background:C.gold}}/></div><Grain/></AbsoluteFill>;
  if(visual==='true-interest') return <AbsoluteFill style={{background:'#07100c'}}><Citizen x={650} y={860} s={1.2}/><Doom x={1370} y={900} s={1.5}/><div style={{position:'absolute',left:760,top:210,width:780,fontSize:63,color:C.paper,fontWeight:900}}>「あなたの本当の幸福は、<br/>私の方が知っている」</div><Grain/></AbsoluteFill>;
  if(visual==='for-your-own-good') return <AbsoluteFill style={{background:'#0b0f0c'}}><div style={{position:'absolute',left:300,top:140,width:1320,height:780,border:'16px solid #3c4a42',background:'repeating-linear-gradient(90deg,#090d0b 0 72px,#172019 72px 88px)'}}><div style={{position:'absolute',left:230,top:210,fontSize:72,color:C.paper,fontWeight:1000}}>全部、あなたのため。</div><div style={{position:'absolute',left:350,top:370,fontSize:44,color:C.gold}}>親切な刑務所</div></div><Grain/></AbsoluteFill>;
  if(visual==='eternal-child') return <AbsoluteFill style={{background:'#13140f'}}><Doom x={960} y={930} s={1.55}/>{Array.from({length:10}).map((_,i)=><Citizen key={i} x={250+(i%5)*350} y={570+Math.floor(i/5)*290} s={.78} child/>)}<div style={{position:'absolute',left:170,top:110,fontSize:62,color:C.paper,fontWeight:900}}>国民全員、永遠に子ども。</div><Grain/></AbsoluteFill>;
  return <AbsoluteFill style={{background:'linear-gradient(180deg,#102019,#050706)'}}><Doom x={1490} y={930} s={1.55}/><div style={{position:'absolute',left:210,top:160,fontSize:70,color:C.paper,fontWeight:900}}>選ばなくていい。<br/>反対しなくていい。</div><div style={{position:'absolute',left:210,top:410,fontSize:55,color:C.gold,fontWeight:900}}>巨大な保育園。</div><Grain/></AbsoluteFill>;
};

const Algorithm=({visual,p}:{visual:string;p:number})=>{
  if(visual==='streaming-scroll'||visual==='algorithm-choice'||visual==='choice-paralysis'||visual==='recommendation-machine'||visual==='star-rating') {
    const rows=['おすすめ動画','あなた向け音楽','近くの人気店','似ている商品','続きから再生'];
    return <AbsoluteFill style={{background:'linear-gradient(180deg,#101315,#050606)'}}><div style={{position:'absolute',left:660,top:80,width:600,height:860,borderRadius:55,border:'12px solid #252b2a',background:'#ece8df',overflow:'hidden'}}>
      <div style={{position:'absolute',left:45,right:45,top:70,fontSize:32,fontWeight:900,color:'#202321'}}>FOR YOU</div>
      {rows.map((t,i)=><div key={t} style={{position:'absolute',left:45,top:150+i*135-lerp(p,0,85),width:510,height:110,borderRadius:18,background:i===Math.floor(ease(p)*5)%5?'#d8d1c3':'#c4beb2',padding:'30px',boxSizing:'border-box',fontSize:27,fontWeight:800,color:'#252824'}}>{t}<span style={{float:'right',color:'#9b7b42'}}>{i===2?'★4.8':'›'}</span></div>)}
    </div>{visual==='algorithm-choice'&&<SceneTitle text={'何でも選べる。\n候補は選んでもらう。'}/>} {visual==='choice-paralysis'&&<div style={{position:'absolute',left:170,top:170,fontSize:66,color:C.paper,fontWeight:900}}>30分迷って、<br/>昨日の続きを見る。</div>} {visual==='star-rating'&&<BigWord text="★4.8" p={p} color={C.gold}/>}<Grain/></AbsoluteFill>;
  }
  if(visual==='mocking-free-man') return <AbsoluteFill style={{background:C.bg}}><Citizen x={560} y={860} s={1.2}/><div style={{position:'absolute',left:760,top:160,width:900,fontSize:66,color:C.paper,fontWeight:900}}>「自分で決められないなんて<br/>可哀想」</div><div style={{position:'absolute',left:760,top:390,fontSize:34,color:C.gold}}>かなり勇気のある発言である。</div><Grain/></AbsoluteFill>;
  if(visual==='outsourced-decisions') return <AbsoluteFill style={{background:C.bg}}><Citizen x={430} y={850} s={1.1}/>{['動画','店','旅行','恋愛','ニュース'].map((t,i)=><div key={t} style={{position:'absolute',left:650+i*230,top:250+(i%2)*230,width:180,height:120,border:'2px solid #3f4d46',background:'#0e1713',display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,color:C.paper,transform:`translateX(${lerp(p,0,180)}px)`,opacity:1-i*.08}}>{t}</div>)}<div style={{position:'absolute',right:120,top:680,fontSize:42,color:C.gold,fontWeight:900}}>意思決定 → 外部へ</div><Grain/></AbsoluteFill>;
  if(visual==='state-recommendation') return <AbsoluteFill style={{background:'#07110d'}}><div style={{position:'absolute',left:350,top:130,width:1220,height:800,border:'3px solid #405147',background:'#0d1b14'}}><div style={{position:'absolute',left:120,top:100,fontSize:38,color:C.muted}}>LATVERIA SETTINGS</div><div style={{position:'absolute',left:120,top:220,fontSize:80,color:C.paper,fontWeight:1000}}>国家ごと、<br/><span style={{color:C.gold}}>おすすめ設定。</span></div><Doom x={980} y={720} s={1.2}/></div><Grain/></AbsoluteFill>;
  if(visual==='small-dooms') return <AbsoluteFill style={{background:C.bg}}>{Array.from({length:9}).map((_,i)=><div key={i} style={{position:'absolute',left:220+(i%3)*540,top:120+Math.floor(i/3)*300,width:420,height:220,border:'2px solid #36463e',background:'#0c1511'}}><Doom x={210} y={215} s={.55}/></div>)}<SceneTitle text="小さなドゥームは、もういる。"/><Grain/></AbsoluteFill>;
  return null;
};

const Home=({visual,p}:{visual:string;p:number})=>{
  if(visual==='daughter-bedtime') return <AbsoluteFill style={{background:'linear-gradient(180deg,#101613,#080a08)'}}><div style={{position:'absolute',left:250,top:590,width:1100,height:220,borderRadius:20,background:'#27312c'}}/><Citizen x={650} y={610} s={1.05}/><Citizen x={960} y={605} s={.8} child/><div style={{position:'absolute',right:180,top:150,width:420,height:300,border:'8px solid #303a35',background:'#0b1610'}}><Doom x={210} y={285} s={.7}/></div><Grain/></AbsoluteFill>;
  if(visual==='predictable-tomorrow'||visual==='predictability-core') return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:260,top:160,width:1400,height:720,border:'2px solid #3e4a44'}}>{['今日','明日','明後日','その次'].map((t,i)=><div key={t} style={{position:'absolute',left:110+i*315,top:250,width:240,height:180,border:'2px solid #45524b',background:i===0?'#173425':'#0c1712',display:'flex',alignItems:'center',justifyContent:'center',fontSize:45,color:i===0?C.gold:C.paper,opacity:clamp(p*2-i*.14)}}>{t}</div>)}</div>{visual==='predictability-core'&&<SceneTitle text="最大の贈り物は、予測可能性。"/>}<Grain/></AbsoluteFill>;
  if(visual==='future-door') return <AbsoluteFill style={{background:'#060908'}}><div style={{position:'absolute',left:710,top:90,width:500,height:850,border:'14px solid #3e4944',background:'#111b16',transform:`perspective(1200px) rotateY(${lerp(p,0,-62)}deg)`,transformOrigin:'0 50%'}}/><div style={{position:'absolute',right:180,top:150,fontSize:60,color:C.paper,fontWeight:900}}>可能性</div><div style={{position:'absolute',right:180,top:250,fontSize:60,color:C.red,fontWeight:900}}>＝ リスク</div><Grain/></AbsoluteFill>;
  return <WindowRoom p={p} night door={ease(p)*.88}/>;
};

const Fragility=({visual,p}:{visual:string;p:number})=>{
  if(visual==='invoice-arrives') return <AbsoluteFill style={{background:'#16120e'}}><div style={{position:'absolute',left:510,top:100,width:900,height:830,background:'#e3ddcf',transform:`translateY(${lerp(p,-120,0)}px) rotate(-2deg)`,padding:'80px',boxSizing:'border-box',color:'#1d201d'}}><div style={{fontSize:55,fontWeight:900}}>独裁　ご利用明細</div><div style={{marginTop:140,fontSize:42}}>快適さ　込み<br/>迅速な意思決定　込み<br/>独裁者の誤り　<span style={{color:'#a33f39',fontWeight:900}}>無制限</span></div></div><Grain/></AbsoluteFill>;
  if(visual==='perfect-rule-condition') return <AbsoluteFill style={{background:C.bg}}><Doom x={960} y={930} s={1.8} throne/><div style={{position:'absolute',left:260,top:140,fontSize:66,color:C.paper,fontWeight:900}}>条件は、一つだけ。</div><div style={{position:'absolute',left:260,top:280,fontSize:86,color:C.red,fontWeight:1000}}>永遠に正しいこと。</div><Grain/></AbsoluteFill>;
  if(visual==='democracy-friction') return <AbsoluteFill style={{background:'#0d100e'}}>{Array.from({length:12}).map((_,i)=><div key={i} style={{position:'absolute',left:200+(i%6)*260,top:200+Math.floor(i/6)*420,width:170,height:170,borderRadius:'50%',background:'#28332e',border:'3px solid #4b5852'}}><Citizen x={85} y={160} s={.6}/></div>)}<div style={{position:'absolute',left:510,top:450,fontSize:55,color:C.paper,fontWeight:900}}>人類が賢いなら、<br/>コメント欄はもう少し平和。</div><Grain/></AbsoluteFill>;
  if(visual==='replaceable-power') return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:300,top:180,width:1320,height:650,border:'2px solid #404c46'}}>{['替えられる','批判できる','分けられる'].map((t,i)=><div key={t} style={{position:'absolute',left:120+i*390,top:240,width:320,height:170,border:'2px solid #4c5a52',background:'#0d1813',display:'flex',alignItems:'center',justifyContent:'center',fontSize:38,fontWeight:900,color:i===0?C.gold:C.paper,opacity:clamp(p*2-i*.18)}}>{t}</div>)}</div><Grain/></AbsoluteFill>;
  if(visual==='friction-protects') return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',left:180,top:500,width:1560,height:80,background:'repeating-linear-gradient(90deg,#35423b 0 90px,#18211d 90px 130px)'}}/><div style={{position:'absolute',left:180+lerp(p,0,1250),top:430,width:150,height:150,borderRadius:'50%',background:C.gold,boxShadow:'0 0 35px rgba(208,168,94,.25)'}}/><div style={{position:'absolute',left:350,top:170,fontSize:68,color:C.paper,fontWeight:900}}>面倒くささは、<br/>壊れないための摩擦。</div><Grain/></AbsoluteFill>;
  if(visual==='miracle-dependence') return <AbsoluteFill style={{background:'radial-gradient(circle,#173224,#030504 68%)'}}><Doom x={960} y={930} s={1.8}/><div style={{position:'absolute',left:330,top:150,fontSize:72,color:C.paper,fontWeight:900}}>正しい限り。<br/>善良である限り。</div><div style={{position:'absolute',left:330,top:430,fontSize:56,color:C.red,fontWeight:900}}>制度ではなく、奇跡。</div><Grain/></AbsoluteFill>;
  return <AbsoluteFill style={{background:'linear-gradient(180deg,#09110d,#020303)'}}><div style={{position:'absolute',left:710,top:120,width:500,height:820,border:'12px solid #424b47',background:'#111713'}}/><Doom x={960} y={900} s={1.65} throne/><div style={{position:'absolute',left:250,top:170,fontSize:65,color:C.paper,fontWeight:900}}>王座にいるのは、<br/>神ではない。</div><div style={{position:'absolute',left:250,top:360,fontSize:46,color:C.gold,fontWeight:900}}>神だと思っている人間。</div><Grain/></AbsoluteFill>;
};

const Freedom=({visual,p}:{visual:string;p:number})=>{
  if(visual==='morning-again') return <AbsoluteFill><City p={p}/><Doom x={1450} y={910} s={1.4}/><Citizen x={600} y={880} s={1.05}/><div style={{position:'absolute',left:100,top:70,fontSize:22,letterSpacing:5,color:C.muted}}>AGAIN / MORNING</div><Grain/></AbsoluteFill>;
  if(visual==='self-responsibility-manual') return <AbsoluteFill style={{background:'#15130e'}}><div style={{position:'absolute',left:490,top:90,width:940,height:860,background:'#dad4c6',transform:`rotate(${lerp(p,-3,0)}deg)`,padding:'80px',boxSizing:'border-box',color:'#22251f'}}><div style={{fontSize:58,fontWeight:1000}}>自由社会<br/>自己責任マニュアル</div><div style={{marginTop:90,fontSize:31,lineHeight:2}}>正しい仕事を選ぶこと。<br/>正しい相手を選ぶこと。<br/>正しく幸福になること。</div></div><Grain/></AbsoluteFill>;
  if(visual==='wrong-life-right') return <AbsoluteFill style={{background:C.bg}}><Citizen x={960} y={900} s={1.15}/>{Array.from({length:6}).map((_,i)=><div key={i} style={{position:'absolute',left:950,top:690,width:680,height:6,background:i===4?C.red:'#36433d',transformOrigin:'0 50%',transform:`rotate(${-155+i*25}deg) scaleX(${ease(p)})`}}/>)}<div style={{position:'absolute',left:250,top:150,fontSize:68,color:C.paper,fontWeight:900}}>間違った人生を、<br/><span style={{color:C.gold}}>自分で選べる。</span></div><Grain/></AbsoluteFill>;
  return <AbsoluteFill style={{background:'radial-gradient(circle,#16251e,#040605 70%)'}}><BigWord text="非効率" p={p} color={C.gold}/><div style={{position:'absolute',left:740,top:680,fontSize:40,color:C.paper,fontWeight:900}}>だから、価値がある。</div><Grain/></AbsoluteFill>;
};

const Final=({visual,p}:{visual:string;p:number})=>{
  if(visual==='latveria-night') return <WindowRoom p={p} night/>;
  if(visual==='answer-freedom') return <AbsoluteFill style={{background:C.bg}}><Doom x={1450} y={920} s={1.5}/><Citizen x={480} y={850} s={1.1}/><div style={{position:'absolute',left:650,top:260,fontSize:62,color:C.paper,fontWeight:900}}>自由の苦しみ</div><div style={{position:'absolute',left:690,top:400,fontSize:95,color:C.gold}}>→</div><div style={{position:'absolute',left:920,top:260,fontSize:62,color:C.emerald,fontWeight:900}}>快適さ</div><Grain/></AbsoluteFill>;
  if(visual==='happiness-without-consent') return <AbsoluteFill style={{background:'#08100c'}}><div style={{position:'absolute',left:350,top:180,width:1220,height:670,border:'3px solid #405047',background:'#0e1c15'}}><div style={{position:'absolute',left:140,top:110,fontSize:72,color:C.paper,fontWeight:900}}>幸福</div><div style={{position:'absolute',left:140,top:250,fontSize:38,color:C.muted}}>ただし、選んだ覚えはない。</div><div style={{position:'absolute',right:140,bottom:120,fontSize:110,color:C.red}}>?</div></div><Grain/></AbsoluteFill>;
  if(visual==='doom-desire') return <AbsoluteFill style={{background:'radial-gradient(circle at 72% 48%,#173626,#030504 62%)'}}><Doom x={1400} y={930} s={1.85}/><div style={{position:'absolute',left:180,top:160,fontSize:67,color:C.paper,fontWeight:900}}>彼が恐ろしいのは、<br/>我々と<span style={{color:C.red}}>違う</span>からではない。</div><div style={{position:'absolute',left:180,top:440,fontSize:55,color:C.gold,fontWeight:900}}>似すぎているからだ。</div><Grain/></AbsoluteFill>;
  if(visual==='final-bargain') return <AbsoluteFill style={{background:'#06100c'}}><Citizen x={470} y={850} s={1.15}/><Doom x={1450} y={910} s={1.55}/><div style={{position:'absolute',left:600,top:250,fontSize:60,color:C.paper,fontWeight:900}}>「もう誰か、正解を決めてくれ」</div><div style={{position:'absolute',right:310,top:430,fontSize:70,color:C.gold,fontWeight:1000}}>いいだろう。</div><Grain/></AbsoluteFill>;
  return <AbsoluteFill style={{background:'linear-gradient(180deg,#08110d,#020303)'}}><div style={{position:'absolute',left:250,top:160,width:1420,fontSize:68,lineHeight:1.3,color:C.paper,fontWeight:900}}>自由とは、<br/>持っていると<span style={{color:C.gold}}>面倒</span>なのに、<br/>失ってから欲しくなる。</div><div style={{position:'absolute',left:250,top:600,fontSize:48,color:C.red,fontWeight:900}}>非常に性格の悪い権利である。</div><Doom x={1540} y={930} s={1.3}/><Grain/></AbsoluteFill>;
};

export const SceneArt=({visual,p}:{visual:string;p:number})=>{
  const intro=['latveria-dawn','quiet-city','family-security','doom-statue','no-choice-state','review-paradox','choice-fatigue-breakfast','question-throne'];
  const choice=['freedom-bill','blame-mirror','choice-responsibility','free-society-whisper','roads-not-taken','doom-takes-blame'];
  const fromm=['fromm-book','chains-fall','identity-void','life-crossroads','doom-decision','escape-to-authority','product-no-choice'];
  const command=['crisis-console','doom-command','meeting-joke','responsibility-transfer','right-to-error','doom-never-wrong'];
  const safety=['family-evening','surveillance-safety','hobbes-chaos','leviathan-bargain','protection-turns','sleep-over-liberty'];
  const perfect=['perfect-dictator-lab','ballot-or-genius','freedom-price','doom-governs-well','uncomfortable-question','freedom-why'];
  const berlin=['berlin-two-liberties','true-interest','for-your-own-good','eternal-child','nursery-state'];
  const algorithm=['streaming-scroll','algorithm-choice','choice-paralysis','mocking-free-man','outsourced-decisions','state-recommendation','small-dooms','recommendation-machine','star-rating'];
  const home=['daughter-bedtime','predictable-tomorrow','predictability-core','future-door','door-closes-warm'];
  const frag=['invoice-arrives','perfect-rule-condition','democracy-friction','replaceable-power','friction-protects','miracle-dependence','god-on-throne'];
  const freedom=['morning-again','self-responsibility-manual','wrong-life-right','inefficient-freedom'];
  const final=['latveria-night','answer-freedom','happiness-without-consent','doom-desire','final-bargain','freedom-after-loss'];
  let body:React.ReactNode=null;
  if(intro.includes(visual)) body=<Intro visual={visual} p={p}/>;
  else if(choice.includes(visual)) body=<Choice visual={visual} p={p}/>;
  else if(fromm.includes(visual)) body=<Fromm visual={visual} p={p}/>;
  else if(command.includes(visual)) body=<Command visual={visual} p={p}/>;
  else if(safety.includes(visual)) body=<Safety visual={visual} p={p}/>;
  else if(perfect.includes(visual)) body=<Perfect visual={visual} p={p}/>;
  else if(berlin.includes(visual)) body=<Berlin visual={visual} p={p}/>;
  else if(algorithm.includes(visual)) body=<Algorithm visual={visual} p={p}/>;
  else if(home.includes(visual)) body=<Home visual={visual} p={p}/>;
  else if(frag.includes(visual)) body=<Fragility visual={visual} p={p}/>;
  else if(freedom.includes(visual)) body=<Freedom visual={visual} p={p}/>;
  else if(final.includes(visual)) body=<Final visual={visual} p={p}/>;
  else body=<AbsoluteFill style={{background:C.bg}}><SceneTitle text={visual}/></AbsoluteFill>;
  return <AbsoluteFill style={{fontFamily:'Noto Sans CJK JP, sans-serif',overflow:'hidden',background:C.bg}}>{body}<Vignette/><Grain/></AbsoluteFill>;
};
