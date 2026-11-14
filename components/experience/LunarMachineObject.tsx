'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { latLonToVector3, MOON_RADIUS } from '@/lib/moon-coords';
import type { LunarMachine } from '@/lib/lunar-machines';

interface LunarMachineObjectProps {
  machine: LunarMachine;
  isActive: boolean;
  onClick: (machine: LunarMachine) => void;
  onHover: (id: string | null) => void;
}

export default function LunarMachineObject({
  machine,
  isActive,
  onClick,
  onHover,
}: LunarMachineObjectProps) {
  // Verified geographic coordinate on the lunar surface
  const surfacePoint = useMemo(
    () => latLonToVector3(machine.lat, machine.lon, MOON_RADIUS),
    [machine.lat, machine.lon],
  );

  const normal = useMemo(() => surfacePoint.clone().normalize(), [surfacePoint]);

  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    q.setFromUnitVectors(up, normal);
    return q;
  }, [normal]);

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onClick(machine);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        onHover(machine.id);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        onHover(null);
      }}
    >
      {/* Invisible hit sphere for clicking the landing site on the lunar surface */}
      <mesh position={surfacePoint}>
        <sphereGeometry args={[0.065, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Delicate white surface coordinate marker dot */}
      <mesh position={surfacePoint}>
        <sphereGeometry args={[0.009, 12, 12]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={isActive ? 1.0 : 0.85} />
      </mesh>

      {/* Subtle thin coordinate ring on surface when active */}
      {isActive && (
        <mesh position={surfacePoint} quaternion={quaternion} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.018, 0.022, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
