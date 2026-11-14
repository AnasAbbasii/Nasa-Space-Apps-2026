import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6 select-none">
      <h1 className="text-7xl sm:text-8xl md:text-9xl font-extralight tracking-[0.2em] text-white leading-none">
        404
      </h1>
      <p className="mt-4 sm:mt-5 text-sm sm:text-base text-white/60 font-light tracking-[0.18em] uppercase">
        Lost in space.
      </p>
      <Link
        href="/"
        className="mt-8 sm:mt-10 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/[0.18] text-white text-xs sm:text-sm font-light tracking-[0.2em] uppercase transition-all duration-200 ease-out hover:scale-[1.03] active:scale-[0.97] will-change-transform border-0 outline-none shadow-none"
      >
        GO HOME &rarr;
      </Link>
    </main>
  );
}
