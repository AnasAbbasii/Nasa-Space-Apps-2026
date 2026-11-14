'use client';

import React from 'react';

interface ThreeDotLoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Premium three-dot loading indicator for The Museum of Forgotten Machines.
 * Features smooth sequential pulsing, subtle opacity/scale transitions,
 * and pure #FFFFFF dots matching the dark space aesthetic with zero borders or cards.
 */
export default function ThreeDotLoader({
  className = '',
  size = 'md',
}: ThreeDotLoaderProps) {
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const gapSizes = {
    sm: 'gap-2',
    md: 'gap-2.5',
    lg: 'gap-3',
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-flex items-center justify-center select-none ${gapSizes[size]} ${className}`}
    >
      <span
        className={`${dotSizes[size]} rounded-full bg-white animate-dot-pulse`}
        style={{ animationDelay: '0ms' }}
      />
      <span
        className={`${dotSizes[size]} rounded-full bg-white animate-dot-pulse`}
        style={{ animationDelay: '200ms' }}
      />
      <span
        className={`${dotSizes[size]} rounded-full bg-white animate-dot-pulse`}
        style={{ animationDelay: '400ms' }}
      />
    </div>
  );
}
