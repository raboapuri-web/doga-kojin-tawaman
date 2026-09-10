import React from 'react';
import {AbsoluteFill,interpolate,spring,useCurrentFrame,useVideoConfig} from 'remotion';
import type {StoryShot} from './story';

const clamp=(v:number,a=0,b=1)=>Math.max(a,Math.min(b,v));
const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
const ease=(p:number)=>p*p*(3-2*p);

const palette={
  tokyo:{bg:'#07101b',mid:'#0f2235',ink:'#e8edf2',accent:'#77a8d8',warm:'#d6a968'},
  gunma:{bg:'#17150f',mid:'#403821',ink:'#f2eadb',accent:'#a8b36c',warm:'#d99a58'},
  memory:{bg:'#16130f',mid:'#352a20',ink:'#eadfcd',accent:'#b2926f',warm:'#d38c54'},
  neutral:{bg:'#111318',mid:'#262b31',ink:'#eeeeec',accent:'#8c9ca8',warm:'#c5a56b'}
};

const Grain=()=> <div style={{position:'absolute',inset:0,opacity:.16,pointerEvents:'none',mixBlendMode:'soft-light',backgroundImage:'repeating-radial-gradient(circle at 15% 25%,rgba(255,255,255,.14) 0 1px,transparent 1px 4px)',backgroundSize:'7px 7px'}}/>;
const Vignette=()=> <div style={{position:'absolute',inset:0,boxShadow:'inset 0 0 220px 70px rgba(0,0,0,.72)',pointerEvents:'none'}}/>;

const Txt=({children,x,y,w,size=48,color='#fff',weight=500,align='left',opacity=1}:{children:React.ReactNode;x:number;y:number;w:number;size?:number;color?:string;weight?:number;align?:'left'|'center'|'right';opacity?:number})=><div style={{position:'absolute',left:x,top:y,width:w,fontFamily:'"Noto Sans JP",sans-serif',fontSize:size,lineHeight:1.45,fontWeight:weight,color,textAlign:align,opacity,letterSpacing:'.02em',textShadow:'0 2px 14px rgba(0,0,0,.45)'}}>{children}</div>;

const Person=({x,y,s=1,coat='#27394c',skin='#d9b294',female=false,back=false}:{x:number;y:number;s?:number;coat?:string;skin?:string;female?:boolean;back?:boolean})=><div style={{position:'absolute',left:x,top:y,width:190*s,height:430*s,transformOrigin:'50% 100%'}}>
  <div style={{position:'absolute',left:65*s,top:0,width:68*s,height:82*s,borderRadius:'48% 48% 42% 42%',background:back?'#1b1b1b':skin,boxShadow:'0 8px 22px rgba(0,0,0,.25)'}}/>
  <div style={{position:'absolute',left:50*s,top:70*s,width:98*s,height:195*s,borderRadius:`${female?42:28}px ${female?42:28}px 26px 26px`,background:coat}}/>
  <div style={{position:'absolute',left:54*s,top:250*s,width:38*s,height:165*s,borderRadius:18*s,background:'#202832',transform:'rotate(4deg)'}}/>
  <div style={{position:'absolute',left:110*s,top:250*s,width:38*s,height:165*s,borderRadius:18*s,background:'#202832',transform:'rotate(-4deg)'}}/>
  {female&&<div style={{position:'absolute',left:56*s,top:-4*s,width:90*s,height:110*s,borderRadius:'48% 48% 45% 45%',borderTop:'22px solid #2a211e',borderLeft:'15px solid #2a211e',borderRight:'15px solid #2a211e'}}/>}
</div>;

const Phone=({x,y,w=430,h=760,children,rot=0}:{x:number;y:number;w?:number;h?:number;children?:React.ReactNode;rot?:number})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,borderRadius:52,background:'#050607',border:'9px solid #25282d',boxShadow:'0 30px 90px rgba(0,0,0,.5)',transform:`rotate(${rot}deg)`,overflow:'hidden'}}><div style={{position:'absolute',left:'39%',top:10,width:'22%',height:19,borderRadius:12,background:'#16181b',zIndex:4}}/><div style={{position:'absolute',inset:14,borderRadius:38,overflow:'hidden',background:'#f4f5f7'}}>{children}</div></div>;

