import React from 'react';
import {Composition} from 'remotion';
import {V23MarriageMinato} from './V23MarriageMinato';
import {getDuration} from './timing';

export const RemotionRoot:React.FC=()=><Composition id="V23MarriageMinato" component={V23MarriageMinato} durationInFrames={Math.ceil(getDuration()*30)} fps={30} width={1920} height={1080}/>;
