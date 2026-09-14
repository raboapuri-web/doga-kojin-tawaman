import React from 'react';
import {Composition} from 'remotion';
import {FriendsDemo} from './FriendsDemo';

export const Root: React.FC = () => (
  <>
    <Composition
      id="R3FFriendsDemo"
      component={FriendsDemo}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={360}
    />
  </>
);
