# Plot Metadata Generator

## Goal
Create a build-time Node.js script that scans SVG files and generates a TypeScript file containing plot metadata and dependency information.

## High Level Description
- Create a Node.js script that runs during build time
- Scan all SVGs in `public/repeater_protocol/comparison_plots/**`
- Parse filenames to extract parameters (η_c, ε_G, N, M, rule)
- Generate `src/data/plotMeta.ts` with:
  - Array of plot records with type, params, and relative path
  - Dependency matrix as TypeScript constants
- Implement error handling for invalid file names
- Add script to package.json as `build:meta`

## Key Requirements Reference
- FR-20, FR-21, FR-22
- NFR-05 (CI build time constraint) 