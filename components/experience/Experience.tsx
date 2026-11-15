'use client';

import { Suspense, useState, useRef, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import ThreeDotLoader from '@/components/ThreeDotLoader';
import { cursorStore } from '@/lib/cursor-store';

// Moon Museum Components & Data
import type { LunarMachine } from '@/lib/lunar-machines';
import InfoPanel from './InfoPanel';

// Mars Museum Components & Data
import type { MarsMachine } from '@/lib/mars-machines';
import MarsInfoPanel from './mars/MarsInfoPanel';

// Solar System Components & Data
import type { CelestialBody } from '@/lib/solar-system';
import SolarSystem from './solar/SolarSystem';
import PlanetInfoPanel from './solar/PlanetInfoPanel';
import SolarSidebar from './solar/SolarSidebar';

type MuseumMode = 'moon' | 'mars' | null;

// Reusable scratch vectors to eliminate per-frame GC allocations
const _targetCam = new THREE.Vector3();
const _camToPlanet = new THREE.Vector3();
const _camRight = new THREE.Vector3();
const _desiredTarget = new THREE.Vector3();
const _upVec = new THREE.Vector3(0, 1, 0);
const _radial = new THREE.Vector3();
const _tangent = new THREE.Vector3();
const _toSun = new THREE.Vector3();
const _desiredPos = new THREE.Vector3();

interface CameraControllerProps {
  activeMuseum: MuseumMode;
  selectedBody: CelestialBody | null;
  selectedMachine: LunarMachine | null;
  selectedMarsMachine: MarsMachine | null;
  controlsRef: React.RefObject<React.ComponentRef<typeof OrbitControls> | null>;
  planetPositionsRef: React.RefObject<Map<string, THREE.Vector3>>;
}

function CameraController({
  activeMuseum,
  selectedBody,
  selectedMachine,
  selectedMarsMachine,
  controlsRef,
  planetPositionsRef,
}: CameraControllerProps) {
  const isTransitioningRef = useRef(false);
  const targetCamPos = useRef(new THREE.Vector3(0, 22, 36));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Handle camera targets on activeMuseum / selection changes
  useEffect(() => {
    if (activeMuseum === 'moon') {
      const livePos = planetPositionsRef.current.get('moon') ?? new THREE.Vector3(8.8 + 1.45, 0, 0);
      const focusDist = selectedMachine ? 0.20 * 2.8 : 0.20 * 3.4;
      const targetCam = new THREE.Vector3(
        livePos.x,
        livePos.y + (selectedMachine ? focusDist * 0.18 : focusDist * 0.22),
        livePos.z + focusDist * 0.95,
      );
      targetCamPos.current.copy(targetCam);

      // Offset target slightly right to position planet center-left (approx 48-52% of viewport width)
      const camToPlanet = livePos.clone().sub(targetCam).normalize();
      const camRight = new THREE.Vector3().crossVectors(camToPlanet, new THREE.Vector3(0, 1, 0)).normalize();
      const defaultOffset = 0.20 * 0.45;
      const selectedOffset = 0.20 * 0.70;
      const frameOffset = camRight.multiplyScalar(selectedMachine ? selectedOffset : defaultOffset);
      targetLookAt.current.copy(livePos).add(frameOffset);
      isTransitioningRef.current = true;
    } else if (activeMuseum === 'mars') {
      const livePos = planetPositionsRef.current.get('mars') ?? new THREE.Vector3(11.4, 0, 0);
      const focusDist = selectedMarsMachine ? 0.42 * 2.8 : 0.42 * 3.4;
      const targetCam = new THREE.Vector3(
        livePos.x,
        livePos.y + (selectedMarsMachine ? focusDist * 0.18 : focusDist * 0.22),
        livePos.z + focusDist * 0.95,
      );
      targetCamPos.current.copy(targetCam);

      // Offset target slightly right to position planet center-left (approx 48-52% of viewport width)
      const camToPlanet = livePos.clone().sub(targetCam).normalize();
      const camRight = new THREE.Vector3().crossVectors(camToPlanet, new THREE.Vector3(0, 1, 0)).normalize();
      const defaultOffset = 0.42 * 0.45;
      const selectedOffset = 0.42 * 0.70;
      const frameOffset = camRight.multiplyScalar(selectedMarsMachine ? selectedOffset : defaultOffset);
      targetLookAt.current.copy(livePos).add(frameOffset);
      isTransitioningRef.current = true;
    } else if (selectedBody && planetPositionsRef.current) {
      const livePos = planetPositionsRef.current.get(selectedBody.id) ?? new THREE.Vector3();
      const focusDist = selectedBody.id === 'saturn'
        ? selectedBody.planetRadius * 4.6
        : selectedBody.id === 'sun'
        ? selectedBody.planetRadius * 3.2
        : selectedBody.planetRadius * 3.4;

      const radial = livePos.lengthSq() > 0.01 ? livePos.clone().normalize() : new THREE.Vector3(0, 0, 1);
      const tangent = new THREE.Vector3(-radial.z, 0, radial.x);
      const toSun = radial.clone().negate();

      // Position camera to see sunlit quarter with slight elevation
      const camX = livePos.x + toSun.x * (focusDist * 0.65) + tangent.x * (focusDist * 0.65);
      const camY = livePos.y + focusDist * 0.28;
      const camZ = livePos.z + toSun.z * (focusDist * 0.65) + tangent.z * (focusDist * 0.65);
      targetCamPos.current.set(camX, camY, camZ);

      // Frame planet on the left by offsetting target towards the right
      const camToPlanet = livePos.clone().sub(targetCamPos.current).normalize();
      const camRight = new THREE.Vector3().crossVectors(camToPlanet, new THREE.Vector3(0, 1, 0)).normalize();
      const frameOffset = camRight.multiplyScalar(selectedBody.planetRadius * 0.65);
      targetLookAt.current.copy(livePos).add(frameOffset);
      isTransitioningRef.current = true;
    } else {
      // Solar System overview
      targetCamPos.current.set(0, 22, 36);
      targetLookAt.current.set(0, 0, 0);
      isTransitioningRef.current = true;
    }
  }, [activeMuseum, selectedBody, selectedMachine, selectedMarsMachine, planetPositionsRef]);

  useFrame((state) => {
    if (!controlsRef.current) return;

    // Follow moving Moon in Moon Museum mode
    if (activeMuseum === 'moon' && planetPositionsRef.current) {
      const livePos = planetPositionsRef.current.get('moon');
      if (livePos) {
        const focusDist = selectedMachine ? 0.20 * 2.8 : 0.20 * 3.4;
        _targetCam.set(
          livePos.x,
          livePos.y + (selectedMachine ? focusDist * 0.18 : focusDist * 0.22),
          livePos.z + focusDist * 0.95,
        );
        _camToPlanet.subVectors(livePos, _targetCam).normalize();
        _camRight.crossVectors(_camToPlanet, _upVec).normalize();
        const defaultOffset = 0.20 * 0.45;
        const selectedOffset = 0.20 * 0.70;
        const frameOffset = selectedMachine ? selectedOffset : defaultOffset;
        _desiredTarget.copy(livePos).addScaledVector(_camRight, frameOffset);

        state.camera.position.lerp(_targetCam, 0.05);
        controlsRef.current.target.lerp(_desiredTarget, 0.05);
        controlsRef.current.update();
        return;
      }
    }

    // Follow moving Mars in Mars Museum mode
    if (activeMuseum === 'mars' && planetPositionsRef.current) {
      const livePos = planetPositionsRef.current.get('mars');
      if (livePos) {
        const focusDist = selectedMarsMachine ? 0.42 * 2.8 : 0.42 * 3.4;
        _targetCam.set(
          livePos.x,
          livePos.y + (selectedMarsMachine ? focusDist * 0.18 : focusDist * 0.22),
          livePos.z + focusDist * 0.95,
        );
        _camToPlanet.subVectors(livePos, _targetCam).normalize();
        _camRight.crossVectors(_camToPlanet, _upVec).normalize();
        const defaultOffset = 0.42 * 0.45;
        const selectedOffset = 0.42 * 0.70;
        const frameOffset = selectedMarsMachine ? selectedOffset : defaultOffset;
        _desiredTarget.copy(livePos).addScaledVector(_camRight, frameOffset);

        state.camera.position.lerp(_targetCam, 0.05);
        controlsRef.current.target.lerp(_desiredTarget, 0.05);
        controlsRef.current.update();
        return;
      }
    }

    // Follow moving planet dynamically if in ordinary solar view and body is selected
    if (!activeMuseum && selectedBody && planetPositionsRef.current) {
      const livePos = planetPositionsRef.current.get(selectedBody.id);
      if (livePos) {
        const focusDist = selectedBody.id === 'saturn'
          ? selectedBody.planetRadius * 4.6
          : selectedBody.id === 'sun'
          ? selectedBody.planetRadius * 3.2
          : selectedBody.planetRadius * 3.4;

        if (livePos.lengthSq() > 0.01) {
          _radial.copy(livePos).normalize();
        } else {
          _radial.set(0, 0, 1);
        }
        _tangent.set(-_radial.z, 0, _radial.x);
        _toSun.copy(_radial).negate();

        const camX = livePos.x + _toSun.x * (focusDist * 0.65) + _tangent.x * (focusDist * 0.65);
        const camY = livePos.y + focusDist * 0.28;
        const camZ = livePos.z + _toSun.z * (focusDist * 0.65) + _tangent.z * (focusDist * 0.65);
        _desiredPos.set(camX, camY, camZ);

        _camToPlanet.subVectors(livePos, _desiredPos).normalize();
        _camRight.crossVectors(_camToPlanet, _upVec).normalize();
        _desiredTarget.copy(livePos).addScaledVector(_camRight, selectedBody.planetRadius * 0.65);

        state.camera.position.lerp(_desiredPos, 0.05);
        controlsRef.current.target.lerp(_desiredTarget, 0.05);
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
  onReady,
}: {
  onReady: () => void;
}) {
  const frameCountRef = useRef(0);

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
  // Master Museum Mode: 'moon' | 'mars' | null
  const [activeMuseum, setActiveMuseum] = useState<MuseumMode>(null);
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

  // Mars museum state
  const [selectedMarsMachine, setSelectedMarsMachine] = useState<MarsMachine | null>(null);
  const [hoveredMarsId, setHoveredMarsId] = useState<string | null>(null);

  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null);

  // Switch to Moon Museum: zooms to the existing Moon in Solar System
  const handleEnterMoonMuseum = useCallback(() => {
    setSelectedBody(null);
    setSelectedMachine(null);
    setHoveredId(null);
    setActiveMuseum('moon');
  }, []);

  // Switch to Mars Museum: zooms to the existing Mars in Solar System
  const handleEnterMarsMuseum = useCallback(() => {
    setSelectedBody(null);
    setSelectedMarsMachine(null);
    setHoveredMarsId(null);
    setActiveMuseum('mars');
  }, []);

  const handleSelectBody = useCallback((body: CelestialBody | null) => {
    if (body?.id === 'mars') {
      handleEnterMarsMuseum();
    } else {
      setSelectedBody(body);
    }
  }, [handleEnterMarsMuseum]);

  // Return to full Solar System overview
  const handleReturnToSolar = useCallback(() => {
    setActiveMuseum(null);
    setSelectedBody(null);
    setSelectedMachine(null);
    setSelectedMarsMachine(null);
    setHoveredId(null);
    setHoveredMarsId(null);
  }, []);

  const handleReset = useCallback(() => {
    if (activeMuseum === 'moon') {
      setSelectedMachine(null);
      setHoveredId(null);
    } else if (activeMuseum === 'mars') {
      setSelectedMarsMachine(null);
      setHoveredMarsId(null);
    } else {
      setSelectedBody(null);
    }
  }, [activeMuseum]);

  return (
    <div className="relative w-full h-full select-none">
      {/* Premium Three-Dot Scene & Asset Loading Indicator */}
      <ExperienceLoader isBusy={isBusy} />

      {/* Solar System Mode Controls: Truly Transparent Liquid Glass Collapsible Sidebar & Museum Shortcuts */}
      {activeMuseum === null && (
        <>
          <SolarSidebar
            isOpen={sidebarOpen}
            onToggle={setSidebarOpen}
            selectedBody={selectedBody}
            onSelectBody={handleSelectBody}
            onEnterMarsMuseum={handleEnterMarsMuseum}
            onEnterMoonMuseum={handleEnterMoonMuseum}
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
              aria-label="Explore Moon"
              className="group inline-flex items-center justify-center h-[38px] px-4 rounded-full text-xs sm:text-[13px] tracking-[0.16em] uppercase font-medium text-white/85 hover:text-white transition-all duration-200 ease-out hover:scale-[1.03] active:scale-[0.97] will-change-transform border-0 outline-none cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
              style={{
                background: 'rgba(0, 0, 0, 0.28)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
              }}
            >
              <span>Moon</span>
            </button>

            <button
              type="button"
              onClick={handleEnterMarsMuseum}
              aria-label="Explore Mars"
              className="group inline-flex items-center justify-center h-[38px] px-4 rounded-full text-xs sm:text-[13px] tracking-[0.16em] uppercase font-medium text-white/85 hover:text-white transition-all duration-200 ease-out hover:scale-[1.03] active:scale-[0.97] will-change-transform border-0 outline-none cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
              style={{
                background: 'rgba(0, 0, 0, 0.28)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
              }}
            >
              <span>Mars</span>
            </button>
          </nav>
        </>
      )}

      {/* Moon & Mars Museum Header: Centered Title & Left Return Button */}
      {activeMuseum !== null && (
        <header className="fixed top-0 left-0 right-0 z-20 pointer-events-none select-none">
          {/* Upper-Left: Return Button (Text Only, Transparent, No Arrow, No Border) */}
          <div
            className="absolute pointer-events-auto"
            style={{
              top: 'max(1.25rem, env(safe-area-inset-top, 1.25rem))',
              left: 'max(1.25rem, env(safe-area-inset-left, 1.25rem))',
            }}
          >
            <button
              type="button"
              onClick={handleReturnToSolar}
              className="text-[11px] sm:text-xs tracking-[0.16em] uppercase font-normal text-white/60 hover:text-white transition-opacity duration-200 ease-out bg-transparent border-0 outline-none p-0 cursor-pointer"
              style={{
                fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
              }}
              aria-label="Return to Solar System"
            >
              Return to Solar System
            </button>
          </div>

          {/* Centered Museum Title (Mathematically Centered Relative to Entire Viewport) */}
          <div
            className="w-full flex justify-center pointer-events-none"
            style={{
              paddingTop: 'max(1.25rem, env(safe-area-inset-top, 1.25rem))',
            }}
          >
            <h1
              className="text-xs sm:text-[13px] tracking-[0.22em] uppercase font-medium text-white select-none m-0 p-0 leading-none"
              style={{
                fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
                fontWeight: 500,
              }}
            >
              {activeMuseum === 'moon' ? 'MOON MUSEUM' : 'MARS MUSEUM'}
            </h1>
          </div>
        </header>
      )}

      {/* Info Panels */}
      {activeMuseum === null && selectedBody && (
        <PlanetInfoPanel
          body={selectedBody}
          onClose={() => setSelectedBody(null)}
          onEnterMoonMuseum={handleEnterMoonMuseum}
          onEnterMarsMuseum={handleEnterMarsMuseum}
        />
      )}

      {activeMuseum === 'moon' && selectedMachine && (
        <InfoPanel
          machine={selectedMachine}
          onClose={() => setSelectedMachine(null)}
        />
      )}

      {activeMuseum === 'mars' && selectedMarsMachine && (
        <MarsInfoPanel
          machine={selectedMarsMachine}
          onClose={() => setSelectedMarsMachine(null)}
        />
      )}

      {/* Bottom Hint (Only in Solar System Overview Mode) */}
      {activeMuseum === null && !selectedBody && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none text-center px-4">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-light font-sans">
            Drag to explore · Select a planet · Discover Moon & Mars museum gateways
          </p>
        </div>
      )}

      {/* Main 3D Canvas - Unified Continuous Solar System Experience */}
      <Canvas
        dpr={[1, 2]}
        camera={{
          position: [0, 22, 36],
          fov: 45,
          near: 0.1,
          far: 200,
        }}
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          alpha: true,
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        onPointerMissed={() => {
          if (activeMuseum === 'moon') setSelectedMachine(null);
          else if (activeMuseum === 'mars') setSelectedMarsMachine(null);
          else setSelectedBody(null);
        }}
      >
        <Suspense fallback={null}>
          <SolarSystem
            selectedBody={selectedBody}
            onSelectBody={handleSelectBody}
            activeMuseum={activeMuseum}
            onEnterMoonMuseum={handleEnterMoonMuseum}
            onEnterMarsMuseum={handleEnterMarsMuseum}
            isPlaying={isPlaying}
            planetPositionsRef={planetPositionsRef}
            selectedMachine={selectedMachine}
            hoveredId={hoveredId}
            onSelectMachine={setSelectedMachine}
            onHoverMachine={setHoveredId}
            selectedMarsMachine={selectedMarsMachine}
            hoveredMarsId={hoveredMarsId}
            onSelectMarsMachine={setSelectedMarsMachine}
            onHoverMarsMachine={setHoveredMarsId}
          />
        </Suspense>

        <CameraController
          activeMuseum={activeMuseum}
          selectedBody={selectedBody}
          selectedMachine={selectedMachine}
          selectedMarsMachine={selectedMarsMachine}
          controlsRef={controlsRef}
          planetPositionsRef={planetPositionsRef}
        />

        <OrbitControls
          ref={controlsRef}
          enablePan={!selectedBody && !activeMuseum}
          minDistance={activeMuseum === 'moon' ? 0.35 : activeMuseum === 'mars' ? 0.6 : selectedBody ? selectedBody.planetRadius * 1.3 : 3}
          maxDistance={70}
          rotateSpeed={0.5}
          zoomSpeed={0.7}
          enableDamping
          dampingFactor={0.08}
          onStart={() => {
            cursorStore.set('grabbing');
          }}
          onEnd={() => {
            cursorStore.set('default');
          }}
        />
        <FrameReadyReporter onReady={() => setModeReady(true)} />
      </Canvas>
    </div>
  );
}
