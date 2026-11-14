'use client';

import React from 'react';
import type { MarsMachine } from '@/lib/mars-machines';
import { formatMarsCoordinates } from '@/lib/mars-coords';

interface MarsInfoPanelProps {
  machine: MarsMachine;
  onClose: () => void;
}

export default function MarsInfoPanel({ machine, onClose }: MarsInfoPanelProps) {
  return (
    <aside
      aria-label="Martian Machine Information"
      className="absolute right-5 top-5 bottom-16 w-84 max-w-[calc(100vw-2.5rem)] overflow-y-auto rounded-xl z-20 pointer-events-auto transition-all animate-fade-in"
      style={{
        background: 'rgba(16, 9, 8, 0.90)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 138, 87, 0.25)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.75)',
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-start justify-between gap-3 px-5 pt-4 pb-3"
        style={{
          background: 'rgba(16, 9, 8, 0.96)',
          borderBottom: '1px solid rgba(255, 138, 87, 0.15)',
        }}
      >
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-orange-400 font-mono font-medium">
            {machine.missionName}
          </div>
          <h2 className="text-base font-medium text-white/95 leading-tight mt-0.5 tracking-wide font-sans">
            {machine.name}
          </h2>
          <div className="text-[10px] text-white/45 font-mono mt-0.5">
            {machine.siteName}
          </div>
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
        {/* Geographic & Mission Meta Grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 pt-1">
          <MetaItem label="Agency" value={machine.agency} />
          <MetaItem label="Country" value={machine.country} />
          <MetaItem label="Landed" value={machine.landingDate} />
          <MetaItem label="Coordinates" value={formatMarsCoordinates(machine.lat, machine.lon)} />
        </div>

        <div className="border-t border-white/[0.08]" />

        <Section label="Original Purpose" text={machine.purpose} />
        <Section label="Why Left Behind" text={machine.leftBehind} />
        <Section label="Historical Significance" text={machine.significance} />
        <Section label="Current Status" text={machine.currentStatus} />

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2 px-3 text-[10px] uppercase tracking-[0.2em] text-orange-300/90 hover:text-orange-200 bg-orange-950/40 hover:bg-orange-900/50 border border-orange-500/30 rounded transition-colors text-center"
          >
            ← Return to Full Mars View
          </button>
        </div>
      </div>
    </aside>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.18em] text-white/35 font-mono mb-0.5">
        {label}
      </div>
      <div className="text-xs text-white/85 font-light">{value}</div>
    </div>
  );
}

function Section({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.2em] text-orange-400/80 font-mono mb-1">
        {label}
      </div>
      <p className="text-white/75 text-[11px] leading-relaxed font-light">{text}</p>
    </div>
  );
}
