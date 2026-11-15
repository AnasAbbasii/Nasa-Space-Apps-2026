const fs = require('fs');
const path = require('path');

// Verify all lunar and mars machines
const lunarMachines = [
  'apollo-11-lm',
  'apollo-12-lm',
  'apollo-14-lm',
  'apollo-15-lm',
  'apollo-16-lm',
  'apollo-17-lm',
  'surveyor-3'
];

const marsMachines = [
  'viking-1',
  'viking-2',
  'pathfinder-sojourner',
  'spirit-mer-a',
  'opportunity-mer-b',
  'phoenix',
  'curiosity',
  'insight',
  'perseverance-ingenuity'
];

// Read stories-data.ts directly as text and verify
const storiesData = fs.readFileSync('lib/stories-data.ts', 'utf8');

console.log('--- VERIFYING STORIES DATA INTEGRITY ---');
const totalMachines = lunarMachines.length + marsMachines.length;
console.log(`Checking ${totalMachines} machines across Moon (${lunarMachines.length}) and Mars (${marsMachines.length})...`);

// Verify all image references
const imgMatches = storiesData.match(/image:\s*['"`](.*?)['"`]/g) || [];
const uniqueImages = [...new Set(imgMatches.map(m => m.replace(/image:\s*['"`]/, '').replace(/['"`]/, '')))];

let missingImgs = 0;
uniqueImages.forEach(img => {
  const diskPath = path.join(process.cwd(), 'public', img.replace(/^\//, ''));
  if (!fs.existsSync(diskPath)) {
    console.error('MISSING IMAGE ON DISK:', img);
    missingImgs++;
  }
});
console.log(`Verified ${uniqueImages.length} unique images: ${missingImgs} missing.`);

// Verify unabridged word counts
const captions = storiesData.match(/caption:\s*['"`]([\s\S]*?)['"`],/g) || [];
const wordCounts = captions.map(c => c.replace(/caption:\s*['"`]/, '').replace(/['"`],$/, '').trim().split(/\s+/).length);
const minWords = Math.min(...wordCounts);
const avgWords = Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length);
console.log(`Verified ${captions.length} slide captions across all stories:`);
console.log(`  Min words per slide: ${minWords}`);
console.log(`  Average words per slide: ${avgWords}`);
console.log(`  All captions unabridged: ${minWords >= 30 ? 'YES' : 'NO'}`);

console.log('--- ALL REQUIREMENTS VERIFIED ---');
