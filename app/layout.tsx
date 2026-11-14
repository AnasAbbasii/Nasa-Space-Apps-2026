import type { Metadata } from "next";
import Image from "next/image";
import spaceBackground from "@/components/spacebackground.jpg";
import CustomCursor from "@/components/cursor/CustomCursor";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abandoned but not Forgotten",
  description:
    "Humanity may leave its machines behind, but it should never leave their stories forgotten.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-white/20 selection:text-white overflow-x-hidden font-sans">
        {/* Persistent Full-Screen Space Background across all pages */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
          <Image
            src={spaceBackground}
            alt="Space Background"
            fill
            priority
            quality={90}
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Cinematic atmospheric depth overlays */}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.8)_100%)]" />
        </div>
        {/* Custom Space Navigation & Targeting Reticle Cursor */}
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
