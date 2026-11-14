'use client';

import { useEffect, useState } from 'react';
import Experience from './Experience';

export default function ExperienceRoot() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 animate-fade-in text-white/60 select-none">
        <div className="h-1.5 w-1.5 rounded-full bg-white/50 animate-ping" />
        <p className="text-xs uppercase tracking-[0.3em] font-light text-white/50">
          Diving deep into space...
        </p>
      </div>
    );
  }

  return <Experience />;
}