const ChatUI=({p,variant='mother'}:{p:number;variant?:'mother'|'friends'|'father'})=>{
 const mother=variant==='mother';
 const msgs=variant==='friends'?['えぐ（笑）','成功者じゃん','遊び行かせて']:variant==='father'?['今日ありがとう','こっちこそ。すごい家だったね。','お父さんにも見せたかった','また来て']:['40階なら、群馬まで見えるの？','見えないよ（笑）','そっか（笑）'];
 return <div style={{position:'absolute',inset:0,background:'#eef1f6',padding:'80px 26px 28px'}}>{msgs.map((m,i)=>{const own=variant==='father'?i===0||i===3:mother?i===1:false; const show=clamp(p*1.7-i*.2);return <div key={m} style={{display:'flex',justifyContent:own?'flex-end':'flex-start',opacity:show,transform:`translateY(${(1-show)*22}px)`,marginBottom:22}}><div style={{maxWidth:'78%',padding:'17px 21px',borderRadius:25,background:own?'#8ee36d':'#fff',fontFamily:'"Noto Sans JP",sans-serif',fontSize:26,color:'#20242a',boxShadow:'0 2px 7px rgba(0,0,0,.08)'}}>{m}</div></div>})}</div>;
};

const City=({p,night=true,windowCount=70}:{p:number;night?:boolean;windowCount?:number})=>{
 const sky=night?'linear-gradient(#06101d,#142b44 62%,#1b2938)':'linear-gradient(#7f98aa,#d6d3c4 68%,#c6a67d)';
 return <div style={{position:'absolute',inset:0,background:sky,overflow:'hidden'}}>
   <div style={{position:'absolute',left:0,right:0,bottom:0,height:540,transform:`translateX(${-30*p}px)`}}>
    {Array.from({length:16},(_,i)=>{const w=90+(i%5)*42;const h=190+(i%7)*55;const x=i*135-30;return <div key={i} style={{position:'absolute',left:x,bottom:0,width:w,height:h,background:i%3===0?'#101a27':'#142233',borderTop:'2px solid rgba(255,255,255,.08)'}}>{Array.from({length:Math.min(24,Math.floor(h/42)*2)},(__,j)=><div key={j} style={{position:'absolute',left:15+(j%2)*35,top:22+Math.floor(j/2)*38,width:14,height:8,background:night&&((i*13+j*7)%5<3)?'#d4b26b':'rgba(150,174,193,.16)',boxShadow:night?'0 0 10px rgba(222,184,105,.18)':'none'}}/>)}</div>})}
   </div>
   {night&&Array.from({length:windowCount},(_,i)=><div key={'l'+i} style={{position:'absolute',left:(i*151)%1900,top:120+(i*83)%560,width:2+(i%3),height:2+(i%2),borderRadius:'50%',background:'#e5c887',opacity:.18+(i%5)*.11}}/>)}
  </div>;
};

const Rural=({p,winter=false}:{p:number;winter?:boolean})=><div style={{position:'absolute',inset:0,overflow:'hidden',background:winter?'linear-gradient(#9da5a8,#d9d7cd 60%,#b9b6aa)':'linear-gradient(#8e9a8a,#c8b88e 62%,#786f48)'}}>
 <div style={{position:'absolute',left:-100,top:300,width:2200,height:300,clipPath:'polygon(0 70%,8% 53%,17% 62%,26% 35%,35% 58%,46% 25%,55% 50%,67% 38%,78% 61%,89% 42%,100% 66%,100% 100%,0 100%)',background:winter?'#66716d':'#5d6548',transform:`translateY(${10*Math.sin(p*2)}px)`}}/>
 <div style={{position:'absolute',left:0,right:0,bottom:0,height:470,background:winter?'#d9d8cf':'#77734b'}}/>
 {Array.from({length:15},(_,i)=><div key={i} style={{position:'absolute',left:-70+i*150-p*18,bottom:100+(i%3)*45,width:260,height:3,background:winter?'#b6b8b1':'#ada071',transform:'rotate(-8deg)',opacity:.7}}/>)}
 <div style={{position:'absolute',left:0,bottom:45,width:1920,height:120,background:'#494947',clipPath:'polygon(0 20%,100% 0,100% 100%,0 100%)'}}/>
 {Array.from({length:9},(_,i)=><div key={'road'+i} style={{position:'absolute',left:i*260-40-p*110,bottom:93,width:150,height:8,background:'#d5cfae',transform:'rotate(-2deg)',opacity:.75}}/>)}
