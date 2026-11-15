import type { LunarMachine } from './lunar-machines';
import type { MarsMachine } from './mars-machines';

export interface StorySlide {
  id: string;
  title: string;
  image: string;
  caption: string;
  duration: number;
  wordTimestamps?: number[];
  audioSrc?: string;
  visualNotes?: string;
}

export interface MachineStory {
  machineId: string;
  machineName: string;
  body: 'moon' | 'mars';
  missionTitle: string;
  tagline?: string;
  slides: StorySlide[];
}

/**
 * Master Verified Storytelling Database for Beyond the Mission.
 * Contains unabridged, complete voice-over narration preserved word-for-word
 * from the authentic NASA documentary production script.
 *
 * Core Rules:
 * 1. Voice-over is NEVER interrupted or truncated.
 * 2. Visual presentation runs at 100vw x 100dvh with zero black margins.
 * 3. Advancement is driven naturally by audio completion.
 */
export const MACHINE_STORIES: Record<string, MachineStory> = {
  // 1. Apollo 17 Challenger (Moon) — Complete 13-slide unabridged documentary
  'apollo-17': {
    machineId: 'apollo-17',
    machineName: 'Apollo 17 Lunar Module (Challenger)',
    body: 'moon',
    missionTitle: 'APOLLO 17 — CHALLENGER',
    tagline: 'The Last Apollo Landing. A Legacy Left on the Moon.',
    slides: [
      {
        id: "a17-s1",
        title: "THE MACHINE THAT MADE MOON LANDINGS POSSIBLE",
        image: "/stories/apollo-17/slide-1.jpg",
        caption: "Imagine travelling millions of miles through space and finally seeing the Moon right in front of you. But how would you get down to its surface? In the 1960s, NASA created an extraordinary spacecraft to solve this problem. It was called the Apollo Lunar Module. It would carry astronauts from space down to the Moon and bring them back again. Without this machine, the first human Moon landing would not have been possible.",
        duration: 31739,
        audioSrc: "/audio/stories/apollo-17/a17-s1.mp3",
      },
      {
        id: "a17-s2",
        title: "FROM LUNAR ORBIT TO THE MOON'S SURFACE",
        image: "/stories/apollo-17/slide-2.jpg",
        caption: "Reaching the Moon was only half the challenge. Astronauts also needed a safe way to travel from lunar orbit down to the surface and then return to space. Ordinary spacecraft were not designed for this special journey. NASA needed a completely different machine. The Apollo Lunar Module was built specifically to land on the Moon, support astronauts during exploration and launch them back into orbit.",
        duration: 28261,
        audioSrc: "/audio/stories/apollo-17/a17-s2.mp3",
      },
      {
        id: "a17-s3",
        title: "FOUR LEGS. TWO STAGES. ONE EXTRAORDINARY MISSION.",
        image: "/stories/apollo-17/slide-3.jpg",
        caption: "At first glance, the Apollo Lunar Module looked unusual. It had a strange shape, four long landing legs and a golden outer covering. It was not designed to look beautiful. Every part had an important job. Its unusual design helped it operate in space, land on the Moon and protect the astronauts during their exploration. It was a machine built for one extraordinary purpose.",
        duration: 27826,
        audioSrc: "/audio/stories/apollo-17/a17-s3.mp3",
      },
      {
        id: "a17-s4",
        title: "DESCENT STAGE — LANDING ASCENT STAGE — RETURNING",
        image: "/stories/apollo-17/slide-4.jpg",
        caption: "The Lunar Module had two main sections. The lower section was called the descent stage. It contained the engine that slowed the spacecraft down and helped it land safely. The upper section was called the ascent stage. It contained the astronauts' cabin and another engine that would carry them back into lunar orbit. Together, these two sections made one remarkable Moon-travelling machine.",
        duration: 26957,
        audioSrc: "/audio/stories/apollo-17/a17-s4.mp3",
      },
      {
        id: "a17-s5",
        title: "THE FINAL JOURNEY TOWARDS THE MOON",
        image: "/stories/apollo-17/slide-5.jpg",
        caption: "After launching from Earth, the Lunar Module travelled towards the Moon attached to the main spacecraft. Once the spacecraft reached lunar orbit, the Lunar Module separated and began its own journey towards the surface. Two astronauts were inside, preparing for one of the most important landings in human history. Their destination was no longer Earth. It was another world.",
        duration: 25652,
        audioSrc: "/audio/stories/apollo-17/a17-s5.mp3",
      },
      {
        id: "a17-s6",
        title: "A SAFE LANDING ON ANOTHER WORLD",
        image: "/stories/apollo-17/slide-6.jpg",
        caption: "Landing on the Moon was extremely difficult. There were no roads, no runways and no air to slow the spacecraft down. The Lunar Module had to use its powerful descent engine to reduce its speed carefully. The astronauts watched their instruments and searched for a safe place to land. Every second mattered. One mistake could put the entire mission in danger.",
        duration: 26522,
        audioSrc: "/audio/stories/apollo-17/a17-s6.mp3",
      },
      {
        id: "a17-s7",
        title: "A TEMPORARY HOME ON THE MOON",
        image: "/stories/apollo-17/slide-7.jpg",
        caption: "After landing, the Lunar Module became the astronauts' temporary home. Its upper section contained a pressurized cabin where they could breathe, communicate with Earth and control the spacecraft. They could also prepare their equipment before stepping outside. Although the cabin was small and crowded, it gave the astronauts a safe place to live and work while exploring the Moon.",
        duration: 25652,
        audioSrc: "/audio/stories/apollo-17/a17-s7.mp3",
      },
      {
        id: "a17-s8",
        title: "A SPACECRAFT THAT MADE SCIENCE POSSIBLE",
        image: "/stories/apollo-17/slide-8.jpg",
        caption: "But the Lunar Module was not just a place to stay. It was also the starting point for scientific exploration. Astronauts climbed down its ladder, walked across the lunar ground, collected rocks and soil, took photographs and placed scientific instruments on the surface. Every activity helped scientists back on Earth understand more about the Moon and its ancient history.",
        duration: 25652,
        audioSrc: "/audio/stories/apollo-17/a17-s8.mp3",
      },
      {
        id: "a17-s9",
        title: "ONE STAGE STAYS. THE OTHER RETURNS.",
        image: "/stories/apollo-17/slide-9.jpg",
        caption: "After the exploration was complete, it was time to leave the Moon. The astronauts climbed back into the upper section. Then something remarkable happened. The upper section separated from the lower section. The descent stage remained on the lunar surface, while the ascent stage fired its engine and carried the astronauts back into orbit. The machine had successfully completed its most important job.",
        duration: 27391,
        audioSrc: "/audio/stories/apollo-17/a17-s9.mp3",
      },
      {
        id: "a17-s10",
        title: "THE DESCENT STAGE REMAINS ON THE MOON",
        image: "/stories/apollo-17/slide-10.jpg",
        caption: "After the astronauts lifted off, the lower descent stage was left behind. It had completed its job and would never travel back to Earth. Its landing legs remained planted in the lunar soil, and the platform that had supported the astronauts during their stay became a permanent part of the lunar landscape. What was once a working spacecraft had now become a silent monument to human exploration.",
        duration: 29130,
        audioSrc: "/audio/stories/apollo-17/a17-s10.mp3",
      },
      {
        id: "a17-s11",
        title: "SILENT REMINDERS OF HUMAN EXPLORATION",
        image: "/stories/apollo-17/slide-11.jpg",
        caption: "Across the Apollo lunar landing missions, several Lunar Module descent stages were left behind on the Moon. They remain at their original landing locations, surrounded by footprints, scientific equipment and the marks of exploration. These machines are reminders of an incredible time when humans travelled to another world and proved that the impossible could become reality.",
        duration: 24348,
        audioSrc: "/audio/stories/apollo-17/a17-s11.mp3",
      },
      {
        id: "a17-s12",
        title: "THE MACHINES THAT CHANGED SPACE EXPLORATION",
        image: "/stories/apollo-17/slide-12.jpg",
        caption: "The Apollo Lunar Modules changed the way humans explored space. They proved that astronauts could travel between lunar orbit and the surface of another world. They helped scientists collect Moon rocks, conduct experiments and understand the lunar environment. Their engineering also taught future generations how to design machines for dangerous journeys beyond Earth.",
        duration: 23043,
        audioSrc: "/audio/stories/apollo-17/a17-s12.mp3",
      },
      {
        id: "a17-s13",
        title: "THEIR MISSIONS ENDED. THEIR STORIES REMAIN ON THE MOON. FINAL DOCUMENTARY AUDIO IDENTITY Narrator: * Warm, natural and engaging voice. * Simple English and clear pronunciation. * Moderate speaking speed. * Curious and adventurous storytelling. * Avoid robotic or overly dramatic delivery. Background music: * Cinematic orchestral space documentary. * Mysterious opening. * Suspenseful music during landing. * Adventurous music during exploration. * Emotional music during stage separation. * Inspirational music during the final scene. Sound effects: * Rocket launch. * Spacecraft engine sounds. * Radio communication. * Landing engine. * Landing impact. * Mechanical stage separation. * Rocket ignition during ascent. * Cinematic transitions. Audio mixing: * Keep narration louder and clearer than background music. * Sound effects should support the story, not distract from it. * Use smooth audio transitions between slides. * Avoid sudden changes in volume.",
        image: "/stories/apollo-17/slide-13.png",
        caption: "Today, the Apollo Lunar Modules are no longer flying. Their missions ended decades ago, but their lower descent stages remain on the Moon. They stand quietly where humans once explored another world. These machines were never designed to stay forever, yet they became part of lunar history. Their journeys may have ended, but their story will always remind us how far human curiosity can take us.",
        duration: 28696,
        audioSrc: "/audio/stories/apollo-17/a17-s13.mp3",
      }
    ],
  },

  // 2. Apollo 11 Eagle (Moon) — Complete 13-slide unabridged documentary
  'apollo-11': {
    machineId: 'apollo-11',
    machineName: 'Apollo 11 Lunar Module (Eagle)',
    body: 'moon',
    missionTitle: 'APOLLO 11 — EAGLE',
    tagline: 'One Giant Leap. The First Human Landing on Another World.',
    slides: [
      {
        id: "a11-s1",
        title: "THE MACHINE THAT MADE MOON LANDINGS POSSIBLE",
        image: "/stories/apollo-17/slide-1.jpg",
        caption: "Imagine travelling millions of miles through space and finally seeing the Moon right in front of you. But how would you get down to its surface? In the 1960s, NASA created an extraordinary spacecraft to solve this problem. It was called the Apollo Lunar Module. It would carry astronauts from space down to the Moon and bring them back again. Without this machine, the first human Moon landing would not have been possible.",
        duration: 31739,
      },
      {
        id: "a11-s2",
        title: "FROM LUNAR ORBIT TO THE MOON'S SURFACE",
        image: "/stories/apollo-17/slide-2.jpg",
        caption: "Reaching the Moon was only half the challenge. Astronauts also needed a safe way to travel from lunar orbit down to the surface and then return to space. Ordinary spacecraft were not designed for this special journey. NASA needed a completely different machine. The Apollo Lunar Module was built specifically to land on the Moon, support astronauts during exploration and launch them back into orbit.",
        duration: 28261,
      },
      {
        id: "a11-s3",
        title: "FOUR LEGS. TWO STAGES. ONE EXTRAORDINARY MISSION.",
        image: "/stories/apollo-17/slide-3.jpg",
        caption: "At first glance, the Apollo Lunar Module looked unusual. It had a strange shape, four long landing legs and a golden outer covering. It was not designed to look beautiful. Every part had an important job. Its unusual design helped it operate in space, land on the Moon and protect the astronauts during their exploration. It was a machine built for one extraordinary purpose.",
        duration: 27826,
      },
      {
        id: "a11-s4",
        title: "DESCENT STAGE — LANDING ASCENT STAGE — RETURNING",
        image: "/stories/apollo-17/slide-4.jpg",
        caption: "The Lunar Module had two main sections. The lower section was called the descent stage. It contained the engine that slowed the spacecraft down and helped it land safely. The upper section was called the ascent stage. It contained the astronauts' cabin and another engine that would carry them back into lunar orbit. Together, these two sections made one remarkable Moon-travelling machine.",
        duration: 26957,
      },
      {
        id: "a11-s5",
        title: "THE FINAL JOURNEY TOWARDS THE MOON",
        image: "/stories/apollo-17/slide-5.jpg",
        caption: "After launching from Earth, the Lunar Module travelled towards the Moon attached to the main spacecraft. Once the spacecraft reached lunar orbit, the Lunar Module separated and began its own journey towards the surface. Two astronauts were inside, preparing for one of the most important landings in human history. Their destination was no longer Earth. It was another world.",
        duration: 25652,
      },
      {
        id: "a11-s6",
        title: "A SAFE LANDING ON ANOTHER WORLD",
        image: "/stories/apollo-17/slide-6.jpg",
        caption: "Landing on the Moon was extremely difficult. There were no roads, no runways and no air to slow the spacecraft down. The Lunar Module had to use its powerful descent engine to reduce its speed carefully. The astronauts watched their instruments and searched for a safe place to land. Every second mattered. One mistake could put the entire mission in danger.",
        duration: 26522,
      },
      {
        id: "a11-s7",
        title: "A TEMPORARY HOME ON THE MOON",
        image: "/stories/apollo-17/slide-7.jpg",
        caption: "After landing, the Lunar Module became the astronauts' temporary home. Its upper section contained a pressurized cabin where they could breathe, communicate with Earth and control the spacecraft. They could also prepare their equipment before stepping outside. Although the cabin was small and crowded, it gave the astronauts a safe place to live and work while exploring the Moon.",
        duration: 25652,
      },
      {
        id: "a11-s8",
        title: "A SPACECRAFT THAT MADE SCIENCE POSSIBLE",
        image: "/stories/apollo-17/slide-8.jpg",
        caption: "But the Lunar Module was not just a place to stay. It was also the starting point for scientific exploration. Astronauts climbed down its ladder, walked across the lunar ground, collected rocks and soil, took photographs and placed scientific instruments on the surface. Every activity helped scientists back on Earth understand more about the Moon and its ancient history.",
        duration: 25652,
      },
      {
        id: "a11-s9",
        title: "ONE STAGE STAYS. THE OTHER RETURNS.",
        image: "/stories/apollo-17/slide-9.jpg",
        caption: "After the exploration was complete, it was time to leave the Moon. The astronauts climbed back into the upper section. Then something remarkable happened. The upper section separated from the lower section. The descent stage remained on the lunar surface, while the ascent stage fired its engine and carried the astronauts back into orbit. The machine had successfully completed its most important job.",
        duration: 27391,
      },
      {
        id: "a11-s10",
        title: "THE DESCENT STAGE REMAINS ON THE MOON",
        image: "/stories/apollo-17/slide-10.jpg",
        caption: "After the astronauts lifted off, the lower descent stage was left behind. It had completed its job and would never travel back to Earth. Its landing legs remained planted in the lunar soil, and the platform that had supported the astronauts during their stay became a permanent part of the lunar landscape. What was once a working spacecraft had now become a silent monument to human exploration.",
        duration: 29130,
      },
      {
        id: "a11-s11",
        title: "SILENT REMINDERS OF HUMAN EXPLORATION",
        image: "/stories/apollo-17/slide-11.jpg",
        caption: "Across the Apollo lunar landing missions, several Lunar Module descent stages were left behind on the Moon. They remain at their original landing locations, surrounded by footprints, scientific equipment and the marks of exploration. These machines are reminders of an incredible time when humans travelled to another world and proved that the impossible could become reality.",
        duration: 24348,
      },
      {
        id: "a11-s12",
        title: "THE MACHINES THAT CHANGED SPACE EXPLORATION",
        image: "/stories/apollo-17/slide-12.jpg",
        caption: "The Apollo Lunar Modules changed the way humans explored space. They proved that astronauts could travel between lunar orbit and the surface of another world. They helped scientists collect Moon rocks, conduct experiments and understand the lunar environment. Their engineering also taught future generations how to design machines for dangerous journeys beyond Earth.",
        duration: 23043,
      },
      {
        id: "a11-s13",
        title: "THEIR MISSIONS ENDED. THEIR STORIES REMAIN ON THE MOON. FINAL DOCUMENTARY AUDIO IDENTITY Narrator: * Warm, natural and engaging voice. * Simple English and clear pronunciation. * Moderate speaking speed. * Curious and adventurous storytelling. * Avoid robotic or overly dramatic delivery. Background music: * Cinematic orchestral space documentary. * Mysterious opening. * Suspenseful music during landing. * Adventurous music during exploration. * Emotional music during stage separation. * Inspirational music during the final scene. Sound effects: * Rocket launch. * Spacecraft engine sounds. * Radio communication. * Landing engine. * Landing impact. * Mechanical stage separation. * Rocket ignition during ascent. * Cinematic transitions. Audio mixing: * Keep narration louder and clearer than background music. * Sound effects should support the story, not distract from it. * Use smooth audio transitions between slides. * Avoid sudden changes in volume.",
        image: "/stories/apollo-17/slide-13.png",
        caption: "Today, the Apollo Lunar Modules are no longer flying. Their missions ended decades ago, but their lower descent stages remain on the Moon. They stand quietly where humans once explored another world. These machines were never designed to stay forever, yet they became part of lunar history. Their journeys may have ended, but their story will always remind us how far human curiosity can take us.",
        duration: 28696,
      }
    ],
  },

  // 3. Apollo 15 LRV (Moon) — Complete 13-slide unabridged documentary
  'apollo-15': {
    machineId: 'apollo-15',
    machineName: 'Apollo 15 Lunar Roving Vehicle',
    body: 'moon',
    missionTitle: 'APOLLO 15 — LUNAR ROVING VEHICLE',
    tagline: 'The Moon Buggies That Changed Lunar Exploration.',
    slides: [
      {
        id: "a15-s1",
        title: "THE FIRST CARS ON THE MOON",
        image: "/stories/apollo-17/slide-1.jpg",
        caption: "Imagine driving a car on the Moon! No roads, no petrol stations and no traffic lights. Just endless grey dust, enormous rocks and deep craters. Between 1971 and 1972, NASA sent three special electric vehicles to the Moon. They were called Lunar Roving Vehicles. These amazing machines allowed astronauts to drive across another world for the very first time!",
        duration: 25652,
      },
      {
        id: "a15-s2",
        title: "MAKING LUNAR EXPLORATION EASIER",
        image: "/stories/apollo-17/slide-2.jpg",
        caption: "Walking on the Moon was exciting, but it was also tiring and slow. Astronauts wore heavy spacesuits and could not travel very far on foot. They needed a way to explore distant rocks, mountains and craters without wasting too much energy. NASA created a lightweight electric vehicle that could carry two astronauts, their equipment and the scientific samples they collected.",
        duration: 26087,
      },
      {
        id: "a15-s3",
        title: "FOUR WHEELS. TWO SEATS. ONE LUNAR ADVENTURE.",
        image: "/stories/apollo-17/slide-3.jpg",
        caption: "Meet the Lunar Roving Vehicle, a lightweight electric car designed specially for the Moon. It had four wheels, two seats, a steering system and a front-mounted camera. Its unusual open design helped keep its weight low. It looked very different from cars on Earth, but every part was carefully designed to help astronauts travel safely across the lunar surface.",
        duration: 25652,
      },
      {
        id: "a15-s4",
        title: "FOLDED FOR SPACE. READY FOR THE MOON.",
        image: "/stories/apollo-17/slide-4.jpg",
        caption: "But how could NASA fit a car inside a spacecraft travelling to the Moon? The answer was clever engineering! The Lunar Roving Vehicle could fold into a compact shape for the journey. Once astronauts landed, they unfolded it using a carefully designed deployment system. In just a short time, a folded machine became a fully working electric vehicle ready to explore another world.",
        duration: 27391,
      },
      {
        id: "a15-s5",
        title: "ELECTRIC POWER. FOUR MOTORS. SPECIAL MOON WHEELS.",
        image: "/stories/apollo-17/slide-5.jpg",
        caption: "These Moon buggies did not need petrol or diesel. They ran on electricity stored in two rechargeable-looking but non-rechargeable batteries. Each of the four wheels had its own small electric motor. Their special wire-mesh wheels helped the vehicle move over loose lunar soil and rocky ground. It was a completely new kind of car, designed for a world without air!",
        duration: 26087,
      },
      {
        id: "a15-s6",
        title: "1971 — THE FIRST DRIVE ON THE MOON",
        image: "/stories/apollo-17/slide-6.jpg",
        caption: "On July 31, 1971, something extraordinary happened. During Apollo 15, astronauts drove the first Lunar Roving Vehicle across the Moon. For the first time, humans were travelling through another world in a car! The astronauts explored the nearby mountains, visited interesting geological locations and collected valuable rock samples. Their little electric vehicle changed lunar exploration forever.",
        duration: 24348,
      },
      {
        id: "a15-s7",
        title: "THREE VEHICLES. APPROXIMATELY 90 KILOMETRES.",
        image: "/stories/apollo-17/slide-7.jpg",
        caption: "The rover allowed astronauts to travel much farther than they could on foot. They could visit distant craters, examine unusual rocks and explore areas that would have taken hours to reach by walking. During the three Apollo missions, the Lunar Roving Vehicles travelled a combined distance of approximately 90 kilometres. Every journey helped scientists collect more information about the Moon.",
        duration: 26087,
      },
      {
        id: "a15-s8",
        title: "A VEHICLE THAT HELPED SCIENTISTS EXPLORE",
        image: "/stories/apollo-17/slide-8.jpg",
        caption: "The Lunar Roving Vehicle was more than just a way to travel. It also carried scientific tools, cameras and equipment for collecting samples. Astronauts could drive towards interesting rocks, stop, take photographs and gather samples without walking all the way back to their landing site. This helped scientists explore more of the Moon and learn about its ancient history.",
        duration: 25652,
      },
      {
        id: "a15-s9",
        title: "BUILT FOR A WORLD UNLIKE EARTH",
        image: "/stories/apollo-17/slide-9.jpg",
        caption: "Driving on the Moon was very different from driving on Earth. There was almost no gravity compared with our planet, and there was no air to create wind or help cool the vehicle. The ground was covered in loose dust and sharp rocks. Engineers had to design wheels and steering systems that could work in these unusual conditions. Every journey was a real test of technology!",
        duration: 28696,
      },
      {
        id: "a15-s10",
        title: "THREE MISSIONS. THREE VEHICLES. ONE MOON.",
        image: "/stories/apollo-17/slide-10.jpg",
        caption: "NASA used three Lunar Roving Vehicles during its final three Apollo Moon missions. The first travelled across the Moon in 1971. The second explored another lunar region in 1972. The third completed the final rover journeys in December 1972. Each vehicle helped astronauts travel farther, collect more samples and explore more of the lunar landscape.",
        duration: 23913,
      },
      {
        id: "a15-s11",
        title: "THEIR JOURNEYS ENDED. THE VEHICLES REMAINED.",
        image: "/stories/apollo-17/slide-11.jpg",
        caption: "After completing their scientific journeys, the astronauts returned to Earth. But the Lunar Roving Vehicles could not come with them. They were left behind at their final parking locations on the Moon. Their batteries eventually stopped working, their cameras went silent and their wheels stopped moving. The machines that once carried astronauts across the surface became permanent reminders of lunar exploration.",
        duration: 26522,
      },
      {
        id: "a15-s12",
        title: "THREE MOON BUGGIES. THREE PERMANENT PARKING SPOTS.",
        image: "/stories/apollo-17/slide-12.jpg",
        caption: "Today, all three Lunar Roving Vehicles remain on the Moon, exactly where the astronauts left them. Their lightweight frames, special wheels and scientific equipment are still part of the lunar landscape. They cannot drive anymore, but their story continues to inspire engineers and explorers. They represent one of the most extraordinary achievements in the history of space exploration.",
        duration: 25217,
      },
      {
        id: "a15-s13",
        title: "THEY DROVE ACROSS ANOTHER WORLD. THEY LEFT THEIR MARK ON HISTORY. FINAL DOCUMENTARY AUDIO IDENTITY Narrator: * Warm, natural and engaging voice. * Simple English and clear pronunciation. * Moderate speaking speed. * Curious and adventurous storytelling. * Avoid robotic or overly dramatic delivery. Background music: * Cinematic orchestral space documentary. * Mysterious opening. * Exciting music during the first drive. * Adventurous music during exploration. * Scientific discovery music during sample collection. * Emotional music during the final departure. Sound effects: * Electric motor starting. * Wheel movement across lunar soil. * Mechanical unfolding. * Spacesuit movement. * Sample collection. * Camera shutter. * Spacecraft departure. * Cinematic transitions. Audio mixing: * Keep narration louder and clearer than background music. * Sound effects should support the story, not distract from it. * Use smooth audio transitions between slides. * Avoid sudden changes in volume.",
        image: "/stories/apollo-17/slide-13.png",
        caption: "The Lunar Roving Vehicles proved that humans could travel across another world, explore distant locations and conduct science far beyond their landing sites. They were not designed to return to Earth. Their final destination was always the Moon. Today, they remain silent beneath the lunar sky, reminding us that even a simple idea, like building a car, can help humanity reach extraordinary places.",
        duration: 27391,
      }
    ],
  },

  // 4. Surveyor 3 (Moon) — Complete 13-slide unabridged documentary
  'surveyor-3': {
    machineId: 'surveyor-3',
    machineName: 'Surveyor 3 Lunar Lander',
    body: 'moon',
    missionTitle: 'SURVEYOR 3',
    tagline: 'The Robots That Prepared the Moon for Humans.',
    slides: [
      {
        id: "sur3-s1",
        title: "BEFORE HUMANS ARRIVED, ROBOTS EXPLORED.",
        image: "/stories/apollo-17/slide-1.jpg",
        caption: "Before humans could walk on the Moon, someone had to explore it first. But how could scientists understand a place they had never touched? They needed machines that could travel there, land safely and study the ground. In the 1960s, NASA sent a family of robotic explorers called Surveyor Landers. Their mission was simple but important: prepare the Moon for human visitors.",
        duration: 26957,
      },
      {
        id: "sur3-s2",
        title: "COULD THE MOON SUPPORT A HUMAN SPACECRAFT?",
        image: "/stories/apollo-17/slide-2.jpg",
        caption: "Landing on the Moon was not easy. Scientists did not know exactly how strong the lunar soil was. Would a heavy spacecraft sink into the ground? Could its landing legs stand on the surface? Were there dangerous rocks hidden in the landing areas? NASA needed answers before sending astronauts. The Surveyor Landers were designed to investigate these questions directly on the Moon.",
        duration: 26957,
      },
      {
        id: "sur3-s3",
        title: "SEVEN ROBOTS. ONE IMPORTANT MISSION.",
        image: "/stories/apollo-17/slide-3.jpg",
        caption: "Meet the Surveyor Landers, a family of seven robotic spacecraft sent to explore the Moon between 1966 and 1968. Each machine stood about three metres tall and had three landing legs. They carried cameras, antennas and scientific equipment. Their job was to land gently, photograph the lunar surface and collect information that scientists could use to prepare future missions.",
        duration: 25652,
      },
      {
        id: "sur3-s4",
        title: "7 LAUNCHED. 5 SUCCESSFUL SOFT LANDINGS.",
        image: "/stories/apollo-17/slide-4.jpg",
        caption: "NASA launched seven Surveyor spacecraft. Surveyor 1, 2, 3, 4, 5, 6 and 7. But space exploration did not go perfectly every time. Five spacecraft successfully landed softly on the Moon, while two missions failed before completing their landings. Each mission taught engineers something important about designing and controlling machines in space.",
        duration: 22609,
      },
      {
        id: "sur3-s5",
        title: "JUNE 2, 1966 — THE FIRST AMERICAN SOFT LANDING",
        image: "/stories/apollo-17/slide-5.jpg",
        caption: "On June 2, 1966, Surveyor 1 made history. It became the first American spacecraft to successfully land softly on the Moon. Instead of crashing into the surface, it slowed down carefully and touched the ground safely. It also sent thousands of photographs back to Earth. Scientists finally had a close look at the lunar surface, and they knew that their work was just beginning.",
        duration: 27826,
      },
      {
        id: "sur3-s6",
        title: "TESTING THE MOON BEFORE HUMANS ARRIVED",
        image: "/stories/apollo-17/slide-6.jpg",
        caption: "Landing safely was only the beginning. NASA needed to know whether the lunar soil could support a much heavier spacecraft carrying astronauts. Some Surveyor Landers carried special equipment that could touch, dig and examine the ground. Scientists studied how the soil moved and how deep their instruments could dig. These simple experiments helped answer one of the biggest questions before human exploration.",
        duration: 26957,
      },
      {
        id: "sur3-s7",
        title: "A ROBOT MEETS HUMAN EXPLORERS",
        image: "/stories/apollo-17/slide-7.jpg",
        caption: "One Surveyor Lander had a very special story. Surveyor 3 landed on the Moon in April 1967. More than two years later, astronauts arrived nearby and walked towards the little robot. Imagine seeing a machine that had been working alone on the Moon for so long! The astronauts carefully examined it, photographed it and collected some of its parts.",
        duration: 25652,
      },
      {
        id: "sur3-s8",
        title: "PIECES OF THE MOON'S HISTORY RETURN TO EARTH",
        image: "/stories/apollo-17/slide-8.jpg",
        caption: "During their visit, the astronauts did something extraordinary. They removed Surveyor 3's television camera, its sampling scoop and several other parts. They carried these pieces back to Earth for scientists to examine. Researchers wanted to understand how more than two years of lunar dust, sunlight and extreme temperatures had affected the spacecraft. For the first time, scientists could study parts of a machine that had spent years on another world!",
        duration: 30435,
      },
      {
        id: "sur3-s9",
        title: "NOT EVERY JOURNEY ENDED IN SUCCESS",
        image: "/stories/apollo-17/slide-9.jpg",
        caption: "But not every Surveyor mission had a happy ending. Surveyor 2 lost control after one of its thrusters failed to fire. It could no longer maintain its correct direction and eventually crashed on the Moon. Surveyor 4 also lost communication just before its planned landing. These failures reminded engineers that even the smallest technical problem could change the result of an entire space mission.",
        duration: 27826,
      },
      {
        id: "sur3-s10",
        title: "FIVE SUCCESSFUL LANDINGS. A NEW ERA OF EXPLORATION.",
        image: "/stories/apollo-17/slide-10.jpg",
        caption: "Despite these failures, the Surveyor programme became a major success. Five spacecraft had successfully reached the Moon and returned valuable information. Their photographs showed the surface in incredible detail. Their experiments measured the lunar soil and helped engineers understand how spacecraft behaved after landing. Step by step, scientists were becoming more confident about sending humans to the Moon.",
        duration: 25217,
      },
      {
        id: "sur3-s11",
        title: "ROBOTS FIRST. HUMANS NEXT.",
        image: "/stories/apollo-17/slide-11.jpg",
        caption: "All this information helped NASA prepare for the Apollo missions. Scientists now had real photographs and measurements from the lunar surface. They understood much more about the ground, its strength and the challenges a spacecraft could face during landing. The Surveyor Landers had done something remarkable. They explored the Moon before humans arrived and helped make future landings safer.",
        duration: 25652,
      },
      {
        id: "sur3-s12",
        title: "THE MACHINES THAT REMAIN ON THE MOON",
        image: "/stories/apollo-17/slide-12.jpg",
        caption: "The Surveyor Landers were never designed to return to Earth. Their job was to reach the Moon, perform their experiments and send their discoveries home. Today, the successful landers remain at their lunar locations, although some of their parts were collected during later human exploration. Their landing marks and equipment are reminders of the machines that helped humanity take its first steps towards another world.",
        duration: 28261,
      },
      {
        id: "sur3-s13",
        title: "THEY EXPLORED BEFORE US. THEY HELPED US REACH THE MOON. FINAL DOCUMENTARY AUDIO IDENTITY Narrator: * Warm, natural and engaging voice. * Simple English and clear pronunciation. * Moderate speaking speed. * Curious and adventurous storytelling. * Avoid robotic or overly dramatic delivery. Background music: * Cinematic orchestral space documentary. * Mysterious opening. * Exciting music during successful landings. * Scientific discovery music during soil experiments. * Suspenseful music during mission failures. * Emotional music during the final scene. Sound effects: * Rocket launch. * Spacecraft engine sounds. * Lunar landing impact. * Scientific instrument activation. * Soil sampling. * Radio communication. * Mechanical equipment removal. * Radio signal fading. * Cinematic transitions. Audio mixing: * Keep narration louder and clearer than background music. * Sound effects should support the story, not distract from it. * Use smooth audio transitions between slides. * Avoid sudden changes in volume.",
        image: "/stories/apollo-17/slide-13.png",
        caption: "Today, the Surveyor Landers are remembered as some of the most important robotic explorers in lunar history. They showed that machines could safely reach the Moon, study its soil and send valuable information back to Earth. Their discoveries helped prepare the way for human exploration. They were small machines with an enormous responsibility. Their missions ended, but their contribution to our journey beyond Earth will never be forgotten.",
        duration: 29565,
      }
    ],
  },

  // 5. Viking 1 Lander (Mars) — Complete 13-slide unabridged documentary
  'viking-1': {
    machineId: 'viking-1',
    machineName: 'Viking 1 Lander',
    body: 'mars',
    missionTitle: 'VIKING 1',
    tagline: 'The Robots That Searched for Life on Mars.',
    slides: [
      {
        id: "vik1-s1",
        title: "THE SEARCH FOR LIFE ON MARS",
        image: "/textures/mars_surface.jpg",
        caption: "What if we could travel to Mars and search for signs of life? In 1976, NASA sent two extraordinary robotic explorers to the Red Planet. Their names were Viking 1 and Viking 2. Their mission was bigger than simply taking pictures. They were going to collect Martian soil, examine its chemistry and search for something scientists had wondered about for years. Could there be life on Mars?",
        duration: 29130,
      },
      {
        id: "vik1-s2",
        title: "TWO LANDERS. ONE BIG QUESTION.",
        image: "/textures/mars_surface.jpg",
        caption: "Scientists wanted to understand whether Mars had ever supported life. They needed more than photographs from space. They needed machines that could actually touch the ground, collect soil and perform scientific experiments. NASA decided to send two identical landers to different regions of Mars. By studying two locations, scientists could compare their discoveries and understand more about the Red Planet.",
        duration: 26087,
      },
      {
        id: "vik1-s3",
        title: "TWO ROBOTIC LABORATORIES ON MARS",
        image: "/textures/mars_surface.jpg",
        caption: "Meet Viking 1 and Viking 2. They were two powerful robotic laboratories designed to work on Mars. Each lander had three landing legs, cameras, antennas and a robotic sampling arm. Inside their scientific systems were special instruments designed to examine the atmosphere, measure the weather and investigate the chemical composition of Martian soil. These machines were built to explore a planet without any human help.",
        duration: 28261,
      },
      {
        id: "vik1-s4",
        title: "1975 — TWO JOURNEYS TO MARS",
        image: "/textures/mars_surface.jpg",
        caption: "The journey began in 1975. Viking 1 launched on August 20, followed by Viking 2 on September 9. Each spacecraft travelled through space for several months, carrying its lander safely towards Mars. Their destinations were different, but their mission was the same. They were going to explore the surface and search for clues about the possibility of life.",
        duration: 25217,
      },
      {
        id: "vik1-s5",
        title: "JULY 20, 1976 — VIKING 1 LANDS ON MARS",
        image: "/textures/mars_surface.jpg",
        caption: "On July 20, 1976, Viking 1 successfully landed on Mars. It touched down in a region called Chryse Planitia. This was an extraordinary achievement. It became the first U.S. spacecraft to land successfully on another planet. After reaching the surface, it immediately began sending pictures back to Earth. For the first time, scientists could study the Martian landscape through the eyes of a machine standing directly on the ground.",
        duration: 30000,
      },
      {
        id: "vik1-s6",
        title: "SEPTEMBER 3, 1976 — VIKING 2 LANDS ON MARS",
        image: "/textures/mars_surface.jpg",
        caption: "Just six weeks later, on September 3, 1976, Viking 2 successfully landed in another region called Utopia Planitia. Now NASA had two working scientific laboratories on opposite sides of Mars. The second landing site had a different landscape, with more rocks and a flatter appearance. Scientists could finally compare two different regions of the planet and investigate their similarities and differences.",
        duration: 26522,
      },
      {
        id: "vik1-s7",
        title: "THE FIRST DETAILED VIEWS FROM THE MARTIAN SURFACE",
        image: "/textures/mars_surface.jpg",
        caption: "Once both landers were safely on the ground, their cameras began taking photographs. They showed reddish soil, scattered rocks and a landscape unlike anything on Earth. The cameras even captured wide panoramic views of their surroundings. Scientists studied these images to understand the shape of the land, identify interesting rocks and learn more about the Martian environment.",
        duration: 24783,
      },
      {
        id: "vik1-s8",
        title: "DIGGING INTO THE MYSTERY OF MARS",
        image: "/textures/mars_surface.jpg",
        caption: "Taking pictures was not enough. Scientists needed to examine what was beneath the surface. Both landers had robotic arms with special scoops. These arms could reach down, collect small amounts of Martian soil and place the samples into scientific instruments. The machines could perform this work again and again, allowing scientists on Earth to investigate the mysterious material covering Mars.",
        duration: 26087,
      },
      {
        id: "vik1-s9",
        title: "COULD SOMETHING BE ALIVE IN THE MARTIAN SOIL?",
        image: "/textures/mars_surface.jpg",
        caption: "Now came the most exciting part of the mission. Both landers carried three special biology experiments designed to search for signs of microscopic life. Scientists placed Martian soil inside tiny testing chambers and added special materials to observe what happened. They measured gases and looked for chemical changes that might suggest living organisms were present. It was one of the most ambitious searches for life ever attempted on another planet.",
        duration: 30435,
      },
      {
        id: "vik1-s10",
        title: "UNEXPECTED RESULTS. NO DEFINITIVE PROOF OF LIFE.",
        image: "/textures/mars_surface.jpg",
        caption: "The results were surprising. Some experiments showed chemical activity that looked similar to reactions caused by living organisms on Earth. But another important test did not find the organic compounds scientists expected. This created a mystery. Were the experiments detecting life, or were unusual chemicals in Martian soil creating similar reactions? The landers had discovered something interesting, but they had not proved that life existed on Mars.",
        duration: 29130,
      },
      {
        id: "vik1-s11",
        title: "MEASURING THE WEATHER ON MARS",
        image: "/textures/mars_surface.jpg",
        caption: "The landers also studied the Martian atmosphere and weather. They measured temperature, air pressure and wind conditions. Scientists discovered how cold and dry the surface could become. Temperatures changed dramatically between day and night. The landers also observed dust moving through the atmosphere. These measurements helped researchers understand why Mars is such a difficult place for life as we know it.",
        duration: 26522,
      },
      {
        id: "vik1-s12",
        title: "1976—1982 — YEARS OF DISCOVERY",
        image: "/textures/mars_surface.jpg",
        caption: "NASA originally planned the landers to operate for only 90 days. But they continued working far beyond that expectation. Viking 2 sent its final data to Earth in April 1980, while Viking 1 continued operating until November 1982. Together, they returned thousands of photographs and enormous amounts of scientific information. These machines had turned a short visit to Mars into years of discovery.",
        duration: 27391,
      },
      {
        id: "vik1-s13",
        title: "THEY SEARCHED FOR LIFE. THEY LEFT US WITH A MYSTERY. FINAL DOCUMENTARY AUDIO IDENTITY Narrator: * Warm, natural and engaging voice. * Simple English and clear pronunciation. * Moderate speaking speed. * Curious and adventurous storytelling. * Avoid robotic or overly dramatic delivery. Background music: * Cinematic orchestral space documentary. * Mysterious opening. * Exciting music during launches and landings. * Scientific discovery music during soil experiments. * Suspenseful music during the life-detection results. * Emotional music during the final scene. Sound effects: * Rocket launches. * Spacecraft communication. * Parachute deployment. * Landing engine sounds. * Robotic arm movement. * Soil sampling. * Scientific laboratory effects. * Martian wind. * Radio signal fading. * Cinematic transitions. Audio mixing: * Keep narration louder and clearer than background music. * Sound effects should support the story, not distract from it. * Use smooth audio transitions between slides. * Avoid sudden changes in volume.",
        image: "/textures/mars_surface.jpg",
        caption: "Today, Viking 1 and Viking 2 remain on Mars, silent at their original landing locations. They did not give us a final answer about life, but they changed science forever. They showed us how to study another planet directly, how to examine its soil and how to search for signs of living organisms. Their discoveries helped shape every future question about life beyond Earth. The search began with two machines, but the mystery continues.",
        duration: 32174,
      }
    ],
  },

  // 6. Mars Pathfinder & Sojourner (Mars) — Complete 13-slide unabridged documentary
  'pathfinder-sojourner': {
    machineId: 'pathfinder-sojourner',
    machineName: 'Mars Pathfinder & Sojourner Rover',
    body: 'mars',
    missionTitle: 'PATHFINDER & SOJOURNER',
    tagline: 'The First Rover on Mars.',
    slides: [
      {
        id: "path-s1",
        title: "THE FIRST WHEELED ROVER ON MARS",
        image: "/textures/mars_surface.jpg",
        caption: "Imagine being the first little robot to drive across another planet. No roads, no humans beside you and an entire strange world waiting to be explored. In 1997, NASA sent a tiny robotic explorer to Mars. Its name was Sojourner Rover. It was small enough to fit inside a microwave-sized space, but its journey would make history.",
        duration: 24783,
      },
      {
        id: "path-s2",
        title: "FROM WATCHING MARS TO EXPLORING ITS SURFACE",
        image: "/textures/mars_surface.jpg",
        caption: "Before Sojourner, spacecraft had photographed Mars from above, but scientists wanted to explore its surface more closely. They wanted to examine rocks, study the soil and understand the planet's history. Sojourner was designed to drive across the ground, investigate interesting objects and send scientific information back to Earth. It was a small robot with a very big job.",
        duration: 25217,
      },
      {
        id: "path-s3",
        title: "10.6 KG — SIX WHEELS — A SCIENCE EXPLORER",
        image: "/textures/mars_surface.jpg",
        caption: "Meet Sojourner, a tiny robotic vehicle weighing just 10.6 kilograms. It was about 30 centimetres tall and had six special wheels designed for rough ground. It carried cameras to photograph its surroundings and a scientific instrument that could examine the chemical elements inside Martian rocks and soil. Despite its small size, it was a complete little science explorer!",
        duration: 25217,
      },
      {
        id: "path-s4",
        title: "DECEMBER 4, 1996 — THE JOURNEY TO MARS",
        image: "/textures/mars_surface.jpg",
        caption: "On December 4, 1996, Sojourner began its journey towards Mars inside a spacecraft called Mars Pathfinder. It launched aboard a powerful rocket and travelled through space for seven months. During the journey, the little rover remained safely packed inside its lander, waiting for the moment when it could finally explore another planet.",
        duration: 22609,
      },
      {
        id: "path-s5",
        title: "JULY 4, 1997 — A SAFE LANDING ON MARS!",
        image: "/textures/mars_surface.jpg",
        caption: "On July 4, 1997, the spacecraft finally reached Mars. But its landing method was unlike anything we use on Earth. A parachute slowed its descent, and giant airbags inflated around the lander. Then it dropped towards the surface and bounced several times like a giant ball before finally coming to rest. Sojourner had survived its incredible journey!",
        duration: 24783,
      },
      {
        id: "path-s6",
        title: "JULY 6, 1997 — SOJOURNER REACHES THE MARTIAN GROUND",
        image: "/textures/mars_surface.jpg",
        caption: "After landing, it was finally time for Sojourner to wake up. Its landing ramps unfolded, and the tiny rover slowly rolled down onto the red Martian ground. For the first time, a wheeled vehicle was operating on another planet. Its six wheels touched the soil, and a new chapter of robotic exploration had begun.",
        duration: 23478,
      },
      {
        id: "path-s7",
        title: "EVERY ROCK HAD A STORY TO TELL",
        image: "/textures/mars_surface.jpg",
        caption: "Sojourner was not sent to drive randomly across Mars. Its job was to explore nearby rocks and soil. Scientists on Earth studied photographs and guided the rover towards interesting locations. It could move forward, turn its wheels and carefully approach objects for scientific examination. Every short journey helped scientists understand more about the mysterious red planet.",
        duration: 24348,
      },
      {
        id: "path-s8",
        title: "A TINY ROBOT INVESTIGATING THE CHEMISTRY OF MARS",
        image: "/textures/mars_surface.jpg",
        caption: "Sojourner carried a special instrument called the Alpha Proton X-ray Spectrometer, or APXS. It could investigate the chemical elements inside rocks and soil. The rover carefully positioned this instrument against different surfaces and collected scientific measurements. These results helped scientists understand what Martian rocks were made of and how the planet's surface had changed over time.",
        duration: 24348,
      },
      {
        id: "path-s9",
        title: "DID WATER ONCE FLOW ACROSS MARS?",
        image: "/textures/mars_surface.jpg",
        caption: "Scientists noticed something interesting about the area where Sojourner landed. There were rocks of different sizes scattered across the landscape. Some of these rocks suggested that powerful floods may once have carried material across Mars. By examining these rocks and the surrounding soil, Sojourner helped scientists investigate the planet's watery past.",
        duration: 22174,
      },
      {
        id: "path-s10",
        title: "7 DAYS PLANNED. 83 DAYS ACHIEVED.",
        image: "/textures/mars_surface.jpg",
        caption: "NASA originally expected Sojourner to work for only seven Martian days. But the little rover surprised everyone! It continued exploring for 83 days, far longer than planned. It travelled around its landing site, examined different locations and kept sending valuable photographs and measurements. What was supposed to be a short experiment became an extraordinary success.",
        duration: 23913,
      },
      {
        id: "path-s11",
        title: "550 PHOTOGRAPHS. 16 STUDY LOCATIONS.",
        image: "/textures/mars_surface.jpg",
        caption: "During its mission, Sojourner sent 550 photographs back to Earth. These images showed scientists rocks, soil, rover tracks and the surrounding landscape. Its scientific instrument also studied 16 different locations. Every photograph and measurement added another piece to the puzzle of Mars, helping scientists understand what this distant planet was really like.",
        duration: 22609,
      },
      {
        id: "path-s12",
        title: "SEPTEMBER 27, 1997 — THE FINAL SIGNAL",
        image: "/textures/mars_surface.jpg",
        caption: "After 83 days, communication suddenly stopped. Sojourner depended on its lander to send information back to Earth. When the lander's power system failed, the connection was lost. Engineers tried to restore communication, but the signals never returned. On September 27, 1997, the final data transmission was received. The little explorer had completed an incredible mission.",
        duration: 23913,
      },
      {
        id: "path-s13",
        title: "THE FIRST ROVER. THE BEGINNING OF A NEW ERA. FINAL DOCUMENTARY AUDIO IDENTITY Narrator: * Warm, natural and engaging voice. * Simple English and clear pronunciation. * Moderate speaking speed. * Curious and adventurous storytelling. * Avoid robotic or overly dramatic delivery. Background music: * Cinematic orchestral space documentary. * Mysterious opening. * Exciting music during launch and landing. * Adventurous music during rover exploration. * Scientific discovery music during rock analysis. * Emotional music during the final communication scene. Sound effects: * Rocket launch. * Spacecraft communication signals. * Parachute deployment. * Airbag inflation and bouncing. * Lander opening. * Rover wheel movement. * Scientific scanning. * Radio signal fading. * Cinematic transitions. Audio mixing: * Keep narration louder and clearer than background music. * Sound effects should support the story, not distract from it. * Use smooth audio transitions between slides. * Avoid sudden changes in volume.",
        image: "/textures/mars_surface.jpg",
        caption: "Today, Sojourner remains on Mars beside its lander. Its wheels no longer move, its cameras no longer send pictures and its mission is long over. But its discoveries helped prove that robotic vehicles could explore another planet. It may have been small, but it opened the way for a much bigger future in space exploration. Its journey ended, but its story lives on.",
        duration: 27391,
      }
    ],
  },

  // 7. Spirit Rover MER-A (Mars) — Complete 13-slide unabridged documentary
  'spirit-mer-a': {
    machineId: 'spirit-mer-a',
    machineName: 'Spirit Rover (MER-A)',
    body: 'mars',
    missionTitle: 'SPIRIT (MER-A)',
    tagline: 'The Twin Rovers That Refused to Give Up.',
    slides: [
      {
        id: "spirit-s1",
        title: "TWO ROBOTS. ONE MISSION. A WORLD OF MYSTERIES.",
        image: "/textures/mars_surface.jpg",
        caption: "Imagine sending two identical robots to explore a planet millions of miles away. They cannot talk to each other, they have no humans beside them and they must explore an unknown world alone. In 2004, NASA sent two special explorers to Mars. Their names were Spirit and Opportunity. Their mission was to discover whether water had ever existed on the Red Planet. Nobody expected their journey to last so long!",
        duration: 30435,
      },
      {
        id: "spirit-s2",
        title: "WAS MARS ONCE A WETTER WORLD?",
        image: "/textures/mars_surface.jpg",
        caption: "Scientists had an important question: Was Mars once a much wetter planet? On Earth, water is essential for life as we know it. Scientists wanted to find out whether ancient Mars had conditions that could have supported tiny living organisms. Instead of sending just one explorer, NASA decided to send two identical robots to different locations. This would give scientists two different places to investigate.",
        duration: 28261,
      },
      {
        id: "spirit-s3",
        title: "SIX WHEELS. SOLAR POWER. SCIENCE ON THE MOVE.",
        image: "/textures/mars_surface.jpg",
        caption: "Meet Spirit and Opportunity. They were almost identical, each about the size of a golf cart and weighing around 185 kilograms. Both had six wheels, solar panels, cameras and robotic arms. Their arms carried special instruments that could examine rocks, study soil and investigate chemical elements. They were not ordinary robots. They were two mobile science laboratories designed to explore Mars.",
        duration: 26522,
      },
      {
        id: "spirit-s4",
        title: "2003 — TWO JOURNEYS BEGIN",
        image: "/textures/mars_surface.jpg",
        caption: "Spirit launched on June 10, 2003, followed by Opportunity on July 7. Both travelled through space for several months inside protective spacecraft. Their destinations were different parts of Mars, but their mission was the same. They were going to search for rocks, study the ground and look for clues that water had once shaped the planet.",
        duration: 24348,
      },
      {
        id: "spirit-s5",
        title: "JANUARY 2004 — BOTH ROVERS REACH MARS",
        image: "/textures/mars_surface.jpg",
        caption: "In January 2004, both rovers finally reached Mars. But landing on the Red Planet was extremely dangerous. Their protective airbags inflated around them, and they bounced across the surface before coming to rest. Spirit landed first on January 3, followed by Opportunity on January 24. Both survived the journey and were ready to begin exploring!",
        duration: 23913,
      },
      {
        id: "spirit-s6",
        title: "SPIRIT — GUSEV CRATER OPPORTUNITY — MERIDIANI PLANUM",
        image: "/textures/mars_surface.jpg",
        caption: "Although the rovers looked almost identical, they landed in completely different places. Spirit explored Gusev Crater, an area scientists believed might once have contained water. Opportunity landed in Meridiani Planum, a region with unusual surface features that also suggested a watery past. By exploring two different locations, the rovers could help scientists discover more about the history of Mars.",
        duration: 25652,
      },
      {
        id: "spirit-s7",
        title: "LOOK CLOSER. STUDY DEEPER. DISCOVER MORE.",
        image: "/textures/mars_surface.jpg",
        caption: "These rovers were not just taking pictures. They could carefully examine rocks using their robotic arms. Their special tools could brush away dust, grind a small area of rock and study what was underneath. Their cameras captured close-up photographs, while scientific instruments measured the chemical materials inside. Every rock became a new clue about the history of Mars.",
        duration: 25217,
      },
      {
        id: "spirit-s8",
        title: "SPIRIT FINDS CLUES OF ANCIENT HOT SPRINGS",
        image: "/textures/mars_surface.jpg",
        caption: "Spirit made an unexpected discovery while travelling across Mars. One of its wheels dragged through the ground and exposed a bright patch of material rich in silica. Silica is also the main ingredient in ordinary window glass. Scientists believed this material could have formed around ancient hot springs or steam vents. It was strong evidence that Mars had once been much wetter than it is today.",
        duration: 28696,
      },
      {
        id: "spirit-s9",
        title: "OPPORTUNITY FINDS MORE CLUES OF ANCIENT WATER",
        image: "/textures/mars_surface.jpg",
        caption: "On the other side of Mars, Opportunity was finding its own clues. It explored rocks and craters that showed signs of ancient water activity. Some of the rocks contained minerals that formed when water was present. These discoveries suggested that liquid water had once affected this region for a long time. Scientists now had even more evidence that ancient Mars was very different from the dry planet we see today.",
        duration: 30435,
      },
      {
        id: "spirit-s10",
        title: "90 DAYS PLANNED. YEARS OF EXPLORATION.",
        image: "/textures/mars_surface.jpg",
        caption: "Both rovers were originally designed to work for just 90 Martian days. But they continued exploring for years! Spirit travelled about 7.73 kilometres before its mission ended. Opportunity travelled an incredible 45.16 kilometres. It even drove farther than a full marathon on another world. These little robots had achieved far more than anyone expected.",
        duration: 23478,
      },
      {
        id: "spirit-s11",
        title: "SPIRIT — THE FINAL JOURNEY",
        image: "/textures/mars_surface.jpg",
        caption: "But even the strongest explorers face problems. In May 2009, Spirit became stuck in soft Martian soil. Its wheels could no longer find enough grip to move forward. Engineers on Earth tried different ways to free it, but the rover remained trapped. It continued doing some scientific work from its position, but eventually the cold Martian winter made it impossible to keep communicating.",
        duration: 27391,
      },
      {
        id: "spirit-s12",
        title: "JUNE 10, 2018 — OPPORTUNITY'S FINAL SIGNAL",
        image: "/textures/mars_surface.jpg",
        caption: "Opportunity continued exploring long after Spirit had stopped communicating. But in June 2018, a massive dust storm spread across Mars. Thick dust blocked sunlight from reaching the rover's solar panels. Without enough sunlight, its batteries could not receive the power needed to keep operating. On June 10, 2018, Earth received its final signal from Opportunity. After months of trying, NASA officially ended the mission in February 2019.",
        duration: 29130,
      },
      {
        id: "spirit-s13",
        title: "TWO ROVERS. YEARS OF DISCOVERY. A LEGACY THAT WILL NEVER BE FORGOTTEN. FINAL DOCUMENTARY AUDIO IDENTITY Narrator: * Warm, natural and engaging voice. * Simple English and clear pronunciation. * Moderate speaking speed. * Curious and adventurous storytelling. * Avoid robotic or overly dramatic delivery. Background music: * Cinematic orchestral space documentary. * Mysterious opening. * Exciting music during launches and landings. * Scientific discovery music during rock examinations. * Adventurous music during long journeys. * Emotional music during the final communication scenes. Sound effects: * Rocket launches. * Spacecraft communication. * Parachute deployment. * Airbag landing impacts. * Rover wheel movement. * Robotic arm movement. * Rock grinding. * Dust storm winds. * Radio signal fading. * Cinematic transitions. Audio mixing: * Keep narration louder and clearer than background music. * Sound effects should support the story, not distract from it. * Use smooth audio transitions between slides. * Avoid sudden changes in volume.",
        image: "/textures/mars_surface.jpg",
        caption: "Today, Spirit and Opportunity remain on Mars, silent but not forgotten. They showed us that Mars once had environments where water existed and where conditions may have been suitable for tiny forms of life. They worked for years beyond their planned missions and sent back thousands of photographs and valuable scientific information. Their journeys ended, but their discoveries changed the way humanity understands Mars forever.",
        duration: 28261,
      }
    ],
  },

  // 8. Opportunity Rover MER-B (Mars) — Complete 13-slide unabridged documentary
  'opportunity-mer-b': {
    machineId: 'opportunity-mer-b',
    machineName: 'Opportunity Rover (MER-B)',
    body: 'mars',
    missionTitle: 'OPPORTUNITY (MER-B)',
    tagline: 'The Twin Rovers That Refused to Give Up.',
    slides: [
      {
        id: "opp-s1",
        title: "TWO ROBOTS. ONE MISSION. A WORLD OF MYSTERIES.",
        image: "/textures/mars_surface.jpg",
        caption: "Imagine sending two identical robots to explore a planet millions of miles away. They cannot talk to each other, they have no humans beside them and they must explore an unknown world alone. In 2004, NASA sent two special explorers to Mars. Their names were Spirit and Opportunity. Their mission was to discover whether water had ever existed on the Red Planet. Nobody expected their journey to last so long!",
        duration: 30435,
      },
      {
        id: "opp-s2",
        title: "WAS MARS ONCE A WETTER WORLD?",
        image: "/textures/mars_surface.jpg",
        caption: "Scientists had an important question: Was Mars once a much wetter planet? On Earth, water is essential for life as we know it. Scientists wanted to find out whether ancient Mars had conditions that could have supported tiny living organisms. Instead of sending just one explorer, NASA decided to send two identical robots to different locations. This would give scientists two different places to investigate.",
        duration: 28261,
      },
      {
        id: "opp-s3",
        title: "SIX WHEELS. SOLAR POWER. SCIENCE ON THE MOVE.",
        image: "/textures/mars_surface.jpg",
        caption: "Meet Spirit and Opportunity. They were almost identical, each about the size of a golf cart and weighing around 185 kilograms. Both had six wheels, solar panels, cameras and robotic arms. Their arms carried special instruments that could examine rocks, study soil and investigate chemical elements. They were not ordinary robots. They were two mobile science laboratories designed to explore Mars.",
        duration: 26522,
      },
      {
        id: "opp-s4",
        title: "2003 — TWO JOURNEYS BEGIN",
        image: "/textures/mars_surface.jpg",
        caption: "Spirit launched on June 10, 2003, followed by Opportunity on July 7. Both travelled through space for several months inside protective spacecraft. Their destinations were different parts of Mars, but their mission was the same. They were going to search for rocks, study the ground and look for clues that water had once shaped the planet.",
        duration: 24348,
      },
      {
        id: "opp-s5",
        title: "JANUARY 2004 — BOTH ROVERS REACH MARS",
        image: "/textures/mars_surface.jpg",
        caption: "In January 2004, both rovers finally reached Mars. But landing on the Red Planet was extremely dangerous. Their protective airbags inflated around them, and they bounced across the surface before coming to rest. Spirit landed first on January 3, followed by Opportunity on January 24. Both survived the journey and were ready to begin exploring!",
        duration: 23913,
      },
      {
        id: "opp-s6",
        title: "SPIRIT — GUSEV CRATER OPPORTUNITY — MERIDIANI PLANUM",
        image: "/textures/mars_surface.jpg",
        caption: "Although the rovers looked almost identical, they landed in completely different places. Spirit explored Gusev Crater, an area scientists believed might once have contained water. Opportunity landed in Meridiani Planum, a region with unusual surface features that also suggested a watery past. By exploring two different locations, the rovers could help scientists discover more about the history of Mars.",
        duration: 25652,
      },
      {
        id: "opp-s7",
        title: "LOOK CLOSER. STUDY DEEPER. DISCOVER MORE.",
        image: "/textures/mars_surface.jpg",
        caption: "These rovers were not just taking pictures. They could carefully examine rocks using their robotic arms. Their special tools could brush away dust, grind a small area of rock and study what was underneath. Their cameras captured close-up photographs, while scientific instruments measured the chemical materials inside. Every rock became a new clue about the history of Mars.",
        duration: 25217,
      },
      {
        id: "opp-s8",
        title: "SPIRIT FINDS CLUES OF ANCIENT HOT SPRINGS",
        image: "/textures/mars_surface.jpg",
        caption: "Spirit made an unexpected discovery while travelling across Mars. One of its wheels dragged through the ground and exposed a bright patch of material rich in silica. Silica is also the main ingredient in ordinary window glass. Scientists believed this material could have formed around ancient hot springs or steam vents. It was strong evidence that Mars had once been much wetter than it is today.",
        duration: 28696,
      },
      {
        id: "opp-s9",
        title: "OPPORTUNITY FINDS MORE CLUES OF ANCIENT WATER",
        image: "/textures/mars_surface.jpg",
        caption: "On the other side of Mars, Opportunity was finding its own clues. It explored rocks and craters that showed signs of ancient water activity. Some of the rocks contained minerals that formed when water was present. These discoveries suggested that liquid water had once affected this region for a long time. Scientists now had even more evidence that ancient Mars was very different from the dry planet we see today.",
        duration: 30435,
      },
      {
        id: "opp-s10",
        title: "90 DAYS PLANNED. YEARS OF EXPLORATION.",
        image: "/textures/mars_surface.jpg",
        caption: "Both rovers were originally designed to work for just 90 Martian days. But they continued exploring for years! Spirit travelled about 7.73 kilometres before its mission ended. Opportunity travelled an incredible 45.16 kilometres. It even drove farther than a full marathon on another world. These little robots had achieved far more than anyone expected.",
        duration: 23478,
      },
      {
        id: "opp-s11",
        title: "SPIRIT — THE FINAL JOURNEY",
        image: "/textures/mars_surface.jpg",
        caption: "But even the strongest explorers face problems. In May 2009, Spirit became stuck in soft Martian soil. Its wheels could no longer find enough grip to move forward. Engineers on Earth tried different ways to free it, but the rover remained trapped. It continued doing some scientific work from its position, but eventually the cold Martian winter made it impossible to keep communicating.",
        duration: 27391,
      },
      {
        id: "opp-s12",
        title: "JUNE 10, 2018 — OPPORTUNITY'S FINAL SIGNAL",
        image: "/textures/mars_surface.jpg",
        caption: "Opportunity continued exploring long after Spirit had stopped communicating. But in June 2018, a massive dust storm spread across Mars. Thick dust blocked sunlight from reaching the rover's solar panels. Without enough sunlight, its batteries could not receive the power needed to keep operating. On June 10, 2018, Earth received its final signal from Opportunity. After months of trying, NASA officially ended the mission in February 2019.",
        duration: 29130,
      },
      {
        id: "opp-s13",
        title: "TWO ROVERS. YEARS OF DISCOVERY. A LEGACY THAT WILL NEVER BE FORGOTTEN. FINAL DOCUMENTARY AUDIO IDENTITY Narrator: * Warm, natural and engaging voice. * Simple English and clear pronunciation. * Moderate speaking speed. * Curious and adventurous storytelling. * Avoid robotic or overly dramatic delivery. Background music: * Cinematic orchestral space documentary. * Mysterious opening. * Exciting music during launches and landings. * Scientific discovery music during rock examinations. * Adventurous music during long journeys. * Emotional music during the final communication scenes. Sound effects: * Rocket launches. * Spacecraft communication. * Parachute deployment. * Airbag landing impacts. * Rover wheel movement. * Robotic arm movement. * Rock grinding. * Dust storm winds. * Radio signal fading. * Cinematic transitions. Audio mixing: * Keep narration louder and clearer than background music. * Sound effects should support the story, not distract from it. * Use smooth audio transitions between slides. * Avoid sudden changes in volume.",
        image: "/textures/mars_surface.jpg",
        caption: "Today, Spirit and Opportunity remain on Mars, silent but not forgotten. They showed us that Mars once had environments where water existed and where conditions may have been suitable for tiny forms of life. They worked for years beyond their planned missions and sent back thousands of photographs and valuable scientific information. Their journeys ended, but their discoveries changed the way humanity understands Mars forever.",
        duration: 28261,
      }
    ],
  },

  // 9. InSight Lander (Mars) — Complete 13-slide unabridged documentary
  'insight': {
    machineId: 'insight',
    machineName: 'InSight Mars Lander',
    body: 'mars',
    missionTitle: 'INSIGHT LANDER',
    tagline: 'Listening to the Heart of Mars.',
    slides: [
      {
        id: "insight-s1",
        title: "TWO LANDERS. TWO DIFFERENT MYSTERIES.",
        image: "/textures/mars_surface.jpg",
        caption: "Imagine exploring a planet where you cannot see what is hiding beneath the ground or what is happening deep inside. How would you discover its secrets? NASA sent two special machines to Mars. Phoenix searched beneath the surface for water ice, while InSight listened to movements deep inside the planet. They explored two different mysteries, but both helped us understand the Red Planet.",
        duration: 27391,
      },
      {
        id: "insight-s2",
        title: "PHOENIX — SEARCHING FOR WATER ICE",
        image: "/textures/mars_surface.jpg",
        caption: "Scientists wanted to know whether water ice was hiding beneath the Martian surface. They knew that Mars had water in its past, but they needed to understand where it was and what the soil could tell them. Phoenix was designed to land in the cold northern region of Mars, dig into the ground and examine samples. Its mission was to investigate the history of water and whether the environment could support life.",
        duration: 31304,
      },
      {
        id: "insight-s3",
        title: "A ROBOTIC ARM. A TINY LABORATORY. A BIG DISCOVERY.",
        image: "/textures/mars_surface.jpg",
        caption: "Meet Phoenix, a robotic lander equipped with cameras, a weather station and a powerful robotic arm. Its arm could reach into the Martian soil and dig down about half a metre. It also carried tiny scientific laboratories that could heat soil samples and examine their chemical ingredients. Phoenix was like a small science laboratory designed to investigate the cold Martian ground.",
        duration: 26522,
      },
      {
        id: "insight-s4",
        title: "MAY 25, 2008 — PHOENIX LANDS ON MARS",
        image: "/textures/mars_surface.jpg",
        caption: "On August 4, 2007, Phoenix launched towards Mars. After travelling through space for several months, it finally reached the Red Planet on May 25, 2008. It entered the atmosphere at incredible speed, opened its parachute and fired its landing rockets. Then, its three landing legs touched the ground safely. Phoenix had reached one of the coldest regions ever explored on Mars.",
        duration: 26522,
      },
      {
        id: "insight-s5",
        title: "DIGGING FOR SECRETS BENEATH MARS",
        image: "/textures/mars_surface.jpg",
        caption: "After landing, Phoenix began its most important job. Its robotic arm slowly reached down and dug into the Martian soil. It created small trenches and collected samples from different depths. The material was then delivered to its onboard laboratories. Scientists were finally able to investigate what was hiding beneath the surface of Mars.",
        duration: 23043,
      },
      {
        id: "insight-s6",
        title: "WATER ICE DISCOVERED BENEATH MARS!",
        image: "/textures/mars_surface.jpg",
        caption: "Then something surprising happened. Phoenix uncovered small, bright pieces of material beneath the surface. Scientists watched them carefully. Over the next few days, the white pieces slowly disappeared. They were not ordinary rocks. The scientists realized that the material was water ice, which slowly changed directly into gas under the Martian conditions. Phoenix had discovered frozen water beneath the surface!",
        duration: 26087,
      },
      {
        id: "insight-s7",
        title: "ANOTHER CLUE HIDDEN IN MARTIAN SOIL",
        image: "/textures/mars_surface.jpg",
        caption: "Phoenix discovered something else too. Its laboratory found a chemical called perchlorate in the Martian soil. This was important because perchlorate can affect how water behaves and how organisms might survive in certain environments. Scientists now had more information about the chemistry of Mars. But the discovery did not prove that life existed there. It simply gave researchers another important clue.",
        duration: 26522,
      },
      {
        id: "insight-s8",
        title: "NOVEMBER 2008 — PHOENIX FALLS SILENT",
        image: "/textures/mars_surface.jpg",
        caption: "Phoenix was designed to work for about three months, and it successfully completed its planned mission. But winter was approaching. Its solar panels depended on sunlight, and the long, dark Martian winter made it harder to produce enough power. The cold became extreme, and communication eventually stopped in November 2008. The little lander could no longer continue its work.",
        duration: 25652,
      },
      {
        id: "insight-s9",
        title: "INSIGHT — EXPLORING THE HEART OF MARS",
        image: "/textures/mars_surface.jpg",
        caption: "Years later, NASA sent another lander to investigate a completely different mystery. Scientists wanted to understand what was happening deep inside Mars. What was hidden beneath its rocky surface? Did it have layers like Earth? Was its interior still moving? InSight was designed to study the planet's inside by detecting tiny vibrations travelling through its ground.",
        duration: 24348,
      },
      {
        id: "insight-s10",
        title: "ONE PLACE. MANY SECRETS BENEATH THE SURFACE.",
        image: "/textures/mars_surface.jpg",
        caption: "InSight landed on Mars on November 26, 2018, in a region called Elysium Planitia. It carried a special instrument called SEIS, a very sensitive seismometer that could detect tiny movements in the ground. It also carried another experiment designed to measure heat flowing from deep inside Mars. Unlike Phoenix, InSight was not sent to travel around. Its job was to stay in one place and study the planet beneath it.",
        duration: 30435,
      },
      {
        id: "insight-s11",
        title: "MORE THAN 1,300 MARSQUAKES DETECTED",
        image: "/textures/mars_surface.jpg",
        caption: "Just like Earth, Mars experiences earthquakes. Scientists call them marsquakes. InSight's sensitive instrument detected vibrations travelling through the planet. By studying these signals, scientists could understand what was happening deep below the surface. During its mission, InSight detected more than 1,300 marsquakes, giving researchers an incredible new way to investigate the inside of another planet.",
        duration: 23913,
      },
      {
        id: "insight-s12",
        title: "A DIFFICULT EXPERIMENT. IMPORTANT DISCOVERIES.",
        image: "/textures/mars_surface.jpg",
        caption: "InSight also carried a special heat probe designed to dig deep into the Martian ground. Scientists wanted to measure how much heat was escaping from the planet's interior. But the probe faced an unexpected problem. The soil did not provide the grip it needed, and the instrument struggled to dig as planned. Even though this experiment did not reach its intended depth, InSight's other instruments continued collecting valuable scientific information.",
        duration: 30435,
      },
      {
        id: "insight-s13",
        title: "ONE DUG FOR WATER. ONE LISTENED TO THE PLANET. BOTH CHANGED WHAT WE KNOW ABOUT MARS. FINAL DOCUMENTARY AUDIO IDENTITY Narrator: * Warm, natural and engaging voice. * Simple English and clear pronunciation. * Moderate speaking speed. * Curious and adventurous storytelling. * Avoid robotic or overly dramatic delivery. Background music: * Cinematic orchestral space documentary. * Mysterious opening. * Scientific discovery music during Phoenix's ice discovery. * Suspenseful music during the final Phoenix communication. * Deep atmospheric music during InSight's marsquake experiments. * Emotional music during the final scene. Sound effects: * Rocket launch. * Spacecraft landing. * Martian wind. * Robotic arm movement. * Soil digging. * Ice discovery. * Laboratory scanning. * Deep seismic vibrations. * Scientific instrument deployment. * Radio signal fading. * Cinematic transitions. Audio mixing: * Keep narration louder and clearer than background music. * Sound effects should support the story, not distract from it. * Use smooth audio transitions between slides. * Avoid sudden changes in volume.",
        image: "/textures/mars_surface.jpg",
        caption: "Phoenix and InSight eventually became silent, but their discoveries remain important. Phoenix confirmed water ice beneath the Martian surface and investigated the chemistry of its soil. InSight listened to marsquakes and revealed important details about the planet's hidden interior. One explored what was beneath the ground. The other explored what was deep inside the planet. Their missions ended, but Mars still holds many secrets waiting to be discovered.",
        duration: 29565,
      }
    ],
  },

  // 10. Perseverance & Ingenuity Helicopter (Mars) — Complete 13-slide unabridged documentary
  'perseverance-ingenuity': {
    machineId: 'perseverance-ingenuity',
    machineName: 'Ingenuity Mars Helicopter',
    body: 'mars',
    missionTitle: 'INGENUITY HELICOPTER',
    tagline: 'The Little Aircraft That Flew on Another World.',
    slides: [
      {
        id: "ing-s1",
        title: "THE FIRST AIRCRAFT TO FLY ON ANOTHER PLANET",
        image: "/textures/mars_surface.jpg",
        caption: "Imagine flying a helicopter on a planet millions of miles away. Could it really work? In 2021, NASA sent a tiny helicopter called Ingenuity to Mars. It was small, lightweight and carried two spinning blades. Its mission was to prove that an aircraft could actually fly on another planet. And against all expectations, it succeeded!",
        duration: 23913,
      },
      {
        id: "ing-s2",
        title: "EXPLORING MARS FROM ABOVE",
        image: "/textures/mars_surface.jpg",
        caption: "Most Mars explorers travel on the ground using wheels. But what if we could explore Mars from the sky? An aircraft could look over rocks, hills and difficult areas that rovers cannot easily reach. NASA wanted to test this exciting idea. Ingenuity was created to discover whether future explorers could use helicopters to study Mars from above.",
        duration: 24783,
      },
      {
        id: "ing-s3",
        title: "49 CM TALL. 1.8 KG. BUILT TO FLY.",
        image: "/textures/mars_surface.jpg",
        caption: "Meet Ingenuity. It was only about 49 centimetres tall and weighed around 1.8 kilograms. It had two sets of lightweight rotor blades, four landing legs, a solar panel and a small camera system. It looked simple, but every part had an important job. This little aircraft was designed to survive and fly in the extremely thin atmosphere of Mars.",
        duration: 25652,
      },
      {
        id: "ing-s4",
        title: "HOW DO YOU FLY IN SUCH THIN AIR?",
        image: "/textures/mars_surface.jpg",
        caption: "Flying on Mars was not easy. Its atmosphere is extremely thin, containing only about one percent of Earth's surface air pressure. That means there is much less air for helicopter blades to push against. Ingenuity needed specially designed, lightweight blades that could spin incredibly fast to create enough lift. It was an engineering challenge unlike anything attempted before.",
        duration: 25217,
      },
      {
        id: "ing-s5",
        title: "JULY 30, 2020 — THE JOURNEY BEGINS",
        image: "/textures/mars_surface.jpg",
        caption: "On July 30, 2020, NASA launched its Perseverance rover towards Mars. Ingenuity travelled underneath the rover, safely protected during the journey. After seven months in space, they finally arrived on February 18, 2021. Perseverance carried the tiny helicopter to a place called Jezero Crater, where its historic flight experiments would begin.",
        duration: 22174,
      },
      {
        id: "ing-s6",
        title: "APRIL 3, 2021 — INGenuity REACHES THE GROUND",
        image: "/textures/mars_surface.jpg",
        caption: "After reaching Mars, Perseverance carefully placed Ingenuity on the ground. On April 3, 2021, the rover moved away, leaving the helicopter alone on the Martian surface. Ingenuity had to survive the freezing nights and use its solar panel to recharge its batteries. Now, everything was ready for its first flight.",
        duration: 21739,
      },
      {
        id: "ing-s7",
        title: "APRIL 19, 2021 — THE FIRST FLIGHT ON ANOTHER WORLD",
        image: "/textures/mars_surface.jpg",
        caption: "On April 19, 2021, the moment finally arrived. Ingenuity's blades began spinning faster and faster. Suddenly, its four legs lifted away from the ground. It climbed about three metres into the air, hovered for 30 seconds and safely landed again. It had done something no aircraft had ever done before. Humanity had flown on another planet!",
        duration: 24348,
      },
      {
        id: "ing-s8",
        title: "5 FLIGHTS PLANNED. A MUCH BIGGER JOURNEY AHEAD.",
        image: "/textures/mars_surface.jpg",
        caption: "NASA originally designed Ingenuity to complete only five test flights over 30 days. Each flight would test something different, such as hovering, moving forward and landing safely. The goal was not to explore the planet like a rover. It was simply to prove that powered flight was possible in the thin Martian atmosphere. But Ingenuity was about to surprise everyone.",
        duration: 26087,
      },
      {
        id: "ing-s9",
        title: "FROM TEST FLIGHTS TO AERIAL EXPLORATION",
        image: "/textures/mars_surface.jpg",
        caption: "But five flights were not enough for Ingenuity. It performed so well that NASA extended its mission. Soon, it was helping the Perseverance rover by flying ahead, photographing rocks and identifying interesting areas. Scientists could use these aerial pictures to decide where the rover should travel next. Ingenuity had become more than an experiment. It was now an aerial explorer!",
        duration: 26087,
      },
      {
        id: "ing-s10",
        title: "72 FLIGHTS. 17 KM. 24 METRES HIGH.",
        image: "/textures/mars_surface.jpg",
        caption: "Over nearly three years, Ingenuity completed an incredible 72 flights. It travelled about 17 kilometres, spent more than two hours in the air and reached a maximum height of 24 metres. Remember, this tiny helicopter was originally expected to fly only five times. It had achieved far more than anyone imagined!",
        duration: 22174,
      },
      {
        id: "ing-s11",
        title: "EVERY FLIGHT BROUGHT A NEW CHALLENGE",
        image: "/textures/mars_surface.jpg",
        caption: "Flying on Mars was always difficult. Ingenuity had to deal with dust, freezing temperatures and changing ground conditions. Its team constantly studied flight information and adjusted its operations. The helicopter even survived a Martian winter and continued flying in places with difficult terrain. Every successful flight taught engineers something new about how aircraft could work on other worlds.",
        duration: 25217,
      },
      {
        id: "ing-s12",
        title: "JANUARY 18, 2024 — THE FINAL FLIGHT",
        image: "/textures/mars_surface.jpg",
        caption: "On January 18, 2024, Ingenuity completed its 72nd and final flight. During its landing, one or more rotor blades were damaged. The damage meant the helicopter could no longer fly. NASA announced the end of its mission on January 25, 2024. After almost three years of exploration, the little aircraft had finally completed its journey.",
        duration: 23913,
      },
      {
        id: "ing-s13",
        title: "THE FIRST FLIGHT. 72 INCREDIBLE JOURNEYS. A LEGACY BEYOND THE SKY. FINAL DOCUMENTARY AUDIO IDENTITY Narrator: * Warm, natural and engaging voice. * Simple English and clear pronunciation. * Moderate speaking speed. * Curious and adventurous storytelling. * Avoid robotic or overly dramatic delivery. Background music: * Cinematic orchestral space documentary. * Mysterious opening. * Exciting music during launch and deployment. * Triumphant music during the first flight. * Adventurous music during extended exploration. * Emotional music during the final flight. Sound effects: * Rocket launch. * Spacecraft communication. * Rotor blades spinning. * Helicopter lift-off. * Landing sounds. * Martian wind. * Camera shutter. * Electronic flight data. * Final cinematic transition. Audio mixing: * Keep narration louder and clearer than background music. * Sound effects should support the story, not distract from it. * Use smooth audio transitions between slides. * Avoid sudden changes in volume.",
        image: "/textures/mars_surface.jpg",
        caption: "Today, Ingenuity remains on Mars, standing silently where its final flight ended. Its blades no longer turn, but its achievement will never be forgotten. It proved that humans could fly an aircraft on another planet. Its success may help future missions explore distant worlds from the sky. It was only a tiny helicopter, but it opened an entirely new way of exploring space.",
        duration: 27391,
      }
    ],
  },

  // 11. Curiosity Rover (Mars) — Complete 13-slide unabridged documentary
  'curiosity': {
    machineId: 'curiosity',
    machineName: 'Curiosity Rover (Mars Science Laboratory)',
    body: 'mars',
    missionTitle: 'CURIOSITY ROVER',
    tagline: 'Ten Years of Discovery inside Gale Crater.',
    slides: [
      {
        id: "cur-s1",
        title: "A NUCLEAR EXPLORER FOR THE RED PLANET",
        image: "/textures/mars_surface.jpg",
        caption: "Imagine building a mobile scientific laboratory as large as a car, powered by the heat of decaying plutonium, and rocketing it to Mars. In November 2011, NASA launched the Curiosity Rover on an ambitious mission to answer one of humanity's most profound questions: was Mars ever habitable for microbial life?",
        duration: 21739,
      },
      {
        id: "cur-s2",
        title: "SEVEN MINUTES OF TERROR",
        image: "/textures/mars_surface.jpg",
        caption: "Entering the Martian atmosphere at thirteen thousand miles per hour, Curiosity faced the infamous seven minutes of terror. Because it was too heavy for airbags, engineers invented the Sky Crane: a rocket-powered descent stage that lowered the rover down on nylon tethers to touch Martian soil with pinpoint precision.",
        duration: 21304,
      },
      {
        id: "cur-s3",
        title: "TOUCHDOWN IN GALE CRATER",
        image: "/textures/mars_surface.jpg",
        caption: "On August 6, 2012, Curiosity safely touched down at Bradbury Landing inside Gale Crater. Towering three miles above the crater floor stood Mount Sharp, an ancient mountain composed of sedimentary layers that preserve billions of years of planetary history.",
        duration: 16957,
      },
      {
        id: "cur-s4",
        title: "DISCOVERING ANCIENT WATER STREAMBEDS",
        image: "/textures/mars_surface.jpg",
        caption: "Within weeks of landing, Curiosity discovered rounded gravel and pebbles cemented into rock. Their rounded shape proved that ancient, vigorous streams of water—flowing between ankle and hip deep—once rushed across the surface of Mars for thousands of years.",
        duration: 16522,
      },
      {
        id: "cur-s5",
        title: "YELLOWKNIFE BAY: AN ANCIENT HABITABLE LAKE",
        image: "/textures/mars_surface.jpg",
        caption: "At Yellowknife Bay, Curiosity used its robotic percussive drill for the very first time on another planet. Analyzing the gray rock powder, the onboard laboratories revealed essential elements of life: carbon, hydrogen, oxygen, phosphorus, and sulfur, proving Gale Crater once held a calm, freshwater lake.",
        duration: 19565,
      },
      {
        id: "cur-s6",
        title: "ORGANIC MOLECULES PRESERVED IN CLAYS",
        image: "/textures/mars_surface.jpg",
        caption: "Drilling deeper into three-billion-year-old mudstones, Curiosity's chemical laboratory discovered complex organic carbon molecules preserved inside the clay minerals. While not direct proof of life, it demonstrated that organic building blocks have survived in Martian rocks for billions of years.",
        duration: 16957,
      },
      {
        id: "cur-s7",
        title: "CLIMBING MOUNT SHARP'S SEDIMENTARY LAYERS",
        image: "/textures/mars_surface.jpg",
        caption: "Curiosity began its long ascent up the foothills of Mount Sharp, reading each sedimentary rock layer like chapters in a planetary history book. As the rover climbed higher, the rock chemistry changed, reflecting how the climate of Mars dramatically transformed over geological time.",
        duration: 18696,
      },
      {
        id: "cur-s8",
        title: "THE TRANSITION FROM WET TO DRY",
        image: "/textures/mars_surface.jpg",
        caption: "Passing from clay-rich strata into sulfate-mineral layers, Curiosity traced the fateful epoch when Mars lost its global magnetic shield, surrendered its thick atmosphere to solar winds, and dried out from a warm, lake-filled world into the frigid desert we see today.",
        duration: 17826,
      },
      {
        id: "cur-s9",
        title: "BATTLING SHARP ROCKS AND DUNES",
        image: "/textures/mars_surface.jpg",
        caption: "Exploring Mars is an unforgiving endurance test. Driving across sharp ventifact rocks punctured holes in Curiosity's aluminum wheels, while treacherous sand dunes threatened to trap the rover. Engineers on Earth adapted by planning safer routes and writing smarter driving algorithms.",
        duration: 17391,
      },
      {
        id: "cur-s10",
        title: "OVER A DECADE OF CONTINUOUS DISCOVERY",
        image: "/textures/mars_surface.jpg",
        caption: "Originally designed for a two-year mission, Curiosity has operated continuously for more than a decade. It has driven over thirty kilometers across alien terrain, drilled dozens of rock samples, and transmitted more than five hundred thousand stunning photographs back to Earth.",
        duration: 17826,
      },
      {
        id: "cur-s11",
        title: "A ROBOTIC GEOLOGIST ARMED WITH LASERS",
        image: "/textures/mars_surface.jpg",
        caption: "Curiosity's mast holds ChemCam, an instrument that fires a high-powered infrared laser to vaporize tiny pinpoints of rock from twenty feet away. By analyzing the flash of glowing plasma, scientists instantly determine the chemical composition of rocks without even having to touch them.",
        duration: 18696,
      },
      {
        id: "cur-s12",
        title: "A NUCLEAR HEART THAT WILL NOT QUIT",
        image: "/textures/mars_surface.jpg",
        caption: "While solar-powered rovers were vulnerable to Martian dust storms, Curiosity draws steady electrical power from its radioisotope thermoelectric generator. Unfazed by darkness, winter chills, or swirling dust, its nuclear battery will keep the rover alive for years to come.",
        duration: 16957,
      },
      {
        id: "cur-s13",
        title: "THE ETERNAL SENTINEL OF MOUNT SHARP",
        image: "/textures/mars_surface.jpg",
        caption: "Today, Curiosity continues to climb Mount Sharp, an enduring monument to human curiosity, perseverance, and ingenuity. Long after its mission concludes, it will remain standing quietly on Mars, forever having proven that our neighboring red planet was once a welcoming, living world.",
        duration: 18261,
      }
    ],
  },
};

