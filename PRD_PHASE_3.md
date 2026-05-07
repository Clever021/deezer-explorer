# PRD — Deezer Explorer (Phase 3)

## Goal

After the user selects an artist, load and display that artist's albums from Deezer API in a simple, responsive album card list.

## Scope

- Use Deezer endpoint `GET /artist/{id}/albums` to fetch albums for the selected artist.
- Keep the current UI structure and navigation flow from previous phases.
- Render album cards with:
  - cover image;
  - album title.
- Add album selection behavior (user can click/select an album card to continue flow).
- Handle loading, empty, and error states for album list requests.
- Add image fallback behavior when album cover fails to load.
- Keep implementation frontend-only and simple.

## Out of scope

- Backend, proxy server, database, authentication, or any server component.
- UI redesign or structural changes to the existing layout.
- Album details/tracks rendering (Phase 4).
- Pagination, caching, filtering, sorting, or advanced routing.
- Any feature outside the core flow (favorites, playback, sharing, etc.).

## User flow

1. User searches and views artist results (already available from Phase 2).
2. User selects one artist.
3. App requests albums using `GET /artist/{id}/albums`.
4. UI shows loading while request is in progress.
5. UI displays one of:
   - album cards (success with data),
   - empty message (success with no albums),
   - error message (request failure).
6. User selects one album card to continue to the next phase flow.

## UI states

- **Loading**
  - Triggered after artist selection and before albums response completes.
  - Show clear loading feedback and keep layout stable.

- **Results**
  - Triggered when API returns one or more albums.
  - Render album cards with cover image and title.
  - Cards must be selectable.

- **Empty**
  - Triggered when request succeeds but album list is empty.
  - Show explicit "no albums found" feedback.

- **Error**
  - Triggered on network/API failure.
  - Show clear, non-blocking error message and keep UI usable.

- **Image fallback**
  - Triggered when an album cover image fails to load.
  - Replace broken image with a safe placeholder/fallback visual without breaking card layout.

## Acceptance criteria

1. After selecting an artist, the app requests albums with `GET /artist/{id}/albums`.
2. Album list renders as cards showing cover image and album title.
3. Album cards are selectable and trigger album selection behavior.
4. Loading state appears during request lifecycle.
5. Empty state appears when API returns no albums.
6. Error state appears when request fails, without crashing the page.
7. Image fallback prevents broken-image layout issues.
8. Existing UI structure remains unchanged (no redesign).
9. No backend/server component is introduced.
