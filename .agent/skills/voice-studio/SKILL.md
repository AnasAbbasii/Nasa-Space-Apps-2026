---
name: voice-studio
description: Guide and operational reference for generating and playing cinematic voice narration in the NASA Beyond the Mission storytelling project using the local Voice Studio service.
---

# Voice Studio Integration Skill

This skill documents how Antigravity and developers interact with the local **Voice Studio** service to generate, cache, and synchronize cinematic voice narration for machine stories across the Moon and Mars museums.

---

## 1. Overview & Architecture

Voice Studio provides an OpenAI-compatible speech synthesis (`/v1/audio/speech`) and model discovery (`/v1/models`) API running locally on port **3900**.

```
┌─────────────────────────────────┐
│ Voice Studio Local Engine (3900) │
│ - OpenAI-compatible TTS API     │
│ - Model: tts-1 (OmniVoice CPU)  │
│ - Voice: default / OpenAI alias │
└────────────────▲────────────────┘
                 │ HTTP POST /v1/audio/speech (Bearer voicestudio)
┌────────────────┴────────────────┐
│ Next.js Backend Service Layer   │
│ - lib/voice-studio.ts           │
│ - app/api/narration/route.ts    │
│ - Caches to public/audio/stories│
└────────────────▲────────────────┘
                 │ Static file URL or Dynamic API
┌────────────────┴────────────────┐
│ Frontend Storytelling Component │
│ - StorytellingView.tsx          │
│ - Synchronized word captions    │
│ - Audio controls (Play/Pause,   │
│   Mute, Replay, Auto-advance)   │
└─────────────────────────────────┘
```

---

## 2. Configuration & Environment Variables

All settings are configured via server-side environment variables in `.env.local` (and documented in `.env.example`). **Never expose these in frontend client bundles.**

```env
# Voice Studio OpenAI-Compatible TTS Configuration
VOICESTUDIO_BASE_URL=http://127.0.0.1:3900/v1
VOICESTUDIO_API_KEY=voicestudio
VOICESTUDIO_MODEL=tts-1
VOICESTUDIO_VOICE=default
```

### Supported Settings:
- `VOICESTUDIO_BASE_URL`: Base URL of the Voice Studio instance (default: `http://127.0.0.1:3900/v1`).
- `VOICESTUDIO_API_KEY`: API authentication key (default: `voicestudio`).
- `VOICESTUDIO_MODEL`: TTS model identifier (e.g. `tts-1`, `tts-1-hd`).
- `VOICESTUDIO_VOICE`: Voice identifier or alias (e.g. `default`, `alloy`, `echo`, `nova`, `onyx`).

---

## 3. Server-Side Service (`lib/voice-studio.ts`)

