import React from 'react';
import {Arrow,Big,Building,C,Car,Caption,Conveyor,Desk,House,MoneyStack,Paper,Person,Pill,RobotArm,SceneShell,Train,Tree,Txt,Wave} from '../../v18-bubble-cinematic/src/cinematic-primitives';
import {DeliveryRobot,FactoryMachine,FlowNode,Grill,HospitalBed,JobRow,OrderPrinter,Phone,Plate,PriceTag,SelfCheckout,ServiceIcon,ShiftBoard,Truck,Violinist} from './labor-primitives';

export type Beat={id:string;chapter:string;visual:string;narration:string;source?:string};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>1-Math.pow(1-clamp(v),3);
const ph=(p:number,a:number,b:number)=>clamp((p-a)/(b-a));
const ephase=(p:number,a:number,b:number)=>ease(ph(p,a,b));
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;

const Road=({y=800}:{y?:number})=><><div style={{position:'absolute',left:-120,right:-120,top:y,height:240,background:C.road}}/>{Array.from({length:13},(_,i)=><div key={i} style={{position:'absolute',left:i*180,top:y+112,width:105,height:10,background:'#d7cfaf'}}/>)}</>;

export const DinerScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
  const q=ease(p); const waiterX=lerp(260,1480,ephase(p,.05,.92)); const carX=((p*1800)%2500)-350;
  const closing=ephase(p,.48,.95); const phoneP=ephase(p,.25,.65);
  return <SceneShell chapter={beat.chapter} source={beat.source} bg="#101722" cameraX={Math.sin(p*Math.PI)*-34} zoom={1+.025*q}>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(#0a1320,#16263a 57%,#111820)'}}/>
    <Road y={785}/><Car x={carX} y={820} s={.8} color="#8797a8"/><Car x={1840-carX*.55} y={905} s={.68} color="#9b746d"/>
    <div style={{position:'absolute',left:110,top:155,width:1450,height:620,background:'#d7c8af',border:'9px solid #735a43',boxShadow:'0 20px 55px rgba(0,0,0,.4)'}}>
      <div style={{position:'absolute',left:0,right:0,top:0,height:98,background:'#7d4f39'}}><Txt x={380} y={18} w={700} size={42} color={C.white} align="center">FAMILY RESTAURANT</Txt></div>
      {[0,1,2].map((r)=>[0,1,2,3].map((c)=><div key={`${r}-${c}`} style={{position:'absolute',left:90+c*315,top:130+r*145,width:250,height:110,borderRadius:18,background:'#eadfc8',border:'4px solid #8c745c'}}><div style={{position:'absolute',left:18,right:18,top:55,height:18,background:'#80644c'}}/></div>))}
      {Array.from({length:10},(_,i)=><Person key={i} x={130+(i%5)*270+Math.sin(p*5+i)*6} y={310+Math.floor(i/5)*235} s={.34} shirt={i%3===0?'#6a7c90':'#856d71'} walk={p*2+i*.13}/>)}
      <Person x={waiterX} y={520} s={.46} shirt="#566f83" walk={p*5}/><Plate x={waiterX+30} y={520} p={p}/>
      <div style={{position:'absolute',right:15,top:100,width:410,height:510,background:'#59636a',borderLeft:'8px solid #3c4449'}}><Grill x={35} y={210} p={p}/><OrderPrinter x={170} y={24} p={p}/><Person x={35} y={270} s={.46} shirt="#725e54" walk={p*4}/></div>
    </div>
    {mode==='diner_night_intro'&&<><Txt x={120} y={85} w={760} size={56} color={C.white}>2026年 夏　21:37</Txt><Pill x={1300} y={105} text="まだ十数台の車" color={C.blue}/></>}
    {mode==='diner_kitchen'&&<><Big x={1250} y={105} value="2人" label="厨房＋ホールの中心スタッフ" color={C.red}/><div style={{position:'absolute',left:1570,top:420,width:260,height:250,background:'#f7f2e5',transform:`translateY(${Math.sin(p*9)*9}px) rotate(${Math.sin(p*8)*3}deg)`}}><Txt x={25} y={35} w={210} size={28} align="center">注文票<br/>増え続ける</Txt><Txt x={25} y={130} w={210} size={62} color={C.red} align="center">+{Math.floor(q*9)}</Txt></div></>}
    {mode==='job_board'&&<><div style={{position:'absolute',left:130,top:90,width:470,height:180,background:'#fff8e5',border:'6px solid #9e8d6c'}}><Txt x={25} y={20} w={420} size={30} align="center">人手不足のため 22時閉店</Txt><Txt x={25} y={90} w={420} size={34} color={C.red} align="center">時給 1,250円</Txt></div><Phone x={1390} y={250} w={360} h={560}><JobRow y={20} label="自店" wage="¥1,250" accent={C.red}/><JobRow y={102} label="コンビニ" wage="¥1,300"/><JobRow y={184} label="ドラッグ" wage="¥1,350" accent={C.gold}/><JobRow y={266} label="物流倉庫" wage="¥1,450" accent={C.green}/></Phone></>}
    {mode==='diner_close'||mode==='diner_return'?<><div style={{position:'absolute',left:105,top:145,width:1465,height:630,background:`rgba(5,8,13,${closing*.72})`,pointerEvents:'none'}}/><div style={{position:'absolute',left:118,top:250,width:16,height:500,background:'#35393c',transform:`scaleY(${closing})`,transformOrigin:'50% 0'}}/><Txt x={1190} y={115} w={610} size={58} color={C.white} align="center">22:00<br/><span style={{color:C.red}}>2時間が消える</span></Txt></> : null}
    {mode==='final_edit'&&<><Phone x={1360} y={230} w={390} h={600} title="求人情報を編集"><JobRow y={25} label="現在" wage={`¥${Math.round(1250+100*phoneP)}`} accent={C.red}/><JobRow y={120} label="物流倉庫" wage="¥1,450" accent={C.green}/><div style={{position:'absolute',left:35,top:240,width:255,height:85,borderRadius:16,background:C.blue,transform:`scale(${.9+.1*phoneP})`}}><Txt x={10} y={20} w={235} size={25} color={C.white} align="center">保存</Txt></div></Phone></>}
  </SceneShell>;
};

