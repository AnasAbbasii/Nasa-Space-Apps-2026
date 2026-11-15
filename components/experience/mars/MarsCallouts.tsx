'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Line2, LineMaterial, LineGeometry } from 'three-stdlib';
import { marsLatLonToVector3, MARS_RADIUS, formatMarsCalloutCoordinates } from '@/lib/mars-coords';
import type { MarsMachine } from '@/lib/mars-machines';
import { cursorStore } from '@/lib/cursor-store';

interface MarsCalloutsProps {
  machines: MarsMachine[];
  marsGroupRef?: React.RefObject<THREE.Group | null>;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  selectedMachine: MarsMachine | null;
  onSelect: (machine: MarsMachine | null) => void;
  radius?: number;
  distanceFactor?: number;
}

interface CalloutEntry {
  machine: MarsMachine;
  line: Line2;
  geometry: LineGeometry;
  material: LineMaterial;
  positions: Float32Array; // 2 points (6 floats) for a straight connection line
  surfacePoint: THREE.Vector3;
  normal: THREE.Vector3;
  rawY: number;
  currentX: number;
  currentY: number;
  currentOpacity: number;
  currentSide: number;
  groupRef: React.RefObject<THREE.Group | null>;
  htmlDivRef: React.RefObject<HTMLDivElement | null>;
}

// Module scratch vectors for zero-allocation useFrame
const _marsCalloutCamPos = new THREE.Vector3();
const _marsCalloutToCam = new THREE.Vector3();

interface LayoutCandidate {
  entry: CalloutEntry;
  dot: number;
  isNearSide: boolean;
  limbAlpha: number;
  side: number;
  rawY: number;
  targetY: number;
  priority: number;
  isStateB_suppressed: boolean;
}

