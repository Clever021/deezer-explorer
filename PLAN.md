# Deezer Explorer — Initial Plan

**Repository:** `deezer-explorer`  
**Working product name:** Deezer Explorer  
**Status:** Initial plan (refinable). No implementation assumptions beyond this document.

---

## Product summary

Deezer Explorer is a **static, responsive website** where users search for an artist by name, pick one match from Deezer’s results, browse that artist’s albums as **cards with cover art**, and open an album to see **tracklist, release date, and cover**. All data comes from **Deezer’s public API (v1)**. There is **no custom backend, authentication, or database**. The intended deployment target is **GitHub Pages**.

---

## Exact v1 scope

**In scope**

- Single primary user flow:
  1. Open the site  
  2. Search for an artist (text query)  
  3. See a list of artist results  
  4. Select one artist  
  5. See that artist’s albums as cards (cover + enough identity to choose an album—typically title; duration/genre are optional only if already in payload and trivial to show)  
  6. Open one album  
  7. See **tracklist**, **album cover**, and **release date**  
- **Mandatory endpoints (Deezer API v1):**
  - `GET https://api.deezer.com/search/artist?q=...`
  - `GET https://api.deezer.com/artist/{id}/albums`
  - `GET https://api.deezer.com/album/{id}`
- **UX / quality bar:** mobile-first layout, usable on larger screens, **keyboard-navigable** for the main flow (focus order, operable controls, visible focus).
- **Engineering constraints:** minimal third-party dependencies, static build output suitable for GitHub Pages.

**Explicit v1 limits (still “in scope” as honest boundaries)**

- **Pagination:** first page of API results only for artist search and for the artist’s album list, unless a later phase explicitly expands this. Empty and error states must still be clear.
- **No** audio playback, user accounts, favorites, sharing, or offline mode.

---

## Initial stack (single direction)

| Layer | Choice |
|--------|--------|
| Tooling / dev server / build | **Vite** (current stable 5.x line) |
| Language | **TypeScript** |
| UI runtime | **Browser-native APIs** (DOM, `fetch`); no React/Vue/Svelte |
| Styling | **Plain CSS** (mobile-first; one or a few files; optional CSS variables for theming) |
| Hosting | **GitHub Pages** (static `dist/` after `vite build`) |

**Why this stack (short justification)**

- **Vite** gives a fast local dev server, a simple `build` → static output, and official patterns for **base URL** (`base` in config), which matters for GitHub Pages project sites (`/deezer-explorer/`).
- **TypeScript** keeps Deezer JSON shapes and UI state explicit with little runtime overhead.
- **No UI framework** keeps dependencies small and the bundle easy to reason about for a three-endpoint product.
- **Plain CSS** avoids CSS-in-JS tooling and extra packages while staying sufficient for a card grid and detail view.

---

## GitHub Pages note

- Configure Vite’s **`base`** to match the Pages URL (typically `/deezer-explorer/` for a project site, or `/` for a user/org root site). Wrong `base` breaks assets and client-side routes if any are introduced later.
- Use **GitHub Actions** (or another documented CI path) to run `npm ci`, `npm run build`, and deploy **`dist/`** to the `gh-pages` branch or **GitHub Pages artifact** workflow—pick one approach in Phase 0 and keep it.
- Deezer responses may include **HTTP-only** image URLs or mixed content rules; validate in a real build on Pages, not only on `localhost`.

---

## Implementation plan — phased (small and testable)

Execution rule for all phases:

- Implement in small PR-sized increments.
- Each increment must target one phase only.
- Do not move to the next phase before acceptance criteria are met.

### Phase 0 — Bootstrap and CORS reality check

**Objective**  
Create the minimum runnable project baseline and validate Deezer access from a browser context that matches production constraints.

**Small increments**

1. Bootstrap Vite + TypeScript project structure.
2. Add scripts contract in `package.json` (`dev`, `build`, `preview`).
3. Run one controlled fetch test for each mandatory endpoint.
4. Record the chosen production data-access strategy based on CORS results.

**Deliverables**

- Minimal app shell renders in browser.
- `package.json` scripts exist and run.
- CORS test notes for:
  - `GET /search/artist`
  - `GET /artist/{id}/albums`
  - `GET /album/{id}`
- Decision note: direct browser calls vs. explicit fallback strategy.

**Acceptance criteria (clear)**

- `npm run dev` starts successfully and renders app shell.
- `npm run build` completes with exit code 0 and outputs deployable `dist/`.
- `npm run preview` serves build output without runtime crash.
- CORS behavior is explicitly documented for all three endpoints.
- One approved production strategy is documented before Phase 1 ends.

**Manual validation**

- Run `dev`, open app, confirm initial shell is visible.
- Run `build` then `preview`, open preview URL, confirm shell renders.
- Execute endpoint fetch tests in browser and capture success/failure states.

**Risks**

- Deezer may block cross-origin requests from GitHub Pages origin.

**Open decisions**

- If CORS fails, decide whether to allow a minimal exception (e.g. serverless proxy) or adjust scope expectations before Phase 2.

---

### Phase 1 — App shell, layout, and navigation skeleton

**Objective**  
Ship a mobile-first UI structure with clear navigation states for search, artist list, album grid, and album details (without full API wiring yet).

**Small increments**

1. Build semantic page structure (`header`, `main`, headings).
2. Add view containers for each step in the user flow.
3. Add state transitions between views (simple and framework-free).
4. Validate keyboard traversal and visible focus styles.

**Deliverables**