export const ConceptScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
  const q=ease(p); const shift=mode==='shortage_question'?q:1;
  return <SceneShell chapter={beat.chapter} source={beat.source} bg="#ebe9e2" cameraX={-18*Math.sin(p*Math.PI)}>
    {mode==='shortage_question'||mode==='econ_class'||mode==='market_adjust'?<><div style={{position:'absolute',left:150,top:180,width:1620,height:660,background:'#d4d1c8',border:'9px solid #706d66'}}><div style={{position:'absolute',left:160,top:80,width:1300,height:470,background:'#26362f',border:'10px solid #675b4b'}}><svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}} viewBox="0 0 1300 470"><line x1="120" y1="390" x2="1180" y2="390" stroke="#ddd" strokeWidth="5"/><line x1="120" y1="60" x2="120" y2="390" stroke="#ddd" strokeWidth="5"/><line x1="220" y1="345" x2="1050" y2="110" stroke="#d26a64" strokeWidth="12"/><line x1="230" y1="120" x2="1080" y2="355" stroke="#70a6c4" strokeWidth="12"/><line x1={String(650+shift*100)} y1="80" x2={String(650+shift*100)} y2="390" stroke="#efc75e" strokeWidth="5" strokeDasharray="12 12"/></svg><Txt x={160} y={18} w={1000} size={34} color={C.white} align="center">労働需要 × 労働供給</Txt></div><Person x={60} y={380} s={.52} shirt="#5d6c77" arm={-25}/></div><Big x={1220} y={130} value={mode==='market_adjust'?'賃金 ↑':'人手不足'} label={mode==='market_adjust'?'教科書の均衡':'ならば価格も上がる？'} color={C.red}/></>:null}
    {mode==='shortage_stats'&&<><div style={{position:'absolute',left:150,top:180,width:500,height:600,background:'#dfe5e5',borderRadius:32}}><Big x={70} y={70} value={`${Math.round(40+11*q)}%`} label="正社員不足企業" color={C.red}/>{Array.from({length:10},(_,i)=><Person key={i} x={40+(i%5)*85} y={300+Math.floor(i/5)*180} s={.25} shirt={i<5?'#a76464':'#697987'} />)}</div><div style={{position:'absolute',left:710,top:180,width:500,height:600,background:'#e7e0d2',borderRadius:32}}><Big x={70} y={70} value="1倍超" label="有効求人倍率" color={C.blue}/><Arrow x={90} y={360} w={300} color={C.blue}/></div><div style={{position:'absolute',left:1270,top:180,width:500,height:600,background:'#ead9d4',borderRadius:32}}><Big x={70} y={70} value="約5%" label="春闘賃上げ" color={C.green}/><div style={{position:'absolute',left:90,top:350,width:300,height:180,background:'#f6f1e8',border:'5px solid #8a7c69'}}><Txt x={25} y={35} w={250} size={28} align="center">給与明細<br/>実感は人それぞれ</Txt></div></div></>}
    {mode==='burden_preview'&&<><div style={{position:'absolute',left:810,top:455,width:300,height:140,borderRadius:70,background:C.red,display:'flex',alignItems:'center',justifyContent:'center'}}><Txt x={25} y={42} w={250} size={36} color={C.white} align="center">人手不足</Txt></div>{[['賃金',250,180,C.green],['値上げ',760,120,C.gold],['残業',1280,180,C.red],['営業時間短縮',220,730,C.blue],['自動化',800,790,C.cyan],['閉店',1360,730,'#6d6274']].map(([t,x,y,c])=><React.Fragment key={String(t)}><FlowNode x={Number(x)} y={Number(y)} label={String(t)} color={String(c)} scale={.8+.2*q}/><Arrow x={Number(x)<800?Number(x)+230:Number(x)-160} y={Number(y)<450?Number(y)+130:Number(y)-20} w={180} color={String(c)} reverse={Number(x)>1000}/></React.Fragment>)}</>}
  </SceneShell>;
};

