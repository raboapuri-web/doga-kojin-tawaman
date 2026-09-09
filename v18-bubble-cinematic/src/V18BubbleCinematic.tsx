import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from '../../v17-bubble-no-collapse/src/script-data.json';
import {getActiveBeatAtSeconds} from './timing';
import {Arrow,Big,Building,C,Caption,Car,clamp,Conveyor,Desk,ease,House,lerp,MoneyStack,Paper,Person,Pill,pulse,RobotArm,SceneShell,TimelineDot,Train,Tree,Txt,Wave,WindowGlow} from './cinematic-primitives';

type Beat={id:string;chapter:string;visual:string;narration:string;source?:string};
const beats=scriptData.beats as Beat[];
const ph=(p:number,a:number,b:number)=>clamp((p-a)/(b-a));
const slide=(p:number,a:number,b:number,from:number,to:number)=>lerp(from,to,ease(ph(p,a,b)));
const fade=(p:number,a:number,b:number)=>ease(ph(p,a,b));

const Road=({y=800}:{y?:number})=><><div style={{position:'absolute',left:-100,right:-100,top:y,height:230,background:C.road}}/>{Array.from({length:12},(_,i)=><div key={i} style={{position:'absolute',left:i*190,top:y+105,width:115,height:10,background:'#d8d0b5'}}/>)}</>;

const CityScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
  const q=ease(p); const night=mode!=='ten_percent_city'; const carMove=((p*1700)%2200)-300; const trainMove=((p*1250)%2500)-900; const camX=Math.sin(p*Math.PI)*-45;
  return <SceneShell chapter={beat.chapter} source={beat.source} bg={night?C.night:'#dfe8ec'} cameraX={camX} zoom={1+.025*Math.sin(p*Math.PI)}>
    <div style={{position:'absolute',inset:0,background:night?'linear-gradient(#07111d,#15263a 60%,#111820)':'linear-gradient(#dbe7ed,#eef1ed 66%,#cad8d0)'}}/>
    {Array.from({length:11},(_,i)=><Building key={i} x={20+i*185} y={330-(i%4)*58} w={145+(i%2)*25} h={650+(i%4)*58} lit={night?.62:.18} label={mode==='giant_japan'&&i%3===0?'JAPAN GLOBAL':''} color={i%2?'#23394d':'#1b3043'}/>)}
    <Road y={790}/>
    <Car x={carMove} y={810} s={.85} color="#8199ae"/><Car x={1850-carMove*.65} y={900} s={.72} color="#9f7268"/>
    <div style={{position:'absolute',left:-100,right:-100,top:690,height:18,background:'#64727d'}}/><Train x={trainMove} y={555} s={.58}/>
    {Array.from({length:12},(_,i)=><Person key={i} x={90+i*155+Math.sin(p*5+i)*12} y={760+(i%2)*25} s={.42} shirt={i%3===0?'#657d94':'#4d5d6f'} walk={p*3+i*.1}/>) }
    <div style={{position:'absolute',right:120,top:120,width:520,height:184,borderRadius:18,background:'rgba(9,15,24,.9)',border:'3px solid #62768a',boxShadow:'0 0 50px rgba(93,174,221,.14)'}}><Txt x={24} y={24} w={470} size={39} color={C.white} align="center">日経平均 76,430円</Txt><Txt x={24} y={88} w={470} size={33} color={C.cyan} align="center">実質GDP 721兆円</Txt></div>
    {mode==='giant_japan'&&<><Txt x={105} y={130} w={850} size={64} color={C.white}>日本企業のロゴが<br/>世界都市を埋める</Txt><div style={{position:'absolute',left:180,top:360,width:780,height:5,background:C.gold,transform:`scaleX(${q})`,transformOrigin:'0 50%'}}/></>}
    {mode==='rich_tokyo'&&<><Pill x={120} y={160} text="失われた十年なし" color={C.green}/><Pill x={120} y={230} text="就職氷河期 小さい" color={C.blue}/><Pill x={120} y={300} text="平均給与 高い" color={C.gold}/></>}
    {mode==='tokyo_night_final'&&<Txt x={100} y={145} w={880} size={70} color={C.white}>強い日本。<br/><span style={{color:C.cyan}}>しかし、誰にとって？</span></Txt>}
    {mode==='ten_percent_city'&&<><div style={{position:'absolute',left:120,top:130,width:740,height:4,background:C.muted}}/><div style={{position:'absolute',left:1080,top:130,width:740,height:4,background:C.red}}/><Txt x={150} y={160} w={650} size={46} align="center">現実</Txt><Txt x={1110} y={160} w={650} size={46} align="center" color={C.red}>+10%の経済</Txt></>}
  </SceneShell>;
};

const HouseQuestionScene=({beat,p,final=false}:{beat:Beat;p:number;final?:boolean})=>{
  const paperX=slide(p,.12,.38,1980,1020); const screen=fade(p,.48,.7); const head=Math.sin(p*8)*3;
  return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e9e0d4" cameraX={-20*ease(p)} zoom={1+.03*ease(p)}>
    <div style={{position:'absolute',left:120,top:180,width:760,height:700,background:'#d9c6ac',border:'18px solid #8b6b52'}}><WindowGlow x={80} y={80} w={250} h={210} on={.45}/><div style={{position:'absolute',left:455,top:72,width:180,height:500,background:'#755844'}}/><Tree x={-80} y={410} s={.85} sway={Math.sin(p*5)*1.5}/></div>
    <Desk x={1030} y={655} w={680}/><Person x={1090} y={430+head} s={.83} shirt="#5e7489"/><Person x={1325} y={430-head} s={.83} shirt="#916977"/><Person x={1580} y={415} s={.85} shirt="#65735f"/>
    <div style={{position:'absolute',left:paperX,top:510,width:390,height:250,background:'#fffdf6',border:'3px solid #aaa394',boxShadow:'0 18px 40px rgba(0,0,0,.2)',transform:'rotate(-3deg)'}}><Txt x={30} y={28} w={330} size={30} align="center">マンション 65㎡</Txt><Txt x={30} y={88} w={330} size={50} color={C.red} align="center">1億800万円</Txt><Txt x={30} y={166} w={330} size={24} align="center">駅徒歩12分</Txt></div>
    <div style={{position:'absolute',left:1100,top:165,width:520,height:220,borderRadius:18,background:'#17202b',opacity:screen}}><Txt x={25} y={30} w={470} size={34} color={C.white} align="center">住宅情報サイト</Txt><Txt x={25} y={95} w={470} size={58} color={C.red} align="center">¥108,000,000</Txt></div>
    {final?<Txt x={180} y={110} w={760} size={58}>GDPは増えた。<br/>家の値段も増えた。</Txt>:<Txt x={200} y={110} w={760} size={58}>願望ではなく、<br/>数字で別の日本を作る。</Txt>}
  </SceneShell>;
};

