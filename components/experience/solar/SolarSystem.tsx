'use client';

import React, { useRef, useMemo, Suspense, Component, ReactNode, useState, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { CELESTIAL_BODIES } from '@/lib/solar-system';
import type { CelestialBody } from '@/lib/solar-system';
import { cursorStore } from '@/lib/cursor-store';
import PlanetOrbit from './PlanetOrbit';
import { LUNAR_MACHINES } from '@/lib/lunar-machines';
import type { LunarMachine } from '@/lib/lunar-machines';
import { MARS_MACHINES } from '@/lib/mars-machines';
import type { MarsMachine } from '@/lib/mars-machines';
import LunarMachineObject from '../LunarMachineObject';
import MarsMachineObject from '../mars/MarsMachineObject';
import DynamicCallouts from '../DynamicCallouts';
import MarsCallouts from '../mars/MarsCallouts';

interface Props {
  fallback?: ReactNode;
  children: ReactNode;
}
interface State {
  hasError: boolean;
}
class AssetErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

interface SolarSystemProps {
  selectedBody: CelestialBody | null;
  onSelectBody: (body: CelestialBody | null) => void;
  activeMuseum: 'moon' | 'mars' | null;
  onEnterMoonMuseum: () => void;
  onEnterMarsMuseum: () => void;
  isPlaying: boolean;
  planetPositionsRef: React.RefObject<Map<string, THREE.Vector3>>;
  selectedMachine: LunarMachine | null;
  hoveredId: string | null;
  onSelectMachine: (machine: LunarMachine | null) => void;
  onHoverMachine: (id: string | null) => void;
  selectedMarsMachine: MarsMachine | null;
  hoveredMarsId: string | null;
  onSelectMarsMachine: (machine: MarsMachine | null) => void;
  onHoverMarsMachine: (id: string | null) => void;
}

// Model renderer for FBX planetary models
function FbxPlanetModel({
  fbxPath,
  texturePath,
  radius,
  emissive = false,
}: {
  fbxPath: string;
  texturePath?: string;
  radius: number;
  emissive?: boolean;
}) {
  const fbx = useLoader(FBXLoader, fbxPath);
  const texture = texturePath ? useTexture(texturePath) : null;
  if (texture) texture.colorSpace = THREE.SRGBColorSpace;

  const model = useMemo(() => {
    const clone = fbx.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = maxDim > 0 ? (radius * 2) / maxDim : 1;
    clone.scale.setScalar(scaleFactor);

    // Center model at origin
    const scaledBox = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    scaledBox.getCenter(center);
    clone.position.sub(center);

    if (texture) {
      clone.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          // Bypass raycasting on high-poly meshes to protect 60fps interaction loop
          mesh.raycast = () => {};
          if (emissive) {
            mesh.material = new THREE.MeshBasicMaterial({ map: texture });
          } else {
            mesh.material = new THREE.MeshStandardMaterial({
              map: texture,
              roughness: 0.85,
              metalness: 0.05,
            });
          }
        }
      });
    }
    return clone;
  }, [fbx, texture, radius, emissive]);

  // Clean up materials on unmount to prevent GPU leaks
  useEffect(() => {
    return () => {
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else if (mesh.material) {
            mesh.material.dispose();
          }
        }
      });
    };
  }, [model]);

  return <primitive object={model} />;
}

// Fallback sphere when model is loading or streaming
function FallbackSphere({
  radius,
  color,
  texturePath,
  emissive = false,
}: {
  radius: number;
  color: string;
  texturePath?: string | null;
  emissive?: boolean;
}) {
  const texture = texturePath ? useTexture(texturePath) : null;
  if (texture) texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh raycast={() => null}>
      <sphereGeometry args={[radius, 48, 48]} />
      {emissive ? (
        <meshBasicMaterial map={texture ?? undefined} color={texture ? '#ffffff' : color} />
      ) : (
        <meshStandardMaterial
          map={texture ?? undefined}
          color={texture ? '#ffffff' : color}
          roughness={0.85}
          metalness={0.05}
        />
      )}
    </mesh>
  );
}