export const FragmentedLaborScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e7e8e3" cameraX={Math.sin(p*Math.PI)*-24} zoom={1+.018*q}>
   <div style={{position:'absolute',left:80,top:160,width:1760,height:700,display:'grid',gridTemplateColumns:'1fr 1fr',gridTemplateRows:'1fr 1fr',gap:18}}>
     <div style={{position:'relative',background:'#d7e0e6',overflow:'hidden'}}><Building x={40} y={80} w={260} h={390} lit={.55} label="IT" color="#31526d"/><Person x={350} y={190} s={.52} shirt="#59758b"/><Phone x={550} y={65} w={250} h={380} title="採用"><JobRow y={15} label="Cloud" wage="5年+"/><JobRow y={95} label="Security" wage="必須" accent={C.red}/><JobRow y={175} label="English" wage="歓迎" accent={C.gold}/></Phone></div>
     <div style={{position:'relative',background:'#ded7c9',overflow:'hidden'}}><div style={{position:'absolute',left:70,top:280,width:700,height:45,background:'#8e7659'}}/>{Array.from({length:5},(_,i)=><div key={i} style={{position:'absolute',left:100+i*120,top:150-i*15,width:70,height:130,background:'#6f7477',transform:`rotate(${i%2?8:-5}deg)`}}/>)}<Person x={620} y={145} s={.5} shirt="#ba8a43"/><Txt x={90} y={50} w={550} size={40}>建設現場：職人不足</Txt></div>
     <div style={{position:'relative',background:'#d9e5e5',overflow:'hidden'}}><HospitalBed x={70} y={180} p={p}/><Person x={530} y={130} s={.5} shirt="#79a1a3" walk={p*2}/><Txt x={80} y={55} w={500} size={40}>病院：夜勤明け</Txt></div>
     <div style={{position:'relative',background:'#d4d9dc',overflow:'hidden'}}><Truck x={40} y={220} s={.65} p={Math.sin(p*4)*8}/><Truck x={330} y={220} s={.65}/>{Array.from({length:9},(_,i)=><div key={i} style={{position:'absolute',left:90+(i%5)*130,top:90+Math.floor(i/5)*90,width:95,height:68,background:'#bd9562',transform:`translateY(${Math.sin(p*5+i)*3}px)`}}/>)}<Txt x={80} y={45} w={520} size={40}>物流：荷物はある、運転手がいない</Txt></div>
   </div>
   {mode==='fragmented_markets'&&<Txt x={380} y={90} w={1160} size={56} align="center">「人手不足」は、一つの市場ではない。</Txt>}
   {mode==='it_recruit'&&<Pill x={1280} y={95} text="半年募集しても数人" color={C.red}/>} 
   {mode==='construction_hospital_logistics'&&<div style={{position:'absolute',left:820,top:420,width:280,height:150,borderRadius:75,background:'#f0ece4',border:'6px solid #777'}}><Txt x={25} y={45} w={230} size={32} align="center">互いに代替できない</Txt></div>}
   {mode==='match_friction'&&<><div style={{position:'absolute',left:920,top:150,width:10,height:700,background:C.red,opacity:.75}}/><Txt x={720} y={880} w={520} size={42} color={C.red} align="center">MATCHING FRICTION</Txt></>}
 </SceneShell>;
};

export const WageWebScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p); const raise=mode==='wage_ripple'||mode==='office_equity'?100*q:0; return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e7e3d8" cameraX={-15*q}>
   <ShiftBoard x={170} y={250} rows={10} raise={raise}/><Phone x={1170} y={210} w={360} h={560} title="新人募集"><JobRow y={25} label="新人" wage={`¥${Math.round(1300+100*q)}`} accent={C.red}/><JobRow y={112} label="近隣店" wage="¥1,400" accent={C.green}/></Phone>
   {Array.from({length:6},(_,i)=><Person key={i} x={790+i*135} y={610+(i%2)*18} s={.34} shirt={i%2?'#6f7183':'#6b7f75'} arm={i<3?-20:0}/>)}
   {mode==='diner_wage_web'&&<><Txt x={150} y={110} w={900} size={52}>新人を一人ほしいだけなのに。</Txt><Big x={1160} y={95} value="1,300 → 1,400" label="新人募集時給" color={C.red} size={56}/></>}
   {mode==='wage_ripple'&&<><svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}} viewBox="0 0 1920 1080">{Array.from({length:10},(_,i)=><line key={i} x1="1270" y1="430" x2={String(350+(i%5)*100)} y2={String(390+Math.floor(i/5)*180)} stroke={C.red} strokeWidth="4" opacity={q*.65}/>)}</svg><Txt x={260} y={130} w={1000} size={50}>一人を上げると、既存社員まで動き始める。</Txt></>}
   {mode==='office_equity'&&<><div style={{position:'absolute',left:180,top:745,width:600,height:18,background:C.red,transform:`scaleX(${q})`,transformOrigin:'0 50%'}}/><div style={{position:'absolute',left:790,top:745,width:650,height:18,background:C.gold,transform:`scaleX(${q})`,transformOrigin:'0 50%'}}/><Txt x={500} y={95} w={920} size={54} align="center">初任給 → 2年目 → 3年目 → 主任 → 係長</Txt></>}
 </SceneShell>;
};

