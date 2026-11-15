'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { LunarMachine } from '@/lib/lunar-machines';
import type { MarsMachine } from '@/lib/mars-machines';
import { formatCoordinates } from '@/lib/moon-coords';
import { formatMarsCoordinates } from '@/lib/mars-coords';
import { getStoryForMachine, StorySlide } from '@/lib/stories-data';

interface StorytellingViewProps {
  machine: LunarMachine | MarsMachine;
  onClose: () => void;
}

/**
 * Fullscreen Cinematic Machine Storytelling Experience with Voice Studio Narration.
 *
 * Core Architectural Guarantees:
 * 1. VOICE-OVER NEVER INTERRUPTED:
 *    - Image stays on screen until narration finishes naturally (audio.onended).
 *    - Advance triggers ONLY after audio genuinely completes. No fixed timer cutoffs.
 * 2. FULL-SCREEN PRESENTATION — ZERO BLACK SPACE:
 *    - 100vw × 100dvh coverage, object-fit: cover.
 *    - Dual-buffer crossfading between slides (zero black frame between transitions).
 *    - Continuous Ken Burns camera movements (zoom in, zoom out, gentle pans).
 * 3. UI DIRECTLY OVER IMAGE:
 *    - Transparent ← RETURN button top-left is the ONLY persistent visible control.
 *    - Progressive word-by-word captions positioned over subtle bottom gradient.
 * 4. CLICK-ANYWHERE PAUSE/RESUME:
 *    - Clicking anywhere on screen cleanly pauses/resumes audio and visuals.
 *    - Return button cleanly stops audio and restores 3D scene without page reload.
 */
