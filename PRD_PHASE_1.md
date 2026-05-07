# PRD — Deezer Explorer (Phase 1)

## Goal

Deliver a simple, responsive UI shell for the search experience, without real Deezer data.
Users should be able to type an artist name, submit the form, and see placeholder feedback in the results area.

## Scope

- Build a mobile-first page with semantic structure.
- Include these UI blocks:
  - Header
  - Search input area
  - Results area
- Support basic local UI behavior with placeholders only.
- Ensure keyboard accessibility for core controls.

## Out of scope

- API integration of any kind.
- Backend, database, or authentication.
- Real artist/album/track data.
- Album list/detail implementation from later phases.
- Pagination, caching, or advanced routing.

## User flow

1. User opens the page.
2. User sees header, search input, and results area in idle mode.
3. User types an artist name.
4. User submits search (button click or Enter key).
5. UI shows simulated loading.
6. UI shows either mock results or empty state.

## UI states

- **Idle**
  - Default state before a valid search.
  - Example message: "Type an artist name to start."

- **Loading simulated**
  - Temporary feedback right after submit.
  - Example message: "Searching..."

- **Results with mock data**
  - Render a fake list of artist names from local mock data.
  - No network request is performed.

- **Empty state**
  - Show clear feedback when no mock result matches the input.
  - Example message: "No results found."

- **Simple input validation**
  - If input is empty on submit, keep idle state or show a small validation message.

## Acceptance criteria

1. Header, search area, and results area are present and clearly separated.
2. Search can be submitted by button click and Enter key.
3. UI transitions through placeholder states without page reload.
4. No API calls are made; behavior is fully local/mock-based.
5. Core controls are keyboard accessible and have visible focus.
6. Layout is usable on mobile (~320px) and desktop without horizontal overflow.

## Manual validation

- Open the page and confirm all three UI blocks are visible.
- Tab through controls and submit with Enter key.
- Submit non-empty input and confirm simulated loading appears.
- Confirm mock results render for matching input.
- Confirm empty state appears for non-matching input.
- Submit with empty input and verify simple validation/idle behavior.
- Resize to mobile and desktop widths and check layout stability.

