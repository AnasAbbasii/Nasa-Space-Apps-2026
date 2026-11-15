const fs = require('fs');
const content = fs.readFileSync('lib/stories-data.ts', 'utf8');
const lines = content.split('\n');
const getStoryIdx = lines.findIndex(l => l.includes('function getStoryForMachine'));
if (getStoryIdx !== -1) {
  console.log(lines.slice(getStoryIdx + 30, getStoryIdx + 75).join('\n'));
}
