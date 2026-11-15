const fs = require('fs');
const path = require('path');
const dir = 'public/audio/stories/apollo-17';
fs.readdirSync(dir).forEach(f => {
  const stat = fs.statSync(path.join(dir, f));
  console.log(`${f}: ${stat.size} bytes (modified: ${stat.mtime.toLocaleTimeString()})`);
});
