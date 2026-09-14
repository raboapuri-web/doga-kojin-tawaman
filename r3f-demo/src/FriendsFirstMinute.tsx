import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const FPS = 30;
const SCENES = [
  {id:'S01',sec:4,kind:'alone',text:'三十五歳になって、友達が減った。'},
  {id:'S02',sec:5,kind:'chairs',text:'正確に言うと、減ったというより、会わなくなった。'},
  {id:'S03',sec:6,kind:'contacts',text:'誰かと喧嘩したわけではない。絶交した相手もいない。'},
  {id:'S04',sec:3,kind:'contacts',text:'LINEをブロックしたこともない。'},
  {id:'S05',sec:6,kind:'excuses',text:'ただ、「今月ちょっと忙しくて」という言葉を、何度も使っているうちに、'},
  {id:'S06',sec:5,kind:'calendar',text:'気づけば、一年くらい会っていない人が増えていた。'},
  {id:'S07',sec:5,kind:'invite',text:'先週も、大学時代のグループLINEにメッセージが来た。'},
  {id:'S08',sec:6,kind:'invite',text:'「久しぶりに四人で飲まない？」送ってきたのは佐々木だった。'},
  {id:'S09',sec:6,kind:'apartment',text:'僕はその通知を、目黒の自宅のソファで見た。土曜日の午後十一時。'},
  {id:'S10',sec:5,kind:'tv',text:'テレビでは、見たいわけでもないYouTubeが流れていた。'},
  {id:'S11',sec:4,kind:'calendarEmpty',text:'カレンダーを開く。来週の土曜日。何も入っていない。'},
  {id:'S12',sec:5,kind:'reply',text:'その次の土曜日も空いていた。それでも僕は、「今月ちょっとバタバタしてる」と打った。'},
] as const;

type Kind = typeof SCENES[number]['kind'];
const starts = SCENES.map((_,i)=>SCENES.slice(0,i).reduce((a,s)=>a+s.sec*FPS,0));
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>{const x=clamp(v);return x*x*(3-2*x)};

const Person:React.FC<{pos:[number,number,number];color?:string;scale?:number;phase?:number;opacity?:number}>=({pos,color='#46586a',scale=1,phase=0,opacity=1})=>{
  const f=useCurrentFrame(); const bob=Math.sin(f*.04+phase)*.035;
  return <group position={pos} scale={scale}>
    <mesh position={[0,1.72+bob,0]}><sphereGeometry args={[.32,24,24]}/><meshStandardMaterial color="#b9876e" transparent opacity={opacity}/></mesh>
    <mesh position={[0,.9,0]}><capsuleGeometry args={[.4,.85,8,16]}/><meshStandardMaterial color={color} transparent opacity={opacity}/></mesh>
    <mesh position={[-.48,1.02,0]} rotation={[0,0,.35]}><capsuleGeometry args={[.1,.62,6,12]}/><meshStandardMaterial color={color} transparent opacity={opacity}/></mesh>
    <mesh position={[.48,1.02,0]} rotation={[0,0,-.35]}><capsuleGeometry args={[.1,.62,6,12]}/><meshStandardMaterial color={color} transparent opacity={opacity}/></mesh>
    <mesh position={[-.2,.02,0]}><capsuleGeometry args={[.12,.78,6,12]}/><meshStandardMaterial color="#1c2329" transparent opacity={opacity}/></mesh>
    <mesh position={[.2,.02,0]}><capsuleGeometry args={[.12,.78,6,12]}/><meshStandardMaterial color="#1c2329" transparent opacity={opacity}/></mesh>
  </group>
};

const Chair:React.FC<{x:number;z:number;away?:number}>=({x,z,away=0})=><group position={[x,0,z-away]}>
  <mesh position={[0,.45,0]}><boxGeometry args={[1.0,.16,1.0]}/><meshStandardMaterial color="#47382f"/></mesh>
  <mesh position={[0,1.15,.42]}><boxGeometry args={[1.0,1.35,.12]}/><meshStandardMaterial color="#403029"/></mesh>
  {[-.38,.38].map((sx,i)=><mesh key={i} position={[sx,.05,0]}><boxGeometry args={[.1,.9,.1]}/><meshStandardMaterial color="#1b1715"/></mesh>)}
</group>;

