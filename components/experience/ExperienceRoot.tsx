'use client';

import { useEffect, useState } from 'react';
import ThreeDotLoader from '@/components/ThreeDotLoader';
import Experience from './Experience';

export default function ExperienceRoot() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center select-none">
        <ThreeDotLoader size="md" />
      </div>
    );
  }

  return <Experience />;
}
