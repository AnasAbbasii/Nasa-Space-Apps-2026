# 02 — Technology Stack

This document details the complete technology stack powering **The Museum of Forgotten Machines**. Every listed technology has been verified against the codebase configuration (`package.json`, `tsconfig.json`, `next.config.ts`, and component imports).

---

## 1. Programming Languages & Standards

| Language / Standard | Version / Target | Usage & Role in Project |
| :--- | :--- | :--- |
| **TypeScript** | `^5.0.0` | Primary language for all application logic, type definitions, mathematical coordinate utilities, and component props. Configured with `strict: true` and ES2022 output. |
| **JavaScript (ES2022+)** | Modern ECMAScript | Runtime execution standard across browser engines and Node.js server runtimes. |
| **GLSL (OpenGL Shading Language)** | Three.js Shader Engine | Utilized internally by Three.js materials (`MeshStandardMaterial`, `MeshBasicMaterial`, `LineMaterial`) for physically based rendering and tone mapping. |
| **HTML5 / CSS3** | Modern Standards | Responsive viewport management, flexbox/grid overlays, CSS keyframe animations, and DOM annotations via `@react-three/drei`'s `<Html>` projection. |

---

## 2. Core Frameworks & Runtime

| Framework | Version | Function & Justification |
| :--- | :--- | :--- |
| **Next.js** | `16.4.6` | Modern full-stack React framework providing the App Router (`app/`), static generation (`next build`), image optimization (`next/image`), and production asset routing. |
| **React** | `19.3.0` | Core UI library managing application lifecycle, state hooks (`useState`, `useRef`, `useCallback`, `useMemo`, `useEffect`), Suspense boundaries, and reconciliation. |
| **React DOM** | `19.3.0` | Client-side DOM renderer and hydration controller. |

---

## 3. 3D Graphics & Rendering Pipeline

| Library | Version | Actual Usage in Codebase |
| :--- | :--- | :--- |
| **Three.js** | `^0.187.0` | Foundational WebGL 3D graphics library. Handles vector mathematics (`Vector3`, `Quaternion`, `Euler`), scene graph hierarchy (`Group`, `Mesh`), standard materials, lighting, and textures. |
| **@react-three/fiber (R3F)** | `^9.8.2` | Declarative Three.js wrapper for React. Drives the canvas render loop via `useFrame()`, camera matrices, and scenegraph lifecycle. |
| **@react-three/drei** | `^10.7.9` | Helper library providing essential 3D scene controls: `OrbitControls` for user interaction, `useTexture` for asynchronous asset streaming, and `Html` for 2D/3D DOM billboard projection. |
| **three-stdlib** | *Bundled with drei* | Advanced Three.js add-ons: `Line2`, `LineGeometry`, and `LineMaterial` for screen-space line rendering without artifacts, and `FBXLoader` for importing planetary geometry. |

---

## 4. UI, Styling & Typography

| Technology | Version / Configuration | Purpose |
| :--- | :--- | :--- |
| **Tailwind CSS** | `4.3.3` | Utility-first CSS engine using the Tailwind v4 `@theme inline` configuration for minimal bundle overhead and modern color variables. |
| **@tailwindcss/turbopack** | `4.3.3` | Tailwind v4 compilation plugin configured in `devDependencies`. |
| **Space Grotesk** | Google Fonts (400, 500, 600, 700) | Primary design typography. Delivered via preconnected `<link>` tags in `app/layout.tsx` to ensure zero build-time font blocking while providing a clean, space-age aesthetic. |
| **Geist / Inter / Monospace** | System Fallbacks | Secondary fallback font stack defined in `app/globals.css` for tabular metadata and telemetry numbers. |

---

## 5. Development, Linting & Build Tools

| Tool | Version | Configuration |
| :--- | :--- | :--- |
| **TypeScript Compiler (`tsc`)** | `^5` | Strict type validation (`tsconfig.json`) verifying no type leaks across datasets, coordinate helpers, and 3D refs. |
| **ESLint** | `^9.0.0` | Static code analysis configured with `eslint-config-next` (`16.4.6`) in `eslint.config.mjs`. |
| **Webpack** | *Next.js 16 Internal* | Production build bundler invoked via `next build --webpack` for robust module resolution and Three.js shader tree-shaking. |

---

## 6. Complete Dependency Inventory (`package.json`)

```json
{
  "dependencies": {
    "@react-three/drei": "^10.7.9",
    "@react-three/fiber": "^9.8.2",
    "@types/three": "^0.187.0",
    "next": "16.4.6",
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "three": "^0.187.0"
  },
  "devDependencies": {
    "@tailwindcss/turbopack": "4.3.3",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.4.6",
    "tailwindcss": "4.3.3",
    "typescript": "^5"
  }
}
```

### Dependency Role Breakdown
- `@react-three/fiber` & `three`: Power the WebGL rendering canvas in `components/experience/Experience.tsx`.
- `@react-three/drei`: Provides `useTexture` in `Moon.tsx` and `Mars.tsx`, `OrbitControls` for user orbit interaction, and `Html` for callout rendering.
- `next`, `react`, `react-dom`: Host the application routing, page structure, and client component tree.
- `tailwindcss`: Powers styling for the landing page hero, top navigation bar, quick-selector pills, and glassmorphic info dossiers.

---

## 7. Build and Execution Profile
- **Compilation Engine:** Next.js with Webpack engine (`next build --webpack`).
- **Static Page Generation:** Prerenders `/`, `/_not-found`, and `/experience` as static HTML shells (`○ Static`).
- **Client Hydration Guard:** `ExperienceRoot.tsx` ensures the WebGL canvas mounts exclusively after client-side hydration, preventing Next.js 16 server-side segmentation or canvas SSR mismatches.

---

*Related Documentation:*
- [01 — Project Overview](file:///docs/01-project-overview.md)
- [03 — Project Architecture](file:///docs/03-project-architecture.md)
- [08 — Setup and Installation](file:///docs/08-setup-and-installation.md)
