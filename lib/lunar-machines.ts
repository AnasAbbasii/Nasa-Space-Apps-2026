// Verified coordinates for lunar machines left on the Moon.
// Sources: NASA mission records, NSSDCA, Lunar Reconnaissance Orbiter data.
// shortcut: Apollo 11 Descent Stage coords are approximate (±0.001°), upgrade when LRO pixel-level confirmed.

export interface LunarMachine {
  id: string;
  name: string;
  missionName: string;
  agency: string;
  country: string;
  lat: number;       // degrees, positive = north
  lon: number;       // degrees, positive = east
  landingDate: string;
  purpose: string;
  leftBehind: string;
  significance: string;
  currentStatus: string;
  modelPath: string | null;   // null = no local model
  modelType: 'glb' | 'dae' | null;
  textureBasePath?: string;
}

export const LUNAR_MACHINES: LunarMachine[] = [
  {
    id: 'apollo-11-lm',
    name: 'Apollo 11 Lunar Module Descent Stage (Eagle)',
    missionName: 'Apollo 11',
    agency: 'NASA',
    country: 'United States',
    lat: 0.6741,
    lon: 23.4322,
    landingDate: 'July 20, 1969',
    purpose: 'Carried the first humans to the lunar surface and served as a launch pad for the ascent stage.',
    leftBehind: 'The ascent stage was jettisoned into lunar orbit after the crew returned to the Command Module. The descent stage remains where it landed.',
    significance: 'First crewed spacecraft to land on another world. Neil Armstrong and Buzz Aldrin stepped onto the Moon from this vehicle.',
    currentStatus: 'Descent stage remains on the surface at Tranquility Base. Photographed by the Lunar Reconnaissance Orbiter.',
    modelPath: '/3dmodels/moon/Apollo Lunar Module.glb',
    modelType: 'glb',
  },
  {
    id: 'apollo-12-lm',
    name: 'Apollo 12 Lunar Module Descent Stage (Intrepid)',
    missionName: 'Apollo 12',
    agency: 'NASA',
    country: 'United States',
    lat: -3.0128,
    lon: -23.4219,
    landingDate: 'November 19, 1969',
    purpose: 'Second crewed lunar landing. Precision landing near Surveyor 3 for comparative study.',
    leftBehind: 'Descent stage left at landing site. Ascent stage deliberately crashed into the Moon to calibrate seismometers.',
    significance: 'Demonstrated precision landing capability. Astronauts walked to Surveyor 3 and retrieved parts for analysis.',
    currentStatus: 'Descent stage remains at the Ocean of Storms. Surveyor 3 is nearby.',
    modelPath: '/3dmodels/moon/Apollo Lunar Module.glb',
    modelType: 'glb',
  },
  {
    id: 'apollo-14-lm',
    name: 'Apollo 14 Lunar Module Descent Stage (Antares)',
    missionName: 'Apollo 14',
    agency: 'NASA',
    country: 'United States',
    lat: -3.6453,
    lon: -17.4714,
    landingDate: 'February 5, 1971',
    purpose: 'Third crewed lunar landing. Explored Fra Mauro highlands, original target of Apollo 13.',
    leftBehind: 'Descent stage left at landing site. Ascent stage crashed into Moon.',
    significance: 'Collected oldest lunar rocks; Alan Shepard famously hit golf balls on the Moon.',
    currentStatus: 'Descent stage remains at Fra Mauro. Imaged by LRO.',
    modelPath: '/3dmodels/moon/Apollo Lunar Module.glb',
    modelType: 'glb',
  },
  {
    id: 'apollo-15-lm',
    name: 'Apollo 15 Lunar Module Descent Stage (Falcon)',
    missionName: 'Apollo 15',
    agency: 'NASA',
    country: 'United States',
    lat: 26.1322,
    lon: 3.6339,
    landingDate: 'July 30, 1971',
    purpose: 'First J-mission with Lunar Roving Vehicle. Extended surface operations at Hadley-Apennine.',
    leftBehind: 'Descent stage at Hadley-Apennine. First mission to leave a Lunar Roving Vehicle on the surface.',
    significance: 'Collected Genesis Rock — 4-billion-year-old anorthosite — confirming lunar differentiation theory.',
    currentStatus: 'Both the descent stage and Lunar Roving Vehicle remain at the site. Imaged by LRO.',
    modelPath: '/3dmodels/moon/Apollo Lunar Module.glb',
    modelType: 'glb',
  },
  {
    id: 'apollo-16-lm',
    name: 'Apollo 16 Lunar Module Descent Stage (Orion)',
    missionName: 'Apollo 16',
    agency: 'NASA',
    country: 'United States',
    lat: -8.9734,
    lon: 15.5011,
    landingDate: 'April 21, 1972',
    purpose: 'Explored Descartes Highlands to study ancient volcanic terrain.',
    leftBehind: 'Descent stage at Descartes Highlands. Lunar Roving Vehicle remains nearby.',
    significance: 'Discovered that Descartes was not volcanic but formed by meteorite impacts — overturning pre-mission theory.',
    currentStatus: 'Hardware remains on surface. Photographed by LRO.',
    modelPath: '/3dmodels/moon/Apollo Lunar Module.glb',
    modelType: 'glb',
  },
  {
    id: 'apollo-17-lm',
    name: 'Apollo 17 Lunar Module Descent Stage (Challenger)',
    missionName: 'Apollo 17',
    agency: 'NASA',
    country: 'United States',
    lat: 20.1911,
    lon: 30.7723,
    landingDate: 'December 11, 1972',
    purpose: 'Final crewed Apollo mission. Taurus-Littrow valley exploration with geologist Harrison Schmitt.',
    leftBehind: 'Descent stage at Taurus-Littrow. Lunar Roving Vehicle, ALSEP station, and plaque reading "We came in peace" remain.',
    significance: 'Last humans on the Moon. Collected the most samples. Plaque reads: "Here man completed his first explorations of the Moon."',
    currentStatus: 'All hardware remains undisturbed. Detailed LRO imagery confirms intact state.',
    modelPath: '/3dmodels/moon/Apollo Lunar Module.glb',
    modelType: 'glb',
  },
  {
    id: 'surveyor-3',
    name: 'Surveyor 3',
    missionName: 'Surveyor 3',
    agency: 'NASA',
    country: 'United States',
    lat: -3.0183,
    lon: -23.3972,
    landingDate: 'April 20, 1967',
    purpose: 'Soft-landed on the Moon to photograph the surface and test soil mechanics before crewed Apollo landings.',
    leftBehind: 'Entire spacecraft left on surface. Apollo 12 landed nearby; astronauts retrieved parts of Surveyor 3 for Earth study.',
    significance: 'First spacecraft whose parts were retrieved from another world by humans. Bacteria found on its camera were controversially claimed to have survived 2.5 years in space.',
    currentStatus: 'Remains on the Ocean of Storms near Apollo 12. Camera and pieces in museums on Earth.',
    modelPath: '/3dmodels/moon/Surveyor/model.dae',
    modelType: 'dae',
    textureBasePath: '/3dmodels/moon/Surveyor/model/',
  },
];

// Moon model information
export const MOON_MODEL_URL = 'https://solarsystem.nasa.gov/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcllRIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--7d626e5badbf2157a4fa43b9e891ab22ca767f3e/Moon_1_3474.glb';
// shortcut: Moon is built as a Three.js sphere with UV-mapped texture. If NASA GLB loads, it replaces the sphere. If offline, sphere is used.
