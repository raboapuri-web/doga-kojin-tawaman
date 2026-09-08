import React from 'react';
import {Composition} from 'remotion';
import {V14YankeeReiwa} from './V14YankeeReiwa';
import {getRenderDurationSeconds} from './timing';

export const RemotionRoot:React.FC=()=>(
  <Composition
    id="V14YankeeReiwa"
    component={V14YankeeReiwa}
    durationInFrames={Math.ceil(getRenderDurationSeconds()*30)}
    fps={30}
    width={1920}
    height={1080}
  />
);
