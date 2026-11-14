"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleProceed = useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);
    setTimeout(() => {
      router.push("/experience");
    }, 600);
  }, [isNavigating, router]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleProceed}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleProceed();
        }
      }}
      aria-label="Enter Abandoned but not Forgotten"
      className={`relative flex min-h-screen w-full flex-col items-center justify-between px-6 py-12 sm:py-16 select-none cursor-pointer outline-none transition-opacity duration-700 ease-out ${
        isNavigating ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Spacer to achieve balanced vertical centering */}
      <div className="h-6 sm:h-12" aria-hidden="true" />

      {/* Hero Title & Tagline */}
      <main className="flex flex-col items-center text-center max-w-4xl px-4 animate-fade-in">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white/95 leading-tight sm:leading-tight md:leading-tight drop-shadow-[0_4px_32px_rgba(0,0,0,0.85)]">
          Abandoned
          <span className="block mt-2 sm:mt-3 font-light text-white/90">
            but not Forgotten
          </span>
        </h1>

        <p className="mt-8 sm:mt-10 text-sm sm:text-base md:text-lg text-white/70 font-light tracking-[0.06em] max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)]">
          &ldquo;Humanity may leave its machines behind, but it should never leave their stories forgotten.&rdquo;
        </p>
      </main>

      {/* Understated Interactive Prompt */}
      <footer className="flex flex-col items-center pb-4 sm:pb-8">
        <span className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-white/40 font-light animate-pulse-subtle">
          Click anywhere to continue
        </span>
      </footer>
    </div>
  );
}
