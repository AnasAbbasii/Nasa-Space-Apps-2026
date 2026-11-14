export default function ExperiencePage() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 text-center select-none">
      {/* 3D Canvas / Experience root container */}
      <div className="flex flex-col items-center gap-3 animate-fade-in text-white/60">
        <div className="h-1.5 w-1.5 rounded-full bg-white/50 animate-ping" />
        <p className="text-xs uppercase tracking-[0.3em] font-light text-white/50">
          Diving deep into space...
        </p>
      </div>
    </main>
  );
}
