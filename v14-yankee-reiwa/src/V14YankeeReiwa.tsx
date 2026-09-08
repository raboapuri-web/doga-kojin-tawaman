import React from 'react';
import {AbsoluteFill,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import {getActiveBeatAtSeconds} from './timing';

const C={
  ink:'#11141a', paper:'#f4efe4', warm:'#f0b36d', orange:'#e8613c', red:'#cb454d',
  blue:'#4b6fd8', cyan:'#67c6d4', gold:'#d8a94f', night:'#0b0e14', smoke:'#252c36',
  green:'#4f8f73', skin:'#d9a27d', white:'#f9fafc', gray:'#9ea6b2', asphalt:'#24272d'
};
const clamp=(v:number,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=(p:number)=>{const q=clamp(p);return q*q*(3-2*q)};
const lerp=(a:number,b:number,p:number)=>a+(b-a)*clamp(p);
const wave=(p:number,f=1)=>Math.sin(p*Math.PI*2*f);
const sceneFade=(p:number)=>interpolate(p,[0,.025,.965,1],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});

function Text({x,y,size=48,color=C.white,children,weight=800,opacity=1,align='left',width,letterSpacing=0}:{x:number;y:number;size?:number;color?:string;children:React.ReactNode;weight?:number;opacity?:number;align?:'left'|'center'|'right';width?:number;letterSpacing?:number}){
  return <div style={{position:'absolute',left:x,top:y,width,fontFamily:'"Noto Sans CJK JP","Yu Gothic",sans-serif',fontSize:size,fontWeight:weight,lineHeight:1.35,color,opacity,textAlign:align,letterSpacing,textShadow:color===C.white?'0 3px 18px rgba(0,0,0,.45)':'none'}}>{children}</div>;
}

function Person({x,y,s=1,shirt='#3c465c',skin=C.skin,hair='#2b2623',opacity=1,rot=0,coat=false}:{x:number;y:number;s?:number;shirt?:string;skin?:string;hair?:string;opacity?:number;rot?:number;coat?:boolean}){
  return <div style={{position:'absolute',left:x,top:y,width:110*s,height:245*s,opacity,transform:`rotate(${rot}deg)`,transformOrigin:'50% 100%'}}>
    <div style={{position:'absolute',left:28*s,top:0,width:56*s,height:62*s,borderRadius:'46%',background:skin}}/>
    <div style={{position:'absolute',left:23*s,top:-5*s,width:66*s,height:28*s,borderRadius:'48% 48% 20% 20%',background:hair}}/>
    <div style={{position:'absolute',left:14*s,top:58*s,width:82*s,height:118*s,borderRadius:`${28*s}px ${28*s}px ${14*s}px ${14*s}px`,background:coat?'#ecece8':shirt,border:coat?`${3*s}px solid #c6c8cc`:'none'}}/>
    <div style={{position:'absolute',left:15*s,top:168*s,width:30*s,height:77*s,borderRadius:15*s,background:shirt}}/>
    <div style={{position:'absolute',right:15*s,top:168*s,width:30*s,height:77*s,borderRadius:15*s,background:shirt}}/>
  </div>;
}

function Phone({x,y,w=230,h=440,rot=0,glow=0,children}:{x:number;y:number;w?:number;h?:number;rot?:number;glow?:number;children?:React.ReactNode}){
  return <div style={{position:'absolute',left:x,top:y,width:w,height:h,borderRadius:34,background:'#090b10',border:'7px solid #313642',boxShadow:`0 0 ${45+glow*80}px rgba(87,141,255,${.18+.4*glow})`,transform:`rotate(${rot}deg)`,overflow:'hidden'}}>
    <div style={{position:'absolute',inset:12,borderRadius:23,background:'linear-gradient(180deg,#15213b,#0b0f18)'}}>{children}</div>
  </div>;
}

function Desk({x,y,w=700,h=55}:{x:number;y:number;w?:number;h?:number}){
  return <><div style={{position:'absolute',left:x,top:y,width:w,height:h,borderRadius:16,background:'#9a6d4c',boxShadow:'0 18px 35px rgba(0,0,0,.18)'}}/><div style={{position:'absolute',left:x+35,top:y+h,width:25,height:190,background:'#6f4d36'}}/><div style={{position:'absolute',left:x+w-60,top:y+h,width:25,height:190,background:'#6f4d36'}}/></>;
}

function Car({x,y,s=1,color='#5a6373',opacity=1}:{x:number;y:number;s?:number;color?:string;opacity?:number}){
  return <div style={{position:'absolute',left:x,top:y,width:240*s,height:105*s,opacity}}>
    <div style={{position:'absolute',left:18*s,top:34*s,width:205*s,height:58*s,borderRadius:18*s,background:color}}/>
    <div style={{position:'absolute',left:66*s,top:5*s,width:110*s,height:48*s,borderRadius:'28px 32px 8px 8px',background:color}}/>
    <div style={{position:'absolute',left:82*s,top:13*s,width:38*s,height:28*s,background:'#96b4c7'}}/><div style={{position:'absolute',left:126*s,top:13*s,width:38*s,height:28*s,background:'#96b4c7'}}/>
    <div style={{position:'absolute',left:45*s,top:78*s,width:38*s,height:38*s,borderRadius:'50%',background:'#171a20'}}/><div style={{position:'absolute',right:38*s,top:78*s,width:38*s,height:38*s,borderRadius:'50%',background:'#171a20'}}/>
  </div>;
}

function Bike({x,y,s=1,opacity=1,headlight=1}:{x:number;y:number;s?:number;opacity?:number;headlight?:number}){
  return <div style={{position:'absolute',left:x,top:y,width:150*s,height:125*s,opacity}}>
    <div style={{position:'absolute',left:18*s,bottom:0,width:48*s,height:48*s,borderRadius:'50%',border:`${8*s}px solid #16191f`}}/><div style={{position:'absolute',right:10*s,bottom:0,width:48*s,height:48*s,borderRadius:'50%',border:`${8*s}px solid #16191f`}}/>
    <div style={{position:'absolute',left:43*s,top:50*s,width:70*s,height:18*s,borderRadius:9*s,background:'#6b3440',transform:'rotate(-8deg)'}}/>
    <div style={{position:'absolute',left:73*s,top:10*s,width:30*s,height:55*s,borderRadius:14*s,background:'#222831'}}/>
    <div style={{position:'absolute',right:16*s,top:35*s,width:24*s,height:24*s,borderRadius:'50%',background:'#fff5bb',boxShadow:`0 0 ${30*headlight}px rgba(255,243,173,.8)`}}/>
  </div>;
}

function Crowd({count=24,y=640,spread=1700,baseX=100,s=1,phase=0}:{count?:number;y?:number;spread?:number;baseX?:number;s?:number;phase?:number}){
  return <>{Array.from({length:count},(_,i)=>{const col=i%Math.ceil(Math.sqrt(count)*1.7);const row=Math.floor(i/Math.ceil(Math.sqrt(count)*1.7));const x=baseX+(col/(Math.max(1,Math.ceil(Math.sqrt(count)*1.7)-1)))*spread+(row%2)*28;const yy=y-row*82+wave(phase+i*.07,1)*7;const scale=s*(.72+row*.08);return <Person key={i} x={x} y={yy} s={scale} shirt={i%4===0?'#6a4b54':i%4===1?'#384a60':i%4===2?'#46513e':'#5d5144'}/>})}</>;
}

function Bubble({x,y,w=370,text,opacity=1,bg=C.white,color=C.ink}:{x:number;y:number;w?:number;text:string;opacity?:number;bg?:string;color?:string}){
  return <div style={{position:'absolute',left:x,top:y,width:w,padding:'24px 30px',borderRadius:28,background:bg,color,opacity,boxShadow:'0 18px 45px rgba(0,0,0,.14)',fontFamily:'"Noto Sans CJK JP","Yu Gothic",sans-serif',fontSize:32,fontWeight:800,lineHeight:1.45}}>{text}</div>;
}

function Caption({text,p}:{text:string;p:number}){
  const sentences=(text.match(/[^。！？]+[。！？]?/g)??[text]).map(s=>s.trim()).filter(Boolean);
  const chunks:string[]=[];
  for(const s of sentences){
    if(!chunks.length||chunks[chunks.length-1].length+s.length>42) chunks.push(s);
    else chunks[chunks.length-1]+=s;
  }
  const idx=Math.min(chunks.length-1,Math.floor(clamp(p)*chunks.length));
  const current=chunks[Math.max(0,idx)]??text;
  return <div style={{position:'absolute',left:120,right:120,bottom:34,minHeight:92,display:'flex',alignItems:'center',justifyContent:'center',padding:'10px 24px',fontFamily:'"Noto Sans CJK JP","Yu Gothic",sans-serif',fontSize:36,fontWeight:800,lineHeight:1.48,textAlign:'center',color:'#fff',textShadow:'0 4px 16px rgba(0,0,0,.95)',zIndex:100}}>{current}</div>;
}

function Chapter({name}:{name:string}){
  return <div style={{position:'absolute',left:54,top:38,fontFamily:'"Noto Sans CJK JP","Yu Gothic",sans-serif',fontSize:20,fontWeight:800,letterSpacing:2.4,color:'rgba(255,255,255,.76)',zIndex:80}}>{name}</div>;
}

function Shell({p,chapter,bg=C.night,children}:{p:number;chapter:string;bg?:string;children:React.ReactNode}){
  return <AbsoluteFill style={{background:bg,overflow:'hidden',opacity:sceneFade(p)}}>
    {children}
    <Chapter name={chapter}/>
  </AbsoluteFill>;
}

function OfficeGrid({p}:{p:number}){
  return <>{Array.from({length:5},(_,r)=>Array.from({length:4},(_,c)=><React.Fragment key={`${r}-${c}`}><Desk x={120+c*430} y={230+r*150} w={320} h={28}/><Person x={205+c*430} y={145+r*150} s={.48} shirt={(r+c)%2? '#596476':'#3f4b61'}/></React.Fragment>))}</>;
}

function SceneVisual({index,p,chapter}:{index:number;p:number;chapter:string}){
  const q=ease(p);
  switch(index){
    case 0:{
      const type=ease((p-.28)/.52);
      return <Shell p={p} chapter={chapter} bg="linear-gradient(180deg,#dfe7ef,#cbd5df)">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,rgba(255,255,255,.2),transparent 45%)'}}/>
        <Desk x={260} y={690} w={1380} h={58}/>
        <Person x={760} y={395} s={1.18} shirt="#485b73"/>
        <div style={{position:'absolute',left:590,top:310,width:520,height:310,borderRadius:24,background:'#1d2532',boxShadow:'0 25px 60px rgba(0,0,0,.25)'}}>
          <div style={{position:'absolute',inset:20,borderRadius:14,background:'#f5f7fa'}}/>
          <div style={{position:'absolute',left:45,top:50,width:430,height:90,borderRadius:18,background:'#e9edf4'}}/>
          <Bubble x={70} y={62} w={370} text="この資料、今日中に直せますか？" bg="#dfe9ff" opacity={q}/>
          <div style={{position:'absolute',left:70,top:185,width:Math.max(8,330*type),height:18,borderRadius:9,background:'#8ea0b7'}}/>
          <div style={{position:'absolute',left:70,top:225,width:Math.max(8,230*type),height:18,borderRadius:9,background:'#8ea0b7'}}/>
        </div>
        <Text x={160} y={110} size={64} color={C.ink}>午前8時47分。</Text>
        <Text x={1280} y={270} size={30} color={C.red} opacity={ease((p-.55)/.3)}>本音：昨日も直した。</Text>
      </Shell>;
    }
    case 1:{
      return <Shell p={p} chapter={chapter} bg="linear-gradient(180deg,#eef2f5,#ccd5dd)">
        <div style={{position:'absolute',left:290,top:330,width:1320,height:390,borderRadius:'50%',background:'#c9b59e',boxShadow:'0 24px 70px rgba(0,0,0,.18)'}}/>
        {[0,1,2,3,4,5].map(i=><Person key={i} x={420+i*205} y={250+(i%2)*30} s={.8} shirt={i%2?'#43546c':'#59636f'} rot={wave(p+i*.1)*1.5}/>) }
        {['なるほどですね','一度持ち帰ります','検討させてください'].map((t,i)=><Bubble key={t} x={310+i*510} y={120+(i%2)*40} w={420} text={t} opacity={ease((p-.08-i*.1)/.3)}/>) }
        <Text x={630} y={785} size={58} color={C.ink}>誰も怒鳴らない。実に文明的である。</Text>
      </Shell>;
    }
    case 2:{
      const scroll=lerp(0,-680,q);
      return <Shell p={p} chapter={chapter} bg="radial-gradient(circle at 65% 50%,#1a2745,#080a0f 62%)">
        <div style={{position:'absolute',left:120,top:185,width:820,height:520,borderRadius:'55% 45% 25% 20%',background:'#181b22',transform:`rotate(${wave(p,.5)*1.5}deg)`}}/>
        <Person x={395} y={430} s={1.35} shirt="#242b39"/>
        <Phone x={1080} y={180} w={330} h={650} rot={-4} glow={q}>
          <div style={{position:'absolute',left:0,right:0,top:scroll}}>
            {Array.from({length:6},(_,i)=><div key={i} style={{height:220,borderBottom:'2px solid rgba(255,255,255,.08)',position:'relative',background:i%2?'linear-gradient(135deg,#2b1b22,#11151e)':'linear-gradient(135deg,#172337,#2b171a)'}}>
              <Person x={35} y={50} s={.55} shirt={i%2?C.red:C.blue}/><Person x={165} y={45} s={.58} shirt={i%2?C.blue:C.red}/>
              <div style={{position:'absolute',left:34,top:24,fontSize:18,fontFamily:'sans-serif',fontWeight:900,color:'#fff'}}>{i%2?'俺は仲間を裏切らない':'嫌いなら嫌いって言え'}</div>
            </div>)}
          </div>
        </Phone>
        <Text x={120} y={90} size={62}>午後11時。</Text>
        <Text x={160} y={760} size={52} opacity={ease((p-.5)/.35)}>男は、次の動画を押す。</Text>
      </Shell>;
    }
    case 3:{
      return <Shell p={p} chapter={chapter} bg="linear-gradient(135deg,#10131a,#26202a)">
        <div style={{position:'absolute',left:160,top:150,width:1600,height:650,transform:`scale(${.94+.06*q})`}}>
          {['暴力を減らす','上下関係を薄める','怒りを制御する','衝突を避ける'].map((t,i)=><div key={t} style={{position:'absolute',left:60,top:80+i*120,fontFamily:'sans-serif',fontSize:42,fontWeight:800,color:'#aeb7c7',opacity:1-i*.1}}>{t}<span style={{marginLeft:35,color:C.cyan}}>→</span></div>)}
          <div style={{position:'absolute',left:780,top:15,width:2,height:590,background:'rgba(255,255,255,.16)'}}/>
          <Text x={875} y={70} size={66} color={C.orange}>ラヴ上等</Text>
          <Text x={875} y={200} size={66} color={C.red}>BreakingDown</Text>
          <Text x={875} y={330} size={54}>元ヤンキー / 元不良</Text>
          <div style={{position:'absolute',left:870,top:455,width:560,height:8,background:C.red,transform:`scaleX(${q})`,transformOrigin:'left'}}/>
          <Text x={875} y={500} size={34} color="#d2d7e0">現実とエンタメが逆方向へ進む。</Text>
        </div>
      </Shell>;
    }
    case 4:{
      const fall=ease((p-.2)/.55);
      return <Shell p={p} chapter={chapter} bg="linear-gradient(180deg,#131822,#080a0f)">
        <svg width="1920" height="1080" style={{position:'absolute',inset:0}}>
          <path d="M180 260 C450 250 620 360 860 430 S1300 620 1720 760" fill="none" stroke={C.cyan} strokeWidth="10" opacity=".75"/>
          {Array.from({length:7},(_,i)=><circle key={i} cx={180+i*255} cy={260+i*i*11} r="14" fill={C.cyan}/>) }
        </svg>
        <Text x={160} y={130} size={58}>現実の暴走族は、長期的には縮小してきた。</Text>
        <div style={{position:'absolute',left:690,top:500,width:540,height:220,border:`4px solid ${C.orange}`,borderRadius:110,opacity:fall,transform:`scale(${.75+.25*fall})`}}/>
        <Text x={720} y={548} size={44} color={C.orange} opacity={fall}>復活したのは「見ること」</Text>
        <Text x={450} y={800} size={54} opacity={ease((p-.55)/.3)}>では、なぜ令和の私たちは見たくなるのか。</Text>
      </Shell>;
    }
    case 5:{
      const road=lerp(0,160,q);
      return <Shell p={p} chapter={chapter} bg="linear-gradient(180deg,#080b12 0%,#181c23 62%,#24272d 62%)">
        <div style={{position:'absolute',left:0,right:0,top:670,bottom:0,background:C.asphalt}}/>
        {Array.from({length:10},(_,i)=><div key={i} style={{position:'absolute',left:900+(i%2?1:-1)*(90+i*115),top:760+i*18,width:16,height:110,background:'rgba(255,255,255,.65)',transform:`translateY(${road*(i%3)}px) scale(${1+i*.08})`}}/>) }
        {Array.from({length:14},(_,i)=>{const depth=i/14;return <Bike key={i} x={260+i*105+wave(p+i*.03)*18} y={500+depth*270} s={.48+depth*.6} opacity={.42+depth*.58} headlight={1+depth}/>})}
        <Text x={120} y={110} size={68}>1980年代。夜の国道。</Text>
        <Text x={120} y={205} size={38} color="#d0d5dd">同じ背中、同じ名前、同じチーム。</Text>
      </Shell>;
    }
    case 6:{
      return <Shell p={p} chapter={chapter} bg="linear-gradient(180deg,#11151b,#24272c)">
        <div style={{position:'absolute',left:0,right:0,bottom:0,height:360,background:'#35383d'}}/>
        <div style={{position:'absolute',left:1250,top:250,width:170,height:370,background:'#e8e3d7',boxShadow:'0 0 70px rgba(250,229,180,.16)'}}/>
        <Text x={1275} y={275} size={26} color={C.ink}>VENDING</Text>
        <Car x={180} y={620} s={1.05} color="#5b6677"/><Car x={1490} y={640} s={.85} color="#6f514d"/>
        {[0,1,2,3,4,5].map(i=><Person key={i} x={520+i*120} y={560+(i%2)*25} s={.75} shirt={i%3===0?'#5a2830':'#343f51'} rot={wave(p+i*.12)*2}/>) }
        {['仕事','車','情報','恋愛','揉め事'].map((t,i)=><div key={t} style={{position:'absolute',left:480+i*170,top:400-(i%2)*45,padding:'12px 18px',fontFamily:'sans-serif',fontSize:24,fontWeight:800,color:'#f2e9d7',borderBottom:`2px solid ${C.gold}`,opacity:ease((p-.1-i*.08)/.3)}}>{t}</div>)}
        <Text x={130} y={110} size={60}>人間関係が、異常に濃い。</Text>
      </Shell>;
    }
    case 7:{
      const expand=ease((p-.12)/.7);
      return <Shell p={p} chapter={chapter} bg="radial-gradient(circle at center,#172237,#090c12 70%)">
        <div style={{position:'absolute',left:960,top:500,width:18,height:18,borderRadius:'50%',background:C.orange,boxShadow:'0 0 40px rgba(232,97,60,.7)'}}/>
        {Array.from({length:70},(_,i)=>{const a=(i/70)*Math.PI*2*5.2;const r=(70+(i%11)*42)*expand;const x=960+Math.cos(a)*r;const y=510+Math.sin(a)*r*.58;return <React.Fragment key={i}><div style={{position:'absolute',left:x,top:y,width:8+(i%3)*4,height:8+(i%3)*4,borderRadius:'50%',background:i%9===0?C.cyan:'#8b96aa',opacity:.3+.6*expand}}/>{i%7===0&&<div style={{position:'absolute',left:960,top:510,width:Math.hypot(x-960,y-510),height:1,background:'rgba(120,150,190,.18)',transformOrigin:'left',transform:`rotate(${Math.atan2(y-510,x-960)}rad)`}}/>}</React.Fragment>})}
        <Text x={110} y={95} size={56}>連絡先は増えた。</Text>
        <Text x={110} y={170} size={42} color="#aeb9ca">一つの関係に賭けるものは、小さくなった。</Text>
      </Shell>;
    }
    case 8:{
      const disappear=ease((p-.25)/.55);
      return <Shell p={p} chapter={chapter} bg="linear-gradient(180deg,#121723,#090c12)">
        <Phone x={240} y={180} w={300} h={600} rot={5} glow={.25}>
          {['ミュート','既読をつけない','フォロー解除','退職'].map((t,i)=><div key={t} style={{margin:'34px 20px',padding:'24px',borderRadius:18,background:'rgba(255,255,255,.08)',fontFamily:'sans-serif',fontSize:24,fontWeight:700,color:'#dfe7f2',opacity:1-disappear*(i+1)/4}}>{t}</div>)}
        </Phone>
        <Person x={1120} y={420} s={1.42} shirt="#283347" opacity={1}/>
        {Array.from({length:10},(_,i)=><div key={i} style={{position:'absolute',left:950+(i%5)*120,top:250+Math.floor(i/5)*220,width:46,height:46,borderRadius:'50%',background:'#566479',opacity:(1-disappear)*(i%3?1:.6),transform:`translate(${disappear*(i%2?280:-260)}px,${disappear*(i<5?-160:190)}px)`}}/>) }
        <Text x={820} y={110} size={60}>それでも夜11時、部屋にいるのは一人。</Text>
      </Shell>;
    }
    case 9:{
      return <Shell p={p} chapter={chapter} bg="linear-gradient(135deg,#1a1322,#0d1117)">
        <div style={{position:'absolute',left:180,top:260,width:420,height:520,borderRadius:40,background:'#201b29',border:'2px solid rgba(255,255,255,.08)'}}>
          <Text x={38} y={42} size={42} color={C.gold}>Randall Collins</Text>
          <Text x={38} y={112} size={30} color="#c6c9d2">Interaction Ritual</Text>
          {['同じ場所','同じ注意','同じ感情','内と外の境界'].map((t,i)=><div key={t} style={{position:'absolute',left:42,top:205+i*70,width:300,height:46,fontFamily:'sans-serif',fontSize:28,fontWeight:800,color:i===3?C.orange:'#e5e7ed',opacity:ease((p-.12-i*.1)/.3)}}>{t}</div>)}
        </div>
        <div style={{position:'absolute',left:990,top:470,width:32,height:32,borderRadius:'50%',background:C.orange,boxShadow:'0 0 70px rgba(232,97,60,.65)'}}/>
        {Array.from({length:22},(_,i)=>{const a=i/22*Math.PI*2;const r=120+(i%4)*42;return <div key={i} style={{position:'absolute',left:1006+Math.cos(a)*r,top:486+Math.sin(a)*r*.72,width:26,height:26,borderRadius:'50%',background:'#8591a4',transform:`scale(${.8+.18*wave(p+i*.05)})`}}/>})}
        <Text x={780} y={160} size={56}>濃い空気は、儀礼から生まれる。</Text>
      </Shell>;
    }
    case 10:{
      const jump=wave(p,3);
      return <Shell p={p} chapter={chapter} bg="linear-gradient(180deg,#1a0d1b,#090c12)">
        <div style={{position:'absolute',left:140,top:160,width:720,height:620,borderRadius:30,background:'#201327',overflow:'hidden'}}>
          <div style={{position:'absolute',left:260,top:80,width:200,height:100,background:C.red,boxShadow:'0 0 90px rgba(203,69,77,.5)'}}/>
          <Crowd count={28} y={500+jump*10} spread={650} baseX={30} s={.46} phase={p*3}/>
        </div>
        <div style={{position:'absolute',left:1040,top:160,width:720,height:620,borderRadius:30,background:'#111a2d',overflow:'hidden'}}>
          <div style={{position:'absolute',left:160,top:320,width:400,height:170,border:'8px solid #d9dde6',borderTop:'none'}}/>
          <div style={{position:'absolute',left:330,top:180,width:38,height:220,background:'#fff',transform:`translateY(${-ease((p-.4)/.25)*120}px)`}}/>
          <Crowd count={26} y={520} spread={650} baseX={20} s={.44} phase={p*2.4}/>
        </div>
        <Text x={610} y={850} size={50}>同じ瞬間を見ると、知らない人同士でも一体になる。</Text>
      </Shell>;
    }
    case 11:{
      const step=ease((p-.28)/.28);
      return <Shell p={p} chapter={chapter} bg="radial-gradient(circle at center,#232a34,#0b0e14 72%)">
        <div style={{position:'absolute',left:300,top:180,width:1320,height:720,borderRadius:'50%',border:'3px solid rgba(255,255,255,.18)'}}/>
        {Array.from({length:20},(_,i)=>{const a=i/20*Math.PI*2;return <Person key={i} x={900+Math.cos(a)*540} y={485+Math.sin(a)*250} s={.46} shirt={i%2?'#4b5667':'#5a3b42'} rot={-Math.cos(a)*10}/>})}
        <Person x={760} y={405} s={1.05} shirt="#59404b" rot={-2}/><Person x={1030-step*65} y={400} s={1.08} shirt="#314a62" rot={2}/>
        <div style={{position:'absolute',left:945,top:520,width:18,height:18,borderRadius:'50%',background:C.orange,boxShadow:`0 0 ${50+80*step}px rgba(232,97,60,.75)`}}/>
        <Text x={560} y={100} size={56}>全員の視線が、一点へ集まる。</Text>
      </Shell>;
    }
    case 12:{
      return <Shell p={p} chapter={chapter} bg="linear-gradient(180deg,#0b0f17,#131923)">
        <div style={{position:'absolute',left:120,top:150,width:1680,height:720,borderRadius:30,border:'1px solid rgba(255,255,255,.08)',background:'rgba(255,255,255,.02)'}}>
          <div style={{position:'absolute',left:805,top:300,width:70,height:70,borderRadius:'50%',background:C.orange,boxShadow:'0 0 85px rgba(232,97,60,.58)'}}/>
          {Array.from({length:45},(_,i)=>{const a=i/45*Math.PI*2;const r=180+(i%9)*60;const xx=840+Math.cos(a)*r;const yy=335+Math.sin(a)*r*.55;return <div key={i} style={{position:'absolute',left:xx,top:yy,width:10,height:10,borderRadius:'50%',background:C.cyan,opacity:.25+.65*ease((p-(i%7)*.025)/.3)}}/>})}
          {Array.from({length:10},(_,i)=><div key={i} style={{position:'absolute',left:180+i*145,top:610,width:70,height:120,borderRadius:'35px 35px 12px 12px',background:'#2a3340',opacity:.85}}/>) }
        </div>
        <Text x={300} y={885} size={48}>通知も別タブもない。全員が、同じ瞬間だけを見ている。</Text>
      </Shell>;
    }
    case 13:{
      return <Shell p={p} chapter={chapter} bg="linear-gradient(180deg,#edf1f5,#d2dae2)">
        <div style={{position:'absolute',left:380,top:300,width:1160,height:420,borderRadius:'48%',background:'#c6b49f'}}/>
        <Person x={550} y={315} s={1.0} shirt="#536174"/><Person x={1160} y={320} s={1.0} shirt="#46536a"/>
        <Bubble x={1080} y={180} w={470} text="この企画、どう思う？" bg="#fff" opacity={ease((p-.08)/.2)}/>
        <Bubble x={380} y={160} w={520} text="方向性としては、すごく面白いと思います" bg="#e7f0ff" opacity={ease((p-.3)/.22)}/>
        <Text x={360} y={790} size={40} color={C.red} opacity={ease((p-.55)/.25)}>本音：かなりつまらない。</Text>
      </Shell>;
    }
    case 14:{
      const masks=ease((p-.2)/.6);
      return <Shell p={p} chapter={chapter} bg="linear-gradient(135deg,#171c25,#2a313d)">
        {[0,1,2].map(i=><div key={i} style={{position:'absolute',left:300+i*510,top:300,width:300,height:370}}>
          <Person x={90} y={90} s={1.0} shirt={i===0?'#4e5b70':i===1?'#6b5149':'#475c54'}/>
          <div style={{position:'absolute',left:85,top:65,width:130,height:90,borderRadius:'50%',background:'#f7d578',opacity:masks,transform:`translateY(${(1-masks)*-90}px)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:54}}>☺</div>
          <Text x={35} y={300} size={28} color="#dfe5ed">{i===0?'接客：笑顔':'会社：平静'}</Text>
        </div>)}
        <Text x={450} y={120} size={64}>感情を隠す技術を、現代人は大量に持っている。</Text>
      </Shell>;
    }
    case 15:{
      const rise=ease((p-.18)/.35);
      return <Shell p={p} chapter={chapter} bg="linear-gradient(180deg,#342a24,#17191c)">
        <div style={{position:'absolute',left:240,top:585,width:1440,height:70,borderRadius:20,background:'#835c42'}}/>
        <Person x={650} y={420-rise*120} s={1.16} shirt="#5d2d35" rot={-3*rise}/>
        <Person x={1090} y={430} s={1.1} shirt="#344b5b"/>
        <div style={{position:'absolute',left:650,top:710,width:120,height:34,borderRadius:18,background:'#694731',transform:`rotate(${rise*18}deg) translateX(${rise*70}px)`}}/>
        <Text x={350} y={130} size={56}>「俺、お前のそういうところマジで嫌いなんだよ。」</Text>
        <Text x={540} y={840} size={42} color={C.orange} opacity={ease((p-.55)/.25)}>効率は最悪。だが、本気には見える。</Text>
      </Shell>;
    }
    case 16:{
      return <Shell p={p} chapter={chapter} bg="radial-gradient(circle at 50% 50%,#292238,#0b0d13 70%)">
        <div style={{position:'absolute',left:270,top:445,width:1380,height:12,background:'rgba(255,255,255,.15)'}}/>
        {[["時間",250],["努力",550],["感情",850],["評判",1150],["恥",1450]].map(([t,x],i)=><div key={String(t)} style={{position:'absolute',left:Number(x),top:390,width:75,height:75,borderRadius:'50%',background:i===4?C.orange:'#596479',boxShadow:i===4?'0 0 50px rgba(232,97,60,.5)':'none',transform:`scale(${.65+.35*ease((p-.1-i*.09)/.3)})`}}><Text x={-30} y={100} size={28}>{t}</Text></div>)}
        <Text x={380} y={145} size={62}>コストが高いほど、メッセージは「本気」に見えやすい。</Text>
      </Shell>;
    }
    case 17:{
      const confess=ease((p-.32)/.36);
      return <Shell p={p} chapter={chapter} bg="linear-gradient(180deg,#1b1c29,#0c0e14)">
        <Person x={840} y={430} s={1.15} shirt="#3a4c63"/>
        <Person x={1120} y={430} s={1.15} shirt="#6b3d4a"/>
        {Array.from({length:10},(_,i)=><Person key={i} x={220+i*145} y={690+(i%2)*15} s={.5} shirt="#39414f"/>) }
        <div style={{position:'absolute',left:1000,top:430,width:65,height:65,borderRadius:'50%',border:`6px solid ${C.red}`,opacity:confess,transform:`scale(${.7+.3*confess})`}}/>
        <Text x={520} y={170} size={58}>同じ「好き」でも、失敗の恥を引き受けると意味が変わる。</Text>
        <Text x={760} y={315} size={33} color={C.orange} opacity={confess}>好きです。</Text>
      </Shell>;
    }
    case 18:{
      return <Shell p={p} chapter={chapter} bg="linear-gradient(135deg,#19151c,#11161c)">
        <div style={{position:'absolute',left:200,top:250,width:620,height:500,borderRadius:30,background:'rgba(255,255,255,.04)'}}>
          <Person x={270} y={130} s={1.15} shirt="#6b3039"/><Text x={110} y={360} size={36}>感情的</Text>
        </div>
        <div style={{position:'absolute',left:1100,top:250,width:620,height:500,borderRadius:30,background:'rgba(255,255,255,.04)'}}>
          <div style={{position:'absolute',left:145,top:220,width:330,height:12,background:C.red,transform:`rotate(${wave(p,1)*5}deg)`}}/>
          <Text x={110} y={130} size={42} color={C.red}>≠</Text><Text x={210} y={130} size={42}>正直</Text>
        </div>
        <Text x={430} y={820} size={46}>「本気に見える」と「本当である」は、別の話だ。</Text>
      </Shell>;
    }
    case 19:{
      const part=ease((p-.35)/.38);
      return <Shell p={p} chapter={chapter} bg="linear-gradient(180deg,#d9d4c9,#b9b3a9)">
        <div style={{position:'absolute',left:0,right:0,top:0,bottom:0,background:'repeating-linear-gradient(90deg,transparent 0 280px,rgba(255,255,255,.13) 280px 284px)'}}/>
        {Array.from({length:12},(_,i)=><Person key={i} x={160+i*140+(i<6?-part*90:part*90)} y={510+(i%2)*20} s={.68} shirt="#59606a"/>) }
        <Person x={855} y={400} s={1.22} shirt="#402e35"/>
        <Text x={470} y={130} size={62} color={C.ink}>誰が強いか、説明されなくてもわかる世界。</Text>
      </Shell>;
    }
    case 20:{
      const prest=ease((p-.15)/.45), dom=ease((p-.45)/.4);
      return <Shell p={p} chapter={chapter} bg="linear-gradient(135deg,#11151d,#202637)">
        <div style={{position:'absolute',left:230,top:260,width:600,height:500}}>
          <Text x={120} y={0} size={54} color={C.cyan}>Prestige</Text>
          <Person x={240} y={170} s={1.2} shirt="#3d5e72"/>
          {['知識','技能','尊敬'].map((t,i)=><div key={t} style={{position:'absolute',left:70+i*160,top:390,width:110,height:42,fontFamily:'sans-serif',fontSize:26,fontWeight:800,color:'#cfd8e4',opacity:prest}}>{t}</div>)}
        </div>
        <div style={{position:'absolute',left:1090,top:260,width:600,height:500}}>
          <Text x={100} y={0} size={54} color={C.orange}>Dominance</Text>
          <Person x={240} y={170} s={1.2} shirt="#6d3037"/>
          {['力','威圧','恐怖'].map((t,i)=><div key={t} style={{position:'absolute',left:90+i*160,top:390,width:110,height:42,fontFamily:'sans-serif',fontSize:26,fontWeight:800,color:'#f1d7d4',opacity:dom}}>{t}</div>)}
        </div>
      </Shell>;
    }
    case 21:{
      const nums=['学歴','資格','会社名','年収','専門性','フォロワー','登録者','再生数'];
      return <Shell p={p} chapter={chapter} bg="radial-gradient(circle at center,#20283a,#0c1017 75%)">
        {nums.map((t,i)=>{const a=i/nums.length*Math.PI*2;const r=250+80*(i%2);return <div key={t} style={{position:'absolute',left:900+Math.cos(a)*r,top:490+Math.sin(a)*r*.65,padding:'12px 18px',borderRadius:20,border:'1px solid rgba(255,255,255,.14)',fontFamily:'sans-serif',fontSize:28,fontWeight:800,color:'#d6deea',transform:`translate(${wave(p+i*.07)*18}px,${wave(p+i*.11)*10}px)`}}>{t}</div>})}
        <Person x={905} y={390} s={1.0} shirt="#46556d"/>
        <div style={{position:'absolute',left:952,top:360,width:34,height:34,borderRadius:'50%',background:C.red,opacity:ease((p-.5)/.2)}}/>
        <Text x={470} y={120} size={60}>数字は多い。なのに、自分がどこにいるかは曖昧。</Text>
      </Shell>;
    }
    case 22:{
      return <Shell p={p} chapter={chapter} bg="linear-gradient(180deg,#17141a,#0c0e13)">
        {['強い','弱い','逃げた','立った','守った','裏切った'].map((t,i)=><Text key={t} x={190+(i%3)*580} y={200+Math.floor(i/3)*210} size={66} color={i%2?C.red:C.white} opacity={ease((p-.06-i*.07)/.28)}>{t}</Text>)}
        <div style={{position:'absolute',left:250,top:690,width:1420,height:4,background:'rgba(255,255,255,.18)'}}/>
        <Text x={500} y={770} size={48} color={C.orange}>複雑な人間関係が、単純な答えへ圧縮される。</Text>
      </Shell>;
    }
    case 23:{
      const left=ease((p-.05)/.42),right=ease((p-.5)/.38);
      return <Shell p={p} chapter={chapter} bg="radial-gradient(circle at center,#25161a,#0a0d12 72%)">
        <div style={{position:'absolute',left:410,top:210,width:1100,height:610,border:'8px solid #5a606a',borderRadius:20}}>
          <div style={{position:'absolute',left:550,top:0,bottom:0,width:4,background:'rgba(255,255,255,.12)'}}/>
          <Person x={300-left*120} y={320} s={1.4} shirt="#6b3038" rot={-5*left}/>
          <Person x={700+right*120} y={320} s={1.4} shirt="#324b61" rot={5*right}/>
          <div style={{position:'absolute',left:510,top:225,width:90,height:90,borderRadius:'50%',border:`8px solid ${C.gold}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif',fontWeight:900,fontSize:42,color:C.gold}}>60</div>
        </div>
        <Text x={610} y={110} size={58}>最後には「勝つか、負けるか」が置かれる。</Text>
      </Shell>;
    }
    case 24:{
      return <Shell p={p} chapter={chapter} bg="linear-gradient(135deg,#ece8df,#c8ced7)">
        <div style={{position:'absolute',left:200,top:220,width:650,height:560,borderRadius:36,background:'rgba(255,255,255,.45)'}}>
          <Text x={90} y={70} size={48} color={C.ink}>現実社会</Text>
          <svg width="500" height="340" style={{position:'absolute',left:70,top:150}}><path d="M30 260 C120 30 180 310 270 80 S410 290 470 40" fill="none" stroke={C.blue} strokeWidth="8"/></svg>
          <Text x={110} y={450} size={30} color={C.ink}>序列は複雑で、結論は曖昧。</Text>
        </div>
        <div style={{position:'absolute',left:1070,top:220,width:650,height:560,borderRadius:36,background:'#181d26'}}>
          <Text x={110} y={70} size={48}>画面の中</Text>
          <div style={{position:'absolute',left:100,top:240,width:440,height:14,background:C.red}}/>
          <div style={{position:'absolute',left:250,top:170,width:140,height:140,borderRadius:'50%',background:C.orange,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif',fontWeight:900,fontSize:48,color:'#fff'}}>WIN</div>
          <Text x={120} y={450} size={30}>一瞬で、答えが見える。</Text>
        </div>
      </Shell>;
    }
    case 25:{
      const cat=ease((p-.22)/.5);
      return <Shell p={p} chapter={chapter} bg="linear-gradient(180deg,#10151b,#24282c)">
        <div style={{position:'absolute',left:0,right:0,bottom:0,height:330,background:'#3b3e42'}}/>
        <div style={{position:'absolute',left:1370,top:260,width:150,height:360,background:'#ebe5d7',boxShadow:'0 0 70px rgba(255,224,170,.13)'}}/>
        <Person x={750} y={500} s={1.0} shirt="#6b3039" rot={-18*cat}/>
        <div style={{position:'absolute',left:1040-cat*100,top:700-cat*25,width:78,height:52,borderRadius:'55% 55% 45% 45%',background:'#5d5247'}}/>
        <div style={{position:'absolute',left:1084-cat*100,top:672-cat*25,width:22,height:22,background:'#5d5247',transform:'rotate(45deg)'}}/>
        <div style={{position:'absolute',left:1005,top:706,width:18,height:8,borderRadius:4,background:C.warm,opacity:cat}}/>
        <Text x={320} y={120} size={60}>怖そうな人が、少し優しいだけでなぜ泣けるのか。</Text>
      </Shell>;
    }
    case 26:{
      return <Shell p={p} chapter={chapter} bg="radial-gradient(circle at center,#2c2431,#0d1016 70%)">
        <Text x={630} y={125} size={58} color={C.gold}>Narrative Identity</Text>
        <svg width="1600" height="650" style={{position:'absolute',left:160,top:270}}>
          <path d="M80 420 C280 40 470 590 680 240 S1040 60 1420 280" fill="none" stroke={C.cyan} strokeWidth="10" strokeLinecap="round" strokeDasharray="18 12" strokeDashoffset={(1-q)*600}/>
          {[["失敗",90,405],["後悔",410,390],["決断",760,235],["やり直し",1120,115],["変化",1420,270]].map(([t,x,y],i)=><g key={String(t)} opacity={ease((p-.06-i*.1)/.26)}><circle cx={Number(x)} cy={Number(y)} r="22" fill={i<2?C.red:C.gold}/><text x={Number(x)-35} y={Number(y)-38} fill="#fff" fontSize="28" fontFamily="sans-serif">{t}</text></g>)}
        </svg>
        <Text x={530} y={850} size={44}>人は人生を、出来事ではなく「変化の物語」として読む。</Text>
      </Shell>;
    }
    case 27:{
      const light=ease((p-.42)/.45);
      return <Shell p={p} chapter={chapter} bg={`linear-gradient(90deg,#0d1016 ${45-light*25}%,#423529 65%,#e0b875 100%)`}>
        <div style={{position:'absolute',left:210,top:210,width:1490,height:6,background:'rgba(255,255,255,.18)'}}/>
        {['喧嘩','絶縁','失敗','後悔','謝罪','再出発'].map((t,i)=><div key={t} style={{position:'absolute',left:220+i*245,top:475-(i>3?(i-3)*75:0),width:115,height:115,borderRadius:'50%',background:i<4?C.red:C.gold,opacity:ease((p-.04-i*.08)/.25),boxShadow:i>=4?'0 0 50px rgba(216,169,79,.4)':'none'}}><Text x={-10} y={145} size={28}>{t}</Text></div>)}
        <svg width="1500" height="450" style={{position:'absolute',left:210,top:250}}><path d="M70 300 L310 300 L555 330 L800 310 L1040 230 L1290 100" fill="none" stroke="#f4e4bf" strokeWidth="8"/></svg>
        <Text x={420} y={110} size={62}>Redemption ― 悪い状況が、別の意味へ変わる物語。</Text>
      </Shell>;
    }
    case 28:{
      return <Shell p={p} chapter={chapter} bg="linear-gradient(180deg,#efeee8,#d3d7db)">
        <div style={{position:'absolute',left:240,top:240,width:620,height:540}}>
          <Person x={245} y={100} s={1.3} shirt="#536173"/>
          <div style={{position:'absolute',left:110,top:390,width:420,height:8,background:C.blue}}/>
          <Text x={75} y={440} size={34} color={C.ink}>真面目 → 真面目 → 真面目</Text>
        </div>
        <div style={{position:'absolute',left:1060,top:240,width:620,height:540}}>
          <Person x={245} y={100} s={1.3} shirt="#6b3038"/>
          <svg width="520" height="230" style={{position:'absolute',left:45,top:360}}><path d="M20 140 L95 40 L180 175 L265 120 L350 195 L490 30" fill="none" stroke={C.orange} strokeWidth="10"/></svg>
          <Text x={70} y={560} size={34} color={C.ink}>落差があるほど、物語になる。</Text>
        </div>
      </Shell>;
    }
    case 29:{
      const arrive=ease((p-.1)/.75);
      return <Shell p={p} chapter={chapter} bg="linear-gradient(180deg,#c8c5bc 0%,#aab0b6 46%,#474b50 46%)">
        <div style={{position:'absolute',left:0,right:0,top:0,height:500,background:'linear-gradient(180deg,#b7c1cb,#d4d0c4)'}}/>
        {Array.from({length:7},(_,i)=><div key={i} style={{position:'absolute',left:80+i*285,top:330,width:220,height:110,background:i%2?'#c6b18c':'#a69a84',opacity:.9}}/>) }
        <Car x={160} y={650} s={1.0} color="#6a7684"/><Car x={1370} y={690} s={.9} color="#71544e"/>
        {[0,1,2,3,4].map(i=><Person key={i} x={620+i*120} y={590+(i%2)*20} s={.76} shirt={i%2?'#4b5669':'#6b3038'} opacity={clamp(arrive*1.5-i*.18)}/>) }
        <Text x={370} y={110} size={60} color={C.ink}>誰も予定を合わせていない。ただ、そこに行けば誰かがいる。</Text>
      </Shell>;
    }
    case 30:{
      const draw=ease((p-.08)/.82);
      const pts=[[250,220],[520,330],[820,200],[1180,360],[1530,240],[430,680],[870,650],[1370,690]];
      return <Shell p={p} chapter={chapter} bg="linear-gradient(135deg,#1b2027,#0e1116)">
        <svg width="1920" height="1080" style={{position:'absolute',inset:0}}>
          <path d="M90 550 C300 380 430 430 560 520 S850 700 1010 560 1280 350 1540 500 1770 630 1850 510" fill="none" stroke="#4a5563" strokeWidth="16"/>
          <path d="M300 100 C360 330 510 520 700 820" fill="none" stroke="#3c4652" strokeWidth="12"/>
          {pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r={20} fill={i%3===0?C.orange:C.cyan} opacity={clamp(draw*1.6-i*.09)}/>) }
          {pts.slice(0,-1).map(([x,y],i)=>{const [x2,y2]=pts[(i+2)%pts.length];return <line key={`l${i}`} x1={x} y1={y} x2={x2} y2={y2} stroke="rgba(216,169,79,.35)" strokeWidth="3" opacity={draw}/>})}
        </svg>
        {['兄','同級生','先輩','昔の仲間','職場','親戚'].map((t,i)=><Text key={t} x={180+(i%3)*560} y={320+Math.floor(i/3)*330} size={30} color="#d6dde8" opacity={clamp(draw*1.5-i*.12)}>{t}</Text>)}
        <Text x={500} y={90} size={62}>「地元」は、住所ではなく人間関係の地図である。</Text>
      </Shell>;
    }
    case 31:{
      const flow=lerp(-120,1450,q);
      return <Shell p={p} chapter={chapter} bg="linear-gradient(180deg,#dbe2e8,#aeb9c4)">
        {Array.from({length:14},(_,i)=><div key={i} style={{position:'absolute',left:50+i*145,top:110,width:100,height:520,background:i%2?'#8794a2':'#9ba7b2'}}/>) }
        <div style={{position:'absolute',left:0,right:0,top:620,bottom:0,background:'#3c4148'}}/>
        {Array.from({length:18},(_,i)=><Person key={i} x={(i*135+flow)%(2100)-100} y={650+(i%3)*35} s={.58} shirt="#5e6875"/>) }
        <Person x={880} y={600} s={.9} shirt="#425268"/>
        <Text x={440} y={120} size={58} color={C.ink}>何百人とすれ違う。名前は、ほとんど知らない。</Text>
      </Shell>;
    }
    case 32:{
      return <Shell p={p} chapter={chapter} bg="linear-gradient(180deg,#0b0e15,#131a24)">
        {Array.from({length:9},(_,r)=>Array.from({length:16},(_,c)=>{const lit=(r*16+c)%29===7||(r*16+c)%41===13;return <div key={`${r}-${c}`} style={{position:'absolute',left:110+c*105,top:130+r*85,width:55,height:42,background:lit?'#d7a956':'#202a36',boxShadow:lit?'0 0 22px rgba(215,169,86,.3)':'none'}}/>}))}
        <div style={{position:'absolute',left:920,top:530,width:16,height:16,borderRadius:'50%',background:C.orange,boxShadow:'0 0 55px rgba(232,97,60,.7)'}}/>
        <Text x={420} y={900} size={46}>つながりは増えた。孤独・孤立は、なお社会課題であり続ける。</Text>
      </Shell>;
    }
    case 33:{
      const close=ease((p-.32)/.5);
      return <Shell p={p} chapter={chapter} bg="linear-gradient(135deg,#10131a,#1a1e25)">
        <div style={{position:'absolute',left:140,top:120,width:1640,height:760,borderRadius:35,border:'2px solid rgba(255,255,255,.1)',overflow:'hidden'}}>
          <div style={{position:'absolute',left:0,top:0,bottom:0,width:960,background:'#28313a',transform:`translateX(${-close*370}px)`}}>
            <Text x={160} y={120} size={54}>自由</Text><Text x={160} y={210} size={30} color="#c7cfda">逃げられる / 切れる / 選べる</Text>
          </div>
          <div style={{position:'absolute',right:0,top:0,bottom:0,width:960,background:'#3b2a2d',transform:`translateX(${close*370}px)`}}>
            <Text x={560} y={120} size={54}>共同体</Text><Text x={380} y={210} size={30} color="#ecd8d8">濃い / 暑苦しい / 逃げにくい</Text>
          </div>
          <Person x={770} y={370} s={1.35} shirt="#46566d"/>
        </div>
        <Text x={370} y={905} size={44}>自由になった人間が、不自由だった共同体を安全な画面から眺める。</Text>
      </Shell>;
    }
    case 34:{
      return <Shell p={p} chapter={chapter} bg="linear-gradient(180deg,#10141b,#0b0e13)">
        <div style={{position:'absolute',left:140,top:160,width:720,height:650,borderRadius:35,background:'#dde3e9',overflow:'hidden'}}>
          <OfficeGrid p={p}/>
          <div style={{position:'absolute',inset:0,background:'rgba(230,235,240,.45)'}}/>
          <Text x={120} y={80} size={50} color={C.ink}>令和</Text>
          <Text x={120} y={155} size={28} color={C.ink}>感情を抑える / 弱いつながり / 複雑な序列</Text>
        </div>
        <div style={{position:'absolute',left:1060,top:160,width:720,height:650,borderRadius:35,background:'#26191d',overflow:'hidden'}}>
          <Crowd count={18} y={500} spread={650} baseX={35} s={.48} phase={p*2}/>
          <Person x={270} y={240} s={1.0} shirt="#6b3038"/><Person x={410} y={235} s={1.0} shirt="#324b61"/>
          <Text x={120} y={80} size={50}>ヤンキー的世界</Text>
          <Text x={120} y={155} size={28}>感情を出す / 濃い仲間 / 単純な序列</Text>
        </div>
      </Shell>;
    }
    case 35:{
      return <Shell p={p} chapter={chapter} bg="radial-gradient(circle at center,#2d2224,#0b0e13 72%)">
        {['感情','仲間','序列','本気','失敗','やり直し'].map((t,i)=>{const a=i/6*Math.PI*2;const r=290;return <div key={t} style={{position:'absolute',left:900+Math.cos(a)*r,top:470+Math.sin(a)*r*.7,width:150,height:70,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:35,border:`2px solid ${i%2?C.orange:C.cyan}`,fontFamily:'sans-serif',fontSize:30,fontWeight:900,color:'#fff',transform:`scale(${.85+.15*ease((p-.05-i*.07)/.3)})`}}>{t}</div>})}
        <Text x={390} y={110} size={62}>令和がヤンキー的でなくなるほど、ヤンキーは目立つ。</Text>
        <Person x={900} y={380} s={1.2} shirt="#454f61"/>
      </Shell>;
    }
    case 36:{
      return <Shell p={p} chapter={chapter} bg="linear-gradient(180deg,#11131a,#080a0e)">
        <Text x={620} y={100} size={58}>現代社会が捨ててきたものの展示室。</Text>
        {['暴力','上下関係','地元','仲間','義理','感情','恥','意地'].map((t,i)=>{const col=i%4,row=Math.floor(i/4);const x=210+col*410,y=310+row*300;return <div key={t} style={{position:'absolute',left:x,top:y,width:290,height:190,border:'1px solid rgba(255,255,255,.2)',borderRadius:18,background:'rgba(255,255,255,.025)',boxShadow:'inset 0 0 40px rgba(255,255,255,.025)'}}>
          <div style={{position:'absolute',left:135,top:48,width:22,height:22,borderRadius:'50%',background:i%2?C.gold:C.orange,boxShadow:'0 0 38px rgba(216,169,79,.35)'}}/>
          <Text x={70} y={95} size={36} color="#e9e5dc" align="center" width={150}>{t}</Text>
        </div>})}
      </Shell>;
    }
    case 37:{
      const bow=ease((p-.28)/.26),hand=ease((p-.58)/.28);
      return <Shell p={p} chapter={chapter} bg="radial-gradient(circle at 68% 45%,#19284a,#080a0e 63%)">
        <div style={{position:'absolute',left:120,top:180,width:820,height:520,borderRadius:'55% 45% 25% 20%',background:'#171a21'}}/>
        <Person x={410} y={430} s={1.25} shirt="#242b39"/>
        <Phone x={1110} y={170} w={380} h={670} rot={-3} glow={.65}>
          <div style={{position:'absolute',left:30,top:120,right:30,bottom:80,background:'#191a1f',borderRadius:18}}>
            <Person x={55} y={180+bow*35} s={.72} shirt="#6b3038" rot={bow*17}/>
            <Person x={190} y={180} s={.72} shirt="#334b61"/>
            <div style={{position:'absolute',left:155,top:330,width:130*hand,height:18,borderRadius:9,background:C.skin,transform:`rotate(${-5+hand*5}deg)`,transformOrigin:'left'}}/>
          </div>
        </Phone>
        <Text x={180} y={90} size={60}>午前0時17分。</Text>
        <Text x={1000} y={875} size={42} opacity={hand}>頭を下げる。手を差し出す。握手する。</Text>
      </Shell>;
    }
    case 38:{
      const dawn=ease((p-.35)/.55);
      return <Shell p={p} chapter={chapter} bg={`linear-gradient(180deg,rgba(${Math.round(12+100*dawn)},${Math.round(15+105*dawn)},${Math.round(24+115*dawn)},1),#11151d)`}>
        <div style={{position:'absolute',left:250,top:230,width:1420,height:520,borderRadius:40,background:'#171b23'}}>
          <div style={{position:'absolute',left:1180,top:120,width:190,height:300,background:`rgba(255,220,150,${.08+.52*dawn})`,boxShadow:`0 0 ${80*dawn}px rgba(255,206,120,.35)`}}/>
          <Person x={650} y={320} s={1.18} shirt="#313b4b"/>
          <div style={{position:'absolute',left:860,top:455,width:200,height:95,borderRadius:24,background:'#101319',border:'5px solid #323846',transform:`rotate(${10-18*dawn}deg)`}}/>
        </div>
        <Text x={280} y={120} size={54}>明日になれば、また「承知しました」と返信する。</Text>
        <Text x={360} y={815} size={48} color="#e8dfcf" opacity={dawn}>それでも夜になると、違う世界を覗き込む。</Text>
      </Shell>;
    }
    default:{
      return <Shell p={p} chapter={chapter} bg="radial-gradient(circle at center,#271c20,#090b10 70%)">
        {['怒る','泣く','走る','守る','好きと言う'].map((t,i)=><Text key={t} x={250+i*310} y={260+(i%2)*170} size={56} color={i%2?C.orange:C.white} opacity={ease((p-.05-i*.06)/.3)}>{t}</Text>)}
        <div style={{position:'absolute',left:925,top:580,width:70,height:70,borderRadius:'50%',background:C.orange,boxShadow:'0 0 120px rgba(232,97,60,.8)'}}/>
        {Array.from({length:24},(_,i)=>{const a=i/24*Math.PI*2;const r=110+i*11;return <div key={i} style={{position:'absolute',left:960+Math.cos(a)*r,top:615+Math.sin(a)*r*.5,width:8,height:8,borderRadius:'50%',background:i%2?C.red:C.gold,opacity:.3+.7*q}}/>})}
        <Text x={370} y={805} size={54}>私たちが見ているのは、ヤンキーではないのかもしれない。</Text>
        <Text x={450} y={890} size={48} color={C.gold}>社会が手放してきた「人間関係の熱量」そのもの。</Text>
      </Shell>;
    }
  }
}

export const V14YankeeReiwa:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const seconds=frame/fps;
  const active=getActiveBeatAtSeconds(seconds);
  const beat=scriptData.beats[active.index]??scriptData.beats[scriptData.beats.length-1];
  return <AbsoluteFill style={{background:C.night}}>
    <SceneVisual index={active.index} p={active.progress} chapter={beat.chapter}/>
    <Caption text={beat.narration} p={active.progress}/>
    <div style={{position:'absolute',right:50,top:38,fontFamily:'sans-serif',fontSize:17,fontWeight:800,letterSpacing:1.8,color:'rgba(255,255,255,.55)',zIndex:90}}>YANKĪ / REIWA — PRODUCTION</div>
  </AbsoluteFill>;
};
