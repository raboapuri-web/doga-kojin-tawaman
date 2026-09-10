import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {Beat} from './scenes';

const INK='#07090c';
const NAVY='#0d1420';
const BONE='#e8e2d8';
const MUTED='#87909b';
const GOLD='#d6b06d';

const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>{const x=clamp(v);return x*x*(3-2*x);};
const shotOf=(p:number)=>p<.34?0:p<.68?1:2;
const localP=(p:number)=>ease(p<.34?p/.34:p<.68?(p-.34)/.34:(p-.68)/.32);

const Grain=()=> (
  <div style={{position:'absolute',inset:0,opacity:.13,pointerEvents:'none',mixBlendMode:'screen',backgroundImage:'repeating-radial-gradient(circle at 23% 31%,rgba(255,255,255,.12) 0 1px,transparent 1px 4px)',backgroundSize:'8px 8px'}}/>
);

const Stage=({children,bg=INK}:{children:React.ReactNode;bg?:string})=> (
  <AbsoluteFill style={{background:bg,color:BONE,fontFamily:'"Noto Sans JP","Hiragino Kaku Gothic ProN",sans-serif',overflow:'hidden'}}>
    {children}
    <div style={{position:'absolute',left:62,top:42,fontSize:18,letterSpacing:8,color:'rgba(232,226,216,.42)',fontWeight:700}}>TOKYO / SHORT STORY</div>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:190,background:'linear-gradient(transparent,rgba(0,0,0,.68))',pointerEvents:'none'}}/>
    <Grain/>
  </AbsoluteFill>
);

const BigText=({children,x=180,y=270,size=78,color=BONE}:{children:React.ReactNode;x?:number;y?:number;size?:number;color?:string})=> (
  <div style={{position:'absolute',left:x,top:y,fontSize:size,lineHeight:1.45,fontFamily:'serif',fontWeight:500,color,whiteSpace:'pre-line'}}>{children}</div>
);

const Skyline=({shift=0,opacity=.62}:{shift?:number;opacity?:number})=> (
  <div style={{position:'absolute',left:-90+shift,right:-90,bottom:155,height:530,opacity}}>
    {Array.from({length:23},(_,i)=>{
      const h=150+((i*83)%350);
      return <div key={i} style={{position:'absolute',left:i*92,bottom:0,width:70,height:h,background:i%4===0?'#182334':'#111923',borderTop:'1px solid #2a3440'}}>
        {Array.from({length:Math.floor(h/48)},(_,j)=><div key={j} style={{position:'absolute',left:11+(j%2)*31,top:18+j*38,width:8,height:12,background:(i+j)%5===0?'rgba(236,193,111,.78)':'rgba(105,129,153,.16)'}}/>)}
      </div>;
    })}
  </div>
);

const Man=({x=860,y=280,s=1}:{x?:number;y?:number;s?:number})=> (
  <div style={{position:'absolute',left:x,top:y,width:230,height:570,transform:`scale(${s})`,transformOrigin:'top left'}}>
    <div style={{position:'absolute',left:72,top:0,width:86,height:100,borderRadius:'48%',background:'#15191f'}}/>
    <div style={{position:'absolute',left:38,top:92,width:160,height:300,borderRadius:'54px 54px 20px 20px',background:'linear-gradient(90deg,#151a21,#29323d 52%,#12171e)'}}/>
    <div style={{position:'absolute',left:64,top:384,width:48,height:180,background:'#151a20'}}/>
    <div style={{position:'absolute',left:129,top:384,width:48,height:180,background:'#151a20'}}/>
  </div>
);

const Woman=({x=650,y=315,s=1}:{x?:number;y?:number;s?:number})=> (
  <div style={{position:'absolute',left:x,top:y,width:180,height:500,transform:`scale(${s})`,transformOrigin:'top left'}}>
    <div style={{position:'absolute',left:56,top:0,width:72,height:88,borderRadius:'48%',background:'#b68b75'}}/>
    <div style={{position:'absolute',left:26,top:82,width:132,height:260,borderRadius:'45px 45px 14px 14px',background:'#9b928a'}}/>
    <div style={{position:'absolute',left:47,top:335,width:38,height:155,background:'#36383b'}}/>
    <div style={{position:'absolute',left:96,top:335,width:38,height:155,background:'#36383b'}}/>
  </div>
);