- Semantic shell and layout primitives.
- Placeholder state for each user-flow step.
- Keyboard-operable controls to move through shell states.

**Acceptance criteria (clear)**

- At 320px width, no horizontal overflow in primary views.
- At desktop width, layout remains readable and aligned.
- Every interactive control is reachable and operable via keyboard.
- Visible focus indicator appears on all focusable controls.

**Manual validation**

- Keyboard-only pass through all shell controls.
- Resize tests at mobile and desktop widths.

**Risks**

- Over-engineering navigation/routing increases complexity and dependencies.

**Open decisions**

- Whether v1 state is URL-backed (hash/query) or in-memory only.

---

### Phase 2 — Artist search (`/search/artist`)

**Objective**  
Enable artist search and selection with robust loading/empty/error handling.

**Small increments**

1. Add search input + submit interaction.
2. Integrate `GET /search/artist?q=...`.
3. Render artist results list and selectable item state.
4. Add error/empty/loading UI handling.

**Deliverables**

- Search request flow with one artist selection output (`artistId`).
- Artist results list with at least artist name.
- Defensive states for loading, empty data, and network/API failures.

**Acceptance criteria (clear)**

- Valid artist query returns and renders a non-empty list when API has data.
- Selecting a result stores selected `artistId` in app state.
- Empty query or no-results case shows explicit empty-state message.
- Failed request shows explicit error message and allows retry.

**Manual validation**

- Test with common artist name, unknown string, and offline/throttled network.

**Risks**

- Request bursts and rate-limit behavior can degrade UX.

**Open decisions**

- Debounce vs submit-only behavior and cancellation of in-flight requests.

---

### Phase 3 — Album list (`/artist/{id}/albums`)

**Objective**  
After artist selection, show a responsive album card grid with cover images and selection into album details.

**Small increments**

1. Integrate `GET /artist/{id}/albums`.
2. Render album cards (cover + title).
3. Add album selection event to open detail view.
4. Handle loading/empty/error and image fallbacks.

**Deliverables**

- Album list view linked to selected artist.
- Card grid responsive behavior.
- Album selection carrying selected `albumId`.

**Acceptance criteria (clear)**

- First page of albums renders cards when API returns data.
- Missing/broken cover URL does not break layout (fallback behavior exists).
- Selecting an album triggers transition to Phase 4 detail context.
- Empty/error states are visible and non-blocking.

**Manual validation**

- Test artists with many albums and very few albums.
- Simulate image load failure and verify fallback rendering.

**Risks**

- Large cover assets can harm mobile performance.

**Open decisions**

- Whether to display API album types exactly as returned (including duplicates/singles).

---

### Phase 4 — Album detail (`/album/{id}`)

**Objective**  
Display selected album details: cover, release date, and ordered tracklist.

**Small increments**

1. Integrate `GET /album/{id}`.
2. Render hero/summary block (cover + release date).
3. Render ordered tracklist.
4. Implement return path to album list while preserving context.

**Deliverables**

- Album detail screen using real API data.
- Ordered tracklist UI.
- Back navigation preserving selected artist context.

**Acceptance criteria (clear)**

- Track order in UI matches API response order.
- Release date is displayed when available; missing date handled gracefully.
- Back action returns to album list without losing selected artist.
- Long tracklists remain usable on small screens.

**Manual validation**

- Validate albums with short and long tracklists.
- Validate titles with special characters.

**Risks**

- Long lists and large media can impact scroll/focus experience on mobile.

**Open decisions**

- Browser history back vs explicit in-app back control for v1.

---

### Phase 5 — Accessibility, hardening, and GitHub Pages deployment

**Objective**  
Finalize v1 quality baseline and ship reproducible static deployment.

**Small increments**

1. Accessibility pass on the full flow (keyboard + semantics + focus).
2. Resilience pass (error copy, edge states, loading behavior).
3. Configure GitHub Pages deployment with correct Vite `base`.
4. Sync docs (`README.md`) with actual runnable/deploy steps.

**Deliverables**

- Full keyboard-operable flow from search to album detail and back.
- Deployment workflow producing and publishing `dist/`.
- Updated README with real setup and known limitations.

**Acceptance criteria (clear)**

- Full primary flow is keyboard-completable without pointer input.
- Build and deployment process is repeatable from clean clone.
- Live GitHub Pages build serves assets correctly (no broken base path).
- Known CORS and API limitations are documented in README.

**Manual validation**

- Keyboard-only end-to-end run on mobile viewport and desktop.
- Clean-run validation: clone -> install -> build -> preview -> deploy.
- Verify deployed URL behavior on `*.github.io`.

**Risks**

- Production-origin CORS behavior may differ from localhost tests.

**Open decisions**

- Whether to include reduced-motion support in v1 polish scope.

---

## Out of scope for now

- User accounts, playlists, favorites, or persisted history.
- Audio playback or embedding Deezer widgets.
- Search beyond artist search (tracks, albums global search).
- Pagination beyond the first page of each relevant endpoint.
- Internationalization / multiple languages.
- Backend, database, API keys, or OAuth—even as “small” services—**unless** Phase 0 forces a **documented exception** for CORS only.
- PWA, installability, and push notifications.
- Automated E2E test suite (manual validation is enough for v1 per this plan; add tests when the cost/benefit is clear).

---

## Tooling placeholder resolved for this plan

**Chosen tool:** **Vite** — aligns with static output, GitHub Pages, and minimal dependencies while keeping the implementation path concrete. If the team standardizes on another bundler later, replan **Phase 0** only (build output + `base` + CORS spike); the phased feature work stays the same.
