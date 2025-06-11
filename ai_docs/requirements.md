
# Requirements — Static React App for Repeater‑Protocol Simulation Plots
*File name: `requirements.md`*  
*Version: 1.0 — generated 2025-06-10*

---

## 1 Scope

Build a **static, client‑side React 18 web application** that lets researchers **explore pre‑computed SVG plots** of quantum‑repeater simulations.  
The app must be **self‑contained** (no server code), fetch SVGs on demand from a public directory, and run from any static host (e.g., GitHub Pages).

---

## 2 Glossary

| Term | Meaning |
|------|--------------------------------------------------------------|
| **Plot type** | One category of SVG visualisation (e.g. “3D global‑schedule”, “Plateau grid”). |
| **Parameter sliders** | UI controls for: `η_c` (eta_c), `ε_G` (epsilon_G), `N`, `M`, and **rule** (“SKR”, “F_th 0.95”, “F_th 0.97”, …). |
| **Dependency matrix** | A lookup table that states which parameters affect each plot type. |
| **Lazy‑load** | Import (fetch) an SVG only when the user requests it, never in the initial bundle. |

---

## 3 Core Use‑Cases

| UC‑ID | Title | Main Flow |
|-------|-------|-----------|
| UC‑01 | Pick plot type | User selects a tab; app renders SVG that matches current parameters. |
| UC‑02 | Sweep parameter | User drags a slider or chooses a rule; after throttle delay, app reloads SVG. |
| UC‑03 | Deep‑link | User shares page URL; opening that URL restores identical plot + slider state. |
| UC‑04 | Inspect raw SVG | User right‑clicks SVG → “Open image in new tab” to download the source file. |
| UC‑05 | Accessibility nav | User navigates tabs & sliders solely by keyboard / screen‑reader. |

---

## 4 Functional Requirements

### 4.1 Plot Rendering

| ID | Requirement |
|----|-------------|
| **FR‑01** | The app SHALL list all *plot types* in a horizontal tab bar. Order is taken from `plotMeta.ts`. |
| **FR‑02** | Selecting a tab SHALL update `currentPlotType` in React state and in the URL query string. |
| **FR‑03** | The app SHALL construct the relative file path following the existing tree: `repeater_protocol/comparison_plots/<subdirs>/…<svg-name>.svg`. |
| **FR‑04** | SVG files SHALL be loaded with `React.lazy` + `Suspense`, displaying a spinner during fetch. |
| **FR‑05** | Once fetched, an SVG SHALL be cached in memory so that subsequent renders use the cached `objectURL`. |

### 4.2 Parameter Controls

| ID | Requirement |
|----|-------------|
| **FR‑10** | The app SHALL expose sliders for `η_c`, `ε_G`, `N`, and `M`, plus a select dropdown for **rule**. |
| **FR‑11** | Slider values SHALL be discrete and limited to the exact values present in the data set. |
| **FR‑12** | For the *current plot type*, parameters that do **not** affect the SVG SHALL be visually dimmed and non‑interactive (🔒). |
| **FR‑13** | Parameter state changes SHALL be debounced/throttled by **≥ 150 ms** to avoid rapid re‑loads. |
| **FR‑14** | Changing a parameter SHALL push the new state into the browser history (deep‑link). |

### 4.3 Data Catalogue Generation

| ID | Requirement |
|----|-------------|
| **FR‑20** | At **build time**, a Node script SHALL scan `public/repeater_protocol/comparison_plots/**` and auto‑generate `src/data/plotMeta.ts`. |
| **FR‑21** | `plotMeta.ts` SHALL export: *(a)* an array of `{{ plotType, params, relPath }}` records, and *(b)* the **dependency matrix** in a declarative form. |
| **FR‑22** | The build script SHALL fail with a clear error if any SVG file’s name does not parse into known parameters. |

### 4.4 Routing & State

