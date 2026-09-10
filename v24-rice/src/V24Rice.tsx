import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {shots} from './story';
import {getActiveShotAtSeconds} from './timing';
import {MultiShotScene,NarrationCaption} from './RichScene';

export const V24Rice:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const active=getActiveShotAtSeconds(frame/fps);
  const beat=shots[active.index]??shots[shots.length-1];
  return <AbsoluteFill style={{background:'#05080b'}}>
    <MultiShotScene beat={beat} p={active.progress} index={active.index}/>
    <NarrationCaption text={beat.narration} p={active.progress}/>
  </AbsoluteFill>;
};
