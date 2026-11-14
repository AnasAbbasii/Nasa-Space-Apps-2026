'use client';

import React from 'react';
import type { MarsMachine } from '@/lib/mars-machines';
import { formatMarsCoordinates } from '@/lib/mars-coords';

interface MarsInfoPanelProps {
  machine: MarsMachine;
  onClose: () => void;
}

/**
 * Refined Transparent Scientific Martian Dossier.
 * Deep transparent black surface, Space Grotesk regular typography, structured scientific fields.
 */
export default function MarsInfoPanel({ machine, onClose }: MarsInfoPanelProps) {
  return (
    <aside
      aria-label="Martian Machine Information"
      className="fixed right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 w-full sm:w-[380px] md:w-[410px] max-w-[calc(100vw-2rem)] max-h-[85vh] overflow-y-auto no-scrollbar rounded-[20px] z-30 pointer-events-auto transition-all duration-300 animate-fade-in shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
      style={{
        background: 'rgba(0, 0, 0, 0.74)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-start justify-between gap-3 px-6 pt-6 pb-3"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div className="flex-1 pr-2">
          {/* Machine Name: 25-30px, Regular weight */}
          <h2
            className="text-2xl sm:text-[26px] font-normal text-white tracking-tight leading-snug m-0 p-0"
            style={{
              fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
            }}
          >
            {machine.name}
          </h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="p-1 text-white/50 hover:text-white transition-opacity duration-200 text-sm leading-none bg-transparent border-0 outline-none cursor-pointer mt-1"
        >
          ✕
        </button>
      </div>

      {/* Body Content */}
      <div className="px-6 pb-6 pt-3 space-y-4">
        {/* Short, factual description */}
        <p className="text-[13px] sm:text-[13.5px] font-normal leading-relaxed text-white/70 m-0">
          {machine.siteName ? `${machine.siteName} — ${machine.significance || machine.purpose}` : machine.significance || machine.purpose}
        </p>

        {/* Subtle Divider */}
        <div className="border-t border-white/[0.08]" />

        {/* Key Mission Attributes Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
          <FieldItem label="MISSION" value={machine.missionName} />
          <FieldItem
            label="AGENCY"
            value={machine.country ? `${machine.agency} (${machine.country})` : machine.agency}
          />
          <FieldItem label="LANDING DATE" value={machine.landingDate} />
          <FieldItem label="LOCATION" value={formatMarsCoordinates(machine.lat, machine.lon)} />
        </div>

        <div className="border-t border-white/[0.08]" />

        {/* Structured Context Fields */}
        {machine.purpose && <SectionBlock label="PURPOSE" text={machine.purpose} />}
        {machine.leftBehind && <SectionBlock label="WHY IT REMAINS" text={machine.leftBehind} />}
        {machine.currentStatus && <SectionBlock label="STATUS" text={machine.currentStatus} />}

        {/* Return Button */}
        <div className="pt-2 border-t border-white/[0.08]">
          <button
            onClick={onClose}
            className="w-full text-left py-1 text-[10px] uppercase tracking-[1.5px] text-white/50 hover:text-white transition-opacity duration-200 flex items-center gap-2 bg-transparent border-0 outline-none p-0 cursor-pointer"
            style={{
              fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
            }}
          >
            <span>←</span>
            <span>Return to Full Mars</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function FieldItem({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-[9.5px] uppercase tracking-[1.5px] text-white/45 font-mono mb-1">
        {label}
      </div>
      <div className="text-xs sm:text-[13px] text-white/90 font-normal leading-snug">
        {value}
      </div>
    </div>
  );
}

function SectionBlock({ label, text }: { label: string; text?: string | null }) {
  if (!text) return null;
  return (
    <div>
      <div className="text-[9.5px] uppercase tracking-[1.5px] text-white/45 font-mono mb-1">
        {label}
      </div>
      <p className="text-white/75 text-xs sm:text-[12.5px] leading-relaxed font-normal m-0">
        {text}
      </p>
    </div>
  );
}
