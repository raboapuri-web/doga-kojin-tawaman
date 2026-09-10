import React from 'react';
import {Arrow,Big,Building,C,Caption,Desk,Person,Pill,SceneShell,Tree,Txt} from '../../v18-bubble-cinematic/src/cinematic-primitives';
import {AlgorithmNode,AppBubble,Bed,Brain,CoinBurst,CreatorCard,CueLamp,DigitalClock,Finger,Flame,Gacha,Hunter,InfinityTunnel,JuiceTube,LuxuryObject,Meal,MeetingTable,Monkey,Notification,ParkBench,Phone,Pigeon,RewardGauge,RewardTimeline,ShortsFeed,SlotMachine,SpikePlot,StatusBar,TreasureChest,clamp,ease,ph} from './dopamine-primitives';

export type Beat={id:string;chapter:string;visual:string;narration:string;source?:string};
export const CaptionLayer=({beat,p}:{beat:Beat;p:number})=><Caption text={beat.narration} p={p}/>;

const night='#080d14';
const room='#151b24';
const paper='#ece8df';

export const BedroomScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p); const scroll=mode==='shorts_feed'||mode==='scroll_clock'||mode==='last_video_loop'||mode==='final_scroll';
 const final=mode.startsWith('final_')||mode==='silence_return'||mode==='phone_down_sleep';
 const phoneDown=mode==='phone_down_sleep'||mode==='final_notification';
 const phoneX=phoneDown?1170:1250-q*70; const phoneY=phoneDown?620:205+Math.sin(p*3)*8;
 const glow=phoneDown?.12:.75;
 const handP=(p*5)%1;
 return <SceneShell chapter={beat.chapter} source={beat.source} bg={night} cameraX={final?-15*q:-35*q} cameraY={final?8*q:0} zoom={1+(final?.025:.045)*q}>
   <div style={{position:'absolute',left:0,top:0,width:1920,height:760,background:'radial-gradient(circle at 72% 45%,rgba(50,88,130,.18),transparent 38%),linear-gradient(#0c1119,#151b24)'}}/>
   <div style={{position:'absolute',left:140,top:180,width:520,height:360,background:'#1b222b',border:'5px solid #303a45'}}><div style={{position:'absolute',left:20,top:25,width:480,height:265,background:'linear-gradient(#111923,#233347 55%,#161b24)',overflow:'hidden'}}>{Array.from({length:28},(_,i)=><div key={i} style={{position:'absolute',left:(i%7)*68+18,top:150-Math.floor(i/7)*45,width:32,height:72,background:'#10161e'}}/>)}<div style={{position:'absolute',left:220,top:38,width:50,height:50,borderRadius:'50%',background:'#d8dfdd',opacity:.65}}/></div></div>
   <Bed x={530} y={560} w={980} h={360}/>
   <Person x={845} y={430} s={.8} shirt="#4e5b67" pants="#232a31" arm={mode==='bedroom_silence'?15:-12}/>
   <div style={{position:'absolute',left:850,top:555,width:390,height:165,borderRadius:'50%',background:'#65707a',transform:'rotate(7deg)'}}/>
   <DigitalClock x={260} y={700} time={mode==='bedroom_scroll'?'00:43':mode==='scroll_clock'?'01:16':mode==='final_scroll'?'01:27':mode==='phone_down_sleep'||mode==='final_notification'?'01:29':'01:20'} pulse={scroll?.7:0}/>
   <Phone x={phoneX} y={phoneY} w={300} h={590} rot={phoneDown?88:-6} glow={glow}>
      {scroll?<><ShortsFeed p={p*1.25}/><StatusBar time={mode==='final_scroll'?'1:27':mode==='scroll_clock'?'1:16':'1:20'} battery={mode==='final_scroll'?8:37}/></>:<><div style={{position:'absolute',inset:0,background:'#0d131a'}}/><StatusBar time={mode==='final_notification'?'1:29':'0:43'} battery={mode==='final_notification'?7:42}/></>}
   </Phone>
   {!phoneDown&&scroll&&<Finger x={1475} y={600} p={handP} scale={.75}/>} 
   {mode==='bedroom_silence'&&<><div style={{position:'absolute',left:1230,top:250,width:340,height:550,borderRadius:50,border:'4px solid rgba(118,163,202,.28)',opacity:1-q}}/><Txt x={190} y={120} w={1500} size={62} color="#dbe7f0" align="center">何も起きない数秒が、妙に長い。</Txt></>}
   {mode==='last_video_loop'&&<><div style={{position:'absolute',left:250,top:220,width:520,height:330,borderRadius:28,background:'rgba(255,255,255,.06)',border:'3px solid rgba(255,255,255,.16)'}}><Txt x={45} y={55} w={430} size={50} color="#f2f2ef" align="center">「あと一本だけ」</Txt><Txt x={45} y={155} w={430} size={34} color="#a9b7c2" align="center">最後の一本は存在しない</Txt></div><InfinityTunnel x={925} y={230} p={p}/></>}
   {mode==='silence_return'&&<Txt x={245} y={150} w={1410} size={58} color="#dce5ec" align="center">刺激が消えたあと、静寂そのものが刺激になる。</Txt>}
   {mode==='final_notification'&&<Notification x={1110} y={170} p={p} text="新しいおすすめがあります"/>}
   {mode==='final_thesis'&&<><InfinityTunnel x={950} y={190} p={p}/><Txt x={170} y={210} w={800} size={70} color="#f1e7d6">「その次には何がある？」</Txt><Txt x={170} y={340} w={800} size={42} color="#9fb5c8">機械は初めて答えた。</Txt><Txt x={170} y={430} w={800} size={64} color="#f0c05a">「次はいくらでもあります」</Txt></>}
 </SceneShell>;
};

