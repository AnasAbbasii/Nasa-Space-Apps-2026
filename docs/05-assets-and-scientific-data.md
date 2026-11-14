# 05 — 3D Assets and Scientific Data

This document provides a verified inventory of all 3D models, textures, scientific datasets, and coordinate records present in **The Museum of Forgotten Machines**.

---

## 1. 3D Model Inventory (`3dmodels/` & `public/3dmodels/`)

The repository includes raw assets in `3dmodels/` and static-hosted copies in `public/3dmodels/` for browser HTTP streaming.

| Celestial / Object | File Name | Format | Size | Actual Application Role |
| :--- | :--- | :--- | :--- | :--- |
| **The Sun** | `sun/source/UnstableStar.fbx` | FBX | 1.1 MB | Rendered in Solar System as the central star geometry via `FBXLoader`. |
| **Venus** | `venus/source/Venus.fbx` | FBX | 1.1 MB | Rendered in Solar System at orbit radius 5.5. |
| **Earth** | `earth/source/Earth.fbx` | FBX | 1.1 MB | Rendered in Solar System at orbit radius 8.8. |
| **Saturn** | `saturn/source/saturn.fbx` | FBX | 1.1 MB | Rendered in Solar System at orbit radius 14.8 with planetary rings. |
| **Uranus** | `uranus/source/uranus.fbx` | FBX | 1.1 MB | Rendered in Solar System at orbit radius 19.5 with extreme 98° tilt. |
| **Neptune** | `neptune/source/Neptune.fbx` | FBX | 1.1 MB | Rendered in Solar System at orbit radius 24.5. |
| **Lunar Module** | `moon/Apollo Lunar Module.glb` | GLB (glTF) | 42.1 MB | Authentic 3D model of the Apollo Lunar Module Descent Stage. Retained in asset library for high-detail inspection modals. |
| **Surveyor 3** | `moon/Surveyor/model.dae` | COLLADA (DAE) | 1.9 MB | 3D CAD model of the Surveyor lunar lander with associated texture maps. |
| **Surveyor CAD** | `moon/Surveyor.skp` | SketchUp | 1.7 MB | Archival source file. |
| **Moon Reference** | `moon/Earth's Moon 3D Model...html` | HTML | 16 KB | NASA Solar System Exploration reference documentation. |
| **Mars Reference** | `mars/Landed NASA hardware on Mars.html`| HTML | 400 KB | NASA reference dataset containing Mars surface map and 9 verified landing coordinates. |

*Asset Note:* No 3D model files exist for Mercury or Jupiter in the project repository. In accordance with project integrity guidelines, no placeholder models were fabricated.

---

## 2. Planetary Surface Textures & Visual Assets

| Asset Path | Resolution / Format | Source & Description | Usage in Application |
| :--- | :--- | :--- | :--- |
| `public/textures/moon_2k.jpg` | 2048×1024 JPEG | NASA Lunar Reconnaissance Orbiter (LRO) Clementine albedo mosaic. | Mapped to the Moon sphere in `components/experience/Moon.tsx`. |
| `public/textures/mars_surface.jpg`| 1024×512 JPEG | NASA Viking & Mars Global Surveyor MOLA global composite. | Mapped to the Mars sphere in `components/experience/mars/Mars.tsx`. |
| `3dmodels/earth/textures/1_earth_8k.jpg`| 8192×4096 JPEG | High-resolution Earth daytime topographical surface map. | Applied to Earth FBX model in `SolarSystem.tsx`. |
| `3dmodels/venus/textures/8k_venus_surface.jpg`| 8192×4096 JPEG | Magellan radar global surface map of Venus. | Applied to Venus FBX model in `SolarSystem.tsx`. |
| `3dmodels/sun/textures/suncyl1.jpg`| 2048×1024 JPEG | Solar chromosphere granulation texture. | Applied to Sun FBX model with emissive shading in `SolarSystem.tsx`. |
| `3dmodels/saturn/textures/Uv1_saturn1_diff.png`| PNG | Saturn cloud belt diffuse map. | Applied to Saturn body. |
| `3dmodels/saturn/textures/Uv1_saturn2_diff.png`| PNG | Saturn ring transparency/diffuse texture. | Applied to Saturn's ring geometry. |
| `3dmodels/uranus/textures/Uv1_uranus1_diff.png`| PNG | Uranus atmospheric cyan texture. | Applied to Uranus body. |
| `3dmodels/neptune/textures/Planeta_Base_Color.jpg`| JPEG | Neptune dynamic atmosphere blue texture. | Applied to Neptune body. |
| `components/spacebackground.jpg` | High-res JPEG | Ultra-wide deep space cosmic starfield. | Displayed as the full-screen persistent background across all pages in `app/layout.tsx`. |

---

## 3. Verified Lunar Machine Dataset (`lib/lunar-machines.ts`)

Coordinates verified against NASA Lunar Reconnaissance Orbiter (LRO) Camera data and the NASA Space Science Data Coordinated Archive (NSSDCA).

