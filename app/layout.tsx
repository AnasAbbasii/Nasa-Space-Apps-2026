import type { Metadata, Viewport } from "next";
import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import spaceBackground from "@/components/spacebackground.jpg";
import CustomCursor from "@/components/cursor/CustomCursor";
import NasaAttribution from "@/components/NasaAttribution";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Beyond the Mission",
  description:
    "Explore the stories of humanity's abandoned space exploration equipment on the Moon and Mars.",
  applicationName: "Beyond the Mission",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Beyond the Mission",
    description:
      "Explore the stories of humanity's abandoned space exploration equipment on the Moon and Mars.",
    siteName: "Beyond the Mission",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Beyond the Mission",
    description:
      "Explore the stories of humanity's abandoned space exploration equipment on the Moon and Mars.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full antialiased dark ${spaceGrotesk.variable}`}>
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-white/20 selection:text-white overflow-x-hidden font-sans">
        {/* Persistent Full-Screen Space Background across all pages */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
          <Image
            src={spaceBackground}
            alt="Space Background"
            fill
            priority
            quality={85}
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
        {/* Minimal NASA Space Apps Challenge 2026 Attribution */}
        <NasaAttribution />
      </body>
    </html>
  );
}