const Phone=({children,x=780,y=125,scale=1}:{children:React.ReactNode;x?:number;y?:number;scale?:number})=> (
  <div style={{position:'absolute',left:x,top:y,width:360,height:710,borderRadius:52,background:'#050607',border:'8px solid #333944',boxShadow:'0 34px 100px rgba(0,0,0,.58)',transform:`scale(${scale})`,transformOrigin:'top left',overflow:'hidden'}}>
    <div style={{position:'absolute',left:118,top:14,width:124,height:24,borderRadius:20,background:'#121417',zIndex:5}}/>
    <div style={{position:'absolute',inset:12,borderRadius:40,overflow:'hidden',background:'#f5f3ef',color:'#17191b'}}>{children}</div>
  </div>
);

const Photo=({kind='family',x=560,y=145,w=820,h=690,zoom=1}:{kind?:'park'|'family'|'home';x?:number;y?:number;w?:number;h?:number;zoom?:number})=> {
  const bg=kind==='park'?'linear-gradient(#9aa9b6 0 46%,#66745d 46%)':kind==='family'?'linear-gradient(#c4ad8e,#806f5d)':'linear-gradient(#a79c8e,#5d5750)';
  return <div style={{position:'absolute',left:x,top:y,width:w,height:h,background:'#eeeae1',padding:22,boxShadow:'0 34px 90px rgba(0,0,0,.5)',transform:`rotate(-1deg) scale(${zoom})`,transformOrigin:'center'}}>
    <div style={{position:'relative',width:'100%',height:h-72,overflow:'hidden',background:bg}}>
      {kind==='park'&&<><div style={{position:'absolute',left:0,right:0,bottom:75,height:12,background:'#77706a'}}/><div style={{position:'absolute',left:92,bottom:88,width:360,height:120,borderRadius:'50%',background:'#78866e'}}/></>}
      {kind==='family'&&<div style={{position:'absolute',left:30,right:30,bottom:45,height:110,background:'#a69479',borderRadius:14}}/>}
      {kind==='home'&&<><div style={{position:'absolute',left:42,top:50,width:220,height:170,background:'#827b72'}}/><div style={{position:'absolute',right:38,bottom:45,width:290,height:140,background:'#756b61',borderRadius:20}}/></>}
      <Woman x={150} y={150} s={.72}/>
      <Man x={430} y={155} s={.7}/>
      <div style={{position:'absolute',left:610,top:345,width:50,height:58,borderRadius:'50%',background:'#c89576'}}/>
      <div style={{position:'absolute',left:585,top:395,width:98,height:120,borderRadius:30,background:'#b9aa8d'}}/>
    </div>
  </div>;
};

const SalaryScene=({p}:{p:number})=>{
  const s=shotOf(p),q=localP(p);
  if(s===0)return <Stage bg="#11151b"><div style={{position:'absolute',left:340,top:210,width:1240,height:630,borderRadius:26,background:'#f3f1ec',color:'#20242a',boxShadow:'0 45px 130px rgba(0,0,0,.5)',transform:`scale(${1+.035*q})`}}><div style={{height:78,background:'#e7e4de',borderBottom:'1px solid #cbc5ba',padding:'24px 34px',fontSize:24,color:'#6e747c'}}>COMPENSATION REVIEW</div><div style={{padding:'75px 88px'}}><div style={{fontSize:27,color:'#79818a',letterSpacing:2}}>ANNUAL COMPENSATION</div><div style={{fontSize:98,fontWeight:700,letterSpacing:-4,marginTop:18}}>¥20,000,000</div><div style={{marginTop:56,fontSize:31,color:'#555d65'}}>Your revised compensation is effective immediately.</div></div></div></Stage>;
  if(s===1)return <Stage bg={NAVY}><Skyline shift={-38*q}/><Man x={1260} y={290} s={1.05}/><div style={{position:'absolute',left:210,top:270,fontSize:118,fontWeight:700,letterSpacing:-5}}>¥20,000,000</div><div style={{position:'absolute',left:218,top:425,fontSize:30,color:MUTED,letterSpacing:6}}>AGE 29 / MINATO</div></Stage>;
  return <Stage bg="#0b0e13"><Skyline opacity={.38}/><BigText>欲しかったものは、{`\n`}<span style={{color:GOLD}}>だいたい手に入った。</span></BigText></Stage>;
};