export const DailyWorldScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p);
 if(mode==='thirst_metaphor') return <SceneShell chapter={beat.chapter} source={beat.source} bg="#101822" zoom={1+.03*q}><div style={{position:'absolute',left:260,top:210,width:560,height:650,borderRadius:'45% 45% 20% 20%',background:'linear-gradient(rgba(53,126,180,.2),rgba(53,126,180,.75))',border:'8px solid #6e93ad',overflow:'hidden'}}><div style={{position:'absolute',left:0,right:0,bottom:0,height:120+q*380,background:'rgba(71,153,209,.62)',borderRadius:'50% 50% 0 0'}}/></div><div style={{position:'absolute',left:1030,top:240,width:500,height:520}}>{Array.from({length:9},(_,i)=><div key={i} style={{position:'absolute',left:(i%3)*150,top:Math.floor(i/3)*150,width:110,height:110,borderRadius:28,background:['#bd5b5b','#557aa1','#c1924c','#6a9b75'][i%4],transform:`scale(${.7+.45*((p*2+i*.13)%1)})`,boxShadow:'0 10px 30px rgba(0,0,0,.24)'}}/>)}<Arrow x={-40} y={430} w={530} color="#d35e65"/></div><Txt x={890} y={160} w={760} size={58} color="#f1e6d2" align="center">刺激を飲むほど、次の刺激が欲しくなる。</Txt></SceneShell>;
 if(mode==='dopamine_myth') return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e9e5dd" cameraX={-25*q} zoom={1+.025*q}><Brain x={690} y={245} s={1.5} p={p}/><div style={{position:'absolute',left:160,top:250,width:510,height:540,borderRadius:34,background:'#f7f3eb',border:'5px solid #8b8f92'}}><Txt x={45} y={55} w={420} size={52} align="center">ネットの説明</Txt><Txt x={55} y={180} w={400} size={42} color="#c45b63" align="center">ドーパミン</Txt><Arrow x={140} y={290} w={210} color="#c45b63"/><Txt x={85} y={350} w={340} size={45} align="center">＝ 快楽</Txt></div><div style={{position:'absolute',left:1320,top:270,width:420,height:500,borderRadius:34,background:'#19222c',border:'5px solid #576776'}}><Txt x={45} y={45} w={330} size={45} color="#fff" align="center">実際は？</Txt><RewardGauge x={45} y={160} w={330} label="WANTING" value={.25+.7*q}/><RewardGauge x={45} y={285} w={330} label="LIKING" value={.5-.12*q} color="#6e99b7"/></div></SceneShell>;
 const apps=[['Shorts','▶','#b94d54'],['SNS','#','#4b77a9'],['GAME','G','#6e619d'],['NEWS','N','#8a7350'],['MUSIC','♪','#59936d'],['CHAT','…','#4a8c8b']];
 return <SceneShell chapter={beat.chapter} source={beat.source} bg="#121923" cameraX={-30*q} zoom={1+.025*q}>
   <div style={{position:'absolute',left:730,top:350,width:460,height:480,borderRadius:'50%',background:'radial-gradient(circle,rgba(77,129,168,.28),transparent 68%)'}}><Person x={130} y={80} s={.72} shirt="#667b8e"/></div>
   {apps.map(([label,icon,color],i)=>{const a=i/apps.length*Math.PI*2+p*.7;const r=390+60*Math.sin(p*4+i);return <AppBubble key={label} x={890+Math.cos(a)*r} y={455+Math.sin(a)*r*.58} label={label} icon={icon} color={color} p={p+i*.12} s={.85+.15*q}/>})}
   {mode==='infinite_content'&&<InfinityTunnel x={580} y={170} p={p}/>} 
   {mode==='stimulation_montage'&&<><Building x={120} y={340} w={300} h={520} lit={.65} label="通勤"/><Meal x={1320} y={530} p={p}/></>}
   <Txt x={260} y={110} w={1400} size={58} color="#eef3f7" align="center">{mode==='daily_stimulation'?'「ドパガキ」は病名ではない。現代の刺激環境を映す俗称である。':mode==='infinite_content'?'一生では見きれない量の「次」が、ポケットに入った。':'一日の空白が、ほぼすべて刺激で埋まっていく。'}</Txt>
 </SceneShell>;
};

export const RewardSystemScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p); const separated=mode!=='wanting_liking';
 return <SceneShell chapter={beat.chapter} source={beat.source} bg="#111923" cameraX={20*Math.sin(p*2)} zoom={1+.03*q}>
   <Brain x={730} y={220} s={1.35} p={p}/>
   <div style={{position:'absolute',left:165,top:245,width:570,height:510,borderRadius:35,background:'#202a34',border:'4px solid #52606b'}}><Txt x={55} y={55} w={460} size={55} color="#fff" align="center">LIKING</Txt><div style={{position:'absolute',left:155,top:170,width:260,height:260,borderRadius:'50%',background:'radial-gradient(circle,#7eb0cf,#33546b 68%)',transform:`scale(${1+.06*Math.sin(p*4)})`}}/><Txt x={120} y={455} w={330} size={28} color="#b8c7d2" align="center">実際に「快い」と感じる</Txt></div>
   <div style={{position:'absolute',left:1185,top:245,width:570,height:510,borderRadius:35,background:'#30232c',border:'4px solid #775161'}}><Txt x={55} y={55} w={460} size={55} color="#fff" align="center">WANTING</Txt><div style={{position:'absolute',left:170,top:160,width:230,height:230,borderRadius:'50%',background:'radial-gradient(circle,#e47d92,#7a394c 68%)',transform:`scale(${1+.18*q})`,boxShadow:`0 0 ${30+45*q}px rgba(229,96,128,.55)`}}/><Arrow x={95} y={410} w={380} color="#d85f78"/><Txt x={120} y={455} w={330} size={28} color="#d8bcc5" align="center">そこへ向かわせる</Txt></div>
   {separated&&<><div style={{position:'absolute',left:820,top:520,width:280,height:120,borderRadius:28,background:'#0d1218',border:'3px solid #53606b'}}><Txt x={20} y={24} w={240} size={36} color="#f1c664" align="center">別々に動ける</Txt></div><RewardGauge x={675} y={780} w={600} label="WANTING" value={.3+.65*q}/><RewardGauge x={675} y={885} w={600} label="LIKING" value={mode==='want_without_like'?.33:.55} color="#6fa1c4"/></>}
   {mode==='next_reward_pull'&&<><Phone x={820} y={410} w={270} h={500} rot={0} glow={.6}><ShortsFeed p={p*1.3}/></Phone><Arrow x={1120} y={580} w={300} color="#d85f78"/></>}
 </SceneShell>;
};

