'use client';

import React, { useRef, useMemo, Suspense, Component, ReactNode } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { CELESTIAL_BODIES } from '@/lib/solar-system';
import type { CelestialBody } from '@/lib/solar-system';
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

// Earth's orbiting Moon gateway
function OrbitingMoon({ onEnterMoonMuseum }: { onEnterMoonMuseum: () => void }) {
  const moonRef = useRef<THREE.Group>(null);
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
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial map={moonTexture} roughness={0.92} metalness={0.02} />
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
              {/* Interactive Hit Area */}
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBody(b);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                  document.body.style.cursor = 'default';
                }}
              >
                <sphereGeometry args={[b.planetRadius * 1.35, 16, 16]} />
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

              {/* Earth's Moon */}
              {isEarth && (
                <AssetErrorBoundary fallback={null}>
                  <Suspense fallback={null}>
                    <OrbitingMoon onEnterMoonMuseum={onEnterMoonMuseum} />
                  </Suspense>
                </AssetErrorBoundary>
              )}
            </group>

            {/* Selection highlight ring */}
            {isSelected && !isSun && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[b.planetRadius * 1.45, b.planetRadius * 1.55, 48]} />
                <meshBasicMaterial
                  color={isMars ? '#ff8a57' : '#7dd3fc'}
                  transparent
                  opacity={0.7}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* Planet Name Callout */}
            {!isSun && (
              <Html position={[0, b.planetRadius + 0.35, 0]} center distanceFactor={28}>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBody(b);
                  }}
                  className="pointer-events-auto select-none cursor-pointer group flex flex-col items-center"
                >
                  <div
                    className={`text-[10px] font-medium tracking-[0.15em] uppercase font-sans px-2 py-0.5 rounded transition-all ${
                      isSelected
                        ? isMars
                          ? 'text-orange-300 bg-orange-950/80 border border-orange-500/50 shadow-[0_0_12px_rgba(255,138,87,0.4)]'
                          : 'text-sky-300 bg-sky-950/80 border border-sky-400/50 shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                        : 'text-white/70 group-hover:text-white bg-black/40 group-hover:bg-black/70 border border-white/10'
                    }`}
                  >
                    {b.name}
                  </div>
                  {isEarth && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onEnterMoonMuseum();
                      }}
                      className="text-[8px] font-mono tracking-wider text-sky-400/90 mt-0.5 hover:text-sky-300 transition-colors flex items-center gap-1"
                    >
                      <span>✦</span>
                      <span>Moon Museum</span>
                    </div>
                  )}
                  {isMars && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onEnterMarsMuseum();
                      }}
                      className="text-[8px] font-mono tracking-wider text-orange-400/90 mt-0.5 hover:text-orange-300 transition-colors flex items-center gap-1"
                    >
                      <span>✦</span>
                      <span>Mars Museum</span>
                    </div>
                  )}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
