import React from 'react';
import {Audio,Sequence,staticFile} from 'remotion';
import {syncTiming} from './timing';
const FPS=30;
const sfx=['click','whoosh','pop','spark','thump','click','whoosh','spark'];
const vols:Record<string,number>={click:.26,whoosh:.19,pop:.24,spark:.18,thump:.23};
export const AudioDesign:React.FC=()=> <>
  <Audio src={staticFile('audio/narration.wav')} volume={1}/>
  <Audio src={staticFile('audio/bgm.wav')} volume={.14}/>
  {syncTiming.beats.map((beat,i)=>{const name=sfx[i%sfx.length];return <Sequence key={`${beat.id}-${name}`} from={Math.round(beat.start*FPS)}><Audio src={staticFile(`audio/${name}.wav`)} volume={vols[name]??.2}/></Sequence>})}
</>;
