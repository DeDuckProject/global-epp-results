# Repeater-Protocol Simulation Plot Explorer

A static, client-side React application for interactively exploring pre-computed SVG plots of quantum-repeater simulations.

**Live App**: [https://deduckproject.github.io/global-epp-results](https://deduckproject.github.io/global-epp-results)

**Key Features:**
- **Interactive Exploration**: Use sliders and dropdowns to select parameters and view corresponding simulation plots.
- **Lazy Loading**: SVGs are loaded on-demand to keep the initial application lightweight.
- **Deep Linking**: Share specific plot configurations via URL query parameters.
- **Parameter-aware UI**: UI controls are automatically enabled or disabled based on the selected plot type.

## Tech Stack

This project is built with modern web technologies:

- **Framework**: [React 18](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## Quickstart / Local Development

To run this project locally, you'll need [Node.js](https://nodejs.org/en/) (v18 or higher is recommended).

```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The application will be available at `http://localhost:8080` (or the next available port).

## Build & Metadata Generation

The project includes a build-time script that generates TypeScript metadata for all plot files. This is a crucial step that catalogues all plots and their parameters.

### How it works

The script (`scripts/src/generatePlotMeta.ts`) scans the `public/comparison_plots/` directory for SVG/PNG files and parses their filenames to extract parameters (`η_c`, `ε_G`, `N`, `M`, `rule`). It then generates `src/data/plotMeta.ts`, which exports:

- A metadata array for all plots.
- Lists of unique parameter values for sliders.
- A dependency matrix that maps plot types to the parameters they depend on.

The build process will fail with an error if any plot filename does not match the expected format, ensuring data integrity.

### Commands

The metadata generation is part of the standard build process.

```bash
# To generate metadata manually
npm run build:meta

# To build the full application for production
npm run build
```

## Testing

The project uses [Vitest](https://vitest.dev/) for unit and component testing.

```bash
# Run the test suite
npm test
```

Please ensure all tests pass before submitting a pull request. New features must include corresponding tests.

## Deployment

The `npm run build` command creates a `dist/` directory with all the static assets for the application. You can deploy this directory to any static web hosting service, such as:

- [GitHub Pages](https://pages.github.com/)
- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)

## Citation

This project is supplementary material for the paper "Advantages of Global Entanglement-Distillation Policies in Quantum Repeater Chains" (DOI to be added).

If you use this software, please cite it using the metadata in [`CITATION.cff`](./CITATION.cff). The project is archived on Zenodo:

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.17292576.svg)](https://doi.org/10.5281/zenodo.17292576)

## Further Reading

For more detailed information about the project's architecture and requirements, please see:

- [**High-Level Proposal**](./ai_docs/proposal.md)
- [**Technical Requirements**](./ai_docs/requirements.md)
