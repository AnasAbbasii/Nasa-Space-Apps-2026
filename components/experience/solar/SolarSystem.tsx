'use client';

import React, { useRef, useMemo, Suspense, Component, ReactNode, useState, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { CELESTIAL_BODIES } from '@/lib/solar-system';
import type { CelestialBody } from '@/lib/solar-system';
import { cursorStore } from '@/lib/cursor-store';
import PlanetOrbit from './PlanetOrbit';

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
  onEnterMoonMuseum: () => void;
  onEnterMarsMuseum: () => void;
  isPlaying: boolean;
  planetPositionsRef: React.RefObject<Map<string, THREE.Vector3>>;
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
    <mesh>
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
    <mesh rotation={[Math.PI / 2, 0, 0]}>
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

// Earth's orbiting Moon gateway - independent interactive object
function OrbitingMoon({ onEnterMoonMuseum }: { onEnterMoonMuseum: () => void }) {
  const moonRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const moonTexture = useTexture('/textures/moon_2k.jpg');
  moonTexture.colorSpace = THREE.SRGBColorSpace;

  useFrame((_state, delta) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={moonRef}>
      <mesh
        position={[1.25, 0.1, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onEnterMoonMuseum();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setIsHovered(true);
          cursorStore.set('focus');
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setIsHovered(false);
          cursorStore.set('default');
        }}
      >
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial
          map={moonTexture}
          roughness={0.92}
          metalness={0.02}
          emissive="#ffffff"
          emissiveIntensity={isHovered ? 0.22 : 0}
        />
      </mesh>
    </group>
  );
}

export default function SolarSystem({
  selectedBody,
  onSelectBody,
  onEnterMoonMuseum,
  onEnterMarsMuseum,
  isPlaying,
  planetPositionsRef,
}: SolarSystemProps) {
  // Orbital angles ref for each celestial body
  const anglesRef = useRef<Map<string, number>>(new Map());
  const planetGroupsRef = useRef<Map<string, THREE.Group>>(new Map());

  // Interactive hover tracking with debounce to eliminate child-mesh boundary flicker
  const [hoveredBodyId, setHoveredBodyId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

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

        // Store world position for camera controller
        if (planetPositionsRef.current) {
          planetPositionsRef.current.set(b.id, new THREE.Vector3(x, 0, z));
        }
      } else {
        // Sun at center
        group.position.set(0, 0, 0);
        if (planetPositionsRef.current) {
          planetPositionsRef.current.set(b.id, new THREE.Vector3(0, 0, 0));
        }
      }

      // Axial rotation
      group.rotation.y += b.rotationSpeed * delta * 15;
    });
  });

  return (
    <group>
      {/* Primary Sunlight radiating from the Sun at center */}
      <pointLight position={[0, 0, 0]} intensity={4.5} decay={0.6} distance={150} color="#fffcf5" />
      <ambientLight intensity={0.06} />

      {/* Orbit paths */}
      {CELESTIAL_BODIES.filter((b) => b.orbitRadius > 0).map((b) => (
        <PlanetOrbit
          key={`orbit-${b.id}`}
          radius={b.orbitRadius}
          highlighted={selectedBody?.id === b.id}
        />
      ))}

      {/* Celestial Bodies */}
      {CELESTIAL_BODIES.map((b) => {
        const isSun = b.id === 'sun';
        const isSaturn = b.id === 'saturn';
        const isEarth = b.id === 'earth';
        const isMars = b.id === 'mars';
        const isSelected = selectedBody?.id === b.id;
        const isHovered = hoveredBodyId === b.id;
        const showLabel = isSelected || isHovered;

        return (
          <group
            key={b.id}
            ref={(el) => {
              if (el) planetGroupsRef.current.set(b.id, el);
              else planetGroupsRef.current.delete(b.id);
            }}
          >
            {/* Tilt container for axial inclination */}
            <group
              rotation={[THREE.MathUtils.degToRad(b.axialTilt), 0, 0]}
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
                onSelectBody(b);
              }}
            >
              {/* Interactive Hit Area */}
              <mesh>
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
            </group>

            {/* Earth's Moon - Independent Sibling Celestial Object */}
            {isEarth && (
              <AssetErrorBoundary fallback={null}>
                <Suspense fallback={null}>
                  <OrbitingMoon onEnterMoonMuseum={onEnterMoonMuseum} />
                </Suspense>
              </AssetErrorBoundary>
            )}

            {/* Subtle white selection highlight ring */}
            {isSelected && !isSun && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[b.planetRadius * 1.35, b.planetRadius * 1.42, 48]} />
                <meshBasicMaterial
                  color="#ffffff"
                  transparent
                  opacity={0.35}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* Dynamic Hover & Selection Floating Name Label (Hidden by default) */}
            <Html
              position={[0, b.planetRadius + (isSun ? 0.8 : isSaturn ? 0.65 : 0.45), 0]}
              center
              distanceFactor={28}
            >
              <div
                onPointerEnter={() => handlePointerOver(b.id)}
                onPointerLeave={() => handlePointerOut(b.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBody(b);
                }}
                className={`select-none flex flex-col items-center transition-all duration-300 ease-out ${
                  showLabel
                    ? 'opacity-100 translate-y-0 pointer-events-auto cursor-pointer'
                    : 'opacity-0 translate-y-1 pointer-events-none'
                }`}
                style={{
                  willChange: 'opacity, transform',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                }}
                data-cursor="focus"
              >
                {/* Planet Name in Space Grotesk */}
                <span
                  style={{
                    fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#FFFFFF',
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.95), 0 2px 8px rgba(0, 0, 0, 0.85)',
                    opacity: isSelected ? 1 : 0.88,
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                  }}
                  className="transition-opacity duration-200"
                >
                  {b.name}
                </span>

                {/* Micro-dot indicator when selected */}
                {isSelected && (
                  <span className="h-0.5 w-0.5 rounded-full bg-white mt-0.5 opacity-90" />
                )}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
