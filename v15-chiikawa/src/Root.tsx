import React from 'react';
import {Composition} from 'remotion';
import {V15Chiikawa} from './V15Chiikawa';
import {getRenderDurationSeconds} from './timing';

export const RemotionRoot:React.FC=()=>(
  <Composition
    id="V15Chiikawa"
    component={V15Chiikawa}
    durationInFrames={Math.ceil(getRenderDurationSeconds()*30)}
    fps={30}
    width={1920}
    height={1080}
  />
);
