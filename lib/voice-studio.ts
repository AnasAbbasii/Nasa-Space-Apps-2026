import fs from 'node:fs';
import path from 'node:path';

/**
 * Voice Studio Configuration
 * Resolved server-side from environment variables. Never exposed to the client.
 */
export function getVoiceStudioConfig() {
  const baseUrl = (process.env.VOICESTUDIO_BASE_URL || 'http://127.0.0.1:3900/v1').replace(/\/+$/, '');
  const apiKey = process.env.VOICESTUDIO_API_KEY || 'voicestudio';
  const model = process.env.VOICESTUDIO_MODEL || 'tts-1';
  const voice = process.env.VOICESTUDIO_VOICE || 'default';

  return {
    baseUrl,
    apiKey,
    model,
    voice,
  };
}

export interface VoiceStudioHealthResult {
  available: boolean;
  baseUrl: string;
  model: string;
  voice: string;
  models?: string[];
  error?: string;
}

/**
 * Checks whether the local Voice Studio server is running and accessible.
 */
export async function checkVoiceStudioHealth(timeoutMs: number = 2500): Promise<VoiceStudioHealthResult> {
  const config = getVoiceStudioConfig();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${config.baseUrl}/models`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        available: false,
        baseUrl: config.baseUrl,
        model: config.model,
        voice: config.voice,
        error: `Voice Studio responded with HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const data = await res.json();
    const models = Array.isArray(data?.data) ? data.data.map((m: { id: string }) => m.id) : [];

    return {
      available: true,
      baseUrl: config.baseUrl,
      model: config.model,
      voice: config.voice,
      models,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const message = err instanceof Error ? err.message : String(err);
    return {
      available: false,
      baseUrl: config.baseUrl,
      model: config.model,
      voice: config.voice,
      error: message.includes('aborted')
        ? `Connection to Voice Studio at ${config.baseUrl} timed out (${timeoutMs}ms)`
        : `Cannot connect to Voice Studio at ${config.baseUrl}: ${message}`,
    };
  }
}

export interface GenerateSpeechOptions {
  input: string;
  voice?: string;
  model?: string;
  speed?: number;
  timeoutMs?: number;
}

/**
 * Generates an MP3 audio Buffer from text using Voice Studio's OpenAI-compatible endpoint.
 */
export async function generateSpeechBuffer(options: GenerateSpeechOptions): Promise<Buffer> {
  const config = getVoiceStudioConfig();
  const text = options.input ? options.input.trim() : '';

  if (!text) {
    throw new Error('Narration text cannot be empty');
  }

  const timeoutMs = options.timeoutMs ?? 180000; // 3 min default for CPU-based local synthesis
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${config.baseUrl}/audio/speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model || config.model,
        input: text,
        voice: options.voice || config.voice,
        response_format: 'mp3',
        speed: options.speed ?? 1.0,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(
        `Voice Studio speech generation failed (HTTP ${res.status}): ${errText || res.statusText}`
      );
    }

    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(`Voice Studio request timed out after ${timeoutMs}ms`);
    }
    throw err;
  }
}

export interface StoryAudioOptions {
  machineId: string;
  slideId: string;
  text: string;
  voice?: string;
  model?: string;
  regenerate?: boolean;
}

export interface StoryAudioResult {
  audioUrl: string;
  cached: boolean;
  sizeBytes: number;
}

/**
 * Retrieves existing cached audio for a slide or generates a new MP3 using Voice Studio.
 * Audio is cached in public/audio/stories/[machineId]/[slideId].mp3 for static serving.
 */
export async function getOrCreateStoryAudio(options: StoryAudioOptions): Promise<StoryAudioResult> {
  const { machineId, slideId, text, voice, model, regenerate } = options;

  // Sanitize IDs to avoid path traversal
  const safeMachineId = machineId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeSlideId = slideId.replace(/[^a-zA-Z0-9_-]/g, '_');

  const audioDir = path.join(process.cwd(), 'public', 'audio', 'stories', safeMachineId);
  const filePath = path.join(audioDir, `${safeSlideId}.mp3`);
  const publicUrl = `/audio/stories/${safeMachineId}/${safeSlideId}.mp3`;

  // Return cached file if it exists and regeneration is not forced
  if (!regenerate && fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.size > 0) {
      return {
        audioUrl: publicUrl,
        cached: true,
        sizeBytes: stats.size,
      };
    }
  }

  // Generate new audio via Voice Studio
  const buffer = await generateSpeechBuffer({
    input: text,
    voice,
    model,
  });

  // Ensure output directory exists and write file
  try {
    fs.mkdirSync(audioDir, { recursive: true });
    fs.writeFileSync(filePath, buffer);
  } catch (err: unknown) {
    // If running in a read-only serverless environment, log warning but continue
    console.warn(`[VoiceStudio] Could not persist audio file to ${filePath}:`, err);
  }

  return {
    audioUrl: publicUrl,
    cached: false,
    sizeBytes: buffer.length,
  };
}
