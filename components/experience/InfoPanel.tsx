'use client';

import type { LunarMachine } from '@/lib/lunar-machines';
import { formatCoordinates } from '@/lib/moon-coords';

interface InfoPanelProps {
  machine: LunarMachine;
  onClose: () => void;
}

export default function InfoPanel({ machine, onClose }: InfoPanelProps) {
  return (
    <aside
      aria-label="Machine Information"
      className="absolute right-4 top-4 bottom-14 w-84 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl z-20 pointer-events-auto shadow-2xl transition-all"
      style={{
        background: 'rgba(6, 11, 22, 0.84)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(125, 211, 252, 0.18)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.7)',
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-start justify-between gap-3 px-5 pt-4 pb-3"
        style={{
          background: 'rgba(6, 11, 22, 0.94)',
          borderBottom: '1px solid rgba(125, 211, 252, 0.1)',
        }}
      >
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-sky-400/90 font-mono">
            {machine.missionName}
          </div>
          <h2 className="text-sm font-medium text-white/95 leading-snug mt-0.5">
            {machine.name}
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

      {/* Content */}
      <div className="px-5 pb-6 pt-3 space-y-4 text-xs leading-relaxed text-white/70">
        {/* Geographic & Mission Meta Grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 pt-1">
          <MetaItem label="Agency" value={machine.agency} />
          <MetaItem label="Country" value={machine.country} />
          <MetaItem label="Landed" value={machine.landingDate} />
          <MetaItem label="Coordinates" value={formatCoordinates(machine.lat, machine.lon)} />
        </div>

        <Divider />

        <Section label="Original Purpose" text={machine.purpose} />
        <Section label="Why Left Behind" text={machine.leftBehind} />
        <Section label="Historical Significance" text={machine.significance} />
        <Section label="Current Status" text={machine.currentStatus} />

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2 px-3 text-[10px] uppercase tracking-[0.2em] text-sky-300/80 hover:text-sky-200 bg-sky-950/40 hover:bg-sky-900/50 border border-sky-500/20 rounded transition-colors text-center"
          >
            ← Return to Full Moon
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
      <div className="text-[9px] uppercase tracking-[0.2em] text-sky-400/70 font-mono mb-1">
        {label}
      </div>
      <p className="text-white/75 text-[11px] leading-relaxed">{text}</p>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-white/[0.08]" />;
}
