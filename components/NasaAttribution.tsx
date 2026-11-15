'use client';

import Image from 'next/image';
import { cursorStore } from '@/lib/cursor-store';

export default function NasaAttribution() {
  return (
    <aside
      className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 pointer-events-none select-none"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      <a
        href="https://www.spaceappschallenge.org/"
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="focus"
        onPointerEnter={() => cursorStore.set('focus')}
        onPointerLeave={() => cursorStore.set('default')}
        aria-label="Created for NASA Space Apps Challenge 2026 - Visit official website (opens in a new tab)"
        className="group pointer-events-auto inline-flex items-center gap-2 text-white/60 hover:text-white transition-all duration-200 ease-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
      >
        <div className="relative w-5 h-[17px] sm:w-[22px] sm:h-[18px] shrink-0 opacity-85 group-hover:opacity-100 group-hover:brightness-110 transition-all duration-200 ease-out">
          <Image
            src="/nasa-logo.svg"
            alt="NASA Insignia"
            fill
            sizes="24px"
            className="object-contain"
            priority
          />
        </div>
        <span className="text-[10px] sm:text-[11px] font-light tracking-[0.04em] whitespace-nowrap drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] transition-colors duration-200 ease-out">
          Created for NASA Space Apps Challenge 2026
        </span>
      </a>
    </aside>
  );
}
