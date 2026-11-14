import * as THREE from 'three';

// Mars radius in Three.js scene units for the dedicated Mars Museum view
export const MARS_RADIUS = 2;

/**
 * Convert geographic lat/lon (degrees) to a 3D point on the Martian sphere.
 * Mars texture from NASA Landed hardware dataset uses planetocentric east-positive longitude.
 * Formula from original project source:
 * a = lat * PI / 180
 * o = lon * PI / 180
 * x = -r * cos(a) * cos(o)
 * y =  r * sin(a)
 * z =  r * cos(a) * sin(o)
 */
export function marsLatLonToVector3(lat: number, lon: number, radius = MARS_RADIUS): THREE.Vector3 {
  const a = THREE.MathUtils.degToRad(lat);
  const o = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(
    -radius * Math.cos(a) * Math.cos(o),
    radius * Math.sin(a),
    radius * Math.cos(a) * Math.sin(o),
  );
}

/** Outward surface normal on Mars */
export function marsSurfaceNormal(pos: THREE.Vector3): THREE.Vector3 {
  return pos.clone().normalize();
}

/** Format coordinates in degrees with N/S and E/W notation */
export function formatMarsCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const normLon = lon > 180 ? lon - 360 : lon;
  const lonDir = normLon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(normLon).toFixed(4)}° ${lonDir} (${lon.toFixed(2)}° E)`;
}