// Saturn's authentic ring disc
function SaturnRings({ innerRadius = 1.3, outerRadius = 2.2 }: { innerRadius?: number; outerRadius?: number }) {
  const ringTexture = useTexture('/3dmodels/saturn/textures/Uv1_saturn2_diff.png');
  ringTexture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
      <ringGeometry args={[innerRadius, outerRadius, 64]} />
      <meshStandardMaterial
        map={ringTexture}
        transparent
        opacity={0.88}
        roughness={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Earth's orbiting Moon gateway - independent interactive object with museum annotations
interface OrbitingMoonProps {
  activeMuseum: 'moon' | 'mars' | null;
  onEnterMoonMuseum: () => void;
  planetPositionsRef: React.RefObject<Map<string, THREE.Vector3>>;
  selectedMachine: LunarMachine | null;
  hoveredId: string | null;
  onSelectMachine: (machine: LunarMachine | null) => void;
  onHoverMachine: (id: string | null) => void;
}

function OrbitingMoon({
  activeMuseum,
  onEnterMoonMuseum,
  planetPositionsRef,
  selectedMachine,
  hoveredId,
  onSelectMachine,
  onHoverMachine,
}: OrbitingMoonProps) {
  const moonOrbitRef = useRef<THREE.Group>(null);
  const moonMeshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const moonHoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { gl } = useThree();
  const moonTexture = useTexture('/textures/moon_2k.jpg');
  moonTexture.colorSpace = THREE.SRGBColorSpace;
  const moonRadius = 0.20;
  const isMoonMuseum = activeMuseum === 'moon';

  const handleMoonPointerOver = useCallback((e: any) => {
    e.stopPropagation();
    if (moonHoverTimeoutRef.current) {
      clearTimeout(moonHoverTimeoutRef.current);
      moonHoverTimeoutRef.current = null;
    }
    if (!isMoonMuseum) {
      setIsHovered(true);
      cursorStore.set('focus');
    }
  }, [isMoonMuseum]);

  const handleMoonPointerOut = useCallback((e: any) => {
    e.stopPropagation();
    if (moonHoverTimeoutRef.current) {
      clearTimeout(moonHoverTimeoutRef.current);
    }
    moonHoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      cursorStore.set('default');
    }, 40);
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleLeave = () => {
      if (moonHoverTimeoutRef.current) {
        clearTimeout(moonHoverTimeoutRef.current);
      }
      setIsHovered(false);
    };
    const handleBlur = () => {
      if (moonHoverTimeoutRef.current) {
        clearTimeout(moonHoverTimeoutRef.current);
      }
      setIsHovered(false);
    };

    canvas.addEventListener('pointerleave', handleLeave);
    window.addEventListener('blur', handleBlur);

    return () => {
      canvas.removeEventListener('pointerleave', handleLeave);
      window.removeEventListener('blur', handleBlur);
      if (moonHoverTimeoutRef.current) {
        clearTimeout(moonHoverTimeoutRef.current);
      }
    };
  }, [gl]);

  useFrame((_state, delta) => {
    // Orbital revolution around Earth
    if (moonOrbitRef.current) {
      if (!isMoonMuseum || !selectedMachine) {
        moonOrbitRef.current.rotation.y += delta * 0.12;
      }
    }
    // Track Moon world position for camera controller
    if (moonMeshRef.current && planetPositionsRef.current) {
      let wp = planetPositionsRef.current.get('moon');
      if (!wp) {
        wp = new THREE.Vector3();
        planetPositionsRef.current.set('moon', wp);
      }
      moonMeshRef.current.getWorldPosition(wp);
    }
  });

  return (
    <group ref={moonOrbitRef}>
      <group position={[1.45, 0.05, 0]}>
        <mesh
          ref={moonMeshRef}
          onClick={(e) => {
            e.stopPropagation();
            if (isMoonMuseum) {
              onSelectMachine(null);
            } else {
              onEnterMoonMuseum();
            }
          }}
          onPointerOver={handleMoonPointerOver}
          onPointerOut={handleMoonPointerOut}
        >
          <sphereGeometry args={[moonRadius, 64, 64]} />
          <meshStandardMaterial
            map={moonTexture}
            roughness={0.92}
            metalness={0.02}
            emissive="#ffffff"
            emissiveIntensity={isHovered && !isMoonMuseum ? 0.25 : 0}
          />
        </mesh>

        {/* Dynamic Hover Floating Name Label (Hover only) */}
        {!isMoonMuseum && (
          <Html
            position={[0, moonRadius + 0.18, 0]}
            center
            distanceFactor={28}
          >
            <div
              className={`select-none pointer-events-none flex flex-col items-center transition-all duration-300 ease-out ${
                isHovered
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-1'
              }`}
              style={{
                willChange: 'opacity, transform',
                background: 'transparent',
                border: 'none',
                padding: 0,
                margin: 0,
              }}
            >
              <span
                style={{
                  fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
                  fontSize: '11px',
                  fontWeight: 400,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.95), 0 2px 8px rgba(0, 0, 0, 0.85)',
                  opacity: 0.95,
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Moon
              </span>
            </div>
          </Html>
        )}

        {/* Lunar Museum Overlay - Abandoned Machines and Callouts */}
        {isMoonMuseum && (
          <group>
            {/* Lunar machines positioned at verified geographic coordinates on the surface */}
            {LUNAR_MACHINES.map((m) => (
              <LunarMachineObject
                key={m.id}
                machine={m}
                radius={moonRadius}
                isActive={m.id === hoveredId || m.id === selectedMachine?.id}
                onClick={onSelectMachine}
                onHover={onHoverMachine}
              />
            ))}

            <DynamicCallouts
              machines={LUNAR_MACHINES}
              radius={moonRadius}
              distanceFactor={moonRadius * 3.4}
              hoveredId={hoveredId}
              onHover={onHoverMachine}
              selectedMachine={selectedMachine}
              onSelect={onSelectMachine}
            />
          </group>
        )}
      </group>
    </group>
  );
}

// Dynamic lighting controller that provides balanced illumination during planet focus
// Reusable scratch vectors for focus lighting calculations
const _lightSunDir = new THREE.Vector3();
const _lightKeyPos = new THREE.Vector3();
const _lightFillPos = new THREE.Vector3();

function DynamicFocusLighting({
  selectedBody,
  activeMuseum,
  planetPositionsRef,
}: {
  selectedBody: CelestialBody | null;
  activeMuseum: 'moon' | 'mars' | null;
  planetPositionsRef: React.RefObject<Map<string, THREE.Vector3>>;
}) {
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    const isFocused = !!selectedBody || !!activeMuseum;
    const isSun = selectedBody?.id === 'sun';

    // 1. Ambient Light Adjustment
    const targetAmbient = isFocused ? 0.30 : 0.08;
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(
        ambientLightRef.current.intensity,
        targetAmbient,
        0.06,
      );
    }

    // 2. Focused Planet Key & Fill Lights (zero allocation in loop)
    if (isFocused && !isSun) {
      const targetId = activeMuseum === 'moon' ? 'moon' : activeMuseum === 'mars' ? 'mars' : selectedBody?.id;
      const planetPos = targetId && planetPositionsRef.current ? planetPositionsRef.current.get(targetId) : null;

      if (planetPos && keyLightRef.current && fillLightRef.current) {
        if (planetPos.lengthSq() > 0.01) {
          _lightSunDir.copy(planetPos).normalize();
        } else {
          _lightSunDir.set(0, 0, 1);
        }
        _lightKeyPos.copy(planetPos).addScaledVector(_lightSunDir, -4.0);
        _lightKeyPos.y += 1.5;
        keyLightRef.current.position.copy(_lightKeyPos);
        keyLightRef.current.target.position.copy(planetPos);
        keyLightRef.current.target.updateMatrixWorld();
        keyLightRef.current.intensity = THREE.MathUtils.lerp(keyLightRef.current.intensity, 2.4, 0.08);

        _lightFillPos.set(
          planetPos.x + _lightSunDir.z * 3.5,
          planetPos.y + 2.0,
          planetPos.z - _lightSunDir.x * 3.5,
        );
        fillLightRef.current.position.copy(_lightFillPos);
        fillLightRef.current.target.position.copy(planetPos);
        fillLightRef.current.target.updateMatrixWorld();
        fillLightRef.current.intensity = THREE.MathUtils.lerp(fillLightRef.current.intensity, 0.70, 0.08);
      }
    } else {
      // Fade out focus key and fill lights when in overview or focusing the Sun
      if (keyLightRef.current) {
        keyLightRef.current.intensity = THREE.MathUtils.lerp(keyLightRef.current.intensity, 0, 0.08);
      }
      if (fillLightRef.current) {
        fillLightRef.current.intensity = THREE.MathUtils.lerp(fillLightRef.current.intensity, 0, 0.08);
      }
    }
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0.08} />
      <directionalLight ref={keyLightRef} intensity={0} color="#fffcf5" />
      <directionalLight ref={fillLightRef} intensity={0} color="#dbeafe" />
    </>
  );
}

