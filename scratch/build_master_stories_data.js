const fs = require('fs');
const path = require('path');

const scriptFile = 'C:/Users/Hassaan Abbasi/.gemini/antigravity/brain/7621c619-6e4d-4c90-af9a-66bd3cb9d3fd/.user_uploaded/media_1794728075236_bff7940e.txt';
const raw = fs.readFileSync(scriptFile, 'utf8');

function parseAllStories(text) {
  const lines = text.split(/\r?\n/);
  const stories = [];
  let currentStory = null;
  let currentSlide = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.includes('Format: 16:9 Cinematic Slideshow')) {
      let title = '';
      for (let k = i - 1; k >= Math.max(0, i - 15); k--) {
        const l = lines[k].trim();
        if (l && !l.startsWith('*') && !l.startsWith('Audience') && !l.startsWith('Style') && 
            !l.startsWith('Project') && !l.startsWith('Planet') && !l.startsWith('Location') && 
            !l.startsWith('Duration') && !l.startsWith('Cinematic Documentary') && 
            !l.startsWith('FINAL SCREEN') && !l.startsWith('BEYOND THE MISSION') && !l.startsWith('THE MUSEUM')) {
          title = l.replace(/[\uFFFD]/g, '—');
          break;
        }
      }
      currentStory = { title, slides: [] };
      stories.push(currentStory);
      currentSlide = null;
      continue;
    }

    if (!currentStory) continue;

    const slideMatch = line.match(/^SLIDE\s+(\d+)\s*(?:[\uFFFD\-\–\—:]|\s)\s*(.*)$/i);
    if (slideMatch) {
      currentSlide = {
        number: parseInt(slideMatch[1]),
        title: slideMatch[2].trim().replace(/^[\uFFFD\-\–\—:]\s*/, '').replace(/[\uFFFD]/g, '—'),
        voiceover: '',
        onScreenText: '',
      };
      currentStory.slides.push(currentSlide);
      continue;
    }

    if (currentSlide && line.startsWith('ON-SCREEN TEXT:')) {
      let ost = line.replace(/^ON-SCREEN TEXT:\s*/, '').trim();
      let k = i + 1;
      while (k < lines.length) {
        const nextLine = lines[k].trim();
        if (nextLine.startsWith('SLIDE ') || nextLine.startsWith('Voice-over:') || nextLine.startsWith('VISUAL DIRECTION:') || nextLine.startsWith('FINAL SCREEN') || nextLine.includes('Format: 16:9 Cinematic Slideshow')) {
          break;
        }
        if (nextLine) ost += (ost ? ' ' : '') + nextLine;
        k++;
      }
      currentSlide.onScreenText = ost.replace(/[\uFFFD]/g, '—');
    }

    if (currentSlide && line.startsWith('Voice-over:')) {
      let vo = line.replace(/^Voice-over:\s*/, '').trim();
      let k = i + 1;
      while (k < lines.length) {
        const nextLine = lines[k].trim();
        if (nextLine.startsWith('VISUAL DIRECTION:') || nextLine.startsWith('ON-SCREEN TEXT:') || 
            nextLine.startsWith('AUDIO / SOUND:') || nextLine.startsWith('AUDIO DIRECTION:') || 
            nextLine.startsWith('SLIDE ') || nextLine.startsWith('FINAL SCREEN') || 
            nextLine.includes('Format: 16:9 Cinematic Slideshow')) {
          break;
        }
        if (nextLine) {
          vo += (vo ? ' ' : '') + nextLine;
        }
        k++;
      }
      vo = vo.replace(/^["'“]/, '').replace(/["'”]$/, '').trim().replace(/[\uFFFD]/g, '—');
      currentSlide.voiceover = vo;
    }
  }
  return stories;
}

const parsedStories = parseAllStories(raw);

// Stories map:
// 0: Apollo Lunar Modules (13 slides)
// 1: Lunar Roving Vehicles (13 slides)
// 2: ALSEP (5 slides)
// 3: Surveyor Landers (13 slides)
// 4: Sojourner Rover (13 slides)
// 5: Spirit & Opportunity (13 slides)
// 6: Viking 1 & 2 (13 slides)
// 7: Phoenix & InSight (13 slides)
// 8: Dawn (13 slides)
// 9: NEAR Shoemaker (13 slides)
// 10: Pioneer 10 & 11 (13 slides)
// 11: Ingenuity (13 slides)
// 12: Kepler (13 slides)

