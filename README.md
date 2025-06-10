# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/4fadf069-aa4f-4a87-aa64-78a09bc7e1dd

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/4fadf069-aa4f-4a87-aa64-78a09bc7e1dd) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/4fadf069-aa4f-4a87-aa64-78a09bc7e1dd) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Plot Metadata Generator

The project includes a build-time script that generates TypeScript metadata for all plot files. This metadata is used by the app to:
- Map file paths to plot types
- Track parameter dependencies
- Generate slider ranges
- Enable/disable controls based on plot type

### Usage

The metadata generator runs automatically during build:
```bash
npm run build
```

To run it manually:
```bash
npm run build:meta
```

The script:
1. Scans the `comparison_plots/` directory for SVG/PNG files
2. Parses filenames to extract parameters (η_c, ε_G, N, M, rule)
3. Generates `src/data/plotMeta.ts` with:
   - Plot metadata array
   - Parameter value lists
   - Dependency matrix

### Testing

Run the test suite:
```bash
npm test
```
