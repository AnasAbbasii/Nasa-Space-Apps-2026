const fs = require('fs');
const content = fs.readFileSync('C:/Users/Hassaan Abbasi/.gemini/antigravity/brain/7621c619-6e4d-4c90-af9a-66bd3cb9d3fd/.user_uploaded/media_1794728075236_bff7940e.txt', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.toLowerCase().includes('curiosity')) console.log(`line ${i}: ${l.trim()}`);
});