const CityWindow:React.FC=()=>{const f=useCurrentFrame();return <group position={[0,3,-5.0]}>
  <mesh><planeGeometry args={[6.7,4.1]}/><meshBasicMaterial color="#102333"/></mesh>
  {Array.from({length:40},(_,i)=>{const x=-3+(i%8)*.78;const y=-1.7+Math.floor(i/8)*.75;const on=.15+.55*Math.max(0,Math.sin(f*.025+i));return <mesh key={i} position={[x,y,.02]}><planeGeometry args={[.18,.28]}/><meshBasicMaterial color="#e0bd74" transparent opacity={on}/></mesh>})}
</group>};

const ApartmentSet:React.FC<{tv?:boolean;phoneGlow?:boolean}>=({tv=false,phoneGlow=false})=><>
  <mesh position={[0,-.12,0]}><boxGeometry args={[14,.2,11]}/><meshStandardMaterial color="#2a2826" roughness={.95}/></mesh>
  <mesh position={[0,3.5,-5.2]}><boxGeometry args={[14,7,.2]}/><meshStandardMaterial color="#272421"/></mesh>
  <mesh position={[-6.8,3.5,0]}><boxGeometry args={[.2,7,11]}/><meshStandardMaterial color="#211f1d"/></mesh>
  <CityWindow/>
  <mesh position={[0,.55,1.1]}><boxGeometry args={[4.4,1.1,1.8]}/><meshStandardMaterial color="#47433f" roughness={.9}/></mesh>
  <mesh position={[0,.58,-1.0]}><boxGeometry args={[2.8,.16,1.5]}/><meshStandardMaterial color="#654b35" roughness={.75}/></mesh>
  <mesh position={[3.9,1.8,-4.85]}><boxGeometry args={[3.2,2.0,.16]}/><meshBasicMaterial color={tv?'#537393':'#141414'} /></mesh>
  {tv&&<pointLight position={[3.3,2.1,-2.2]} intensity={42} distance={7} color="#7ea4ca"/>}
  {phoneGlow&&<pointLight position={[.6,1.25,.15]} intensity={22} distance={3} color="#85b9e8"/>}
</>;

const PhoneSlab:React.FC<{z?:number;tilt?:number}>=({z=0,tilt=0})=><group position={[0,2.2,z]} rotation={[.08,tilt,0]}>
  <mesh><boxGeometry args={[2.7,5.2,.22]}/><meshPhysicalMaterial color="#101317" roughness={.25} metalness={.45}/></mesh>
  <mesh position={[0,0,.13]}><planeGeometry args={[2.38,4.72]}/><meshBasicMaterial color="#e8ebe9"/></mesh>
</group>;

const CameraRig:React.FC<{kind:Kind;p:number}>=({kind,p})=>{
  const {camera}=useThree(); const t=ease(p); const f=useCurrentFrame();
  const cfg:Record<Kind,{a:[number,number,number];b:[number,number,number];ta:[number,number,number];tb:[number,number,number]}>= {
    alone:{a:[7.7,4.3,9.2],b:[3.7,2.8,6.2],ta:[0,1,0],tb:[0,.9,0]},
    chairs:{a:[6.4,5.3,7.5],b:[.6,6.0,5.4],ta:[0,.7,0],tb:[0,.2,-.8]},
    contacts:{a:[5.4,3.4,7.4],b:[-3.2,2.8,6.2],ta:[0,1,0],tb:[0,1,0]},
    excuses:{a:[6,3.3,7],b:[1.2,2.4,4.1],ta:[0,1,0],tb:[0,1,0]},
    calendar:{a:[0,3.3,10],b:[0,2.2,4.2],ta:[0,1.2,0],tb:[0,1.2,-2]},
    invite:{a:[4.5,3.3,8.5],b:[.3,2.4,5.0],ta:[0,2,0],tb:[0,2,0]},
    apartment:{a:[7.3,4.4,8.6],b:[2.7,2.5,5.2],ta:[0,1.1,0],tb:[0,1.1,.3]},
    tv:{a:[-3.9,2.5,5.8],b:[3.2,2.2,4.7],ta:[2.8,1.9,-4],tb:[3.4,1.9,-4]},
    calendarEmpty:{a:[0,5.8,8.2],b:[0,3.1,4.6],ta:[0,.8,0],tb:[0,.7,-1]},
    reply:{a:[4.2,3.0,7.0],b:[.4,2.2,4.3],ta:[0,2,0],tb:[0,2,0]},
  };
  const c=cfg[kind]; const pos=new THREE.Vector3(...c.a).lerp(new THREE.Vector3(...c.b),t); pos.y+=Math.sin(f*.03)*.025;
  const target=new THREE.Vector3(...c.ta).lerp(new THREE.Vector3(...c.tb),t);
  camera.position.copy(pos); camera.lookAt(target); camera.updateProjectionMatrix(); return null;
};

