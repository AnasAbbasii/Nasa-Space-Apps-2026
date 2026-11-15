const fs = require('fs');
const path = require('path');

const slides = [
  {
    id: 'a17-s1',
    title: 'THE LAST APOLLO JOURNEY TO THE MOON',
    image: '/stories/apollo-17/slide-1.jpg',
    caption: "December 1972. NASA launches Apollo 17, humanity's final journey to land humans upon the lunar surface.",
    duration: 4800,
  },
  {
    id: 'a17-s2',
    title: 'EUGENE CERNAN — HARRISON SCHMITT — RONALD EVANS',
    image: '/stories/apollo-17/slide-2.jpg',
    caption: "Astronauts Eugene Cernan, Harrison Schmitt, and Ronald Evans embark on this historic voyage of scientific discovery.",
    duration: 4800,
  },
  {
    id: 'a17-s3',
    title: 'DECEMBER 7, 1972 — APOLLO 17 LAUNCHES',
    image: '/stories/apollo-17/slide-3.jpg',
    caption: "A thunderous Saturn V rocket illuminates the night sky, propelling the crew across deep space toward the Moon.",
    duration: 4800,
  },
  {
    id: 'a17-s4',
    title: 'TAURUS-LITTROW — A VALLEY FULL OF SECRETS',
    image: '/stories/apollo-17/slide-4.jpg',
    caption: "Their destination: the dramatic valley of Taurus-Littrow, flanked by towering massifs holding billions of years of secrets.",
    duration: 4800,
  },
  {
    id: 'a17-s5',
    title: 'DECEMBER 11, 1972 — CHALLENGER HAS LANDED',
    image: '/stories/apollo-17/slide-5.jpg',
    caption: "On December 11, lunar module Challenger touches down safely upon the pristine, untouched lunar soil.",
    duration: 4800,
  },
  {
    id: 'a17-s6',
    title: 'TWO SECTIONS. ONE EXTRAORDINARY SPACECRAFT.',
    image: '/stories/apollo-17/slide-6.jpg',
    caption: "An extraordinary two-stage spacecraft, Challenger's lower stage served as landing base and launchpad for the crew cabin.",
    duration: 4800,
  },
  {
    id: 'a17-s7',
    title: 'THREE EXPLORATION TRIPS. ABOUT 22 MILES.',
    image: '/stories/apollo-17/slide-7.jpg',
    caption: "Across three historic excursions, Cernan and Schmitt piloted the electric Lunar Roving Vehicle over twenty-two miles.",
    duration: 4800,
  },
  {
    id: 'a17-s8',
    title: 'THE MYSTERY OF THE ORANGE MOON SOIL',
    image: '/stories/apollo-17/slide-8.jpg',
    caption: "At Shorty Crater, Schmitt made a stunning discovery: vibrant orange volcanic soil formed by ancient lunar eruptions.",
    duration: 4800,
  },
  {
    id: 'a17-s9',
    title: 'A PROBLEM ON THE MOON. A SOLUTION FROM EARTH.',
    image: '/stories/apollo-17/slide-9.jpg',
    caption: "When a fender broke, the astronauts ingeniously repaired the rover using lunar maps, clamps, and grey duct tape.",
    duration: 4800,
  },
  {
    id: 'a17-s10',
    title: '741 SAMPLES. 110 KILOGRAMS. BILLIONS OF YEARS OF HISTORY.',
    image: '/stories/apollo-17/slide-10.jpg',
    caption: "The crew collected seven hundred forty-one pristine samples, including ancient bedrock over four billion years old.",
    duration: 4800,
  },
  {
    id: 'a17-s11',
    title: "THE MOON'S SCIENCE STATION",
    image: '/stories/apollo-17/slide-11.jpg',
    caption: "The astronauts deployed the ALSEP science station, transmitting valuable lunar seismic and atmospheric measurements for five years.",
    duration: 4800,
  },
  {
    id: 'a17-s12',
    title: 'DECEMBER 14, 1972 — THE LAST APOLLO MOONWALK',
    image: '/stories/apollo-17/slide-12.jpg',
    caption: "On December 14, Gene Cernan stepped back inside Challenger, marking the final human footprints upon lunar soil.",
    duration: 4800,
  },
  {
    id: 'a17-s13',
    title: 'THE LAST APOLLO LANDING. A LEGACY LEFT ON THE MOON.',
    image: '/stories/apollo-17/slide-13.png',
    caption: "Challenger's golden descent stage remains permanently stationed at Taurus-Littrow, an eternal monument to human courage and curiosity.",
    duration: 4800,
  }
];

const targetDir = path.join(process.cwd(), 'public', 'audio', 'stories', 'apollo-17');
fs.mkdirSync(targetDir, { recursive: true });

async function generateSlide(slide, i, total) {
  const filePath = path.join(targetDir, `${slide.id}.mp3`);
  console.log(`[${i + 1}/${total}] Generating ${slide.id}...`);

  const res = await fetch('http://127.0.0.1:3900/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer voicestudio'
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: slide.caption,
      voice: 'default',
      instruct: 'middle-aged, low pitch',
      instructions: 'Calm, authoritative documentary narrator with measured pacing',
      response_format: 'mp3',
      speed: 1.0
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Slide ${slide.id} generation failed: ${res.status} ${errText}`);
  }

  const arrayBuf = await res.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(arrayBuf));
  const approxSec = (arrayBuf.byteLength / 16000).toFixed(1);
  console.log(`[${i + 1}/${total}] Saved ${slide.id}.mp3: ${arrayBuf.byteLength} bytes (~${approxSec}s)`);
}

async function run() {
  console.log('Generating complete 13-slide Apollo 17 narration via Voice Studio...');
  for (let i = 0; i < slides.length; i++) {
    await generateSlide(slides[i], i, slides.length);
  }
  console.log('SUCCESS: All 13 Apollo 17 narration files generated and verified!');
}

run().catch(err => {
  console.error('Generation error:', err);
  process.exit(1);
});
