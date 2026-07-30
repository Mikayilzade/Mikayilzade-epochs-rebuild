# Quality Gate

A mission is ready only when the promised map-strategy experience is usable, not merely described.

## Product identity

- [ ] The map is the primary interaction surface.
- [ ] Player agency is expressed through units, settlements, geography, economy, and turns.
- [ ] Events, tutorials, or text panels support the simulation but do not replace it.
- [ ] The result is recognizably the rebuild described by `VISION.md` and `SOURCE_AUDIT.md`.

## Core loop

- [ ] New game creates a valid, playable state.
- [ ] Unit selection and movement work with clear legal/illegal feedback.
- [ ] Exploration reveals fog correctly.
- [ ] Settlement and economy state visibly change across turns.
- [ ] Research/progression has a real effect.
- [ ] At least one AI-controlled actor advances independently.
- [ ] End turn cannot double-run or leave the UI in a broken intermediate state.
- [ ] A player can complete at least ten turns without a blocker or console error.

## Persistence

- [ ] Save data has an explicit schema version.
- [ ] Save and reload preserve map, units, settlement, economy, progression, turn, and AI state.
- [ ] Invalid or missing saves fail safely.
- [ ] A new game can be started after an old save exists.

## Architecture

- [ ] Domain rules do not depend directly on DOM elements.
- [ ] Content and balance values are stored in data/configuration rather than scattered through rendering code.
- [ ] Rendering, input, persistence, simulation, and content have clear boundaries.
- [ ] Seeded or injectable randomness is available where tests require reproducibility.
- [ ] Future unit attributes and autonomous policies can be added without replacing movement, world, or save systems.

## Interface

- [ ] Map controls work with mouse and touch-capable layouts.
- [ ] Essential information is readable without horizontal page scrolling.
- [ ] Selected unit, current turn, major resources, settlement, and available actions are understandable.
- [ ] Zoom or camera state cannot permanently lose the map.
- [ ] Buttons have accessible labels and disabled states where relevant.

## Verification

- [ ] Unit tests cover movement legality, fog reveal, economy turn resolution, progression, AI turn, and persistence serialization/migration.
- [ ] One smoke scenario covers new game → move → explore → settle/use city → end turns → save → reload.
- [ ] Production build completes.
- [ ] Local server or preview was opened successfully.
- [ ] No release-blocking console errors or missing assets.
- [ ] `git diff --check` or equivalent passes.

## Delivery

- [ ] README contains exact beginner-friendly launch steps.
- [ ] `PLAYTEST.md` records the tested path and findings.
- [ ] `STATE.md` distinguishes implemented, tested, and planned work.
- [ ] Known limitations are honest and specific.
- [ ] One draft PR contains the integrated result.