const SushiScene=({p}:{p:number})=>{
  const s=shotOf(p),q=localP(p);
  if(s===0)return <Stage bg="#17120f"><div style={{position:'absolute',left:0,right:0,top:170,height:370,background:'linear-gradient(#2b2019,#18120f)',borderBottom:'20px solid #765239'}}/><div style={{position:'absolute',left:120,right:120,top:540,height:118,background:'#9a6d49'}}/><Man x={860} y={390} s={.73}/><div style={{position:'absolute',left:742,top:286,fontSize:24,letterSpacing:5,color:'#b9aa97'}}>NISHIAZABU / 22:18</div></Stage>;
  if(s===1)return <Stage bg="#15100d"><BigText x={190} y={310} size={52}>一人分の夜に、</BigText><div style={{position:'absolute',left:1010,top:200,width:470,height:620,background:'#eee9dc',color:'#27231f',padding:'58px 48px',boxShadow:'0 30px 85px rgba(0,0,0,.45)',transform:`rotate(${-2+q}deg)`}}><div style={{textAlign:'center',letterSpacing:5,fontSize:23}}>NISHIAZABU</div><div style={{borderTop:'2px dashed #8e877c',margin:'42px 0'}}/><div style={{fontSize:28,lineHeight:2}}>OMAKASE COURSE<br/>SAKE<br/>SERVICE</div><div style={{borderTop:'2px dashed #8e877c',margin:'38px 0'}}/><div style={{display:'flex',justifyContent:'space-between',fontSize:42,fontWeight:700}}><span>TOTAL</span><span>¥38,000</span></div></div></Stage>;
  return <Stage bg="#090b0e"><div style={{position:'absolute',left:390,top:260,width:1140,height:470,borderRadius:26,background:'#151a20',boxShadow:'0 45px 130px #000',transform:`scale(${1+.04*q})`}}><div style={{position:'absolute',left:80,top:90,fontSize:28,color:MUTED}}>CARD PAYMENT</div><div style={{position:'absolute',left:80,top:165,fontSize:70}}>38,000 JPY</div><div style={{position:'absolute',right:90,bottom:80,width:145,height:90,borderRadius:12,background:'#b9a36e'}}/></div></Stage>;
};

const TaxiScene=({p}:{p:number})=>{
  const s=shotOf(p),q=localP(p);
  if(s===0)return <Stage bg="#080b10"><Skyline shift={-150*q} opacity={.8}/><div style={{position:'absolute',inset:'120px 0 0 0',borderTop:'22px solid #161b23',borderLeft:'150px solid #161b23',borderRight:'150px solid #161b23'}}/><div style={{position:'absolute',left:220,top:215,fontSize:28,letterSpacing:6,color:'#a6adb7'}}>TAXI / ROPPONGI</div></Stage>;
  if(s===1)return <Stage bg="#0c1016"><div style={{position:'absolute',left:180,top:160,width:1180,height:700,background:'linear-gradient(90deg,#101722,#17202b)',border:'20px solid #1b222b'}}><Skyline opacity={.38}/></div><div style={{position:'absolute',left:1060,top:165,width:155,height:385,borderRadius:38,background:'#11151a',border:'5px solid #303842'}}>{[0,1,2].map(i=><div key={i} style={{position:'absolute',left:33,top:42+i*104,width:82,height:82,borderRadius:'50%',background:i===0?'#c43537':'#252c33',boxShadow:i===0?`0 0 ${45+20*q}px rgba(224,50,52,.75)`:'none'}}/>)}</div></Stage>;
  return <Stage bg="#090c11"><div style={{position:'absolute',left:150,top:140,width:1600,height:720,borderRadius:40,background:'linear-gradient(135deg,#101722,#202935)',overflow:'hidden'}}><Skyline shift={-100*q} opacity={.34}/><Man x={520} y={240} s={.9}/></div><BigText x={1250} y={220} size={72}>四年前。</BigText></Stage>;
};

