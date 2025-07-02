'use client';

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

type LottiePlayerProps = {
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  style?: React.CSSProperties;
};

export default function LottiePlayer({
  src,
  loop = true,
  autoplay = true,
  style = { width: '200px', height: '200px' },
}: LottiePlayerProps) {
  return (
    <DotLottieReact
      src={src}
      loop={loop}
      autoplay={autoplay}
      style={style}
    />
  );
}