| ID | Requirement |
|----|-------------|
| **FR‑30** | The app SHALL use `react‑router` with query‑string parameters (`?plot=3d&eta_c=0.5&...`). |
| **FR‑31** | On initial load, the app SHALL read the URL and restore state before first SVG fetch. |
| **FR‑32** | Invalid or missing query params SHALL fall back to the first legal value for each dimension. |

### 4.5 Accessibility & UX

| ID | Requirement |
|----|-------------|
| **FR‑40** | All interactive elements SHALL have keyboard access and ARIA labels. |
| **FR‑41** | SVG images SHALL carry meaningful `<title>` tags for assistive tech. |
| **FR‑42** | The UI SHALL respect user `prefers‑color‑scheme` (auto dark / light). |

---

## 5 Non‑Functional Requirements

| NFR‑ID | Category | Requirement |
|--------|----------|-------------|
| **NFR‑01** | Performance | First contentful paint ≤ 1.5 s on a 50 Mb/s connection (uncached). |
| **NFR‑02** | Performance | No single network fetch > 1 MiB; enforce via SVG gzip + budget lint. |
| **NFR‑03** | Bundle size | JavaScript + CSS ≤ 250 KiB gzipped (excluding SVGs). |
| **NFR‑04** | Browser support | Latest 2 versions of Chrome, Firefox, Safari, and Edge. |
| **NFR‑05** | CI | Build must finish in < 120 s on GitHub Actions `ubuntu‑latest`. |
| **NFR‑06** | Docs | `README.md` SHALL document local dev (`pnpm dev`) and production build steps. |

---

## 6 Technology Stack

* **React 18** with **TypeScript**  
* **Vite** bundler  
* **Tailwind CSS** for styling  
* **Lucide‑react** icons  
* **React Router v6** for routing  
* No runtime state libs (use Context + Reducer)  
* Optional: `zustand` if state grows beyond 250 LOC.

---

## 7 Dependency Matrix (authoritative copy)

| Plot type | η_c | ε_G | N | M | rule |
|-----------|:---:|:---:|:--:|:--:|:----:|
| 3D global‑schedule | ✔︎ | ✔︎ | ✔︎ | ✔︎ | ✔︎ |
| Best strategies 2D | ✔︎ | ✔︎ | ✔︎ | ✔︎ | – |
| SKR vs F_th        | ✔︎ | ✔︎ | ✔︎ | ✔︎ | – |
| Distance‑ratio     | –  | –  | ✔︎ | ✔︎ | – |
| Advantage heatmaps | ✔︎ | ✔︎ | –  | –  | ✔︎ |
| Plateau grid       | –  | –  | –  | –  | – |
| Threshold heatmap  | –  | –  | –  | ✔︎ | – |
| η_c comparisons    | –  | ✔︎ | ✔︎ | ✔︎ | ✔︎ |

(The same table is exported in `plotMeta.ts`.)

---

## 8 Build & Deployment Pipeline

1. `pnpm i`  
2. `pnpm run build:meta` → generates `plotMeta.ts`.  
3. `pnpm run build` → Vite outputs `dist/`.  
4. Deploy `dist/` folder to GitHub Pages (or any static host).

---

## 9 Out‑of‑Scope

* Server‑side rendering (SSR)  
* Dynamic plot generation (all plots are pre‑computed SVGs)  
* User authentication  
* Editing / annotating plots

---

## 10 Acceptance Criteria

1. **Demo checklist**  
   * Load app from GitHub Pages live link.  
   * Show that initial bundle network tab contains *no* SVG.  
   * Navigate to “Advantage heatmaps” → confirm relevant sliders activate, others lock.  
   * Paste shared URL into incognito tab → identical view appears.  

2. **Automated tests**  
   * `npm run test` unit suite passes (Jest + React Testing Library).  
   * Lighthouse CI score ≥ 90 performance & accessibility.

3. **Code review**  
   * Meets ESLint `eslint:recommended` + Prettier.  
   * No TODOs in `main` branch.

---

*End of document.*