</div>;

const Tower=({p,floor=40}:{p:number;floor?:number})=><div style={{position:'absolute',left:700,top:70,width:510,height:950,transform:`perspective(900px) rotateY(${-4+4*p}deg) translateY(${8*Math.sin(p*2)}px)`,transformOrigin:'50% 100%'}}>
 <div style={{position:'absolute',inset:0,borderRadius:'28px 28px 0 0',background:'linear-gradient(90deg,#172333,#293d52 45%,#14202c)',boxShadow:'0 40px 90px rgba(0,0,0,.4)'}}/>
 {Array.from({length:18},(_,r)=>Array.from({length:5},(__,c)=><div key={`${r}-${c}`} style={{position:'absolute',left:48+c*88,top:60+r*45,width:54,height:20,background:(r+c*3)%4===0?'#e4c57c':'#25425a',boxShadow:(r+c)%4===0?'0 0 18px rgba(226,194,119,.23)':'none'}}/>))}
 <div style={{position:'absolute',right:-120,top:220,padding:'14px 22px',borderRadius:20,background:'rgba(7,12,18,.8)',border:'1px solid rgba(255,255,255,.15)',fontFamily:'sans-serif',fontSize:42,color:'#fff'}}>{floor}F</div>
</div>;

const Office=({p}:{p:number})=><><City p={p*.4}/><div style={{position:'absolute',left:0,right:0,bottom:0,height:430,background:'linear-gradient(180deg,rgba(8,14,22,.2),#0d141e)'}}/><div style={{position:'absolute',left:250,top:610,width:1450,height:38,background:'#202a34',boxShadow:'0 18px 50px rgba(0,0,0,.35)'}}/><div style={{position:'absolute',left:450,top:520,width:460,height:250,borderRadius:18,background:'#182330',border:'4px solid #33485a'}}><div style={{position:'absolute',inset:22,background:'linear-gradient(135deg,#122133,#1b3a5d)',overflow:'hidden'}}><div style={{position:'absolute',left:35,top:34,width:310,height:14,background:'#77a8d8'}}/><div style={{position:'absolute',left:35,top:72,width:220,height:9,background:'#55758f'}}/><div style={{position:'absolute',left:35,top:108,width:360,height:74,background:'#0c1623'}}/></div></div><Person x={930} y={455} s={.9} coat='#263b50'/></>;

const Factory=({p}:{p:number})=><div style={{position:'absolute',inset:0,background:'linear-gradient(#24282a,#4f5553)'}}><div style={{position:'absolute',left:0,right:0,top:130,height:38,background:'#6c7472'}}/>{Array.from({length:7},(_,i)=><div key={i} style={{position:'absolute',left:90+i*290-p*12,top:250+(i%2)*60,width:220,height:330,border:'5px solid #69716f',background:'#303638'}}><div style={{position:'absolute',left:35,top:40,width:150,height:110,background:'#1f2426'}}/><div style={{position:'absolute',left:55,top:200,width:110,height:16,background:'#b28a52'}}/></div>)}<div style={{position:'absolute',left:0,right:0,bottom:0,height:220,background:'#1c1f20'}}/><Person x={870} y={520} s={.92} coat='#465362'/></div>;

