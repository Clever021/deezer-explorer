# PRD — Deezer Explorer (Phase 2)

## Goal

Integrate Deezer API artist search into the existing Phase 1 UI so users get real artist results.
The implementation must stay simple, frontend-only, and use `fetch`.

## Scope

- Replace local mock artist data with real data from Deezer API.
- Use `GET https://striveschool-api.herokuapp.com/api/deezer/search/artist?q=${encodeURIComponent(query)}` for search requests.
- Keep current page structure and layout unchanged (`header`, search area, results area).
- Preserve submit interactions (button click and Enter key).
- Render real artist names in the existing results list.
- Handle essential states: loading, results, empty, and error.

## Out of scope

- Any backend, proxy server, database, or authentication.
- Changes to global UI structure or visual redesign.
- Album list/details integration (Phase 3+).
- Pagination, caching, debounce tuning, or advanced routing.
- Extra features beyond artist search (favorites, playback, etc.).

## User flow

1. User opens the page and sees the same Phase 1 layout.
2. User types an artist name.
3. User submits search (button or Enter).
4. App calls Deezer API via `fetch`.
5. UI shows loading feedback while waiting for response.
6. UI shows one of:
   - artist results list (success with data),
   - empty message (success without data),
   - error message (request/network/API failure).

## UI states

- **Loading**
  - Triggered immediately after valid submit.
  - Results list is cleared and status indicates search in progress.
  - Example: "Searching artists..."

- **Results**
  - Triggered when API returns one or more artists.
  - Render artist names in the current results list UI.
  - Status indicates number of results shown.

- **Empty**
  - Triggered when API request succeeds but no artist matches query.
  - Show clear "no results" feedback.
  - Example: "No artists found."

- **Error**
  - Triggered on network failure, API failure, or invalid response handling.
  - Show simple retry-oriented feedback, keeping UI usable.
  - Example: "Could not load results. Try again."

## Acceptance criteria

1. Search uses Deezer API via `fetch` and no local mock dataset for results.
2. Existing UI structure remains unchanged (same main sections and interaction pattern).
3. Search submission works by button click and Enter key.
4. Loading state appears during request lifecycle.
5. Results state renders real artist names when API returns data.
6. Empty state appears when no artist is returned for a valid query.
7. Error state appears for failed requests without breaking the page.
8. No backend or server-side component is introduced.


## Technical notes (minimal)

- Use this public Deezer API proxy for artist search:

  https://striveschool-api.herokuapp.com/api/deezer/search/artist?q=...

- Use `fetch` to request data from this endpoint.
- Parse the JSON response.
- Extract artist names from `response.data`.
- Map `response.data` to an array of artist names.
