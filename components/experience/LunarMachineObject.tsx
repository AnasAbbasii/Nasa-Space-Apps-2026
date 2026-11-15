'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { latLonToVector3, MOON_RADIUS } from '@/lib/moon-coords';
import type { LunarMachine } from '@/lib/lunar-machines';
import { cursorStore } from '@/lib/cursor-store';

interface LunarMachineObjectProps {
  machine: LunarMachine;
  isActive: boolean;
  onClick: (machine: LunarMachine) => void;
  onHover: (id: string | null) => void;
  radius?: number;
}

const _scratchCam = new THREE.Vector3();

export default function LunarMachineObject({
  machine,
  isActive,
  onClick,
  onHover,
  radius = MOON_RADIUS,
}: LunarMachineObjectProps) {
  const scale = radius / MOON_RADIUS;
  const groupRef = useRef<THREE.Group>(null);
  const wasVisibleRef = useRef<boolean>(true);
  const dotMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  // Verified geographic coordinate on the lunar surface
  const surfacePoint = useMemo(
    () => latLonToVector3(machine.lat, machine.lon, radius),
    [machine.lat, machine.lon, radius],
  );

  const normal = useMemo(() => surfacePoint.clone().normalize(), [surfacePoint]);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Transform camera position into local coordinate space (zero allocation)
    _scratchCam.copy(state.camera.position);
    groupRef.current.worldToLocal(_scratchCam);

    _scratchCam.sub(surfacePoint).normalize();
    const dot = normal.dot(_scratchCam);

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
      {/* Invisible hit sphere for clicking the landing site on the lunar surface */}
      <mesh position={surfacePoint}>
        <sphereGeometry args={[0.065 * scale, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Small, circular, understated white surface coordinate marker dot (~3-4 screen pixels) */}
      <mesh position={surfacePoint}>
        <sphereGeometry args={[Math.max(0.0028, 0.0035 * (radius / 0.20)), 12, 12]} />
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
