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
  moons: string;
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
    orbitalPeriod: 'N/A (~230M yr Galactic Orbit)',
    rotationPeriod: '25 - 35 Earth days',
    moons: 'None (8 Planets, 5+ Dwarf Planets)',
    summary:
      'A yellow dwarf star (G2V) comprising 99.86% of the solar system\'s total mass. Its gravitational field anchors every orbiting world, while its core sustains planetary life through radiant thermonuclear energy.',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'planet',
    orbitRadius: 3.8,
    planetRadius: 0.35,
    orbitalSpeed: 0.48,
    axialTilt: 0.034,
    rotationSpeed: 0.003,
    color: '#9e9e9e',
    fbxPath: null,
    texturePath: null,
    distanceFromSun: '57.9 million km (0.39 AU)',
    diameter: '4,879 km (0.38× Earth)',
    orbitalPeriod: '88.0 Earth days',
    rotationPeriod: '58.6 Earth days',
    moons: '0',
    summary:
      'The innermost planet and smallest terrestrial world. Possessing virtually no atmosphere, its ancient cratered surface endures extreme thermal swings between -180 °C and 430 °C.',
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
    diameter: '12,104 km (0.95× Earth)',
    orbitalPeriod: '224.7 Earth days',
    rotationPeriod: '243 Earth days (Retrograde)',
    moons: '0',
    summary:
      'Enveloped by an impenetrable blanket of sulfuric acid clouds, Venus suffers a runaway greenhouse effect generating a crushing 92-bar atmosphere and 465 °C surface temperatures.',
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
    orbitalPeriod: '365.25 days (1.00 Year)',
    rotationPeriod: '23h 56m 4s (1 Day)',
    moons: '1 (The Moon)',
    summary:
      'The vibrant blue world and only confirmed oasis of life. Accompanied by the Moon—humanity\'s first interplanetary stepping stone and the resting home of our earliest lunar machines.',
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
    orbitalPeriod: '687 Earth days (1.88 Years)',
    rotationPeriod: '24h 37m 22s (1 Sol)',
    moons: '2 (Phobos & Deimos)',
    summary:
      'The Red Planet. A cold desert world featuring colossal shield volcanoes, deep rift valleys, and the historic landing sites of humanity\'s intrepid robotic explorers.',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'planet',
    orbitRadius: 13.0,
    planetRadius: 1.15,
    orbitalSpeed: 0.16,
    axialTilt: 3.13,
    rotationSpeed: 0.03,
    color: '#c99056',
    fbxPath: null,
    texturePath: null,
    distanceFromSun: '778.5 million km (5.20 AU)',
    diameter: '139,820 km (11.0× Earth)',
    orbitalPeriod: '11.86 Earth years',
    rotationPeriod: '9h 55m 30s',
    moons: '95 verified (Io, Europa, Ganymede, Callisto)',
    summary:
      'The king of planets, exceeding 2.5 times the mass of all other planets combined. A majestic gas giant sculptured by vibrant ammonia cloud bands and centuries-old anticyclonic storms.',
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
    rotationPeriod: '10h 33m 38s',
    moons: '146 verified (Titan, Enceladus, Mimas)',
    summary:
      'The crown jewel of the outer solar system, encircled by a dazzling ring system spanning 282,000 kilometers comprised of pure water-ice boulders, micro-crystals, and silicate dust.',
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
    rotationPeriod: '17h 14m 24s (Retrograde)',
    moons: '28 verified (Titania, Oberon, Umbriel)',
    summary:
      'An enigmatic ice giant rolling sideways along its orbit with an extreme 98° axial tilt. Its cyan haze is crafted by atmospheric methane absorbing red photons from sunlight.',
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
    rotationPeriod: '16h 6m 36s',
    moons: '16 verified (Triton, Proteus, Nereid)',
    summary:
      'The most distant major planet in the solar system. A supersonic ice giant driven by extreme atmospheric dynamics that produce storms and solar-system-record wind speeds exceeding 2,100 km/h.',
  },
];
