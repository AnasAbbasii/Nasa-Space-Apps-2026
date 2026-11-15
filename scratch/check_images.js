const fs = require('fs');
const path = require('path');

function checkFile(relPath) {
  const full = path.join(process.cwd(), 'public', relPath.replace(/^\//, ''));
  return fs.existsSync(full);
}

const content = fs.readFileSync('lib/stories-data.ts', 'utf8');
const imgMatches = content.match(/image:\s*['"`](.*?)['"`]/g) || [];
const uniqueImages = [...new Set(imgMatches.map(m => m.replace(/image:\s*['"`]/, '').replace(/['"`]/, '')))];

console.log('Total unique image paths referenced in stories-data.ts:', uniqueImages.length);
let missing = 0;
uniqueImages.forEach(img => {
  const exists = checkFile(img);
  if (!exists) {
    console.log('MISSING:', img);
    missing++;
  }
});
if (missing === 0) {
  console.log('All referenced images exist in public/ folder!');
}