export const MonkeyLabScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p); const cue=mode==='cue_shift'||mode==='missing_reward'||mode==='feed_as_cue'; const missing=mode==='missing_reward';
 if(mode==='forest_learning') return <SceneShell chapter={beat.chapter} source={beat.source} bg="#243328" cameraX={-35*q} zoom={1+.035*q}><Tree x={180} y={245} s={1.45} sway={Math.sin(p*5)*1.5}/><Tree x={1420} y={290} s={1.2} sway={Math.sin(p*4+1)*1.2}/><Hunter x={640} y={430} p={p} s={.82}/><div style={{position:'absolute',left:1070,top:430,width:280,height:260,borderRadius:'50%',background:'#4d7a45'}}>{Array.from({length:9},(_,i)=><div key={i} style={{position:'absolute',left:45+(i%3)*80,top:35+Math.floor(i/3)*65,width:32,height:32,borderRadius:'50%',background:'#d45852',boxShadow:'0 0 10px rgba(230,89,82,.5)'}}/>)}</div><Arrow x={770} y={610} w={420} color="#e0b34e"/><Txt x={310} y={120} w={1300} size={56} color="#eee6d1" align="center">報酬だけでなく、その前にあった「手掛かり」を覚える。</Txt></SceneShell>;
 return <SceneShell chapter={beat.chapter} source={beat.source} bg="#dce3e6" cameraX={-25*q} zoom={1+.025*q}>
   <div style={{position:'absolute',left:90,top:150,width:1740,height:760,borderRadius:30,background:'#eef2f3',border:'6px solid #788892'}}/>
   <Monkey x={300} y={430} s={.9} look={cue?1:0}/><CueLamp x={800} y={390} on={cue?1:ph(p,.4,.65)}/><JuiceTube x={1110} y={390} p={p} active={missing?0:mode==='monkey_lab_intro'?ph(p,.58,.78):ph(p,.72,.9)}/>
   <div style={{position:'absolute',left:1290,top:300,width:450,height:360,borderRadius:24,background:'#121a22',border:'5px solid #60717c'}}><Txt x={35} y={24} w={380} size={28} color="#dbe5eb" align="center">ドーパミン神経活動</Txt><SpikePlot x={30} y={85} w={390} h={220} p={p} mode={missing?'dip':cue?'cue':'reward'}/></div>
   <Txt x={180} y={185} w={1400} size={50} align="center">{mode==='monkey_lab_intro'?'最初は、予想外のジュースに反応する。':mode==='cue_shift'?'学習すると、反応は「ジュース」から「予告」へ移る。':mode==='missing_reward'?'予告された報酬が来ないと、期待した瞬間に活動が落ちる。':'フィードでは「次が見えること」自体が、予告になる。'}</Txt>
   {mode==='feed_as_cue'&&<Phone x={1460} y={520} w={240} h={420} rot={4} glow={.35}><ShortsFeed p={p}/></Phone>}
 </SceneShell>;
};

