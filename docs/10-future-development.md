# 10 — Future Development

Based on the technical audit of **The Museum of Forgotten Machines**, this document outlines recommendations for future development phases. Recommendations are prioritized by impact on user immersion, educational utility, and technical robustness.

---

## 1. High Priority (Phase 2 — Immersion & Completeness)

### 1. Ambient Deep-Space Audio & Telemetry Soundscapes
- **Goal:** Introduce an atmospheric, low-frequency cosmic drone and subtle telemetry audio feedback.
- **Proposed Implementation:** 
  - Integrate a lightweight Web Audio API synthesis engine or ambient looping audio track with user volume controls.
  - Add delicate acoustic feedback when hovering markers, opening dossiers, or engaging camera transitions.

### 2. Sourcing 3D Models for Mercury & Jupiter
- **Goal:** Complete the full representation of the classic eight planets in the Solar System view.
- **Proposed Implementation:**
  - Source authentic NASA 3D models and surface textures for Mercury and Jupiter (and optionally a miniature representation of Pluto).
  - Add corresponding telemetry entries to `lib/solar-system.ts`.

### 3. Dedicated 3D Model Modal Inspector for Historic Hardware
- **Goal:** Allow users to view individual 3D models of spacecraft (like the Apollo Lunar Module or Surveyor) in an isolated inspection modal without cluttering the clean planetary globes.
- **Proposed Implementation:**
  - Leverage existing models in `3dmodels/moon/` (`Apollo Lunar Module.glb`, `Surveyor/model.dae`).
  - Add an `"Inspect 3D Model"` button inside `InfoPanel.tsx` that opens a standalone orbital viewer showcasing the vehicle's engineering details.

---

## 2. Medium Priority (Phase 3 — Exploration Tools & Chronology)

### 1. Mission Timeline & Era Filter
- **Goal:** Enable users to filter machines by decade or mission era (e.g., *1960s Space Race*, *1970s Viking Era*, *2000s Rover Renaissance*, *2020s Contemporary Mars*).
- **Proposed Implementation:**
  - Add a minimalist timeline slider along the bottom of the Moon and Mars archives.
  - Dynamically toggle visibility of surface markers and connection lines as the user scrubs through time.

### 2. Search & Quick Jump Index
- **Goal:** Provide rapid access to specific spacecraft or landing sites.
- **Proposed Implementation:**
  - Add a search input in the top header (`⌘K` or search icon).
  - Selecting a search result directly focuses the camera on the target coordinates and opens its dossier.

### 3. Progressive Texture Streaming & LOD (Level of Detail)
- **Goal:** Optimize load times on constrained mobile connections.
- **Proposed Implementation:**
  - Implement 2-stage texture loading: stream 2K base textures initially, then lazily upgrade to 8K textures for Earth and Venus once in viewport focus.

---

## 3. Low Priority (Phase 4 — Advanced Features & Platforms)

### 1. WebXR / Virtual Reality (VR) Support
- **Goal:** Allow headset users (Meta Quest, Apple Vision Pro) to experience the planetary archives in true stereoscopic 3D scale.
- **Proposed Implementation:**
  - Integrate `@react-three/xr` to provide an `"Enter VR"` mode where users stand before life-sized planetary spheres.

### 2. Additional Extraterrestrial Exploration Archives
- **Goal:** Expand archives beyond the Moon and Mars.
- **Proposed Candidates:**
  - **Venus Surface Archives:** Soviet Venera 7, 8, 9, 10, 13, 14 landers and Vega probes (the only human machines ever to photograph the surface of Venus).
  - **Titan (Saturnian Moon):** ESA's Huygens probe resting at Adiri.
  - **Asteroid & Comet Landers:** NEAR Shoemaker (Eros), Hayabusa 1 & 2 (Itokawa & Ryugu), Philae (Comet 67P).

### 3. Internationalization (i18n)
- **Goal:** Broaden global accessibility for international students and NASA Space Apps participants.
- **Proposed Implementation:**
  - Localize machine dossiers and astronomical metrics into Spanish, French, Japanese, German, and Arabic.

---

*Related Documentation:*
- [01 — Project Overview](file:///docs/01-project-overview.md)
- [04 — Features and User Experience](file:///docs/04-features-and-user-experience.md)
- [09 — Implementation Status and Limitations](file:///docs/09-implementation-status.md)
