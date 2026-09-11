import React from 'react';
import {Composition} from 'remotion';
import {V23RiceOverflow} from './V23RiceOverflow';
import {getRenderDurationSeconds} from './timing';

export const RemotionRoot:React.FC=()=>(
  <Composition
    id="V23RiceOverflow"
    component={V23RiceOverflow}
    durationInFrames={Math.ceil(getRenderDurationSeconds()*30)}
    fps={30}
    width={1920}
    height={1080}
  />
);