const TSEScene=({beat,p,rewind=false}:{beat:Beat;p:number;rewind?:boolean})=>{
  const q=ease(p); const value=rewind?38700+Math.floor(q*215):38915; const cam=slide(p,0,1,40,-55);
  return <SceneShell chapter={beat.chapter} source={beat.source} bg="#15181d" cameraX={cam} zoom={1+.05*q}>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 40%,#27313b,#101419 68%)'}}/>
    <div style={{position:'absolute',left:430,top:120,width:1060,height:220,background:'#020405',border:'6px solid #48525d',boxShadow:'0 0 36px rgba(206,76,76,.18)'}}><Txt x={30} y={42} w={1000} size={94} color={C.red} align="center">{value.toLocaleString('ja-JP')}円</Txt></div>
    {Array.from({length:22},(_,i)=>{const row=Math.floor(i/11),col=i%11;return <Person key={i} x={35+col*175+Math.sin(p*7+i)*6} y={470+row*230} s={.52} shirt={i%4===0?'#44566c':'#58616d'} walk={p*2+i*.12} arm={i%3===0?-25:0}/>})}
    {Array.from({length:10},(_,i)=><Paper key={i} x={100+i*180} y={360+(i%3)*90} rot={-18+i*4} p={(p+i*.07)%1} text={i%2?'買':'売'}/>)}
    {Array.from({length:7},(_,i)=><div key={i} style={{position:'absolute',left:120+i*250,top:840+(i%2)*25,width:90,height:38,borderRadius:10,background:'#20272f'}}><div style={{position:'absolute',left:26,top:-60,width:36,height:70,background:'#303942',transform:`rotate(${Math.sin(p*12+i)*12}deg)`,transformOrigin:'18px 65px'}}/></div>)}
    <Txt x={560} y={360} w={800} size={33} color={C.white} align="center">1989年12月29日　東京証券取引所</Txt>
    {rewind&&<div style={{position:'absolute',left:120,top:130,width:240,height:240,borderRadius:'50%',border:'10px solid rgba(255,255,255,.35)',transform:`rotate(${-q*330}deg)`}}><div style={{position:'absolute',left:-25,top:85,borderTop:'28px solid transparent',borderBottom:'28px solid transparent',borderRight:'45px solid rgba(255,255,255,.5)'}}/></div>}
  </SceneShell>;
};

const CreditScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
  const q=ease(p); const money=fade(p,.2,.45); const build=fade(p,.45,.78); const debt=fade(p,.65,.95);
  return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e8e5dc" cameraX={-25*Math.sin(p*Math.PI)} zoom={1+.025*q}>
    <div style={{position:'absolute',left:90,top:500,width:520,height:330,background:'#bea16d',transform:`scale(${mode==='land_crash'?1-q*.48:1})`,transformOrigin:'50% 100%',boxShadow:'0 18px 30px rgba(0,0,0,.16)'}}><Txt x={90} y={120} w={340} size={48} align="center">土地</Txt></div>
    <Building x={265} y={260} w={180} h={280} lit={.3} color="#77705f"/>
    <div style={{position:'absolute',left:740,top:230,width:430,height:560,background:'#d8d0bd',border:'7px solid #8a806d',borderRadius:18}}><Txt x={55} y={52} w={320} size={46} align="center">銀行</Txt><div style={{position:'absolute',left:90,top:150,width:250,height:200,border:'9px solid #6c747b',background:'#454c53'}}><div style={{position:'absolute',left:82,top:58,width:88,height:88,borderRadius:'50%',border:'10px solid #aeb6ba'}}/></div><MoneyStack x={110} y={475} count={6} s={.72}/></div>
    <div style={{position:'absolute',left:1320,top:290,width:470,height:500,background:'#cfd8d1',border:'7px solid #7f8d83',borderRadius:18}}><Txt x={70} y={50} w={330} size={46} align="center">企業</Txt><RobotArm x={85} y={205} p={p*2} s={.65}/><Conveyor x={35} y={390} w={390} p={p}/></div>
    {mode==='credit_loop'&&<><div style={{position:'absolute',left:560,top:480,width:190,height:18,background:C.gold,transform:`scaleX(${money})`,transformOrigin:'0 50%'}}/><div style={{position:'absolute',left:1180,top:480,width:150,height:18,background:C.green,transform:`scaleX(${build})`,transformOrigin:'0 50%'}}/><div style={{position:'absolute',left:1280,top:835,width:1050,height:16,background:C.red,transform:`scaleX(${debt}) rotate(180deg)`,transformOrigin:'0 50%'}}/><Txt x={500} y={845} w={950} size={38} align="center">土地 → 担保 → 融資 → 投資 → また土地</Txt></>}
    {mode==='debt_29'&&<><Big x={1040} y={110} value="+29pt" label="企業部門の銀行借入 / GDP比" color={C.red}/>{Array.from({length:9},(_,i)=><MoneyStack key={i} x={920+i*65} y={820-i*28*q} count={2} s={.48} color="#bf6861"/>)}</>}
    {mode==='land_crash'&&<><Txt x={90} y={125} w={620} size={58}>土地 100億円 → 30億円</Txt><Big x={1240} y={120} value="借金 100億円" color={C.red} size={58}/><div style={{position:'absolute',left:560,top:560,width:150,height:250,background:'#9eafb5',opacity:q}}><Txt x={10} y={80} w={130} size={28} align="center">担保価値<br/>崩落</Txt></div></>}
    {mode==='balance_sheet'&&<><Desk x={1180} y={700} w={520}/><Person x={1280} y={450} s={.72} shirt="#3f5468"/><div style={{position:'absolute',left:1475,top:605,width:130,height:85,background:'#343a41',borderRadius:12,transform:`rotate(${Math.sin(p*18)*2}deg)`}}><Txt x={10} y={18} w={110} size={26} color={C.white} align="center">100億</Txt></div><Txt x={1010} y={115} w={760} size={55} align="center">成長より、返済が主役になる。</Txt></>}
  </SceneShell>;
};

const CrashScene=({beat,p}:{beat:Beat;p:number})=>{
  const q=ease(p); const drop=lerp(0,420,q); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#151a20" zoom={1+.02*q}>
    <div style={{position:'absolute',left:100,top:120,width:1720,height:250,background:'#080a0d',border:'5px solid #4a535c'}}>{Array.from({length:10},(_,i)=><Txt key={i} x={30+i*165} y={45+(i%2)*70} w={150} size={34} color={i%3===0?C.red:C.green} align="center">{Math.round(38915-(i*420+q*600))}</Txt>)}</div>
    <svg style={{position:'absolute',left:180,top:360,width:1560,height:500}} viewBox="0 0 1560 500"><polyline points={`0,70 260,62 520,75 780,95 1040,${120+drop*.55} 1320,${150+drop*.75} 1540,${170+drop*.78}`} fill="none" stroke={C.red} strokeWidth="16"/></svg>
    {Array.from({length:9},(_,i)=><Paper key={i} x={160+i*180} y={480+i%3*80} rot={i*9-30} p={(p+i*.11)%1}/>) }
    {Array.from({length:9},(_,i)=><Person key={i} x={100+i*205} y={720} s={.52} shirt="#455568" arm={-20*q} walk={p+i*.1}/>) }
    <Big x={1210} y={480} value="約 -50%" color={C.red}/>
  </SceneShell>;
};

const GrowthScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
  const q=ease(p); const years=['1990','1995','2000','2005','2010','2020','2025'];
  const actual=[100,107,116,119,123,136,145], alt=[100,113,128,137,146,167,174];
  const pts=(arr:number[],raise=0)=>arr.map((v,i)=>`${210+i*245},${800-(v-95)*7-raise}`).slice(0,Math.max(2,Math.floor(q*arr.length)+1)).join(' ');
  return <SceneShell chapter={beat.chapter} source={beat.source} bg="#edf0eb" cameraX={Math.sin(p*Math.PI)*-18}>
    <svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}} viewBox="0 0 1920 1080"><line x1="200" y1="820" x2="1720" y2="820" stroke="#9aa1a6" strokeWidth="4"/><line x1="200" y1="220" x2="200" y2="820" stroke="#9aa1a6" strokeWidth="4"/>{mode!=='growth_44_15_06'&&<><polyline points={pts(actual)} fill="none" stroke={C.muted} strokeWidth="11"/><polyline points={pts(alt,15)} fill="none" stroke={C.red} strokeWidth="12"/></>}{years.map((y,i)=><text key={y} x={195+i*245} y="875" fontFamily="Noto Sans CJK JP" fontSize="25" fill="#5f6770">{y}</text>)}</svg>
    {mode==='growth_44_15_06'&&<>{[['1980年代','4.4%',.82,C.blue],['1990年代','1.5%',.3,C.gold],['2000年代','0.6%',.12,C.red]].map(([lab,val,h,col],i)=><div key={String(lab)} style={{position:'absolute',left:330+i*500,top:760-Number(h)*530,width:230,height:Number(h)*530*q,background:String(col),borderRadius:'18px 18px 0 0',transformOrigin:'50% 100%'}}><Txt x={0} y={-75} w={230} size={54} align="center" color={String(col)}>{String(val)}</Txt><Txt x={0} y={Number(h)*530+25} w={230} size={30} align="center">{String(lab)}</Txt></div>)}</>}
    {mode==='compound_gap'&&<><MoneyStack x={310} y={700} count={Math.max(1,Math.floor(4+q*3))} s={.7}/><MoneyStack x={1240} y={700} count={Math.max(1,Math.floor(4+q*8))} s={.7} color="#c58f45"/><Txt x={180} y={170} w={1560} size={58} align="center">1%と2.5%は、時間と一緒に別世界になる。</Txt></>}
    {mode==='index_1990_2000'&&<><Pill x={350} y={185} text="現実 116" color={C.muted}/><Pill x={1240} y={185} text="反実仮想 128" color={C.red}/></>}
    {mode==='potential_growth'&&<><Pill x={270} y={190} text="潜在成長率 1990: 3.1%"/><Pill x={1230} y={190} text="2000: 1.0%" color={C.muted}/></>}
    {mode==='potential_falls'&&<><div style={{position:'absolute',left:360,top:270,width:220,height:420,background:'#71899e',transform:`scaleY(${1-q*.55})`,transformOrigin:'50% 100%'}}/><div style={{position:'absolute',left:850,top:380,width:220,height:310,background:'#8aa47d',transform:`scaleY(${1-q*.45})`,transformOrigin:'50% 100%'}}/><div style={{position:'absolute',left:1340,top:480,width:220,height:210,background:'#be8b68',transform:`scaleY(${1-q*.4})`,transformOrigin:'50% 100%'}}/><Txt x={300} y={720} w={340} size={32} align="center">資本蓄積</Txt><Txt x={790} y={720} w={340} size={32} align="center">生産性</Txt><Txt x={1280} y={720} w={340} size={32} align="center">企業投資</Txt></>}
    {mode==='counterfactual_rates'&&<><Pill x={260} y={185} text="91-95年 2.8%"/><Pill x={760} y={185} text="96-00年 2.2%" color={C.gold}/><Pill x={1280} y={185} text="10年平均 約2.5%" color={C.red}/></>}
    {mode==='growth_2000s'&&<><Pill x={400} y={185} text="現実 約0.6%" color={C.muted}/><Pill x={1160} y={185} text="反実仮想 1.2〜1.4%" color={C.red}/></>}
    {mode==='index_2010'&&<><Pill x={350} y={185} text="現実 123" color={C.muted}/><Pill x={1240} y={185} text="反実仮想 146" color={C.red}/></>}
  </SceneShell>;
};

const TenPercentCity=({beat,p}:{beat:Beat;p:number})=><CityScene beat={beat} p={p} mode="ten_percent_city"/>;

const FactoryScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
  const q=ease(p); const shutter=slide(p,0,.3,0,-280); const workerX=slide(p,.16,.75,-250,1350); const vanish=fade(p,.45,.8);
  return <SceneShell chapter={beat.chapter} source={beat.source} bg="#dce5e7" cameraX={slide(p,0,1,50,-55)} zoom={1+.03*q}>
    <div style={{position:'absolute',left:80,top:235,width:1760,height:650,background:'#bfc8cb',border:'8px solid #7f8a8e'}}/>
    <div style={{position:'absolute',left:120,top:310,width:700,height:490,background:'#8d9aa0'}}><div style={{position:'absolute',left:0,top:shutter,width:700,height:300,background:'repeating-linear-gradient(0deg,#717d83 0 22px,#808c92 22px 44px)'}}/><Txt x={120} y={340} w={460} size={40} color={C.white} align="center">KANAGAWA ELECTRONICS</Txt></div>
    <Conveyor x={780} y={680} w={900} p={p*2}/><RobotArm x={850} y={420} p={p*2}/><RobotArm x={1230} y={420} p={p*2+.25}/>
    {Array.from({length:7},(_,i)=><Person key={i} x={workerX-i*160} y={610+(i%2)*15} s={.45} shirt="#55758a" walk={p*5+i*.1}/>) }
    <div style={{position:'absolute',left:1450,top:300,width:300,height:260,background:'#eff6f6',border:'5px solid #778c91'}}><div style={{position:'absolute',left:55,top:52,width:190,height:120,background:'#a5d0db',transform:`rotate(${Math.sin(p*5)*2}deg)`}}/><Txt x={30} y={185} w={240} size={26} align="center">液晶 試作室</Txt></div>
    {mode==='factory_morning'&&<><Txt x={120} y={110} w={700} size={54}>1994年 7:18<br/>工場が目を覚ます。</Txt><div style={{position:'absolute',left:1600,top:110,width:130,height:130,borderRadius:'50%',border:'8px solid '#66727a'}}><div style={{position:'absolute',left:60,top:18,width:6,height:48,background:'#66727a',transform:`rotate(${p*120}deg)`,transformOrigin:'3px 47px'}}/><div style={{position:'absolute',left:60,top:60,width:42,height:6,background:'#66727a',transform:`rotate(${p*45}deg)`,transformOrigin:'3px 3px'}}/></div></>}
    {mode==='capex_down20'&&<><Txt x={110} y={105} w={700} size={56}>5つ建つはずの工場が、<br/>4つになる。</Txt>{Array.from({length:5},(_,i)=><div key={i} style={{position:'absolute',left:210+i*300,top:740,width:210,height:150,background:i===4?`rgba(170,83,83,${1-vanish})`:'#718891',border:'5px solid #576b73',transform:i===4?`translateY(${vanish*160}px) rotate(${vanish*12}deg)`:'none'}}><Txt x={25} y={50} w={160} size={30} color={C.white} align="center">工場 {i+1}</Txt></div>)}</>}
    {mode==='multiplier_factory'&&<><div style={{position:'absolute',left:110,top:95,width:1700,height:190}}>{['機械メーカー','建設会社','ボーナス','家計消費','次の投資'].map((t,i)=><React.Fragment key={t}><Pill x={50+i*320} y={50} text={t} color={[C.blue,C.gold,C.green,C.red,C.muted][i]}/>{i<4&&<Arrow x={260+i*320} y={79} w={95}/>}</React.Fragment>)}</div><div style={{position:'absolute',left:200,top:310,width:1500,height:15,background:C.red,transform:`scaleX(${1-q*.45})`,transformOrigin:'0 50%'}}/></>}
    {mode==='factory_survives'&&<><Txt x={120} y={105} w={950} size={52}>1995 工場 → 1996 研究所 → 1998 半導体工場</Txt>{[0,.25,.52].map((t,i)=><Building key={i} x={210+i*500} y={520-fade(p,t,t+.3)*180} w={280} h={350+fade(p,t,t+.3)*180} lit={.5} label={['工場','研究所','半導体'][i]} color={['#607b88','#5d7086','#536b79'][i]}/>)}</>}
    {mode==='investment_productivity'&&<><Txt x={110} y={105} w={1650} size={52} align="center">設備投資 → 資本蓄積 → 生産性</Txt><div style={{position:'absolute',left:240,top:300,width:1450,height:18,background:'#aeb7bc'}}><div style={{width:`${q*100}%`,height:'100%',background:C.green}}/></div></>}
  </SceneShell>;
};

const NewsScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
  const q=ease(p); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#ddd7cd" cameraX={-12*q} zoom={1+.02*q}>
    <div style={{position:'absolute',left:100,top:180,width:1030,height:640,background:'#b8b2a8',border:'16px solid #716d65'}}><div style={{position:'absolute',left:80,top:80,width:870,height:480,background:'linear-gradient(#193148,#315b77)'}}/><Person x={495} y={370} s={.72} shirt="#363e48"/><Desk x={310} y={645} w={520}/><div style={{position:'absolute',left:120,top:530,width:800,height:70,background:C.red,transform:`translateX(${slide(p,.15,.55,900,0)}px)`}}><Txt x={20} y={10} w={760} size={34} color={C.white} align="center">実質経済成長率 2.1%</Txt></div></div>
    <div style={{position:'absolute',left:1220,top:220,width:560,height:520,background:'#f4f0e6',border:'6px solid #8d887d',transform:`rotate(${-2+Math.sin(p*4)}deg)`}}><Txt x={40} y={40} w={480} size={48} align="center">朝刊</Txt><Txt x={55} y={150} w={450} size={46} align="center" color={mode==='lost_decade_erased'?C.muted:C.ink}>{mode==='lost_decade_erased'?'「失われた十年」':'景気 拡大続く'}</Txt>{mode==='lost_decade_erased'&&<div style={{position:'absolute',left:60,top:230,width:440,height:12,background:C.red,transform:`rotate(-8deg) scaleX(${q})`,transformOrigin:'0 50%'}}/>}</div>
    {mode==='compound_economy'&&<>{['売上','税収','投資','雇用','消費'].map((t,i)=><div key={t} style={{position:'absolute',left:1240+Math.cos(i/5*Math.PI*2+p)*210,top:530+Math.sin(i/5*Math.PI*2+p)*210,width:130,height:130,borderRadius:'50%',background:[C.blue,C.gold,C.green,C.red,C.cyan][i],display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Noto Sans CJK JP',fontSize:28,fontWeight:900,color:C.white}}>{t}</div>)}</>}
    {mode==='news_2000'&&<Txt x={1200} y={800} w={600} size={48} align="center">2%成長が「普通」の朝。</Txt>}
  </SceneShell>;
};

const JobScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
  const q=ease(p); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e7e5df" cameraX={mode==='hellowork'?0:-20*q}>
    {mode==='unemployment_21_54'?<><div style={{position:'absolute',left:220,top:270,width:550,height:520,background:'#9cb0b8'}}><Big x={80} y={80} value="2.1%" label="1990" color={C.blue}/></div><div style={{position:'absolute',left:1130,top:270,width:550,height:520,background:'#d0a39e'}}><Big x={80} y={80} value="5.4%" label="2002" color={C.red}/>{Array.from({length:7},(_,i)=><Person key={i} x={60+i*65} y={270} s={.32} shirt="#5f6570"/>)}</div><Arrow x={810} y={500} w={250}/></>:null}
    {mode==='hellowork'?<><div style={{position:'absolute',left:150,top:160,width:1620,height:690,background:'#d5d9d8',border:'8px solid #8c9592'}}><Txt x={60} y={45} w={420} size={44}>ハローワーク 9:00</Txt>{Array.from({length:10},(_,i)=><div key={i} style={{position:'absolute',left:120+i*140,top:430,width:100,height:60,background:'#666f73'}}/>)}<Person x={300} y={430} s={.62} shirt="#67788c"/><Person x={720} y={430} s={.62} shirt="#7c6d65"/><Person x={1160} y={430} s={.62} shirt="#5f7c70"/><Paper x={410} y={590} rot={-5} text="42歳 営業"/><Paper x={830} y={590} rot={3} text="37歳 製造"/><Paper x={1270} y={590} rot={-2} text="24歳 新卒"/></div></>:null}
    {mode==='jobs_saved'?<><div style={{position:'absolute',left:180,top:220,width:1560,height:570,background:'#cad1d0'}}>{Array.from({length:7},(_,i)=><div key={i} style={{position:'absolute',left:120+i*205,top:90,width:150,height:330,background:'#667a84'}}><div style={{position:'absolute',left:30,top:45,width:90,height:110,background:'#a4c6d0',transform:`scaleY(${fade(p,i*.05,.4+i*.05)})`,transformOrigin:'50% 100%'}}/><Txt x={10} y={245} w={130} size={26} color={C.white} align="center">採用</Txt></div>)}</div><Txt x={240} y={120} w={1440} size={54} align="center">閉じた入口が、いくつか開いたまま残る。</Txt></>:null}
    {mode==='life_branches'?<><Person x={220} y={460} s={.8} shirt="#5f7487"/>{[['就職',520,260],['正社員',850,350],['結婚',1190,260],['住宅',1510,350]].map(([t,x,y],i)=><React.Fragment key={String(t)}><div style={{position:'absolute',left:Number(x),top:Number(y),width:220,height:220,borderRadius:'50%',background:[C.blue,C.green,C.gold,C.red][i],opacity:.88}}><Txt x={20} y={75} w={180} size={36} color={C.white} align="center">{String(t)}</Txt></div><Arrow x={390+i*325} y={540-(i%2)*90} w={180}/></React.Fragment>)}</>:null}
  </SceneShell>;
};

const WageScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
  const q=ease(p); const trainX=((p*1400)%2500)-900; return <SceneShell chapter={beat.chapter} source={beat.source} bg="#dfe5e5" cameraX={-30*Math.sin(p*Math.PI)}>
    <div style={{position:'absolute',left:0,right:0,top:690,height:16,background:'#636d73'}}/><Train x={trainX} y={510} s={.78}/>
    <div style={{position:'absolute',left:0,right:0,top:720,height:280,background:'#9aa2a3'}}/>
    {Array.from({length:12},(_,i)=><Person key={i} x={80+i*160} y={620+(i%2)*20} s={.42} shirt={i%3===0?'#566d84':'#69727d'} walk={p*3+i*.1}/>)}
    {mode==='chuo_line_salary'&&<><div style={{position:'absolute',left:100,top:120,width:230,height:230,borderRadius:'50%',background:'#f7f3e8',border:'7px solid #657078'}}><Txt x={25} y={70} w={180} size={44} align="center">8:12</Txt></div><Big x={1210} y={120} value="年収 500万円" color={C.blue}/></>}
    {mode==='wage_flat'&&<><div style={{position:'absolute',left:260,top:180,width:1400,height:13,background:C.muted}}/><TimelineDot x={300} y={172} label="1990 50,800$" color={C.blue}/><TimelineDot x={1530} y={172} label="2024 50,400$" color={C.red}/><Txt x={500} y={290} w={920} size={60} align="center">34年間、ほぼ横ばい。</Txt></>}
    {mode==='wage_counterfactual'&&<><div style={{position:'absolute',left:240,top:180,width:560,height:280,background:'#edf0eb'}}><Big x={55} y={55} value="500万" label="現実の基準" color={C.muted}/></div><div style={{position:'absolute',left:1110,top:180,width:560,height:280,background:'#edf0eb'}}><Big x={55} y={55} value={`${Math.round(500+75*q)}万`} label="+10〜15%の世界" color={C.red}/></div></>}
    {mode==='household_budget'&&<><div style={{position:'absolute',left:180,top:120,width:1560,height:360,background:'#f0ece2',borderRadius:28}}>{['住宅','教育','旅行','子育て'].map((t,i)=><div key={t} style={{position:'absolute',left:120+i*360,top:90,width:220,height:160,borderRadius:24,background:[C.blue,C.green,C.gold,C.red][i]}}><Txt x={20} y={55} w={180} size={36} color={C.white} align="center">{t}</Txt></div>)}</div><Big x={690} y={500} value="30年で 1,500万円" label="年間50万円差の単純合計" color={C.red}/></>}
  </SceneShell>;
};

const PopulationScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
  const q=ease(p); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e9ece8">
    <div style={{position:'absolute',left:120,top:220,width:1680,height:600,background:'#d7ddd7',borderRadius:28}}>
      {Array.from({length:26},(_,i)=>{const hidden=mode==='workers_shrink'&&i>16-Math.floor(q*7);return <Person key={i} x={45+(i%13)*122} y={110+Math.floor(i/13)*265} s={.38} shirt={i%4===0?'#527a89':'#6d7a80'} walk={p+i*.1} face={!hidden} />})}
      {mode==='workers_shrink'&&<div style={{position:'absolute',right:100,top:80,width:500,height:430,background:`rgba(233,236,232,${q*.92})`}}><Txt x={50} y={110} w={400} size={50} align="center">働き手が<br/>静かに減る</Txt></div>}
    </div>
    {mode==='population_peak'&&<><Txt x={220} y={105} w={1480} size={58} align="center">15〜64歳人口は1990年代半ばから減少へ</Txt><div style={{position:'absolute',left:280,top:865,width:1350,height:10,background:C.blue}}><div style={{position:'absolute',left:620,top:-14,width:38,height:38,borderRadius:'50%',background:C.red}}/></div></>}
    {mode==='workers_shrink'&&<><Pill x={250} y={120} text="工場 人手不足"/><Pill x={760} y={120} text="オフィス 人手不足" color={C.gold}/><Pill x={1280} y={120} text="店舗 人手不足" color={C.red}/></>}
  </SceneShell>;
};

const CrisisScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
  const q=ease(p); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#101722" cameraX={slide(p,0,1,25,-35)} zoom={1+.035*q}>
    <div style={{position:'absolute',left:100,top:180,width:760,height:680,background:'#2a3542'}}><Building x={180} y={70} w={400} h={600} lit={.15} label="LEHMAN" color="#263343"/></div>
    {Array.from({length:8},(_,i)=><Person key={i} x={780+i*105} y={585+(i%2)*25} s={.46} shirt="#4b5968" walk={p*2+i*.1}/>) }
    {Array.from({length:5},(_,i)=><div key={i} style={{position:'absolute',left:900+i*150,top:670+(i%2)*30,width:85,height:65,background:'#af885b',transform:`rotate(${i%2?4:-4}deg)`}}/>)}
    <div style={{position:'absolute',right:90,top:150,width:690,height:260,background:'#050708',border:'5px solid #4c5660'}}>{Array.from({length:12},(_,i)=><Txt key={i} x={30+(i%6)*105} y={35+Math.floor(i/6)*95} w={95} size={28} color={C.red} align="center">-{Math.round(2+i*1.7)}%</Txt>)}</div>
    {mode==='global_shock'&&<><div style={{position:'absolute',left:160,top:110,width:1550,height:700,border:'5px solid rgba(255,255,255,.12)',borderRadius:'50%'}}>{Array.from({length:8},(_,i)=><div key={i} style={{position:'absolute',left:120+i*170,top:330+Math.sin(i)*120,width:90,height:45,background:'#587587',transform:`translateX(${Math.sin(p*5+i)*90*q}px)`,opacity:1-q*.65}}/>)}</div><Txt x={450} y={850} w={1050} size={48} color={C.white} align="center">貿易・金融・輸出が同時に縮む。</Txt></>}
    {mode==='stronger_balance'&&<><div style={{position:'absolute',left:0,right:0,bottom:0,height:360}}><Wave p={p*2} height={360} color="#315f82"/></div><div style={{position:'absolute',left:250,top:540,width:1420,height:160,background:'#69747e',borderTop:'12px solid #9ea8b1'}}/><Txt x={520} y={730} w={900} size={48} color={C.white} align="center">同じ津波でも、堤防の高さが違う。</Txt></>}
    {mode==='lehman'&&<Txt x={1100} y={460} w={650} size={58} color={C.white}>2008年9月15日<br/>世界が赤くなる。</Txt>}
  </SceneShell>;
};

const BankRiskScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
  const q=ease(p); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#d8d4c9" cameraX={-20*q} zoom={1+.025*q}>
    <div style={{position:'absolute',left:130,top:180,width:1640,height:650,background:'#c7c0b0',border:'9px solid #817969'}}/><WindowGlow x={220} y={250} w={430} h={280} on={.7}/><WindowGlow x={1270} y={250} w={330} h={280} on={.7}/><Desk x={620} y={640} w={780}/>
    <Person x={690} y={390} s={.68} shirt="#536b82"/><Person x={1210} y={390} s={.72} shirt="#3f4852"/>
    <Paper x={920} y={520} rot={-2} text="借入 300億"/><Paper x={1030} y={535} rot={4} text="港区 土地"/>
    <div style={{position:'absolute',left:1510,top:250,width:150,height:150,borderRadius:'50%',border:'7px solid #646a6e'}}><Txt x={18} y={48} w={115} size={34} align="center">16:00</Txt></div>
    {mode==='moral_hazard'&&<><div style={{position:'absolute',left:250,top:100,width:1300,height:100}}>{['1990 助かった','1997 乗り切った','2001 乗り切った'].map((t,i)=><Pill key={t} x={50+i*430} y={20} text={t} color={[C.blue,C.green,C.gold][i]}/>)}</div><Txt x={500} y={820} w={950} size={48} align="center">助かった回数が、自信に変わる。</Txt></>}
    {mode==='minsky_stability'&&<><div style={{position:'absolute',left:230,top:160,width:240,height:580,background:'#667681',transform:`rotate(${-3+q*8}deg)`,transformOrigin:'50% 100%'}}>{Array.from({length:6},(_,i)=><div key={i} style={{position:'absolute',left:20,top:40+i*82,width:200,height:56,background:i<2?C.green:i<4?C.gold:C.red}}><Txt x={10} y={10} w={180} size={24} color={C.white} align="center">リスク {i+1}</Txt></div>)}</div><Txt x={540} y={170} w={980} size={56}>安定が長いほど、<br/>人は不安定な賭けを始める。</Txt></>}
    {mode==='debt_stack'&&<>{Array.from({length:10},(_,i)=><MoneyStack key={i} x={260+i*140} y={790-i*42*q} count={2} s={.52} color="#b76760"/>)}<Txt x={520} y={120} w={900} size={58} align="center">調整されなかった借金が積み上がる。</Txt></>}
    {mode==='bank_2007'&&<Txt x={230} y={110} w={690} size={56}>「土地は二十年、<br/>下がってないだろ」</Txt>}
  </SceneShell>;
};

const PolicyScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
  const q=ease(p); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e8e3d7" cameraX={Math.sin(p*Math.PI)*-18}>
    <div style={{position:'absolute',left:160,top:190,width:1600,height:650,background:'#d7cdbd',border:'8px solid #8a7d6d'}}><Desk x={420} y={590} w={1080}/>{Array.from({length:5},(_,i)=><Person key={i} x={330+i*300} y={350+(i%2)*30} s={.58} shirt={i%2?'#596978':'#4c5967'}/>) }<div style={{position:'absolute',left:690,top:260,width:500,height:260,background:'#f5f1e6',border:'3px solid #9e978a',transform:'rotate(-2deg)'}}><svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}} viewBox="0 0 500 260"><polyline points={mode==='soft_land_adjust'?`20,50 100,65 180,85 260,${95+q*30} 340,${110+q*40} 460,${125+q*45}`:'20,50 100,65 180,85 260,115 340,165 460,230'} fill="none" stroke={mode==='soft_land_adjust'?C.gold:C.red} strokeWidth="10"/></svg><Txt x={80} y={190} w={340} size={25} align="center">東京 地価</Txt></div></div>
    {mode==='policy_room'&&<><Pill x={250} y={105} text="株価は守る"/><Pill x={780} y={105} text="銀行も潰さない" color={C.green}/><Pill x={1320} y={105} text="土地融資は絞る" color={C.red}/></>}
    {mode==='soft_land_adjust'&&<><Txt x={260} y={105} w={1400} size={54} align="center">暴落ではなく、10年かけて20〜30%調整する。</Txt></>}
    {mode==='macroprudential'&&<><div style={{position:'absolute',left:200,top:100,width:1500,height:90}}>{['自己資本 ↑','LTV ↓','土地担保だけで審査しない'].map((t,i)=><Pill key={t} x={80+i*500} y={10} text={t} color={[C.green,C.red,C.blue][i]}/>)}</div><div style={{position:'absolute',left:250,top:770,width:1420,height:22,background:'#9ca4a6'}}><div style={{width:`${q*80}%`,height:'100%',background:C.green}}/></div></>}
    {mode==='soft_landing_car'&&<><Road y={760}/><Car x={slide(p,0,1,-250,1280)} y={760} s={1.2} color="#667e93"/><div style={{position:'absolute',left:1460,top:640,width:260,height:140,background:'#ece7da',border:'5px solid #8a8276'}}><Txt x={20} y={32} w={220} size={34} align="center">120km/h<br/>→ 60km/h</Txt></div><Txt x={220} y={105} w={1200} size={54}>乗客を起こさず、エンジンも壊さず、後続車にもぶつけない。</Txt></>}
  </SceneShell>;
};

const ScenarioScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
  const q=ease(p); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e9ece7">
    {mode==='scenario_timeline'?<><div style={{position:'absolute',left:210,top:470,width:1500,height:14,background:'#90999f'}}/>{[['1990s','2.5%',280,C.blue],['2000s','1.2〜1.4%',700,C.gold],['2010s〜','約1%',1160,C.green],['2025','720兆円',1540,C.red]].map(([a,b,x,col],i)=><React.Fragment key={String(a)}><TimelineDot x={Number(x)} y={462} label={String(a)} color={String(col)}/><Pill x={Number(x)-80} y={300+(i%2)*130} text={String(b)} color={String(col)}/></React.Fragment>)}{[['リーマン',900],['震災',1110],['コロナ',1400]].map(([t,x])=><div key={String(t)} style={{position:'absolute',left:Number(x),top:520,width:3,height:210,background:C.red,opacity:.7}}><Txt x={-70} y={220} w={145} size={24} align="center">{String(t)}</Txt></div>)}</>:null}
    {mode==='gdp_594_720'||mode==='gdp_compare'||mode==='growth_gap_final'?<><div style={{position:'absolute',left:170,top:230,width:650,height:590,background:'#d9ddda',borderRadius:28}}><Big x={75} y={65} value="594.5兆円" label="現実の日本" color={C.muted}/>{Array.from({length:5},(_,i)=><Building key={i} x={60+i*105} y={280-(i%2)*60} w={90} h={240+(i%2)*60} lit={.28} color="#697a84"/>)}</div><div style={{position:'absolute',left:1080,top:190,width:680,height:630,background:'#e5d6cf',borderRadius:28}}><Big x={80} y={65} value="720兆円" label="中央反実仮想" color={C.red}/>{Array.from({length:7},(_,i)=><Building key={i} x={30+i*90} y={300-(i%3)*65} w={82} h={260+(i%3)*65} lit={.52} color="#6f5560"/>)}</div><Arrow x={845} y={520} w={205}/><Txt x={820} y={590} w={260} size={45} color={C.red} align="center">約+20%</Txt></>:null}
    {mode==='twenty_percent_world'?<><div style={{position:'absolute',left:180,top:220,width:1560,height:600,borderRadius:'50%',border:'5px solid #879399'}}>{['工場','研究','雇用','賃金','消費','税収','投資'].map((t,i)=>{const a=i/7*Math.PI*2+p*.5;return <div key={t} style={{position:'absolute',left:690+Math.cos(a)*560,top:250+Math.sin(a)*230,width:170,height:110,borderRadius:22,background:[C.blue,C.green,C.gold,C.red,C.cyan,C.muted,'#85679a'][i],transform:`scale(${.8+.2*q})`}}><Txt x={10} y={33} w={150} size={30} color={C.white} align="center">{t}</Txt></div>})}<Big x={620} y={230} value="+20%" label="現実より一段大きい" color={C.red}/></div></>:null}
  </SceneShell>;
};

const RealEstateScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
  const q=ease(p); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e6ded2" cameraX={-16*q} zoom={1+.025*q}>
    {mode==='real_estate_108m'?<><div style={{position:'absolute',left:130,top:180,width:1600,height:650,background:'#d5c7b3',border:'9px solid #8b7964'}}><Desk x={610} y={620} w={850}/><Person x={380} y={420} s={.65} shirt="#576d80"/><Person x={590} y={420} s={.65} shirt="#926e7c"/><Person x={1280} y={410} s={.7} shirt="#5f715f"/><div style={{position:'absolute',left:850,top:390,width:390,height:270,background:'#fffdf5',border:'3px solid #a39a88',transform:`translateY(${slide(p,0,.4,-300,0)}px) rotate(-2deg)`}}><Txt x={30} y={30} w={330} size={28} align="center">65㎡ / 駅徒歩12分</Txt><Txt x={30} y={95} w={330} size={58} color={C.red} align="center">1億800万円</Txt><Txt x={30} y={190} w={330} size={24} align="center">「この辺りならまだお手頃です」</Txt></div></div></>:null}
    {mode==='asset_vs_buyer'?<><House x={240} y={370} s={.8}/><Big x={180} y={150} value={`${Math.round(1+2*q)}億円`} label="既に持つ人の資産" color={C.green}/><div style={{position:'absolute',left:1180,top:250,width:480,height:570,background:'#d0d3d0',transform:`translateY(${-q*80}px)`}}><Person x={170} y={250} s={.62} shirt="#5f7186"/><Txt x={40} y={60} w={400} size={45} align="center">これから買う人</Txt><div style={{position:'absolute',left:50,top:420,width:380,height:15,background:C.red,transform:`scaleX(${q})`,transformOrigin:'0 50%'}}/></div></>}
    {mode==='income_vs_house'?<><div style={{position:'absolute',left:260,top:220,width:500,height:570,background:'#d9e1dc'}}><Big x={65} y={60} value={`+${Math.round(q*15)}%`} label="給料" color={C.green}/><div style={{position:'absolute',left:190,bottom:70,width:120,height:220,background:C.green,transform:`scaleY(${.4+.6*q})`,transformOrigin:'50% 100%'}}/></div><div style={{position:'absolute',left:1140,top:160,width:520,height:630,background:'#ead8d1'}}><Big x={65} y={60} value={`+${Math.round(q*40)}%`} label="住宅価格" color={C.red}/><House x={50} y={275} s={.85}/></div></>}
  </SceneShell>;
};

const InheritanceScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
  const q=ease(p); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e8e2d4" cameraX={slide(p,0,1,25,-25)}>
    {mode==='setagaya_inheritance'?<><House x={210} y={350} s={1.1}/><Tree x={90} y={430} s={1.1} sway={Math.sin(p*6)*1.8}/><Tree x={720} y={470} s={.85} sway={Math.sin(p*5+1)*1.4}/><Person x={1080} y={480} s={.74} shirt="#71836b" arm={-30}/><div style={{position:'absolute',left:1270,top:650,width:180,height:80,borderRadius:'50%',border:'5px solid #6d7c81',transform:`rotate(${p*25}deg)`}}/><Big x={1110} y={190} value="資産価値 3億円" label="ただ住んでいただけ" color={C.green}/></>}
    {mode==='young_renter'?<><div style={{position:'absolute',left:190,top:230,width:650,height:590,background:'#d5c7b6',border:'8px solid #8c7e6b'}}><div style={{position:'absolute',left:90,top:90,width:240,height:180,background:C.glass}}/><div style={{position:'absolute',left:370,top:80,width:170,height:400,background:'#705442'}}/><Person x={230} y={430} s={.67} shirt="#5c7186"/></div><Train x={1020+Math.sin(p*2)*60} y={600} s={.65}/><Big x={1110} y={190} value="土地 0円" label="同じ学歴・同じ会社・同じ能力" color={C.red}/></>}
    {mode==='inheritance_split'?<><div style={{position:'absolute',left:260,top:150,width:1400,height:100}}><div style={{position:'absolute',left:0,right:0,top:45,height:12,background:'#a9a198'}}/></div><House x={700} y={280} s={.82}/><Person x={875} y={120} s={.5} shirt="#786c62"/><div style={{position:'absolute',left:950,top:520,width:12,height:190,background:C.green,transform:`scaleY(${q})`,transformOrigin:'50% 0'}}/><div style={{position:'absolute',left:430,top:690,width:1020,height:12,background:C.green,transform:`scaleX(${q})`,transformOrigin:'50% 50%'}}/><Person x={420} y={650} s={.56} shirt="#5d7287"/><Person x={1340} y={650} s={.56} shirt="#8d6d79"/><MoneyStack x={480} y={835} count={6} s={.5}/><MoneyStack x={1390} y={835} count={6} s={.5}/><Txt x={500} y={120} w={900} size={54} align="center">資産価格が次世代へ流れる。</Txt></>}
    {mode==='who_is_rich'?<><div style={{position:'absolute',left:150,top:200,width:1620,height:620,background:'linear-gradient(90deg,#d8e0e4,#e7d7d0)',borderRadius:38}}><div style={{position:'absolute',left:220+q*900,top:80,width:420,height:420,borderRadius:'50%',background:'radial-gradient(circle,rgba(255,240,170,.88),rgba(255,240,170,0) 70%)'}}/><Person x={370} y={420} s={.72} shirt="#5d7184"/><Person x={1260} y={420} s={.72} shirt="#7c675d"/><House x={1080} y={400} s={.58}/><Txt x={470} y={120} w={980} size={66} align="center">「日本は豊かか？」ではない。<br/><span style={{color:C.red}}>誰が豊かか？</span></Txt></div></>}
  </SceneShell>;
};

const BlindSpotScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
  const q=ease(p); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e7e3da">
    <div style={{position:'absolute',left:150,top:160,width:1620,height:690,background:'#d2d4d0',borderRadius:30}}><div style={{position:'absolute',left:160,top:110,width:620,height:420,background:'#f4f1e8',border:'4px solid #9b978e'}}><Txt x={45} y={45} w={530} size={42} align="center">GDP統計</Txt>{['生産','所得','投資','消費'].map((t,i)=><div key={t} style={{position:'absolute',left:70,top:130+i*62,width:430,height:38,background:[C.blue,C.green,C.gold,C.red][i],transform:`scaleX(${q})`,transformOrigin:'0 50%'}}><Txt x={10} y={3} w={400} size={22} color={C.white}>{t}</Txt></div>)}</div><div style={{position:'absolute',right:120,top:90,width:660,height:500,background:'#cdbca5',border:'7px solid #8c7960'}}><Person x={150} y={250} s={.6} shirt="#5c7082"/><Person x={360} y={250} s={.6} shirt="#926e7d"/><div style={{position:'absolute',left:100,top:90,width:450,height:100,background:'#17202a'}}><Txt x={20} y={25} w={410} size={34} color={C.red} align="center">1億800万円</Txt></div></div></div>
    {mode==='gdp_blind_spot'&&<Txt x={450} y={860} w={1000} size={46} align="center">統計には、「諦めた人生」は載らない。</Txt>}
    {mode==='real_answer'&&<Txt x={330} y={860} w={1260} size={44} align="center">大きい経済 ≠ 公平な社会 ≠ 人生を始めやすい社会</Txt>}
  </SceneShell>;
};

const BetterFutureScene=({beat,p}:{beat:Beat;p:number})=>{
  const q=ease(p); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e8ece8">
    <div style={{position:'absolute',left:110,top:220,width:1700,height:590,background:'#d2d9d5',borderRadius:36}}>{[['土地',C.muted],['株',C.muted],['技術',C.blue],['生産性',C.green],['賃金',C.gold],['新企業',C.red]].map(([t,col],i)=><div key={String(t)} style={{position:'absolute',left:100+i*260,top:230-Math.max(0,i-1)*28*q,width:190,height:210,background:String(col),borderRadius:24,opacity:i<2?1-q*.55:.65+.35*q}}><Txt x={20} y={75} w={150} size={34} color={C.white} align="center">{String(t)}</Txt></div>)}</div><Txt x={260} y={110} w={1400} size={58} align="center">欲しかったのは「バブル継続」ではなく、<br/>成長の中身を変える未来だった。</Txt>
  </SceneShell>;
};

const FinalLineScene=({beat,p}:{beat:Beat;p:number})=>{
  const q=ease(p); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#101721" cameraX={-25*q} zoom={1+.03*q}>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(#0b1421,#1b2a39 60%,#0f151c)'}}/>{Array.from({length:8},(_,i)=><Building key={i} x={80+i*230} y={350-(i%3)*70} w={180} h={650+(i%3)*70} lit={.58} color="#203246"/>)}<Road y={820}/><Car x={slide(p,0,1,-300,1400)} y={845} s={.8}/><div style={{position:'absolute',left:220,top:180,width:570,height:260,background:'#0c1117',border:'4px solid #677585'}}><Txt x={35} y={35} w={500} size={44} color={C.white} align="center">GDP 720兆円</Txt><Txt x={35} y={120} w={500} size={58} color={C.red} align="center">マンション 1億円</Txt></div><Person x={1280} y={520} s={.72} shirt="#5f7285"/><Person x={1490} y={520} s={.72} shirt="#8d6c79"/><Txt x={260} y={525} w={850} size={62} color={C.white}>「昔はもっと、<br/>普通に家が買えたらしいよ」</Txt><div style={{position:'absolute',left:245,top:700,width:850,height:5,background:C.red,transform:`scaleX(${q})`,transformOrigin:'0 50%'}}/>
  </SceneShell>;
};

function Visual({beat,p}:{beat:Beat;p:number}){
  const v=beat.visual;
  if(['tokyo_2026','giant_japan','rich_tokyo','tokyo_night_final'].includes(v)) return <CityScene beat={beat} p={p} mode={v}/>;
  if(['question_house','couple_again','final_house'].includes(v)) return <HouseQuestionScene beat={beat} p={p} final={v!=='question_house'}/>;
  if(['tse_1989','tse_rewind'].includes(v)) return <TSEScene beat={beat} p={p} rewind={v==='tse_rewind'}/>;
  if(['credit_loop','debt_29','land_crash','balance_sheet'].includes(v)) return <CreditScene beat={beat} p={p} mode={v}/>;
  if(v==='crash_half') return <CrashScene beat={beat} p={p}/>;
  if(['growth_44_15_06','compound_gap','index_1990_2000','potential_growth','potential_falls','counterfactual_rates','growth_2000s','index_2010'].includes(v)) return <GrowthScene beat={beat} p={p} mode={v}/>;
  if(v==='ten_percent_city') return <TenPercentCity beat={beat} p={p}/>;
  if(['investment_productivity','factory_morning','capex_down20','multiplier_factory','factory_survives'].includes(v)) return <FactoryScene beat={beat} p={p} mode={v}/>;
  if(['news_2000','lost_decade_erased','compound_economy'].includes(v)) return <NewsScene beat={beat} p={p} mode={v}/>;
  if(['unemployment_21_54','hellowork','jobs_saved','life_branches'].includes(v)) return <JobScene beat={beat} p={p} mode={v}/>;
  if(['chuo_line_salary','wage_flat','wage_counterfactual','household_budget'].includes(v)) return <WageScene beat={beat} p={p} mode={v}/>;
  if(['population_peak','workers_shrink'].includes(v)) return <PopulationScene beat={beat} p={p} mode={v}/>;
  if(v==='lehman'||v==='global_shock'||v==='stronger_balance') return <CrisisScene beat={beat} p={p} mode={v}/>;
  if(['bank_2007','moral_hazard','minsky_stability','debt_stack'].includes(v)) return <BankRiskScene beat={beat} p={p} mode={v}/>;
  if(['policy_room','soft_land_adjust','macroprudential','soft_landing_car'].includes(v)) return <PolicyScene beat={beat} p={p} mode={v}/>;
  if(['scenario_timeline','gdp_594_720','gdp_compare','twenty_percent_world','growth_gap_final'].includes(v)) return <ScenarioScene beat={beat} p={p} mode={v}/>;
  if(['real_estate_108m','asset_vs_buyer','income_vs_house'].includes(v)) return <RealEstateScene beat={beat} p={p} mode={v}/>;
  if(['setagaya_inheritance','young_renter','inheritance_split','who_is_rich'].includes(v)) return <InheritanceScene beat={beat} p={p} mode={v}/>;
  if(['gdp_blind_spot','real_answer'].includes(v)) return <BlindSpotScene beat={beat} p={p} mode={v}/>;
  if(v==='better_future') return <BetterFutureScene beat={beat} p={p}/>;
  if(v==='final_line') return <FinalLineScene beat={beat} p={p}/>;
  return <SceneShell chapter={beat.chapter} source={beat.source}><Txt x={220} y={300} w={1480} size={64} align="center">{beat.chapter}</Txt><Txt x={320} y={520} w={1280} size={42} align="center">{beat.narration.slice(0,70)}</Txt></SceneShell>;
}

export const V18BubbleCinematic:React.FC=()=>{
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const seconds=frame/fps; const active=getActiveBeatAtSeconds(seconds); const beat=beats[active.index]??beats[0];
  return <><Visual beat={beat} p={active.progress}/><Caption text={beat.narration} p={active.progress}/></>;
};
