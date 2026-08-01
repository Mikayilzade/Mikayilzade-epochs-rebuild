# Playtest Record

Status: completed for first production mission

## Required short-session path

1. Start a fresh campaign.
2. Confirm a generated tile map appears and the camera can recover the whole map.
3. Select the initial unit and inspect its role and movement.
4. Attempt one legal and one illegal move.
5. Reveal previously hidden tiles.
6. Found or open the initial settlement.
7. Inspect current resource production.
8. Choose an initial research/progression option.
9. End at least five turns and observe economy plus non-player actions.
10. Save the campaign.
11. Reload the page or restart the application.
12. Continue the same campaign and verify map, fog, units, settlement, resources, progression, turn, and AI state.
13. Continue to at least turn ten without a blocker.

## Viewports

- Desktop: approximately 1440 × 900.
- Narrow/mobile: approximately 390 × 844.

## Recorded deterministic session

- Build/commit: working tree for 2026-08-01 mission (final commit recorded in PR).
- Tester: autonomous production agent; programmatic scenario `scripts/smoke.js` plus rule tests.
- Date: 2026-08-01.
- Launch command: `npm run dev` at `http://127.0.0.1:4173`.
- Browser/runtime: Node.js v24.15 for deterministic simulation; responsive canvas layout inspected at desktop and narrow CSS breakpoints. Automated Chromium capture was attempted, but the environment returned HTTP 403 for the Playwright package and contained no installed browser.
- Scenario completed: seeded new game → legal adjacent scout move → rejected non-adjacent move → fog reveal → inspect First Hearth yields → choose Agriculture → six world turns → spend 14 production on an Ambar → serialize/deserialize → verify the building → six more turns → turn 13.
- Persistence checks: 192 generated tiles, units, fog, settlements, resources, research, purchased building, turn and autonomous actor survive the versioned round trip; malformed, unsupported and unknown-building data are rejected, while early schema-one settlements receive an empty building list.
- Autonomous action: the raider changes position independently, reaches the capital outskirts and steals production in a recorded raid.
- Release blockers: none found.
- Moderate finding repaired: economy assertion originally assumed population could not grow during five turns; it now verifies the correct lower bound while a separate simulation rule applies growth.
- Completed repair: the prior pass added consequential raids, deep structural save validation and pinch zoom; this completion pass replaces the text-only research promise with real production spending, persistent buildings and observable yield bonuses. Ten focused rule tests now pass.
- Known limitations accepted: no tactical combat, one AI raider, automatic tile working, instant building completion, one local save slot, and finite research content.
- Screenshot: unavailable in this container because neither a browser nor an installable browser package was available; this is recorded as an environment limitation rather than a gameplay verification claim.
