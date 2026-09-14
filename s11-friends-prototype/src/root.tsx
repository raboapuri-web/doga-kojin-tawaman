import React from 'react';
import {Composition, Still} from 'remotion';
import {S11FourSeconds, S11LayerSheet, S11QaSheet} from './s11';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="S11FourSeconds" component={S11FourSeconds} durationInFrames={120} fps={30} width={1920} height={1080} />
    <Still id="S11QaSheet" component={S11QaSheet} width={2560} height={720} />
    <Still id="S11LayerSheet" component={S11LayerSheet} width={2560} height={1260} />
  </>
);