export default function SolarSystem({
  selectedBody,
  onSelectBody,
  activeMuseum,
  onEnterMoonMuseum,
  onEnterMarsMuseum,
  isPlaying,
  planetPositionsRef,
  selectedMachine,
  hoveredId,
  onSelectMachine,
  onHoverMachine,
  selectedMarsMachine,
  hoveredMarsId,
  onSelectMarsMachine,
  onHoverMarsMachine,
}: SolarSystemProps) {
  // Orbital angles ref for each celestial body
  const anglesRef = useRef<Map<string, number>>(new Map());
  const planetGroupsRef = useRef<Map<string, THREE.Group>>(new Map());

  // Interactive hover tracking with debounce to eliminate child-mesh boundary flicker
  const [hoveredBodyId, setHoveredBodyId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { gl } = useThree();

  const handlePointerOver = useCallback((id: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredBodyId(id);
    cursorStore.set('focus');
  }, []);

  const handlePointerOut = useCallback((id: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredBodyId((curr) => (curr === id ? null : curr));
      cursorStore.set('default');
    }, 40);
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleLeave = () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setHoveredBodyId(null);
      cursorStore.set('default');
    };
    const handleBlur = () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setHoveredBodyId(null);
      cursorStore.set('default');
    };

    canvas.addEventListener('pointerleave', handleLeave);
    window.addEventListener('blur', handleBlur);

    return () => {
      canvas.removeEventListener('pointerleave', handleLeave);
      window.removeEventListener('blur', handleBlur);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [gl]);

  // Initialize initial orbital angles with scientific spacing
  useMemo(() => {
    CELESTIAL_BODIES.forEach((b, idx) => {
      if (!anglesRef.current.has(b.id)) {
        anglesRef.current.set(b.id, idx * 1.1);
      }
    });
  }, []);

  useFrame((_state, delta) => {
    CELESTIAL_BODIES.forEach((b) => {
      const group = planetGroupsRef.current.get(b.id);
      if (!group) return;

      // Update orbital revolution
      if (b.orbitRadius > 0) {
        if (isPlaying) {
          const currentAngle = anglesRef.current.get(b.id) ?? 0;
          const newAngle = currentAngle + b.orbitalSpeed * delta * 0.18;
          anglesRef.current.set(b.id, newAngle);
        }
        const angle = anglesRef.current.get(b.id) ?? 0;
        const x = Math.cos(angle) * b.orbitRadius;
        const z = Math.sin(angle) * b.orbitRadius;
        group.position.set(x, 0, z);

        // Store world position for camera controller (zero allocation in loop)
        if (planetPositionsRef.current) {
          let pos = planetPositionsRef.current.get(b.id);
          if (!pos) {
            pos = new THREE.Vector3();
            planetPositionsRef.current.set(b.id, pos);
          }
          pos.set(x, 0, z);
        }
      } else {
        // Sun at center
        group.position.set(0, 0, 0);
        if (planetPositionsRef.current) {
          let pos = planetPositionsRef.current.get(b.id);
          if (!pos) {
            pos = new THREE.Vector3();
            planetPositionsRef.current.set(b.id, pos);
          }
          pos.set(0, 0, 0);
        }
      }

      // Axial rotation
      const isMarsFrozen = b.id === 'mars' && activeMuseum === 'mars' && selectedMarsMachine !== null;
      if (!isMarsFrozen) {
        group.rotation.y += b.rotationSpeed * delta * 15;
      }
    });
  });

  return (
    <group>
      {/* Primary Sunlight radiating from the Sun at center */}
      <pointLight position={[0, 0, 0]} intensity={4.5} decay={0.6} distance={150} color="#fffcf5" />
      <DynamicFocusLighting
        selectedBody={selectedBody}
        activeMuseum={activeMuseum}
        planetPositionsRef={planetPositionsRef}
      />

      {/* Orbit paths */}
      {CELESTIAL_BODIES.filter((b) => b.orbitRadius > 0).map((b) => (
        <PlanetOrbit
          key={`orbit-${b.id}`}
          radius={b.orbitRadius}
        />
      ))}

      {/* Celestial Bodies */}
      {CELESTIAL_BODIES.map((b) => {
        const isSun = b.id === 'sun';
        const isSaturn = b.id === 'saturn';
        const isEarth = b.id === 'earth';
        const isMars = b.id === 'mars';
        const isHovered = hoveredBodyId === b.id;
        const isMuseumActive = activeMuseum !== null;
        // Hover only: selection or focus must NEVER make the planet name appear
        const showLabel = !isMuseumActive && isHovered;

        return (
          <group
            key={b.id}
            ref={(el) => {
              if (el) planetGroupsRef.current.set(b.id, el);
              else planetGroupsRef.current.delete(b.id);
            }}
          >
            {/* Tilt container for axial inclination */}
            <group rotation={[THREE.MathUtils.degToRad(b.axialTilt), 0, 0]}>
              {/* Lightweight Interactive Hit Area: restricts raycasting to 256 triangles */}
              <mesh
                onPointerOver={(e) => {
                  e.stopPropagation();
                  handlePointerOver(b.id);
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  handlePointerOut(b.id);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (b.id === 'mars') {
                    if (activeMuseum === 'mars') {
                      onSelectMarsMachine(null);
                    } else {
                      onEnterMarsMuseum();
                    }
                  } else if (selectedBody?.id === b.id) {
                    onSelectBody(null);
                  } else {
                    onSelectBody(b);
                  }
                }}
              >
                <sphereGeometry args={[b.planetRadius * (isSaturn ? 2.4 : 1.35), 16, 16]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
              </mesh>

              {/* 3D Model with Fallback Sphere */}
              <AssetErrorBoundary
                fallback={
                  <FallbackSphere
                    radius={b.planetRadius}
                    color={b.color}
                    texturePath={b.texturePath}
                    emissive={isSun}
                  />
                }
              >
                <Suspense
                  fallback={
                    <FallbackSphere
                      radius={b.planetRadius}
                      color={b.color}
                      texturePath={b.texturePath}
                      emissive={isSun}
                    />
                  }
                >
                  {b.fbxPath ? (
                    <FbxPlanetModel
                      fbxPath={b.fbxPath}
                      texturePath={b.texturePath ?? undefined}
                      radius={b.planetRadius}
                      emissive={isSun}
                    />
                  ) : (
                    <FallbackSphere
                      radius={b.planetRadius}
                      color={b.color}
                      texturePath={b.texturePath}
                      emissive={isSun}
                    />
                  )}
                </Suspense>
              </AssetErrorBoundary>

              {/* Saturn's iconic rings */}
              {isSaturn && (
                <AssetErrorBoundary fallback={null}>
                  <Suspense fallback={null}>
                    <SaturnRings innerRadius={b.planetRadius * 1.35} outerRadius={b.planetRadius * 2.3} />
                  </Suspense>
                </AssetErrorBoundary>
              )}

              {/* Mars Museum Overlay - Abandoned Machines and Callouts */}
              {isMars && activeMuseum === 'mars' && (
                <group>
                  {/* Surface click target for deselecting machine */}
                  <mesh
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMarsMachine(null);
                    }}
                    visible={false}
                  >
                    <sphereGeometry args={[b.planetRadius * 1.002, 32, 32]} />
                    <meshBasicMaterial />
                  </mesh>

                  {/* Martian machines positioned at verified geographic coordinates on Mars */}
                  {MARS_MACHINES.map((m) => (
                    <MarsMachineObject
                      key={m.id}
                      machine={m}
                      radius={b.planetRadius}
                      isActive={m.id === hoveredMarsId || m.id === selectedMarsMachine?.id}
                      onClick={onSelectMarsMachine}
                      onHover={onHoverMarsMachine}
                    />
                  ))}

                  <MarsCallouts
                    machines={MARS_MACHINES}
                    radius={b.planetRadius}
                    distanceFactor={b.planetRadius * 3.4}
                    hoveredId={hoveredMarsId}
                    onHover={onHoverMarsMachine}
                    selectedMachine={selectedMarsMachine}
                    onSelect={onSelectMarsMachine}
                  />
                </group>
              )}
            </group>

            {/* Earth's Moon - Independent Sibling Celestial Object */}
            {isEarth && (
              <AssetErrorBoundary fallback={null}>
                <Suspense fallback={null}>
                  <OrbitingMoon
                    activeMuseum={activeMuseum}
                    onEnterMoonMuseum={onEnterMoonMuseum}
                    planetPositionsRef={planetPositionsRef}
                    selectedMachine={selectedMachine}
                    hoveredId={hoveredId}
                    onSelectMachine={onSelectMachine}
                    onHoverMachine={onHoverMachine}
                  />
                </Suspense>
              </AssetErrorBoundary>
            )}

            {/* Dynamic Hover Floating Name Label (Hover only) */}
            <Html
              position={[0, b.planetRadius + (isSun ? 0.8 : isSaturn ? 0.65 : 0.45), 0]}
              center
              distanceFactor={28}
            >
              <div
                className={`select-none pointer-events-none flex flex-col items-center transition-all duration-300 ease-out ${
                  showLabel
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-1'
                }`}
                style={{
                  willChange: 'opacity, transform',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                }}
              >
                {/* Planet Name in Space Grotesk */}
                <span
                  style={{
                    fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
                    fontSize: '11px',
                    fontWeight: 400,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#FFFFFF',
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.95), 0 2px 8px rgba(0, 0, 0, 0.85)',
                    opacity: 0.95,
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {b.name}
                </span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
