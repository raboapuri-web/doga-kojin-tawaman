import React from 'react';
import {Composition} from 'remotion';
import {V13BreakingDown} from './V13BreakingDown';
import {AudioDesign} from './AudioDesign';
import {getRenderDurationSeconds} from './timing';
const FPS=30;
const Video:React.FC=()=> <><V13BreakingDown/><AudioDesign/></>;
export const Root:React.FC=()=> <Composition id="V13BreakingDown" component={Video} durationInFrames={Math.ceil(getRenderDurationSeconds()*FPS)} fps={FPS} width={1920} height={1080}/>;
