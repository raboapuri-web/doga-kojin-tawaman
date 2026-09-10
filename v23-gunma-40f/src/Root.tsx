import React from 'react';
import {Composition} from 'remotion';
import {V23Gunma40F} from './V23Gunma40F';
import {getRenderDurationSeconds} from './timing';

export const RemotionRoot:React.FC=()=>(
  <Composition id="V23Gunma40F" component={V23Gunma40F} durationInFrames={Math.max(1,Math.ceil(getRenderDurationSeconds()*30))} fps={30} width={1920} height={1080}/>
);
