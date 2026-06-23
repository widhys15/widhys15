# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal portfolio site built with Vite + React + TypeScript, hosted on GitHub Pages as a project page at `widhys15.github.io/widhys15/`. Deploys via GitHub Actions (`.github/workflows/deploy.yml`) on push to `main` — there is no "deploy from branch" fallback anymore.

## Commands

- `npm run dev` — Vite dev server (serves at `/widhys15/` base path, matching production).
- `npm run build` — `tsc -b && vite build`, output in `dist/` (gitignored).
- `npm run preview` — serve the production build locally.

## Structure

- `index.html` — Vite entry template, loads `/src/main.tsx`. Fonts (Google Fonts: Archivo display, Hanken Grotesk body, Geist Mono labels) are linked here, not bundled.
- `src/styles/global.css` — the whole design system: a "Gen X Soft Club / after-hours" theme (soft warm-dark `--night` base, muted moss/steel/tan accents, one amber `--signal` used exactly once). All tokens are CSS custom properties; components use class names, not raw colors.
- `src/components/HazeField.tsx` — the signature element: a fixed, drifting moss→steel→tan grain-gradient field behind all content (mounted once in `App.tsx`). All motion respects `prefers-reduced-motion`.
- `src/data/*.json` — content source of truth (`education.json`, `experiences.json`, `projects.json`, `skills.json`), imported at build time (not fetched at runtime). Edit these for content changes.
- `src/types.ts` — shared interfaces for the data shapes above.
- `src/lib/graphSimulation.ts` — pure, framework-agnostic math for the project↔tech force-directed graph (`buildGraphData`, `runForceSimulation`, label-layout geometry). No DOM, no React.
- `src/components/` — one component per page section, plus shared presentational pieces (`CaseStudyRows`, `ProjectLinksOrNote`, `ProjectDetail`, `SectionHeader`, `SlideInItem`/`StaggerItem` reveal wrappers).
- `src/hooks/` — `useInView` (IntersectionObserver reveal), `useCounter` (hero stat count-up), `useScramble` (section-title scramble-reveal), `useTilt` (flagship card 3D tilt), `useNavScrollState` (scroll-spy + header background).
- `public/images/`, `public/data/CV_*.pdf` — static assets served as-is at the same relative paths.

## Vite base path

`vite.config.ts` sets `base: '/widhys15/'` because this is a GitHub **project** page (`widhys15/widhys15`), not the special `<user>.github.io` root-user-site repo. Any place that needs an absolute static-asset path at runtime (e.g. the CV download link) must use `import.meta.env.BASE_URL`, not a hardcoded `/`.

## Deployment

GitHub Actions workflow builds and deploys to Pages on every push to `main`. Repo Settings → Pages → Source must be "GitHub Actions" (not "Deploy from a branch") for this to work.

## Content updates

Edit the relevant file in `src/data/`. `experiences[].logo` and `projects[].image` are both actually rendered (`Experience.tsx`, `ProjectFlagship.tsx`) — unlike the old vanilla version, adding a path here will show up, but the asset must exist under `public/images/`.

## Git workflow

Commit directly to `main` with short, descriptive commit messages. This React migration itself was done on a `react-migration` branch given its size — that's the exception, not a new default; ordinary changes go straight to `main`.