| Machine / Mission | Landing Date | Latitude | Longitude | Landing Site Location | Current Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Apollo 11 Descent Stage (Eagle)** | July 20, 1969 | `0.6741° N` | `23.4322° E` | Mare Tranquillitatis (*Tranquility Base*) | Intact on surface; imaged by LRO. |
| **Apollo 12 Descent Stage (Intrepid)** | November 19, 1969 | `-3.0128° S` | `-23.4219° W` | Oceanus Procellarum (*Ocean of Storms*) | Intact near Surveyor 3; imaged by LRO. |
| **Apollo 14 Descent Stage (Antares)** | February 5, 1971 | `-3.6453° S` | `-17.4714° W` | Fra Mauro Highlands | Intact on surface; imaged by LRO. |
| **Apollo 15 Descent Stage (Falcon)** | July 30, 1971 | `26.1322° N` | `3.6339° E` | Hadley-Apennine | Descent stage & Lunar Rover remain intact. |
| **Apollo 16 Descent Stage (Orion)** | April 21, 1972 | `-8.9734° S` | `15.5011° E` | Descartes Highlands | Descent stage & Lunar Rover remain intact. |
| **Apollo 17 Descent Stage (Challenger)**| December 11, 1972 | `20.1911° N` | `30.7723° E` | Taurus-Littrow Valley | Final crewed Apollo hardware in situ. |
| **Surveyor 3** | April 20, 1967 | `-3.0183° S` | `-23.3972° W` | Oceanus Procellarum | Historic robotic lander visited by Apollo 12. |

---

## 4. Verified Martian Machine Dataset (`lib/mars-machines.ts`)

Coordinates verified against the NASA Landed Hardware on Mars archival dataset and Mars Reconnaissance Orbiter (HiRISE) imaging.

| Machine / Mission | Landing Date | Latitude | Longitude (East-pos) | Landing Site Designation | Operational Life & Reason Left Behind |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Viking 1 Lander** | July 20, 1976 | `22.27° N` | `312.05° E` (`47.95° W`) | Chryse Planitia | 2,245 sols. Erroneous uplink command severed communications in 1982. |
| **Viking 2 Lander** | September 3, 1976 | `47.64° N` | `134.26° E` | Utopia Planitia | 1,281 sols. Battery failure ended contact in 1980. |
| **Pathfinder & Sojourner** | July 4, 1997 | `19.13° N` | `326.78° E` (`33.22° W`) | Ares Vallis (*Carl Sagan Memorial Station*)| 83 sols. Battery depletion in cold nighttime temperatures. |
| **Spirit (MER-A)** | January 4, 2004 | `-14.57° S` | `175.47° E` | Gusev Crater (*Columbia Memorial Station*) | 2,210 sols. Trapped in soft sand; winter cold depleted power in 2010. |
| **Opportunity (MER-B)** | January 25, 2004 | `-1.95° S` | `354.47° E` (`5.53° W`) | Meridiani Planum (*Challenger Station*) | 5,352 sols (45.16 km). Global planet-encircling dust storm in 2018. |
| **Phoenix Lander** | May 25, 2008 | `68.22° N` | `234.25° E` (`125.75° W`) | Vastitas Borealis (*Green Valley*) | 157 sols. Solar panels encased in winter carbon dioxide ice sheet. |
| **Curiosity (MSL)** | August 6, 2012 | `-4.59° S` | `137.44° E` | Gale Crater (*Bradbury Landing*) | Active mobile science laboratory ascending Mount Sharp. |
| **InSight Lander** | November 26, 2018 | `4.50° N` | `135.62° E` | Elysium Planitia | 1,440 sols. Martian dust accumulation on solar arrays starved power. |
| **Perseverance & Ingenuity** | February 18, 2021 | `18.44° N` | `77.45° E` | Jezero Crater (*Octavia E. Butler Landing*) | Perseverance active; Ingenuity retired at Valinor Hills after 72 flights. |

---

## 5. Astronomical Telemetry Metrics (`lib/solar-system.ts`)

| Celestial Body | Classification | Distance from Sun | Equatorial Diameter | Orbital Period | Rotation Period |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **The Sun** | Yellow Dwarf (G2V)| `0 km (Center)` | `1,392,700 km` | Galactic (~230M yrs)| 25 – 35 Earth days |
| **Venus** | Terrestrial Planet | `108.2M km (0.72 AU)` | `12,104 km` | 224.7 Earth days | 243 Earth days (Retrograde) |
| **Earth** | Terrestrial Planet | `149.6M km (1.00 AU)` | `12,742 km` | 365.25 days | 23h 56m 4s |
| **Mars** | Terrestrial Planet | `227.9M km (1.52 AU)` | `6,779 km` | 687 Earth days (1.88 yrs)| 24h 37m 22s (1 Sol) |
| **Saturn** | Gas Giant | `1.43B km (9.58 AU)` | `116,460 km` | 29.4 Earth years | 10h 33m |
| **Uranus** | Ice Giant | `2.87B km (19.2 AU)` | `50,724 km` | 84.0 Earth years | 17h 14m (Retrograde) |
| **Neptune** | Ice Giant | `4.50B km (30.1 AU)` | `49,244 km` | 164.8 Earth years | 16h 6m |

---

## 6. Mathematical Coordinate Projections

### Lunar Projection (`lib/moon-coords.ts`)
Converts standard spherical coordinates where latitude is degrees North/South ($[-90^\circ, +90^\circ]$) and longitude is degrees East/West ($[-180^\circ, +180^\circ]$):
```typescript
export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    -radius * Math.sin(phi) * Math.sin(theta),
  );
}
```

### Martian Projection (`lib/mars-coords.ts`)
Converts planetocentric coordinates with east-positive longitude ($[0^\circ, 360^\circ]$) matching the NASA Landed Hardware on Mars dataset:
```typescript
export function marsLatLonToVector3(lat: number, lon: number, radius = MARS_RADIUS): THREE.Vector3 {
  const a = THREE.MathUtils.degToRad(lat);
  const o = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(
    -radius * Math.cos(a) * Math.cos(o),
    radius * Math.sin(a),
    radius * Math.cos(a) * Math.sin(o),
  );
}
```

---

*Related Documentation:*
- [01 — Project Overview](file:///docs/01-project-overview.md)
- [04 — Features and User Experience](file:///docs/04-features-and-user-experience.md)
- [06 — Application Workflows](file:///docs/06-application-workflows.md)
