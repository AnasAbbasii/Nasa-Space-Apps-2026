'use client';

import { Suspense, useState, useRef, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import ThreeDotLoader from '@/components/ThreeDotLoader';
import { cursorStore } from '@/lib/cursor-store';

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
import SolarSidebar from './solar/SolarSidebar';

type ViewMode = 'solar' | 'moon' | 'mars';

function MoonArchiveLogo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white/85"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.5" strokeOpacity="0.9" />
      <path d="M12 3.5 A 8.5 8.5 0 0 0 12 20.5 A 6.5 8.5 0 0 1 12 3.5" strokeOpacity="0.45" />
      <circle cx="10" cy="10" r="0.75" fill="currentColor" fillOpacity="0.6" stroke="none" />
      <circle cx="14" cy="14" r="0.5" fill="currentColor" fillOpacity="0.5" stroke="none" />
    </svg>
  );
}

function MarsArchiveLogo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white/85"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.5" strokeOpacity="0.9" />
      <ellipse cx="12" cy="12" rx="8.5" ry="3.2" strokeOpacity="0.45" transform="rotate(-25 12 12)" />
      <circle cx="12" cy="12" r="1" fill="currentColor" fillOpacity="0.7" stroke="none" />
    </svg>
  );
}

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
        const livePos = planetPositionsRef.current.get(selectedBody.id) ?? new THREE.Vector3();
        const focusDist = selectedBody.id === 'saturn'
          ? selectedBody.planetRadius * 4.6
          : selectedBody.id === 'sun'
          ? selectedBody.planetRadius * 3.2
          : selectedBody.planetRadius * 3.4;

        const radial = livePos.lengthSq() > 0.01 ? livePos.clone().normalize() : new THREE.Vector3(0, 0, 1);
        const tangent = new THREE.Vector3(-radial.z, 0, radial.x);

        // Position camera to see sunlit quarter with slight elevation
        const camX = livePos.x + radial.x * (focusDist * 0.85) + tangent.x * (focusDist * 0.4);
        const camY = livePos.y + focusDist * 0.32;
        const camZ = livePos.z + radial.z * (focusDist * 0.85) + tangent.z * (focusDist * 0.4);
        targetCamPos.current.set(camX, camY, camZ);

        // Frame planet on the left by offsetting target towards the right
        const camToPlanet = livePos.clone().sub(targetCamPos.current).normalize();
        const camRight = new THREE.Vector3().crossVectors(camToPlanet, new THREE.Vector3(0, 1, 0)).normalize();
        const frameOffset = camRight.multiplyScalar(selectedBody.planetRadius * 0.65);
        targetLookAt.current.copy(livePos).add(frameOffset);
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
        const focusDist = selectedBody.id === 'saturn'
          ? selectedBody.planetRadius * 4.6
          : selectedBody.id === 'sun'
          ? selectedBody.planetRadius * 3.2
          : selectedBody.planetRadius * 3.4;

        const radial = livePos.lengthSq() > 0.01 ? livePos.clone().normalize() : new THREE.Vector3(0, 0, 1);
        const tangent = new THREE.Vector3(-radial.z, 0, radial.x);

        const camX = livePos.x + radial.x * (focusDist * 0.85) + tangent.x * (focusDist * 0.4);
        const camY = livePos.y + focusDist * 0.32;
        const camZ = livePos.z + radial.z * (focusDist * 0.85) + tangent.z * (focusDist * 0.4);
        const desiredPos = new THREE.Vector3(camX, camY, camZ);

        const camToPlanet = livePos.clone().sub(desiredPos).normalize();
        const camRight = new THREE.Vector3().crossVectors(camToPlanet, new THREE.Vector3(0, 1, 0)).normalize();
        const frameOffset = camRight.multiplyScalar(selectedBody.planetRadius * 0.65);
        const desiredTarget = livePos.clone().add(frameOffset);

        state.camera.position.lerp(desiredPos, 0.05);
        controlsRef.current.target.lerp(desiredTarget, 0.05);
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

function FrameReadyReporter({
  viewMode,
  onReady,
}: {
  viewMode: ViewMode;
  onReady: () => void;
}) {
  const currentModeRef = useRef(viewMode);
  const frameCountRef = useRef(0);

  useEffect(() => {
    if (currentModeRef.current !== viewMode) {
      currentModeRef.current = viewMode;
      frameCountRef.current = 0;
    }
  }, [viewMode]);

  useFrame(() => {
    if (frameCountRef.current < 2) {
      frameCountRef.current += 1;
      if (frameCountRef.current === 2) {
        onReady();
      }
    }
  });

  return null;
}

function ExperienceLoader({ isBusy }: { isBusy: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout>;
    let safetyTimer: ReturnType<typeof setTimeout>;

    if (isBusy) {
      // 75ms debounce prevents flickering on instant cache hits
      showTimer = setTimeout(() => {
        setVisible(true);
      }, 75);

      // Safety timeout: never allow loader to remain stuck indefinitely
      safetyTimer = setTimeout(() => {
        setVisible(false);
      }, 8000);
    } else {
      setVisible(false);
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(safetyTimer);
    };
  }, [isBusy]);

  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none select-none transition-opacity duration-300"
      aria-hidden="true"
    >
      <ThreeDotLoader size="md" />
    </div>
  );
}