export const MonopsonyScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p); const phoneOpen=ephase(p,.2,.55); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e4ddd1" cameraX={Math.sin(p*Math.PI)*-18}>
   <House x={130} y={390} s={.82}/><Tree x={70} y={480} s={.75} sway={Math.sin(p*4)*1.5}/><Person x={610} y={500} s={.58} shirt="#7c6f85" walk={p*2}/><Car x={790+q*180} y={690} s={.72} color="#71879a"/>
   <div style={{position:'absolute',left:1020,top:185,width:720,height:640,background:'#d4d9d7',border:'7px solid #7e8887'}}><Desk x={90} y={410} w={500}/><Person x={285} y={190} s={.55} shirt="#677b8d"/><Phone x={80} y={35} w={260} h={370} title="求人"><JobRow y={20} label="隣県" wage="+3万円" accent={C.green}/><JobRow y={100} label="東京" wage="+6万円" accent={C.blue}/></Phone><div style={{position:'absolute',left:390,top:55,width:260,height:330,opacity:phoneOpen}}>{['学校','住宅ローン','夫の仕事','親の介護'].map((t,i)=><Pill key={t} x={0} y={i*72} text={t} color={[C.blue,C.red,C.gold,C.muted][i]}/>)}</div></div>
   {mode==='monopsony_home'&&<Txt x={160} y={110} w={900} size={52}>求人は多い。だが、生活は移動できない。</Txt>}
   {mode==='job_search'&&<Big x={1190} y={95} value="何千件 → 数社" label="実際に選べる求人" color={C.red}/>} 
   {mode==='monopsony_power'&&<><Arrow x={720} y={450} w={240} color={C.red}/><Txt x={650} y={800} w={950} size={48} color={C.red} align="center">希少性 ≠ 交渉力</Txt></>}
 </SceneShell>;
};

export const OutsideOptionScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e8ecec">
   <div style={{position:'absolute',left:120,top:170,width:760,height:690,background:'#d9e4e8',borderRadius:34}}><Building x={60} y={150} w={190} h={430} lit={.65} label="TOKYO" color="#355c78"/><Person x={340} y={330} s={.6} shirt="#5d7890"/><Phone x={500} y={95} w={220} h={380} title="求人"><JobRow y={20} label="A社" wage="+8%"/><JobRow y={98} label="B社" wage="+12%" accent={C.green}/><JobRow y={176} label="Remote" wage="可" accent={C.gold}/></Phone></div>
   <div style={{position:'absolute',left:1040,top:170,width:760,height:690,background:'#e3dcd2',borderRadius:34}}><House x={30} y={350} s={.55}/><Person x={400} y={350} s={.6} shirt="#7f7166"/><Phone x={520} y={95} w={220} h={380} title="求人"><JobRow y={25} label="近隣A" wage="同程度" accent={C.muted}/><JobRow y={105} label="近隣B" wage="+2%" accent={C.muted}/></Phone></div>
   {mode==='outside_option'&&<><Big x={240} y={90} value="20社" label="使える外部選択肢" color={C.green}/><Big x={1270} y={90} value="2社" label="使える外部選択肢" color={C.red}/></>}
   {mode==='two_engineers'&&<><Arrow x={260} y={720} w={430} color={C.green}/><div style={{position:'absolute',left:1410,top:720,width:280,height:16,background:C.red,transform:`scaleX(${1-q})`,transformOrigin:'0 50%'}}/><Txt x={180} y={890} w={1550} size={46} align="center">能力は同じでも、「辞める確率」が違う。</Txt></>}
   {mode==='bargain_game'&&<><div style={{position:'absolute',left:710,top:400,width:500,height:220,borderRadius:110,background:'#f4f1e8',border:'6px solid #8f918e'}}><Txt x={45} y={45} w={410} size={42} align="center">交渉決裂後に<br/>どこへ行けるか</Txt></div><Txt x={600} y={685} w={720} size={56} color={C.red} align="center">OUTSIDE OPTION</Txt></>}
 </SceneShell>;
};