The project provides high-level helpers in [lib/voice-studio.ts](file:///c:/Users/Hassaan%20Abbasi/Desktop/appfolder/lib/voice-studio.ts):

### 3.1 Health Check
```typescript
import { checkVoiceStudioHealth } from '@/lib/voice-studio';

const health = await checkVoiceStudioHealth(2500);
if (health.available) {
  console.log('Voice Studio is online. Models:', health.models);
} else {
  console.warn('Voice Studio offline:', health.error);
}
```

### 3.2 Generating Raw MP3 Buffer
```typescript
import { generateSpeechBuffer } from '@/lib/voice-studio';

const mp3Buffer = await generateSpeechBuffer({
  input: "On December 11, 1972, Challenger touched down at Taurus-Littrow.",
  voice: 'default',
  model: 'tts-1',
});
```

### 3.3 Scene-Specific Audio with Disk Caching
```typescript
import { getOrCreateStoryAudio } from '@/lib/voice-studio';

// Checks public/audio/stories/[machineId]/[slideId].mp3 first.
// If absent, calls Voice Studio, saves file to disk, and returns public URL.
const result = await getOrCreateStoryAudio({
  machineId: 'apollo-17',
  slideId: 'a17-s1',
  text: 'Slide narration text...',
  regenerate: false, // Set to true to overwrite existing audio
});

console.log(result.audioUrl); // e.g. "/audio/stories/apollo-17/a17-s1.mp3"
console.log(result.cached);   // true if retrieved from disk, false if newly generated
```

---

## 4. REST API Endpoint (`/api/narration`)

The endpoint [app/api/narration/route.ts](file:///c:/Users/Hassaan%20Abbasi/Desktop/appfolder/app/api/narration/route.ts) enables frontend and batch scripts to generate audio:

### Health Check
```bash
curl -s "http://localhost:3000/api/narration?action=health"
```
**Response:**
```json
{
  "available": true,
  "baseUrl": "http://127.0.0.1:3900/v1",
  "model": "tts-1",
  "voice": "default",
  "models": ["tts-1", "tts-1-hd", "gpt-4o-mini-tts", ...]
}
```

### Generate or Retrieve Scene Audio
```bash
curl -X POST "http://localhost:3000/api/narration" \
  -H "Content-Type: application/json" \
  -d '{
    "machineId": "apollo-17",
    "slideId": "a17-s5",
    "text": "On December 11, 1972, Challenger began its descent towards the lunar surface."
  }'
```
**Response:**
```json
{
  "success": true,
  "audioUrl": "/audio/stories/apollo-17/a17-s5.mp3",
  "cached": false,
  "sizeBytes": 28450
}
```

---

## 5. Adding Narration for New Machines or Stories

When adding a new machine narrative (e.g. Apollo 11, Curiosity, Perseverance):

1. **Define Slides in `lib/stories-data.ts`**:
   Assign unique slide IDs and narration captions:
   ```typescript
   {
     id: 'curiosity-s1',
     title: 'TOUCHDOWN AT GALE CRATER',
     image: '/textures/mars_surface.jpg',
     caption: 'In August 2012, NASA landed the Curiosity rover inside Gale Crater...',
     duration: 4800,
     audioSrc: '/audio/stories/curiosity/curiosity-s1.mp3',
   }
   ```

2. **Generate Audio via CLI or Script**:
   Create a small batch script or call the API:
   ```javascript
   const { getOrCreateStoryAudio } = require('./lib/voice-studio');
   await getOrCreateStoryAudio({
     machineId: 'curiosity',
     slideId: 'curiosity-s1',
     text: slide.caption
   });
   ```

3. **Verify Audio Files**:
   Files are saved to `public/audio/stories/<machineId>/<slideId>.mp3` and automatically served by Next.js.

---

## 6. Playback Synchronization Architecture

In [components/experience/StorytellingView.tsx](file:///c:/Users/Hassaan%20Abbasi/Desktop/appfolder/components/experience/StorytellingView.tsx):
- When audio is playing, `audio.ontimeupdate` continuously synchronizes the revealed word count:
  $$\text{progress} = \frac{\text{currentTime}}{\text{duration}}$$
  $$\text{revealedWords} = \lfloor \text{progress} \times N \rfloor$$
- When audio finishes (`audio.onended`), all words are revealed and the slideshow transitions to the next slide after a 500ms natural pause.
- If audio is unavailable (Voice Studio offline or file absent), the component automatically falls back to the internal timer (~180–250ms/word) without breaking the experience.

---

## 7. Troubleshooting

| Issue | Cause | Resolution |
| :--- | :--- | :--- |
| **`Connection refused` on 3900** | Voice Studio server is not running | Start Voice Studio on port 3900 (`http://127.0.0.1:3900`). |
| **Synthesis takes >30 seconds** | CPU-only PyTorch execution | Voice Studio uses CPU inference on this system. Keep captions under 3–4 sentences per slide. Pre-generate audio for production. |
| **Audio does not play in browser** | Autoplay policy restriction | The audio plays in response to the user's initial click on "EXPLORE THE STORY" (valid user gesture). Ensure audio is not blocked by browser settings. |
| **Audio fails on Vercel deployment** | Serverless filesystem is read-only | Pre-generate audio files so they are committed in `public/audio/stories/`. Next.js serves them as static files without calling Voice Studio in production. |