const HousePhoto=({p,snow=false}:{p:number;snow?:boolean})=><div style={{position:'absolute',left:350,top:160,width:1220,height:720,border:'12px solid #e4e0d5',background:snow?'#c9d1d5':'#b6c09d',boxShadow:'0 35px 90px rgba(0,0,0,.45)',transform:`scale(${.96+.05*ease(p)}) rotate(${-.5+.5*p}deg)`,overflow:'hidden'}}>
 <div style={{position:'absolute',left:0,right:0,top:0,height:350,background:snow?'linear-gradient(#a9b4ba,#d5d7d3)':'linear-gradient(#a4b48d,#d0c5a2)'}}/>
 <div style={{position:'absolute',left:370,top:290,width:510,height:300,background:'#eeece3',clipPath:'polygon(0 22%,50% 0,100% 22%,100% 100%,0 100%)'}}><div style={{position:'absolute',left:70,top:120,width:95,height:125,background:'#8aa0a7'}}/><div style={{position:'absolute',right:90,top:130,width:100,height:75,background:'#90a8b3'}}/></div>
 <div style={{position:'absolute',left:0,right:0,bottom:0,height:220,background:snow?'#eef0ec':'#7e925f'}}/>
 {snow&&Array.from({length:50},(_,i)=><div key={i} style={{position:'absolute',left:(i*97)%1180,top:(i*53+p*120)%680,width:5+(i%4),height:5+(i%4),borderRadius:'50%',background:'#fff',opacity:.65}}/>)}
 <div style={{position:'absolute',left:230,top:480,width:110,height:110,borderRadius:'50%',background:'#f5f6f4',border:'3px solid #c9cdca'}}/><div style={{position:'absolute',left:247,top:425,width:75,height:75,borderRadius:'50%',background:'#f6f7f5',border:'3px solid #c9cdca'}}/>
</div>;

const Reunion=({p}:{p:number})=><div style={{position:'absolute',inset:0,background:'linear-gradient(#3a241c,#17120f)'}}><div style={{position:'absolute',left:250,top:360,width:1420,height:420,borderRadius:80,background:'#5a3426',boxShadow:'0 40px 90px rgba(0,0,0,.5)'}}/>{Array.from({length:7},(_,i)=><Person key={i} x={300+i*210} y={270+(i%2)*20} s={.62} coat={i===3?'#30485b':['#4a4139','#3c4449','#5b4038'][i%3]}/>) }{Array.from({length:7},(_,i)=><div key={'g'+i} style={{position:'absolute',left:355+i*190,top:650,width:34,height:65,borderRadius:'0 0 15px 15px',border:'3px solid rgba(255,255,255,.4)',background:'rgba(196,160,96,.26)'}}/>)}<div style={{position:'absolute',inset:0,background:`rgba(0,0,0,${.08+.16*clamp((p-.55)*4)})`}}/></div>;

const Elevator=({p}:{p:number})=><div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,#16191c,#2a2f35 50%,#111417)'}}><div style={{position:'absolute',left:670,top:140,width:580,height:800,borderRadius:28,background:'#121416',border:'3px solid #555d63',boxShadow:'inset 0 0 80px rgba(255,255,255,.03)'}}>{Array.from({length:24},(_,i)=>{const n=34+i;return <div key={n} style={{position:'absolute',left:70+(i%4)*120,top:85+Math.floor(i/4)*108,width:72,height:72,borderRadius:'50%',border:'2px solid #6b7379',background:n===40?'#8a6c3f':n===50?'#283a4e':'#20252a',color:n===40?'#ffe3a7':'#cfd6dc',fontFamily:'sans-serif',fontSize:24,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:n===40?'0 0 24px rgba(222,178,91,.4)':'none'}}>{n}</div>})}</div><div style={{position:'absolute',left:825,top:62,width:270,textAlign:'center',fontFamily:'sans-serif',fontSize:48,color:'#e2e7ea',letterSpacing:8}}>{Math.round(mix(40,50,ease(p)))}</div></div>;

const MapScene=({p}:{p:number})=>{const z=clamp(p*1.4);return <div style={{position:'absolute',inset:0,background:'#d9d5ca',overflow:'hidden'}}><div style={{position:'absolute',left:-300+600*z,top:-300+310*z,width:2500,height:1700,transform:`scale(${.75+1.3*z})`,transformOrigin:'50% 50%',background:'linear-gradient(22deg,#b5b18d 0 18%,#8ca27a 18% 34%,#d7d3bd 34% 52%,#7f9f73 52% 63%,#bdbb9e 63%)'}}>{Array.from({length:18},(_,i)=><div key={i} style={{position:'absolute',left:(i*173)%2200,top:(i*97)%1400,width:420,height:18,background:'#ece8dd',transform:`rotate(${(i%5)*18-35}deg)`,opacity:.9}}/>)}<div style={{position:'absolute',left:980,top:680,width:160,height:110,background:'#686b66',boxShadow:'0 0 0 8px rgba(255,255,255,.5)'}}/></div><div style={{position:'absolute',left:780,top:430,width:360,height:200,borderRadius:'50% 50% 45% 45%',border:'5px solid #d85f54',transform:`scale(${.7+.25*Math.sin(p*8)})`,opacity:.8}}/><Txt x={650} y={780} w={620} size={44} color='#222' align='center'>群馬県・実家</Txt></div>};