export const SMEscene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p); const line=ephase(p,.1,.85); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#dadfe0" cameraX={-22*Math.sin(p*Math.PI)}>
   <div style={{position:'absolute',left:80,top:210,width:920,height:620,background:'#aab4b8',border:'9px solid #6a747a'}}><FactoryMachine x={70} y={230} p={p*2}/><FactoryMachine x={500} y={230} p={p*2+.3}/><Conveyor x={80} y={530} w={760} p={p*2}/><Person x={720} y={260} s={.5} shirt="#5d7181"/></div>
   <div style={{position:'absolute',left:1060,top:210,width:760,height:620,background:'#e4ded1',border:'9px solid #867a68'}}><Desk x={90} y={410} w={550}/><Person x={190} y={190} s={.58} shirt="#695b52" arm={-25}/><div style={{position:'absolute',left:390,top:230,width:140,height:210,borderRadius:30,background:'#1b242d',border:'6px solid #42515d'}}><Txt x={10} y={65} w={120} size={24} color={C.white} align="center">大手<br/>購買担当</Txt></div><Paper x={520} y={420} rot={-4} text="値上げ 5%"/><Paper x={400} y={470} rot={3} text="賃上げ要望"/></div>
   {mode==='metal_shop'&&<><Txt x={130} y={95} w={840} size={50}>従業員32人。若手が一人、また一人と抜ける。</Txt><Big x={1160} y={90} value="32人" label="小さな加工会社" color={C.blue}/></>}
   {mode==='price_negotiation'&&<><div style={{position:'absolute',left:1010,top:480,width:90,height:14,background:C.red,transform:`scaleX(${line})`,transformOrigin:'0 50%'}}/><Txt x={1130} y={100} w={570} size={46} color={C.red} align="center">「御社だけ上げるのは難しい」</Txt></>}
   {mode==='wallet_80'&&<><div style={{position:'absolute',left:200,top:100,width:720,height:100,background:'#f5f0e7',borderRadius:28}}><div style={{position:'absolute',left:20,top:20,width:680,height:60,background:'#d8d3c9'}}><div style={{width:`${80*q}%`,height:'100%',background:C.red}}/></div></div><Txt x={250} y={120} w={620} size={30} color={C.white} align="center">付加価値の大部分が人件費</Txt><Big x={1160} y={90} value="圧力 ≠ 能力" label="上げたい と 払える は別" color={C.red}/></>}
 </SceneShell>;
};

export const ServiceLossScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e7e7e1">
   {mode==='disappearing_services'||mode==='consumer_burden'?<>{[['バス減便','bus',170,220],['病床縮小','hospital',500,220],['ホテル客室減','hotel',830,220],['受注断念','box',1160,220],['宅配翌日','box',330,560],['工期延期','box',720,560],['メニュー縮小','box',1110,560]].map(([lab,kind,x,y],i)=><ServiceIcon key={String(lab)} x={Number(x)} y={Number(y)} label={String(lab)} kind={String(kind)} fade={mode==='disappearing_services'?q*(i%3===0?.75:.35):0}/>)}</>:null}
   {mode==='disappearing_services'&&<Txt x={330} y={100} w={1260} size={54} align="center">賃金に行かなかった不足は、サービスを削る。</Txt>}
   {mode==='consumer_burden'&&<><div style={{position:'absolute',left:760,top:430,width:400,height:170,borderRadius:85,background:C.red}}><Txt x={50} y={50} w={300} size={42} color={C.white} align="center">「最近、不便」</Txt></div><Txt x={490} y={850} w={940} size={48} align="center">それも、人手不足の価格である。</Txt></>}
   {mode==='burden_flow'&&<><FlowNode x={760} y={170} label="人手不足" color={C.red}/>{[['賃金',200,430,C.green],['値上げ',520,650,C.gold],['残業',850,470,C.red],['自動化',1180,650,C.blue],['閉店',1500,430,'#6e6178']].map(([l,x,y,c])=><React.Fragment key={String(l)}><FlowNode x={Number(x)} y={Number(y)} label={String(l)} color={String(c)} scale={.85+.15*q}/><Arrow x={Number(x)<700?Number(x)+180:Number(x)-60} y={Number(y)-70} w={220} color={String(c)} reverse={Number(x)>1000}/></React.Fragment>)}</>}
 </SceneShell>;
};

export const ProductivityScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e8e3d9" cameraX={Math.sin(p*Math.PI)*-18}>
   {mode==='care_work'||mode==='care_vs_factory'?<><div style={{position:'absolute',left:100,top:190,width:800,height:650,background:'#d7e3e3',borderRadius:34}}><HospitalBed x={120} y={350} p={p}/><Person x={490} y={280} s={.58} shirt="#7d9da2" arm={-20}/><div style={{position:'absolute',left:90,top:80,width:160,height:160,borderRadius:'50%',border:'8px solid #687984'}}><Txt x={20} y={47} w={120} size={38} align="center">10分</Txt></div></div><div style={{position:'absolute',left:1020,top:190,width:800,height:650,background:'#d5dcde',borderRadius:34}}><FactoryMachine x={170} y={310} p={p*3}/><Conveyor x={100} y={610} w={620} p={p*3}/><Big x={190} y={80} value={`${Math.round(100+100*q)}個`} label="1時間あたり" color={C.green}/></div></> : null}
   {mode==='care_work'&&<Txt x={280} y={100} w={1360} size={54} align="center">人間の時間そのものが、サービスになっている。</Txt>}
   {mode==='care_vs_factory'&&<Txt x={470} y={880} w={980} size={48} align="center">工場は倍にできても、介護は倍速にできない。</Txt>}
   {mode==='baumol_quartet'&&<><div style={{position:'absolute',left:130,top:220,width:1660,height:600,background:'#d9c8aa',border:'10px solid #8b6e4c'}}>{Array.from({length:4},(_,i)=><Violinist key={i} x={240+i*330} y={260} p={p+i*.15} shirt={i%2?'#5f6980':'#715f68'}/>)}</div><Txt x={310} y={100} w={1300} size={54} align="center">200年前も4人。今も4人。</Txt><Pill x={765} y={810} text="倍速演奏 ≠ 生産性2倍" color={C.red}/></>}
 </SceneShell>;
};