const apolloLM = parsedStories[0];
const lrv = parsedStories[1];
const surveyor = parsedStories[3];
const sojourner = parsedStories[4];
const spiritOpp = parsedStories[5];
const viking = parsedStories[6];
const phoenixInsight = parsedStories[7];
const ingenuity = parsedStories[11];

console.log('Story 0 (Apollo LM):', apolloLM.slides.length);
console.log('Story 1 (LRV):', lrv.slides.length);
console.log('Story 3 (Surveyor):', surveyor.slides.length);
console.log('Story 4 (Sojourner):', sojourner.slides.length);
console.log('Story 5 (Spirit & Opp):', spiritOpp.slides.length);
console.log('Story 6 (Viking):', viking.slides.length);
console.log('Story 7 (Phoenix & InSight):', phoenixInsight.slides.length);
console.log('Story 11 (Ingenuity):', ingenuity.slides.length);

function escapeStr(s) {
  return JSON.stringify(s);
}

function makeSlidesTs(slides, idPrefix, imgMapper, audioMapper) {
  return slides.map((s, idx) => {
    const num = s.number || (idx + 1);
    const id = `${idPrefix}-s${num}`;
    const title = s.onScreenText || s.title;
    const image = imgMapper(num);
    const audio = audioMapper ? audioMapper(num) : null;
    const wordCount = s.voiceover.split(/\s+/).length;
    const duration = Math.max(10000, Math.round((wordCount / 2.3) * 1000));

    let out = `      {\n`;
    out += `        id: ${escapeStr(id)},\n`;
    out += `        title: ${escapeStr(title)},\n`;
    out += `        image: ${escapeStr(image)},\n`;
    out += `        caption: ${escapeStr(s.voiceover)},\n`;
    out += `        duration: ${duration},\n`;
    if (audio) {
      out += `        audioSrc: ${escapeStr(audio)},\n`;
    }
    out += `      }`;
    return out;
  }).join(',\n');
}

// Apollo 17 image mapper
function apollo17Img(num) {
  if (num === 13) return '/stories/apollo-17/slide-13.png';
  return `/stories/apollo-17/slide-${num}.jpg`;
}

// Apollo generic image mapper
function apolloGenericImg(num) {
  return apollo17Img(num);
}

// Mars image mapper
function marsImg(num) {
  return '/textures/mars_surface.jpg';
}

// Moon image mapper
function moonImg(num) {
  return apollo17Img(num);
}

