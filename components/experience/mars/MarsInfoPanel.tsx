'use client';

import React from 'react';
import type { MarsMachine } from '@/lib/mars-machines';
import { formatMarsCoordinates } from '@/lib/mars-coords';

interface MarsInfoPanelProps {
  machine: MarsMachine;
  onClose: () => void;
  onExploreStory: () => void;
}

/**
 * Minimal Martian Machine Information Card.
 * Displays strictly the 4 required items:
 * 1. Machine Name
 * 2. Date
 * 3. Coordinates
 * 4. Purpose
 * Followed by the EXPLORE THE STORY cinematic button.
 */
export default function MarsInfoPanel({ machine, onClose, onExploreStory }: MarsInfoPanelProps) {
  return (
    <aside
      aria-label="Martian Machine Information"
      className="fixed right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 w-full sm:w-[350px] md:w-[370px] max-w-[calc(100vw-2rem)] rounded-[20px] z-30 pointer-events-auto transition-all duration-300 animate-fade-in shadow-[0_16px_40px_rgba(0,0,0,0.65)]"
      style={{
        background: 'rgba(0, 0, 0, 0.74)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Header: Machine Name & Close Button */}
      <div
        className="flex items-start justify-between gap-3 px-6 pt-5 pb-3 border-b border-white/[0.06]"
      >
        <div className="flex-1 pr-2">
          <span className="text-[9px] uppercase tracking-[2px] text-white/40 font-mono block mb-1">
            MARTIAN MONUMENT
          </span>
          <h2
            className="text-xl sm:text-[22px] font-normal text-white tracking-tight leading-snug m-0 p-0"
            style={{
              fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
            }}
          >
            {machine.name}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          data-cursor="focus"
          className="p-1 text-white/50 hover:text-white transition-opacity duration-200 text-sm leading-none bg-transparent border-0 outline-none cursor-pointer mt-1"
        >
          ✕
        </button>
      </div>

      {/* Body: Date, Coordinates, Purpose */}
      <div className="px-6 py-4 space-y-3.5">
        {/* Item 2: Date */}
        <div>
          <div className="text-[9px] uppercase tracking-[1.5px] text-white/40 font-mono mb-0.5">
            DATE
          </div>
          <div className="text-xs sm:text-[13px] text-white/90 font-normal">
            {machine.landingDate}
          </div>
        </div>

        {/* Item 3: Coordinates */}
        <div>
          <div className="text-[9px] uppercase tracking-[1.5px] text-white/40 font-mono mb-0.5">
            COORDINATES
          </div>
          <div className="text-xs sm:text-[13px] text-white/90 font-mono">
            {formatMarsCoordinates(machine.lat, machine.lon)}
          </div>
        </div>

        {/* Item 4: Purpose */}
        <div>
          <div className="text-[9px] uppercase tracking-[1.5px] text-white/40 font-mono mb-0.5">
            PURPOSE
          </div>
          <p className="text-white/80 text-xs sm:text-[13px] leading-relaxed font-normal m-0">
            {machine.purpose || machine.significance}
          </p>
        </div>

        {/* Cinematic Story Action */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onExploreStory}
            data-cursor="focus"
            className="w-full py-3 px-4 rounded-xl text-xs uppercase tracking-[0.2em] font-medium text-white transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer border border-white/25 hover:border-white/60 hover:bg-white/10 active:scale-[0.98] shadow-[0_4px_16px_rgba(255,255,255,0.06)]"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
            }}
          >
            <svg
              className="w-3.5 h-3.5 fill-current text-white/90"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>EXPLORE THE STORY</span>
          </button>
        </div>

        {/* Return Button */}
        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={onClose}
            data-cursor="focus"
            className="text-[10px] uppercase tracking-[1.5px] text-white/40 hover:text-white/80 transition-opacity duration-200 bg-transparent border-0 outline-none p-0 cursor-pointer"
            style={{
              fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
            }}
          >
            ← Return to Full Mars
          </button>
        </div>
      </div>
    </aside>
  );
}
