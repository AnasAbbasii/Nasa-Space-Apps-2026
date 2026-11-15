import { NextRequest, NextResponse } from 'next/server';
import {
  checkVoiceStudioHealth,
  getOrCreateStoryAudio,
} from '@/lib/voice-studio';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/narration
 * Query params:
 * - ?action=health : Returns Voice Studio connection health status and available models.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'health') {
    const health = await checkVoiceStudioHealth();
    return NextResponse.json(health);
  }

  return NextResponse.json(
    { error: 'Invalid action. Supported: ?action=health' },
    { status: 400 }
  );
}

/**
 * POST /api/narration
 * Body:
 * {
 *   machineId: string,
 *   slideId: string,
 *   text: string,
 *   voice?: string,
 *   regenerate?: boolean
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { machineId, slideId, text, voice, regenerate } = body;

    if (!machineId || typeof machineId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'machineId is required' },
        { status: 400 }
      );
    }

    if (!slideId || typeof slideId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'slideId is required' },
        { status: 400 }
      );
    }

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { success: false, error: 'Narration text is required' },
        { status: 400 }
      );
    }

    const result = await getOrCreateStoryAudio({
      machineId,
      slideId,
      text,
      voice,
      regenerate: Boolean(regenerate),
    });

    return NextResponse.json({
      success: true,
      audioUrl: result.audioUrl,
      cached: result.cached,
      sizeBytes: result.sizeBytes,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[API /api/narration error]:', message);

    return NextResponse.json(
      {
        success: false,
        error: message,
        audioUrl: null,
      },
      { status: 503 }
    );
  }
}
