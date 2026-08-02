# Playtest Record

Status: automated path completed; real-browser visual pass pending

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

- Build/commit: PR #4 branch `codex-deuqq4`; final stacking fix added on 2026-08-02.
- Tester: autonomous production agent plus final focused local rule verification.
- Date: 2026-08-02.
- Launch command: `npm run dev` at `http://127.0.0.1:4173`.
- Browser/runtime: the production agent used Node.js v24.15 for deterministic simulation. Automated Chromium capture was unavailable because the environment returned HTTP 403 for Playwright and contained no installed browser.
- Scenario completed: seeded new game → reject movement onto the friendly settler → legal move to an empty adjacent tile → reject a non-adjacent move → reveal fog → inspect First Hearth yields → choose Agriculture → six world turns → spend 14 production on an Ambar → serialize/deserialize → verify the building → six more turns → turn 13.
- Persistence checks: 192 generated tiles, units, fog, settlements, resources, research, purchased building, turn and autonomous actor survive the versioned round trip; malformed, unsupported and unknown-building data are rejected, while early schema-one settlements receive an empty building list.
- Autonomous action: the raider changes position independently, reaches the capital outskirts and steals production in a recorded raid.
- Automated release blockers: none found in the focused rule and smoke path.
- Final focused fixes: restored research/building invariants are validated; chronicle entries use text nodes; occupied destination tiles are rejected so one player unit cannot hide another in an inaccessible stack.
- Verification result: 12 focused Node rule tests passed; the updated turn-13 smoke scenario passed; syntax checks passed for the changed world, test and smoke files.
- Known limitations accepted: no tactical combat, one AI raider, automatic tile working, instant building completion, one local save slot, and finite research content.
- Pending manual check: open the game in a real desktop browser, inspect layout and controls, then repeat the basic camera interaction at a narrow/mobile viewport before merge.
