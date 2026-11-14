'use client';

import React, { useState } from 'react';
import type { CelestialBody } from '@/lib/solar-system';

interface PlanetInfoPanelProps {
  body: CelestialBody;
  onClose: () => void;
  onEnterMoonMuseum?: () => void;
  onEnterMarsMuseum?: () => void;
}

/**
 * Premium Floating 3D Interactive Information Card.
 * - Subtly tilted perspective glass aesthetic with gentle floating animation.
 * - Interactive pointer tilt feedback simulating a physical holographic interface.
 * - High readability with prominent typography and verified astronomical data.
 */
export default function PlanetInfoPanel({
  body,
  onClose,
  onEnterMoonMuseum,
  onEnterMarsMuseum,
}: PlanetInfoPanelProps) {
  const isEarth = body.id === 'earth';
  const isMars = body.id === 'mars';

  // Subtle interactive 3D pointer tilt
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only apply dynamic tilt on screens larger than mobile
    if (window.innerWidth < 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setTilt({ x: -(y * 3.0), y: x * 3.5 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      className="fixed z-20 pointer-events-auto select-none transition-all duration-500 ease-out animate-fade-in
        right-4 sm:right-6 md:right-10 top-auto bottom-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2
        w-[calc(100vw-2rem)] sm:w-[26rem] md:w-[27rem] max-h-[55dvh] md:max-h-[calc(100dvh-5rem)]"
      style={{ perspective: '1200px' }}
    >
      {/* Floating Wrapper */}
      <div className="animate-card-float w-full h-full">
        {/* Slightly Tilted Holographic Glass Card */}
        <aside
          aria-label={`${body.name} Information Dossier`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full flex flex-col rounded-3xl p-5 sm:p-6 overflow-y-auto no-scrollbar transition-transform duration-300 ease-out shadow-[0_20px_50px_rgba(0,0,0,0.65)]"
          style={{
            background: 'rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            transform: `perspective(1200px) rotateY(${-4.5 + tilt.y}deg) rotateX(${1.5 + tilt.x}deg)`,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-3.5 border-b border-white/[0.07]">
            <div>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-white/50 font-mono">
                {body.type === 'star' ? 'Central Star' : 'Major Planet'}
              </span>
              <h2
                style={{
                  fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
                }}
                className="text-2xl sm:text-3xl font-light text-white tracking-wide mt-0.5 leading-none"
              >
                {body.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close dossier"
              className="p-1.5 text-white/40 hover:text-white transition-all duration-200 ease-out hover:scale-[1.12] active:scale-[0.92] text-sm leading-none bg-transparent border-0 outline-none cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Scientific Summary */}
          <div className="py-4 border-b border-white/[0.07]">
            <p className="text-xs sm:text-[13px] leading-relaxed text-white/80 font-light">
              {body.summary}
            </p>
          </div>

          {/* Verified Astronomical Telemetry Metrics */}
          <div className="py-4 space-y-3.5 border-b border-white/[0.07]">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
              <MetricItem label="Distance from Sun" value={body.distanceFromSun} />
              <MetricItem label="Diameter" value={body.diameter} />
              <MetricItem label="Length of Day" value={body.rotationPeriod} />
              <MetricItem label="Orbital Period" value={body.orbitalPeriod} />
            </div>

            {/* Moons Row */}
            <div className="pt-1">
              <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono mb-1">
                Natural Satellites
              </div>
              <div className="text-xs sm:text-[13px] text-white/95 font-light">
                {body.moons}
              </div>
            </div>
          </div>

          {/* Earth Moon Gateway Portal */}
          {isEarth && onEnterMoonMuseum && (
            <div className="py-3.5 border-b border-white/[0.07] space-y-1.5">
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/85 font-light flex items-center gap-1.5">
                <span className="text-[9px] text-white/40">✦</span>
                <span>The Moon Archive</span>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed font-light">
                Explore the Moon and discover the forgotten machines left across its surface.
              </p>
              <button
                onClick={onEnterMoonMuseum}
                className="text-left text-xs uppercase tracking-[0.2em] text-white/90 hover:text-white transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.97] origin-left will-change-transform flex items-center gap-2 pt-1 group bg-transparent border-0 outline-none p-0 cursor-pointer"
              >
                <span>Enter Moon Museum</span>
                <span className="transition-transform duration-200 ease-out group-hover:translate-x-1 text-white/40 group-hover:text-white">
                  →
                </span>
              </button>
            </div>
          )}

          {/* Mars Exploration Gateway Portal */}
          {isMars && onEnterMarsMuseum && (
            <div className="py-3.5 border-b border-white/[0.07] space-y-1.5">
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/85 font-light flex items-center gap-1.5">
                <span className="text-[9px] text-white/40">✦</span>
                <span>Martian Archive</span>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed font-light">
                Explore Mars and discover the rovers and landers left across its red plains.
              </p>
              <button
                onClick={onEnterMarsMuseum}
                className="text-left text-xs uppercase tracking-[0.2em] text-white/90 hover:text-white transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.97] origin-left will-change-transform flex items-center gap-2 pt-1 group bg-transparent border-0 outline-none p-0 cursor-pointer"
              >
                <span>Enter Mars Museum</span>
                <span className="transition-transform duration-200 ease-out group-hover:translate-x-1 text-white/40 group-hover:text-white">
                  →
                </span>
              </button>
            </div>
          )}

          {/* Return Action */}
          <div className="pt-3.5">
            <button
              onClick={onClose}
              className="w-full text-left py-1 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.97] origin-left will-change-transform flex items-center gap-1.5 group bg-transparent border-0 outline-none p-0 cursor-pointer"
            >
              <span className="transition-transform duration-200 ease-out group-hover:-translate-x-1">←</span>
              <span>Return to Solar System Overview</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono mb-1">
        {label}
      </div>
      <div className="text-xs sm:text-[13px] text-white/95 font-light leading-snug">
        {value}
      </div>
    </div>
  );
}
