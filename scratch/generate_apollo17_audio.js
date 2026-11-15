const fs = require('fs');
const path = require('path');

// Pull the Apollo 17 slides from lib/stories-data.ts directly
const slides = [
  {
    id: 'a17-s1',
    caption: "Imagine being part of the final journey that takes humans to the Moon. In December 1972, NASA sent three astronauts on one last Apollo adventure. Their mission was different. They would explore distant mountains, discover unusual rocks and collect clues about the Moon's ancient past. Their spacecraft was called Challenger."
  },
  {
    id: 'a17-s2',
    caption: "Three astronauts were chosen for this historic mission. Eugene Cernan was the commander, Harrison Schmitt was the lunar module pilot, and Ronald Evans was the command module pilot. Cernan and Schmitt would explore the Moon together, while Evans would remain in orbit inside America. Schmitt was the first trained geologist to walk on the Moon."
  },
  {
    id: 'a17-s3',
    caption: "On December 7, 1972, Apollo 17 launched from Kennedy Space Center in Florida. A powerful Saturn V rocket carried the astronauts away from Earth and towards the Moon. After several days of travelling through space, they finally reached lunar orbit. Their destination was waiting, and so was their greatest challenge."
  },
  {
    id: 'a17-s4',
    caption: "NASA selected a special landing area called Taurus-Littrow. This place had tall mountains, wide plains and unusual valleys. Scientists believed it could contain very old rocks from the highlands and evidence of ancient volcanic activity. It was the perfect place to investigate the Moon's hidden history."
  },
  {
    id: 'a17-s5',
    caption: "On December 11, 1972, Challenger began its descent towards the lunar surface. Eugene Cernan carefully guided the spacecraft while Harrison Schmitt helped monitor their journey. Slowly, the four landing legs reached the ground. Challenger had landed safely! The astronauts were now standing in a place no human had explored before."
  },
  {
    id: 'a17-s6',
    caption: "Challenger was not an ordinary spacecraft. It had two important sections. The lower section helped it land on the Moon and carried fuel and equipment. The upper section was the astronauts' cabin. After completing exploration, this upper section would lift them back into lunar orbit. Each part made this incredible journey possible."
  },
  {
    id: 'a17-s7',
    caption: "Challenger brought something else to the Moon: a Lunar Roving Vehicle! It was an electric vehicle designed to carry two astronauts across the rocky surface. Cernan and Schmitt used it to travel farther, visit different locations and collect scientific samples. During three excursions, they travelled approximately 22 miles across the Moon!"
  },
  {
    id: 'a17-s8',
    caption: "During their exploration, something unexpected caught the astronauts' attention. Near Shorty Crater, Harrison Schmitt noticed the Moon's grey surface had patches of orange! Scientists later discovered this strange soil contained tiny pieces of volcanic glass, revealing explosive volcanic eruptions billions of years ago."
  },
  {
    id: 'a17-s9',
    caption: "While driving the rover, an unexpected accident broke one of its rear fenders. Without it, the wheels threw heavy clouds of sharp lunar dust everywhere. The astronauts needed a quick fix. Using lunar maps, clamps and grey duct tape, they built a replacement fender! It was simple, but it worked perfectly."
  },
  {
    id: 'a17-s10',
    caption: "Over three intense days, Cernan and Schmitt collected 741 rock and soil samples, weighing over 110 kilograms! Among them was Troctolite 76535, a pristine piece of lunar crust more than 4.2 billion years old. These treasures helped scientists unlock the early secrets of our solar system."
  },
  {
    id: 'a17-s11',
    caption: "Before leaving, the astronauts deployed the Apollo Lunar Surface Experiments Package. This miniature science station included instruments to measure moonquakes, cosmic heat, and the lunar atmosphere. Powered by a radioisotope thermoelectric generator, it continued transmitting vital data back to Earth for five years."
  },
  {
    id: 'a17-s12',
    caption: "After three exploration trips, on December 14, 1972, Eugene Cernan and Harrison Schmitt climbed back into Challenger. Cernan became the last human to walk on the Moon and the last to leave its surface. As he climbed the ladder, he said goodbye to a world humanity worked so hard to reach."
  },
  {
    id: 'a17-s13',
    caption: "Challenger's journey finally came to an end. Its upper section lifted the astronauts to America, while its descent stage remained at Taurus-Littrow. Today, Challenger's golden lower section stands quietly where it landed, a silent monument to humanity's greatest adventures."
  }
];

const targetDir = path.join(process.cwd(), 'public', 'audio', 'stories', 'apollo-17');
fs.mkdirSync(targetDir, { recursive: true });

async function generateSlideAudio(slide, index, total) {
  const filePath = path.join(targetDir, `${slide.id}.mp3`);
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
    console.log(`[${index + 1}/${total}] ${slide.id} already exists (${fs.statSync(filePath).size} bytes), skipping.`);
    return;
  }

  console.log(`[${index + 1}/${total}] Generating ${slide.id}...`);
  const res = await fetch('http://127.0.0.1:3900/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer voicestudio'
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: slide.caption,
      voice: 'default',
      response_format: 'mp3'
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to generate ${slide.id}: ${res.status} - ${errText}`);
  }

  const arrayBuf = await res.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(arrayBuf));
  console.log(`[${index + 1}/${total}] Saved ${slide.id} (${arrayBuf.byteLength} bytes)`);
}

async function run() {
  console.log(`Starting generation of ${slides.length} Apollo 17 audio clips...`);
  for (let i = 0; i < slides.length; i++) {
    await generateSlideAudio(slides[i], i, slides.length);
  }
  console.log('All Apollo 17 audio clips generated successfully!');
}

run().catch(err => {
  console.error('Batch generation error:', err);
  process.exit(1);
});