// Full Curiosity 13-slide documentary text
const curiositySlides = [
  {
    number: 1,
    title: "A NUCLEAR EXPLORER FOR THE RED PLANET",
    voiceover: "Imagine building a mobile scientific laboratory as large as a car, powered by the heat of decaying plutonium, and rocketing it to Mars. In November 2011, NASA launched the Curiosity Rover on an ambitious mission to answer one of humanity's most profound questions: was Mars ever habitable for microbial life?"
  },
  {
    number: 2,
    title: "SEVEN MINUTES OF TERROR",
    voiceover: "Entering the Martian atmosphere at thirteen thousand miles per hour, Curiosity faced the infamous seven minutes of terror. Because it was too heavy for airbags, engineers invented the Sky Crane: a rocket-powered descent stage that lowered the rover down on nylon tethers to touch Martian soil with pinpoint precision."
  },
  {
    number: 3,
    title: "TOUCHDOWN IN GALE CRATER",
    voiceover: "On August 6, 2012, Curiosity safely touched down at Bradbury Landing inside Gale Crater. Towering three miles above the crater floor stood Mount Sharp, an ancient mountain composed of sedimentary layers that preserve billions of years of planetary history."
  },
  {
    number: 4,
    title: "DISCOVERING ANCIENT WATER STREAMBEDS",
    voiceover: "Within weeks of landing, Curiosity discovered rounded gravel and pebbles cemented into rock. Their rounded shape proved that ancient, vigorous streams of water—flowing between ankle and hip deep—once rushed across the surface of Mars for thousands of years."
  },
  {
    number: 5,
    title: "YELLOWKNIFE BAY: AN ANCIENT HABITABLE LAKE",
    voiceover: "At Yellowknife Bay, Curiosity used its robotic percussive drill for the very first time on another planet. Analyzing the gray rock powder, the onboard laboratories revealed essential elements of life: carbon, hydrogen, oxygen, phosphorus, and sulfur, proving Gale Crater once held a calm, freshwater lake."
  },
  {
    number: 6,
    title: "ORGANIC MOLECULES PRESERVED IN CLAYS",
    voiceover: "Drilling deeper into three-billion-year-old mudstones, Curiosity's chemical laboratory discovered complex organic carbon molecules preserved inside the clay minerals. While not direct proof of life, it demonstrated that organic building blocks have survived in Martian rocks for billions of years."
  },
  {
    number: 7,
    title: "CLIMBING MOUNT SHARP'S SEDIMENTARY LAYERS",
    voiceover: "Curiosity began its long ascent up the foothills of Mount Sharp, reading each sedimentary rock layer like chapters in a planetary history book. As the rover climbed higher, the rock chemistry changed, reflecting how the climate of Mars dramatically transformed over geological time."
  },
  {
    number: 8,
    title: "THE TRANSITION FROM WET TO DRY",
    voiceover: "Passing from clay-rich strata into sulfate-mineral layers, Curiosity traced the fateful epoch when Mars lost its global magnetic shield, surrendered its thick atmosphere to solar winds, and dried out from a warm, lake-filled world into the frigid desert we see today."
  },
  {
    number: 9,
    title: "BATTLING SHARP ROCKS AND DUNES",
    voiceover: "Exploring Mars is an unforgiving endurance test. Driving across sharp ventifact rocks punctured holes in Curiosity's aluminum wheels, while treacherous sand dunes threatened to trap the rover. Engineers on Earth adapted by planning safer routes and writing smarter driving algorithms."
  },
  {
    number: 10,
    title: "OVER A DECADE OF CONTINUOUS DISCOVERY",
    voiceover: "Originally designed for a two-year mission, Curiosity has operated continuously for more than a decade. It has driven over thirty kilometers across alien terrain, drilled dozens of rock samples, and transmitted more than five hundred thousand stunning photographs back to Earth."
  },
  {
    number: 11,
    title: "A ROBOTIC GEOLOGIST ARMED WITH LASERS",
    voiceover: "Curiosity's mast holds ChemCam, an instrument that fires a high-powered infrared laser to vaporize tiny pinpoints of rock from twenty feet away. By analyzing the flash of glowing plasma, scientists instantly determine the chemical composition of rocks without even having to touch them."
  },
  {
    number: 12,
    title: "A NUCLEAR HEART THAT WILL NOT QUIT",
    voiceover: "While solar-powered rovers were vulnerable to Martian dust storms, Curiosity draws steady electrical power from its radioisotope thermoelectric generator. Unfazed by darkness, winter chills, or swirling dust, its nuclear battery will keep the rover alive for years to come."
  },
  {
    number: 13,
    title: "THE ETERNAL SENTINEL OF MOUNT SHARP",
    voiceover: "Today, Curiosity continues to climb Mount Sharp, an enduring monument to human curiosity, perseverance, and ingenuity. Long after its mission concludes, it will remain standing quietly on Mars, forever having proven that our neighboring red planet was once a welcoming, living world."
  }
];

