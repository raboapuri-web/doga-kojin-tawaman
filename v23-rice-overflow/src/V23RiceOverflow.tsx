import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import {getActiveBeatAtSeconds} from './timing';
import {CaptionLayer,Visual,type Beat} from './scenes';

const beats=scriptData.beats as Beat[];

export const V23RiceOverflow:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const active=getActiveBeatAtSeconds(frame/fps);
  const beat=beats[active.index]??beats[0];
  return <>
    <Visual beat={beat} p={active.progress}/>
    <CaptionLayer beat={beat} p={active.progress}/>
  </>;
};
