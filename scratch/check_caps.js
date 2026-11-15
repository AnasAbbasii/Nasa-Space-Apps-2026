const fs = require('fs');
const content = fs.readFileSync('lib/stories-data.ts', 'utf8');

// Match story blocks and count words per slide
const storyBlocks = content.split(/['"]([a-zA-Z0-9_-]+)['"]\s*:\s*\{/);
for (let i = 1; i < storyBlocks.length; i += 2) {
  const key = storyBlocks[i];
  const block = storyBlocks[i+1];
  const captionMatches = block.match(/caption:\s*['"`]([\s\S]*?)['"`],/g);
  if (captionMatches) {
    const wordCounts = captionMatches.map(c => {
      const text = c.replace(/caption:\s*['"`]/, '').replace(/['"`],$/, '');
      return text.trim().split(/\s+/).length;
    });
    const avg = Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length);
    console.log(`Key: ${key} (${captionMatches.length} slides, avg ${avg} words/slide, min ${Math.min(...wordCounts)}, max ${Math.max(...wordCounts)})`);
  }
}
