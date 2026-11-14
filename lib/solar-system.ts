export interface CelestialBody {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'satellite';
  orbitRadius: number;       // Visualization scene units from Sun
  planetRadius: number;      // Visualization scene units
  orbitalSpeed: number;      // Relative speed factor
  axialTilt: number;         // Degrees
  rotationSpeed: number;     // Axial rotation speed
  color: string;             // Ambient fallback color
  fbxPath: string | null;
  texturePath: string | null;
  ringTexturePath?: string;
  // Scientifically verified astronomical data
  distanceFromSun: string;
  diameter: string;
  orbitalPeriod: string;
  rotationPeriod: string;
  summary: string;
}

export const CELESTIAL_BODIES: CelestialBody[] = [
  {
    id: 'sun',
    name: 'The Sun',
    type: 'star',
    orbitRadius: 0,
    planetRadius: 2.2,
    orbitalSpeed: 0,
    axialTilt: 7.25,
    rotationSpeed: 0.004,
    color: '#ffaa33',
    fbxPath: '/3dmodels/sun/source/UnstableStar.fbx',
    texturePath: '/3dmodels/sun/textures/suncyl1.jpg',
    distanceFromSun: '0 km (Center)',
    diameter: '1,392,700 km',
    orbitalPeriod: 'N/A (Galactic Orbit: ~230M yrs)',
    rotationPeriod: '25 - 35 Earth days',
    summary:
      'A yellow dwarf star (G2V) comprising 99.86% of the solar system\'s total mass. Its gravitational field anchors every orbiting planet, while its thermonuclear core provides radiant energy sustaining planetary systems.',
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'planet',
    orbitRadius: 5.5,
    planetRadius: 0.44,
    orbitalSpeed: 0.38,
    axialTilt: 177.3, // Retrograde rotation
    rotationSpeed: -0.002,
    color: '#e3bb7b',
    fbxPath: '/3dmodels/venus/source/Venus.fbx',
    texturePath: '/3dmodels/venus/textures/8k_venus_surface.jpg',
    distanceFromSun: '108.2 million km (0.72 AU)',
    diameter: '12,104 km',
    orbitalPeriod: '224.7 Earth days',
    rotationPeriod: '243 Earth days (Retrograde)',
    summary:
      'Second planet from the Sun and Earth\'s closest planetary neighbor. Enveloped by an opaque blanket of sulfuric acid clouds with a crushing carbon dioxide atmosphere and surface temperatures reaching 465 °C.',
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'planet',
    orbitRadius: 8.8,
    planetRadius: 0.48,
    orbitalSpeed: 0.26,
    axialTilt: 23.44,
    rotationSpeed: 0.015,
    color: '#4b70dd',
    fbxPath: '/3dmodels/earth/source/Earth.fbx',
    texturePath: '/3dmodels/earth/textures/1_earth_8k.jpg',
    distanceFromSun: '149.6 million km (1.00 AU)',
    diameter: '12,742 km',
    orbitalPeriod: '365.25 days',
    rotationPeriod: '23h 56m 4s',
    summary:
      'The third planet from the Sun and the only known harbor of life in the universe. Accompanied by the Moon—humanity\'s first step beyond our world and the primary destination of our lunar exploration archives.',
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'planet',
    orbitRadius: 11.4,
    planetRadius: 0.42,
    orbitalSpeed: 0.20,
    axialTilt: 25.19,
    rotationSpeed: 0.014,
    color: '#c1440e',
    fbxPath: null,
    texturePath: '/textures/mars_surface.jpg',
    distanceFromSun: '227.9 million km (1.52 AU)',
    diameter: '6,779 km (0.53× Earth)',
    orbitalPeriod: '687 Earth days (1.88 yrs)',
    rotationPeriod: '24h 37m 22s (1 Sol)',
    summary:
      'The Red Planet. A cold, desert world with a thin carbon dioxide atmosphere, ancient river valleys, towering shield volcanoes, and the legendary resting sites of humanity\'s robotic rovers and landers.',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'planet',
    orbitRadius: 14.8,
    planetRadius: 0.95,
    orbitalSpeed: 0.14,
    axialTilt: 26.73,
    rotationSpeed: 0.02,
    color: '#e2bf7d',
    fbxPath: '/3dmodels/saturn/source/saturn.fbx',
    texturePath: '/3dmodels/saturn/textures/Uv1_saturn1_diff.png',
    ringTexturePath: '/3dmodels/saturn/textures/Uv1_saturn2_diff.png',
    distanceFromSun: '1.43 billion km (9.58 AU)',
    diameter: '116,460 km (9.1× Earth)',
    orbitalPeriod: '29.4 Earth years',
    rotationPeriod: '10h 33m',
    summary:
      'The ringed jewel of the outer solar system. A gas giant encircled by an iconic, expansive system of rings composed of billions of water-ice fragments, orbiting dust, and shepherd moons.',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'planet',
    orbitRadius: 19.5,
    planetRadius: 0.68,
    orbitalSpeed: 0.09,
    axialTilt: 97.77, // Extreme sideways tilt
    rotationSpeed: -0.015,
    color: '#70d6db',
    fbxPath: '/3dmodels/uranus/source/uranus.fbx',
    texturePath: '/3dmodels/uranus/textures/Uv1_uranus1_diff.png',
    distanceFromSun: '2.87 billion km (19.2 AU)',
    diameter: '50,724 km (4.0× Earth)',
    orbitalPeriod: '84.0 Earth years',
    rotationPeriod: '17h 14m (Retrograde)',
    summary:
      'An ice giant with an extreme 98° axial tilt, causing it to effectively roll along its orbital path. Its pale cyan color is produced by atmospheric methane absorbing red wavelengths of sunlight.',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'planet',
    orbitRadius: 24.5,
    planetRadius: 0.65,
    orbitalSpeed: 0.06,
    axialTilt: 28.32,
    rotationSpeed: 0.018,
    color: '#2b5fd9',
    fbxPath: '/3dmodels/neptune/source/Neptune.fbx',
    texturePath: '/3dmodels/neptune/textures/Planeta_Base_Color.jpg',
    distanceFromSun: '4.50 billion km (30.1 AU)',
    diameter: '49,244 km (3.9× Earth)',
    orbitalPeriod: '164.8 Earth years',
    rotationPeriod: '16h 6m',
    summary:
      'The most distant major planet in the solar system. A dynamic ice giant exhibiting the fastest recorded planetary winds in the solar system, exceeding 2,100 km/h in its deep blue atmosphere.',
  },
];
