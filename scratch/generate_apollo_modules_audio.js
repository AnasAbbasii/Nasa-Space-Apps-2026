const fs = require('fs');
const path = require('path');
const http = require('http');

// Load parsed stories
const scriptFile = 'C:/Users/Hassaan Abbasi/.gemini/antigravity/brain/7621c619-6e4d-4c90-af9a-66bd3cb9d3fd/.user_uploaded/media_1794728075236_bff7940e.txt';
const raw = fs.readFileSync(scriptFile, 'utf8');

// Find Story 1
const lines = raw.split(/\r?\n/);
const slides = [];
let currentSlide = null;

for (let i = 0; i < 270; i++) {
  const line = lines[i].trim();
  const slideMatch = line.match(/^SLIDE\s+(\d+)\s*(?:[\uFFFD\-\–\—:]|\s)\s*(.*)$/i);
  if (slideMatch) {
    currentSlide = {
      number: parseInt(slideMatch[1]),
      title: slideMatch[2].trim().replace(/^[\uFFFD\-\–\—:]\s*/, ''),
      voiceover: ''
    };
    slides.push(currentSlide);
    continue;
  }
  if (currentSlide && line.startsWith('Voice-over:')) {
    let vo = line.replace(/^Voice-over:\s*/, '').trim();
    let k = i + 1;
    while (k < 270) {
      const nextLine = lines[k].trim();
      if (nextLine.startsWith('VISUAL DIRECTION:') || nextLine.startsWith('ON-SCREEN TEXT:') || 
          nextLine.startsWith('AUDIO / SOUND:') || nextLine.startsWith('AUDIO DIRECTION:') || 
          nextLine.startsWith('SLIDE ') || nextLine.startsWith('FINAL SCREEN')) {
        break;
      }
      if (nextLine) vo += (vo ? ' ' : '') + nextLine;
      k++;
    }
    vo = vo.replace(/^["'“]/, '').replace(/["'”]$/, '').trim();
    currentSlide.voiceover = vo;
  }
}

console.log(`Parsed ${slides.length} slides for Apollo Lunar Modules.`);

async function synthesize(text) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: 'default',
      response_format: 'mp3'
    });

    const req = http.request('http://127.0.0.1:3900/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer voicestudio',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(Buffer.concat(chunks));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${Buffer.concat(chunks).toString()}`));
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  const outDir = path.join(process.cwd(), 'public', 'audio', 'stories', 'apollo-17');
  fs.mkdirSync(outDir, { recursive: true });

  for (const s of slides) {
    const file = path.join(outDir, `a17-s${s.number}.mp3`);
    console.log(`Generating Slide ${s.number} (${s.voiceover.split(' ').length} words)...`);
    const start = Date.now();
    try {
      const buf = await synthesize(s.voiceover);
      fs.writeFileSync(file, buf);
      console.log(`Saved a17-s${s.number}.mp3 (${buf.length} bytes in ${Date.now() - start}ms)`);
    } catch (err) {
      console.error(`Error on slide ${s.number}:`, err.message);
    }
  }
  console.log('ALL 13 APOLLO SLIDES GENERATED!');
}

run();