export default function Experience() {
  // Master View Mode: 'solar' | 'moon' | 'mars'
  const [viewMode, setViewMode] = useState<ViewMode>('solar');
  const [modeReady, setModeReady] = useState(false);
  const { active, errors, progress } = useProgress();
  const isBusy = (!modeReady || active) && !(errors.length > 0 && progress === 100);

  // Solar system state
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    setModeReady(false);
    setViewMode('moon');
  }, []);

  // Switch to Mars Museum
  const handleEnterMarsMuseum = useCallback(() => {
    setSelectedBody(null);
    setSelectedMarsMachine(null);
    setHoveredMarsId(null);
    setModeReady(false);
    setViewMode('mars');
  }, []);

  // Return to Solar System
  const handleReturnToSolar = useCallback(() => {
    setSelectedMachine(null);
    setSelectedMarsMachine(null);
    setHoveredId(null);
    setHoveredMarsId(null);
    setSelectedBody(null);
    setModeReady(false);
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
      {/* Premium Three-Dot Scene & Asset Loading Indicator */}
      <ExperienceLoader isBusy={isBusy} />

      {/* Solar System Mode: Truly Transparent Liquid Glass Collapsible Sidebar & Museum Shortcuts */}
      {viewMode === 'solar' && (
        <>
          <SolarSidebar
            isOpen={sidebarOpen}
            onToggle={setSidebarOpen}
            selectedBody={selectedBody}
            onSelectBody={setSelectedBody}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onReset={handleReset}
          />

          {/* Top-Right Museum Navigation Buttons */}
          <nav
            aria-label="Museum Navigation"
            className="fixed z-20 pointer-events-auto flex items-center gap-2 sm:gap-3 select-none"
            style={{
              top: 'max(1.25rem, env(safe-area-inset-top, 1.25rem))',
              right: 'max(1.25rem, env(safe-area-inset-right, 1.25rem))',
            }}
          >
            <button
              type="button"
              onClick={handleEnterMoonMuseum}
              aria-label="Explore Moon Museum"
              className="group inline-flex items-center justify-center h-[38px] px-4 rounded-full text-xs sm:text-[13px] tracking-[0.16em] uppercase font-medium text-white/85 hover:text-white transition-all duration-200 ease-out hover:scale-[1.03] active:scale-[0.97] will-change-transform border-0 outline-none cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
              style={{
                background: 'rgba(0, 0, 0, 0.28)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
              }}
            >
              <span>Moon Museum</span>
            </button>

            <button
              type="button"
              onClick={handleEnterMarsMuseum}
              aria-label="Explore Mars Museum"
              className="group inline-flex items-center justify-center h-[38px] px-4 rounded-full text-xs sm:text-[13px] tracking-[0.16em] uppercase font-medium text-white/85 hover:text-white transition-all duration-200 ease-out hover:scale-[1.03] active:scale-[0.97] will-change-transform border-0 outline-none cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
              style={{
                background: 'rgba(0, 0, 0, 0.28)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
              }}
            >
              <span>Mars Museum</span>
            </button>
          </nav>
        </>
      )}

      {/* Moon & Mars Modes: Minimal Left-Side Header */}
      {viewMode !== 'solar' && (
        <header className="absolute top-6 left-6 z-20 pointer-events-auto flex flex-col gap-1.5 select-none">
          {/* Museum Identity */}
          <div className="flex items-center gap-2.5">
            {viewMode === 'moon' ? <MoonArchiveLogo /> : <MarsArchiveLogo />}
            <span
              style={{
                fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
                fontWeight: 500,
              }}
              className="text-sm tracking-[0.2em] uppercase text-white/95 leading-none"
            >
              {viewMode === 'moon' ? 'Moon Archives' : 'Mars Archives'}
            </span>
          </div>

          {/* Secondary Return Control */}
          <div>
            <button
              onClick={handleReturnToSolar}
              className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-white/50 hover:text-white transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.97] origin-left will-change-transform bg-transparent border-0 outline-none p-0 cursor-pointer group mt-0.5"
              aria-label="Return to Solar System"
            >
              <span className="transition-transform duration-200 ease-out group-hover:-translate-x-1 text-white/40 group-hover:text-white">
                ←
              </span>
              <span className="font-light">
                Return to Solar System
              </span>
            </button>
          </div>
        </header>
      )}

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

      {/* Bottom Hint (Only in Solar System Mode) */}
      {viewMode === 'solar' && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none text-center px-4">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-light font-sans">
            Drag to explore · Select a planet · Discover Moon & Mars museum gateways
          </p>
        </div>
      )}

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
          enablePan={viewMode === 'solar' && !selectedBody}
          minDistance={viewMode === 'solar' ? (selectedBody ? selectedBody.planetRadius * 1.3 : 3) : MOON_RADIUS + 0.35}
          maxDistance={viewMode === 'solar' ? 70 : MOON_RADIUS + 8}
          rotateSpeed={0.5}
          zoomSpeed={0.7}
          enableDamping
          dampingFactor={0.08}
          onStart={() => {
            cursorStore.set('grabbing');
            if (viewMode === 'moon') setAutoRotateMoon(false);
            if (viewMode === 'mars') setAutoRotateMars(false);
          }}
          onEnd={() => {
            cursorStore.set('default');
          }}
        />
        <FrameReadyReporter viewMode={viewMode} onReady={() => setModeReady(true)} />
      </Canvas>
    </div>
  );
}
