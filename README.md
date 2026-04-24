# Deezer Explorer

Deezer Explorer is a static, responsive web project focused on one core experience: search for a music artist, browse that artist's albums, and open an album to see its tracklist, cover, and release date using Deezer's public API.

## What this project will deliver in v1

Version 1 delivers a single end-to-end user flow:

1. Open the website
2. Search for an artist by name
3. View artist search results
4. Select one artist
5. View that artist's albums as cover cards
6. Open one album
7. View album details (tracklist, cover, release date)

Scope constraints for v1:

- No custom backend
- No authentication
- No database
- Mobile-first and responsive UI
- Keyboard-accessible main flow
- Minimal dependencies
- Static hosting on GitHub Pages
- First page of API results only (no pagination yet)

## Core Deezer API endpoints

The app's v1 flow is built around these endpoints:

- `GET https://api.deezer.com/search/artist?q=...`
- `GET https://api.deezer.com/artist/{id}/albums`
- `GET https://api.deezer.com/album/{id}`

## Chosen stack (from `PLAN.md`)

- **Tooling/build/dev server:** Vite (5.x line)
- **Language:** TypeScript
- **UI runtime:** Browser-native APIs (DOM + `fetch`), no UI framework
- **Styling:** Plain CSS (mobile-first)
- **Hosting:** GitHub Pages (static `dist/` from `vite build`)

Why this direction:

- Fast local iteration with Vite
- Clear static output for GitHub Pages
- Small dependency footprint
- Explicit API data handling with TypeScript

## Current repository status

Current status is **planning only**.

- `PLAN.md` exists and is the source of truth for initial scope and phases.
- Product implementation has **not started yet**.
- There is no running app, no finalized build pipeline, and no deployed Pages site at this moment.

## Local development (target workflow)

This is the expected workflow once Phase 0 bootstrap is completed.

### Prerequisites

- Node.js 20+
- npm 10+

### Commands

- Install dependencies: `npm ci`
- Start dev server: `npm run dev`
- Build static output: `npm run build`
- Preview production build locally: `npm run preview`

Note: these scripts are planned in Phase 0 and may not all be available until the initial setup is implemented.

## GitHub Pages publishing plan

Deployment target is GitHub Pages using Vite build output.

Planned deployment behavior:

- Build static files with `npm run build`
- Publish `dist/` through GitHub Actions (preferred) or an equivalent documented process
- Configure Vite `base` correctly for project pages (typically `/deezer-explorer/`)

Important:

- Incorrect `base` will break assets in Pages.
- Pages validation must be done on the real deployed origin, not only on localhost.

## Known risks and limitations

- **CORS risk:** Deezer may block direct browser requests from the final GitHub Pages origin.
- **Network/API variability:** intermittent errors and rate limiting must be handled with clear UI states.
- **Image/content edge cases:** missing covers or mixed-content URL behavior may affect rendering.
- **Current limitation:** no pagination in v1 (first API page only).

## Immediate next steps

Based on the implementation phases in `PLAN.md`, the next concrete actions are:

1. Execute **Phase 0** bootstrap (Vite + TypeScript project setup with `dev/build/preview` scripts).
2. Validate Deezer endpoint access from browser context with production-like origin assumptions.
3. Decide and document one production-safe data access strategy, especially if CORS blocks direct calls.
4. Build **Phase 1** app shell (mobile-first layout + keyboard navigable structure).
5. Continue with Phases 2-5 in order: search, album list, album detail, accessibility/polish/deployment.

## Out of scope for now

- User accounts, playlists, favorites, or persisted history
- Audio playback
- Global track/album search beyond artist search flow
- Pagination beyond first page
- i18n/multi-language support
- PWA/offline/push notifications
- Automated E2E suite in v1

---

For implementation details, decision points, and phase-level acceptance criteria, see `PLAN.md`.