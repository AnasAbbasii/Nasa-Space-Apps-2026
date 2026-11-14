'use client';

import React from 'react';
import type { LunarMachine } from '@/lib/lunar-machines';
import { formatCoordinates } from '@/lib/moon-coords';

interface InfoPanelProps {
  machine: LunarMachine;
  onClose: () => void;
}

/**
 * Truly Transparent Liquid Glass Lunar Dossier.
 * Pure minimal white typography, zero solid backgrounds, zero colored containers.
 */
export default function InfoPanel({ machine, onClose }: InfoPanelProps) {
  return (
    <aside
      aria-label="Machine Information"
      className="absolute right-5 top-5 bottom-16 w-80 max-w-[calc(100vw-2.5rem)] overflow-y-auto no-scrollbar rounded-2xl z-20 pointer-events-auto transition-all animate-fade-in"
      style={{
        background: 'rgba(0, 0, 0, 0.32)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-start justify-between gap-3 px-6 pt-5 pb-3"
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-mono">
            {machine.missionName}
          </div>
          <h2 className="text-base font-light text-white tracking-wider mt-0.5 font-sans">
            {machine.name}
          </h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="mt-0.5 p-1 text-white/40 hover:text-white transition-all duration-200 ease-out hover:scale-[1.12] active:scale-[0.92] text-sm leading-none bg-transparent border-0 outline-none cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 pt-4 space-y-4 text-xs leading-relaxed text-white/70">
        {/* Geographic & Mission Meta Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <MetaItem label="Agency" value={machine.agency} />
          <MetaItem label="Country" value={machine.country} />
          <MetaItem label="Landed" value={machine.landingDate} />
          <MetaItem label="Coordinates" value={formatCoordinates(machine.lat, machine.lon)} />
        </div>

        <div className="border-t border-white/[0.06]" />

        <Section label="Original Purpose" text={machine.purpose} />
        <Section label="Why Left Behind" text={machine.leftBehind} />
        <Section label="Historical Significance" text={machine.significance} />
        <Section label="Current Status" text={machine.currentStatus} />

        <div className="pt-2 border-t border-white/[0.06]">
          <button
            onClick={onClose}
            className="w-full text-left py-1 text-[9px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.97] origin-left will-change-transform flex items-center gap-1.5 group bg-transparent border-0 outline-none p-0 cursor-pointer"
          >
            <span className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5">←</span>
            <span>Return to Full Moon</span>
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
      <div className="text-[9px] uppercase tracking-[0.2em] text-white/45 font-mono mb-1">
        {label}
      </div>
      <p className="text-white/70 text-[11px] leading-relaxed font-light">{text}</p>
    </div>
  );
}
