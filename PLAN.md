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

## Implementation plan — phased

### Phase 0 — Bootstrap and CORS reality check

**Objective**  
Prove the project can be built and served as static files **and** establish how the browser will call Deezer (CORS).

**Deliverables**

- `package.json` with scripts: `dev`, `build`, `preview`.
- Minimal Vite + TypeScript app that loads a single screen.
- Documented result of a **browser `fetch`** to the three mandatory endpoints from the **same origin** you will use in production (or an equivalent test: built site on Pages preview / temporary deploy).

**Acceptance criteria**

- `npm run build` produces a directory deployable to GitHub Pages.
- Team agrees on a **single** data-access strategy for production (e.g. direct API if allowed by CORS, or a clearly scoped fallback—see risks).

**Manual validation**

- Run `dev` and `preview`; open built files; confirm no console CORS errors on the chosen strategy.

**Risks**

- **Deezer may not allow cross-origin browser calls** from your GitHub Pages origin. That would break a naive `fetch` plan without a fallback.

**Open decisions**

- If direct browser access fails: whether to allow a **minimal** forwarder (e.g. one serverless function) as an exception to “no backend,” vs. staying strictly static and accepting search-only via a different constraint—**must be decided before Phase 2**.

---

### Phase 1 — App shell, layout, and navigation skeleton

**Objective**  
A responsive **mobile-first** shell with placeholders for search, artist results, album grid, and album detail—navigable in principle without real data.

**Deliverables**

- Landmark regions (e.g. header, main) and heading hierarchy.
- Placeholder views or sections for the four steps after “open site.”
- Basic keyboard path: tab order through interactive elements, skip link optional but desirable if layout grows.

**Acceptance criteria**

- Layout usable at ~320px width and scales to desktop without broken overflow on the shell.
- All interactive shell controls are focusable and activatable with keyboard.

**Manual validation**

- Tab through the entire shell; confirm focus visibility and order.
- Resize viewport across common breakpoints.

**Risks**

- Over-building routing (e.g. heavy SPA router) conflicts with “few dependencies”; prefer simple view switching or very small custom state.

**Open decisions**

- Whether URLs reflect state (query params / hash) for v1 or only in-memory UI state—optional for v1 if it stays single-session and bookmarking is explicitly out of scope.

---

### Phase 2 — Artist search and results (`/search/artist`)

**Objective**  
Wire the search box to Deezer and show **selectable** artist results.

**Deliverables**

- Debounced or submit-triggered request to `GET /search/artist?q=...`.
- Loading, empty, and error UI for search.
- List UI with artist name (and any stable identifier from payload needed for the next call).

**Acceptance criteria**

- Successful query shows at least **name** per result; user can choose **one** artist and the app stores that artist’s `id` for Phase 3.
- Failed network or API error shows a **specific** message (not a blank screen).

**Manual validation**

- Try a common artist name, a nonsense string, and airplane mode / throttled network.

**Risks**

- Rate limiting or intermittent API errors; avoid request storms (debounce / single in-flight request).

**Open decisions**

- Exact debounce timing and whether to cancel in-flight fetches on new input.

---

### Phase 3 — Artist albums (`/artist/{id}/albums`)

**Objective**  
After artist selection, load and display **album cards** with **cover images** and titles.

**Deliverables**

- Call `GET /artist/{id}/albums` using the selected artist id.
- Responsive grid of cards; lazy-loading images if trivial with native `loading="lazy"`.
- Loading / empty / error states.

**Acceptance criteria**

- First API page of albums renders as cards with visible cover art when Deezer provides picture URLs.
- User can open **one** album (navigate to detail—Phase 4).

**Manual validation**

- Artists with many vs. few albums; verify layout with missing or broken images if the API returns edge cases.

**Risks**

- Large images on slow mobile; consider `max-width` / object-fit, not new libraries.

**Open decisions**

- Whether v1 shows duplicate album types (e.g. singles vs. albums) exactly as API returns, with no extra filtering.

---

### Phase 4 — Album detail (`/album/{id}`)

**Objective**  
Show **tracklist**, **release date**, and **large cover** for the chosen album.

**Deliverables**

- Call `GET /album/{id}`.
- Render ordered track list (track number + title; duration optional if in payload).
- Prominent cover and release date field from API (handle missing date gracefully if possible).

**Acceptance criteria**

- Track order matches API order.
- User can return to album list **without** losing the selected artist context (browser back or in-app “back” is enough—pick one behavior and test it).

**Manual validation**

- Albums with one track vs. many; special characters in titles.

**Risks**

- Very long tracklists on small screens—ensure scroll and focus management remain sane.

**Open decisions**

- “Back” behavior: native history vs. explicit button only.

---

### Phase 5 — Accessibility pass, polish, and Pages deployment

**Objective**  
Meet the v1 accessibility bar for the main flow and ship a reproducible GitHub Pages deploy.

**Deliverables**

- Focus styles, `aria-live` for async search results where appropriate, button vs. link semantics for actions, alt text strategy for covers (decorative vs. informative—document choice).
- README section: local dev, build, deploy, and **known CORS / API limitations**.
- CI workflow (or exact manual steps if CI deferred—prefer CI) publishing `dist/`.

**Acceptance criteria**

- Full flow completable with **keyboard only** (search → pick artist → pick album → read detail → go back).
- Lighthouse or manual checklist documented (no need to hit a numeric score target in this plan—only that checks were run and critical issues fixed).
- Live GitHub Pages URL runs the same flow as local `preview` with correct `base`.

**Manual validation**

- Keyboard-only run-through on mobile viewport emulation and one real device if available.
- Fresh install: clone → `npm ci` → `build` → success.

**Risks**

- Last-minute CORS differences between `localhost` and `*.github.io`.

**Open decisions**

- Optional: `prefers-reduced-motion` for any transitions added in polish.

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
