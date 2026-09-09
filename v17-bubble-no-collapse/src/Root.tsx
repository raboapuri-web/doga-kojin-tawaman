import React from 'react';
import {Composition} from 'remotion';
import {V17BubbleNoCollapse} from './V17BubbleNoCollapse';
import {getRenderDurationSeconds} from './timing';

export const RemotionRoot:React.FC=()=>(
  <Composition
    id="V17BubbleNoCollapse"
    component={V17BubbleNoCollapse}
    durationInFrames={Math.ceil(getRenderDurationSeconds()*30)}
    fps={30}
    width={1920}
    height={1080}
  />
);
