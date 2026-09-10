import React from 'react';
import {Composition} from 'remotion';
import {V19LaborShortage} from './V19LaborShortage';
import {getRenderDurationSeconds} from './timing';

export const RemotionRoot:React.FC=()=>(
  <Composition id="V19LaborShortage" component={V19LaborShortage} durationInFrames={Math.ceil(getRenderDurationSeconds()*30)} fps={30} width={1920} height={1080}/>
);
