# Static React App for Repeater‑Protocol Simulation Plots — High‑Level Proposal

## 1  Goals & Guiding Principles
| ✔︎ | Objective |
|---|---|
| • | Provide a **single‑page static React app** to let readers explore every SVG result interactively. |
| • | **Lazy‑load** each SVG only when needed; keep initial bundle tiny. |
| • | Offer a **clean, modern but restrained** visual style suitable for scientific supplementary material. |
| • | Clearly indicate which parameters affect the chosen plot (irrelevant sliders are dimmed/locked). |
| • | Keep hosting trivial – any static server (GitHub Pages, Netlify, institutional server) will work. |

---

## 2  High‑Level Architecture

```text
src/
 ├─ App.tsx               ← page shell & global context
 ├─ data/plotMeta.ts      ← auto‑generated catalogue of all files & their parameters
 ├─ components/
 │    ├─ Header.tsx
 │    ├─ PlotTypeTabs.tsx
 │    ├─ ParamPanel/
 │    │     ├─ SliderField.tsx
 │    │     └─ ParamPanel.tsx
 │    ├─ PlotCanvas.tsx
 │    └─ Footer.tsx
 ├─ hooks/
 │    ├─ useThrottledState.ts
 │    └─ useLazySVG.ts
 └─ utils/pathBuilder.ts
public/
 └─ repeater_protocol/comparison_plots/…  ← untouched simulation tree
```

| Concern | Choice | Notes |
|---------|--------|-------|
| Bundler | **Vite + React 18** | lightning‑fast dev; outputs pure static assets |
| State   | React Context + `useReducer` | tiny – no Redux |
| Routing | `react‑router` (query‑string params) | deep‑link any plot |
| Styling | **Tailwind CSS** | compact utility classes, easy dark‑mode |
| Icons   | Lucide | used for lock/dim indicators |
| SVG loading | `React.lazy` + `Suspense` | fetches each file *once*, then caches |

---

## 3  Parameter Dependency Matrix

| Plot type | Varies with | Notes |
|-----------|-------------|-------|
| **3D global‑schedule** | η_c, ε_G, N, M, rule | all sliders active |
| **Best strategies 2D** | η_c, ε_G, N, M | rule slider locked |
| **SKR vs F_th** | η_c, ε_G, N, M | rule fixed; slider hidden |
| **Distance‑ratio** | N, M | η_c, ε_G, rule dimmed |
| **Advantage heatmaps** | η_c, ε_G, rule | N & M dimmed |
| **Plateau grid** | – | all sliders dimmed |
| **Threshold heatmap** | M | others dimmed |
| **η_c comparisons** | N, M, rule | ε_G dimmed |

The matrix is exported as constants so UI logic remains declarative.

---

## 4  Wireframes (text sketch)

```
┌───────────────────────────────────────────────────────────┐
│  Header: “Repeater‑Protocol Supplementary Plots”         │
└───────────────────────────────────────────────────────────┘
┌───────────────┐┌───────────────────────────────────────┐
│ PlotTypeTabs  ││ PlotCanvas — SVG rendered here        │
│  ┌─────────┐  ││  • spinner while lazy‑loading         │
│  │ 3D      │  ││  • right‑click → open raw SVG         │
│  │ 2D Best │  ││                                         
│  │ Dist‑rat│  ││                                         
│  │ …       │  ││                                         
│  └─────────┘  │└───────────────────────────────────────┘
│ ParamPanel     │
│  η_c  ▮───|    │
│  ε_G  ▮─|      │   ← active sliders
│   N   ▮───|    │
│   M   ▮───|    │
│  rule ◊▼       │
│ (dimmed = 🔒)  │
└───────────────┘
               Footer: citation · DOI · GitHub
```

---

## 5  Core Interaction Flow

1. **Plot type tab click** → update `currentPlotType`.
2. App consults dependency matrix, enabling or dimming sliders.
3. **Sliders** use `useThrottledState(150 ms)` so rapid drags don’t spam fetches.
4. **Path builder** interpolates parameters into the correct relative file path.
5. **`useLazySVG` hook**  
   * checks cache; fetches only if absent  
   * converts `Blob` to object URL for `<img>`  
6. Plot shows; URL query‑string updates for shareable link.

---

## 6  Build & Deployment Checklist

| Step | Command / file |
|------|----------------|
| Scaffold | `pnpm create vite my‑plots --template react-ts` |
| Tailwind setup | `tailwind.config.cjs`, add grey/blue palette |
| Auto‑catalogue script | Node script run in `npm run build` to emit `plotMeta.ts` |
| CI | GitHub Actions: `pnpm i` → `vite build` → deploy to `gh-pages` |
| Hosting | GitHub Pages or Netlify (just upload `/dist`) |

---

## 7  Optional Enhancements

* **Idle pre‑fetch** nearest‑neighbor SVGs with `requestIdleCallback()`.
* **Download all** — zip the tree for power users.
* **Mini‑map** overlay for parameter coverage.
* **Accessibility** — full keyboard & screen‑reader labels.
* **Auto dark‑/light‑mode** via `prefers‑color‑scheme`.

---

## Appendix A — Example File‑Tree

```text
repeater_protocol/comparison_plots/
├─ etac0.5_epsg0.001/
│   ├─ 3d_visualization_SKR_N256_M512_etac0.5_epsg0.001.svg
│   ├─ best_strategies_N256_M512.svg
│   └─ skr_vs_fth_N256_M512.png
├─ cross_param/
│   └─ distance_ratio_N256_M512.png
├─ advantage_analysis/
│   ├─ heatmap_dist_gain_SKR_etac0.5_epsg0.001.svg
│   ├─ heatmap_dist_gain_F_th_0.95_etac0.5_epsg0.001.svg
│   └─ grid_plateau_ratio.svg
├─ threshold_analysis/
│   └─ consolidated_threshold_N_heatmap.svg
└─ eta_c_comparison/
    ├─ manual_advantage_over_fth_distance_N256_M512.png
    └─ max_distance_vs_eta_c_N256_M512.png
```

---

*Last updated: 10 June 2025*
