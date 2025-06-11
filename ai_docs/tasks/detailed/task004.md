# Task 004: Plot Metadata Generator ✅

## Goal
Create build script to generate plot metadata TypeScript file.

## Requirements Reference
- FR-20: Build-time scanning
- FR-21: Generate plotMeta.ts
- FR-22: Validation and error handling

## Status
✅ Completed - Implemented in `scripts/generatePlotMeta.ts`

## Implementation Details
- Node.js build script using fast-glob for file traversal
- Parameter extraction via dedicated parsers (parseEtaC, parseEpsilonG, parseN, parseM, parseRule)
- Validation against PARAMETER_VALUES constant
- Plot type mapping via PLOT_TYPE_MAPPING
- Generates src/data/plotMeta.ts with:
  • plotTypes array
  • plotMeta[] with plotType, params, relPath
  • parameterValues and dependencyMatrix exports
- Prettier formatting
- Added "build:meta" script to package.json
- Integrated into main build flow
- Comprehensive test suite in scripts/__tests__/generatePlotMeta.test.ts 