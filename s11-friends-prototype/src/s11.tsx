import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

const W = 1672;
const H = 941;
const room = staticFile('assets/room-clean.png');
const character = staticFile('assets/character.png');
const plant = staticFile('assets/plant-fg.png');
const master = staticFile('assets/master-keyframe.png');

const image = (href: string) => <image href={href} x={0} y={0} width={W} height={H} preserveAspectRatio="none" />;
const smooth = (v: number) => Easing.inOut(Easing.cubic)(v);
const progress = (frame: number) => smooth(Math.min(1, Math.max(0, frame / 119)));

// The room, outside view, furnishings, and performer share registered scene coordinates.
// Parts that do not move still have their own layer so this shot can be reused as a rig.
const SceneArt: React.FC<{frame: number; isolate?: string}> = ({frame, isolate}) => {
  const t = progress(frame);
  const breathing = Math.sin((frame / 30) * Math.PI * 1.15) * 1.5;
  const headTilt = Math.sin((frame / 30) * Math.PI * 0.55) * 0.25 + interpolate(frame, [32, 66, 119], [0, 0.25, 0.1]);
  const armMove = interpolate(frame, [0, 56, 84, 119], [0, 0.5, -1.5, -1]);
  const thumbMove = interpolate(frame, [0, 65, 75, 90, 119], [0, 0, 2.0, 0.6, 0.8]);
  const tvPulse = 0.34 + Math.sin(frame * 0.19) * 0.035 + Math.sin(frame * 0.061) * 0.025;
  const phonePulse = interpolate(frame, [0, 64, 80, 119], [0.4, 0.4, 0.55, 0.44]);
  const show = (id: string) => !isolate || isolate === id;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{display: 'block'}}>
      <defs>
        <clipPath id="cityGlass"><path d="M261 50H489V310H261Z M501 51H706V310H501Z M261 324H489V538H261Z M501 324H706V538H501Z" /></clipPath>
        <clipPath id="tvClip"><path d="M0 220 L123 253 L123 509 L0 535Z" /></clipPath>
        <clipPath id="sofaClip"><path d="M829 360 L1672 367 L1672 941 L1087 941 L1087 765 L878 573 L829 556Z" /></clipPath>
        <clipPath id="tableClip"><path d="M472 536 L1107 536 L1113 941 L479 941Z" /></clipPath>
        <clipPath id="headClip"><path d="M1275 105 L1585 105 L1600 353 L1505 422 L1388 402 L1305 352Z" /></clipPath>
        <clipPath id="armClip"><path d="M1185 392 L1357 356 L1392 552 L1232 554 L1188 467Z" /></clipPath>
        <clipPath id="phoneClip"><path d="M1162 284 L1296 278 L1310 451 L1170 455Z" /></clipPath>
        <mask id="roomMask" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <rect width={W} height={H} fill="white" />
          <path d="M261 50H489V310H261Z M501 51H706V310H501Z M261 324H489V538H261Z M501 324H706V538H501Z" fill="black" />
        </mask>
        <mask id="bodyMask" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <rect width={W} height={H} fill="white" />
          <path d="M1275 105 L1585 105 L1600 353 L1505 422 L1388 402 L1305 352Z" fill="black" />
          <path d="M1185 392 L1357 356 L1392 552 L1232 554 L1188 467Z" fill="black" />
          <path d="M1162 284 L1296 278 L1310 451 L1170 455Z" fill="black" />
        </mask>
        <radialGradient id="tvLight"><stop stopColor="#91bcff" stopOpacity="0.75" /><stop offset="1" stopColor="#5a96ff" stopOpacity="0" /></radialGradient>
        <radialGradient id="phoneLight"><stop stopColor="#d9eaff" stopOpacity="0.58" /><stop offset="1" stopColor="#9ac2ff" stopOpacity="0" /></radialGradient>
        <radialGradient id="vignette"><stop offset="0.52" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.3" /></radialGradient>
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves={1} seed={Math.floor(frame / 4) % 7} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
      </defs>

      {show('room_base') && <g mask="url(#roomMask)">{image(room)}</g>}
      {show('city_night') && <g clipPath="url(#cityGlass)" transform={`translate(${(7 * t).toFixed(2)} 0)`}>{image(room)}</g>}
      {show('window_frame') && <g fill="none" stroke="#171f29" strokeWidth="8" opacity="0.72"><path d="M253 37V548 M494 37V548 M713 37V548 M253 315H713 M253 547H713" /></g>}
      {show('tv') && <g clipPath="url(#tvClip)">{image(room)}</g>}
      {show('tv_glow') && <ellipse cx="55" cy="375" rx="262" ry="335" fill="url(#tvLight)" opacity={tvPulse} style={{mixBlendMode: 'screen'}} />}
      {show('sofa') && <g clipPath="url(#sofaClip)">{image(room)}</g>}
      {show('table') && <g clipPath="url(#tableClip)">{image(room)}</g>}

      <g transform="translate(240 104) scale(0.8)">
        {show('character_body') && <g transform={`translate(0 ${breathing.toFixed(2)})`} mask="url(#bodyMask)">{image(character)}</g>}
        {show('character_head') && <g clipPath="url(#headClip)" transform={`rotate(${headTilt.toFixed(3)} 1430 396)`}>{image(character)}</g>}
        {show('character_arm') && <g clipPath="url(#armClip)" transform={`translate(0 ${armMove.toFixed(2)})`}>{image(character)}</g>}
        {show('hand_phone') && <g clipPath="url(#phoneClip)" transform={`translate(${thumbMove.toFixed(2)} ${armMove.toFixed(2)})`}>{image(character)}</g>}
      </g>
      {show('phone_light') && <ellipse cx="1385" cy="302" rx="101" ry="136" fill="url(#phoneLight)" opacity={phonePulse} style={{mixBlendMode: 'screen'}} />}
      {show('plant_fg') && <g transform={`translate(${(-31 * t).toFixed(2)} 0) scale(1.018)`}>{image(plant)}</g>}
      {(!isolate || isolate === 'fx') && <>
        {Array.from({length: 22}, (_, i) => {
          const x = (i * 223 + 73) % W;
          const y = (i * 177 + 91 + frame * (0.12 + (i % 3) * 0.045)) % H;
          return <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 1.25 : 0.7} fill="#d7e2ee" opacity={0.06 + (i % 4) * 0.015} />;
        })}
        <rect width={W} height={H} filter="url(#grain)" opacity="0.025" style={{mixBlendMode: 'soft-light'}} />
        <rect width={W} height={H} fill="url(#vignette)" />
      </>}
    </svg>
  );
};

