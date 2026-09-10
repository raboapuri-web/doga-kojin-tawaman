import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import {getActiveBeatAtSeconds} from './timing';
import {C,Desk,MoneyStack,Paper,Person,SceneShell,Txt} from '../../v18-bubble-cinematic/src/cinematic-primitives';
import {CaptionLayer,ConceptScene,ConditionsScene,DinerScene,FragmentedLaborScene,HistoryScene,MonopsonyScene,OutsideOptionScene,PriceScene,ProductivityScene,ServiceLossScene,SMEscene,SpringScene,StreetScene,WageWebScene,AutomationScene,type Beat} from './scenes';

const beats=scriptData.beats as Beat[];

const BudgetScene=({beat,p}:{beat:Beat;p:number})=>{
  const q=1-Math.pow(1-Math.max(0,Math.min(1,p)),3);
  const costs=[['食材',210,'#b47b52'],['家賃',85,'#6f7e8e'],['光熱',58,'#d2a24f'],['手数料',34,'#7a6d87'],['人件費',210,'#c34f4f']];
  return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e7e0d4" cameraX={-20*q} zoom={1+.02*q}>
    <div style={{position:'absolute',left:120,top:175,width:980,height:680,background:'#d1c5b1',border:'8px solid #806d56'}}><Desk x={150} y={480} w={660}/><Person x={330} y={250} s={.62} shirt="#66788a"/><Paper x={610} y={395} rot={-4} text="売上 680万"/><MoneyStack x={170} y={620} count={7} s={.55}/><Txt x={130} y={80} w={720} size={48} align="center">店長の机には、黒板にない数字がある。</Txt></div>
    <div style={{position:'absolute',left:1170,top:190,width:610,height:630,background:'#f4f0e7',borderRadius:30,border:'5px solid #9a9183'}}><Txt x={55} y={35} w={500} size={42} align="center">売上 680万円</Txt>{costs.map(([label,val,color],i)=><div key={String(label)} style={{position:'absolute',left:60,top:120+i*82,width:490,height:54,background:'#dedbd4',borderRadius:10,overflow:'hidden'}}><div style={{width:`${Number(val)/2.3*q}px`,height:'100%',background:String(color)}}/><Txt x={15} y={8} w={220} size={24}>{String(label)}</Txt><Txt x={350} y={8} w={110} size={24} align="right">{Number(val)}万</Txt></div>)}</div>
  </SceneShell>;
};

function Visual({beat,p}:{beat:Beat;p:number}){
  const v=beat.visual;
  if(['diner_night_intro','diner_kitchen','job_board','diner_close','diner_return','final_edit'].includes(v)) return <DinerScene beat={beat} p={p} mode={v}/>;
  if(v==='diner_books') return <BudgetScene beat={beat} p={p}/>;
  if(['shortage_question','shortage_stats','burden_preview','econ_class','market_adjust'].includes(v)) return <ConceptScene beat={beat} p={p} mode={v}/>;
  if(['fragmented_markets','it_recruit','construction_hospital_logistics','match_friction'].includes(v)) return <FragmentedLaborScene beat={beat} p={p} mode={v}/>;
  if(['diner_wage_web','wage_ripple','office_equity'].includes(v)) return <WageWebScene beat={beat} p={p} mode={v}/>;
  if(['monopsony_home','job_search','monopsony_power'].includes(v)) return <MonopsonyScene beat={beat} p={p} mode={v}/>;
  if(['outside_option','two_engineers','bargain_game'].includes(v)) return <OutsideOptionScene beat={beat} p={p} mode={v}/>;
  if(['metal_shop','price_negotiation','wallet_80'].includes(v)) return <SMEscene beat={beat} p={p} mode={v}/>;
  if(['disappearing_services','consumer_burden','burden_flow'].includes(v)) return <ServiceLossScene beat={beat} p={p} mode={v}/>;
  if(['care_work','baumol_quartet','care_vs_factory'].includes(v)) return <ProductivityScene beat={beat} p={p} mode={v}/>;
  if(['old_wage_room','wage_memory'].includes(v)) return <HistoryScene beat={beat} p={p} mode={v}/>;
  if(['lunch_980','wage_price_loop','pricing_productivity'].includes(v)) return <PriceScene beat={beat} p={p} mode={v}/>;
  if(['spring_5','labor_segments'].includes(v)) return <SpringScene beat={beat} p={p} mode={v}/>;
  if(['self_checkout','automation_world','robot_calc'].includes(v)) return <AutomationScene beat={beat} p={p} mode={v}/>;
  if(['wage_conditions','mobility','bargaining','reallocation'].includes(v)) return <ConditionsScene beat={beat} p={p} mode={v}/>;
  if(['street_jobs','final_chain','final_question','final_burden_map'].includes(v)) return <StreetScene beat={beat} p={p} mode={v}/>;
  return <SceneShell chapter={beat.chapter} source={beat.source} bg="#e8e6df"><Txt x={250} y={300} w={1420} size={60} align="center">{beat.chapter}</Txt><Txt x={310} y={520} w={1300} size={38} align="center">{beat.narration.slice(0,90)}</Txt></SceneShell>;
}

export const V19LaborShortage:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const active=getActiveBeatAtSeconds(frame/fps);
  const beat=beats[active.index]??beats[0];
  return <><Visual beat={beat} p={active.progress}/><CaptionLayer beat={beat} p={active.progress}/></>;
};
