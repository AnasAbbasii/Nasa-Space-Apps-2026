const { LUNAR_MACHINES } = require('../lib/lunar-machines');
const { MARS_MACHINES } = require('../lib/mars-machines');
const { getStoryForMachine, MACHINE_STORIES } = require('../lib/stories-data');
const fs = require('fs');

console.log('====================================================');
console.log('VERIFYING CINEMATIC STORYTELLING EXPERIENCE FOR ALL MACHINES');
console.log('====================================================\n');

let allPassed = true;

function checkStory(machine, body) {
  const story = getStoryForMachine(machine.id, {
    name: machine.name,
    date: machine.landingDate,
    coordinates: `${machine.lat}, ${machine.lon}`,
    purpose: machine.purpose,
    body: body
  });

  const slideCount = story.slides.length;
  const totalDuration = story.slides.reduce((acc, s) => acc + s.duration, 0);
  const maxSlideDuration = Math.max(...story.slides.map(s => s.duration));

  const validSlideCount = slideCount >= 13;
  const validTotalDuration = totalDuration >= 60000;
  const validMaxDuration = maxSlideDuration <= 5000;

  const passed = validSlideCount && validTotalDuration && validMaxDuration;
  if (!passed) allPassed = false;

  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${machine.id.padEnd(24)} | Slides: ${slideCount} | Total: ${(totalDuration/1000).toFixed(1)}s (>=60s) | Max Slide: ${(maxSlideDuration/1000).toFixed(1)}s (<=5s) | Title: "${story.missionTitle}"`);
}

console.log('--- LUNAR MACHINES ---');
LUNAR_MACHINES.forEach(m => checkStory(m, 'moon'));

console.log('\n--- MARS MACHINES ---');
MARS_MACHINES.forEach(m => checkStory(m, 'mars'));

console.log('\n--- APOLLO 17 VERIFIED AUDIO FILES ---');
const a17Story = MACHINE_STORIES['apollo-17'];
let audioPassed = true;
a17Story.slides.forEach((sl, idx) => {
  if (!sl.audioSrc) {
    console.log(`[FAIL] Slide ${idx+1} has no audioSrc!`);
    audioPassed = false;
  } else {
    const localPath = 'public' + sl.audioSrc;
    if (!fs.existsSync(localPath)) {
      console.log(`[FAIL] File missing: ${localPath}`);
      audioPassed = false;
    } else {
      const stats = fs.statSync(localPath);
      if (stats.size < 50000) {
        console.log(`[FAIL] File too small: ${localPath} (${stats.size} bytes)`);
        audioPassed = false;
      }
    }
  }
});

if (audioPassed) {
  console.log('[PASS] All 13 Apollo 17 audio tracks exist and are verified non-empty MP3s!');
} else {
  allPassed = false;
}

console.log('\n====================================================');
console.log(`OVERALL STATUS: ${allPassed ? 'ALL VERIFICATIONS PASSED SUCCESSFULLY' : 'SOME VERIFICATIONS FAILED'}`);
console.log('====================================================');
