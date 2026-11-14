'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { latLonToVector3, MOON_RADIUS } from '@/lib/moon-coords';
import type { LunarMachine } from '@/lib/lunar-machines';

interface ConnectionLineProps {
  machine: LunarMachine;
  modelPosition: THREE.Vector3;
  isSelected: boolean;
}

export default function ConnectionLine({ machine, modelPosition, isSelected }: ConnectionLineProps) {
  const markerRef = useRef<THREE.Mesh>(null);

  const surfacePoint = useMemo(
    () => latLonToVector3(machine.lat, machine.lon, MOON_RADIUS),
    [machine.lat, machine.lon],
  );

  const lineObj = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints([surfacePoint, modelPosition]);
    const mat = new THREE.LineBasicMaterial({
      color: isSelected ? 0x7dd3fc : 0xa0b4c8,
      transparent: true,
      opacity: isSelected ? 0.95 : 0.45,
    });
    return new THREE.Line(geom, mat);
  }, [surfacePoint, modelPosition, isSelected]);

  const markerColor = isSelected ? '#7dd3fc' : '#94a3b8';

  useFrame(({ clock }) => {
    if (markerRef.current) {
      const s = isSelected ? 1 + 0.3 * Math.sin(clock.elapsedTime * 3) : 1;
      markerRef.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      {/* Precise surface location dot */}
      <mesh ref={markerRef} position={surfacePoint}>
        <sphereGeometry args={[0.012, 12, 12]} />
        <meshBasicMaterial color={markerColor} transparent opacity={isSelected ? 1.0 : 0.75} />
      </mesh>

      {/* Thin scientific connection line extending to the 3D model */}
      <primitive object={lineObj} />
    </group>
  );
}