const BigWord=({text,p,color='#fff'}:{text:string;p:number;color?:string})=><div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 190px',textAlign:'center',fontFamily:'"Noto Sans JP",sans-serif',fontSize:88,fontWeight:700,lineHeight:1.45,color,letterSpacing:'.03em',opacity:clamp(p*2.2),transform:`scale(${.94+.06*ease(p)})`,textShadow:'0 10px 40px rgba(0,0,0,.45)'}}>{text}</div>;

const sceneKind=(v:string)=>{
 if(v==='line'||v==='friend-chat'||v==='father-message') return 'phone';
 if(['office','ad-company','career','income-math','cold-judgment','success-inventory'].includes(v)) return 'office';
 if(['map-rural','rural-road','bike','parking','status-items','bike-parking','watching','ordinary-home','kenta-life','winter-wind'].includes(v)) return 'rural';
 if(v==='factory') return 'factory';
 if(['university','privilege'].includes(v)) return 'university';
 if(['newspaper','clipping'].includes(v)) return 'paper';
 if(['marriage','inlaw','shame'].includes(v)) return 'inlaw';
 if(['tower-buy','viewing','fuji-reflection','night-view','look-down','window-man','pleasure','loan','after-mother','others-above','finale'].includes(v)) return 'tower';
 if(['reunion','local-jobs','almost-said','nine-thousand','table-silence','household-income','won-number','kenta'].includes(v)) return 'reunion';
 if(['snow-photo','suumo','one-third','not-jealous'].includes(v)) return 'photo';
 if(['hierarchy','fifty-floor','button-low','adaptation','infinite-tokyo'].includes(v)) return 'elevator';
 if(['mother-arrives','concierge','mother-window','landmarks','where-gunma','akagi-question','stop-reply'].includes(v)) return 'mother';
 if(v==='childhood-window') return 'childhood';
 if(v==='google-map') return 'map';
 return 'city';
};

