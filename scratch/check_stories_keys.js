const fs = require('fs');
const content = fs.readFileSync('lib/stories-data.ts', 'utf8');

// Check which machine keys exist in STORIES map
const keys = [];
const regex = /['"]([a-zA-Z0-9_-]+)['"]\s*:\s*\{/g;
let match;
while ((match = regex.exec(content)) !== null) {
  keys.push(match[1]);
}
console.log('Keys in stories-data.ts:', keys);