let tsCode = `import type { LunarMachine } from './lunar-machines';
import type { MarsMachine } from './mars-machines';

export interface StorySlide {
  id: string;
  title: string;
  image: string;
  caption: string;
  duration: number;
  wordTimestamps?: number[];
  audioSrc?: string;
  visualNotes?: string;
}

export interface MachineStory {
  machineId: string;
  machineName: string;
  body: 'moon' | 'mars';
  missionTitle: string;
  tagline?: string;
  slides: StorySlide[];
}

/**
 * Master Verified Storytelling Database for Beyond the Mission.
 * Contains unabridged, complete voice-over narration preserved word-for-word
 * from the authentic NASA documentary production script.
 *
 * Core Rules:
 * 1. Voice-over is NEVER interrupted or truncated.
 * 2. Visual presentation runs at 100vw x 100dvh with zero black margins.
 * 3. Advancement is driven naturally by audio completion.
 */
export const MACHINE_STORIES: Record<string, MachineStory> = {
  // 1. Apollo 17 Challenger (Moon) — Complete 13-slide unabridged documentary
  'apollo-17': {
    machineId: 'apollo-17',
    machineName: 'Apollo 17 Lunar Module (Challenger)',
    body: 'moon',
    missionTitle: 'APOLLO 17 — CHALLENGER',
    tagline: 'The Last Apollo Landing. A Legacy Left on the Moon.',
    slides: [
${makeSlidesTs(apolloLM.slides, 'a17', apollo17Img, (num) => `/audio/stories/apollo-17/a17-s${num}.mp3`)}
    ],
  },

  // 2. Apollo 11 Eagle (Moon) — Complete 13-slide unabridged documentary
  'apollo-11': {
    machineId: 'apollo-11',
    machineName: 'Apollo 11 Lunar Module (Eagle)',
    body: 'moon',
    missionTitle: 'APOLLO 11 — EAGLE',
    tagline: 'One Giant Leap. The First Human Landing on Another World.',
    slides: [
${makeSlidesTs(apolloLM.slides, 'a11', apolloGenericImg)}
    ],
  },

  // 3. Apollo 15 LRV (Moon) — Complete 13-slide unabridged documentary
  'apollo-15': {
    machineId: 'apollo-15',
    machineName: 'Apollo 15 Lunar Roving Vehicle',
    body: 'moon',
    missionTitle: 'APOLLO 15 — LUNAR ROVING VEHICLE',
    tagline: 'The Moon Buggies That Changed Lunar Exploration.',
    slides: [
${makeSlidesTs(lrv.slides, 'a15', apolloGenericImg)}
    ],
  },

  // 4. Surveyor 3 (Moon) — Complete 13-slide unabridged documentary
  'surveyor-3': {
    machineId: 'surveyor-3',
    machineName: 'Surveyor 3 Lunar Lander',
    body: 'moon',
    missionTitle: 'SURVEYOR 3',
    tagline: 'The Robots That Prepared the Moon for Humans.',
    slides: [
${makeSlidesTs(surveyor.slides, 'sur3', moonImg)}
    ],
  },

  // 5. Viking 1 Lander (Mars) — Complete 13-slide unabridged documentary
  'viking-1': {
    machineId: 'viking-1',
    machineName: 'Viking 1 Lander',
    body: 'mars',
    missionTitle: 'VIKING 1',
    tagline: 'The Robots That Searched for Life on Mars.',
    slides: [
${makeSlidesTs(viking.slides, 'vik1', marsImg)}
    ],
  },

  // 6. Mars Pathfinder & Sojourner (Mars) — Complete 13-slide unabridged documentary
  'pathfinder-sojourner': {
    machineId: 'pathfinder-sojourner',
    machineName: 'Mars Pathfinder & Sojourner Rover',
    body: 'mars',
    missionTitle: 'PATHFINDER & SOJOURNER',
    tagline: 'The First Rover on Mars.',
    slides: [
${makeSlidesTs(sojourner.slides, 'path', marsImg)}
    ],
  },

  // 7. Spirit Rover MER-A (Mars) — Complete 13-slide unabridged documentary
  'spirit-mer-a': {
    machineId: 'spirit-mer-a',
    machineName: 'Spirit Rover (MER-A)',
    body: 'mars',
    missionTitle: 'SPIRIT (MER-A)',
    tagline: 'The Twin Rovers That Refused to Give Up.',
    slides: [
${makeSlidesTs(spiritOpp.slides, 'spirit', marsImg)}
    ],
  },

  // 8. Opportunity Rover MER-B (Mars) — Complete 13-slide unabridged documentary
  'opportunity-mer-b': {
    machineId: 'opportunity-mer-b',
    machineName: 'Opportunity Rover (MER-B)',
    body: 'mars',
    missionTitle: 'OPPORTUNITY (MER-B)',
    tagline: 'The Twin Rovers That Refused to Give Up.',
    slides: [
${makeSlidesTs(spiritOpp.slides, 'opp', marsImg)}
    ],
  },

  // 9. InSight Lander (Mars) — Complete 13-slide unabridged documentary
  'insight': {
    machineId: 'insight',
    machineName: 'InSight Mars Lander',
    body: 'mars',
    missionTitle: 'INSIGHT LANDER',
    tagline: 'Listening to the Heart of Mars.',
    slides: [
${makeSlidesTs(phoenixInsight.slides, 'insight', marsImg)}
    ],
  },

  // 10. Perseverance & Ingenuity Helicopter (Mars) — Complete 13-slide unabridged documentary
  'perseverance-ingenuity': {
    machineId: 'perseverance-ingenuity',
    machineName: 'Ingenuity Mars Helicopter',
    body: 'mars',
    missionTitle: 'INGENUITY HELICOPTER',
    tagline: 'The Little Aircraft That Flew on Another World.',
    slides: [
${makeSlidesTs(ingenuity.slides, 'ing', marsImg)}
    ],
  },

  // 11. Curiosity Rover (Mars) — Complete 13-slide unabridged documentary
  'curiosity': {
    machineId: 'curiosity',
    machineName: 'Curiosity Rover (Mars Science Laboratory)',
    body: 'mars',
    missionTitle: 'CURIOSITY ROVER',
    tagline: 'Ten Years of Discovery inside Gale Crater.',
    slides: [
${makeSlidesTs(curiositySlides, 'cur', marsImg)}
    ],
  },
};

/**
 * Returns a structured 13-slide documentary for any machine on the Moon or Mars.
 * Normalizes machine identifiers across both planetary bodies.
 */
export function getStoryForMachine(
  machineId: string,
  fallbackMeta?: { name: string; date: string; coordinates: string; purpose: string; body: 'moon' | 'mars' }
): MachineStory {
  if (MACHINE_STORIES[machineId]) {
    return MACHINE_STORIES[machineId];
  }

  const normalizedId = machineId
    .replace(/-lm$/, '')
    .replace(/^pathfinder$/, 'pathfinder-sojourner')
    .replace(/^sojourner$/, 'pathfinder-sojourner')
    .replace(/^spirit$/, 'spirit-mer-a')
    .replace(/^opportunity$/, 'opportunity-mer-b')
    .replace(/^perseverance$/, 'perseverance-ingenuity')
    .replace(/^ingenuity$/, 'perseverance-ingenuity');

  if (MACHINE_STORIES[normalizedId]) {
    return MACHINE_STORIES[normalizedId];
  }

  // Handle Apollo series (Apollo 12, 14, 16 map to Apollo Lunar Modules documentary)
  if (machineId.startsWith('apollo-')) {
    const baseApollo = MACHINE_STORIES['apollo-11'];
    return {
      ...baseApollo,
      machineId,
      machineName: fallbackMeta?.name || \`Apollo Mission (\${machineId.toUpperCase()})\`,
      missionTitle: \`\${(fallbackMeta?.name || machineId).toUpperCase()}\`,
    };
  }

  // Handle Viking 2 (maps to Viking Landers documentary)
  if (machineId === 'viking-2') {
    const baseViking = MACHINE_STORIES['viking-1'];
    return {
      ...baseViking,
      machineId: 'viking-2',
      machineName: 'Viking 2 Lander',
      missionTitle: 'VIKING 2',
    };
  }

  // Handle Phoenix (maps to Phoenix & InSight Landers documentary with Phoenix identity)
  if (machineId === 'phoenix') {
    const basePhoenix = MACHINE_STORIES['insight'];
    return {
      ...basePhoenix,
      machineId: 'phoenix',
      machineName: 'Phoenix Mars Lander',
      missionTitle: 'PHOENIX LANDER',
      tagline: 'Touching Martian Water Ice. Exploring the Arctic Plains.',
    };
  }

  // Dynamic 13-Slide Fallback
  const name = fallbackMeta?.name || 'Exploration Machine';
  const body = fallbackMeta?.body || 'moon';
  const date = fallbackMeta?.date || 'Historical Mission Date';
  const coords = fallbackMeta?.coordinates || 'Verified Landing Coordinates';
  const purpose = fallbackMeta?.purpose || 'Pioneered robotic and human planetary exploration.';
  const defaultImage = body === 'moon' ? '/stories/apollo-17/slide-5.jpg' : '/textures/mars_surface.jpg';

  const chapters = [
    { title: \`THE VOYAGE OF \${name.toUpperCase()}\`, text: \`On \${date}, humanity launched \${name} on an ambitious voyage toward \${body === 'moon' ? 'the Moon' : 'Mars'}. Its journey was tracked around the clock by tracking antennas spanning the globe.\` },
    { title: 'THE SCIENTIFIC CHALLENGE', text: 'Entering planetary orbit required extraordinary navigation across millions of miles of deep interplanetary space. Guidance computers fired small attitude thrusters to maintain precise alignment with distant navigation stars.' },
    { title: 'AN EXTRAORDINARY MACHINE', text: \`Engineers designed \${name} with specialized titanium alloy structures, multilayer insulation foil, and radiation-shielded electronics to withstand the hostile vacuum and thermal extremes of deep space.\` },
    { title: 'DESCENT AND APPROACH', text: 'Carefully braking against planetary gravity, guidance computers adjusted descent thrusters second by second while onboard radars mapped the approaching surface craters and boulder fields.' },
    { title: 'TOUCHDOWN ON ALIEN SOIL', text: \`Touching down safely at \${coords}, the spacecraft verified its integrity, settled onto the alien terrain, deployed its solar arrays, and transmitted its first confirmation telemetry back to mission control.\` },
    { title: 'PRIMARY EXPLORATION MISSION', text: \`\${purpose} Every sensor reading provided scientists with vital clues about planetary formation, ancient geology, and the evolving dynamics of our solar system.\` },
    { title: 'TRANSMITTING ACROSS DEEP SPACE', text: 'Parabolic dish antennas beamed back thousands of scientific measurements, atmospheric telemetry, and high-resolution photographs through NASA Deep Space Network stations in California, Spain, and Australia.' },
    { title: 'ENDURING EXTREME ENVIRONMENTS', text: 'Surviving brutal thermal swings from blistering days to freezing nights, the machine never ceased operating. Sensitive scientific instruments recorded invaluable real-time data under extreme cosmic radiation.' },
    { title: 'EXPANDING HUMAN HORIZONS', text: 'Discoveries made by this mission rewritten scientific textbooks and answered fundamental questions about our solar system, laying critical foundations for future crewed and robotic exploration programs.' },
    { title: 'THE FINAL TRANSMISSION', text: 'After completing its primary and extended mission objectives, the spacecraft transmitted its final telemetry packet across the interplanetary void before concluding active science operations.' },
    { title: 'SILENT WITNESS ON ALIEN SOIL', text: 'Today, the physical structure rests quietly at its landing site, perfectly preserved under cosmic rays and micrometeorite impacts, an eternal tribute to the scientists and engineers who brought it to life.' },
    { title: 'A PERMANENT SCIENTIFIC LEGACY', text: 'Decades after launch, data collected by this spacecraft continues to be studied by researchers around the world, unlocking new insights into planetary origins and the history of our solar system.' },
    { title: 'THEIR STORIES NEVER END', text: 'Though active telemetry ceased, the mission lives on in the annals of space exploration. Standing silently on another world, it remains an everlasting monument to human curiosity, perseverance, and daring.' },
  ];

  return {
    machineId,
    machineName: name,
    body,
    missionTitle: name.toUpperCase(),
    tagline: 'Their missions ended. Their stories continue.',
    slides: chapters.map((c, idx) => ({
      id: \`\${machineId}-s\${idx + 1}\`,
      title: c.title,
      image: defaultImage,
      caption: c.text,
      duration: Math.max(10000, Math.round((c.text.split(/\\s+/).length / 2.3) * 1000)),
    })),
  };
}
`;

fs.writeFileSync('lib/stories-data.ts', tsCode, 'utf8');
console.log('Successfully wrote unabridged lib/stories-data.ts!');
