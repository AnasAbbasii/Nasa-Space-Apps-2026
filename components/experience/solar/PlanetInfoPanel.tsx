'use client';

import React from 'react';
import type { CelestialBody } from '@/lib/solar-system';

interface PlanetInfoPanelProps {
  body: CelestialBody;
  onClose: () => void;
  onEnterMoonMuseum?: () => void;
  onEnterMarsMuseum?: () => void;
}

export default function PlanetInfoPanel({
  body,
  onClose,
  onEnterMoonMuseum,
  onEnterMarsMuseum,
}: PlanetInfoPanelProps) {
  const isEarth = body.id === 'earth';
  const isMars = body.id === 'mars';

  return (
    <aside
      aria-label="Celestial Information"
      className="absolute right-5 top-5 bottom-16 w-84 max-w-[calc(100vw-2.5rem)] overflow-y-auto rounded-xl z-20 pointer-events-auto transition-all animate-fade-in"
      style={{
        background: 'rgba(6, 11, 22, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(125, 211, 252, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.75)',
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-start justify-between gap-3 px-5 pt-4 pb-3"
        style={{
          background: 'rgba(6, 11, 22, 0.95)',
          borderBottom: '1px solid rgba(125, 211, 252, 0.1)',
        }}
      >
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-sky-400 font-mono font-medium">
            {body.type === 'star' ? 'Central Star' : 'Major Planet'}
          </div>
          <h2 className="text-base font-medium text-white/95 leading-tight mt-0.5 tracking-wide font-sans">
            {body.name}
          </h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="mt-0.5 p-1 rounded hover:bg-white/10 text-white/40 hover:text-white/90 transition-colors text-sm leading-none"
        >
          ✕
        </button>
      </div>

      {/* Body content */}
      <div className="px-5 pb-6 pt-3 space-y-4 text-xs leading-relaxed text-white/70">
        {/* Astronomical Metrics Grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 pt-1">
          <Metric label="Distance from Sun" value={body.distanceFromSun} />
          <Metric label="Diameter" value={body.diameter} />
          <Metric label="Orbital Period" value={body.orbitalPeriod} />
          <Metric label="Rotation Period" value={body.rotationPeriod} />
        </div>

        <div className="border-t border-white/[0.08]" />

        <div>
          <div className="text-[9px] uppercase tracking-[0.2em] text-sky-400/80 font-mono mb-1.5">
            Scientific Overview
          </div>
          <p className="text-white/75 text-[11px] leading-relaxed font-light">
            {body.summary}
          </p>
        </div>

        {/* Earth & Moon Gateway Callout */}
        {isEarth && onEnterMoonMuseum && (
          <div className="pt-2">
            <div className="p-3 rounded-lg bg-sky-950/60 border border-sky-400/30 space-y-2">
              <div className="text-[10px] uppercase tracking-[0.2em] text-sky-300 font-semibold flex items-center gap-1.5">
                <span>✦</span> The Moon Gateway
              </div>
              <p className="text-[10px] text-white/70 leading-relaxed font-light">
                Explore the Moon and discover the forgotten machines and equipment left on its surface.
              </p>
              <button
                onClick={onEnterMoonMuseum}
                className="w-full py-2 px-3 text-[10px] uppercase tracking-[0.2em] text-white bg-sky-600/80 hover:bg-sky-500 rounded font-medium transition-all shadow-lg hover:shadow-sky-500/25 flex items-center justify-center gap-1.5"
              >
                <span>Enter Moon Museum</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* Mars Exploration Gateway Callout */}
        {isMars && onEnterMarsMuseum && (
          <div className="pt-2">
            <div className="p-3 rounded-lg bg-orange-950/60 border border-orange-500/35 space-y-2">
              <div className="text-[10px] uppercase tracking-[0.2em] text-orange-300 font-semibold flex items-center gap-1.5">
                <span>✦</span> Martian Museum Gateway
              </div>
              <p className="text-[10px] text-white/70 leading-relaxed font-light">
                Explore Mars and discover the rovers and landers left across its red plains and craters.
              </p>
              <button
                onClick={onEnterMarsMuseum}
                className="w-full py-2 px-3 text-[10px] uppercase tracking-[0.2em] text-white bg-orange-600/80 hover:bg-orange-500 rounded font-medium transition-all shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-1.5"
              >
                <span>Enter Mars Museum</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        <div className="pt-1">
          <button
            onClick={onClose}
            className="w-full py-1.5 px-3 text-[9px] uppercase tracking-[0.2em] text-white/40 hover:text-white/80 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded transition-colors text-center"
          >
            ← Solar System Overview
          </button>
        </div>
      </div>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.18em] text-white/35 font-mono mb-0.5">
        {label}
      </div>
      <div className="text-xs text-white/85 font-light">{value}</div>
    </div>
  );
}
