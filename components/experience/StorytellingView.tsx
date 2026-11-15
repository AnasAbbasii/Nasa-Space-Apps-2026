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

type AudioState = 'idle' | 'loading' | 'playing' | 'paused' | 'unavailable' | 'error';

/**
 * Fullscreen Cinematic Machine Storytelling Experience with Voice Studio Narration.
 * Features:
 * - 16:9 cinematic frame with subtle Ken Burns zoom
 * - Authentic Voice Studio narration synchronized with progressive captions
 * - Audio controls: Play/Pause, Mute/Unmute, Replay Scene, Auto-advance
 * - Seamless fallback to visual captions if Voice Studio is offline
 * - Segmented progress tracker (e.g. 05 / 13)
 * - Outro screen: "Their missions ended. Their stories didn't."
 * - Custom cursor focus hooks on all interactive elements
 */
export default function StorytellingView({ machine, onClose }: StorytellingViewProps) {
  // Synthesize or retrieve verified story
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
  const [elapsed, setElapsed] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Audio state
  const [isMuted, setIsMuted] = useState(false);
  const [audioState, setAudioState] = useState<AudioState>('loading');
  const [audioDurationMs, setAudioDurationMs] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const totalSlides = story.slides.length;
  const currentSlide: StorySlide | undefined = story.slides[slideIndex];

  // Dynamic slide duration: driven by audio length if available, otherwise default fallback (3-5s)
  const defaultSlideDuration = Math.min(5000, Math.max(3000, currentSlide?.duration || 4800));
  const activeDuration = audioDurationMs && audioDurationMs > 0 ? audioDurationMs : defaultSlideDuration;

  // Split slide caption into words for progressive reveal
  const words = useMemo(() => {
    if (!currentSlide?.caption) return [];
    return currentSlide.caption.trim().split(/\s+/);
  }, [currentSlide]);

  // Word reveal calculation:
  // When audio is available, word progress is directly calculated from audio playback
  const revealedWordCount = useMemo(() => {
    if (!currentSlide || words.length === 0) return 0;
    if (elapsed >= activeDuration) return words.length;

    // If explicit word timestamps exist in slide metadata
    if (currentSlide.wordTimestamps && currentSlide.wordTimestamps.length > 0) {
      const idx = currentSlide.wordTimestamps.findIndex((t) => t > elapsed);
      return idx === -1 ? words.length : idx;
    }

    // Proportional progress over active duration
    const progress = Math.min(1, Math.max(0, elapsed / activeDuration));
    return Math.min(words.length, Math.floor(progress * (words.length + 0.8)));
  }, [activeDuration, currentSlide, elapsed, words.length]);

  // Step to specific slide
  const goToSlide = useCallback((index: number) => {
    setSlideIndex(index);
    setElapsed(0);
    setAudioDurationMs(null);
    setIsFinished(false);
  }, []);

  // Step forwards
  const handleNext = useCallback(() => {
    if (slideIndex < totalSlides - 1) {
      goToSlide(slideIndex + 1);
    } else {
      setIsFinished(true);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [goToSlide, slideIndex, totalSlides]);

  // Step backwards
  const handlePrev = useCallback(() => {
    if (slideIndex > 0) {
      goToSlide(slideIndex - 1);
    }
  }, [goToSlide, slideIndex]);

  // Restart entire story
  const handleRestart = useCallback(() => {
    goToSlide(0);
    setIsPlaying(true);
  }, [goToSlide]);

  // Replay current slide from start
  const handleReplayCurrent = useCallback(() => {
    setElapsed(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [isPlaying]);

  // Toggle Mute
  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.muted = next;
      }
      return next;
    });
  }, []);

  // Stop audio and exit
  const handleExit = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    onClose();
  }, [onClose]);

  // Audio setup and loading per slide
  useEffect(() => {
    if (isFinished || !currentSlide) return;

    let isCancelled = false;
    setAudioState('loading');

    // Create or reuse Audio instance
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.muted = isMuted;

    async function setupAudio() {
      try {
        let audioUrl: string | null = currentSlide?.audioSrc || null;

        // If audio source is not hardcoded, check server-side Voice Studio cache / generator
        if (!audioUrl) {
          try {
            const res = await fetch('/api/narration', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                machineId: story.machineId,
                slideId: currentSlide?.id,
                text: currentSlide?.caption,
              }),
            });
            if (res.ok) {
              const data = await res.json();
              if (data.success && data.audioUrl) {
                audioUrl = data.audioUrl;
              }
            }
          } catch (err) {
            console.warn('[Narration] Voice Studio request failed:', err);
          }
        }

        if (isCancelled) return;

        if (!audioUrl) {
          setAudioState('unavailable');
          return;
        }

        audio.src = audioUrl;
        audio.currentTime = 0;

        audio.onloadedmetadata = () => {
          if (isCancelled) return;
          if (audio.duration && !Number.isNaN(audio.duration) && Number.isFinite(audio.duration)) {
            setAudioDurationMs(Math.round(audio.duration * 1000));
          }
        };

        audio.ontimeupdate = () => {
          if (isCancelled) return;
          setElapsed(Math.round(audio.currentTime * 1000));
        };

        audio.onended = () => {
          if (isCancelled) return;
          // Brief 500ms pause after speech before advancing
          setTimeout(() => {
            if (!isCancelled && isPlaying) {
              handleNext();
            }
          }, 500);
        };

        audio.onerror = () => {
          if (isCancelled) return;
          console.warn(`[Narration] Audio failed to load for slide ${currentSlide?.id}`);
          setAudioState('unavailable');
        };

        // If currently playing, start narration
        if (isPlaying) {
          audio.play().then(() => {
            if (!isCancelled) setAudioState('playing');
          }).catch((err) => {
            // Autoplay or loading issue
            console.warn('[Narration] Playback prevented:', err);
            if (!isCancelled) setAudioState('unavailable');
          });
        } else {
          setAudioState('paused');
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn('[Narration] Audio initialization error:', err);
          setAudioState('unavailable');
        }
      }
    }

    setupAudio();

    return () => {
      isCancelled = true;
      audio.pause();
    };
  }, [currentSlide, handleNext, isFinished, isPlaying, story.machineId]);

  // Synchronize play/pause state with audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || audioState === 'unavailable') return;

    if (isPlaying && !isFinished) {
      if (audio.paused && audio.src) {
        audio.play().catch(() => {});
        setAudioState('playing');
      }
    } else {
      if (!audio.paused) {
        audio.pause();
        setAudioState('paused');
      }
    }
  }, [isPlaying, isFinished, audioState]);

  // Fallback timer: advances slides when audio is unavailable or offline
  useEffect(() => {
    if (!isPlaying || isFinished) return;
    if (audioState === 'playing') return; // Audio ontimeupdate drives playback directly

    const intervalMs = 30;
    const timer = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + intervalMs;
        if (next >= activeDuration) {
          if (slideIndex < totalSlides - 1) {
            setSlideIndex((curr) => curr + 1);
            return 0;
          } else {
            setIsFinished(true);
            setIsPlaying(false);
            return prev;
          }
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [activeDuration, audioState, isFinished, isPlaying, slideIndex, totalSlides]);

  // Preload next image and audio in background
  useEffect(() => {
    if (slideIndex + 1 < totalSlides) {
      const nextSlide = story.slides[slideIndex + 1];
      if (nextSlide?.image) {
        const img = new Image();
        img.src = nextSlide.image;
      }
      if (!nextSlide?.audioSrc) {
        // Prefetch audio in background
        fetch('/api/narration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            machineId: story.machineId,
            slideId: nextSlide.id,
            text: nextSlide.caption,
          }),
        }).catch(() => {});
      }
    }
  }, [slideIndex, story.machineId, story.slides, totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleExit();
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (isFinished) {
          handleRestart();
        } else {
          setIsPlaying((prev) => !prev);
        }
      } else if (e.key === 'KeyM') {
        e.preventDefault();
        handleToggleMute();
      } else if (e.key === 'KeyR') {
        e.preventDefault();
        handleReplayCurrent();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleExit, handleNext, handlePrev, handleReplayCurrent, handleRestart, handleToggleMute, isFinished]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // Progress percentage of current slide
  const currentSlideProgress = Math.min(1, elapsed / activeDuration);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${story.machineName} Story`}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/92 backdrop-blur-xl text-white select-none transition-opacity duration-300 animate-fade-in p-4 sm:p-6 md:p-8"
      style={{
        fontFamily: '"Space Grotesk", Geist, Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Top Bar: Brand, Mission Title, Narration Badge, and Close Button */}
      <header className="flex items-center justify-between w-full max-w-5xl mx-auto z-10">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-white/50 uppercase font-mono block">
            {story.missionTitle}
          </span>
          <h1 className="text-sm sm:text-base font-normal tracking-wide text-white/90 m-0">
            {story.machineName}
          </h1>
        </div>

        {/* Status Indicator & Close */}
        <div className="flex items-center gap-3">
          {/* Voice Studio Narration Status Pill */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase border transition-all"
            style={{
              background: audioState === 'playing' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)',
              borderColor: audioState === 'playing' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              color: audioState === 'playing' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.45)',
            }}
          >
            {audioState === 'playing' && (
              <span className="flex items-center gap-0.5 text-white/80">
                <span className="w-1 h-2.5 bg-white/80 rounded-full animate-pulse" />
                <span className="w-1 h-3.5 bg-white rounded-full animate-pulse delay-75" />
                <span className="w-1 h-2 bg-white/80 rounded-full animate-pulse delay-150" />
              </span>
            )}
            <span>
              {audioState === 'playing'
                ? isMuted ? 'VOICE MUTED' : 'VOICE NARRATION'
                : audioState === 'loading'
                ? 'SYNTHESIZING...'
                : 'VISUAL CAPTIONS'}
            </span>
          </div>

          {/* Exit Button */}
          <button
            type="button"
            onClick={handleExit}
            data-cursor="focus"
            aria-label="Exit Story (Esc)"
            className="flex items-center gap-2 py-1.5 px-3.5 rounded-full text-xs uppercase tracking-[0.16em] text-white/70 hover:text-white bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 transition-all duration-200 cursor-pointer"
          >
            <span>✕</span>
            <span className="hidden sm:inline">EXIT STORY</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto my-3 sm:my-5 z-10">
        {!isFinished && currentSlide ? (
          <div className="w-full flex flex-col items-center">
            {/* Chapter Title */}
            <div className="mb-2.5 sm:mb-3.5 text-center">
              <h2 className="text-xs sm:text-sm md:text-[15px] font-medium tracking-[0.18em] uppercase text-white/85 m-0">
                {currentSlide.title}
              </h2>
            </div>

            {/* 16:9 Cinematic Media Frame */}
            <div className="relative w-full aspect-video max-h-[52vh] sm:max-h-[56vh] rounded-2xl overflow-hidden border border-white/[0.12] bg-black/60 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
              {/* Ken Burns subtle zoom image */}
              <img
                key={currentSlide.id}
                src={currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-cover animate-ken-burns transition-opacity duration-500"
                style={{
                  animation: `kenBurns ${activeDuration + 400}ms ease-out forwards`,
                }}
              />

              {/* Subtle cinematic vignette overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 85%, rgba(0,0,0,0.8) 100%)',
                }}
              />
            </div>

            {/* Word-by-Word Progressive Captions */}
            {/* Fixed height ensures complete layout stability with no height jumping */}
            <div className="w-full max-w-3xl mt-4 sm:mt-6 min-h-[68px] sm:min-h-[82px] flex items-center justify-center text-center px-4">
              <p
                className="text-sm sm:text-base md:text-[17px] font-normal leading-relaxed text-white/90 m-0"
                aria-live="polite"
              >
                {words.map((word, i) => {
                  const isRevealed = i <= revealedWordCount;
                  return (
                    <span
                      key={`${currentSlide.id}-w-${i}`}
                      className={`inline-block transition-opacity duration-200 ${
                        isRevealed
                          ? 'opacity-100 text-white'
                          : 'opacity-0 text-transparent select-none'
                      }`}
                      style={{ marginRight: '0.28em' }}
                    >
                      {word}
                    </span>
                  );
                })}
              </p>
            </div>
          </div>
        ) : (
          /* Final Screen: Outro & Tribute */
          <div className="w-full max-w-xl text-center py-8 px-6 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md animate-fade-in">
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
        )}
      </main>

      {/* Bottom Playback Controls & Progress Bar */}
      <footer className="w-full max-w-5xl mx-auto z-10 flex flex-col gap-3">
        {/* Segmented Progress Bar */}
        <div className="w-full flex items-center gap-1.5">
          {story.slides.map((s, idx) => {
            const isPast = idx < slideIndex;
            const isCurrent = idx === slideIndex && !isFinished;
            const fillWidth = isPast
              ? '100%'
              : isCurrent
              ? `${Math.round(currentSlideProgress * 100)}%`
              : '0%';

            return (
              <div
                key={s.id}
                onClick={() => goToSlide(idx)}
                data-cursor="focus"
                role="button"
                tabIndex={0}
                aria-label={`Jump to slide ${idx + 1}: ${s.title}`}
                className="flex-1 h-1 rounded-full bg-white/15 overflow-hidden cursor-pointer transition-all hover:h-1.5"
              >
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{ width: fillWidth }}
                />
              </div>
            );
          })}
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between text-xs text-white/60 pt-1">
          {/* Counter (e.g. 05 / 13) */}
          <div className="font-mono text-[11px] tracking-widest text-white/75">
            {String(Math.min(slideIndex + 1, totalSlides)).padStart(2, '0')} /{' '}
            {String(totalSlides).padStart(2, '0')}
          </div>

          {/* Interactive Playback Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Previous */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={slideIndex === 0}
              data-cursor="focus"
              aria-label="Previous Slide (Left Arrow)"
              className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <polygon points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Play/Pause */}
            <button
              type="button"
              onClick={() => {
                if (isFinished) {
                  handleRestart();
                } else {
                  setIsPlaying((prev) => !prev);
                }
              }}
              data-cursor="focus"
              aria-label={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              className="p-2.5 rounded-full text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
            >
              {isPlaying && !isFinished ? (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              ) : (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <polygon points="7 5 19 12 7 19" />
                </svg>
              )}
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={handleNext}
              data-cursor="focus"
              aria-label="Next Slide (Right Arrow)"
              className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <polygon points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Replay Scene */}
            <button
              type="button"
              onClick={handleReplayCurrent}
              data-cursor="focus"
              aria-label="Replay Scene (R)"
              title="Replay Current Scene (R)"
              className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
              </svg>
            </button>

            {/* Mute/Unmute */}
            <button
              type="button"
              onClick={handleToggleMute}
              data-cursor="focus"
              aria-label={isMuted ? 'Unmute Audio (M)' : 'Mute Audio (M)'}
              title={isMuted ? 'Unmute Audio (M)' : 'Mute Audio (M)'}
              className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              {isMuted ? (
                /* Muted Icon */
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                /* Unmuted Volume Icon */
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>
          </div>

          {/* Keyboard Hint */}
          <div className="hidden md:flex items-center gap-3 text-[10px] text-white/40 uppercase tracking-widest font-mono">
            <span>[SPACE] {isPlaying ? 'Pause' : 'Play'}</span>
            <span>[M] Mute</span>
            <span>[R] Replay</span>
            <span>[←/→] Navigate</span>
            <span>[ESC] Exit</span>
          </div>
        </div>
      </footer>

      {/* Global Inline Ken Burns Keyframes */}
      <style jsx global>{`
        @keyframes kenBurns {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.055);
          }
        }
      `}</style>
    </div>
  );
}
