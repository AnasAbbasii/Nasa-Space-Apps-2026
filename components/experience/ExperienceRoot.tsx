'use client';

import { useSyncExternalStore } from 'react';
import ThreeDotLoader from '@/components/ThreeDotLoader';
import Experience from './Experience';

const emptySubscribe = () => () => {};

export default function ExperienceRoot() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center select-none">
        <ThreeDotLoader size="md" />
      </div>
    );
  }

  return <Experience />;
}
