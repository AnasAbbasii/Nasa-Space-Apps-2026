# 04 — Features and User Experience

This document details every feature implemented within **The Museum of Forgotten Machines**, describing its technical implementation, user interaction mechanics, and implementation status.

---

## 1. Landing Page

### Description
The landing page serves as the entry portal to the digital museum. It provides a quiet, cinematic introduction centered around the project's identity and core mission statement.

### User Interaction
- Visitors view the central title **"Abandoned but not Forgotten"** and the accompanying tagline.
- A subtle pulsing indicator at the bottom reads **"CLICK ANYWHERE TO CONTINUE"**.
- Clicking anywhere on the screen or pressing the `Enter` or `Space` key triggers a smooth opacity fade-out (`duration-700`) and transitions the user to the 3D `/experience` route.

### Implementing Files
- [`app/page.tsx`](file:///app/page.tsx)
- [`app/layout.tsx`](file:///app/layout.tsx)
- [`app/globals.css`](file:///app/globals.css)

### Implementation Status
**Fully Implemented.** Responsive across viewports, keyboard-accessible, and integrated with the persistent space background.

---

## 2. Interactive 3D Solar System Experience

### Description
A dynamic 3D simulation of our Solar System featuring the central Sun and orbiting planetary bodies (Venus, Earth, Mars, Saturn, Uranus, Neptune). Each body features proportional orbital distances (scaled for screen visualization), realistic axial tilts, axial spin, and circular orbital path rings.

### User Interaction
- **Free Camera Orbit:** Users drag with the mouse or touch-swipe to rotate around the Sun.
- **Scroll Zoom:** Users scroll or pinch to zoom into the inner planets or pull back to observe outer ice giants.
- **Pause / Orbit Toggle:** A top-right button toggles planetary revolution on or off (`isPlaying: boolean`).
- **Reset View:** Returns camera to the standard angled solar overview (`[0, 22, 36]`).

### Implementing Files
- [`components/experience/solar/SolarSystem.tsx`](file:///components/experience/solar/SolarSystem.tsx)
- [`components/experience/solar/PlanetOrbit.tsx`](file:///components/experience/solar/PlanetOrbit.tsx)
- [`lib/solar-system.ts`](file:///lib/solar-system.ts)
- [`components/experience/Experience.tsx`](file:///components/experience/Experience.tsx)

### Implementation Status
**Fully Implemented.** Includes 6 planets and the central Sun. (Note: Mercury and Jupiter are not rendered as their 3D models were not present in the provided asset repository).

---

## 3. Planet Selection & Celestial Telemetry

### Description
Clicking any planet in the Solar System locks the camera into orbit tracking, smoothly interpolating to follow the planet's real-time orbital movement. A glassmorphic telemetry dossier (`PlanetInfoPanel`) slides into view on the right.

### User Interaction
- Clicking directly on a planet's 3D mesh or clicking any planet pill button in the top-right header selects the body.
- The camera follows the planet dynamically in real time.
- The info panel displays verified astronomical metrics: Distance from Sun, Diameter, Orbital Period, Rotation Period, and a scientific overview.
- Clicking the close button (`✕`) or clicking the background canvas deselects the planet and returns the camera to the solar overview.

### Implementing Files
- [`components/experience/solar/PlanetInfoPanel.tsx`](file:///components/experience/solar/PlanetInfoPanel.tsx)
- [`components/experience/Experience.tsx`](file:///components/experience/Experience.tsx) (inside `CameraController` and `useFrame`)

### Implementation Status
**Fully Implemented.** Real-time tracking and telemetry cards are operational for all rendered celestial bodies.

---

## 4. Planetary Exploration Gateways (Earth & Mars)

### Description
Direct gateways to specialized planetary museums:
1. **The Moon Gateway:** Embedded within Earth's orbital view and telemetry panel. A glowing 3D HTML pill badge (`✦ The Moon Archive`) hovers alongside Earth.
2. **The Mars Gateway:** Embedded within Mars's orbital view and telemetry panel. A glowing amber 3D HTML pill badge (`✦ Martian Archive`) hovers above Mars.
3. **Direct Header Buttons:** Always visible in the top header when in Solar System mode (`✦ Moon Museum` and `✦ Mars Museum`).

### User Interaction
- Clicking the 3D gateway badge or the panel button initiates an immediate transition into the corresponding dedicated planetary archive.
- The Solar System is unmounted from the canvas and the dedicated planetary sphere is loaded with its verified landing sites.

### Implementing Files
- [`components/experience/solar/SolarSystem.tsx`](file:///components/experience/solar/SolarSystem.tsx) (HTML 3D gateway pills)
- [`components/experience/solar/PlanetInfoPanel.tsx`](file:///components/experience/solar/PlanetInfoPanel.tsx) (Gateway callout cards)
- [`components/experience/Experience.tsx`](file:///components/experience/Experience.tsx) (`handleEnterMoonMuseum`, `handleEnterMarsMuseum`)

### Implementation Status
**Fully Implemented.** Seamless switching between the Solar System and planetary archives without full page reloads.

---

## 5. Dedicated Moon Exploration Museum

### Description
An interactive, high-resolution 3D simulation of Earth's Moon mapped with verified landing locations of humanity's lunar exploration missions (Apollo 11, 12, 14, 15, 16, 17, and Surveyor 3).

### User Interaction
- **Slow Auto-Rotation:** The Moon gently rotates on its polar axis (`rotation.y += delta * 0.04`).
- **Manual Orbiting:** Dragging the Moon rotates it smoothly to explore craters on the far side; auto-rotation pauses immediately upon user interaction.
- **Machine Discovery:** Hovering or clicking any machine's laser callout line or surface marker selects the machine and triggers a camera zoom into the landing coordinates.
- **Cross-Museum Switching:** A top button (`✦ Switch to Mars`) enables direct navigation to the Martian museum.

### Implementing Files
- [`components/experience/Moon.tsx`](file:///components/experience/Moon.tsx)
- [`components/experience/LunarMachineObject.tsx`](file:///components/experience/LunarMachineObject.tsx)
- [`components/experience/DynamicCallouts.tsx`](file:///components/experience/DynamicCallouts.tsx)
- [`components/experience/InfoPanel.tsx`](file:///components/experience/InfoPanel.tsx)
- [`lib/lunar-machines.ts`](file:///lib/lunar-machines.ts)
- [`lib/moon-coords.ts`](file:///lib/moon-coords.ts)

### Implementation Status
**Fully Implemented.** 7 verified lunar landing locations with coordinates and historical dossiers.

---

## 6. Dedicated Mars Exploration Museum

### Description
An interactive 3D simulation of Mars featuring authentic surface coloration and topology based on NASA Viking and orbiter imaging datasets. Catalogs 9 verified NASA robotic landing sites across Martian plains and craters.

### User Interaction
- **Polar Auto-Rotation:** Rotates slowly along its axial orientation.
- **Surface Orbiting & Zoom:** Users rotate and zoom freely around the red planet.
- **Rover & Lander Discovery:** Hovering highlights the landing coordinates with an amber reticle (`#ff8a57`). Clicking focuses the camera directly on the landing site.
- **Cross-Museum Switching:** A top button (`✦ Switch to Moon`) enables direct navigation to the lunar museum.

### Implementing Files
- [`components/experience/mars/Mars.tsx`](file:///components/experience/mars/Mars.tsx)
- [`components/experience/mars/MarsMachineObject.tsx`](file:///components/experience/mars/MarsMachineObject.tsx)
- [`components/experience/mars/MarsCallouts.tsx`](file:///components/experience/mars/MarsCallouts.tsx)
- [`components/experience/mars/MarsInfoPanel.tsx`](file:///components/experience/mars/MarsInfoPanel.tsx)
- [`lib/mars-machines.ts`](file:///lib/mars-machines.ts)
- [`lib/mars-coords.ts`](file:///lib/mars-coords.ts)

### Implementation Status
**Fully Implemented.** 9 historical NASA landing sites (Viking 1 & 2, Pathfinder/Sojourner, Spirit, Opportunity, Phoenix, Curiosity, InSight, Perseverance + Ingenuity).

---

## 7. Machine Location Markers & Surface Reticles

### Description
Subtle, high-precision visual indicators anchored directly to the planetary surface geometry at verified latitude and longitude coordinates.

### User Interaction
- Unfocused state: A delicate white coordinate sphere dot (radius `0.009`) resting directly on the surface.
- Active / Hovered state: The dot brightens to 100% opacity, and an oriented surface targeting ring (radius `0.018` to `0.022`) appears, aligned tangential to the planetary sphere using unit vector quaternions.
- Invisible hit spheres (radius `0.065`) guarantee effortless clicking on small screens.

### Implementing Files
- [`components/experience/LunarMachineObject.tsx`](file:///components/experience/LunarMachineObject.tsx)
- [`components/experience/mars/MarsMachineObject.tsx`](file:///components/experience/mars/MarsMachineObject.tsx)

### Implementation Status
**Fully Implemented.**

---

## 8. Dynamic Straight Connection Lines & Callouts

### Description
Straight, delicate laser connection lines connecting each surface marker to its corresponding machine name label outside the planet's visible silhouette.

### Technical Implementation
- Lines are rendered using `three-stdlib`'s `Line2`, `LineGeometry`, and `LineMaterial`.
- Pure white color (`#ffffff`) with consistent 1.0px thickness.
- **Zero Planet Intersection:** Recalculated dynamically each frame. Elevated slightly in Z foreground space ($Z_0 + 0.15$) to mathematically guarantee the line chord never penetrates or clips through the planetary sphere.
- **Occlusion Culling:** Callouts automatically fade out when their surface marker rotates to the planet's far side.
- **Collision Avoidance:** A vertical relaxation algorithm enforces a minimum separation (`MIN_LABEL_SPACING = 0.44`) between adjacent labels to prevent overlapping text.

### Implementing Files
- [`components/experience/DynamicCallouts.tsx`](file:///components/experience/DynamicCallouts.tsx)
- [`components/experience/mars/MarsCallouts.tsx`](file:///components/experience/mars/MarsCallouts.tsx)

### Implementation Status
**Fully Implemented.**

---

## 9. Machine Name Typography

### Description
Machine names are displayed floating in deep space outside the planet's silhouette.

### Specifications
- Font family: **Space Grotesk** (`font-medium`).
- Color: Pure white (`#ffffff`).
- Background: **100% transparent**. Zero background boxes, cards, or borders.
- Text: Displays **only** the machine display name (e.g., `"Apollo 11 (Eagle)"`, `"Curiosity (MSL)"`).

### Implementing Files
- [`components/experience/DynamicCallouts.tsx`](file:///components/experience/DynamicCallouts.tsx)
- [`components/experience/mars/MarsCallouts.tsx`](file:///components/experience/mars/MarsCallouts.tsx)

### Implementation Status
**Fully Implemented.**

---

## 10. Machine Information Dossiers (`InfoPanel` & `MarsInfoPanel`)

### Description
Slide-out glassmorphic modals that open upon selecting any machine on the Moon or Mars.

### Content Fields
1. **Header:** Mission name, machine designation, and landing site name (e.g., *Chryse Planitia*, *Valinor Hills*).
2. **Metadata Grid:** Space agency, country of origin, landing date, and formatted coordinates (e.g., `22.2700° N, 47.9500° W`).
3. **Original Purpose:** Primary scientific and exploratory goals.
4. **Why Left Behind:** Engineering or mission circumstances leading to permanent resting in situ.
5. **Historical Significance:** Impact on space exploration, planetary science, or humanity.
6. **Current Status:** Verified contemporary condition confirmed by orbital imaging (LRO / MRO HiRISE).

### Implementing Files
- [`components/experience/InfoPanel.tsx`](file:///components/experience/InfoPanel.tsx) (Lunar styling with celestial cyan accents `#7dd3fc`)
- [`components/experience/mars/MarsInfoPanel.tsx`](file:///components/experience/mars/MarsInfoPanel.tsx) (Martian styling with rust amber accents `#ff8a57`)

### Implementation Status
**Fully Implemented.**

---

## 11. Camera Controls, Zoom & Transitions

### Description
Orchestrates smooth camera behavior across all operational modes.

### Behaviors
- **OrbitControls:** Rotation damping (`dampingFactor: 0.08`), rotation speed (`0.5`), and zoom speed (`0.7`).
- **Distance Clamping:** Enforces strict min/max distances to prevent clipping through planets (`minDistance: 2.35`, `maxDistance: 10.0` for planets; `minDistance: 5.0`, `maxDistance: 65.0` for Solar System).
- **Smooth Interpolation:** Transitions to focused machines use exponential lerping (`0.05` factor per frame) targeting normal offset coordinates (`0.70` units outward).

### Implementing Files
- [`components/experience/Experience.tsx`](file:///components/experience/Experience.tsx) (`CameraController`)

### Implementation Status
**Fully Implemented.**

---

*Related Documentation:*
- [03 — Project Architecture](file:///docs/03-project-architecture.md)
- [05 — 3D Assets and Scientific Data](file:///docs/05-assets-and-scientific-data.md)
- [06 — Application Workflows](file:///docs/06-application-workflows.md)
- [07 — Visual Design and Interface](file:///docs/07-visual-design.md)