export const CasinoScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p); const win=mode==='casino_intro'?ph(p,.62,.82):mode==='variable_reward'?ph(p,.72,.88):0;
 if(mode==='eighty_vs_ninetyfive') return <SceneShell chapter={beat.chapter} source={beat.source} bg="#111820" zoom={1+.025*q}><div style={{position:'absolute',left:240,top:260,width:560,height:520,borderRadius:34,background:'#28323d',border:'5px solid #566674'}}><Big x={100} y={110} value="80点" label="いま見ている動画" color="#6f9dbd" size={108}/><div style={{position:'absolute',left:120,top:330,width:310,height:80,borderRadius:30,background:'#6c8da6'}}/></div><Arrow x={820} y={500} w={340} color="#d7a64d"/><div style={{position:'absolute',left:1160,top:220,width:580,height:600,borderRadius:34,background:'#362b25',border:'5px solid #8a6d4b',boxShadow:'0 0 45px rgba(225,174,80,.22)'}}><Big x={110} y={115} value="95点？" label="次にあるかもしれない" color="#e2b85b" size={108}/><InfinityTunnel x={-100} y={240} p={p}/></div></SceneShell>;
 return <SceneShell chapter={beat.chapter} source={beat.source} bg="#150f18" cameraX={-25*q} zoom={1+.03*q}>
   <div style={{position:'absolute',left:80,top:120,width:1760,height:800,background:'linear-gradient(90deg,#1a1018,#261321,#15101a)',border:'5px solid #5e414e'}}/>
   {Array.from({length:9},(_,i)=><div key={i} style={{position:'absolute',left:145+i*190,top:210+(i%2)*55,width:20,height:20,borderRadius:'50%',background:['#d35264','#e0b54f','#5e91bd'][i%3],boxShadow:`0 0 30px ${['#d35264','#e0b54f','#5e91bd'][i%3]}`,opacity:.45+.5*Math.sin(p*14+i)**2}}/>)}
   <SlotMachine x={310} y={330} p={p*1.3} win={win} s={.82}/><SlotMachine x={720} y={280} p={p*1.6+.2} win={mode==='variable_reward'?win:0} s={.95}/><SlotMachine x={1190} y={350} p={p*1.1+.4} win={0} s={.78}/>
   <Person x={920} y={500} s={.68} shirt="#65515d"/>
   {win>0&&<CoinBurst x={940} y={420} p={win}/>} 
   {mode==='shorts_slot_parallel'&&<><Phone x={140} y={350} w={270} h={510} rot={-5} glow={.5}><ShortsFeed p={p*1.5}/></Phone><Phone x={1490} y={350} w={270} h={510} rot={5} glow={.5}><ShortsFeed p={p*1.7+.2}/></Phone></>}
   {mode==='search_cost'&&<><Txt x={180} y={160} w={1560} size={55} color="#f2e8d8" align="center">探索コストがほぼゼロになると、「外れ」を捨て続けられる。</Txt><div style={{position:'absolute',left:710,top:820,width:520,height:52,borderRadius:30,background:'#29232a'}}><div style={{width:`${500*q}px`,height:52,borderRadius:30,background:'#d4a64c'}}/></div></>}
 </SceneShell>;
};

export const LunchScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p);
 if(mode==='past_vs_present_wait') return <SceneShell chapter={beat.chapter} source={beat.source} bg="#dcd8cf"><div style={{position:'absolute',left:100,top:150,width:820,height:760,background:'#c9c3b6',border:'5px solid #786f61'}}><Txt x={80} y={60} w={660} size={48} align="center">昔の3分</Txt><Person x={340} y={350} s={.72} shirt="#6f7e87"/><div style={{position:'absolute',left:110,top:650,width:600,height:15,background:'#555f65'}}><div style={{position:'absolute',left:140+q*250,top:-220,width:26,height:220,background:'#777'}}/></div><Txt x={140} y={735} w={540} size={32} align="center">ただ待つしかない</Txt></div><div style={{position:'absolute',left:1000,top:150,width:820,height:760,background:'#17202a',border:'5px solid #5d6f7d'}}><Txt x={80} y={60} w={660} size={48} color="#fff" align="center">今の3分</Txt><Person x={350} y={360} s={.72} shirt="#62788d"/><Phone x={490} y={300} w={230} h={430} glow={.55}><ShortsFeed p={p*1.8}/></Phone>{[['動画',100,700],['SNS',285,690],['ニュース',470,700]].map(([t,x,y],i)=><Pill key={String(t)} x={Number(x)} y={Number(y)} text={String(t)} color={['#bb5a61','#527eab','#8b7450'][i]}/>)}</div></SceneShell>;
 return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e9e4da" cameraX={-20*q} zoom={1+.025*q}>
   <div style={{position:'absolute',left:120,top:150,width:1680,height:760,background:'#d7cbbb',border:'6px solid #7c6c59'}}><div style={{position:'absolute',left:70,top:50,width:1540,height:110,background:'#8b755d'}}/><Txt x={85} y={75} w={1510} size={42} color="#fff" align="center">昼休みの定食屋</Txt><Meal x={500} y={500} p={p}/><Person x={820} y={330} s={.73} shirt="#65788a"/><Phone x={1110} y={310} w={240} h={450} rot={5} glow={.5}><ShortsFeed p={p*1.3}/></Phone><Finger x={1280} y={650} p={(p*4)%1} scale={.55}/></div>
   {mode==='opportunity_cloud'&&<>{[['SNS','#','#4d79a8',1450,220],['CHAT','…','#4b8c88',1510,420],['GAME','G','#78649b',1420,620],['NEWS','N','#8b7650',1180,190]].map(([l,i,c,x,y],k)=><AppBubble key={String(l)} x={Number(x)} y={Number(y)} label={String(l)} icon={String(i)} color={String(c)} p={p+k*.2} s={.8}/>)}</>}
   {mode==='escape_from_boredom'&&<><Arrow x={920} y={430} w={520} color="#c75562"/><Txt x={230} y={200} w={800} size={50}>何も起きない時間から、20cm先の刺激へ。</Txt></>}
 </SceneShell>;
};