/**
 * Returns a structured 13-slide documentary for any machine on the Moon or Mars.
 * Normalizes machine identifiers across both planetary bodies.
 */
export function getStoryForMachine(
  machineId: string,
  fallbackMeta?: { name: string; date: string; coordinates: string; purpose: string; body: 'moon' | 'mars' }
): MachineStory {
  if (MACHINE_STORIES[machineId]) {
    return MACHINE_STORIES[machineId];
  }

  const normalizedId = machineId
    .replace(/-lm$/, '')
    .replace(/^pathfinder$/, 'pathfinder-sojourner')
    .replace(/^sojourner$/, 'pathfinder-sojourner')
    .replace(/^spirit$/, 'spirit-mer-a')
    .replace(/^opportunity$/, 'opportunity-mer-b')
    .replace(/^perseverance$/, 'perseverance-ingenuity')
    .replace(/^ingenuity$/, 'perseverance-ingenuity');

  if (MACHINE_STORIES[normalizedId]) {
    return MACHINE_STORIES[normalizedId];
  }

  // Handle Apollo series (Apollo 12, 14, 16 map to Apollo Lunar Modules documentary)
  if (machineId.startsWith('apollo-')) {
    const baseApollo = MACHINE_STORIES['apollo-11'];
    return {
      ...baseApollo,
      machineId,
      machineName: fallbackMeta?.name || `Apollo Mission (${machineId.toUpperCase()})`,
      missionTitle: `${(fallbackMeta?.name || machineId).toUpperCase()}`,
    };
  }

  // Handle Viking 2 (maps to Viking Landers documentary)
  if (machineId === 'viking-2') {
    const baseViking = MACHINE_STORIES['viking-1'];
    return {
      ...baseViking,
      machineId: 'viking-2',
      machineName: 'Viking 2 Lander',
      missionTitle: 'VIKING 2',
    };
  }

  // Handle Phoenix (maps to Phoenix & InSight Landers documentary with Phoenix identity)
  if (machineId === 'phoenix') {
    const basePhoenix = MACHINE_STORIES['insight'];
    return {
      ...basePhoenix,
      machineId: 'phoenix',
      machineName: 'Phoenix Mars Lander',
      missionTitle: 'PHOENIX LANDER',
      tagline: 'Touching Martian Water Ice. Exploring the Arctic Plains.',
    };
  }

  // Dynamic 13-Slide Fallback
  const name = fallbackMeta?.name || 'Exploration Machine';
  const body = fallbackMeta?.body || 'moon';
  const date = fallbackMeta?.date || 'Historical Mission Date';
  const coords = fallbackMeta?.coordinates || 'Verified Landing Coordinates';
  const purpose = fallbackMeta?.purpose || 'Pioneered robotic and human planetary exploration.';
  const defaultImage = body === 'moon' ? '/stories/apollo-17/slide-5.jpg' : '/textures/mars_surface.jpg';

  const chapters = [
    { title: `THE VOYAGE OF ${name.toUpperCase()}`, text: `On ${date}, humanity launched ${name} on an ambitious voyage toward ${body === 'moon' ? 'the Moon' : 'Mars'}. Its journey was tracked around the clock by tracking antennas spanning the globe.` },
    { title: 'THE SCIENTIFIC CHALLENGE', text: 'Entering planetary orbit required extraordinary navigation across millions of miles of deep interplanetary space. Guidance computers fired small attitude thrusters to maintain precise alignment with distant navigation stars.' },
    { title: 'AN EXTRAORDINARY MACHINE', text: `Engineers designed ${name} with specialized titanium alloy structures, multilayer insulation foil, and radiation-shielded electronics to withstand the hostile vacuum and thermal extremes of deep space.` },
    { title: 'DESCENT AND APPROACH', text: 'Carefully braking against planetary gravity, guidance computers adjusted descent thrusters second by second while onboard radars mapped the approaching surface craters and boulder fields.' },
    { title: 'TOUCHDOWN ON ALIEN SOIL', text: `Touching down safely at ${coords}, the spacecraft verified its integrity, settled onto the alien terrain, deployed its solar arrays, and transmitted its first confirmation telemetry back to mission control.` },
    { title: 'PRIMARY EXPLORATION MISSION', text: `${purpose} Every sensor reading provided scientists with vital clues about planetary formation, ancient geology, and the evolving dynamics of our solar system.` },
    { title: 'TRANSMITTING ACROSS DEEP SPACE', text: 'Parabolic dish antennas beamed back thousands of scientific measurements, atmospheric telemetry, and high-resolution photographs through NASA Deep Space Network stations in California, Spain, and Australia.' },
    { title: 'ENDURING EXTREME ENVIRONMENTS', text: 'Surviving brutal thermal swings from blistering days to freezing nights, the machine never ceased operating. Sensitive scientific instruments recorded invaluable real-time data under extreme cosmic radiation.' },
    { title: 'EXPANDING HUMAN HORIZONS', text: 'Discoveries made by this mission rewritten scientific textbooks and answered fundamental questions about our solar system, laying critical foundations for future crewed and robotic exploration programs.' },
    { title: 'THE FINAL TRANSMISSION', text: 'After completing its primary and extended mission objectives, the spacecraft transmitted its final telemetry packet across the interplanetary void before concluding active science operations.' },
    { title: 'SILENT WITNESS ON ALIEN SOIL', text: 'Today, the physical structure rests quietly at its landing site, perfectly preserved under cosmic rays and micrometeorite impacts, an eternal tribute to the scientists and engineers who brought it to life.' },
    { title: 'A PERMANENT SCIENTIFIC LEGACY', text: 'Decades after launch, data collected by this spacecraft continues to be studied by researchers around the world, unlocking new insights into planetary origins and the history of our solar system.' },
    { title: 'THEIR STORIES NEVER END', text: 'Though active telemetry ceased, the mission lives on in the annals of space exploration. Standing silently on another world, it remains an everlasting monument to human curiosity, perseverance, and daring.' },
  ];

  return {
    machineId,
    machineName: name,
    body,
    missionTitle: name.toUpperCase(),
    tagline: 'Their missions ended. Their stories continue.',
    slides: chapters.map((c, idx) => ({
      id: `${machineId}-s${idx + 1}`,
      title: c.title,
      image: defaultImage,
      caption: c.text,
      duration: Math.max(10000, Math.round((c.text.split(/\s+/).length / 2.3) * 1000)),
    })),
  };
}
