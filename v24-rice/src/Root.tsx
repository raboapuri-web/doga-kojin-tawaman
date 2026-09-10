import React from 'react';
import {Composition} from 'remotion';
import {V24Rice} from './V24Rice';
import {getRenderDurationSeconds} from './timing';

export const RemotionRoot:React.FC=()=>(
  <Composition id="V24Rice" component={V24Rice} durationInFrames={Math.max(1,Math.ceil(getRenderDurationSeconds()*30))} fps={30} width={1920} height={1080}/>
);
