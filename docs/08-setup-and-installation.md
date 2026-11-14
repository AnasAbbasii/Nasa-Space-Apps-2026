# 08 — Setup and Installation

This guide provides accurate, verified instructions for installing, configuring, building, and running **The Museum of Forgotten Machines**.

---

## 1. Prerequisites

Before installing, ensure your environment meets the following requirements:

- **Node.js:** Version `18.18.0` or higher (Node 20+ LTS recommended).
- **Package Manager:** `npm` (v9+), `pnpm` (v8+), or `yarn` (v1.22+).
- **Operating System:** Windows 10/11, macOS, or Linux.
- **Hardware Requirement:** Modern GPU with WebGL 2.0 support (standard in modern integrated and dedicated graphics processors).

---

## 2. Dependency Installation

Clone the repository and install all dependencies:

```bash
# Clone the repository
git clone https://github.com/<your-org>/abandoned-but-not-forgotten.git
cd appfolder

# Install dependencies using npm
npm install

# Alternatively, using pnpm
pnpm install
```

All required libraries (`three`, `@react-three/fiber`, `@react-three/drei`, `next`, `tailwindcss`) will be installed according to `package.json` and locked via `package-lock.json`.

---

## 3. Environment Configuration

This project is a **self-contained client-side 3D application**. 
- It requires **no external API keys**, database connections, or mandatory environment variables.
- No `.env` or `.env.local` file is required for standard local development or production deployment.

---

## 4. Development Server

To launch the local development server with hot-module reloading:

```bash
npm run dev
```

By default, the server starts at:
```
http://localhost:3000
```

Open the URL in any modern browser (Chrome, Edge, Firefox, Safari) with hardware acceleration enabled.

---

## 5. Production Build & Optimization

To compile an optimized production build:

```bash
# Standard build command
npm run build
```

### Webpack Build Recommendation (Next.js 16)
Because Next.js 16 incorporates experimental Turbopack defaults for builds, compiling with the explicit `--webpack` flag ensures stable Three.js shader tree-shaking and avoids segment bundling issues:

```bash
# Explicit Next.js Webpack build
npx next build --webpack
```

### Production Build Verification
A successful build outputs:
```
▲ Next.js 16.4.6 (webpack)
  Creating an optimized production build ...
✓ Compiled successfully
  Running TypeScript ...
  Collecting page data ...
✓ Generating static pages (5/5)
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
└ ○ /experience
```

---

## 6. Running Production Server

After completing the production build, start the optimized Node.js server:

```bash
npm run start
```

The application will be served from `http://localhost:3000`. To run on an alternative port:

```bash
npx next start -p 3008
```

---

## 7. Available Scripts

| Command | Action | Implementation |
| :--- | :--- | :--- |
| `npm run dev` | Starts local Next.js development server. | `next dev` |
| `npm run build` | Compiles optimized static/SSR application. | `next build` |
| `npm run start` | Runs built production server. | `next start` |
| `npm run lint` | Runs ESLint 9 checks across project files. | `eslint` |

---

## 8. Common Setup Issues & Troubleshooting

### Issue 1: Port Conflict (`EADDRINUSE: 3000`)
**Symptom:** Server fails to start with `Error: listen EADDRINUSE: address already in use :::3000`.  
**Solution:** Another process (e.g., an earlier development server) is holding port 3000. Either terminate the background process or start Next.js on an alternate port:
```bash
# Windows PowerShell command to find and stop process on port 3000
Get-Process node | Stop-Process -Force

# Or start on another port
npx next dev -p 3001
```

### Issue 2: Next.js 16 Prerender Segmentation
**Symptom:** Next.js throws an error regarding `ssr: false is not allowed with next/dynamic in Server Components` or file permission issues on `.segments`.  
**Solution:** The codebase uses `components/experience/ExperienceRoot.tsx` with a standard client-mount hook (`useState`/`useEffect`). Ensure `app/experience/page.tsx` imports `ExperienceRoot` cleanly without calling `next/dynamic({ ssr: false })` in the server file.

### Issue 3: WebGL Context Lost on Background Tabs
**Symptom:** Canvas goes blank when returning to the tab after prolonged idling.  
**Solution:** Three.js will automatically attempt to restore WebGL contexts when the browser tab regains focus. Refreshing the browser page immediately reinitializes the canvas.

---

*Related Documentation:*
- [02 — Technology Stack](file:///docs/02-technology-stack.md)
- [03 — Project Architecture](file:///docs/03-project-architecture.md)
- [09 — Implementation Status and Limitations](file:///docs/09-implementation-status.md)