const BreakupScene=({p}:{p:number})=>{
  const s=shotOf(p);
  if(s===0)return <Stage bg="#1a1919"><div style={{position:'absolute',left:250,top:180,width:1420,height:680,background:'#282725'}}><div style={{position:'absolute',left:120,top:100,width:520,height:380,background:'#353331'}}/><Woman x={500} y={310} s={.78}/><Man x={1010} y={265} s={.78}/></div><BigText x={310} y={255} size={58}>「仕事ばっかりだね」</BigText></Stage>;
  if(s===1)return <Stage bg="#0c1015"><div style={{position:'absolute',left:285,top:230,fontSize:30,letterSpacing:7,color:MUTED}}>ANNUAL INCOME / 4 YEARS AGO</div><div style={{position:'absolute',left:280,top:310,fontSize:126,fontWeight:700}}>¥4,800,000</div><div style={{position:'absolute',left:290,top:500,width:900,height:5,background:'#3b4653'}}/></Stage>;
  return <Stage bg="#0a0d11"><div style={{position:'absolute',left:420,top:120,width:1080,height:820,background:'linear-gradient(90deg,#1c222a 0 49.7%,#050607 49.7% 50.3%,#1c222a 50.3%)'}}/><BigText x={220} y={220} size={58}>いつか成功して、{`\n`}後悔させようと思った。</BigText></Stage>;
};

const InstagramScene=({p}:{p:number})=>{
  const s=shotOf(p),q=localP(p);
  if(s===0)return <Stage bg="#080b10"><Skyline opacity={.27}/><div style={{position:'absolute',left:250,top:160,width:1420,height:720,background:'#111720',border:'2px solid #2d3540'}}><Man x={420} y={270} s={.84}/><div style={{position:'absolute',right:140,top:80,width:520,height:560,background:'radial-gradient(circle,rgba(111,148,185,.17),transparent 65%)'}}/></div></Stage>;
  if(s===1)return <Stage bg="#11151a"><BigText x={220} y={265} size={68}>四年ぶりに、{`\n`}名前を打った。</BigText><Phone x={1180} y={145} scale={.92}><div style={{padding:'72px 24px'}}><div style={{fontSize:24,fontWeight:700,marginBottom:30}}>Search</div><div style={{height:55,borderRadius:16,background:'#e5e3df',padding:'14px 18px',color:'#777'}}>m___</div><div style={{display:'flex',alignItems:'center',gap:20,marginTop:32}}><div style={{width:62,height:62,borderRadius:'50%',background:'linear-gradient(#b18d78,#6c7b78)'}}/><div><b>m___</b><br/><span style={{color:'#888',fontSize:18}}>Tokyo</span></div></div></div></Phone></Stage>;
  return <Stage bg="#0b0e13"><div style={{position:'absolute',left:180,top:220,fontSize:34,letterSpacing:6,color:MUTED}}>PUBLIC ACCOUNT</div><BigText x={180} y={292} size={82}>鍵は、{`\n`}<span style={{color:GOLD}}>かかっていなかった。</span></BigText><Phone x={1190-70*q} y={145} scale={.92}><div style={{padding:'58px 24px'}}><div style={{fontSize:25,fontWeight:700}}>m___</div><div style={{display:'flex',alignItems:'center',gap:22,marginTop:36}}><div style={{width:90,height:90,borderRadius:'50%',background:'linear-gradient(#b18d78,#6c7b78)'}}/><div><b>184</b> posts<br/><span style={{fontSize:18,color:'#777'}}>Tokyo</span></div></div><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:3,marginTop:44}}>{Array.from({length:12},(_,i)=><div key={i} style={{height:91,background:['#7d8d79','#9c8b76','#687983','#a49a8d'][i%4]}}/>)}</div></div></Phone></Stage>;
};

