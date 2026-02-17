# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TWC Vinyl Shelf — a 3D interactive vinyl record shelf built with React and Three.js. Users browse a curated album collection rendered as spines on a wooden shelf, pull out records to view details and liner notes.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server at `http://127.0.0.1:5173` with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | ESLint across all files |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Build + deploy to GitHub Pages |
| `npm run add-album` | Fetch album data from Tidal and add to catalog |

No test framework is configured.

## Architecture

**Tech stack:** React 19, Vite 7, Three.js (@react-three/fiber + drei), GSAP, Zustand. JavaScript only (no TypeScript).

**Deployment:** GitHub Pages at base path `/twc-vinyl-shelf/` via GitHub Actions (Node 22, triggers on push to `main`).

### Source Layout

- `src/components/Scene/` — Three.js 3D components: shelf geometry (2x4 cubby grid), record spines, pull-out animation, lighting
- `src/components/UI/` — DOM overlays: header, liner notes sidebar, about modal, search modal
- `src/stores/` — Zustand stores: `collectionStore` (album catalog + cache), `uiStore` (selected album, overlay visibility)
- `src/hooks/` — `useRecordAnimation` (GSAP pull-out)
- `src/utils/catalog.js` — Single source of truth for the album collection (~480 lines of hardcoded album data with tracks, credits, cover images)
- `src/utils/colors.js` — Hash-based deterministic color assignment per album
- `src/utils/dominantColor.js` — Canvas-based dominant color extraction from album art
- `src/utils/textures.js` — Procedural wood and paper texture generation

### Key Patterns

**State management:** Zustand stores follow `useXxxStore` naming. Access via selectors: `useUiStore((s) => s.selectedAlbumId)`.

**No router:** Single-page app with no React Router. Navigation is entirely state-driven through Zustand (selected album, overlay toggles).

**3D scene:** Full-screen `<Canvas>` with Suspense boundaries for async font loading. OrbitControls with constrained pan/zoom. Record positions calculated deterministically from array index.

**Animations:** GSAP timelines in custom hooks for record pull-out/push-back sequences.

**Album colors:** First attempts dominant color extraction from cover art via canvas sampling, falls back to deterministic hash-based color from album name.

**Adding albums:** Run `npm run add-album` which uses `scripts/fetch-tidal.js` to fetch metadata, then manually add cover images to `public/covers/`.

### Styling

Global CSS with CSS Variables for design tokens (colors, typography) in `src/styles/global.css`. Inline styles for dynamic 3D-related overlays. Fonts: Playfair Display + Space Mono (Google Fonts).