export const HistoryScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p); const years=['1998','2003','2008','2012','2026']; return <SceneShell chapter={beat.chapter} source={beat.source} bg="#dedbd3">
   <div style={{position:'absolute',left:170,top:230,width:1580,height:570,background:'#cfc8ba',border:'8px solid #7d7567'}}><Desk x={450} y={470} w={720}/><Person x={330} y={250} s={.52} shirt="#566a78"/><Person x={730} y={250} s={.52} shirt="#665d57"/><Person x={1120} y={250} s={.52} shirt="#6b7580"/>{years.map((y,i)=><div key={y} style={{position:'absolute',left:180+i*280,top:80,width:150,height:60,borderRadius:30,background:i===4?C.red:'#747c80',opacity:i<=Math.floor(q*5)?1:.25}}><Txt x={15} y={10} w={120} size={28} color={C.white} align="center">{y}</Txt></div>)}</div>
   {mode==='old_wage_room'&&<><Txt x={260} y={100} w={1400} size={52} align="center">「大きく上げない。その代わり雇用は守る」</Txt><div style={{position:'absolute',left:500,top:850,width:920,height:16,background:'#8f969a'}}><div style={{width:`${q*25}%`,height:'100%',background:C.blue}}/></div></>}
   {mode==='wage_memory'&&<><div style={{position:'absolute',left:280,top:835,width:1360,height:18,background:'#adb1af'}}><div style={{width:`${q*100}%`,height:'100%',background:'linear-gradient(90deg,#68798c,#c34f4f)'}}/></div><Txt x={400} y={100} w={1120} size={54} align="center">2026年の給与明細に、過去30年の記憶が残る。</Txt></>}
 </SceneShell>;
};

export const PriceScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e8e1d5" cameraX={-16*Math.sin(p*Math.PI)}>
   {mode==='lunch_980'?<><div style={{position:'absolute',left:100,top:180,width:900,height:650,background:'#c9b18e',border:'9px solid #7f6546'}}><Txt x={230} y={70} w={440} size={46} align="center">定食屋</Txt><PriceTag x={280} y={240} from={980} to={1080} p={q} label="ランチ価格"/><Person x={650} y={360} s={.58} shirt="#6f6658"/></div><div style={{position:'absolute',left:1100,top:180,width:720,height:650,background:'#d7d5cd',borderRadius:30}}><PriceTag x={110} y={80} from={980} to={980} p={1} label="向かいの定食屋"/><PriceTag x={280} y={330} from={950} to={950} p={1} label="隣のラーメン"/></div></>:null}
   {mode==='wage_price_loop'||mode==='pricing_productivity'?<><FlowNode x={120} y={430} label="賃金 ↑" color={C.red}/><Arrow x={350} y={478} w={180}/><FlowNode x={560} y={430} label="価格転嫁" color={C.gold}/><Arrow x={790} y={478} w={180}/><FlowNode x={1000} y={430} label="売上維持" color={C.blue}/><Arrow x={1230} y={478} w={180}/><FlowNode x={1440} y={430} label="投資・生産性" color={C.green}/><svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}} viewBox="0 0 1920 1080"><path d="M1550 630 C1550 900 280 900 280 630" fill="none" stroke={C.green} strokeWidth="12" strokeDasharray="20 15" strokeDashoffset={String(-p*120)}/></svg><Txt x={420} y={160} w={1080} size={56} align="center">持続的な賃上げは、循環でできている。</Txt></> : null}
 </SceneShell>;
};

export const SpringScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e5e7e4">
   {mode==='spring_5'?<><div style={{position:'absolute',left:110,top:190,width:900,height:590,background:'#aeb7bd',border:'10px solid #69757e'}}><div style={{position:'absolute',left:90,top:80,width:720,height:410,background:'#253d56'}}><Txt x={70} y={70} w={580} size={50} color={C.white} align="center">春闘 賃上げ</Txt><Big x={170} y={170} value="5%超" color={C.red}/></div></div><div style={{position:'absolute',left:1130,top:190,width:660,height:590,background:'#d8d1c3',borderRadius:30}}><Person x={250} y={260} s={.62} shirt="#5b7183"/><Paper x={130} y={130} rot={-3} text="給与明細"/><Big x={180} y={70} value="?" label="自分の実感" color={C.red}/></div></>:null}
   {mode==='labor_segments'?<>{[['大企業',190,220,C.blue],['中小企業',550,220,C.gold],['正社員',910,220,C.green],['パート',1270,220,C.red],['都市',360,560,C.cyan],['地方',720,560,C.muted],['IT',1080,560,'#7a668e'],['介護',1440,560,'#927167']].map(([l,x,y,c],i)=><div key={String(l)} style={{position:'absolute',left:Number(x),top:Number(y),width:250,height:190,borderRadius:30,background:String(c),transform:`translateY(${Math.sin(p*4+i)*10}px)`,boxShadow:'0 13px 28px rgba(0,0,0,.15)'}}><Txt x={25} y={65} w={200} size={34} color={C.white} align="center">{String(l)}</Txt></div>)}<Txt x={510} y={100} w={900} size={52} align="center">「平均的な労働者」は、どこにもいない。</Txt></>:null}
 </SceneShell>;
};

