'use client';

import React, { Suspense } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { MARS_RADIUS } from '@/lib/mars-coords';
import type { MarsMachine } from '@/lib/mars-machines';
import MarsMachineObject from './MarsMachineObject';

interface MarsProps {
  groupRef: React.RefObject<THREE.Group | null>;
  machines: MarsMachine[];
  selectedMachine: MarsMachine | null;
  hoveredId: string | null;
  onSelectMachine: (machine: MarsMachine | null) => void;
  onHoverMachine: (id: string | null) => void;
  autoRotate: boolean;
}

function MarsSphere() {
  const marsTexture = useTexture('/textures/mars_surface.jpg');
  marsTexture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh receiveShadow castShadow>
      <sphereGeometry args={[MARS_RADIUS, 128, 128]} />
      <meshStandardMaterial
        map={marsTexture}
        roughness={0.92}
        metalness={0.05}
      />
    </mesh>
  );
}

function MarsSphereFallback() {
  return (
    <mesh>
      <sphereGeometry args={[MARS_RADIUS, 64, 64]} />
      <meshStandardMaterial color="#c1440e" roughness={0.95} metalness={0.05} />
    </mesh>
  );
}

export default function Mars({
  groupRef,
  machines,
  selectedMachine,
  hoveredId,
  onSelectMachine,
  onHoverMachine,
  autoRotate,
}: MarsProps) {
  useFrame((_state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, -Math.PI / 2, 0]}>
      {/* 3D Mars sphere with NASA Viking/Orbiter surface texture */}
      <Suspense fallback={<MarsSphereFallback />}>
        <MarsSphere />
      </Suspense>

      {/* Surface click target for deselecting machine */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelectMachine(null);
        }}
        visible={false}
      >
        <sphereGeometry args={[MARS_RADIUS * 1.001, 32, 32]} />
        <meshBasicMaterial />
      </mesh>

      {/* Martian machines positioned at verified geographic coordinates on the surface */}
      {machines.map((m) => (
        <MarsMachineObject
          key={m.id}
          machine={m}
          isActive={m.id === hoveredId || m.id === selectedMachine?.id}
          onClick={onSelectMachine}
          onHover={onHoverMachine}
        />
      ))}
    </group>
  );
}
