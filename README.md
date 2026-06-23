# Personal Portfolio (GitHub Pages)

Portfolio site for I Dewa Gde Widhy Suryana. Built with Vite, React, and TypeScript. Content is data-driven from JSON files under `src/data/`. Deploys to GitHub Pages via GitHub Actions on push to `main`.

## Structure
- `src/components/` — one component per page section
- `src/hooks/` — reveal/counter/scramble/tilt/scroll-spy behavior
- `src/lib/graphSimulation.ts` — project↔tech force-graph math
- `src/data/` — content (education, experiences, projects, skills)
- `public/images/` — profile photo, logos, project images
- `public/data/` — CV PDF

## Content Updates
Edit the JSON files in `src/data/`:
- `education.json`
- `experiences.json`
- `projects.json`
- `skills.json`

## Local Development
```
npm install
npm run dev
```

## Build
```
npm run build
```
Output goes to `dist/` (gitignored).

## Deployment
Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages. Repo Settings → Pages → Source must be set to "GitHub Actions".
