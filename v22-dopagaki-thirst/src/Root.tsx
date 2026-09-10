import React from 'react';
import {Composition} from 'remotion';
import {V22DopagakiThirst} from './V22DopagakiThirst';
import {getRenderDurationSeconds} from './timing';

export const RemotionRoot:React.FC=()=>(
  <Composition id="V22DopagakiThirst" component={V22DopagakiThirst} durationInFrames={Math.ceil(getRenderDurationSeconds()*30)} fps={30} width={1920} height={1080}/>
);