const FamilyScene=({p}:{p:number})=>{
  const s=shotOf(p),q=localP(p);
  const kind:'park'|'family'|'home'=s===0?'park':s===1?'family':'home';
  const label=s===0?'NEIGHBORHOOD PARK':s===1?'FAMILY RESTAURANT':'LIVING ROOM';
  const words=s===0?'結婚していた。':s===1?'高級店でも、\n海外でもない。':'小さな、\nリビング。';
  return <Stage bg="#11100e"><Photo kind={kind} x={560-26*q} y={145-8*q} zoom={1+.025*q}/><div style={{position:'absolute',left:178,top:260,fontSize:29,letterSpacing:6,color:'#8f8a82'}}>{label}</div><BigText x={178} y={330} size={70}>{words}</BigText></Stage>;
};

const CompareScene=({p}:{p:number})=>{
  const s=shotOf(p),q=localP(p);
  if(s===0)return <Stage bg="#101216"><div style={{position:'absolute',left:550,top:210,width:820,height:580,borderRadius:30,background:'#c4b6a3',transform:`scale(${1+.08*q})`,boxShadow:'0 40px 110px #000'}}><div style={{position:'absolute',left:310,top:120,width:190,height:190,borderRadius:'50%',background:'#d8d2c7',border:'20px solid #4b5054'}}><div style={{position:'absolute',left:84,top:22,width:6,height:72,background:'#34393d',transform:'rotate(28deg)',transformOrigin:'bottom'}}/></div><div style={{position:'absolute',left:260,top:360,fontSize:30,color:'#4a453e'}}>ordinary watch</div></div><BigText x={180} y={190} size={58}>三万円も、{`\n`}しない。</BigText></Stage>;
  if(s===1)return <Stage bg="#0e1116"><div style={{position:'absolute',left:520,top:300,width:930,height:320,borderRadius:'180px 220px 80px 80px',background:'#555c63'}}><div style={{position:'absolute',left:140,bottom:-80,width:170,height:170,borderRadius:'50%',background:'#171a1e',border:'28px solid #323840'}}/><div style={{position:'absolute',right:140,bottom:-80,width:170,height:170,borderRadius:'50%',background:'#171a1e',border:'28px solid #323840'}}/></div><BigText x={180} y={190} size={68}>国産車だった。</BigText></Stage>;
  return <Stage bg="#080b10"><Skyline opacity={.5}/><div style={{position:'absolute',left:180,top:240,fontSize:36,letterSpacing:5,color:MUTED}}>HIS LIFE</div><div style={{position:'absolute',left:180,top:305,fontSize:100,fontWeight:700,color:GOLD}}>¥20M</div><Photo kind="family" x={1120} y={220} w={620} h={500} zoom={.78+.05*q}/><BigText x={180} y={520} size={54}>自分の方が、{`\n`}明らかに稼いでいる。</BigText></Stage>;
};

