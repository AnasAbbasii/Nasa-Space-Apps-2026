# 06 — Application Workflows

This document diagrams and explains the user journeys and navigational workflows implemented in **The Museum of Forgotten Machines**.

---

## 1. Master Application Flow Overview

The user journey transitions seamlessly from a cinematic entry point into multi-level celestial exploration:

```mermaid
flowchart TD
    A["Landing Page (/)<br>• Hero Title & Tagline<br>• Click Anywhere Prompt"] -->|Click / Keypress| B["Page Transition<br>• 700ms Opacity Fade<br>• Client Hydration Guard"]
    B --> C["Interactive 3D Solar System (/experience)<br>• 6 Orbiting Planets & Sun<br>• Free Orbit & Zoom Controls"]
    
    C -->|Click Planet / Header Pill| D["Planet Orbit Tracking & Telemetry<br>• Camera locks to orbiting body<br>• Astronomical metrics panel"]
    
    D -->|Click Earth Moon Gateway| E["Moon Museum Archive<br>• NASA Clementine Albedo Globe<br>• 7 Verified Landing Sites"]
    C -->|Click Header 'Moon Museum'| E
    
    D -->|Click Mars Gateway| F["Mars Museum Archive<br>• NASA Viking/MOLA Surface Globe<br>• 9 Verified Rover/Lander Sites"]
    C -->|Click Header 'Mars Museum'| F
    
    E -->|Click Lunar Machine| G["Lunar Machine Dossier<br>• Zoom into surface coordinates<br>• InfoPanel with historical facts"]
    F -->|Click Martian Machine| H["Martian Machine Dossier<br>• Zoom into surface coordinates<br>• MarsInfoPanel with mission logs"]
    
    G -->|Return to Full Moon| E
    H -->|Return to Full Mars| F
    
    E -->|← Solar System| C
    F -->|← Solar System| C
    E -->|✦ Switch to Mars| F
    F -->|✦ Switch to Moon| E
```

---

## 2. Journey 1: Landing Page to Solar System

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Landing as LandingPage (app/page.tsx)
    participant Router as Next.js Router
    participant Root as ExperienceRoot
    participant Engine as Experience (Canvas)

    User->>Landing: Clicks anywhere or presses Enter/Space
    Landing->>Landing: Sets isNavigating = true (triggers CSS fade-out)
    Landing->>Router: Calls router.push('/experience') after 600ms
    Router->>Root: Mounts /experience shell
    Root->>Root: Checks hydration (mounted = true)
    Root->>Engine: Mounts Experience component with viewMode = 'solar'
    Engine-->>User: Renders 3D Solar System overview with camera at [0, 22, 36]
```

### Steps Explained
1. **User Activation:** The user clicks the landing page or presses `Enter`/`Space`.
2. **Smooth Fade:** `isNavigating` is set to `true`, animating the container opacity from `1` to `0` over 700ms.
3. **Route Navigation:** `router.push('/experience')` transitions to the experience route.
4. **Hydration Protection:** `ExperienceRoot` briefly shows `"Diving deep into space..."` while client-side WebGL initializes, avoiding SSR hydration errors.
5. **Initial 3D Scene:** The canvas loads with the Sun and 6 planets in motion, with orbit lines and overview UI.

---

## 3. Journey 2: Solar System to Planet Inspection

```mermaid
flowchart LR
    A["Solar Overview<br>Camera at [0, 22, 36]"] -->|Click Planet Mesh / Top Pill| B["Target Cam Calculation<br>livePos + offset * radius"]
    B -->|useFrame Lerp (0.05)| C["Dynamic Tracking Camera<br>Follows planet along orbit"]
    C --> D["PlanetInfoPanel Slides In<br>• Distance, Diameter, Periods<br>• Scientific Overview"]
    D -->|Click Close or Background| A