export const CinematicScene=({shot,p,index}:{shot:StoryShot;p:number;index:number})=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const q=ease(p);const tone=palette[shot.tone??'neutral'];const kind=sceneKind(shot.visual);const drift=Math.sin(frame/fps*.45+index)*8;
 let body:React.ReactNode=null;
 if(kind==='phone') body=<><City p={p*.25}/><div style={{position:'absolute',inset:0,background:'rgba(4,8,14,.54)'}}/><Phone x={shot.visual==='friend-chat'?770:790} y={140+drift} w={390} h={750} rot={-2+2*q}><ChatUI p={p} variant={shot.visual==='friend-chat'?'friends':shot.visual==='father-message'?'father':'mother'}/></Phone></>;
 else if(kind==='office') body=<><Office p={p}/>{shot.visual==='income-math'&&<><Txt x={1260} y={260} w={500} size={38} color='#b7c8d8'>親の年収</Txt><Txt x={1220} y={340} w={560} size={82} color='#d3b16f' weight={700} align='center'>{Math.round(mix(900,3200,q))}万円?</Txt></>}</>;
 else if(kind==='rural') body=<><Rural p={p} winter={shot.visual==='winter-wind'}/>{shot.visual.includes('parking')||shot.visual==='status-items'?<><div style={{position:'absolute',left:260,top:560,width:680,height:220,borderRadius:42,background:'#090a0b',boxShadow:'0 18px 55px rgba(0,0,0,.55)'}}><div style={{position:'absolute',left:80,top:-35,width:430,height:120,borderRadius:'70% 55% 0 0',background:'#0c0d0e'}}/><div style={{position:'absolute',left:85,bottom:-35,width:92,height:92,borderRadius:'50%',background:'#181818',border:'18px solid #303030'}}/><div style={{position:'absolute',right:90,bottom:-35,width:92,height:92,borderRadius:'50%',background:'#181818',border:'18px solid #303030'}}/></div><Person x={1120} y={470} s={.7} coat='#352f2d'/><Person x={1320} y={500} s={.66} coat='#22282a'/></>:<Person x={850+120*q} y={480} s={.72} coat='#33404b'/>}{shot.visual==='map-rural'&&<><Txt x={180} y={150} w={760} size={52} color='#f2eadb'>「高崎の方です」</Txt><Txt x={180} y={245} w={760} size={34} color='#cbbd9c'>太田市から、さらに少し外れ</Txt></>}</>;
 else if(kind==='factory') body=<Factory p={p}/>;
 else if(kind==='university') body=<><City p={p*.15} night={false}/><div style={{position:'absolute',left:0,right:0,bottom:0,height:470,background:'#d8d5cc'}}/><div style={{position:'absolute',left:150,top:330,width:1620,height:450,background:'#bbb7aa',clipPath:'polygon(0 18%,50% 0,100% 18%,100% 100%,0 100%)'}}>{Array.from({length:10},(_,i)=><div key={i} style={{position:'absolute',left:90+i*150,top:145,width:80,height:130,background:'#65757f'}}/>)}</div>{[0,1,2,3].map(i=><Person key={i} x={520+i*250} y={570+(i%2)*15} s={.62} coat={i===0?'#31465b':['#6b6258','#4d5360','#5c4e49'][i-1]}/>)}</>;
 else if(kind==='paper') body=<><div style={{position:'absolute',inset:0,background:'#17130f'}}/><div style={{position:'absolute',left:470,top:120,width:980,height:760,background:'#e7e0ce',transform:`rotate(${-3+3*q}deg) scale(${.96+.04*q})`,boxShadow:'0 40px 100px rgba(0,0,0,.5)'}}>{Array.from({length:16},(_,i)=><div key={i} style={{position:'absolute',left:80,top:80+i*37,width:i%4===0?760:650+(i%3)*50,height:i%4===0?12:5,background:i%4===0?'#39362f':'#777064',opacity:.8}}/>)}<div style={{position:'absolute',left:70,top:490,width:820,height:170,border:'5px solid #936b45'}}/></div></>;
 else if(kind==='inlaw') body=<><div style={{position:'absolute',inset:0,background:'linear-gradient(#d0c7b5,#8a7963)'}}/><div style={{position:'absolute',left:250,top:570,width:1420,height:210,borderRadius:40,background:'#5a4436'}}/><Person x={530} y={340} s={.8} coat='#2e3d4c'/><Person x={1170} y={335} s={.82} coat='#4c4a46'/>{shot.visual==='marriage'&&<Person x={850} y={360} s={.74} coat='#d6d0c2' female/>}</>;
 else if(kind==='tower') body=<><City p={p*.45}/>{['tower-buy','viewing'].includes(shot.visual)?<Tower p={p}/>:<><div style={{position:'absolute',left:0,top:0,width:1920,height:1080,background:'linear-gradient(90deg,rgba(8,12,18,.72),rgba(8,12,18,.08) 60%,rgba(8,12,18,.35))'}}/><div style={{position:'absolute',left:170,top:100,width:1420,height:820,border:'14px solid #1f2932',boxShadow:'inset 0 0 60px rgba(0,0,0,.5)'}}/><Person x={430} y={420} s={.92} coat='#26384a' back/></>}{shot.visual==='loan'&&<><Txt x={1180} y={180} w={520} size={42} color='#c3d1dc'>住宅ローン</Txt><Txt x={1120} y={250} w={650} size={92} color='#e3c27e' weight={700} align='center'>¥90,000,000</Txt></>}</>;
 else if(kind==='reunion') body=<><Reunion p={p}/>{shot.visual==='nine-thousand'&&<BigWord text='9,000万円' p={p} color='#e5c17c'/>}{shot.visual==='table-silence'&&<div style={{position:'absolute',inset:0,background:`rgba(0,0,0,${.22+.42*q})`}}/>}</>;
 else if(kind==='photo') body=<><div style={{position:'absolute',inset:0,background:'#111820'}}/><HousePhoto p={p} snow/>{shot.visual==='suumo'&&<><div style={{position:'absolute',right:180,top:160,width:520,height:250,borderRadius:34,background:'rgba(255,255,255,.95)',padding:35,boxShadow:'0 20px 60px rgba(0,0,0,.3)'}}><Txt x={40} y={35} w={440} size={32} color='#2f3337'>土地・建物</Txt><Txt x={40} y={95} w={440} size={68} color='#d26356' weight={700}>3,200万円</Txt></div></>}</>;
 else if(kind==='elevator') body=<><Elevator p={p}/>{shot.visual==='infinite-tokyo'&&<Txt x={180} y={820} w={1560} size={58} color='#f0e6d3' align='center'>上を見れば不幸になれる。下を見れば安心できる。</Txt>}</>;
 else if(kind==='mother') body=<><City p={p*.25}/><div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,rgba(5,10,16,.6),rgba(5,10,16,.08))'}}/><div style={{position:'absolute',left:150,top:90,width:1510,height:850,border:'14px solid #202c35'}}/><Person x={630} y={430} s={.82} coat='#665d58' female back/><Person x={1040} y={430} s={.82} coat='#273a4d' back/>{shot.visual==='where-gunma'&&<Txt x={380} y={180} w={1160} size={72} color='#f3e8d4' align='center'>「群馬はどっち？」</Txt>}{shot.visual==='akagi-question'&&<Txt x={460} y={180} w={1000} size={66} color='#f3e8d4' align='center'>「赤城山とか」</Txt>}</>;
 else if(kind==='childhood') body=<><Rural p={p} winter/><div style={{position:'absolute',left:260,top:120,width:1400,height:820,border:'18px solid #30291f',boxShadow:'inset 0 0 80px rgba(0,0,0,.45)'}}/><div style={{position:'absolute',left:650,top:320,width:12,height:420,background:'#26231d'}}/><div style={{position:'absolute',left:0,right:0,top:680,height:4,background:'#39342b'}}/></>;
 else if(kind==='map') body=<MapScene p={p}/>;
 else body=<City p={p}/>;
 return <AbsoluteFill style={{background:tone.bg,overflow:'hidden'}}>
  <div style={{position:'absolute',inset:-40,transform:`translate3d(${drift*.4}px,${-5*q}px,0) scale(${1.015+.018*q})`}}>{body}</div>
  <div style={{position:'absolute',left:0,right:0,top:0,height:160,background:'linear-gradient(rgba(0,0,0,.38),transparent)'}}/>
  <div style={{position:'absolute',left:72,top:62,fontFamily:'"Noto Sans JP",sans-serif',fontSize:22,letterSpacing:6,color:'rgba(255,255,255,.55)'}}>東京短編 / {String(index+1).padStart(2,'0')}</div>
  {shot.emphasis&&p>.38&&<div style={{position:'absolute',left:180,right:180,top:150,textAlign:'center',fontFamily:'"Noto Sans JP",sans-serif',fontSize:52,lineHeight:1.55,fontWeight:650,color:tone.ink,opacity:clamp((p-.38)*5)*clamp((1-p)*7),textShadow:'0 5px 30px rgba(0,0,0,.75)'}}>{shot.emphasis}</div>}
  <Grain/><Vignette/>
 </AbsoluteFill>;
};

export const NarrationCaption=({text,p}:{text:string;p:number})=>{
 const parts=text.split(/(?<=[。！？])/).map(s=>s.trim()).filter(Boolean); const idx=Math.min(parts.length-1,Math.floor(clamp(p,0,.999)*parts.length)); const part=parts[idx]??text;
 const fadeIn=clamp((p*parts.length-idx)*5);const fadeOut=clamp(((idx+1)-p*parts.length)*5);
 return <div style={{position:'absolute',left:250,right:250,bottom:72,display:'flex',justifyContent:'center',zIndex:20,opacity:Math.min(fadeIn,fadeOut)}}><div style={{maxWidth:1420,padding:'15px 28px 18px',borderRadius:18,background:'rgba(5,8,12,.56)',backdropFilter:'blur(10px)',fontFamily:'"Noto Sans JP",sans-serif',fontSize:34,lineHeight:1.6,fontWeight:500,color:'#f4f4f1',textAlign:'center',letterSpacing:'.02em',boxShadow:'0 12px 50px rgba(0,0,0,.28)'}}>{part}</div></div>;
};