export const BoredomScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p);
 if(mode==='ancestral_search') return <SceneShell chapter={beat.chapter} source={beat.source} bg="#28352b" cameraX={-45*q} zoom={1+.04*q}><Tree x={180} y={270} s={1.4} sway={Math.sin(p*4)*2}/><Tree x={1500} y={300} s={1.2} sway={Math.sin(p*3+2)*2}/><Hunter x={650+q*390} y={420} p={p} s={.82}/><Flame x={450} y={650} p={p} s={.75}/><div style={{position:'absolute',left:1050,top:500,width:350,height:250,borderRadius:'50%',background:'#44683f',opacity:q}}/><Arrow x={760} y={700} w={450} color="#e0b353"/><Txt x={270} y={140} w={1380} size={52} color="#eee5d0" align="center">退屈は本来、「別の場所を探せ」という探索信号だった。</Txt></SceneShell>;
 if(mode==='phone_twenty_centimeters'||mode==='learned_escape_loop') return <SceneShell chapter={beat.chapter} source={beat.source} bg="#161f28"><Brain x={180} y={330} s={1.3} p={p}/><div style={{position:'absolute',left:660,top:260,width:1060,height:590,borderRadius:40,background:'#202b35',border:'5px solid #526373'}}><Txt x={60} y={50} w={940} size={47} color="#fff" align="center">退屈 → スマホ → 刺激 → 学習</Txt>{Array.from({length:5},(_,i)=><React.Fragment key={i}><div style={{position:'absolute',left:100+i*180,top:240,width:105,height:105,borderRadius:i===4?30:'50%',background:['#6d7378','#517aa0','#c15c69','#d3a649','#517aa0'][i],transform:`scale(${.8+.25*ph(p,i*.12,i*.12+.2)})`,boxShadow:'0 0 25px rgba(255,255,255,.08)'}}/>{i<4&&<Arrow x={205+i*180} y={288} w={75} color="#b6c3cc"/>}</React.Fragment>)}<Txt x={110} y={420} w={850} size={35} color="#c5d0d8" align="center">繰り返すほど「空白をそのまま過ごす」経路が細くなる。</Txt></div></SceneShell>;
 return <SceneShell chapter={beat.chapter} source={beat.source} bg="#d7d9d8" cameraX={-20*q} zoom={1+.02*q}>
  <div style={{position:'absolute',left:90,top:160,width:1740,height:750,background:'#e7e7e4',border:'5px solid #7f8588'}}><div style={{position:'absolute',left:80,top:70,width:1540,height:145,background:'#d0d3d2'}}><Txt x={80} y={35} w={1380} size={44} align="center">来期営業方針：第17項……</Txt></div><MeetingTable x={340} y={600} w={1200}/><Person x={420} y={340} s={.65} shirt="#6c7884"/><Person x={790} y={340} s={.65} shirt="#6c7884"/><Person x={1180} y={340} s={.65} shirt="#65798b"/></div>
  <Phone x={1215} y={540} w={220} h={390} rot={10} glow={.2}><div style={{position:'absolute',inset:0,background:'#10151b'}}/><StatusBar time="17:42" battery={58}/></Phone><Finger x={1370} y={820} p={(p*3)%1} scale={.5}/>
  {mode==='boredom_signal'&&<><Brain x={160} y={560} s={.9} p={p}/><Arrow x={470} y={700} w={380} color="#c26755"/><Txt x={110} y={250} w={620} size={45}>退屈は単なる刺激不足ではなく、行動を切り替える信号かもしれない。</Txt></>}
 </SceneShell>;
};

export const DelayScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p);
 if(mode==='future_vs_now') return <SceneShell chapter={beat.chapter} source={beat.source} bg="#ebe6dc"><div style={{position:'absolute',left:180,top:230,width:650,height:560,borderRadius:40,background:'#f6f2e9',border:'5px solid #9a958b'}}><Big x={90} y={95} value="¥9,000" label="今日" color="#c16555" size={105}/><div style={{position:'absolute',left:145,top:315,width:360,height:110,borderRadius:30,background:'#c16555',transform:`scale(${1+.08*Math.sin(p*5)})`}}/></div><div style={{position:'absolute',left:1080,top:230,width:650,height:560,borderRadius:40,background:'#f6f2e9',border:'5px solid #9a958b'}}><Big x={90} y={95} value="¥10,000" label="1か月後" color="#5c87a9" size={105}/><div style={{position:'absolute',left:140,top:315,width:370,height:110,borderRadius:30,background:'#5c87a9',opacity:.5+.5*q}}/></div><Arrow x={820} y={500} w={250} color="#7f8790"/></SceneShell>;
 if(mode==='slow_reward_race'||mode==='slow_reward_loses') return <SceneShell chapter={beat.chapter} source={beat.source} bg="#111a23" zoom={1+.02*q}><RewardTimeline x={310} y={360} w={1300} p={p}/><div style={{position:'absolute',left:270,top:680,width:1380,height:90,borderRadius:45,background:'#2b3540'}}><div style={{width:`${(mode==='slow_reward_loses'?.26:.78)*q*1360}px`,height:90,borderRadius:45,background:mode==='slow_reward_loses'?'#c45b63':'#638aa8'}}/></div><Txt x={280} y={190} w={1360} size={55} color="#eef1f3" align="center">{mode==='slow_reward_loses'?'長期報酬は、即時報酬との競争で不利になる。':'報酬までの待ち時間は、1秒から1年まで極端に違う。'}</Txt></SceneShell>;
 return <SceneShell chapter={beat.chapter} source={beat.source} bg="#141b23" cameraX={-20*q} zoom={1+.03*q}><div style={{position:'absolute',left:150,top:190,width:700,height:680,borderRadius:34,background:'#202a34',border:'5px solid #53616d'}}><Txt x={80} y={55} w={540} size={45} color="#fff" align="center">長い映画</Txt><div style={{position:'absolute',left:115,top:180,width:470,height:280,background:'#0b0f14',border:'10px solid #343d45'}}><div style={{position:'absolute',left:20,top:20,width:430,height:240,background:'linear-gradient(#26394a,#6a5360)'}}/><div style={{position:'absolute',left:200,top:105,width:70,height:100,background:'#151a20'}}/></div><div style={{position:'absolute',left:110,top:545,width:480,height:30,borderRadius:18,background:'#444f59'}}><div style={{width:`${110*q}px`,height:30,borderRadius:18,background:'#6e98b7'}}/></div></div><div style={{position:'absolute',left:1030,top:190,width:700,height:680,borderRadius:34,background:'#202a34',border:'5px solid #53616d'}}><Txt x={80} y={55} w={540} size={45} color="#fff" align="center">Shorts</Txt><Phone x={220} y={150} w={270} h={500} glow={.7}><ShortsFeed p={p*2.2}/></Phone><Txt x={120} y={620} w={460} size={29} color="#d7e0e6" align="center">2時間でも「次」が1秒ごとに来る</Txt></div></SceneShell>;
};