```

### Steps Explained
1. **Selection:** User clicks a planet in 3D space or clicks a planet pill in the top-right header (e.g., `Venus`, `Earth`, `Mars`, `Saturn`, `Uranus`, `Neptune`).
2. **Real-Time Orbit Following:** The `CameraController` calculates an offset position based on the planet's dynamic live coordinates and smoothly interpolates the camera and orbit target.
3. **Telemetry Panel:** `PlanetInfoPanel` renders scientific metrics derived from NASA orbital datasets.
4. **Dismissal:** Clicking `✕`, the `Reset View` button, or empty space smoothly returns the camera to the solar overview.

---

## 4. Journey 3: Entering & Exploring the Moon Museum

```mermaid
flowchart TD
    A["Solar System View<br>(Earth View or Top Button)"] -->|Click 'Moon Museum'| B["State: viewMode = 'moon'<br>• Solar system unmounted<br>• Camera reset to [0, 0, 5.5]"]
    B --> C["Moon Sphere Renders<br>• Auto-rotation enabled<br>• DynamicCallouts active"]
    
    C -->|Hover Label / Marker| D["Highlight State<br>• Marker dot brightens to 1.0<br>• Surface ring appears"]
    
    C -->|Click Label / Marker| E["Machine Selected<br>• Auto-rotate stops<br>• Target Cam: surfacePoint + normal * 0.70<br>• InfoPanel opens on right"]
    
    E -->|Click '← Return to Full Moon' / Close| C
    C -->|Click '← Solar System'| A
    C -->|Click '✦ Switch to Mars'| F["Mars Museum View"]
```

### Steps Explained
1. **Entry:** User clicks either the 3D Moon Gateway badge in Earth's orbit or the `✦ Moon Museum` button.
2. **Mode Switch:** `viewMode` changes to `'moon'`. Solar System assets unmount and the high-resolution 3D Moon sphere loads.
3. **Exploration:** The Moon slowly rotates. Hovering any straight white callout line or surface marker highlights the site.
4. **Machine Inspection:** Clicking a machine smoothly rotates and zooms the camera into close-up surface proximity ($0.70$ scene units from the surface) and opens the lunar historical dossier (`InfoPanel`).
5. **Return:** User can return to the full Moon view, return to the Solar System, or switch directly to Mars.

---

## 5. Journey 4: Entering & Exploring the Mars Museum

```mermaid
flowchart TD
    A["Solar System View<br>(Mars View or Top Button)"] -->|Click 'Mars Museum'| B["State: viewMode = 'mars'<br>• Solar system unmounted<br>• Camera reset to [0, 0, 5.5]"]
    B --> C["Mars Sphere Renders<br>• Auto-rotation enabled<br>• MarsCallouts active"]
    
    C -->|Hover Label / Marker| D["Highlight State<br>• Marker dot brightens to 1.0<br>• Amber ring appears"]
    
    C -->|Click Label / Marker| E["Machine Selected<br>• Auto-rotate stops<br>• Target Cam: surfacePoint + normal * 0.70<br>• MarsInfoPanel opens on right"]
    
    E -->|Click '← Return to Full Mars View' / Close| C
    C -->|Click '← Solar System'| A
    C -->|Click '✦ Switch to Moon'| F["Moon Museum View"]
```

### Steps Explained
1. **Entry:** User clicks the 3D Mars Gateway badge in Mars's orbit or the `✦ Mars Museum` button.
2. **Mode Switch:** `viewMode` changes to `'mars'`. The 3D Mars sphere loads with authentic Viking/MOLA surface coloration.
3. **Surface Coordinates:** 9 historical landing sites display straight white connection lines to clean Space Grotesk labels.
4. **Rover Dossier:** Clicking a rover/lander (e.g., *Pathfinder*, *Curiosity*, *Perseverance*) zooms the camera into the landing crater and displays the mission logs (`MarsInfoPanel`).

---

## 6. Direct Cross-Museum Navigation
Visitors exploring the Moon can jump directly to Mars without returning to the Solar System overview using the contextual `✦ Switch to Mars` header button. Similarly, visitors on Mars can jump directly to the Moon via `✦ Switch to Moon`. All camera transitions interpolate smoothly without abrupt cuts.

---

*Related Documentation:*
- [03 — Project Architecture](file:///docs/03-project-architecture.md)
- [04 — Features and User Experience](file:///docs/04-features-and-user-experience.md)
- [07 — Visual Design and Interface](file:///docs/07-visual-design.md)
