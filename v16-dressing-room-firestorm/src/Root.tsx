import React from 'react';
import {Composition} from 'remotion';
import {V16DressingRoomFirestorm} from './V16DressingRoomFirestorm';
import {getRenderDurationSeconds} from './timing';

export const RemotionRoot:React.FC=()=>(
  <Composition
    id="V16DressingRoomFirestorm"
    component={V16DressingRoomFirestorm}
    durationInFrames={Math.ceil(getRenderDurationSeconds()*30)}
    fps={30}
    width={1920}
    height={1080}
  />
);
