'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { marsLatLonToVector3, MARS_RADIUS } from '@/lib/mars-coords';
import type { MarsMachine } from '@/lib/mars-machines';
import { cursorStore } from '@/lib/cursor-store';

interface MarsMachineObjectProps {
  machine: MarsMachine;
  isActive: boolean;
  onClick: (machine: MarsMachine) => void;
  onHover: (id: string | null) => void;
  radius?: number;
}

export default function MarsMachineObject({
  machine,
  isActive,
  onClick,
  onHover,
  radius = MARS_RADIUS,
}: MarsMachineObjectProps) {
  const scale = radius / MARS_RADIUS;
  const groupRef = useRef<THREE.Group>(null);
  const wasVisibleRef = useRef<boolean>(true);
  const dotMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  // Verified geographic coordinate on the Martian surface
  const surfacePoint = useMemo(
    () => marsLatLonToVector3(machine.lat, machine.lon, radius),
    [machine.lat, machine.lon, radius],
  );

  const normal = useMemo(() => surfacePoint.clone().normalize(), [surfacePoint]);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Transform camera position into local coordinate space
    const camPos = state.camera.position.clone();
    groupRef.current.worldToLocal(camPos);

    const toCam = camPos.sub(surfacePoint).normalize();
    const dot = normal.dot(toCam);

    // Horizon deadband hysteresis: > 0.05 to appear, < -0.01 to disappear
    const wasVisible = wasVisibleRef.current;
    const isVisible = wasVisible ? dot > -0.01 : dot > 0.05;
    wasVisibleRef.current = isVisible;

    // State C: Occluded / far-side location
    if (!isVisible) {
      groupRef.current.visible = false;
      return;
    }

    // State A & B: Visible geographic location
    groupRef.current.visible = true;

    // Smooth limb fade
    const limbAlpha = THREE.MathUtils.clamp((dot + 0.01) / 0.14, 0, 1);
    if (dotMaterialRef.current) {
      dotMaterialRef.current.opacity = (isActive ? 1.0 : 0.82) * limbAlpha;
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick(machine);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        cursorStore.set('focus');
        onHover(machine.id);
      }}
      onPointerOut={() => {
        cursorStore.set('default');
        onHover(null);
      }}
    >
      {/* Invisible hit sphere for clicking the landing site on Mars */}
      <mesh position={surfacePoint}>
        <sphereGeometry args={[0.065 * scale, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Small, circular, understated white surface coordinate marker dot (~3-4 screen pixels) */}
      <mesh position={surfacePoint}>
        <sphereGeometry args={[Math.max(0.0055, 0.007 * (radius / 0.42)), 12, 12]} />
        <meshBasicMaterial
          ref={dotMaterialRef}
          color="#ffffff"
          transparent
          opacity={isActive ? 1.0 : 0.82}
        />
      </mesh>
    </group>
  );
}