export const AutomationScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#dde2e3" cameraX={Math.sin(p*Math.PI)*-28} zoom={1+.018*q}>
   {mode==='self_checkout'?<><div style={{position:'absolute',left:100,top:190,width:1720,height:650,background:'#cdd5d5',border:'8px solid #7b888a'}}>{Array.from({length:12},(_,i)=><SelfCheckout key={i} x={80+(i%6)*260} y={90+Math.floor(i/6)*310} p={p+i*.08}/>) }<Person x={1470} y={380} s={.52} shirt="#5d7d83" walk={p*2}/></div><Txt x={420} y={95} w={1080} size={54} align="center">6人のレジ係 → 1人が複数台を見る</Txt></>:null}
   {mode==='automation_world'?<><div style={{position:'absolute',left:120,top:190,width:1680,height:650,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gridTemplateRows:'repeat(2,1fr)',gap:18}}>{['居酒屋','ホテル','倉庫','工場','建設','オフィス'].map((t,i)=><div key={t} style={{position:'relative',background:i%2?'#d5d8d3':'#cfd8dc',overflow:'hidden'}}><Txt x={25} y={20} w={450} size={34}>{t}</Txt>{i===0&&<DeliveryRobot x={140} y={110} p={p}/>} {i===1&&<SelfCheckout x={180} y={70} p={p}/>} {i===2&&<Conveyor x={50} y={210} w={430} p={p*3}/>} {i===3&&<RobotArm x={150} y={100} p={p*2}/>} {i===4&&<><div style={{position:'absolute',left:180,top:80,width:130,height:38,background:'#596a75',transform:`translate(${Math.sin(p*8)*80}px,${Math.cos(p*6)*35}px)`}}/><div style={{position:'absolute',left:238,top:60,width:8,height:80,background:'#444'}}/></>} {i===5&&<Phone x={170} y={80} w={230} h={290} title="生成AI"><Txt x={20} y={30} w={170} size={24} align="center">資料作成<br/>要約<br/>下書き</Txt></Phone>}</div>)}</div></>:null}
   {mode==='robot_calc'?<><div style={{position:'absolute',left:180,top:220,width:620,height:540,background:'#e6ded2',borderRadius:36}}><Big x={85} y={65} value="時給 1,800円" label="人間を採用" color={C.red}/><Person x={220} y={260} s={.7} shirt="#61798d"/></div><div style={{position:'absolute',left:1120,top:220,width:620,height:540,background:'#d7e1e2',borderRadius:36}}><Big x={85} y={65} value="500万円" label="機械を購入" color={C.blue}/><DeliveryRobot x={190} y={280} p={p}/></div><Txt x={640} y={830} w={650} size={48} align="center">希少になるほど、代替も進む。</Txt></>:null}
 </SceneShell>;
};

