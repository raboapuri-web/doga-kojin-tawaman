import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import {getActiveBeatAtSeconds} from './timing';
import {CaptionLayer,Visual,type Beat} from './scenes';
import {TowerStorageScene} from './tower-storage-scene';

const beats=(scriptData.beats as Beat[]).map((beat)=>({
  ...beat,
  narration:beat.narration.replace('二袋目は納戸に押し込んだ。','二袋目は廊下の収納に押し込んだ。'),
}));

export const V23RiceOverflow:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const active=getActiveBeatAtSeconds(frame/fps);
  const beat=beats[active.index]??beats[0];
  return <>
    {beat.scene==='storage'?<TowerStorageScene p={active.progress}/>:<Visual beat={beat} p={active.progress}/>} 
    <CaptionLayer beat={beat} p={active.progress}/>
  </>;
};
