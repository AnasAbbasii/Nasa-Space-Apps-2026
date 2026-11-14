'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { marsLatLonToVector3, MARS_RADIUS } from '@/lib/mars-coords';
import type { MarsMachine } from '@/lib/mars-machines';

interface MarsMachineObjectProps {
  machine: MarsMachine;
  isActive: boolean;
  onClick: (machine: MarsMachine) => void;
  onHover: (id: string | null) => void;
}

export default function MarsMachineObject({
  machine,
  isActive,
  onClick,
  onHover,
}: MarsMachineObjectProps) {
  // Verified geographic coordinate on the Martian surface
  const surfacePoint = useMemo(
    () => marsLatLonToVector3(machine.lat, machine.lon, MARS_RADIUS),
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
      {/* Invisible hit sphere for clicking the landing site on Mars */}
      <mesh position={surfacePoint}>
        <sphereGeometry args={[0.065, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Surface coordinate marker dot */}
      <mesh position={surfacePoint}>
        <sphereGeometry args={[0.009, 12, 12]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={isActive ? 1.0 : 0.85} />
      </mesh>

      {/* Subtle thin coordinate ring on surface when active */}
      {isActive && (
        <mesh position={surfacePoint} quaternion={quaternion} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.018, 0.022, 32]} />
          <meshBasicMaterial color="#ff8a57" transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
