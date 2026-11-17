import React from 'react';
import {Composition} from 'remotion';
import {ExplainerVideo, FPS, WIDTH, HEIGHT} from './ExplainerVideo';
import {ExplainerVideoAR} from './ExplainerVideoAR';
import {TOTAL_FRAMES as TOTAL_AR} from './timing-ar';

const TOTAL_EN = 3600;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="PrediabetesExplainer"
      component={ExplainerVideo}
      durationInFrames={TOTAL_EN}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="PrediabetesExplainerAR"
      component={ExplainerVideoAR}
      durationInFrames={TOTAL_AR}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);
