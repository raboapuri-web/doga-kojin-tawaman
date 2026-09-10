import React from 'react';
import {AbsoluteFill,interpolate} from 'remotion';

const h=React.createElement;
const C={bg:'#050807',green:'#173b2d',green2:'#285a42',paper:'#efe8d9',muted:'#99a39e',gold:'#d1aa61',red:'#b94842',steel:'#8f9996',ink:'#0a0f0c'};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(p:number)=>1-Math.pow(1-clamp(p),3);
const lerp=(p:number,a:number,b:number)=>interpolate(clamp(p),[0,1],[a,b],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const box=(style:React.CSSProperties,...children:React.ReactNode[])=>h('div',{style},...children);

const grain=()=>box({position:'absolute',inset:0,opacity:.045,backgroundImage:'radial-gradient(circle,rgba(255,255,255,.7) 0 1px,transparent 1.4px)',backgroundSize:'21px 21px',mixBlendMode:'soft-light',pointerEvents:'none'});
const vignette=()=>box({position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 45%,transparent 38%,rgba(0,0,0,.22) 72%,rgba(0,0,0,.72) 100%)',pointerEvents:'none'});

const citizen=(x:number,y:number,s=1,child=false)=>box({position:'absolute',left:x,top:y,transform:`scale(${s*(child ? .72 : 1)})`,transformOrigin:'50% 100%'},
  box({position:'absolute',left:-26,top:-150,width:52,height:52,borderRadius:'50%',background:'#b89379'}),
  box({position:'absolute',left:-38,top:-103,width:76,height:92,borderRadius:16,background:'#35413c'}),
  box({position:'absolute',left:-30,top:-18,width:22,height:70,borderRadius:8,background:'#1d2823'}),
  box({position:'absolute',left:8,top:-18,width:22,height:70,borderRadius:8,background:'#1d2823'})
);

const doom=(x:number,y:number,s=1,throne=false)=>box({position:'absolute',left:x,top:y,transform:`scale(${s})`,transformOrigin:'50% 100%'},
  throne?box({position:'absolute',left:-130,top:-430,width:260,height:430,background:'linear-gradient(180deg,#303735,#101512)',clipPath:'polygon(12% 0,88% 0,100% 100%,0 100%)',boxShadow:'0 0 0 5px #59625f'}):null,
  box({position:'absolute',left:-88,top:-338,width:176,height:265,borderRadius:'50% 50% 18% 18%',border:'19px solid #1e5a3e',borderBottomWidth:38,boxSizing:'border-box'}),
  box({position:'absolute',left:-55,top:-312,width:110,height:112,borderRadius:'45%',background:'linear-gradient(135deg,#bcc2bf,#626b68)',border:'6px solid #343b39'},
    box({position:'absolute',left:18,top:44,width:25,height:8,background:'#18251e',transform:'skewX(-20deg)'}),
    box({position:'absolute',right:18,top:44,width:25,height:8,background:'#18251e',transform:'skewX(20deg)'}),
    box({position:'absolute',left:40,top:72,width:30,height:10,borderBottom:'3px solid #303735'})
  ),
  box({position:'absolute',left:-74,top:-208,width:148,height:182,borderRadius:20,background:'linear-gradient(90deg,#4f5956,#8d9692,#444d4a)',border:'5px solid #303735'}),
  box({position:'absolute',left:-110,top:-180,width:46,height:158,borderRadius:18,background:'#48514f',transform:'rotate(7deg)'}),
  box({position:'absolute',right:-110,top:-180,width:46,height:158,borderRadius:18,background:'#48514f',transform:'rotate(-7deg)'}),
  box({position:'absolute',left:-64,top:-40,width:46,height:110,borderRadius:12,background:'#26302d'}),
  box({position:'absolute',right:-64,top:-40,width:46,height:110,borderRadius:12,background:'#26302d'})
);

const drone=(x:number,y:number,p:number,phase=0)=>box({position:'absolute',left:x+Math.sin(p*6.28+phase)*30,top:y+Math.cos(p*4.2+phase)*18},
  box({width:92,height:34,borderRadius:20,background:'#4d5955',border:'3px solid #78837f'}),
  box({position:'absolute',left:35,top:9,width:22,height:14,borderRadius:8,background:'#96d470',boxShadow:'0 0 18px #77c759'}),
  box({position:'absolute',left:-28,top:15,width:30,height:4,background:'#606c67'}),
  box({position:'absolute',right:-28,top:15,width:30,height:4,background:'#606c67'})
);

const city=(p:number,night=false,chaos=false)=>{
  const towers=Array.from({length:17},(_,i)=>box({position:'absolute',left:i*125-80,bottom:120,width:88+(i%3)*26,height:190+(i%5)*72,background:i%4===0?'#26332e':'#1b2723',borderTop:'4px solid #45534d',transform:`translateX(${lerp(p,0,-45)}px)`},
    ...Array.from({length:8},(_,j)=>box({position:'absolute',left:14+(j%3)*24,top:24+Math.floor(j/3)*43,width:9,height:14,background:(i+j)%4===0?(night?'#c6a75e':'#7e9b82'):'#18211e'}))
  ));
  const sparks=chaos?Array.from({length:9},(_,i)=>box({position:'absolute',left:160+i*190,top:380+(i%3)*70,width:95,height:12,background:C.red,transform:`rotate(${i%2?17:-14}deg) translateX(${Math.sin(p*9+i)*42}px)`})):[];
  return box({position:'absolute',inset:0,overflow:'hidden',background:night?'linear-gradient(180deg,#030706,#09150f 72%,#050807)':'linear-gradient(180deg,#92998f,#536159 45%,#11231b 74%,#060a08)'},...towers,...sparks,box({position:'absolute',left:0,right:0,bottom:0,height:132,background:'#0e1712'}));
};

const title=(text:string,sub?:string)=>box({position:'absolute',left:150,top:130,width:1120,zIndex:8},
  box({fontSize:70,lineHeight:1.18,fontWeight:900,color:C.paper,whiteSpace:'pre-line',textShadow:'0 8px 30px #000'},text),
  sub?box({marginTop:24,fontSize:29,fontWeight:800,letterSpacing:2,color:C.gold},sub):null
);

const room=(p:number,night=true,closing=0)=>box({position:'absolute',inset:0,background:night?'#11120f':'#24221c'},
  box({position:'absolute',left:120,top:90,width:1220,height:720,border:'14px solid #333833',overflow:'hidden'},city(p,night),drone(900,250,p),drone(1110,390,p,2),
    box({position:'absolute',left:0,top:0,bottom:0,width:`${closing*52}%`,background:'#20231f',boxShadow:'10px 0 30px #000'}),
    box({position:'absolute',right:0,top:0,bottom:0,width:`${closing*52}%`,background:'#20231f',boxShadow:'-10px 0 30px #000'})
  ),
  citizen(760,910,1.15),citizen(920,910,1.02),citizen(1080,885,.88,true),
  box({position:'absolute',left:120,bottom:0,width:1220,height:160,background:'#191711'})
);

const pathScene=(p:number,labels:string[])=>box({position:'absolute',inset:0,background:C.bg},
  citizen(960,900,1.08),
  ...labels.map((t,i)=>{const a=-150+i*(120/Math.max(1,labels.length-1));return box({position:'absolute',left:950,top:700,width:690,height:6,background:i===Math.floor(labels.length/2)?C.gold:'#35423c',transformOrigin:'0 50%',transform:`rotate(${a}deg) scaleX(${ease(p)})`},box({position:'absolute',right:0,top:-44,fontSize:28,color:C.muted,whiteSpace:'nowrap'},t));})
);

const panels=(p:number,items:string[],accent=0)=>box({position:'absolute',inset:0,background:C.bg},
  ...items.map((t,i)=>box({position:'absolute',left:180+(i%3)*540,top:160+Math.floor(i/3)*280,width:430,height:210,border:'2px solid #405047',background:i===accent?'#173426':'#0b1511',opacity:clamp(p*2-i*.12),transform:`translateY(${(1-ease(p))*35*(i+1)}px)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:38,fontWeight:900,color:i===accent?C.gold:C.paper,textAlign:'center',padding:20,boxSizing:'border-box'},t))
);

const phone=(p:number,focus=0)=>box({position:'absolute',inset:0,background:'linear-gradient(180deg,#101315,#050606)'},
  box({position:'absolute',left:660,top:75,width:600,height:870,borderRadius:55,border:'12px solid #252b2a',background:'#ece8df',overflow:'hidden'},
    box({position:'absolute',left:45,top:62,fontSize:31,fontWeight:900,color:'#202321'},'FOR YOU'),
    ...['おすすめ動画','あなた向け音楽','近くの人気店','似ている商品','続きから再生'].map((t,i)=>box({position:'absolute',left:45,top:145+i*138-lerp(p,0,90),width:510,height:112,borderRadius:18,background:i===focus?'#d8d1c3':'#c4beb2',padding:'30px',boxSizing:'border-box',fontSize:27,fontWeight:800,color:'#252824'},t,box({float:'right',color:'#9b7b42'},i===2?'★4.8':'›')))
  )
);

const scenes:string[]=['latveria-dawn','quiet-city','family-security','doom-statue','no-choice-state','review-paradox','choice-fatigue-breakfast','question-throne','freedom-bill','blame-mirror','choice-responsibility','free-society-whisper','roads-not-taken','doom-takes-blame','fromm-book','chains-fall','identity-void','life-crossroads','doom-decision','escape-to-authority','product-no-choice','crisis-console','doom-command','meeting-joke','responsibility-transfer','right-to-error','doom-never-wrong','family-evening','surveillance-safety','hobbes-chaos','leviathan-bargain','protection-turns','sleep-over-liberty','perfect-dictator-lab','ballot-or-genius','freedom-price','doom-governs-well','uncomfortable-question','freedom-why','berlin-two-liberties','true-interest','for-your-own-good','eternal-child','nursery-state','streaming-scroll','algorithm-choice','choice-paralysis','mocking-free-man','outsourced-decisions','state-recommendation','daughter-bedtime','predictable-tomorrow','predictability-core','future-door','door-closes-warm','invoice-arrives','perfect-rule-condition','democracy-friction','replaceable-power','friction-protects','miracle-dependence','god-on-throne','morning-again','self-responsibility-manual','wrong-life-right','inefficient-freedom','latveria-night','answer-freedom','happiness-without-consent','small-dooms','recommendation-machine','star-rating','doom-desire','final-bargain','freedom-after-loss'];

const art=(visual:string,p:number):React.ReactNode=>{
  if(visual==='latveria-dawn'||visual==='quiet-city') return box({position:'absolute',inset:0},city(p),citizen(710,900,1.1),title(visual==='quiet-city'?'静かすぎる街':'ラトヴェリア、朝6時40分'));
  if(visual==='family-security'||visual==='family-evening'||visual==='daughter-bedtime'||visual==='latveria-night') return room(p,true);
  if(visual==='doom-statue') return box({position:'absolute',inset:0},city(p),doom(1180,790,2.0),citizen(470,900,1.05),title('この国には、\n自由がない。'));
  if(visual==='no-choice-state') return box({position:'absolute',inset:0,background:C.bg},doom(960,930,1.85,true),panels(p,['選挙 ×','反対派 ×','討論 ×'],1));
  if(visual==='review-paradox') return box({position:'absolute',inset:0,background:C.bg},title('「自由を愛している」','少なくともアンケートでは'),box({position:'absolute',left:260,top:500,width:1400,height:16,background:'#303834'},box({height:'100%',width:`${lerp(p,0,84)}%`,background:C.green2})));
  if(visual==='choice-fatigue-breakfast') return panels(p,['服A','服B','店 ★4.3','店 ★4.4','まだ迷う'],3);
  if(visual==='question-throne') return box({position:'absolute',inset:0,background:'radial-gradient(circle at 68% 45%,#19382a,#050807 60%)'},doom(1410,930,2,true),title('自由より、\n幸福なのか。','DOCTOR DOOM / FREEDOM'));

  if(visual==='freedom-bill'||visual==='invoice-arrives'||visual==='freedom-price') return box({position:'absolute',inset:0,background:'#15120e'},box({position:'absolute',left:430,top:95,width:1060,height:860,background:'#e1dacd',transform:`rotate(${lerp(p,-4,-1)}deg)`,padding:'78px',boxSizing:'border-box',color:'#20231f'},box({fontSize:56,fontWeight:900},visual==='invoice-arrives'?'独裁　ご利用明細':visual==='freedom-price'?'自由　価格表':'自由　ご利用明細'),box({marginTop:110,fontSize:38,lineHeight:2,whiteSpace:'pre-line'},visual==='invoice-arrives'?'快適さ　込み\n迅速な意思決定　込み\n独裁者の誤り　無制限':visual==='freedom-price'?'投票する権利　無料\n無能な代表の可能性　付属\n結果に耐える責任　別料金':'選択肢　無料\n自己決定　無料\n後悔　後日請求')));
  if(visual==='blame-mirror') return panels(p,['会社','親','政治','景気','そして自分'],4);
  if(visual==='choice-responsibility') return panels(p,['選べる','→','責任','→','自分'],2);
  if(visual==='free-society-whisper') return box({position:'absolute',inset:0,background:C.bg},citizen(960,900,1.2),title('「選択肢、ありましたよね？」'));
  if(visual==='roads-not-taken'||visual==='life-crossroads'||visual==='wrong-life-right') return pathScene(p,visual==='roads-not-taken'?['選んだ人生','選ばなかった人生','別の人生']:visual==='life-crossroads'?['進学','仕事','結婚','住む場所','生き方']:['正解','失敗','遠回り','自分で選ぶ']);
  if(visual==='doom-takes-blame'||visual==='responsibility-transfer') return box({position:'absolute',inset:0},city(p),citizen(500,900,1.12),doom(1430,920,1.55),title(visual==='doom-takes-blame'?'失敗したら？\nドゥームのせい。':'責任まで、引き受けます。'));

  if(visual==='fromm-book') return box({position:'absolute',inset:0,background:'#17140f'},box({position:'absolute',left:560,top:120,width:800,height:780,background:'#d8d0bf',transform:`rotate(${lerp(p,-7,-2)}deg)`,boxShadow:'0 40px 90px #000',padding:80,boxSizing:'border-box',color:'#20231f'},box({fontSize:40},'1941'),box({marginTop:80,fontSize:80,fontWeight:1000},'自由からの逃走'),box({position:'absolute',left:80,bottom:100,fontSize:36},'ERICH FROMM')));
  if(visual==='chains-fall') return box({position:'absolute',inset:0,background:C.bg},...Array.from({length:8},(_,i)=>box({position:'absolute',left:200+i*210,top:lerp(p,-180,930)+(i%2)*65,width:86,height:42,border:'12px solid #59615e',borderRadius:'50%',transform:`rotate(${i%2?40:-40}deg)`})),citizen(960,880,1.3),title('束縛は、外れた。'));
  if(visual==='identity-void') return box({position:'absolute',inset:0,background:'radial-gradient(circle,#0d1612,#020303 70%)'},citizen(960,900,1.2),title('お前は何者になる？'));
  if(visual==='doom-decision'||visual==='doom-command'||visual==='doom-never-wrong'||visual==='god-on-throne'||visual==='perfect-rule-condition') return box({position:'absolute',inset:0,background:'radial-gradient(circle,#173426,#030504 70%)'},doom(960,940,2.05,true),title(visual==='doom-decision'?'優柔不断から最も遠い男':visual==='doom-command'?'決定。':visual==='doom-never-wrong'?'「私が間違える？」':visual==='god-on-throne'?'王座にいるのは、\n神ではない。':'条件は一つ。\n永遠に正しいこと。'));
  if(visual==='escape-to-authority') return panels(p,['自由','不安','→','権威','「任せろ」'],3);
  if(visual==='product-no-choice') return panels(p,['PREMIUM SERVICE','もう自分で決めなくていい','需要：非常に高い'],1);

  if(visual==='crisis-console') return box({position:'absolute',inset:0,background:'#06100c'},panels(p,['感染症','エネルギー','外交','経済','治安','災害'],0),doom(1550,930,1.45));
  if(visual==='meeting-joke') return box({position:'absolute',inset:0,background:'#171713'},box({position:'absolute',left:170,top:630,width:1580,height:50,background:'#514634'}),...Array.from({length:8},(_,i)=>citizen(290+i*195,630,.88)),title('「もう誰か決めてくれ」','会議嫌いの自由人'));
  if(visual==='right-to-error') return panels(p,['自由社会','間違える権利','ドゥーム','権利を回収'],1);

  if(visual==='surveillance-safety') return box({position:'absolute',inset:0},room(p,true),title('監視されている。\nそして、安心している。'));
  if(visual==='hobbes-chaos') return box({position:'absolute',inset:0},city(p,true,true),title('秩序のない自由','誰もあなたを守らない'));
  if(visual==='leviathan-bargain') return panels(p,['権限','⇄','安全'],1);
  if(visual==='protection-turns') return box({position:'absolute',inset:0,background:C.bg},title('あなたを守ります。'),box({position:'absolute',left:250,top:390,fontSize:66,color:C.red,fontWeight:900,opacity:ease(p)},'あなたから、あなたを。'),doom(1480,930,1.5));
  if(visual==='sleep-over-liberty') return panels(p,['自由','未来の可能性','安全','今夜眠れる'],2);

  if(visual==='perfect-dictator-lab') return box({position:'absolute',inset:0,background:C.bg},doom(960,930,1.65),panels(p,['賄賂 0','知性 MAX','善意 100','判断精度 99.9'],3));
  if(visual==='ballot-or-genius') return panels(p,['投票箱','VS','完璧な統治者'],2);
  if(visual==='doom-governs-well') return box({position:'absolute',inset:0},city(p),doom(1480,930,1.6),title('最大の問題：\nかなり上手く統治する。'));
  if(visual==='uncomfortable-question') return box({position:'absolute',inset:0,background:C.bg},title('独裁者には、\n無能でいてほしい。'),box({position:'absolute',left:700,top:530,fontSize:120,fontWeight:1000,color:C.red},'迷惑'));
  if(visual==='freedom-why') return box({position:'absolute',inset:0,background:C.bg},title('幸福なら、\n自由は必要か。'));

  if(visual==='berlin-two-liberties') return panels(p,['邪魔されない自由','自分で生きる自由'],0);
  if(visual==='true-interest') return box({position:'absolute',inset:0,background:C.bg},citizen(600,880,1.15),doom(1380,920,1.5),title('「あなたの本当の幸福は、\n私の方が知っている」'));
  if(visual==='for-your-own-good') return box({position:'absolute',inset:0,background:'repeating-linear-gradient(90deg,#090d0b 0 72px,#172019 72px 88px)'},title('全部、あなたのため。','親切な刑務所'));
  if(visual==='eternal-child') return box({position:'absolute',inset:0,background:C.bg},doom(960,930,1.45),...Array.from({length:10},(_,i)=>citizen(250+(i%5)*350,580+Math.floor(i/5)*290,.78,true)),title('国民全員、永遠に子ども。'));
  if(visual==='nursery-state') return box({position:'absolute',inset:0,background:C.bg},doom(1490,930,1.5),title('選ばなくていい。\n反対しなくていい。','巨大な保育園'));

  if(visual==='streaming-scroll'||visual==='algorithm-choice'||visual==='choice-paralysis'||visual==='recommendation-machine'||visual==='star-rating') return box({position:'absolute',inset:0},phone(p,visual==='star-rating'?2:Math.floor(ease(p)*5)%5),visual==='algorithm-choice'?title('何でも選べる。\n候補は選んでもらう。'):visual==='choice-paralysis'?title('30分迷って、\n昨日の続きを見る。'):visual==='star-rating'?title('今日も ★4.8 を選ぶ。'):null);
  if(visual==='mocking-free-man') return box({position:'absolute',inset:0,background:C.bg},citizen(560,880,1.2),title('「自分で決められないなんて可哀想」','かなり勇気のある発言'));
  if(visual==='outsourced-decisions') return panels(p,['動画','店','旅行','恋愛','ニュース','意思決定 → 外部'],5);
  if(visual==='state-recommendation') return box({position:'absolute',inset:0,background:C.bg},doom(1380,920,1.5),title('国家ごと、\nおすすめ設定。'));
  if(visual==='small-dooms') return box({position:'absolute',inset:0,background:C.bg},...Array.from({length:9},(_,i)=>box({position:'absolute',left:200+(i%3)*540,top:100+Math.floor(i/3)*300,width:430,height:230,border:'2px solid #36463e',background:'#0c1511'},doom(215,225,.56))),title('小さなドゥームは、もういる。'));

  if(visual==='predictable-tomorrow'||visual==='predictability-core') return box({position:'absolute',inset:0},panels(p,['今日','明日','明後日','その次'],0),visual==='predictability-core'?title('最大の贈り物は、\n予測可能性。'):null);
  if(visual==='future-door'||visual==='door-closes-warm') return box({position:'absolute',inset:0,background:'#060908'},box({position:'absolute',left:710,top:90,width:500,height:850,border:'14px solid #3e4944',background:'#111b16',transform:`perspective(1200px) rotateY(${visual==='future-door'?lerp(p,0,-62):lerp(p,-62,-10)}deg)`,transformOrigin:'0 50%'}),title(visual==='future-door'?'可能性 ＝ リスク':'扉を閉める。\n風が止まる。'));

  if(visual==='democracy-friction') return box({position:'absolute',inset:0,background:C.bg},...Array.from({length:12},(_,i)=>box({position:'absolute',left:190+(i%6)*270,top:180+Math.floor(i/6)*420,width:180,height:180,borderRadius:'50%',background:'#28332e',border:'3px solid #4b5852'},citizen(90,170,.6))),title('人類が賢いなら、\nコメント欄はもう少し平和。'));
  if(visual==='replaceable-power') return panels(p,['替えられる','批判できる','権力を分けられる'],0);
  if(visual==='friction-protects') return box({position:'absolute',inset:0,background:C.bg},box({position:'absolute',left:180,top:520,width:1560,height:80,background:'repeating-linear-gradient(90deg,#35423b 0 90px,#18211d 90px 130px)'}),box({position:'absolute',left:180+lerp(p,0,1250),top:445,width:150,height:150,borderRadius:'50%',background:C.gold}),title('面倒くささは、\n壊れないための摩擦。'));
  if(visual==='miracle-dependence') return box({position:'absolute',inset:0,background:C.bg},doom(960,930,1.8),title('正しい限り。\n善良である限り。','制度ではなく、奇跡。'));

  if(visual==='morning-again') return box({position:'absolute',inset:0},city(p),citizen(600,900,1.08),doom(1460,920,1.35),title('翌朝。\n昨日と同じ街。'));
  if(visual==='self-responsibility-manual') return box({position:'absolute',inset:0,background:'#15130e'},box({position:'absolute',left:490,top:90,width:940,height:860,background:'#dad4c6',padding:80,boxSizing:'border-box',color:'#22251f',transform:`rotate(${lerp(p,-3,0)}deg)`},box({fontSize:58,fontWeight:1000,whiteSpace:'pre-line'},'自由社会\n自己責任マニュアル'),box({marginTop:90,fontSize:31,lineHeight:2,whiteSpace:'pre-line'},'正しい仕事を選ぶ。\n正しい相手を選ぶ。\n正しく幸福になる。')));
  if(visual==='inefficient-freedom') return box({position:'absolute',inset:0,background:C.bg},title('非常に効率が悪い。\nだから価値がある。'));

  if(visual==='answer-freedom') return panels(p,['自由','責任','迷い','失敗','→','快適さ'],5);
  if(visual==='happiness-without-consent') return box({position:'absolute',inset:0,background:C.bg},title('幸福。\nただし、選んだ覚えはない。'));
  if(visual==='doom-desire') return box({position:'absolute',inset:0,background:'radial-gradient(circle at 72% 48%,#173626,#030504 62%)'},doom(1410,930,1.85),title('恐ろしいのは、\n我々と違うからではない。','似すぎているからだ。'));
  if(visual==='final-bargain') return box({position:'absolute',inset:0,background:C.bg},citizen(470,870,1.15),doom(1450,920,1.55),title('「もう誰か、正解を決めてくれ」'),box({position:'absolute',right:300,top:470,fontSize:74,fontWeight:1000,color:C.gold},'いいだろう。'));
  if(visual==='freedom-after-loss') return box({position:'absolute',inset:0,background:C.bg},doom(1540,930,1.3),title('自由とは、\n持っていると面倒なのに、\n失ってから欲しくなる。','非常に性格の悪い権利である。'));

  return box({position:'absolute',inset:0,background:C.bg},title(visual));
};

export const SceneArt=({visual,p}:{visual:string;p:number})=>{
  const known=scenes.includes(visual);
  return h(AbsoluteFill,{style:{fontFamily:'Noto Sans CJK JP, sans-serif',overflow:'hidden',background:C.bg}},known?art(visual,p):title(visual),vignette(),grain());
};
