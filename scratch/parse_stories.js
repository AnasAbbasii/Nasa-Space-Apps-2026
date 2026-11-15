const fs = require('fs');
const path = 'C:/Users/Hassaan Abbasi/.gemini/antigravity/brain/7621c619-6e4d-4c90-af9a-66bd3cb9d3fd/.user_uploaded/media_1794728075236_bff7940e.txt';
const raw = fs.readFileSync(path, 'utf8');
const lines = raw.split(/\r?\n/);

let storyStarts = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Format: 16:9 Cinematic Slideshow')) {
    storyStarts.push(i);
  }
}

storyStarts.forEach((idx, num) => {
  console.log(`\n=== STORY ${num + 1} (around line ${idx}) ===`);
  for (let k = Math.max(0, idx - 15); k <= idx + 3; k++) {
    console.log(`[${k}] ${lines[k]}`);
  }
});
