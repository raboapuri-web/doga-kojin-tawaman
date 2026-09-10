import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {shots} from './story';
import {getActiveShotAtSeconds} from './timing';
import {CinematicScene,NarrationCaption} from './CinematicScene';

export const V23Gunma40F:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const active=getActiveShotAtSeconds(frame/fps);
  const shot=shots[active.index]??shots[shots.length-1];
  return <AbsoluteFill style={{background:'#05080c'}}>
    <CinematicScene shot={shot} p={active.progress} index={active.index}/>
    <NarrationCaption text={shot.narration} p={active.progress}/>
  </AbsoluteFill>;
};