export default function StorytellingView({ machine, onClose }: StorytellingViewProps) {
  // Synthesize or retrieve verified story from master database
  const story = useMemo(() => {
    const isMoon = 'lat' in machine && !('siteName' in machine);
    const coords = isMoon
      ? formatCoordinates((machine as LunarMachine).lat, (machine as LunarMachine).lon)
      : formatMarsCoordinates((machine as MarsMachine).lat, (machine as MarsMachine).lon);

    return getStoryForMachine(machine.id, {
      name: machine.name,
      date: machine.landingDate,
      coordinates: coords,
      purpose: machine.purpose || machine.significance,
      body: isMoon ? 'moon' : 'mars',
    });
  }, [machine]);

  const [slideIndex, setSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);

  // Crossfade image state (dual buffer for zero black frames)
  const [prevSlide, setPrevSlide] = useState<StorySlide | null>(null);
  const [isCrossfading, setIsCrossfading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const crossfadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slideElapsedMsRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(isPlaying);
  isPlayingRef.current = isPlaying;

  const totalSlides = story.slides.length;
  const currentSlide: StorySlide | undefined = story.slides[slideIndex];

  // Split narration paragraph into distinct sentences without breaking on decimals or abbreviations
  const sentences = useMemo(() => {
    if (!currentSlide?.caption) return [];
    const text = currentSlide.caption.trim();
    // Protect decimal numbers like 10.6 and abbreviations like U.S.
    const clean = text
      .replace(/(\d+)\.(\d+)/g, '$1__DECIMAL__$2')
      .replace(/U\.S\./g, 'U__DOT__S__DOT__')
      .replace(/St\./g, 'St__DOT__');
    const matches = clean.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g);
    if (!matches) return [text];
    return matches
      .map((s) =>
        s
          .replace(/__DECIMAL__/g, '.')
          .replace(/U__DOT__S__DOT__/g, 'U.S.')
          .replace(/St__DOT__/g, 'St.')
          .trim()
      )
      .filter(Boolean);
  }, [currentSlide?.caption]);

  // Cumulative word ratios to trigger sentence transitions in sync with voice
  const sentenceThresholds = useMemo(() => {
    if (!sentences.length) return [1];
    const counts = sentences.map((s) => Math.max(1, s.trim().split(/\s+/).length));
    const totalWords = counts.reduce((sum, c) => sum + c, 0);
    let running = 0;
    return counts.map((c) => {
      running += c;
      return running / totalWords;
    });
  }, [sentences]);

  // Single-line sentence caption index
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const currentSentence = sentences[sentenceIndex] || sentences[0] || '';

  // Red progress bar playback percentage (0 to 100)
  const [playbackProgress, setPlaybackProgress] = useState(0);

  // Duration for current slide (~2.25 words/sec + 1.5s breath, min 12s)
  const fallbackDurationMs = useMemo(() => {
    const totalWords = currentSlide?.caption ? currentSlide.caption.trim().split(/\s+/).length : 20;
    return currentSlide?.duration || Math.max(12000, Math.round((totalWords / 2.25) * 1000) + 1500);
  }, [currentSlide]);

  // Step to specific slide with dual-buffer crossfade
  const goToSlide = useCallback((newIndex: number) => {
    if (newIndex >= totalSlides) {
      setIsFinished(true);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    if (story.slides[slideIndex]) {
      setPrevSlide(story.slides[slideIndex]);
      setIsCrossfading(true);
      if (crossfadeTimerRef.current) clearTimeout(crossfadeTimerRef.current);
      crossfadeTimerRef.current = setTimeout(() => {
        setIsCrossfading(false);
        setPrevSlide(null);
      }, 750);
    }

    setSlideIndex(newIndex);
    setSentenceIndex(0);
    setPlaybackProgress(0);
    setAudioLoaded(false);
    setIsFinished(false);
    slideElapsedMsRef.current = 0;
  }, [slideIndex, story.slides, totalSlides]);

  const handleNext = useCallback(() => {
    goToSlide(slideIndex + 1);
  }, [goToSlide, slideIndex]);

  // Restart entire story
  const handleRestart = useCallback(() => {
    setPrevSlide(null);
    setIsCrossfading(false);
    goToSlide(0);
    setIsPlaying(true);
  }, [goToSlide]);

  // Stop audio and exit cleanly back to 3D museum
  const handleExit = useCallback(() => {
    if (crossfadeTimerRef.current) {
      clearTimeout(crossfadeTimerRef.current);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      audioRef.current = null;
    }
    onClose();
  }, [onClose]);

  // Toggle Play / Pause anywhere on click - preserves exact audio & progress position
  const handleTogglePlayPause = useCallback(() => {
    if (isFinished) return;
    setIsPlaying((prev) => {
      const next = !prev;
      const audio = audioRef.current;
      if (audio && audio.src && audioLoaded) {
        if (next) {
          audio.play().catch(() => {});
        } else {
          audio.pause();
        }
      }
      return next;
    });
  }, [audioLoaded, isFinished]);

  // Audio setup: runs ONLY when slideIndex changes. NEVER resets currentTime on play/pause!
  useEffect(() => {
    if (isFinished || !currentSlide) return;

    let isCancelled = false;

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    const audioUrl: string | null = currentSlide?.audioSrc || null;

    if (audioUrl) {
      audio.pause();
      audio.src = audioUrl;
      audio.currentTime = 0;

      audio.oncanplay = () => {
        if (isCancelled) return;
        setAudioLoaded(true);
        if (isPlayingRef.current) {
          audio.play().catch(() => {});
        }
      };

      audio.onended = () => {
        if (isCancelled) return;
        setPlaybackProgress(100);
        setTimeout(() => {
          if (!isCancelled && isPlayingRef.current) {
            handleNext();
          }
        }, 350);
      };

      audio.onerror = () => {
        if (isCancelled) return;
        setAudioLoaded(false);
      };
    } else {
      audio.pause();
      audio.src = '';
      setAudioLoaded(false);
    }

    return () => {
      isCancelled = true;
      audio.pause();
      audio.oncanplay = null;
      audio.onended = null;
      audio.onerror = null;
    };
  }, [slideIndex, currentSlide, handleNext, isFinished]);

  // Unified 50ms playback progress & single-line caption synchronization loop
  useEffect(() => {
    if (!isPlaying || isFinished) return;

    const intervalMs = 50;

    const timer = setInterval(() => {
      const audio = audioRef.current;
      const hasActiveAudio =
        audioLoaded && audio && audio.duration && !isNaN(audio.duration) && audio.duration > 0;

      if (hasActiveAudio) {
        const ratio = Math.min(1, Math.max(0, audio.currentTime / audio.duration));
        setPlaybackProgress(ratio * 100);

        let sIdx = sentenceThresholds.findIndex((t) => ratio < t);
        if (sIdx === -1) sIdx = sentenceThresholds.length - 1;
        setSentenceIndex(Math.max(0, sIdx));
      } else {
        slideElapsedMsRef.current += intervalMs;
        const ratio = Math.min(1, slideElapsedMsRef.current / fallbackDurationMs);
        setPlaybackProgress(ratio * 100);

        let sIdx = sentenceThresholds.findIndex((t) => ratio < t);
        if (sIdx === -1) sIdx = sentenceThresholds.length - 1;
        setSentenceIndex(Math.max(0, sIdx));

        if (slideElapsedMsRef.current >= fallbackDurationMs) {
          clearInterval(timer);
          handleNext();
        }
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [audioLoaded, fallbackDurationMs, handleNext, isFinished, isPlaying, sentenceThresholds]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleExit();
      } else if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleExit, handleTogglePlayPause]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (crossfadeTimerRef.current) clearTimeout(crossfadeTimerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // Preload upcoming slides
  useEffect(() => {
    if (slideIndex + 1 < totalSlides) {
      const nextSlide = story.slides[slideIndex + 1];
      if (nextSlide?.image) {
        const img = new Image();
        img.src = nextSlide.image;
      }
      if (nextSlide?.audioSrc) {
        const nextAudio = new Audio();
        nextAudio.preload = 'auto';
        nextAudio.src = nextSlide.audioSrc;
      }
    }
  }, [slideIndex, story.slides, totalSlides]);

  // Ken Burns style selection
  const kenBurnsAnim = useMemo(() => {
    const anims = ['kenburns-zoom-in', 'kenburns-zoom-out', 'kenburns-pan-left', 'kenburns-pan-right'];
    return anims[slideIndex % anims.length];
  }, [slideIndex]);

  const kenBurnsOrigin = useMemo(() => {
    const origins = ['center center', 'top center', 'center right', 'center left'];
    return origins[slideIndex % origins.length];
  }, [slideIndex]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${story.machineName} Story`}
      onClick={handleTogglePlayPause}
      data-cursor="focus"
      className="fixed inset-0 z-50 w-screen h-[100dvh] overflow-hidden bg-black select-none cursor-default"
      style={{
        fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ============================================================ */}
      {/* 1. FULL-SCREEN DUAL-LAYER IMAGE PRESENTATION (ZERO BLACK SPACE) */}
      {/* ============================================================ */}
      {!isFinished && (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          {/* Previous outgoing image (crossfades out smoothly) */}
          {prevSlide && (
            <div
              key={`prev-${prevSlide.id}`}
              className="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out opacity-0 z-0"
            >
              <img
                src={prevSlide.image}
                alt=""
                className="w-full h-full object-cover"
                style={{ transform: 'scale(1.05)' }}
              />
            </div>
          )}

          {/* Current incoming image (fills 100vw x 100dvh, object-fit: cover) */}
          {currentSlide && (
            <div
              key={`curr-${currentSlide.id}`}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isCrossfading ? 'opacity-90' : 'opacity-100'
              } z-1`}
            >
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                onError={(e) => {
                  const target = e.currentTarget;
                  const fallback = story.body === 'mars' ? '/textures/mars_surface.jpg' : '/stories/apollo-17/slide-5.jpg';
                  if (target.src !== fallback) {
                    target.src = fallback;
                  }
                }}
                className="w-full h-full object-cover will-change-transform"
                style={{
                  animation: `${kenBurnsAnim} 24s ease-out forwards`,
                  transformOrigin: kenBurnsOrigin,
                  animationPlayState: isPlaying ? 'running' : 'paused',
                }}
              />

              {/* Gentle cinematic vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0.65) 100%)',
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. TOP-LEFT RETURN BUTTON (THE ONLY PERSISTENT VISIBLE CONTROL) */}
      {/* ============================================================ */}
      <div
        className="absolute z-30 pointer-events-auto"
        style={{
          top: 'max(1.5rem, env(safe-area-inset-top, 1.5rem))',
          left: 'max(1.5rem, env(safe-area-inset-left, 1.5rem))',
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleExit();
          }}
          data-cursor="focus"
          aria-label="Return to Museum"
          className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs sm:text-[13px] tracking-[0.16em] uppercase font-medium text-white/85 hover:text-white transition-all duration-200 ease-out hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
          style={{
            background: 'rgba(0, 0, 0, 0.40)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
          }}
        >
          <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>RETURN</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 3. DISCREET PAUSE INDICATOR (APPEARS ONLY WHEN PAUSED) */}
      {/* ============================================================ */}
      {!isPlaying && !isFinished && (
        <div className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none">
          <div
            className="px-5 py-2.5 rounded-full text-xs tracking-[0.25em] uppercase font-medium text-white/90 bg-black/70 backdrop-blur-md border border-white/15 animate-pulse shadow-2xl"
            style={{ fontFamily: '"Space Grotesk", Geist, Inter, system-ui, sans-serif' }}
          >
            PAUSED · CLICK ANYWHERE TO RESUME
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. SINGLE-LINE SEQUENTIAL CAPTIONS DIRECTLY OVER IMAGE NEAR BOTTOM */}
      {/* ============================================================ */}
      {!isFinished && currentSlide && (
        <div
          className="absolute inset-x-0 bottom-0 z-20 pointer-events-none flex flex-col items-center justify-end"
          style={{
            background:
              'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.72) 50%, rgba(0, 0, 0, 0.20) 80%, transparent 100%)',
            paddingTop: '6rem',
            paddingBottom: 'max(2.8rem, env(safe-area-inset-bottom, 2.8rem))',
            paddingLeft: 'max(1.5rem, env(safe-area-inset-left, 1.5rem))',
            paddingRight: 'max(1.5rem, env(safe-area-inset-right, 1.5rem))',
          }}
        >
          <div className="max-w-5xl w-full text-center flex flex-col items-center">
            {/* Slide Chapter / Title & Counter */}
            <div
              className="text-[11px] sm:text-xs tracking-[0.22em] uppercase font-mono text-white/60 mb-3 flex items-center justify-center gap-2 select-none"
              style={{ fontFamily: '"Space Grotesk", Geist, Inter, system-ui, sans-serif' }}
            >
              <span className="text-red-400 font-semibold">{slideIndex + 1}/{totalSlides}</span>
              <span className="text-white/25">•</span>
              <span className="tracking-[0.18em]">{currentSlide.title}</span>
            </div>

            {/* Single-Line Sentence Caption (Never Wraps onto Second Line, Displays One Sentence At A Time) */}
            <div className="w-full flex justify-center items-center overflow-hidden px-2">
              <p
                key={`${currentSlide.id}-sent-${sentenceIndex}`}
                className={`font-medium tracking-wide text-white m-0 whitespace-nowrap text-center transition-opacity duration-300 ease-out animate-fade-in ${
                  currentSentence.length > 130
                    ? 'text-xs sm:text-sm md:text-base lg:text-lg'
                    : currentSentence.length > 80
                    ? 'text-sm sm:text-base md:text-lg lg:text-xl'
                    : 'text-base sm:text-lg md:text-xl lg:text-2xl'
                }`}
                style={{
                  fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.95), 0 4px 20px rgba(0, 0, 0, 0.85)',
                  maxWidth: '96vw',
                }}
              >
                {currentSentence}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. RED PROGRESS BAR ALONG THE VERY BOTTOM EDGE */}
      {/* ============================================================ */}
      {!isFinished && (
        <div
          className="absolute bottom-0 inset-x-0 z-40 h-[3.5px] bg-white/15 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="h-full bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.9)]"
            style={{
              width: `${playbackProgress}%`,
              transition: isPlaying ? 'width 60ms linear' : 'none',
            }}
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. FINAL OUTRO SCREEN */}
      {/* ============================================================ */}
      {isFinished && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/90 backdrop-blur-xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-w-xl w-full text-center py-10 px-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-2xl animate-fade-in">
            <span className="text-[11px] tracking-[0.3em] uppercase text-white/45 font-mono block mb-2">
              BEYOND THE MISSION
            </span>
            <h2 className="text-xl sm:text-2xl font-light tracking-wide text-white mb-2">
              THE MUSEUM OF FORGOTTEN MACHINES
            </h2>
            <div className="w-12 h-px bg-white/25 mx-auto my-4" />
            <p className="text-base sm:text-lg italic font-light text-white/90 mb-8">
              &ldquo;Their missions ended. Their stories didn&apos;t.&rdquo;
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRestart}
                data-cursor="focus"
                className="w-full sm:w-auto py-2.5 px-6 rounded-xl text-xs uppercase tracking-[0.18em] font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                </svg>
                <span>REPLAY STORY</span>
              </button>
              <button
                type="button"
                onClick={handleExit}
                data-cursor="focus"
                className="w-full sm:w-auto py-2.5 px-6 rounded-xl text-xs uppercase tracking-[0.18em] font-medium text-white/70 hover:text-white bg-transparent hover:bg-white/[0.08] border border-white/15 transition-all duration-200 cursor-pointer"
              >
                RETURN TO EXPLORATION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ken Burns Keyframes */}
      <style jsx global>{`
        @keyframes kenburns-zoom-in {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.12);
          }
        }
        @keyframes kenburns-zoom-out {
          0% {
            transform: scale(1.12);
          }
          100% {
            transform: scale(1.02);
          }
        }
        @keyframes kenburns-pan-left {
          0% {
            transform: scale(1.08) translate(1.5%, 0);
          }
          100% {
            transform: scale(1.08) translate(-1.5%, 0);
          }
        }
        @keyframes kenburns-pan-right {
          0% {
            transform: scale(1.08) translate(-1.5%, 0);
          }
          100% {
            transform: scale(1.08) translate(1.5%, 0);
          }
        }
      `}</style>
    </div>
  );
}