export const GachaScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p); const hit=mode==='gacha_hit'?ph(p,.48,.72):mode==='next_gacha_immediately'?1:0;
 return <SceneShell chapter={beat.chapter} source={beat.source} bg="#131827" cameraX={-25*q} zoom={1+.025*q}>
  <div style={{position:'absolute',left:110,top:150,width:1700,height:770,borderRadius:36,background:'linear-gradient(#1b2335,#101522)',border:'5px solid #48536a'}}><div style={{position:'absolute',left:110,top:110,width:640,height:560,background:'#22293a',borderRadius:30}}><Person x={250} y={210} s={.74} shirt="#606f86"/><Phone x={450} y={160} w={230} h={440} glow={.35}><div style={{position:'absolute',inset:0,background:'#191e2d'}}/><StatusBar time="20:00" battery={63}/></Phone></div><Gacha x={930} y={150} p={p} hit={hit}/></div>
  {mode==='gacha_hit'&&<CoinBurst x={1390} y={450} p={hit} count={34}/>} 
  {mode==='next_gacha_immediately'&&<><div style={{position:'absolute',left:280,top:270,width:540,height:430,borderRadius:32,background:'#f0ede5',border:'5px solid #8f939a'}}><Txt x={40} y={35} w={460} size={35} align="center">次回アップデート</Txt><div style={{position:'absolute',left:160,top:130,width:220,height:220,borderRadius:'50%',background:'radial-gradient(circle,#8cb6db,#53486b)'}}/><Txt x={75} y={360} w={390} size={30} color="#a24f63" align="center">NEW CHARACTER</Txt></div><Arrow x={830} y={470} w={330} color="#d6a751"/></>}
  {mode==='wanting_restart'&&<><RewardGauge x={260} y={760} w={580} label="LIKING" value={.6-.22*q} color="#6c9cc0"/><RewardGauge x={1050} y={760} w={580} label="WANTING" value={.25+.7*q} color="#d0647c"/></>}
 </SceneShell>;
};

export const AdaptationScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p);
 if(mode==='stimulation_arms_race_personal') return <SceneShell chapter={beat.chapter} source={beat.source} bg="#111821"><div style={{position:'absolute',left:160,top:210,width:1600,height:620,borderRadius:40,background:'#1e2832',border:'5px solid #53616e'}}>{['短く','速く','強く','怒れる','派手に'].map((t,i)=><div key={t} style={{position:'absolute',left:110+i*290,top:370-i*62,width:230,height:130+i*32,borderRadius:24,background:['#536f87','#667798','#8a6d8e','#a85d70','#cf5b5d'][i],transform:`scale(${.8+.22*ph(p,i*.12,i*.12+.22)})`,boxShadow:`0 0 ${10+i*8}px rgba(218,91,95,.18)`}}><Txt x={15} y={35} w={200} size={31+i*2} color="#fff" align="center">{t}</Txt></div>)}</div><Txt x={280} y={125} w={1360} size={56} color="#eef2f5" align="center">刺激を強くすると、満足の基準も一緒に上がる。</Txt></SceneShell>;
 return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e8e3da" cameraX={-25*q} zoom={1+.02*q}>
  <LuxuryObject x={160} y={320} label="4Kテレビ" kind="tv" p={p}/><LuxuryObject x={780} y={320} label="高級イヤホン" kind="headphone" p={p+.2}/><LuxuryObject x={1400} y={320} label="高級ホテル" kind="hotel" p={p+.4}/>
  <div style={{position:'absolute',left:230,top:740,width:1460,height:80,borderRadius:40,background:'#c8c3ba'}}><div style={{position:'absolute',left:0,top:0,width:`${1460*q}px`,height:80,borderRadius:40,background:'linear-gradient(90deg,#d3a84f,#6f8da8)'}}/><Txt x={420} y={17} w={620} size={33} color="#1d252b" align="center">特別 → 当たり前</Txt></div>
  {mode==='normalization'&&<><Big x={350} y={160} value={`${Math.round(100-20*q)}点`} label="昨日まで100点" color="#c06b54" size={80}/><Big x={1120} y={160} value={`${Math.round(100-40*q)}点`} label="慣れた後の主観" color="#5f82a0" size={80}/></>}
 </SceneShell>;
};

