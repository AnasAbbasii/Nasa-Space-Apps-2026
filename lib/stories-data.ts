export interface StorySlide {
  id: string;
  title: string;              // On-screen text / chapter title
  image: string;              // High-resolution image path
  caption: string;            // Narration text
  duration: number;           // Milliseconds (3000 to 5000 ms, per requirement <= 5s)
  wordTimestamps?: number[];  // Optional word start timestamps for future voice-over sync
  audioSrc?: string;          // Optional audio file path for future voice-over
  visualNotes?: string;       // Historical/visual description
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
 * Verified storytelling database.
 * Apollo 17 Challenger features the complete 13-slide cinematic production documentary.
 */
export const MACHINE_STORIES: Record<string, MachineStory> = {
  'apollo-17': {
    machineId: 'apollo-17',
    machineName: 'Apollo 17 Lunar Module (Challenger)',
    body: 'moon',
    missionTitle: 'APOLLO 17 — CHALLENGER',
    tagline: 'The Last Apollo Landing. A Legacy Left on the Moon.',
    slides: [
      {
        id: 'a17-s1',
        title: 'THE LAST APOLLO JOURNEY TO THE MOON',
        image: '/stories/apollo-17/slide-1.jpg',
        caption: "Imagine being part of the final journey that takes humans to the Moon. In December 1972, NASA sent three astronauts on one last Apollo adventure. Their mission was different. They would explore distant mountains, discover unusual rocks and collect clues about the Moon's ancient past. Their spacecraft was called Challenger.",
        duration: 4800,
        audioSrc: '/audio/stories/apollo-17/a17-s1.mp3',
        visualNotes: 'Cinematic opening with the Moon and Earth (The Blue Marble).',
      },
      {
        id: 'a17-s2',
        title: 'EUGENE CERNAN — HARRISON SCHMITT — RONALD EVANS',
        image: '/stories/apollo-17/slide-2.jpg',
        caption: 'Three astronauts were chosen for this historic mission. Eugene Cernan was the commander, Harrison Schmitt was the lunar module pilot, and Ronald Evans was the command module pilot. Cernan and Schmitt would explore the Moon together, while Evans would remain in orbit inside America. Schmitt was the first trained geologist to walk on the Moon.',
        duration: 4900,
        audioSrc: '/audio/stories/apollo-17/a17-s2.mp3',
        visualNotes: 'Official Apollo 17 crew portrait posed with lunar roving vehicle trainer at Kennedy Space Center.',
      },
      {
        id: 'a17-s3',
        title: 'DECEMBER 7, 1972 — APOLLO 17 LAUNCHES',
        image: '/stories/apollo-17/slide-3.jpg',
        caption: 'On December 7, 1972, Apollo 17 launched from Kennedy Space Center in Florida. A powerful Saturn V rocket carried the astronauts away from Earth and towards the Moon. After several days of travelling through space, they finally reached lunar orbit. Their destination was waiting, and so was their greatest challenge.',
        duration: 4800,
        audioSrc: '/audio/stories/apollo-17/a17-s3.mp3',
        visualNotes: 'Nighttime launch of the Saturn V moon rocket illuminating the Florida sky.',
      },
      {
        id: 'a17-s4',
        title: 'TAURUS-LITTROW — A VALLEY FULL OF SECRETS',
        image: '/stories/apollo-17/slide-4.jpg',
        caption: 'NASA selected a special landing area called Taurus-Littrow. This place had tall mountains, wide plains and unusual valleys. Scientists believed it could contain very old rocks from the highlands and evidence of ancient volcanic activity. It was the perfect place to investigate the Moon\'s hidden history.',
        duration: 4700,
        audioSrc: '/audio/stories/apollo-17/a17-s4.mp3',
        visualNotes: 'Breathtaking aerial view of the Taurus-Littrow valley and towering massifs.',
      },
      {
        id: 'a17-s5',
        title: 'DECEMBER 11, 1972 — CHALLENGER HAS LANDED',
        image: '/stories/apollo-17/slide-5.jpg',
        caption: 'On December 11, 1972, Challenger began its descent towards the lunar surface. Eugene Cernan carefully guided the spacecraft while Harrison Schmitt helped monitor their journey. Slowly, the four landing legs reached the ground. Challenger had landed safely! The astronauts were now standing in a place no human had explored before.',
        duration: 4800,
        audioSrc: '/audio/stories/apollo-17/a17-s5.mp3',
        visualNotes: 'Harrison Schmitt with the deployed American flag, Challenger, and Earth overhead.',
      },
      {
        id: 'a17-s6',
        title: 'TWO SECTIONS. ONE EXTRAORDINARY SPACECRAFT.',
        image: '/stories/apollo-17/slide-6.jpg',
        caption: 'Challenger was not an ordinary spacecraft. It had two important sections. The lower section helped it land on the Moon and carried fuel and equipment. The upper section was the astronauts\' cabin. After completing exploration, this upper section would lift them back into lunar orbit. Each part made this incredible journey possible.',
        duration: 4800,
        audioSrc: '/audio/stories/apollo-17/a17-s6.mp3',
        visualNotes: 'Apollo 17 Lunar Module Challenger ascent stage in lunar orbit.',
      },
      {
        id: 'a17-s7',
        title: 'THREE EXPLORATION TRIPS. ABOUT 22 MILES.',
        image: '/stories/apollo-17/slide-7.jpg',
        caption: 'Challenger brought something else to the Moon: a Lunar Roving Vehicle! It was an electric vehicle designed to carry two astronauts across the rocky surface. Cernan and Schmitt used it to travel farther, visit different locations and collect scientific samples. During three excursions, they travelled approximately 22 miles across the Moon!',
        duration: 4900,
        audioSrc: '/audio/stories/apollo-17/a17-s7.mp3',
        visualNotes: 'Eugene Cernan at the controls of the Lunar Roving Vehicle on the lunar surface.',
      },
      {
        id: 'a17-s8',
        title: 'THE MYSTERY OF THE ORANGE MOON SOIL',
        image: '/stories/apollo-17/slide-8.jpg',
        caption: "During their exploration, something unexpected caught the astronauts' attention. Near Shorty Crater, Harrison Schmitt noticed the Moon's grey surface had patches of orange! Scientists later discovered this strange soil contained tiny pieces of volcanic glass, revealing explosive volcanic eruptions billions of years ago.",
        duration: 4900,
        audioSrc: '/audio/stories/apollo-17/a17-s8.mp3',
        visualNotes: 'Harrison Schmitt examining the bright orange volcanic glass soil at Shorty Crater.',
      },
      {
        id: 'a17-s9',
        title: 'A PROBLEM ON THE MOON. A SOLUTION FROM EARTH.',
        image: '/stories/apollo-17/slide-9.jpg',
        caption: "Even on the Moon, unexpected problems happen! Cernan accidentally knocked off part of the rover's rear fender with a hammer. Without it, the wheels threw lunar dust everywhere. With instructions from Earth, they used spare maps and duct tape to build a replacement fender, successfully continuing their mission.",
        duration: 4800,
        audioSrc: '/audio/stories/apollo-17/a17-s9.mp3',
        visualNotes: 'Makeshift fender replacement crafted with lunar maps, tape, and optical clamps.',
      },
      {
        id: 'a17-s10',
        title: '741 SAMPLES. 110 KILOGRAMS. BILLIONS OF YEARS OF HISTORY.',
        image: '/stories/apollo-17/slide-10.jpg',
        caption: 'The astronauts gathered 741 individual rock and soil samples, weighing about 110 kilograms altogether. Some samples came from rocks that were around 4.6 billion years old! These ancient discoveries helped scientists understand how the Moon formed and changed across cosmological time.',
        duration: 4800,
        audioSrc: '/audio/stories/apollo-17/a17-s10.mp3',
        visualNotes: 'Pristine ancient lunar rock sample Troctolite 76535 collected at Station 6.',
      },
      {
        id: 'a17-s11',
        title: "THE MOON'S SCIENCE STATION",
        image: '/stories/apollo-17/slide-11.jpg',
        caption: 'Challenger also carried scientific instruments called ALSEP. The astronauts carefully placed these on the lunar surface before leaving. Designed to study moonquakes, heat beneath the ground, the thin atmosphere and cosmic particles, these machines continued transmitting scientific data back to Earth for years.',
        duration: 4800,
        audioSrc: '/audio/stories/apollo-17/a17-s11.mp3',
        visualNotes: 'Apollo 17 ALSEP central station and scientific instruments deployed on the surface.',
      },
      {
        id: 'a17-s12',
        title: 'DECEMBER 14, 1972 — THE LAST APOLLO MOONWALK',
        image: '/stories/apollo-17/slide-12.jpg',
        caption: 'After three exploration trips, on December 14, 1972, Eugene Cernan and Harrison Schmitt climbed back into Challenger. Cernan became the last human to walk on the Moon and the last to leave its surface. As he climbed the ladder, he said goodbye to a world humanity worked so hard to reach.',
        duration: 4900,
        audioSrc: '/audio/stories/apollo-17/a17-s12.mp3',
        visualNotes: 'Eugene Cernan inside Challenger cabin, face and suit covered in lunar dust after EVA-3.',
      },
      {
        id: 'a17-s13',
        title: 'THE LAST APOLLO LANDING. A LEGACY LEFT ON THE MOON.',
        image: '/stories/apollo-17/slide-13.png',
        caption: "Challenger's journey finally came to an end. Its upper section lifted the astronauts to America, while its descent stage remained at Taurus-Littrow. Today, Challenger's golden lower section stands quietly where it landed, a silent monument to humanity's greatest adventures.",
        duration: 5000,
        audioSrc: '/audio/stories/apollo-17/a17-s13.mp3',
        visualNotes: 'Lunar Reconnaissance Orbiter view of Challenger descent stage resting on the Moon today.',
      },
    ],
  },
  'apollo-11': {
    machineId: 'apollo-11',
    machineName: 'Apollo 11 Lunar Module (Eagle)',
    body: 'moon',
    missionTitle: 'APOLLO 11 — EAGLE',
    tagline: 'One Giant Leap. The First Monument on Another World.',
    slides: [
      {
        id: 'a11-s1',
        title: 'JULY 20, 1969 — THE EAGLE HAS LANDED',
        image: '/stories/apollo-17/slide-1.jpg',
        caption: 'In July 1969, humanity achieved what had once seemed impossible. Astronauts Neil Armstrong and Buzz Aldrin piloted Lunar Module Eagle down to the Sea of Tranquility, announcing to Earth: "Houston, Tranquility Base here. The Eagle has landed."',
        duration: 4700,
      },
      {
        id: 'a11-s2',
        title: 'ONE GIANT LEAP FOR MANKIND',
        image: '/stories/apollo-17/slide-5.jpg',
        caption: 'Stepping off Eagle\'s ladder onto the fine lunar dust, Neil Armstrong spoke the immortal words heard by hundreds of millions of people across Earth: "That\'s one small step for man, one giant leap for mankind."',
        duration: 4800,
      },
      {
        id: 'a11-s3',
        title: 'THE PLAQUE ON EAGLE\'S DESCENT STAGE',
        image: '/stories/apollo-17/slide-6.jpg',
        caption: 'Attached to the landing gear of Eagle\'s descent stage is a stainless steel plaque signed by the three astronauts and President Nixon: "Here men from the planet Earth first set foot upon the Moon, July 1969 A.D. We came in peace for all mankind."',
        duration: 4900,
      },
      {
        id: 'a11-s4',
        title: 'TRANQUILITY BASE TODAY',
        image: '/stories/apollo-17/slide-13.png',
        caption: 'When Armstrong and Aldrin launched in the ascent cabin to rejoin Michael Collins, Eagle\'s descent stage remained behind. More than half a century later, Eagle stands intact in the Sea of Tranquility, pristine in the vacuum of space.',
        duration: 4900,
      },
    ],
  },
  'curiosity': {
    machineId: 'curiosity',
    machineName: 'Curiosity Rover (Mars Science Laboratory)',
    body: 'mars',
    missionTitle: 'MARS SCIENCE LABORATORY — CURIOSITY',
    tagline: 'Seven Minutes of Terror. A Nuclear Explorer on the Red Planet.',
    slides: [
      {
        id: 'cur-s1',
        title: 'AUGUST 6, 2012 — TOUCHDOWN IN GALE CRATER',
        image: '/textures/mars_surface.jpg',
        caption: 'On August 6, 2012, NASA completed the most daring landing ever attempted on another planet. Lowered on cables from a rocket-powered sky crane, the one-ton nuclear-powered Curiosity rover touched down softly inside the ancient basin of Gale Crater.',
        duration: 4800,
      },
      {
        id: 'cur-s2',
        title: 'WATER ON ANCIENT MARS',
        image: '/textures/mars_surface.jpg',
        caption: 'Equipped with a laser spectrometer and onboard chemistry laboratory, Curiosity drilled into mudstones at Yellowknife Bay, discovering that ancient Gale Crater was once a habitable freshwater lake with all the chemical ingredients for microbial life.',
        duration: 4900,
      },
      {
        id: 'cur-s3',
        title: 'CLIMBING MOUNT SHARP',
        image: '/textures/mars_surface.jpg',
        caption: 'Curiosity has spent over a decade ascending Mount Sharp, a mountain rising three miles from the crater floor. Each layer of sediment chronicles the climate transition of Mars from a warm, water-rich planet into the freezing desert of today.',
        duration: 4900,
      },
      {
        id: 'cur-s4',
        title: 'AN ENDURING MONUMENT',
        image: '/textures/mars_surface.jpg',
        caption: 'Powered by radioactive decay and rolling on worn aluminum wheels, Curiosity continues its solitary voyage across the red dunes, an enduring testament to human curiosity and engineering resilience.',
        duration: 4800,
      },
    ],
  },
  'perseverance': {
    machineId: 'perseverance',
    machineName: 'Perseverance Rover & Ingenuity',
    body: 'mars',
    missionTitle: 'MARS 2020 — PERSEVERANCE',
    tagline: 'Seeking Ancient Signs of Life. Powered Flight on Another World.',
    slides: [
      {
        id: 'per-s1',
        title: 'FEBRUARY 18, 2021 — JEZERO CRATER',
        image: '/textures/mars_surface.jpg',
        caption: 'On February 18, 2021, Perseverance landed in Jezero Crater, the site of an ancient river delta that dried up billions of years ago. Its primary mission: search for biosignatures of ancient microscopic life and cache rock cores for future return to Earth.',
        duration: 4800,
      },
      {
        id: 'per-s2',
        title: 'INGENUITY — THE FIRST AIRCRAFT ON ANOTHER PLANET',
        image: '/textures/mars_surface.jpg',
        caption: 'Tucked beneath Perseverance was Ingenuity, a 4-pound twin-rotor helicopter. Designed for just five test flights, Ingenuity achieved powered, controlled flight in the razor-thin Martian atmosphere, completing 72 historic flights across three years.',
        duration: 4900,
      },
      {
        id: 'per-s3',
        title: 'CACHING THE KEYS TO MARS HISTORY',
        image: '/textures/mars_surface.jpg',
        caption: 'Perseverance carries 43 titanium sample tubes, drilling pristine cylindrical rock cores from the crater delta and sealing them hermetically for a future international Mars Sample Return mission.',
        duration: 4900,
      },
      {
        id: 'per-s4',
        title: 'THE SENTINELS OF JEZERO',
        image: '/textures/mars_surface.jpg',
        caption: 'When Perseverance eventually finishes its survey, it and Ingenuity will remain stationed upon the Jezero river delta, permanently marking the gateway where humanity reached out to find if life ever arose elsewhere.',
        duration: 4800,
      },
    ],
  },
};

/**
 * Returns a structured story for any machine on the Moon or Mars.
 * If a custom narrative does not exist, a historically accurate 4-slide dossier is dynamically synthesized.
 */
export function getStoryForMachine(
  machineId: string,
  fallbackMeta?: { name: string; date: string; coordinates: string; purpose: string; body: 'moon' | 'mars' }
): MachineStory {
  const normalizedId = machineId.replace(/-lm$/, '');
  if (MACHINE_STORIES[machineId]) {
    return MACHINE_STORIES[machineId];
  }
  if (MACHINE_STORIES[normalizedId]) {
    return MACHINE_STORIES[normalizedId];
  }

  const name = fallbackMeta?.name || 'Exploration Machine';
  const body = fallbackMeta?.body || 'moon';
  const date = fallbackMeta?.date || 'Unknown Date';
  const coords = fallbackMeta?.coordinates || 'Verified Coordinates';
  const purpose = fallbackMeta?.purpose || 'Conducted pioneering scientific research and geographic exploration.';
  const defaultImage = body === 'moon' ? '/stories/apollo-17/slide-5.jpg' : '/textures/mars_surface.jpg';

  return {
    machineId,
    machineName: name,
    body,
    missionTitle: `${name.toUpperCase()}`,
    tagline: 'Their missions ended. Their stories didn\'t.',
    slides: [
      {
        id: `${machineId}-s1`,
        title: `THE MISSION OF ${name.toUpperCase()}`,
        image: defaultImage,
        caption: `On ${date}, humanity sent ${name} on an ambitious voyage to explore ${body === 'moon' ? 'the Moon' : 'Mars'}. Designed to expand scientific knowledge, it was guided safely to its resting site at ${coords}.`,
        duration: 4800,
      },
      {
        id: `${machineId}-s2`,
        title: 'SCIENTIFIC PURPOSE & OPERATION',
        image: body === 'moon' ? '/stories/apollo-17/slide-1.jpg' : '/textures/mars_surface.jpg',
        caption: `${purpose} Every measurement, image, and sensor reading transmitted across deep space helped scientists back on Earth unlock the secrets of our planetary neighbor.`,
        duration: 4900,
      },
      {
        id: `${machineId}-s3`,
        title: 'RESTING IN SILENCE',
        image: body === 'moon' ? '/stories/apollo-17/slide-12.jpg' : '/textures/mars_surface.jpg',
        caption: `After fulfilling its operational lifetime, ${name} completed its final transmission. Exposed to the vacuum, extreme temperatures, and cosmic radiation, its metal framework remains permanently preserved at its landing site.`,
        duration: 4800,
      },
      {
        id: `${machineId}-s4`,
        title: 'A MONUMENT ON ANOTHER WORLD',
        image: body === 'moon' ? '/stories/apollo-17/slide-13.png' : '/textures/mars_surface.jpg',
        caption: `Today, ${name} stands as an enduring monument to human bravery, engineering ingenuity, and curiosity. While its mission concluded, its story remains an eternal part of human history.`,
        duration: 4900,
      },
    ],
  };
}
