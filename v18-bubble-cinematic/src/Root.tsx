import React from 'react';
import {Composition} from 'remotion';
import {V18BubbleCinematic} from './V18BubbleCinematic';
import {getRenderDurationSeconds} from './timing';

export const RemotionRoot:React.FC=()=>(
  <Composition
    id="V18BubbleCinematic"
    component={V18BubbleCinematic}
    durationInFrames={Math.ceil(getRenderDurationSeconds()*30)}
    fps={30}
    width={1920}
    height={1080}
  />
);
