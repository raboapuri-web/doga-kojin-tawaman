import React from 'react';
import {Composition} from 'remotion';
import {FriendsFirstMinute} from './FriendsFirstMinute';

export const Root: React.FC = () => (
  <>
    <Composition
      id="R3FFriendsFirstMinute"
      component={FriendsFirstMinute}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={1800}
    />
  </>
);
