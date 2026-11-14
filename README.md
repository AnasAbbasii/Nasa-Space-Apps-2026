# The Museum of Forgotten Machines
> *"Humanity may leave its machines behind, but it should never leave their stories forgotten."*

An immersive, cinematic, interactive 3D Solar System and planetary exploration museum developed for the **NASA Space Apps Challenge 2026**.

The experience invites visitors to explore our Solar System and discover the human-made spacecraft, landers, rovers, and equipment left behind on extraterrestrial surfaces at their verified geographic coordinates.

---

## Key Features

- **Cinematic Landing Experience:** Minimalist entrance portal with atmospheric cosmic backgrounds and smooth transition animations.
- **Interactive 3D Solar System:** Dynamic 3D simulation of our Solar System featuring the Sun and orbiting planets (Venus, Earth, Mars, Saturn, Uranus, Neptune) with accurate axial tilts, orbital speeds, and orbital paths.
- **Real-Time Orbit Following & Telemetry:** Seamless camera interpolation tracking orbiting planets with verified astronomical metrics from NASA databases.
- **Dedicated Moon Exploration Museum:** High-resolution 3D Moon sphere featuring verified landing coordinates for Apollo 11–17 and Surveyor 3 missions.
- **Dedicated Mars Exploration Museum:** High-resolution 3D Mars sphere cataloging 9 verified NASA robotic landing sites (Viking 1 & 2, Pathfinder/Sojourner, Spirit, Opportunity, Phoenix, Curiosity, InSight, Perseverance & Ingenuity).
- **Minimalist Laser HUD Callouts:** Non-intersecting, straight white connection lines rendered with screen-space `Line2` geometry and floating Space Grotesk labels with zero background cards.
- **Comprehensive Historical Dossiers:** Slide-out glassmorphic intelligence panels detailing mission agency, landing dates, precise coordinates, original purpose, why the machine was left behind, historical significance, and current verified status.
- **Fluid Cross-Museum Navigation:** Seamless transitions between the Solar System overview and localized planetary archives without full page reloads.

---

## Technology Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Engine:** [React 19](https://react.dev/)
- **3D Graphics:** [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), and [@react-three/drei](https://github.com/pmndrs/drei)
- **Styling & Design:** [Tailwind CSS v4](https://tailwindcss.com/) & Space Grotesk Typography
- **Language:** TypeScript 5 (Strict Mode)
- **Build System:** Webpack engine (`next build --webpack`)

---

## Project Documentation Index

Comprehensive documentation is available in the [`docs/`](./docs) directory:

1. [**01 — Project Overview**](./docs/01-project-overview.md): Project concept, challenge context, audience, and objectives.
2. [**02 — Technology Stack**](./docs/02-technology-stack.md): Detailed inventory of all languages, libraries, and tools.
3. [**03 — Project Architecture**](./docs/03-project-architecture.md): Application structure, component tree, and Mermaid diagrams.
4. [**04 — Features and User Experience**](./docs/04-features-and-user-experience.md): Complete feature breakdown, interaction mechanics, and implementation status.
5. [**05 — 3D Assets and Scientific Data**](./docs/05-assets-and-scientific-data.md): 3D model records, texture maps, coordinate math, and NASA datasets.
6. [**06 — Application Workflows**](./docs/06-application-workflows.md): User journeys, navigation sequences, and Mermaid flowcharts.
7. [**07 — Visual Design and Interface**](./docs/07-visual-design.md): Design philosophy, color palette, typography, and glassmorphic UI.
8. [**08 — Setup and Installation**](./docs/08-setup-and-installation.md): Environment prerequisites, installation steps, and run commands.
9. [**09 — Implementation Status and Limitations**](./docs/09-implementation-status.md): Implementation audit, known limits, and performance considerations.
10. [**10 — Future Development**](./docs/10-future-development.md): Prioritized roadmap for upcoming phases.

---

## Getting Started

### Prerequisites
- Node.js 18.18.0 or higher
- npm, pnpm, or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-org>/abandoned-but-not-forgotten.git
cd appfolder

# Install dependencies
npm install
```

### Running Locally
```bash
# Launch development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Production Build
```bash
# Build optimized production bundle
npm run build

# Start production server
npm run start
```

---

## Current Status
- **Core Architecture:** Complete
- **Landing Page:** Complete
- **Solar System Simulation:** Complete
- **Moon Museum:** Complete
- **Mars Museum:** Complete
- **Type Safety & Build:** 0 Errors (`tsc --noEmit` and `next build --webpack` exit code 0)

---

## License
MIT License. See [LICENSE](./LICENSE) for details.
