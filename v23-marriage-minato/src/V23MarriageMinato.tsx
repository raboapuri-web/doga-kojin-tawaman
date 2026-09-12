import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import beatsData from './beats.json';
import {getActiveBeat} from './timing';
import {Caption,Visual,type Beat} from './ordinary-scenes';

const beats=beatsData as Beat[];
export const V23MarriageMinato:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const active=getActiveBeat(frame/fps);
  const beat=beats[active.index]??beats[0];
  return <><Visual beat={beat} p={active.progress}/><Caption beat={beat} p={active.progress}/></>;
};
