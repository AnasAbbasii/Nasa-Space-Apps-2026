'use client';

import React, { useEffect, useRef } from 'react';
import { CELESTIAL_BODIES, CelestialBody } from '@/lib/solar-system';

interface SolarSidebarProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  selectedBody: CelestialBody | null;
  onSelectBody: (body: CelestialBody | null) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
}

/**
 * Responsive Navigation Bar — Full Vertical Fit.
 * - Sized proportionally using 100dvh with mobile viewport and safe-area inset fallbacks.
 * - Height never exceeds visible viewport on any screen size.
 * - Width is constrained to prevent horizontal overflow on small mobile screens.
 * - Internal scrolling is smooth and natural with scrollbars completely hidden.
 * - Dismisses via click-outside or Escape key; no X button or decorative clutter.
 */
export default function SolarSidebar({
  isOpen,
  onToggle,
  selectedBody,
  onSelectBody,
  isPlaying,
  onTogglePlay,
  onReset,
}: SolarSidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);
  const planets = CELESTIAL_BODIES;

  // Keyboard navigation: Escape key closes the navigation bar
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onToggle(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onToggle]);

  return (
    <>
      {/* 1. Collapsed Toggle Trigger (Safe-area aware) */}
      {!isOpen && (
        <div
          className="fixed z-20 pointer-events-auto select-none"
          style={{
            top: 'max(1.25rem, env(safe-area-inset-top, 1.25rem))',
            left: 'max(1.25rem, env(safe-area-inset-left, 1.25rem))',
          }}
        >
          <button
            type="button"
            onClick={() => onToggle(true)}
            className="group inline-flex items-center gap-2.5 h-[38px] px-4 rounded-full text-xs sm:text-[13px] tracking-[0.16em] uppercase font-medium text-white/85 hover:text-white transition-all duration-200 ease-out hover:scale-[1.03] active:scale-[0.97] will-change-transform border-0 outline-none cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
            style={{
              background: 'rgba(0, 0, 0, 0.28)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
            }}
            aria-label="Open Navigation"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-white/60 group-hover:text-white transition-colors duration-200"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span>Navigation</span>
          </button>
        </div>
      )}

      {/* 2. Transparent Click-Outside Backdrop */}
      {isOpen && (
        <div
          onClick={() => onToggle(false)}
          aria-hidden="true"
          className="fixed inset-0 z-20 bg-transparent pointer-events-auto"
        />
      )}

      {/* 3. Responsive Navigation Container (Guaranteed Full Vertical Fit) */}
      <aside
        ref={sidebarRef}
        aria-label="Navigation"
        className={`fixed z-30 pointer-events-auto flex flex-col p-3 sm:p-3.5 rounded-2xl transition-all duration-300 ease-out overflow-y-auto overflow-x-hidden no-scrollbar select-none sidebar-vertical-fit ${
          isOpen
            ? 'translate-x-0 opacity-100 shadow-[0_8px_32px_rgba(0,0,0,0.55)]'
            : '-translate-x-[calc(100%+2rem)] opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'rgba(0, 0, 0, 0.32)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div className="flex flex-col space-y-0.5 w-full">
          {/* Overview Destination */}
          <button
            onClick={() => {
              onSelectBody(null);
              onToggle(false);
            }}
            className="w-full text-left py-1 sm:py-1.25 px-1.5 flex items-center justify-between text-xs tracking-[0.16em] uppercase font-light transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.97] origin-left will-change-transform bg-transparent border-0 outline-none cursor-pointer group"
          >
            <span
              className={
                selectedBody === null
                  ? 'text-white font-normal'
                  : 'text-white/50 group-hover:text-white transition-colors duration-200'
              }
            >
              Overview
            </span>
            {selectedBody === null && (
              <span className="h-1 w-1 rounded-full bg-white transition-opacity duration-200" />
            )}
          </button>

          {/* Celestial Bodies */}
          {planets.map((b) => {
            const isSelected = selectedBody?.id === b.id;
            return (
              <button
                key={b.id}
                onClick={() => {
                  onSelectBody(b);
                  onToggle(false);
                }}
                className="w-full text-left py-1 sm:py-1.25 px-1.5 flex items-center justify-between text-xs tracking-[0.16em] uppercase font-light transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.97] origin-left will-change-transform bg-transparent border-0 outline-none cursor-pointer group"
              >
                <span
                  className={
                    isSelected
                      ? 'text-white font-normal'
                      : 'text-white/50 group-hover:text-white transition-colors duration-200'
                  }
                >
                  {b.name}
                </span>
                {isSelected && (
                  <span className="h-1 w-1 rounded-full bg-white transition-opacity duration-200" />
                )}
              </button>
            );
          })}

          {/* Minimal Separator */}
          <div className="h-px bg-white/[0.04] my-1 sm:my-1.5" />

          {/* View Controls */}
          <button
            onClick={onTogglePlay}
            className="w-full text-left py-1 sm:py-1.25 px-1.5 flex items-center justify-between text-xs tracking-[0.16em] uppercase font-light text-white/60 hover:text-white transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.97] origin-left will-change-transform bg-transparent border-0 outline-none cursor-pointer group"
          >
            <span>Orbital Motion</span>
            <span className="text-[9px] tracking-[0.18em] uppercase text-white/40 group-hover:text-white/80 transition-colors duration-200">
              {isPlaying ? 'Pause' : 'Resume'}
            </span>
          </button>

          <button
            onClick={() => {
              onReset();
              onToggle(false);
            }}
            className="w-full text-left py-1 sm:py-1.25 px-1.5 flex items-center justify-between text-xs tracking-[0.16em] uppercase font-light text-white/60 hover:text-white transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.97] origin-left will-change-transform bg-transparent border-0 outline-none cursor-pointer group"
          >
            <span>Reset View</span>
            <span className="text-[10px] text-white/40 group-hover:text-white/80 group-hover:-rotate-45 transition-all duration-300 ease-out">
              ↺
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
