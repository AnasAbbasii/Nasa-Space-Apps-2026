const fs = require('fs');
const path = require('path');

const scriptFile = 'C:/Users/Hassaan Abbasi/.gemini/antigravity/brain/7621c619-6e4d-4c90-af9a-66bd3cb9d3fd/.user_uploaded/media_1794728075236_bff7940e.txt';
const raw = fs.readFileSync(scriptFile, 'utf8');

function parseScript(text) {
  const lines = text.split(/\r?\n/);
  const stories = [];
  let currentStory = null;
  let currentSlide = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.includes('Format: 16:9 Cinematic Slideshow')) {
      let title = '';
      for (let k = i - 1; k >= Math.max(0, i - 15); k--) {
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

    // Slide line: e.g. "SLIDE 1  THE MACHINES THAT TOOK HUMANS TO THE MOON"
    const slideMatch = line.match(/^SLIDE\s+(\d+)\s*(?:[\uFFFD\-\–\—:]|\s)\s*(.*)$/i);
    if (slideMatch) {
      currentSlide = {
        number: parseInt(slideMatch[1]),
        title: slideMatch[2].trim().replace(/^[\uFFFD\-\–\—:]\s*/, ''),
        voiceover: '',
        onScreenText: '',
      };
      currentStory.slides.push(currentSlide);
      continue;
    }

    if (currentSlide && line.startsWith('ON-SCREEN TEXT:')) {
      let ost = line.replace(/^ON-SCREEN TEXT:\s*/, '').trim();
      let k = i + 1;
      while (k < lines.length) {
        const nextLine = lines[k].trim();
        if (nextLine.startsWith('SLIDE ') || nextLine.startsWith('Voice-over:') || nextLine.startsWith('VISUAL DIRECTION:') || nextLine.startsWith('FINAL SCREEN') || nextLine.includes('Format: 16:9 Cinematic Slideshow')) {
          break;
        }
        if (nextLine) ost += (ost ? ' ' : '') + nextLine;
        k++;
      }
      currentSlide.onScreenText = ost;
    }

    if (currentSlide && line.startsWith('Voice-over:')) {
      let vo = line.replace(/^Voice-over:\s*/, '').trim();
      let k = i + 1;
      while (k < lines.length) {
        const nextLine = lines[k].trim();
        if (nextLine.startsWith('VISUAL DIRECTION:') || nextLine.startsWith('ON-SCREEN TEXT:') || 
            nextLine.startsWith('AUDIO / SOUND:') || nextLine.startsWith('AUDIO DIRECTION:') || 
            nextLine.startsWith('SLIDE ') || nextLine.startsWith('FINAL SCREEN') || 
            nextLine.includes('Format: 16:9 Cinematic Slideshow')) {
          break;
        }
        if (nextLine) {
          vo += (vo ? ' ' : '') + nextLine;
        }
        k++;
      }
      vo = vo.replace(/^["'“]/, '').replace(/["'”]$/, '').trim();
      currentSlide.voiceover = vo;
    }
  }
  return stories;
}

const stories = parseScript(raw);
console.log('Parsed stories:', stories.length);
stories.forEach((s, idx) => console.log(`${idx + 1}: ${s.title} (${s.slides.length} slides)`));
