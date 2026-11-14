'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cursorStore, CursorType } from '@/lib/cursor-store';

export default function CustomCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [isDown, setIsDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  const isVisibleRef = useRef(false);
  const cursorTypeRef = useRef<CursorType>('default');

  useEffect(() => {
    // Check if device supports fine precision pointer (mouse/trackpad, not touch)
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsFinePointer(mediaQuery.matches);

    const onMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };
    mediaQuery.addEventListener('change', onMediaChange);

    const updateCursorType = (type: CursorType) => {
      if (cursorTypeRef.current !== type) {
        cursorTypeRef.current = type;
        setCursorType(type);
      }
    };

    // Subscribe to global cursor store (for 3D scene & components)
    const unsubscribe = cursorStore.subscribe((type) => {
      updateCursorType(type);
    });

    const updatePosition = (clientX: number, clientY: number) => {
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }
    };

    const showCursor = () => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const hideCursor = () => {
      if (isVisibleRef.current) {
        isVisibleRef.current = false;
        setIsVisible(false);
      }
      setIsDown(false);
    };

    // Track mouse position directly via DOM to avoid React re-renders on move
    const onPointerMove = (e: PointerEvent) => {
      updatePosition(e.clientX, e.clientY);
      showCursor();

      // DOM element hover detection (for standard links & buttons)
      const target = e.target as HTMLElement | null;
      if (target) {
        if (target.closest('[data-cursor="focus"]')) {
          updateCursorType('focus');
        } else if (
          target.closest('button, a, [data-cursor="button"], [role="button"], input, select, textarea')
        ) {
          if (cursorStore.get() !== 'focus' && cursorStore.get() !== 'grabbing') {
            updateCursorType('button');
          }
        } else {
          // If not hovering an interactive DOM element and 3D store is default
          if (cursorStore.get() === 'default') {
            updateCursorType('default');
          }
        }
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      updatePosition(e.clientX, e.clientY);
      setIsDown(true);
    };

    const onPointerUp = () => {
      setIsDown(false);
    };

    const onPointerEnter = (e: PointerEvent) => {
      updatePosition(e.clientX, e.clientY);
      showCursor();
    };

    const onPointerLeave = () => {
      hideCursor();
    };

    const onMouseOut = (e: MouseEvent) => {
      // If leaving the window entirely (no related target)
      if (!e.relatedTarget && !(e as unknown as { toElement?: Element }).toElement) {
        hideCursor();
      }
    };

    const onWindowBlur = () => {
      hideCursor();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        hideCursor();
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    document.documentElement.addEventListener('pointerenter', onPointerEnter);
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('mouseout', onMouseOut);
    window.addEventListener('blur', onWindowBlur);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      mediaQuery.removeEventListener('change', onMediaChange);
      unsubscribe();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.documentElement.removeEventListener('pointerenter', onPointerEnter);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('blur', onWindowBlur);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  // Do not render on touch-only or coarse pointer devices
  if (!isFinePointer) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`fixed top-0 left-0 z-[9999] pointer-events-none select-none transition-opacity duration-150 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ willChange: 'transform' }}
    >
      {/* 1. Hollow Navigation Pointer (Default & Button Hover) */}
      <div
        className={`absolute top-0 left-0 transition-all duration-200 ease-out origin-top-left ${
          cursorType === 'focus' ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100'
        } ${cursorType === 'button' ? 'scale-115' : 'scale-100'} ${
          cursorType === 'grabbing' ? 'scale-90 -rotate-12' : ''
        } ${isDown ? 'scale-90' : ''}`}
        style={{ transformOrigin: '3px 3px' }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
        >
          {/* Thin, hollow arrow with softly rounded corners and joins */}
          <path
            d="M3 3L8.5 18.5L11.5 11.5L18.5 8.5L3 3Z"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* 2. Rounded Focus Reticle (Interactive 3D Objects & Machine Labels) */}
      <div
        className={`absolute top-0 left-0 transition-all duration-200 ease-out ${
          cursorType === 'focus' ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'
        } ${isDown ? 'scale-85' : ''}`}
        style={{
          transform: 'translate(-14px, -14px)',
          transformOrigin: '14px 14px',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]"
        >
          {/* Top-Left Corner Bracket */}
          <path
            d="M7 11V9a2 2 0 0 1 2-2h2"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Top-Right Corner Bracket */}
          <path
            d="M17 7h2a2 2 0 0 1 2 2v2"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bottom-Right Corner Bracket */}
          <path
            d="M21 17v2a2 2 0 0 1-2 2h-2"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bottom-Left Corner Bracket */}
          <path
            d="M11 21H9a2 2 0 0 1-2-2v-2"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Central Targeting Dot */}
          <circle cx="14" cy="14" r="1.3" fill="#FFFFFF" />
        </svg>
      </div>
    </div>
  );
}
