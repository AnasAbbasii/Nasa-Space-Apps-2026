'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

interface PlanetOrbitProps {
  radius: number;
  highlighted?: boolean;
}

export default function PlanetOrbit({ radius, highlighted = false }: PlanetOrbitProps) {
  const lineObject = useMemo(() => {
    const segments = 128;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: highlighted ? 0x7dd3fc : 0xffffff,
      transparent: true,
      opacity: highlighted ? 0.45 : 0.12,
    });
    return new THREE.Line(geom, mat);
  }, [radius, highlighted]);

  return <primitive object={lineObject} />;
}
