# 01 — Project Overview

## Project Name & Identity
**The Museum of Forgotten Machines**  
*Tagline:* *"Humanity may leave its machines behind, but it should never leave their stories forgotten."*  
*Entry Title:* **Abandoned but not Forgotten**

---

## NASA Space Apps Challenge Context
Developed for the **NASA Space Apps Challenge 2026**, this project addresses the historical, educational, and cultural preservation of humanity's planetary exploration heritage. Over six decades of deep-space missions, humanity has sent dozens of pioneering spacecraft, robotic orbiters, landers, rovers, and human descent stages to the Moon, Mars, and across the Solar System. 

Once these missions achieve their scientific goals, lose power, or reach their operational conclusion, they are left in situ across extraterrestrial landscapes. While their missions are cataloged in technical databases, their collective story as humanity's farthest monuments is often forgotten by the public.

---

## The Problem
1. **Dispersed Historical Data:** Information regarding historical spacecraft resting on extraterrestrial surfaces is scattered across archival papers, academic catalogs (e.g., NASA NSSDCA), and mission-specific databases.
2. **Abstract Understanding of Planetary Context:** Textual lists and tables fail to convey the physical scale, geographic dispersal, or hostile environments in which these machines operated and remain.
3. **Forgotten Sacrifices & Engineering Milestones:** The public frequently remembers only landmark moments (such as the Apollo 11 first step or the latest active rover), losing sight of the technological ancestors (Surveyor, Viking, Pathfinder, Spirit, Opportunity, Phoenix, InSight) that paved the way.

---

## Concept and Solution
**The Museum of Forgotten Machines** transforms archival mission data into an interactive, 3D celestial exploration museum. Rather than presenting a conventional website, the application functions as a virtual observatory and planetary archive:

- **Interactive 3D Solar System:** Visitors navigate a dynamic model of our planetary system featuring the Sun, Venus, Earth, Mars, Saturn, Uranus, and Neptune, providing astronomical context and planetary scale.
- **Dedicated Planetary Archives (Moon & Mars):** Dedicated high-fidelity interactive globes allow users to rotate, tilt, and examine extraterrestrial surfaces.
- **Verified Geographic Coordinates:** Every machine is placed at its scientifically verified coordinates derived from NASA mission logs, Lunar Reconnaissance Orbiter (LRO) data, and Mars Reconnaissance Orbiter (MRO/HiRISE) imaging.
- **Minimalist Aesthetic Architecture:** Machine markers use straight, thin white laser callout lines and Space Grotesk typography, ensuring the natural planetary geometry remains clean and unobstructed.
- **Detailed Historical Dossiers:** Interactive glassmorphic dossiers display mission agency, launch/landing dates, coordinates, original objectives, reasons for staying behind, historical significance, and current status.

---

## Target Audience
- **Space Enthusiasts & Historians:** Users seeking authentic data, verified landing locations, and rich historical narratives.
- **Students & Educators:** A visual and interactive learning platform illustrating planetary geography, orbital dynamics, and mission chronologies.
- **NASA Space Apps Challenge Evaluators:** Judges assessing technical execution, design excellence, scientific validity, and creative storytelling.
- **General Public:** Anyone interested in space exploration who benefits from an intuitive, atmospheric digital museum.

---

## Main Objectives
1. **Scientific Authenticity:** Use verified planetary datasets, real coordinates, authentic surface textures, and accurate astronomical metrics.
2. **Visual & Atmospheric Excellence:** Deliver a cinematic, ultra-minimal interface inspired by deep space, using a persistent high-resolution cosmic backdrop, subtle lighting, and refined typography.
3. **Frictionless Navigation:** Provide fluid transitions between the Solar System overview and localized planetary archives without jarring page reloads.
4. **Preservation of Storytelling:** Ensure that every machine's purpose, operational life, and reason for remaining behind are communicated with historical respect.

---

## Current Project Status
The project is fully operational in production. The core engine is built using Next.js 16 (App Router), React 19, Three.js, and React Three Fiber.

### Implemented vs. Incomplete / Excluded Features

| Feature Area | Current Status | Details |
| :--- | :--- | :--- |
| **Landing Page** | Complete | Minimalist title, tagline, fade-in animation, global space background, smooth transition. |
| **Solar System Engine** | Complete | Sun, Venus, Earth, Mars, Saturn, Uranus, Neptune with orbits, axial tilts, and rotation. |
| **Planetary Telemetry** | Complete | Dynamic inspection panel with astronomical metrics for all rendered celestial bodies. |
| **Moon Exploration Museum** | Complete | Lunar albedo sphere, verified Apollo & Surveyor sites, straight white callouts, dossier panel. |
| **Mars Exploration Museum** | Complete | Martian surface sphere, 9 verified NASA landers/rovers, straight white callouts, dossier panel. |
| **Planetary Gateways** | Complete | Contextual gateway badges on Earth (Moon Gateway) and Mars (Mars Gateway), plus direct mode toggles. |
| **Mercury & Jupiter** | Not Implemented | Excluded because 3D models were not present in the provided asset repository. |
| **3D Machine Meshes on Surface**| Intentionally Removed | Machine 3D models on planetary surfaces were removed to maintain an unobstructed view with clean HUD lines. |
| **Soundscape / Audio** | Not Implemented | Atmospheric ambient space audio is planned for a future update. |

---

*Related Documentation:*
- [02 — Technology Stack](file:///docs/02-technology-stack.md)
- [03 — Project Architecture](file:///docs/03-project-architecture.md)
- [04 — Features and User Experience](file:///docs/04-features-and-user-experience.md)