export default function MarsCallouts({
  machines,
  marsGroupRef,
  hoveredId,
  onHover,
  selectedMachine,
  onSelect,
  radius = MARS_RADIUS,
  distanceFactor = 5.5,
}: MarsCalloutsProps) {
  const { size } = useThree();

  const entriesRef = useRef<Map<string, CalloutEntry>>(new Map());
  const localRootRef = useRef<THREE.Group>(null);
  const hysteresisMapRef = useRef<Map<string, boolean>>(new Map());
  const candidatesRef = useRef<LayoutCandidate[]>([]);

  // Initialize Line2 instances with thin delicate white lines and precompute surface coordinates
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
        opacity: 0,
        resolution: new THREE.Vector2(size.width, size.height),
        depthWrite: false,
      });

      const line = new Line2(geom, mat);
      line.visible = false;

      const surfacePoint = marsLatLonToVector3(m.lat, m.lon, radius);
      const normal = surfacePoint.clone().normalize();
      const rawY = THREE.MathUtils.clamp(surfacePoint.y * 1.25, -radius * 0.75, radius * 0.75);

      const initialY = (m.lat / 90) * (radius * 0.65);
      const initialSide = m.lon > 180 ? -1 : 1;
      const initialX = initialSide * radius * 1.35;

      map.set(m.id, {
        machine: m,
        line,
        geometry: geom,
        material: mat,
        positions,
        surfacePoint,
        normal,
        rawY,
        currentX: initialX,
        currentY: initialY,
        currentOpacity: 0,
        currentSide: initialSide,
        groupRef: React.createRef<THREE.Group>(),
        htmlDivRef: React.createRef<HTMLDivElement>(),
      });
    }
    entriesRef.current = map;
    return map;
  }, [machines, size.width, size.height, radius]);

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
    // Transform camera position into Mars's local coordinate frame (zero allocation)
    _marsCalloutCamPos.copy(state.camera.position);
    const container = marsGroupRef?.current ?? localRootRef.current;
    if (container) {
      container.worldToLocal(_marsCalloutCamPos);
    }

    // Visually balanced distance outside the sphere silhouette (Priority 2)
    const labelDistX = radius * 1.35;
    const minSpacing = radius * 0.22;
    const maxY = radius * 0.88;
    const minY = -radius * 0.88;

    const candidates = candidatesRef.current;
    candidates.length = 0;

    // 1. Calculate horizon visibility with hysteresis using precomputed coordinates
    for (const m of machines) {
      const entry = entries.get(m.id);
      if (!entry) continue;

      // Dot product with camera vector: > 0 means near side, < 0 means far side
      _marsCalloutToCam.subVectors(_marsCalloutCamPos, entry.surfacePoint).normalize();
      const dot = entry.normal.dot(_marsCalloutToCam);

      // Limb hysteresis: > 0.05 to appear, < -0.01 to disappear (Anti-flicker threshold)
      const wasNearSide = hysteresisMapRef.current.get(m.id) ?? false;
      const isNearSide = wasNearSide ? dot > -0.01 : dot > 0.05;
      hysteresisMapRef.current.set(m.id, isNearSide);

      // Smooth limb fade
      const limbAlpha = THREE.MathUtils.clamp((dot + 0.01) / 0.15, 0, 1);

      // Side hysteresis around the central meridian to prevent jumping
      const prevSide = entry.currentSide;
      let side = prevSide;
      if (prevSide === 1 && entry.surfacePoint.x < -radius * 0.15) {
        side = -1;
      } else if (prevSide === -1 && entry.surfacePoint.x > radius * 0.15) {
        side = 1;
      } else if (prevSide === 0) {
        side = entry.surfacePoint.x >= 0 ? 1 : -1;
      }

      // Priority ranking: Selected (highest) > Hovered > Default
      const isSelected = m.id === selectedMachine?.id;
      const isHovered = m.id === hoveredId;
      const priority = (isSelected ? 200 : 0) + (isHovered ? 100 : 0);

      candidates.push({
        entry,
        dot,
        isNearSide,
        limbAlpha,
        side,
        rawY: entry.rawY,
        targetY: entry.rawY,
        priority,
        isStateB_suppressed: false,
      });
    }

    // 2. Multi-pass relaxation and State B collision resolution per side
    const resolveSide = (groupSide: number) => {
      const group = candidates.filter((c) => c.isNearSide && c.side === groupSide);
      if (group.length === 0) return;

      // Preserving descending rawY monotonic order strictly prevents connection lines from intersecting
      group.sort((a, b) => b.rawY - a.rawY);

      // Maximum labels that can comfortably fit in available vertical span
      const maxCapacity = Math.max(1, Math.floor((maxY - minY) / minSpacing) + 1);

      // State B: If crowded beyond vertical bounds, suppress lowest-priority labels
      if (group.length > maxCapacity) {
        const toSuppress = group.length - maxCapacity;
        const sortedByPriority = [...group].sort((a, b) => a.priority - b.priority);
        for (let k = 0; k < toSuppress; k++) {
          sortedByPriority[k].isStateB_suppressed = true;
        }
      }

      const active = group.filter((c) => !c.isStateB_suppressed);
      if (active.length <= 1) return;

      // Iterative push-apart relaxation
      for (let pass = 0; pass < 8; pass++) {
        for (let i = 0; i < active.length - 1; i++) {
          const top = active[i];
          const bot = active[i + 1];
          const diff = top.targetY - bot.targetY;
          if (diff < minSpacing) {
            const overlap = minSpacing - diff;
            if (top.priority > bot.priority) {
              bot.targetY -= overlap;
            } else if (bot.priority > top.priority) {
              top.targetY += overlap;
            } else {
              top.targetY += overlap * 0.5;
              bot.targetY -= overlap * 0.5;
            }
          }
        }

        // Clamp to vertical boundary envelope
        if (active[0].targetY > maxY) {
          const excess = active[0].targetY - maxY;
          for (const item of active) item.targetY -= excess;
        }
        const last = active[active.length - 1];
        if (last.targetY < minY) {
          const excess = minY - last.targetY;
          for (const item of active) item.targetY += excess;
        }
      }

      // Safety check: if boundary crowding causes remaining overlap, suppress lowest priority
      for (let i = 0; i < active.length - 1; i++) {
        if (active[i].targetY - active[i + 1].targetY < minSpacing * 0.75) {
          const victim = active[i].priority <= active[i + 1].priority ? active[i] : active[i + 1];
          victim.isStateB_suppressed = true;
        }
      }
    };

    resolveSide(-1); // Left group
    resolveSide(1);  // Right group

    // 3. Update connection lines, damping, and label transforms (zero allocation)
    for (const cand of candidates) {
      const { entry, isNearSide, limbAlpha, isStateB_suppressed, side, targetY } = cand;
      const m = entry.machine;
      const isActive = m.id === hoveredId || m.id === selectedMachine?.id;

      // Target opacity: State A -> visible; State B (suppressed) -> 0; State C (far-side) -> 0
      let targetOpacity = 0;
      if (isNearSide && !isStateB_suppressed) {
        targetOpacity = (isActive ? 1.0 : 0.88) * limbAlpha;
      }

      // Smooth inertia damping on Y, X, and opacity
      entry.currentY = THREE.MathUtils.lerp(entry.currentY, targetY, 0.12);
      entry.currentSide = side;
      const targetX = side * labelDistX;
      entry.currentX = THREE.MathUtils.lerp(entry.currentX, targetX, 0.14);
      entry.currentOpacity = THREE.MathUtils.lerp(entry.currentOpacity, targetOpacity, 0.14);

      const pendZ = entry.surfacePoint.z + radius * 0.08;

      // Set straight 2-point line: P0 (surfacePoint) -> Pend (label anchor)
      entry.positions[0] = entry.surfacePoint.x;
      entry.positions[1] = entry.surfacePoint.y;
      entry.positions[2] = entry.surfacePoint.z;
      entry.positions[3] = entry.currentX;
      entry.positions[4] = entry.currentY;
      entry.positions[5] = pendZ;
      entry.geometry.setPositions(entry.positions);

      // Line styling: delicate, thin, uniform white (~1-1.25 px)
      entry.material.resolution.set(size.width, size.height);
      entry.material.linewidth = isActive ? 1.25 : 1.0;
      entry.material.color.set(0xffffff);
      entry.material.opacity = entry.currentOpacity;
      entry.line.visible = entry.currentOpacity > 0.02;

      // Position 3D label group at line termination point (without object allocation)
      if (entry.groupRef.current) {
        entry.groupRef.current.position.set(entry.currentX, entry.currentY, pendZ);
      }

      // Update HTML label visibility and interactivity
      if (entry.htmlDivRef.current) {
        entry.htmlDivRef.current.style.opacity = String(entry.currentOpacity);
        entry.htmlDivRef.current.style.pointerEvents = entry.currentOpacity > 0.35 ? 'auto' : 'none';
      }
    }
  });

  return (
    <group ref={localRootRef}>
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
            <Html center={false} distanceFactor={distanceFactor}>
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
                onPointerDown={(e) => e.stopPropagation()}
                className="select-none cursor-pointer flex flex-col transition-opacity duration-200"
                style={{
                  transform: isLeft ? 'translate(calc(-100% - 6px), -50%)' : 'translate(6px, -50%)',
                  alignItems: isLeft ? 'flex-end' : 'flex-start',
                  textAlign: isLeft ? 'right' : 'left',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                {/* Machine Name in Pure White (#FFFFFF), Space Grotesk, Regular (400) */}
                <span
                  style={{
                    color: '#FFFFFF',
                    fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
                    fontSize: '13.5px',
                    fontWeight: 400,
                    letterSpacing: '0.04em',
                    lineHeight: 1.2,
                    opacity: isActive ? 1.0 : 0.92,
                    transition: 'opacity 0.2s ease',
                    userSelect: 'none',
                  }}
                >
                  {m.name}
                </span>

                {/* Coordinates in Muted White (#B8B8B8, ~75% opacity), 10.5px, Regular (400) */}
                <span
                  style={{
                    color: '#B8B8B8',
                    fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
                    fontSize: '10.5px',
                    fontWeight: 400,
                    letterSpacing: '0.05em',
                    lineHeight: 1.2,
                    marginTop: '3.5px',
                    opacity: isActive ? 0.95 : 0.75,
                    transition: 'opacity 0.2s ease',
                    userSelect: 'none',
                  }}
                >
                  {formatMarsCalloutCoordinates(m.lat, m.lon)}
                </span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
