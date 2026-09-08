import React from 'react';
import {Composition} from 'remotion';
import {V12ChoiceBlindness} from './V12ChoiceBlindness';
import {AudioDesign} from './AudioDesign';
import {getRenderDurationSeconds} from './timing';
const FPS=30;
const Video:React.FC=()=> <><V12ChoiceBlindness/><AudioDesign/></>;
export const Root:React.FC=()=> <Composition id="V12ChoiceBlindness" component={Video} durationInFrames={Math.ceil(getRenderDurationSeconds()*FPS)} fps={FPS} width={1920} height={1080}/>;