const World:React.FC<{kind:Kind;p:number}>=({kind,p})=>{
  const f=useCurrentFrame(); const warm=kind==='invite';
  return <>
    <color attach="background" args={[warm?'#17100d':'#0b1016']}/><fog attach="fog" args={[warm?'#17100d':'#0b1016',7,20]}/>
    <ambientLight intensity={.22}/><directionalLight position={[5,8,5]} intensity={.42} color="#a8bdd0"/>
    <pointLight position={[0,5,2]} intensity={warm?72:45} distance={12} color={warm?'#ffb56a':'#86a6c3'}/>
    <CameraRig kind={kind} p={p}/>
    {(kind==='alone'||kind==='apartment'||kind==='tv')&&<><ApartmentSet tv={kind==='tv'} phoneGlow={kind==='apartment'}/><Person pos={[0,.1,1.1]} color="#3e4b58" phase={1}/></>}
    {kind==='chairs'&&<><mesh position={[0,-.1,0]}><boxGeometry args={[14,.2,11]}/><meshStandardMaterial color="#27231f"/></mesh><mesh position={[0,.85,0]}><boxGeometry args={[4.8,.2,3.2]}/><meshStandardMaterial color="#5a3d29"/></mesh>{[[-2,-1.4],[2,-1.4],[-2,1.5],[2,1.5]].map((v,i)=><Chair key={i} x={v[0]} z={v[1]} away={i===0?0:ease(p)*6}/>)}</>}
    {kind==='contacts'&&<><Person pos={[0,.1,0]} color="#3d4d5d"/>{Array.from({length:9},(_,i)=>{const a=i/9*Math.PI*2;const r=3.2+Math.sin(i)*.4;return <group key={i} position={[Math.cos(a)*r,1.4+(i%3)*.55,Math.sin(a)*r]}><mesh><sphereGeometry args={[.28,18,18]}/><meshStandardMaterial color={i%3===0?'#7d93aa':'#5c6974'} transparent opacity={.72}/></mesh><mesh position={[0,-.45,0]}><boxGeometry args={[1.0,.06,.06]}/><meshBasicMaterial color="#7aa0c1" transparent opacity={.25}/></mesh></group>})}</>}
    {kind==='excuses'&&<><Person pos={[0,.1,0]} color="#3a4854"/>{Array.from({length:14},(_,i)=>{const row=Math.floor(i/5),col=i%5;const z=2.5-row*1.4;const x=-4+col*2;const enter=clamp((p-i*.035)*2.2);return <mesh key={i} position={[x,1.0+row*1.0,z+3*(1-enter)]}><boxGeometry args={[1.55,.72,.16]}/><meshStandardMaterial color="#617485" transparent opacity={.18+.58*enter}/></mesh>})}</>}
    {kind==='calendar'&&<>{Array.from({length:12},(_,i)=>{const z=4-i*.9+ease(p)*5;const rot=(i%2?1:-1)*ease(p)*.32;return <mesh key={i} position={[(i%3-1)*1.4,1.4+(i%2)*.7,z]} rotation={[rot,0,0]}><boxGeometry args={[2.4,1.45,.08]}/><meshStandardMaterial color="#d7d5cf" transparent opacity={.35+.05*i}/></mesh>})}</>}
    {kind==='invite'&&<><PhoneSlab tilt={-.08}/>{Array.from({length:4},(_,i)=><group key={i} position={[-2.7+i*1.8,.7,-2.2]}><mesh><cylinderGeometry args={[.18,.16,.52,18]}/><meshStandardMaterial color="#c99239" transparent opacity={.35+.5*ease(p)}/></mesh></group>)}</>}
    {kind==='calendarEmpty'&&<>{Array.from({length:6},(_,i)=><mesh key={i} position={[-3.2+i*1.3,1.2+(i%2)*.8,-i*.25]} rotation={[0,(i-2.5)*.05,0]}><boxGeometry args={[1.1,1.6,.06]}/><meshStandardMaterial color="#e6e4df" transparent opacity={.5}/></mesh>)}</>}
    {kind==='reply'&&<><PhoneSlab tilt={.06}/>{Array.from({length:8},(_,i)=>{const enter=clamp((p-i*.06)*2);return <mesh key={i} position={[-3.5+(i%4)*2.3,1.0+Math.floor(i/4)*1.2,2.5-3*enter]}><boxGeometry args={[1.7,.72,.14]}/><meshStandardMaterial color="#657685" transparent opacity={.15+.65*enter}/></mesh>})}</>}
  </>;
};

