const fs = require('fs');
const path = 'C:/Users/Hassaan Abbasi/.gemini/antigravity/brain/7621c619-6e4d-4c90-af9a-66bd3cb9d3fd/.user_uploaded/media_1794728075236_bff7940e.txt';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split(/\r?\n/);
for (let i = 540; i < 645; i++) {
  console.log(`[${i}] ${lines[i]}`);
}
