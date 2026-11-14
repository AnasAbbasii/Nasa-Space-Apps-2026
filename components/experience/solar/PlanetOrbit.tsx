'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

interface PlanetOrbitProps {
  radius: number;
  highlighted?: boolean;
}

export default function PlanetOrbit({ radius }: PlanetOrbitProps) {
  const lineObject = useMemo(() => {
    const segments = 128;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.10,
    });
    return new THREE.Line(geom, mat);
  }, [radius]);

  return <primitive object={lineObject} />;
}
