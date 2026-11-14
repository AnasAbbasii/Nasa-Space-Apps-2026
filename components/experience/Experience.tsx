'use client';

import { Suspense, useState, useRef, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Moon Museum Components & Data
import { LUNAR_MACHINES } from '@/lib/lunar-machines';
import type { LunarMachine } from '@/lib/lunar-machines';
import { MOON_RADIUS, latLonToVector3 } from '@/lib/moon-coords';
import Moon from './Moon';
import DynamicCallouts from './DynamicCallouts';
import InfoPanel from './InfoPanel';

// Mars Museum Components & Data
import { MARS_MACHINES } from '@/lib/mars-machines';
import type { MarsMachine } from '@/lib/mars-machines';
import { MARS_RADIUS, marsLatLonToVector3 } from '@/lib/mars-coords';
import Mars from './mars/Mars';
import MarsCallouts from './mars/MarsCallouts';
import MarsInfoPanel from './mars/MarsInfoPanel';

// Solar System Components & Data
import { CELESTIAL_BODIES } from '@/lib/solar-system';
import type { CelestialBody } from '@/lib/solar-system';
import SolarSystem from './solar/SolarSystem';
import PlanetInfoPanel from './solar/PlanetInfoPanel';

type ViewMode = 'solar' | 'moon' | 'mars';

interface CameraControllerProps {
  viewMode: ViewMode;
  selectedMachine: LunarMachine | null;
  selectedMarsMachine: MarsMachine | null;
  selectedBody: CelestialBody | null;
  moonGroupRef: React.RefObject<THREE.Group | null>;
  marsGroupRef: React.RefObject<THREE.Group | null>;
  controlsRef: React.RefObject<React.ComponentRef<typeof OrbitControls> | null>;
  planetPositionsRef: React.RefObject<Map<string, THREE.Vector3>>;
}

function CameraController({
  viewMode,
  selectedMachine,
  selectedMarsMachine,
  selectedBody,
  moonGroupRef,
  marsGroupRef,
  controlsRef,
  planetPositionsRef,
}: CameraControllerProps) {
  const isTransitioningRef = useRef(false);
  const targetCamPos = useRef(new THREE.Vector3(0, 22, 36));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Handle camera targets on viewMode / selection changes
  useEffect(() => {
    if (viewMode === 'moon') {
      if (selectedMachine && moonGroupRef.current) {
        // Machine geographic location on Moon surface
        const localPos = latLonToVector3(
          selectedMachine.lat,
          selectedMachine.lon,
          MOON_RADIUS,
        );
        const worldPos = localPos.clone().applyEuler(moonGroupRef.current.rotation);
        const outwardNormal = worldPos.clone().normalize();
        targetCamPos.current.copy(worldPos).add(outwardNormal.multiplyScalar(0.70));
        targetLookAt.current.copy(worldPos);
      } else {
        // Full Moon overview
        targetCamPos.current.set(0, 0, 5.5);
        targetLookAt.current.set(0, 0, 0);
      }
      isTransitioningRef.current = true;
    } else if (viewMode === 'mars') {
      if (selectedMarsMachine && marsGroupRef.current) {
        // Machine geographic location on Mars surface
        const localPos = marsLatLonToVector3(
          selectedMarsMachine.lat,
          selectedMarsMachine.lon,
          MARS_RADIUS,
        );
        const worldPos = localPos.clone().applyEuler(marsGroupRef.current.rotation);
        const outwardNormal = worldPos.clone().normalize();
        targetCamPos.current.copy(worldPos).add(outwardNormal.multiplyScalar(0.70));
        targetLookAt.current.copy(worldPos);
      } else {
        // Full Mars overview
        targetCamPos.current.set(0, 0, 5.5);
        targetLookAt.current.set(0, 0, 0);
      }
      isTransitioningRef.current = true;
    } else {
      // Solar System view mode
      if (selectedBody && planetPositionsRef.current) {
        const planetPos = planetPositionsRef.current.get(selectedBody.id) ?? new THREE.Vector3();
        const offsetDist = Math.max(2.5, selectedBody.planetRadius * 4.2);
        targetCamPos.current.set(
          planetPos.x + offsetDist * 0.7,
          planetPos.y + offsetDist * 0.5,
          planetPos.z + offsetDist,
        );
        targetLookAt.current.copy(planetPos);
      } else {
        // Solar System overview
        targetCamPos.current.set(0, 22, 36);
        targetLookAt.current.set(0, 0, 0);
      }
      isTransitioningRef.current = true;
    }
  }, [viewMode, selectedMachine, selectedMarsMachine, selectedBody, moonGroupRef, marsGroupRef, planetPositionsRef]);

  useFrame((state) => {
    if (!controlsRef.current) return;

    // Follow moving planet dynamically if in solar view and body is selected
    if (viewMode === 'solar' && selectedBody && planetPositionsRef.current) {
      const livePos = planetPositionsRef.current.get(selectedBody.id);
      if (livePos) {
        const offsetDist = Math.max(2.5, selectedBody.planetRadius * 4.2);
        const desiredPos = new THREE.Vector3(
          livePos.x + offsetDist * 0.7,
          livePos.y + offsetDist * 0.5,
          livePos.z + offsetDist,
        );
        state.camera.position.lerp(desiredPos, 0.05);
        controlsRef.current.target.lerp(livePos, 0.05);
        controlsRef.current.update();
        return;
      }
    }

    if (!isTransitioningRef.current) return;

    state.camera.position.lerp(targetCamPos.current, 0.05);
    controlsRef.current.target.lerp(targetLookAt.current, 0.05);
    controlsRef.current.update();

    if (state.camera.position.distanceTo(targetCamPos.current) < 0.02) {
      isTransitioningRef.current = false;
    }
  });

  return null;
}

export default function Experience() {
  // Master View Mode: 'solar' | 'moon' | 'mars'
  const [viewMode, setViewMode] = useState<ViewMode>('solar');

  // Solar system state
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const planetPositionsRef = useRef<Map<string, THREE.Vector3>>(new Map());

  // Moon museum state
  const [selectedMachine, setSelectedMachine] = useState<LunarMachine | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [autoRotateMoon, setAutoRotateMoon] = useState(true);
  const moonGroupRef = useRef<THREE.Group>(null);

  // Mars museum state
  const [selectedMarsMachine, setSelectedMarsMachine] = useState<MarsMachine | null>(null);
  const [hoveredMarsId, setHoveredMarsId] = useState<string | null>(null);
  const [autoRotateMars, setAutoRotateMars] = useState(true);
  const marsGroupRef = useRef<THREE.Group>(null);

  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null);

  // Switch to Moon Museum
  const handleEnterMoonMuseum = useCallback(() => {
    setSelectedBody(null);
    setSelectedMachine(null);
    setHoveredId(null);
    setViewMode('moon');
  }, []);

  // Switch to Mars Museum
  const handleEnterMarsMuseum = useCallback(() => {
    setSelectedBody(null);
    setSelectedMarsMachine(null);
    setHoveredMarsId(null);
    setViewMode('mars');
  }, []);

  // Return to Solar System
  const handleReturnToSolar = useCallback(() => {
    setSelectedMachine(null);
    setSelectedMarsMachine(null);
    setHoveredId(null);
    setHoveredMarsId(null);
    setSelectedBody(null);
    setViewMode('solar');
  }, []);

  const handleSelectMachine = useCallback((machine: LunarMachine | null) => {
    setSelectedMachine(machine);
    if (machine) {
      setAutoRotateMoon(false);
    }
  }, []);

  const handleSelectMarsMachine = useCallback((machine: MarsMachine | null) => {
    setSelectedMarsMachine(machine);
    if (machine) {
      setAutoRotateMars(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    if (viewMode === 'moon') {
      setSelectedMachine(null);
      setHoveredId(null);
      setAutoRotateMoon(true);
    } else if (viewMode === 'mars') {
      setSelectedMarsMachine(null);
      setHoveredMarsId(null);
      setAutoRotateMars(true);
    } else {
      setSelectedBody(null);
    }
  }, [viewMode]);

  return (
    <div className="relative w-full h-full select-none">
      {/* Top Header Branding & Mode Controls */}
      <div className="absolute top-5 left-5 z-20 pointer-events-auto flex flex-col gap-2">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-white/95 font-medium font-sans">
            The Museum of Forgotten Machines
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-mono mt-0.5 text-sky-400/80">
            {viewMode === 'solar' && 'Interactive 3D Solar System'}
            {viewMode === 'moon' && 'Lunar Exploration Archive'}
            {viewMode === 'mars' && 'Martian Exploration Archive'}
          </div>
        </div>

        {/* View mode toggle buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {viewMode !== 'solar' ? (
            <button
              onClick={handleReturnToSolar}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 text-[10px] uppercase tracking-[0.2em] text-white/90 hover:text-white transition-all shadow-lg"
            >
              <span>←</span>
              <span>Solar System</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleEnterMoonMuseum}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950/70 hover:bg-sky-900/80 border border-sky-400/30 text-[10px] uppercase tracking-[0.2em] text-sky-200 transition-all shadow-md"
              >
                <span>✦</span>
                <span>Moon Museum</span>
              </button>
              <button
                onClick={handleEnterMarsMuseum}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-950/70 hover:bg-orange-900/80 border border-orange-500/35 text-[10px] uppercase tracking-[0.2em] text-orange-200 transition-all shadow-md"
              >
                <span>✦</span>
                <span>Mars Museum</span>
              </button>
            </>
          )}

          {/* Direct switcher between Moon and Mars museums */}
          {viewMode === 'moon' && (
            <button
              onClick={handleEnterMarsMuseum}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-950/50 hover:bg-orange-900/60 border border-orange-500/25 text-[9px] uppercase tracking-[0.18em] text-orange-300 transition-all"
            >
              <span>✦</span>
              <span>Switch to Mars</span>
            </button>
          )}

          {viewMode === 'mars' && (
            <button
              onClick={handleEnterMoonMuseum}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-950/50 hover:bg-sky-900/60 border border-sky-400/25 text-[9px] uppercase tracking-[0.18em] text-sky-300 transition-all"
            >
              <span>✦</span>
              <span>Switch to Moon</span>
            </button>
          )}
        </div>
      </div>

      {/* Top-Right Navigation Pills & Controls */}
      <div className="absolute top-5 right-5 z-20 flex flex-col items-end gap-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          {viewMode === 'solar' && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded border border-white/10 hover:border-white/20 bg-black/40 backdrop-blur-sm text-white/70 hover:text-white transition-colors"
              title={isPlaying ? 'Pause revolution' : 'Resume revolution'}
            >
              {isPlaying ? '⏸ Pause' : '▶ Orbit'}
            </button>
          )}

          <button
            onClick={handleReset}
            className="text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded border border-white/10 hover:border-white/20 bg-black/40 backdrop-blur-sm text-white/70 hover:text-white transition-colors"
          >
            Reset View
          </button>
        </div>

        {/* Quick Planet Pills in Solar System mode */}
        {viewMode === 'solar' && (
          <div className="flex flex-wrap items-center justify-end gap-1.5 max-w-sm">
            <button
              onClick={() => setSelectedBody(null)}
              className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded transition-all ${
                selectedBody === null
                  ? 'bg-sky-500/30 text-sky-200 border border-sky-400/50'
                  : 'bg-black/30 hover:bg-white/10 text-white/60 hover:text-white border border-white/10'
              }`}
            >
              Overview
            </button>
            {CELESTIAL_BODIES.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBody(b)}
                className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded transition-all ${
                  selectedBody?.id === b.id
                    ? b.id === 'mars'
                      ? 'bg-orange-500/30 text-orange-200 border border-orange-400/50'
                      : 'bg-sky-500/30 text-sky-200 border border-sky-400/50'
                    : 'bg-black/30 hover:bg-white/10 text-white/60 hover:text-white border border-white/10'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info Panels */}
      {viewMode === 'solar' && selectedBody && (
        <PlanetInfoPanel
          body={selectedBody}
          onClose={() => setSelectedBody(null)}
          onEnterMoonMuseum={handleEnterMoonMuseum}
          onEnterMarsMuseum={handleEnterMarsMuseum}
        />
      )}

      {viewMode === 'moon' && selectedMachine && (
        <InfoPanel
          machine={selectedMachine}
          onClose={() => handleSelectMachine(null)}
        />
      )}

      {viewMode === 'mars' && selectedMarsMachine && (
        <MarsInfoPanel
          machine={selectedMarsMachine}
          onClose={() => handleSelectMarsMachine(null)}
        />
      )}

      {/* Bottom Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none text-center px-4">
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-light font-sans">
          {viewMode === 'solar' && 'Drag to explore · Select a planet · Discover Moon & Mars museum gateways'}
          {viewMode === 'moon' && 'Explore the Moon · Select a forgotten machine to discover its story'}
          {viewMode === 'mars' && 'Explore Mars · Select a rover or lander to discover its story'}
        </p>
      </div>

      {/* Main 3D Canvas */}
      <Canvas
        camera={{
          position: viewMode === 'solar' ? [0, 22, 36] : [0, 0, 5.5],
          fov: 45,
          near: 0.1,
          far: 200,
        }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        onPointerMissed={() => {
          if (viewMode === 'solar') setSelectedBody(null);
          else if (viewMode === 'moon') handleSelectMachine(null);
          else handleSelectMarsMachine(null);
        }}
      >
        {/* Render Solar System Mode */}
        {viewMode === 'solar' && (
          <Suspense fallback={null}>
            <SolarSystem
              selectedBody={selectedBody}
              onSelectBody={setSelectedBody}
              onEnterMoonMuseum={handleEnterMoonMuseum}
              onEnterMarsMuseum={handleEnterMarsMuseum}
              isPlaying={isPlaying}
              planetPositionsRef={planetPositionsRef}
            />
          </Suspense>
        )}

        {/* Render Moon Museum Mode */}
        {viewMode === 'moon' && (
          <>
            <ambientLight intensity={0.06} />
            <directionalLight position={[7, 3, 5]} intensity={2.4} color="#fff8f0" />
            <directionalLight position={[-6, -2, -4]} intensity={0.16} color="#8ab8e6" />

            <Suspense fallback={null}>
              <Moon
                groupRef={moonGroupRef}
                machines={LUNAR_MACHINES}
                selectedMachine={selectedMachine}
                hoveredId={hoveredId}
                onSelectMachine={handleSelectMachine}
                onHoverMachine={setHoveredId}
                autoRotate={autoRotateMoon}
              />
            </Suspense>

            <DynamicCallouts
              machines={LUNAR_MACHINES}
              moonGroupRef={moonGroupRef}
              hoveredId={hoveredId}
              onHover={setHoveredId}
              selectedMachine={selectedMachine}
              onSelect={handleSelectMachine}
            />
          </>
        )}

        {/* Render Mars Museum Mode */}
        {viewMode === 'mars' && (
          <>
            <ambientLight intensity={0.06} />
            <directionalLight position={[7, 3, 5]} intensity={2.4} color="#fff8f0" />
            <directionalLight position={[-6, -2, -4]} intensity={0.16} color="#e07a5f" />

            <Suspense fallback={null}>
              <Mars
                groupRef={marsGroupRef}
                machines={MARS_MACHINES}
                selectedMachine={selectedMarsMachine}
                hoveredId={hoveredMarsId}
                onSelectMachine={handleSelectMarsMachine}
                onHoverMachine={setHoveredMarsId}
                autoRotate={autoRotateMars}
              />
            </Suspense>

            <MarsCallouts
              machines={MARS_MACHINES}
              marsGroupRef={marsGroupRef}
              hoveredId={hoveredMarsId}
              onHover={setHoveredMarsId}
              selectedMachine={selectedMarsMachine}
              onSelect={handleSelectMarsMachine}
            />
          </>
        )}

        <CameraController
          viewMode={viewMode}
          selectedMachine={selectedMachine}
          selectedMarsMachine={selectedMarsMachine}
          selectedBody={selectedBody}
          moonGroupRef={moonGroupRef}
          marsGroupRef={marsGroupRef}
          controlsRef={controlsRef}
          planetPositionsRef={planetPositionsRef}
        />

        <OrbitControls
          ref={controlsRef}
          enablePan={viewMode === 'solar'}
          minDistance={viewMode === 'solar' ? 5 : MOON_RADIUS + 0.35}
          maxDistance={viewMode === 'solar' ? 65 : MOON_RADIUS + 8}
          rotateSpeed={0.5}
          zoomSpeed={0.7}
          enableDamping
          dampingFactor={0.08}
          onStart={() => {
            if (viewMode === 'moon') setAutoRotateMoon(false);
            if (viewMode === 'mars') setAutoRotateMars(false);
          }}
        />
      </Canvas>
    </div>
  );
}
