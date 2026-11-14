# 09 — Implementation Status and Limitations

This document provides a comprehensive implementation audit of **The Museum of Forgotten Machines**, classifying every feature, asset, and capability into strict status categories.

---

## 1. Feature Implementation Audit

### Status Categories
- **Complete:** Fully implemented, verified against the codebase, functional in production build.
- **Partially Implemented:** Functional in core aspects, but missing secondary enhancements or polish.
- **Not Implemented:** Planned or conceptual features not present in the current codebase.
- **Needs Verification:** Present in code but subject to runtime hardware or platform variability.

| Feature / Subsystem | Status | Current Codebase Implementation |
| :--- | :--- | :--- |
| **Landing Page** | Complete | Rendered in `app/page.tsx` with fade-in animations, tagline, and smooth navigation. |
| **Persistent Space Background** | Complete | Global Next.js `Image` in `app/layout.tsx` with vignette overlays. |
| **3D Canvas Hydration Guard** | Complete | Client mounting handled via `ExperienceRoot.tsx` to prevent Next.js 16 SSR errors. |
| **Solar System Simulation** | Complete | Central Sun + 6 major planets (Venus, Earth, Mars, Saturn, Uranus, Neptune) in `SolarSystem.tsx`. |
| **Planetary Orbit Lines** | Complete | Geometry ring circles in `PlanetOrbit.tsx`. |
| **Dynamic Planet Tracking** | Complete | Camera smoothly follows moving planets in real time via `CameraController`. |
| **Astronomical Telemetry Panel** | Complete | Verified metrics and summaries displayed in `PlanetInfoPanel.tsx`. |
| **Moon Exploration Museum** | Complete | Dedicated view in `Moon.tsx` with NASA 2K albedo sphere and auto-rotation. |
| **Lunar Machine Markers & Lines**| Complete | Straight, non-intersecting `Line2` laser lines and surface markers in `DynamicCallouts.tsx`. |
| **Lunar Historical Dossier** | Complete | Slide-out glassmorphic panel in `InfoPanel.tsx` with verified Apollo & Surveyor records. |
| **Mars Exploration Museum** | Complete | Dedicated view in `Mars.tsx` with NASA Viking/MOLA surface texture. |
| **Martian Machine Markers & Lines**| Complete | Straight `Line2` lines and amber reticles in `MarsCallouts.tsx`. |
| **Martian Historical Dossier** | Complete | Slide-out glassmorphic panel in `MarsInfoPanel.tsx` with 9 verified NASA missions. |
| **Planetary Gateways** | Complete | 3D HTML badges in orbit and dedicated buttons in info panels for Moon & Mars. |
| **Cross-Museum Switching** | Complete | Direct switching between Moon, Mars, and Solar System without full reloads. |
| **Mercury & Jupiter Models** | Not Implemented | Excluded because no 3D FBX models or textures exist in `3dmodels/`. |
| **3D Rover / Lander Models on Spheres** | Intentionally Removed | 3D equipment models removed to maintain clean planetary silhouettes with straight HUD lines. |
| **Audio / Atmospheric Soundscape**| Not Implemented | No ambient audio files or Web Audio API components exist in the project. |
| **Search / Mission Filter** | Not Implemented | No text search or mission date timeline filtering exists in the HUD. |
| **Mobile Touch Rotation** | Complete | Supported natively via Three.js `OrbitControls`. |

---

## 2. Missing Assets & Incomplete Data

1. **Mercury & Jupiter 3D Models:**  
   *Confirmed.* The asset directory contains folders for `sun`, `venus`, `earth`, `mars`, `saturn`, `uranus`, and `neptune`. `mercury` and `jupiter` folders are absent.
2. **CAD Models for Mars Landers:**  
   *Confirmed.* The `3dmodels/mars/` directory contains only the reference document `Landed NASA hardware on Mars.html`. No `.glb`, `.fbx`, or `.obj` models exist for Martian rovers. Per project requirements, no fake models were created; coordinates are indicated via surface markers and HUD lines.
3. **GrabCAD ALSEP Model Integration:**  
   *Confirmed.* The grabcad HTML reference for the Apollo Lunar Surface Experiments Package (ALSEP) is present in `3dmodels/moon/`, but no CAD geometry file was included in the source repository.

---

## 3. Confirmed Technical Limitations

### 1. High-Resolution Texture Memory Overhead
- **Observation:** `3dmodels/earth/textures/1_earth_8k.jpg` and `3dmodels/venus/textures/8k_venus_surface.jpg` are 8K (8192×4096) textures totaling over 12 MB on disk and uncompressing to significant VRAM allocations in WebGL.
- **Impact:** Older mobile devices or systems with integrated graphics and limited shared VRAM may experience slight stutter or longer initial texture decoding during first load.

### 2. Line Width Constraints on WebGL 1.0 Fallbacks
- **Observation:** Three.js standard `THREE.Line` ignores linewidth on most desktop GPU drivers (hardcoded to 1px).
- **Resolution in Code:** The application resolved this by using `Line2` from `three-stdlib`, which computes screen-space triangle strips to ensure uniform thickness across all platforms.

---

## 4. Potential Edge Cases & Suspected Issues

### 1. Label Density on Polar Projections
- **Observation:** On Mars, missions such as *Phoenix Lander* (`68.22° N`) and *Viking 2* (`47.64° N`) are clustered in northern latitudes.
- **Behavior:** The collision relaxation algorithm in `MarsCallouts.tsx` enforces `MIN_LABEL_SPACING = 0.44`. While labels push apart vertically, extreme zoom angles near the north pole may cause callout lines to cross if rotated at sharp angles.

### 2. Local Port 3000 Collision on Windows
- **Observation:** If `next dev` is killed abnormally in Windows PowerShell, Node.js can occasionally hold the socket handle, leading to `EADDRINUSE`.
- **Mitigation:** Use `npx next dev -p 3001` or run `Get-Process node | Stop-Process -Force`.

---

## 5. Audit Summary
The current codebase is robust, fully typed, compiles with 0 errors on strict TypeScript and Webpack builds, and achieves the primary goal of providing an interactive 3D digital museum for lunar and Martian exploration.

---

*Related Documentation:*
- [01 — Project Overview](file:///docs/01-project-overview.md)
- [04 — Features and User Experience](file:///docs/04-features-and-user-experience.md)
- [08 — Setup and Installation](file:///docs/08-setup-and-installation.md)
- [10 — Future Development](file:///docs/10-future-development.md)
