# Parameter Panel Component

## Goal
Create a responsive parameter panel component that handles user input for plot parameters with proper state management and accessibility.

## High Level Description
- Create reusable slider components for η_c, ε_G, N, M
- Create rule selector dropdown
- Implement parameter state management using Context + Reducer
- Add throttling/debouncing for parameter changes (≥150ms)
- Implement visual feedback for locked/dimmed parameters
- Ensure keyboard navigation and ARIA labels
- Sync parameter state with URL query string
- Handle parameter validation and fallbacks

## Key Requirements Reference
- FR-10, FR-11, FR-12, FR-13, FR-14
- FR-40 (Accessibility)
- NFR-01 (Performance) 