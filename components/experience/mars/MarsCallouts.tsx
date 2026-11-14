'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Line2, LineMaterial, LineGeometry } from 'three-stdlib';
import { marsLatLonToVector3, MARS_RADIUS } from '@/lib/mars-coords';
import type { MarsMachine } from '@/lib/mars-machines';
import { cursorStore } from '@/lib/cursor-store';

interface MarsCalloutsProps {
  machines: MarsMachine[];
  marsGroupRef: React.RefObject<THREE.Group | null>;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  selectedMachine: MarsMachine | null;
  onSelect: (machine: MarsMachine | null) => void;
}

const MIN_LABEL_SPACING = 0.44; // Vertical scene units between labels to prevent text overlap

interface CalloutEntry {
  machine: MarsMachine;
  line: Line2;
  geometry: LineGeometry;
  material: LineMaterial;
  positions: Float32Array; // 2 points (6 floats) for a straight line
  currentY: number;
  currentSide: number;
  groupRef: React.RefObject<THREE.Group | null>;
  htmlDivRef: React.RefObject<HTMLDivElement | null>;
}

export default function MarsCallouts({
  machines,
  marsGroupRef,
  hoveredId,
  onHover,
  selectedMachine,
  onSelect,
}: MarsCalloutsProps) {
  const { size, viewport } = useThree();

  const entriesRef = useRef<Map<string, CalloutEntry>>(new Map());

  // Initialize Line2 instances with thin delicate white lines
  const entries = useMemo(() => {
    const map = new Map<string, CalloutEntry>();
    for (const m of machines) {
      const geom = new LineGeometry();
      const positions = new Float32Array(6); // [x0, y0, z0, x1, y1, z1]
      geom.setPositions(positions);

      const mat = new LineMaterial({
        color: 0xffffff, // Pure white
        linewidth: 1.0, // Thin, delicate, uniform line thickness
        transparent: true,
        opacity: 0.85,
        resolution: new THREE.Vector2(size.width, size.height),
        depthWrite: false,
      });

      const line = new Line2(geom, mat);
      line.visible = false;

      const initialY = (m.lat / 90) * 1.3;
      const initialSide = m.lon > 180 ? -1 : 1;

      map.set(m.id, {
        machine: m,
        line,
        geometry: geom,
        material: mat,
        positions,
        currentY: initialY,
        currentSide: initialSide,
        groupRef: React.createRef<THREE.Group>(),
        htmlDivRef: React.createRef<HTMLDivElement>(),
      });
    }
    entriesRef.current = map;
    return map;
  }, [machines, size.width, size.height]);

  // Clean up WebGL resources on unmount
  useEffect(() => {
    return () => {
      entries.forEach((entry) => {
        entry.geometry.dispose();
        entry.material.dispose();
      });
    };
  }, [entries]);

  useFrame((state) => {
    if (!marsGroupRef.current) return;

    const marsRot = marsGroupRef.current.rotation;
    const camPos = state.camera.position;

    // Short, visually balanced distance outside the Mars 2.0 radius silhouette
    const labelDistX = Math.max(2.30, Math.min(2.45, viewport.width * 0.40));

    interface LayoutCandidate {
      entry: CalloutEntry;
      worldPos: THREE.Vector3;
      normal: THREE.Vector3;
      visibility: number;
      side: number;
      rawY: number;
      targetY: number;
    }

    const candidates: LayoutCandidate[] = [];

    // 1. Calculate geographic positions on Mars crust and camera visibility
    for (const m of machines) {
      const entry = entries.get(m.id);
      if (!entry) continue;

      const localPos = marsLatLonToVector3(m.lat, m.lon, MARS_RADIUS);
      const worldPos = localPos.applyEuler(marsRot);
      const normal = worldPos.clone().normalize();

      // Dot product with camera vector: > 0 means near side, < 0 means far side
      const toCam = camPos.clone().sub(worldPos).normalize();
      const dot = normal.dot(toCam);

      // Fade out smoothly before crossing the horizon (-0.02 to 0.16)
      const visibility = THREE.MathUtils.clamp((dot + 0.02) / 0.18, 0, 1);

      // Distribute to left or right based on world X
      const side = worldPos.x >= 0 ? 1 : -1;
      const rawY = THREE.MathUtils.clamp(worldPos.y * 1.25, -1.35, 1.35);

      candidates.push({
        entry,
        worldPos,
        normal,
        visibility,
        side,
        rawY,
        targetY: rawY,
      });
    }

    // 2. Separate into left and right groups for spacing relaxation
    const leftGroup = candidates.filter((c) => c.side === -1 && c.visibility > 0.05);
    const rightGroup = candidates.filter((c) => c.side === 1 && c.visibility > 0.05);

    // Sort descending by raw Y (top to bottom)
    leftGroup.sort((a, b) => b.rawY - a.rawY);
    rightGroup.sort((a, b) => b.rawY - a.rawY);

    // Multi-pass relaxation to prevent ANY label overlap
    const relax = (group: LayoutCandidate[]) => {
      for (let pass = 0; pass < 5; pass++) {
        for (let i = 0; i < group.length - 1; i++) {
          const top = group[i];
          const bot = group[i + 1];
          const diff = top.targetY - bot.targetY;
          if (diff < MIN_LABEL_SPACING) {
            const shift = (MIN_LABEL_SPACING - diff) / 2;
            top.targetY += shift;
            bot.targetY -= shift;
          }
        }
      }
    };

    relax(leftGroup);
    relax(rightGroup);

    // 3. Update straight lines and label transforms
    for (const cand of candidates) {
      const { entry, worldPos, visibility, side, targetY } = cand;
      const m = entry.machine;
      const isActive = m.id === hoveredId || m.id === selectedMachine?.id;

      // Smooth inertia damping on label Y prevents sudden jumps
      entry.currentY = THREE.MathUtils.lerp(entry.currentY, targetY, 0.12);
      entry.currentSide = side;

      const targetX = side * labelDistX;

      // P0: Starts precisely at verified geographic coordinate on Martian surface
      const P0 = worldPos;
      // Pend: Terminates precisely at the external name label outside the silhouette
      const Pend = new THREE.Vector3(targetX, entry.currentY, worldPos.z + 0.15);

      // Set perfectly straight 2-point line: P0 -> Pend
      entry.positions[0] = P0.x;
      entry.positions[1] = P0.y;
      entry.positions[2] = P0.z;
      entry.positions[3] = Pend.x;
      entry.positions[4] = Pend.y;
      entry.positions[5] = Pend.z;
      entry.geometry.setPositions(entry.positions);

      // Line styling: delicate, thin, uniform white
      entry.material.resolution.set(size.width, size.height);
      entry.material.linewidth = isActive ? 1.5 : 1.0;
      entry.material.color.set(0xffffff);
      entry.material.opacity = (isActive ? 1.0 : 0.85) * visibility;
      entry.line.visible = visibility > 0.02;

      // Position 3D label group at line termination point Pend
      if (entry.groupRef.current) {
        entry.groupRef.current.position.set(Pend.x, Pend.y, Pend.z);
      }

      // Update HTML label visibility and interactivity
      if (entry.htmlDivRef.current) {
        entry.htmlDivRef.current.style.opacity = String(visibility);
        entry.htmlDivRef.current.style.pointerEvents = visibility > 0.25 ? 'auto' : 'none';
      }
    }
  });

  return (
    <group>
      {/* Thin, Delicate, Straight White Connection Lines */}
      {Array.from(entries.values()).map((entry) => (
        <primitive key={`mars-line-${entry.machine.id}`} object={entry.line} />
      ))}

      {/* External Machine Names in Premium Space Grotesk Typography */}
      {Array.from(entries.values()).map((entry) => {
        const m = entry.machine;
        const isActive = m.id === hoveredId || m.id === selectedMachine?.id;
        const isLeft = entry.currentSide === -1;

        return (
          <group key={`mars-label-group-${m.id}`} ref={entry.groupRef}>
            <Html center={false} distanceFactor={5.5}>
              <div
                ref={entry.htmlDivRef}
                data-cursor="focus"
                onMouseEnter={() => {
                  onHover(m.id);
                  cursorStore.set('focus');
                }}
                onMouseLeave={() => {
                  onHover(null);
                  cursorStore.set('default');
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(m);
                }}
                className="select-none cursor-pointer transition-all duration-200 ease-out hover:scale-[1.03] active:scale-[0.97] will-change-transform"
                style={{
                  transform: isLeft ? 'translate(calc(-100% - 5px), -50%)' : 'translate(5px, -50%)',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                {/* Machine Name in Pure White (#FFFFFF) and Space Grotesk */}
                <span
                  style={{
                    color: '#FFFFFF',
                    fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '0.06em',
                    textShadow: isActive
                      ? '0 0 12px rgba(255, 255, 255, 0.85), 0 1px 4px rgba(0, 0, 0, 0.95)'
                      : '0 1px 4px rgba(0, 0, 0, 0.95), 0 2px 8px rgba(0, 0, 0, 0.85)',
                    transition: 'text-shadow 0.2s ease, font-weight 0.2s ease',
                    userSelect: 'none',
                  }}
                >
                  {m.name}
                </span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
