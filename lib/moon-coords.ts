import * as THREE from 'three';

// Moon radius in Three.js scene units
export const MOON_RADIUS = 2;
// Connection line height offset (how far models are lifted off surface for visibility)
export const MODEL_HEIGHT = 0.12;

/**
 * Convert geographic lat/lon (degrees) to a 3D point on a sphere of given radius.
 * Moon uses standard geographic convention: lat positive north, lon positive east.
 * Three.js SphereGeometry equirectangular mapping:
 * - v=0.5 (equator), u=0.5 (lon 0, near-side facing) -> (+radius, 0, 0)
 * - Eastward lon (+lon) increases u -> rotates toward -Z
 * - Northward lat (+lat) decreases v -> rises toward +Y
 */
export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(90 - lat);   // colatitude from north pole (+Y)
  const theta = THREE.MathUtils.degToRad(lon);        // eastward azimuth around Y
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    -radius * Math.sin(phi) * Math.sin(theta),
  );
}

/** Outward-pointing normal at a surface point */
export function surfaceNormal(pos: THREE.Vector3): THREE.Vector3 {
  return pos.clone().normalize();
}

/** Format coordinates in degrees with N/S and E/W notation */
export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
}