export const ConditionsScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p); return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e9ece9">
   {mode==='wage_conditions'?<>{[['移動',180,250,C.blue],['価格転嫁',520,250,C.gold],['生産性',860,250,C.green],['交渉力',1200,250,C.red],['再配置',690,590,'#71688f']].map(([l,x,y,c],i)=><FlowNode key={String(l)} x={Number(x)} y={Number(y)} label={String(l)} color={String(c)} scale={.72+.28*ephase(p,i*.08,.45+i*.08)}/>) }<div style={{position:'absolute',left:760,top:430,width:400,height:120,borderRadius:60,background:'#303b46'}}><Txt x={30} y={35} w={340} size={38} color={C.white} align="center">賃金上昇</Txt></div></>:null}
   {mode==='mobility'&&<><Person x={160} y={500} s={.68} shirt="#58748c" walk={p*5}/>{Array.from({length:4},(_,i)=><Building key={i} x={600+i*300} y={360-(i%2)*70} w={190} h={470+(i%2)*70} lit={.55} label={`会社${String.fromCharCode(65+i)}`} color={['#365872','#4d6d61','#756244','#6d5268'][i]}/>) }<Arrow x={390} y={650} w={1040} color={C.green}/><Txt x={410} y={150} w={1100} size={54} align="center">移動できると、希少性が交渉力に変わる。</Txt></>}
   {mode==='bargaining'&&<><div style={{position:'absolute',left:210,top:250,width:560,height:500,background:'#d6e1e4',borderRadius:36}}><Person x={200} y={210} s={.67} shirt="#5d798f"/><Phone x={330} y={90} w={200} h={300} title="市場価値"><JobRow y={15} label="他社" wage="+12%" accent={C.green}/></Phone></div><div style={{position:'absolute',left:1150,top:250,width:560,height:500,background:'#e1d7d0',borderRadius:36}}><Person x={200} y={210} s={.67} shirt="#6b6064"/><Desk x={60} y={360} w={420}/></div><div style={{position:'absolute',left:820,top:460,width:280,height:120,borderRadius:60,background:C.red}}><Txt x={25} y={36} w={230} size={34} color={C.white} align="center">交渉</Txt></div></>}
   {mode==='reallocation'&&<><div style={{position:'absolute',left:190,top:240,width:550,height:520,background:'#ded6cd',borderRadius:34}}><Building x={140} y={180} w={260} h={330} lit={.18} label="低生産性" color="#625b57"/><Person x={210} y={300} s={.48} shirt="#6f7478"/></div><Arrow x={760} y={500} w={400} color={C.green}/><div style={{position:'absolute',left:1190,top:180,width:570,height:580,background:'#d9e6e4',borderRadius:34}}><Building x={130} y={120} w={300} h={440} lit={.72} label="高生産性" color="#355f63"/>{Array.from({length:4},(_,i)=><Person key={i} x={70+i*120} y={390} s={.34} shirt="#5b7d75"/> )}</div><Txt x={410} y={90} w={1100} size={52} align="center">賃金は、人材をどこへ動かすかのシグナルでもある。</Txt></>}
 </SceneShell>;
};

export const StreetScene=({beat,p,mode}:{beat:Beat;p:number;mode:string})=>{
 const q=ease(p); const truckMove=((p*1200)%2100)-400; return <SceneShell chapter={beat.chapter} source={beat.source} bg="#101723" cameraX={-30*Math.sin(p*Math.PI)} zoom={1+.02*q}>
   <div style={{position:'absolute',inset:0,background:'linear-gradient(#0a1320,#1b2b3a 58%,#10161d)'}}/>{Array.from({length:8},(_,i)=><Building key={i} x={40+i*245} y={330-(i%3)*60} w={200} h={650+(i%3)*60} lit={.5} color={i%2?'#273b4b':'#203345'}/>)}<Road y={820}/><Truck x={truckMove} y={820} s={.65} label="夜勤 ¥1,450"/><Car x={1700-truckMove*.7} y={915} s={.65}/>
   {mode==='street_jobs'&&<>{[['コンビニ セルフ','1,300円',150],['物流 夜勤','1,450円',540],['介護','募集中',930],['建設','経験者',1320]].map(([a,b,x],i)=><div key={String(a)} style={{position:'absolute',left:Number(x),top:190,width:320,height:150,background:'#0b1118',border:`4px solid ${[C.blue,C.green,C.red,C.gold][i]}`,boxShadow:`0 0 25px ${[C.blue,C.green,C.red,C.gold][i]}44`}}><Txt x={20} y={20} w={280} size={27} color={C.white} align="center">{String(a)}</Txt><Txt x={20} y={72} w={280} size={34} color={[C.blue,C.green,C.red,C.gold][i]} align="center">{String(b)}</Txt></div>)}</>}
   {mode==='final_chain'&&<><FlowNode x={160} y={180} label="時給 1,350" color={C.red}/><Arrow x={390} y={228} w={180}/><FlowNode x={600} y={180} label="ランチ 1,030" color={C.gold}/><Arrow x={830} y={228} w={180}/><FlowNode x={1040} y={180} label="客数変化" color={C.blue}/><Arrow x={1270} y={228} w={180}/><FlowNode x={1480} y={180} label="セルフレジ" color={C.green}/></>}
   {mode==='final_question'&&<><div style={{position:'absolute',left:360,top:170,width:1200,height:420,borderRadius:60,background:'rgba(8,12,18,.82)',border:'5px solid #66737f'}}><Txt x={90} y={70} w={1020} size={64} color={C.white} align="center">その賃上げの費用を、<br/><span style={{color:C.red}}>最後に誰が払うのか？</span></Txt></div></>}
   {mode==='final_burden_map'&&<><div style={{position:'absolute',left:720,top:380,width:480,height:180,borderRadius:90,background:C.red}}><Txt x={50} y={52} w={380} size={48} color={C.white} align="center">人手不足の痛み</Txt></div>{[['給与',180,260,C.green],['価格',1480,260,C.gold],['時間',180,680,C.blue],['労働負荷',1480,680,C.red],['機械',800,720,C.cyan]].map(([l,x,y,c])=><FlowNode key={String(l)} x={Number(x)} y={Number(y)} label={String(l)} color={String(c)} scale={.8+.2*q}/>) }<Txt x={330} y={100} w={1260} size={54} color={C.white} align="center">「上がらない」のではない。別の場所へ移っている。</Txt></>}
 </SceneShell>;
};

export const CaptionLayer=({beat,p}:{beat:Beat;p:number})=><Caption text={beat.narration} p={p}/>;
