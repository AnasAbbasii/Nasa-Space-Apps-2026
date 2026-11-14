'use client';

import React, { Suspense } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { MOON_RADIUS } from '@/lib/moon-coords';
import type { LunarMachine } from '@/lib/lunar-machines';
import LunarMachineObject from './LunarMachineObject';

interface MoonProps {
  groupRef: React.RefObject<THREE.Group | null>;
  machines: LunarMachine[];
  selectedMachine: LunarMachine | null;
  hoveredId: string | null;
  onSelectMachine: (machine: LunarMachine | null) => void;
  onHoverMachine: (id: string | null) => void;
  autoRotate: boolean;
}

function MoonSphere() {
  const moonTexture = useTexture('/textures/moon_2k.jpg');
  moonTexture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh receiveShadow castShadow>
      <sphereGeometry args={[MOON_RADIUS, 128, 128]} />
      <meshStandardMaterial
        map={moonTexture}
        roughness={0.92}
        metalness={0.02}
      />
    </mesh>
  );
}

function MoonSphereFallback() {
  return (
    <mesh>
      <sphereGeometry args={[MOON_RADIUS, 64, 64]} />
      <meshStandardMaterial color="#8e8e8e" roughness={0.95} metalness={0} />
    </mesh>
  );
}

export default function Moon({
  groupRef,
  machines,
  selectedMachine,
  hoveredId,
  onSelectMachine,
  onHoverMachine,
  autoRotate,
}: MoonProps) {
  useFrame((_state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, -Math.PI / 2, 0]}>
      {/* 3D Moon sphere with NASA lunar albedo texture */}
      <Suspense fallback={<MoonSphereFallback />}>
        <MoonSphere />
      </Suspense>

      {/* Surface click target for deselecting machine */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelectMachine(null);
        }}
        visible={false}
      >
        <sphereGeometry args={[MOON_RADIUS * 1.001, 32, 32]} />
        <meshBasicMaterial />
      </mesh>

      {/* Lunar machines positioned at their real geographic coordinates on the surface */}
      {machines.map((m) => (
        <LunarMachineObject
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