export const S11Frame: React.FC<{frame: number; isolate?: string}> = ({frame, isolate}) => {
  const t = progress(frame);
  return <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#111821'}}>
    <div style={{position: 'absolute', width: 1920, height: 1080, left: 0, top: 0,
      transform: `translate(${-28 * t}px, ${6 * t}px) scale(${1 + 0.055 * t})`, transformOrigin: 'center center'}}>
      <SceneArt frame={frame} isolate={isolate} />
    </div>
  </AbsoluteFill>;
};

export const S11FourSeconds: React.FC = () => <S11Frame frame={useCurrentFrame()} />;

const panelText: React.CSSProperties = {fontFamily: 'Arial, sans-serif', color: '#e7ebf0', fontSize: 27, fontWeight: 700, letterSpacing: 0.4};
const panel: React.CSSProperties = {width: 600, height: 338, position: 'relative', overflow: 'hidden', borderRadius: 8, backgroundColor: '#111821'};
const thumbnail = (frame: number, isolate?: string) => <div style={{width: 1920, height: 1080, transform: 'scale(0.3125)', transformOrigin: 'top left'}}><S11Frame frame={frame} isolate={isolate} /></div>;

export const S11QaSheet: React.FC = () => {
  const items = [
    {label: 'MASTER KEYFRAME', image: true, note: '静止画の基準'},
    {label: 'START  ·  00:00', frame: 0, note: '人物と部屋の合成'},
    {label: 'MIDDLE  ·  00:02', frame: 60, note: '呼吸 / 光 / 視差'},
    {label: 'END  ·  00:04', frame: 119, note: '横ドリー / 5.5%寄り'},
  ];
  return <AbsoluteFill style={{background: '#0d131b', padding: '50px 44px', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif'}}>
    <div style={{color: '#f5f6f7', fontSize: 42, fontWeight: 700}}>S11  ·  4 SECOND MOTION QA</div>
    <div style={{color: '#9baabd', fontSize: 22, marginTop: 8}}>僕はその通知を、目黒の自宅のソファで見た。　|　30 fps / 1920 × 1080</div>
    <div style={{display: 'flex', gap: 24, marginTop: 55}}>{items.map((it) => <div key={it.label}>
      <div style={panel}>{it.image ? <Img src={master} style={{width: '100%', height: '100%'}} /> : thumbnail(it.frame ?? 0)}</div>
      <div style={{...panelText, marginTop: 22}}>{it.label}</div>
      <div style={{color: '#aab6c6', fontSize: 21, marginTop: 10}}>{it.note}</div>
    </div>)}</div>
    <div style={{color: '#8d9db0', fontSize: 20, marginTop: 55}}>確認点：前景植物と夜景の視差 / 人物の微動 / スマホ光とTV光 / 合成の継ぎ目</div>
  </AbsoluteFill>;
};

export const S11LayerSheet: React.FC = () => {
  const items = [
    ['room_base', '部屋の固定面'], ['city_night', '窓外の夜景'], ['window_frame', '窓枠'], ['tv', 'TV'],
    ['tv_glow', 'TV光'], ['sofa', 'ソファ'], ['table', 'ローテーブル'], ['character_body', '人物の体幹'],
    ['character_head', '人物の頭'], ['character_arm', '右腕'], ['hand_phone', '右手＋スマホ'], ['phone_light', 'スマホ光'],
    ['plant_fg', '前景植物'], ['fx', '粒子 / グレイン'],
  ];
  return <AbsoluteFill style={{background: '#0d131b', padding: 42, boxSizing: 'border-box', fontFamily: 'Arial, sans-serif'}}>
    <div style={{color: '#f5f6f7', fontSize: 38, fontWeight: 700}}>S11  ·  LAYER QA</div>
    <div style={{color: '#9baabd', fontSize: 20, marginTop: 7}}>可動要素の分離と前後関係</div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 600px)', gap: '20px 22px', marginTop: 28}}>
      {items.map(([id, label]) => <div key={id}>
        <div style={{...panel, height: 210, background: '#202935'}}>
          <div style={{width: 1920, height: 1080, transform: 'scale(0.3125)', transformOrigin: 'top left'}}><S11Frame frame={60} isolate={id} /></div>
        </div>
        <div style={{color: '#e6eaf0', fontSize: 20, fontWeight: 700, marginTop: 7}}>{id} <span style={{color: '#9baabd', fontWeight: 400}}>· {label}</span></div>
      </div>)}
    </div>
  </AbsoluteFill>;
};