const SmileScene=({p}:{p:number})=>{
  const s=shotOf(p),q=localP(p);
  if(s===0)return <Stage bg="#0d0f12"><Photo kind="family" x={430} y={90} w={1060} h={820} zoom={1.06+.08*q}/></Stage>;
  if(s===1)return <Stage bg="#090b0e"><div style={{position:'absolute',left:475,top:165,width:970,height:660,background:'linear-gradient(135deg,#84796d,#5d665e)',overflow:'hidden',boxShadow:'0 40px 130px #000',transform:`scale(${1+.05*q})`}}><div style={{position:'absolute',left:360,top:120,width:220,height:250,borderRadius:'50%',background:'#b98b73'}}><div style={{position:'absolute',left:62,top:150,width:96,height:32,borderBottom:'8px solid #5b3830',borderRadius:'0 0 60px 60px'}}/></div><div style={{position:'absolute',left:280,top:360,width:380,height:320,borderRadius:'100px 100px 20px 20px',background:'#c8b9a8'}}/></div></Stage>;
  return <Stage bg="#07090c"><Man x={1200} y={270} s={.9}/><BigText x={210} y={280} size={70}>自分といた頃より、{`\n`}<span style={{color:GOLD}}>少しだけ楽しそうだった。</span></BigText></Stage>;
};

const PromotionScene=({p}:{p:number})=>{
  const s=shotOf(p),q=localP(p);
  return <Stage bg="#080a0d"><Phone x={790} y={120} scale={1.02}><div style={{height:'100%',background:'#14171b',padding:'70px 22px',color:'#eee'}}><div style={{position:'relative',marginTop:120,height:115,borderRadius:24,background:'rgba(245,245,245,.94)',color:'#202329',padding:'22px 24px',transform:`translateY(${s===0?70*(1-q):0}px)`,opacity:s===0?q:1}}><div style={{fontSize:18,color:'#6d737a'}}>WORK · now</div><div style={{fontSize:23,fontWeight:700,marginTop:9}}>Congratulations on your promotion.</div></div><div style={{marginTop:255,textAlign:'center',fontSize:20,color:'#6c7278'}}>00:41</div></div></Phone>{s===2&&<BigText x={180} y={330} size={72}>昇進、{`\n`}おめでとうございます。</BigText>}</Stage>;
};

const ReopenScene=({p}:{p:number})=>{
  const s=shotOf(p),q=localP(p);
  if(s===0)return <Stage bg="#06080b"><Phone x={780} y={115} scale={1.03}><div style={{height:'100%',background:'#f1eee8',padding:'52px 16px'}}><div style={{height:485,background:'linear-gradient(#8b9b86,#70685d)',position:'relative'}}><Woman x={65} y={90} s={.72}/><Man x={190} y={95} s={.7}/></div><div style={{padding:'20px 8px',color:'#222',fontSize:20}}>♡ 128 likes</div></div></Phone></Stage>;
  if(s===1)return <Stage bg="#05070a"><Skyline opacity={.22}/><Man x={850} y={250} s={1}/><div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 51% 43%,rgba(104,135,163,${.13+.08*q}),transparent 30%)`}}/></Stage>;
  return <Stage bg="#050608"><BigText x={210} y={325} size={82}>彼は、{`\n`}<span style={{color:GOLD}}>もう一度</span>だけ、{`\n`}写真を開いた。</BigText><div style={{position:'absolute',right:230,top:245,width:520,height:570,background:'#11161c',border:'1px solid #29313a',boxShadow:'0 30px 120px #000'}}><div style={{position:'absolute',inset:20,background:'linear-gradient(#7e8b7a,#686057)'}}/></div></Stage>;
};

export const PortLiteratureVisual=({beat,p}:{beat:Beat;p:number})=>{
  switch(beat.visual){
    case 'salary_mail': return <SalaryScene p={p}/>;
    case 'sushi_alone': return <SushiScene p={p}/>;
    case 'taxi_crossing': return <TaxiScene p={p}/>;
    case 'breakup_memory': return <BreakupScene p={p}/>;
    case 'instagram_search': return <InstagramScene p={p}/>;
    case 'ordinary_family': return <FamilyScene p={p}/>;
    case 'comparison': return <CompareScene p={p}/>;
    case 'her_smile': return <SmileScene p={p}/>;
    case 'promotion_notice': return <PromotionScene p={p}/>;
    case 'reopen_photo': return <ReopenScene p={p}/>;
    default: return <Stage><Skyline/><BigText x={250} y={320} size={70}>東京には、説明されない夜がある。</BigText></Stage>;
  }
};