export const ParkScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p);
 if(mode==='comparison_scale') return <SceneShell chapter={beat.chapter} source={beat.source} bg="#111820"><div style={{position:'absolute',left:180,top:230,width:620,height:600,borderRadius:40,background:'#263629',border:'5px solid #577059'}}><Txt x={55} y={55} w={510} size={46} color="#eef0e5" align="center">現実の公園</Txt><Tree x={130} y={210} s={.75}/><ParkBench x={210} y={440} s={.65}/></div><div style={{position:'absolute',left:1120,top:170,width:620,height:720,borderRadius:40,background:'#261d2d',border:'5px solid #775b78',boxShadow:'0 0 45px rgba(186,94,164,.16)'}}><Txt x={55} y={55} w={510} size={46} color="#fff" align="center">世界選抜のフィード</Txt>{Array.from({length:6},(_,i)=><CreatorCard key={i} x={80+(i%2)*250} y={150+Math.floor(i/2)*170} p={p+i*.12} level={.45+.08*i} label={['絶景','笑い','美女','事故','怒り','動物'][i]}/>)}</div><div style={{position:'absolute',left:815,top:360,width:250,height:260,transform:`rotate(${-8+q*16}deg)`}}><div style={{position:'absolute',left:118,top:0,width:14,height:230,background:'#9f8a64'}}/><div style={{position:'absolute',left:0,top:65,width:250,height:12,background:'#9f8a64'}}/><div style={{position:'absolute',left:15,top:78,width:85,height:95,borderRadius:'50%',background:'#607f63'}}/><div style={{position:'absolute',right:15,top:78,width:115,height:140,borderRadius:'50%',background:'#a25374'}}/></div></SceneShell>;
 return <SceneShell chapter={beat.chapter} source={beat.source} bg="#b7d0cc" cameraX={-35*q} zoom={1+.03*q}><div style={{position:'absolute',left:0,top:0,width:1920,height:560,background:'linear-gradient(#8eb6cf,#dce4df)'}}/><div style={{position:'absolute',left:0,top:560,width:1920,height:520,background:'#6f9468'}}/><Tree x={120} y={310} s={1.3} sway={Math.sin(p*4)*1.7}/><Tree x={1490} y={350} s={1.1} sway={Math.sin(p*3+1)*1.7}/><ParkBench x={260} y={610} s={.85}/><Person x={330} y={520} s={.52} shirt="#77756d"/><Person x={930} y={490} s={.72} shirt="#60768a"/><Person x={1370} y={560} s={.5} shirt="#8c7b66"/>{Array.from({length:7},(_,i)=><Pigeon key={i} x={650+i*85+Math.sin(p*4+i)*30} y={760+(i%2)*30} p={p+i*.13} s={.7}/>) }
  {mode==='park_vs_feed'&&<><Phone x={1110} y={330} w={290} h={540} rot={5} glow={.75}><ShortsFeed p={p*1.6}/></Phone><div style={{position:'absolute',left:1020,top:260,width:520,height:650,borderRadius:45,boxShadow:'0 0 80px rgba(138,101,190,.3)',border:'5px solid rgba(255,255,255,.18)'}}/></>}
 </SceneShell>;
};

export const PlatformScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p);
 return <SceneShell chapter={beat.chapter} source={beat.source} bg="#101720" cameraX={-20*q} zoom={1+.02*q}>
  <AlgorithmNode x={805} y={345} p={p}/>
  {Array.from({length:6},(_,i)=>{const a=i/6*Math.PI*2+p*.28;const level=mode==='attention_arms_race'?clamp(.15+i*.14+q*.3):clamp(.15+i*.1);return <CreatorCard key={i} x={900+Math.cos(a)*590-155} y={480+Math.sin(a)*300-180} p={p+i*.2} level={level} label={['静かな話','強い冒頭','字幕','衝撃','怒り','最速'][i]}/>})}
  {Array.from({length:6},(_,i)=>{const a=i/6*Math.PI*2+p*.28;const x=960+Math.cos(a)*430,y=500+Math.sin(a)*220;const dx=960-x,dy=500-y,l=Math.hypot(dx,dy),ang=Math.atan2(dy,dx)*180/Math.PI;return <div key={i} style={{position:'absolute',left:x,top:y,width:l,height:4,background:i===Math.floor(p*6)%6?'#e1b551':'rgba(125,164,194,.25)',transform:`rotate(${ang}deg)`,transformOrigin:'0 50%'}}/>})}
  {mode==='content_selection'&&<><div style={{position:'absolute',left:160,top:360,width:260,height:320,borderRadius:40,background:'#202b35',border:'4px solid #53626e'}}><Person x={55} y={40} s={.55} shirt="#6d7f8f"/><Txt x={25} y={260} w={210} size={28} color="#fff" align="center">ユーザー</Txt></div><Arrow x={430} y={510} w={260} color="#d8a94c"/></>}
  <Txt x={260} y={100} w={1400} size={56} color="#edf2f5" align="center">{mode==='attention_arms_race'?'注意を奪う競争が、刺激の平均値を押し上げる。':'誰も全体を計画しなくても、強い刺激が選抜される。'}</Txt>
 </SceneShell>;
};

export const PossibilityScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p);
 if(mode==='treasure_loop') return <SceneShell chapter={beat.chapter} source={beat.source} bg="#1d1a18" cameraX={-30*q} zoom={1+.035*q}><div style={{position:'absolute',left:160,top:280,width:1600,height:560}}>{Array.from({length:6},(_,i)=>{const local=clamp(p*2.2-i*.18);return <TreasureChest key={i} x={40+i*260} y={170+(i%2)*35} p={p+i*.1} open={local}/>})}</div><Txt x={250} y={140} w={1420} size={56} color="#f0e5cf" align="center">中身より、「次こそ」の可能性を開け続ける。</Txt></SceneShell>;
 return <SceneShell chapter={beat.chapter} source={beat.source} bg="#0f151e" cameraX={-25*q} zoom={1+.025*q}><Person x={820} y={450} s={.78} shirt="#62778a"/><Phone x={1130} y={250} w={270} h={520} glow={.65}><div style={{position:'absolute',inset:0,background:'#111821'}}/><StatusBar time="23:48" battery={21}/></Phone>{[['YouTube','▶','#b95158',280,250],['SNS','#','#4c7ca9',470,150],['NEWS','N','#8a7450',1480,210],['GAME','G','#75629b',1510,520]].map(([l,i,c,x,y],k)=><AppBubble key={String(l)} x={Number(x)} y={Number(y)} label={String(l)} icon={String(i)} color={String(c)} p={p+k*.17} s={.92}/>) }{mode==='possibility_boxes'&&<InfinityTunnel x={590} y={250} p={p}/>}<Txt x={240} y={110} w={1440} size={55} color="#eef2f5" align="center">{mode==='app_hopping'?'満足したから移動するのではない。満足できないから移動する。':'消費しているのは、コンテンツより「次なら何かあるかもしれない」という可能性。'}</Txt></SceneShell>;
};

