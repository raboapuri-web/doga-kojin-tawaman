import React from 'react';
import {Audio,Sequence,staticFile} from 'remotion';
import {syncTiming} from './timing';
const FPS=30;
const sfx=['room','swipe','sting','whoosh','bell','murmur','gong','crowd','pulse','boo','cheer','tick','cut','impact','riser'];
const vols:Record<string,number>={room:.12,swipe:.18,sting:.22,whoosh:.16,bell:.24,murmur:.14,gong:.30,crowd:.18,pulse:.16,boo:.17,cheer:.17,tick:.16,cut:.18,impact:.24,riser:.16};
export const AudioDesign:React.FC=()=> <>
  <Audio src={staticFile('audio/narration.wav')} volume={1}/>
  <Audio src={staticFile('audio/bgm.wav')} volume={.12}/>
  {syncTiming.beats.map((beat,i)=>{const name=sfx[i%sfx.length];return <Sequence key={`${beat.id}-${name}`} from={Math.round(beat.start*FPS)}><Audio src={staticFile(`audio/${name}.wav`)} volume={vols[name]??.18}/></Sequence>})}
</>;