const PhoneUI:React.FC<{kind:Kind;p:number}>=({kind,p})=>{
  if(!['invite','reply'].includes(kind))return null;
  const reply=kind==='reply';
  return <div style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',width:330,height:650,borderRadius:45,border:'10px solid rgba(20,24,28,.94)',background:'#edf0ee',boxShadow:'0 30px 90px rgba(0,0,0,.55)',overflow:'hidden',fontFamily:'Noto Sans CJK JP, sans-serif',opacity:.92}}>
    <div style={{height:48,background:'#d9dedb',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'#333'}}>大学の友達</div>
    {!reply&&<><div style={{padding:20,fontSize:16,color:'#68706c'}}>佐々木</div><div style={{margin:'0 18px',padding:'16px 18px',borderRadius:18,background:'#fff',fontSize:22,color:'#222',transform:`scale(${.9+.1*ease(p)})`}}>久しぶりに四人で飲まない？</div></>}
    {reply&&<><div style={{position:'absolute',left:18,right:18,bottom:92,height:48,borderRadius:18,background:'#fff',padding:'12px 15px',fontSize:20,color:'#333'}}>今月ちょっとバタバタしてる<span style={{opacity:p>.55?1:0}}>|</span></div><div style={{position:'absolute',right:22,bottom:28,padding:'10px 18px',borderRadius:18,background:'#80c98b',fontWeight:700,color:'#17301b'}}>送信</div></>}
  </div>;
};

export const FriendsFirstMinute:React.FC=()=>{
  const frame=useCurrentFrame(); const {width,height}=useVideoConfig();
  let idx=SCENES.length-1; for(let i=0;i<SCENES.length;i++){const start=starts[i],end=start+SCENES[i].sec*FPS;if(frame>=start&&frame<end){idx=i;break;}}
  const s=SCENES[idx],start=starts[idx],len=s.sec*FPS,local=frame-start,p=clamp(local/Math.max(1,len-1));
  const edge=Math.max(interpolate(local,[0,7],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),interpolate(local,[len-8,len-1],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}));
  return <AbsoluteFill style={{background:'#080c11'}}>
    <ThreeCanvas width={width} height={height} camera={{fov:43,near:.1,far:60}}><World kind={s.kind} p={p}/></ThreeCanvas>
    <AbsoluteFill style={{background:'radial-gradient(circle at 50% 45%,transparent 36%,rgba(0,0,0,.58) 100%)',pointerEvents:'none'}}/>
    <AbsoluteFill style={{opacity:.045,mixBlendMode:'screen',backgroundImage:'repeating-radial-gradient(circle at 15% 25%,rgba(255,255,255,.7) 0 1px,transparent 1px 4px)',backgroundSize:'7px 7px',transform:`translate(${frame%7}px,${(frame*3)%7}px)`,pointerEvents:'none'}}/>
    <PhoneUI kind={s.kind} p={p}/>
    <div style={{position:'absolute',left:70,top:55,fontFamily:'Noto Sans CJK JP, sans-serif',fontSize:18,letterSpacing:4,color:'rgba(255,255,255,.45)'}}>R3F HYBRID TEST / {s.id}</div>
    <div style={{position:'absolute',left:'50%',bottom:44,transform:'translateX(-50%)',maxWidth:1240,padding:'9px 18px',borderRadius:8,background:'rgba(0,0,0,.38)',backdropFilter:'blur(7px)',fontFamily:'Noto Sans CJK JP, sans-serif',fontSize:25,lineHeight:1.45,fontWeight:600,letterSpacing:.5,textAlign:'center',color:'#f5f2ea',textShadow:'0 2px 8px #000'}}>{s.text}</div>
    <AbsoluteFill style={{background:'#06080b',opacity:edge*.82,pointerEvents:'none'}}/>
  </AbsoluteFill>;
};