export const EvolutionScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p);
 if(mode==='infinite_search_space') return <SceneShell chapter={beat.chapter} source={beat.source} bg="#0b1118"><Hunter x={260} y={490} p={p} s={.8}/><Arrow x={500} y={650} w={440} color="#d7a84c"/><Phone x={1090} y={270} w={290} h={560} glow={.75}><ShortsFeed p={p*1.6}/></Phone><InfinityTunnel x={1250} y={230} p={p}/><Txt x={260} y={150} w={1400} size={60} color="#eef2f5" align="center">探索本能は昔のまま。探索先だけが無限になった。</Txt></SceneShell>;
 return <SceneShell chapter={beat.chapter} source={beat.source} bg="#222b25" cameraX={-35*q} zoom={1+.035*q}><div style={{position:'absolute',left:0,top:0,width:1920,height:1080,background:'linear-gradient(#263329,#171d19)'}}/><Flame x={820} y={650} p={p} s={.9}/><Hunter x={430} y={420} p={p} s={.78}/><Hunter x={1150} y={420} p={p+.3} s={.78}/>{mode==='survival_motivation'&&<>{[['食べる',200,210],['休む',520,160],['探索する',870,150],['学ぶ',1200,175],['また欲しい',1450,250]].map(([t,x,y],i)=><Pill key={String(t)} x={Number(x)} y={Number(y)+Math.sin(p*4+i)*15} text={String(t)} color={['#88704c','#667784','#567c61','#5b7e94','#a85b69'][i]}/>)}</>}{mode==='ancient_to_phone'&&<><Phone x={1480} y={330} w={250} h={480} glow={.7}><ShortsFeed p={p*1.7}/></Phone><Arrow x={900} y={520} w={520} color="#d9aa4d"/><Txt x={130} y={170} w={680} size={45} color="#e8e0ce">何時間も歩いて探した「次」が、0.3秒で出る。</Txt></>}{mode==='evolution_cycle'&&<Txt x={320} y={150} w={1280} size={58} color="#f0e7d4" align="center">永久に満足する個体は、生き延びるには不便だった。</Txt>}</SceneShell>;
};

export function Visual({beat,p}:{beat:Beat;p:number}){
 const v=beat.visual;
 if(['bedroom_scroll','bedroom_silence','shorts_feed','scroll_clock','last_video_loop','final_scroll','silence_return','phone_down_sleep','final_notification','final_thesis'].includes(v)) return <BedroomScene beat={beat} p={p} mode={v}/>;
 if(['daily_stimulation','stimulation_montage','infinite_content','thirst_metaphor','dopamine_myth'].includes(v)) return <DailyWorldScene beat={beat} p={p} mode={v}/>;
 if(['wanting_liking','split_reward_system','want_without_like','next_reward_pull'].includes(v)) return <RewardSystemScene beat={beat} p={p} mode={v}/>;
 if(['monkey_lab_intro','cue_shift','missing_reward','forest_learning','feed_as_cue'].includes(v)) return <MonkeyLabScene beat={beat} p={p} mode={v}/>;
 if(['casino_intro','variable_reward','shorts_slot_parallel','search_cost','eighty_vs_ninetyfive'].includes(v)) return <CasinoScene beat={beat} p={p} mode={v}/>;
 if(['lunch_phone','dual_consumption','opportunity_cloud','past_vs_present_wait','escape_from_boredom'].includes(v)) return <LunchScene beat={beat} p={p} mode={v}/>;
 if(['meeting_boredom','boredom_signal','ancestral_search','phone_twenty_centimeters','learned_escape_loop'].includes(v)) return <BoredomScene beat={beat} p={p} mode={v}/>;
 if(['shorts_two_hours','waiting_for_reward','future_vs_now','slow_reward_race','slow_reward_loses'].includes(v)) return <DelayScene beat={beat} p={p} mode={v}/>;
 if(['gacha_build_up','gacha_hit','next_gacha_immediately','wanting_restart'].includes(v)) return <GachaScene beat={beat} p={p} mode={v}/>;
 if(['adaptation_objects','normalization','stimulation_arms_race_personal'].includes(v)) return <AdaptationScene beat={beat} p={p} mode={v}/>;
 if(['park_peace','park_vs_feed','comparison_scale'].includes(v)) return <ParkScene beat={beat} p={p} mode={v}/>;
 if(['platform_ecosystem','content_selection','attention_arms_race'].includes(v)) return <PlatformScene beat={beat} p={p} mode={v}/>;
 if(['app_hopping','possibility_boxes','treasure_loop'].includes(v)) return <PossibilityScene beat={beat} p={p} mode={v}/>;
 if(['evolution_cycle','survival_motivation','ancient_to_phone','infinite_search_space','not_detox_sermon','ancient_button'].includes(v)) return <EvolutionScene beat={beat} p={p} mode={v}/>;
 return <SceneShell chapter={beat.chapter} source={beat.source} bg={paper}><Txt x={250} y={300} w={1420} size={60} align="center">{beat.chapter}</Txt><Txt x={310} y={520} w={1300} size={38} align="center">{beat.narration.slice(0,95)}</Txt></SceneShell>;
}
