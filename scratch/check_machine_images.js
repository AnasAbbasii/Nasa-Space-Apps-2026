const fs = require('fs');
const content = fs.readFileSync('lib/stories-data.ts', 'utf8');

const regex = /['"]([a-zA-Z0-9_-]+)['"]\s*:\s*\{[\s\S]*?slides:\s*\[([\s\S]*?)\]\s*\},/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const machineKey = match[1];
  const slidesContent = match[2];
  const imgMatches = slidesContent.match(/image:\s*['"`](.*?)['"`]/g) || [];
  console.log(`Machine ${machineKey} has ${imgMatches.length} slide images. First: ${imgMatches[0]}`);
}
