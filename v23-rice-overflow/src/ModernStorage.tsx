import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const smooth=(v:number)=>{const x=clamp(v);return x*x*(3-2*x)};
const phase=(p:number,a:number,b:number)=>smooth((p-a)/(b-a));

const RiceBag:React.FC<{left:number;top:number;scale?:number;opacity?:number}>=({left,top,scale=1,opacity=1})=>(
  <div style={{position:'absolute',left,top,width:210*scale,height:285*scale,borderRadius:`${34*scale}px ${34*scale}px ${22*scale}px ${22*scale}px`,background:'linear-gradient(100deg,#d9d6cc,#faf8ef 55%,#c8c3b8)',boxShadow:'0 20px 36px rgba(0,0,0,.22)',border:'1px solid rgba(255,255,255,.45)',opacity}}>
    <div style={{position:'absolute',left:'14%',right:'14%',top:'8%',height:2,background:'#979288',opacity:.35}}/>
    <div style={{position:'absolute',left:0,right:0,top:'28%',textAlign:'center',fontSize:21*scale,fontWeight:700,letterSpacing:3*scale,color:'#57534d'}}>10kg</div>
  </div>
);

export const ModernStorage:React.FC<{p:number}>=({p})=>{
  const f=useCurrentFrame();
  const first=phase(p,.03,.34);
  const second=phase(p,.29,.61);
  const door1=interpolate(first,[0,1],[0,-72]);
  const door2=interpolate(second,[0,1],[0,72]);
  const bag1Y=interpolate(first,[0,1],[640,405]);
  const bag2Y=interpolate(second,[0,1],[665,445]);
  const driftX=Math.sin(f*.012)*5;
  const driftY=Math.cos(f*.009)*3;
  const glow=.32+.06*Math.sin(f*.018);

  return <AbsoluteFill style={{overflow:'hidden',background:'#171b1d',fontFamily:'"Noto Sans CJK JP","Hiragino Sans",sans-serif',color:'#eee9df'}}>
    <div style={{position:'absolute',inset:-30,transform:`translate(${driftX}px,${driftY}px) scale(1.025)`}}>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(125deg,#1c2225 0%,#30373a 46%,#171b1d 100%)'}}/>

      {/* glass corridor / city reflection to keep it unmistakably high-rise */}
      <div style={{position:'absolute',left:115,top:85,width:555,height:855,background:'linear-gradient(180deg,#20282d,#151a1d)',border:'1px solid rgba(170,190,200,.22)',boxShadow:'inset -35px 0 80px rgba(0,0,0,.26)'}}>
        <div style={{position:'absolute',left:55,top:58,width:445,height:270,background:'linear-gradient(180deg,#121a20,#1e2a31)',border:'8px solid #3b474d',overflow:'hidden'}}>
          {Array.from({length:38},(_,i)=><div key={i} style={{position:'absolute',left:`${6+(i%8)*12}%`,top:`${14+Math.floor(i/8)*16}%`,width:4+(i%3)*2,height:3+(i%2)*2,background:i%5===0?'#e7c88e':'#c6d4db',opacity:.22+.5*Math.max(0,Math.sin(f*.025+i*1.7))}}/>)}
        </div>
        <div style={{position:'absolute',left:78,bottom:115,width:365,height:11,background:'#495156',boxShadow:'0 -22px 50px rgba(180,200,210,.035)'}}/>
        <div style={{position:'absolute',left:95,bottom:126,width:330,height:118,background:'linear-gradient(180deg,#51585a,#353a3c)',borderRadius:'12px 12px 4px 4px'}}/>
      </div>

      {/* contemporary built-in pantry / utility closet */}
      <div style={{position:'absolute',right:140,top:90,width:1010,height:860,background:'linear-gradient(180deg,#3a3b39,#252725)',border:'1px solid rgba(255,255,255,.12)',boxShadow:'0 35px 80px rgba(0,0,0,.38)'}}>
        <div style={{position:'absolute',left:70,right:70,top:62,bottom:62,background:'#202321',border:'1px solid rgba(255,255,255,.07)'}}>
          <div style={{position:'absolute',left:42,right:42,top:205,height:6,background:'#5a5d58'}}/>
          <div style={{position:'absolute',left:42,right:42,top:475,height:6,background:'#5a5d58'}}/>
          <div style={{position:'absolute',left:42,right:42,top:690,height:6,background:'#5a5d58'}}/>

          {/* neatly organized household items */}
          {Array.from({length:8},(_,i)=><div key={`box-${i}`} style={{position:'absolute',left:70+(i%4)*195,top:80+Math.floor(i/4)*265,width:128,height:92,background:i%2?'#777b75':'#656a66',borderRadius:5,boxShadow:'0 10px 18px rgba(0,0,0,.2)'}}/>)}
          {Array.from({length:4},(_,i)=><div key={`bottle-${i}`} style={{position:'absolute',left:95+i*170,top:550,width:56,height:116,borderRadius:'18px 18px 9px 9px',background:['#859391','#8a8175','#717d72','#9a958a'][i],opacity:.9}}/>)}

          {/* the two rice bags move into separate shelf bays */}
          <RiceBag left={155} top={bag1Y} scale={.73}/>
          <RiceBag left={565} top={bag2Y} scale={.73}/>
        </div>

        {/* flat-panel doors; lacquer/stone tone, not wood barn doors */}
        <div style={{position:'absolute',left:0,top:0,bottom:0,width:'50%',background:'linear-gradient(90deg,#4b4c49,#3f413e)',borderRight:'1px solid rgba(255,255,255,.13)',transform:`perspective(1200px) rotateY(${door1}deg)`,transformOrigin:'0% 50%',boxShadow:'16px 0 30px rgba(0,0,0,.22)'}}>
          <div style={{position:'absolute',right:28,top:'48%',width:3,height:72,borderRadius:2,background:'#92958f',opacity:.7}}/>
        </div>
        <div style={{position:'absolute',right:0,top:0,bottom:0,width:'50%',background:'linear-gradient(270deg,#4b4c49,#3f413e)',borderLeft:'1px solid rgba(255,255,255,.13)',transform:`perspective(1200px) rotateY(${door2}deg)`,transformOrigin:'100% 50%',boxShadow:'-16px 0 30px rgba(0,0,0,.22)'}}>
          <div style={{position:'absolute',left:28,top:'48%',width:3,height:72,borderRadius:2,background:'#92958f',opacity:.7}}/>
        </div>

        <div style={{position:'absolute',left:45,right:45,top:36,height:2,background:`rgba(230,226,215,${glow})`,filter:'blur(2px)'}}/>
      </div>

      {/* one remaining bag left in the kitchen/corridor */}
      <RiceBag left={790} top={650} scale={.80}/>

      <div style={{position:'absolute',left:0,right:0,bottom:0,height:190,background:'linear-gradient(180deg,transparent,rgba(0,0,0,.34))'}}/>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 55% 42%,transparent 34%,rgba(0,0,0,.26) 100%)'}}/>
    </div>
  </AbsoluteFill>;
};
