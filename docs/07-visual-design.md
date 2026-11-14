# 07 — Visual Design and Interface

This document describes the visual design system, interface philosophy, styling implementation, and responsive behaviors of **The Museum of Forgotten Machines**.

---

## 1. Design Philosophy

The project adheres to an **ultra-minimalist, cinematic digital museum aesthetic**. Key design tenets include:
- **Atmospheric Immersion:** Interface elements are subdued to let planetary geometry and deep space remain the primary visual focus.
- **Museum-Grade Authenticity:** Avoiding playful or game-like UI elements in favor of refined, scientific typography and clean lines inspired by aerospace telemetry and observatory instruments.
- **Zero Visual Clutter:** Machine name labels feature 100% transparent backgrounds—no decorative bounding boxes, container cards, or drop-shadow badges clutter the celestial space surrounding the planets.
- **Content Hierarchy:** High-contrast pure white typography for primary names, muted opacities (`text-white/40` to `text-white/70`) for secondary metadata, and distinct thematic accent colors for celestial gateways.

---

## 2. Color Palette & Theming

```
Deep Space Black:         #000000
Atmospheric Glass Tint:   rgba(6, 11, 22, 0.88)
Martian Glass Tint:       rgba(16, 9, 8, 0.90)
Primary Typographic White:#FFFFFF (100% white)
Secondary White:          rgba(255, 255, 255, 0.70)
Muted Metadata White:     rgba(255, 255, 255, 0.40)
Lunar / Earth Cyan:       #7dd3fc / #38bdf8
Martian Rust Amber:       #ff8a57 / #c1440e
Solar Warm Gold:          #ffaa33
```

### Thematic Color Accents
- **Universal Elements:** Clean white (`#ffffff`) for machine labels, connection lines, and landing coordinates.
- **Lunar Museum Context:** Subdued cyan accents (`#7dd3fc`, `text-sky-400`) representing lunar quietude and Earth-Moon orbital connections.
- **Martian Museum Context:** Warm rust-amber accents (`#ff8a57`, `text-orange-400`) reflecting the iron-oxide composition of Mars.
- **Solar Context:** Subtle cyan-highlighted orbit rings (`0x7dd3fc`) for the active planet against faint white (`0xffffff` at 12% opacity) for general planetary paths.

---

## 3. Persistent Space Background

Implemented in [`app/layout.tsx`](file:///app/layout.tsx):
- Renders `components/spacebackground.jpg` using Next.js `Image` with `fill`, `priority`, and `quality={90}`.
- Layered beneath all routes (`-z-10 fixed inset-0 pointer-events-none`).
- Enhanced with two CSS overlay layers:
  1. A linear dark tint: `bg-black/45` ensuring text contrast.
  2. A radial gradient vignette: `bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.8)_100%)]` focusing viewer attention on the center of the viewport.

---

## 4. Typography

### Primary Typeface: Space Grotesk
- Loaded directly from Google Fonts via preconnected links in `app/layout.tsx` (weights 400, 500, 600, 700).
- Used for all hero titles, machine name labels, section headers, and interactive buttons.
- Characterized by wide proportions, geometric terminals, and space-age letterforms.

### Secondary Typeface: Monospace (`font-mono`)
- System monospace stack (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas`).
- Applied to coordinates (`22.2700° N, 47.9500° W`), mission dates, and technical metadata.

### Hero & Title Treatments
- **Hero Title:** `text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-[0.25em] uppercase text-white/95`.
- **Museum Brand Tag:** `text-xs uppercase tracking-[0.25em] text-white/95 font-medium`.

---

## 5. Planetary Rendering & Material Quality

The 3D canvas uses physically based rendering settings in [`components/experience/Experience.tsx`](file:///components/experience/Experience.tsx):
- **Tone Mapping:** `THREE.ACESFilmicToneMapping` with `toneMappingExposure = 1.15` for cinematic dynamic range.
- **Antialiasing:** Hardware antialiasing enabled (`antialias: true`).
- **Moon Sphere:** UV sphere with 128 segments mapped with the NASA 2K albedo texture; `roughness: 0.92`, `metalness: 0.02`.
- **Mars Sphere:** UV sphere with 128 segments mapped with the NASA Viking/MOLA surface texture; `roughness: 0.92`, `metalness: 0.05`.
- **Lighting Rig:**
  - Directional sunlight: `position: [7, 3, 5]`, `intensity: 2.4`, warm white (`#fff8f0`).
  - Subtle space backfill: `position: [-6, -2, -4]`, `intensity: 0.16` (cool blue `#8ab8e6` for Moon, warm rust `#e07a5f` for Mars).
  - Ambient base light: `intensity: 0.06` to preserve dark shadows on the night-side.

---

## 6. HUD Annotations & Connection Lines

### Straight Connection Lines
- Implemented with `three-stdlib`'s `Line2` and `LineMaterial`.
- **Color:** Pure white (`0xffffff`).
- **Linewidth:** Exactly `1.0` screen-space pixel.
- **Geometry:** Two vertices forming a straight chord from the surface point ($P_0$) to the screen-space label anchor ($P_{\text{end}}$).
- **Surface Elevation:** The origin vertex is slightly lifted into foreground space ($Z_0 + 0.15$) to ensure the line path stays strictly outside the sphere geometry.

### Machine Name Labels
- Rendered via `@react-three/drei`'s `<Html>` projection.
- Floating Space Grotesk text in `#ffffff`.
- **Zero Background:** No cards, borders, pills, or container boxes.
- Dynamic alignment: Points to the left of the meridian anchor at the line's right edge; points to the right anchor at the line's left edge.

---

## 7. Glassmorphic Information Dossiers

The detail panels (`InfoPanel.tsx` and `MarsInfoPanel.tsx`) use modern glassmorphism:
```css
background: rgba(6, 11, 22, 0.88); /* or rgba(16, 9, 8, 0.90) for Mars */
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(125, 211, 252, 0.18); /* or rgba(255, 138, 87, 0.25) for Mars */
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.75);
```
- **Sticky Header:** Retains mission name and close button while scrolling through extensive historical narratives.
- **Scrollable Body:** Clean vertical hierarchy: Metadata Grid $\rightarrow$ Original Purpose $\rightarrow$ Why Left Behind $\rightarrow$ Historical Significance $\rightarrow$ Current Status.

---

## 8. Responsive Design & Viewport Adaptation

| Device / Viewport | Layout Adaptations |
| :--- | :--- |
| **Mobile (`< 640px`)** | Landing page title scales from `7xl` down to `3xl`. Info panels adapt to `w-84 max-w-[calc(100vw-2rem)]`, occupying the right edge without covering the entire screen. Touch pinch-to-zoom and one-finger drag enabled via `OrbitControls`. |
| **Tablet (`640px - 1024px`)** | Quick planet pills wrap cleanly in the top-right header (`max-w-sm`). Bottom interaction hint stays centered with reduced font size (`text-[10px]`). |
| **Desktop (`> 1024px`)** | Full widescreen panoramic presentation with high-DPI canvas rendering. Ample clearance between planetary spheres and floating annotation labels. |

---

*Related Documentation:*
- [03 — Project Architecture](file:///docs/03-project-architecture.md)
- [04 — Features and User Experience](file:///docs/04-features-and-user-experience.md)
- [06 — Application Workflows](file:///docs/06-application-workflows.md)
