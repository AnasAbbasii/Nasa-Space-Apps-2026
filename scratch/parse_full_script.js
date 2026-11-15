const fs = require('fs');
const path = 'C:/Users/Hassaan Abbasi/.gemini/antigravity/brain/7621c619-6e4d-4c90-af9a-66bd3cb9d3fd/.user_uploaded/media_1794728075236_bff7940e.txt';
const content = fs.readFileSync(path, 'utf8');

function parseAllStories(text) {
  const lines = text.split(/\r?\n/);
  const stories = [];
  let currentStory = null;
  let currentSlide = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for story start
    if (line.includes('Format: 16:9 Cinematic Slideshow')) {
      // Find title in lines above
      let title = '';
      for (let k = i - 1; k >= Math.max(0, i - 12); k--) {
        const l = lines[k].trim();
        if (l && !l.startsWith('*') && !l.startsWith('Audience') && !l.startsWith('Style') && 
            !l.startsWith('Project') && !l.startsWith('Planet') && !l.startsWith('Location') && 
            !l.startsWith('Duration') && !l.startsWith('Cinematic Documentary') && 
            !l.startsWith('FINAL SCREEN') && !l.startsWith('BEYOND THE MISSION') && !l.startsWith('THE MUSEUM')) {
          title = l;
          break;
        }
      }
      currentStory = { title, slides: [] };
      stories.push(currentStory);
      currentSlide = null;
      continue;
    }

    if (!currentStory) continue;

    // Check for slide header: e.g. "SLIDE 1  THE MACHINES THAT TOOK HUMANS TO THE MOON"
    const slideMatch = line.match(/^SLIDE\s+(\d+)\s*(?:[\uFFFD\-\–\—:]|\s)\s*(.*)$/i);
    if (slideMatch) {
      currentSlide = {
        number: parseInt(slideMatch[1]),
        title: slideMatch[2].trim(),
        voiceover: '',
        visualDirection: ''
      };
      currentStory.slides.push(currentSlide);
      continue;
    }

    // Voice-over capture
    if (currentSlide && line.startsWith('Voice-over:')) {
      let vo = line.replace(/^Voice-over:\s*/, '').trim();
      let k = i + 1;
      while (k < lines.length) {
        const nextLine = lines[k].trim();
        if (nextLine.startsWith('VISUAL DIRECTION:') || nextLine.startsWith('ON-SCREEN TEXT:') || 
            nextLine.startsWith('AUDIO / SOUND:') || nextLine.startsWith('SLIDE ') || 
            nextLine.startsWith('FINAL SCREEN') || nextLine.includes('Format: 16:9 Cinematic Slideshow')) {
          break;
        }
        if (nextLine) {
          vo += (vo ? ' ' : '') + nextLine;
        }
        k++;
      }
      // Clean quotes
      vo = vo.replace(/^["'“]/, '').replace(/["'”]$/, '').trim();
      currentSlide.voiceover = vo;
    }
  }
  return stories;
}

const parsed = parseAllStories(content);
console.log('Parsed stories count:', parsed.length);
parsed.forEach((s, i) => {
  console.log(`\nStory ${i + 1}: ${s.title} (${s.slides.length} slides)`);
  if (s.slides.length > 0) {
    console.log(`  Slide 1: [${s.slides[0].title}]`);
    console.log(`  Slide 1 VO (${s.slides[0].voiceover.split(/\s+/).length} words): "${s.slides[0].voiceover.substring(0, 90)}..."`);
    console.log(`  Slide 13: [${s.slides[s.slides.length - 1].title}]`);
    console.log(`  Slide 13 VO (${s.slides[s.slides.length - 1].voiceover.split(/\s+/).length} words): "${s.slides[s.slides.length - 1].voiceover.substring(0, 90)}..."`);
  }
});
