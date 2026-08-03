# Epohi Rebuild Agent Contract

Read first:

1. `PROGRAM.md`
2. `VISION.md`
3. `SOURCE_AUDIT.md`
4. `STATE.md`
5. `MISSION.md`
6. `NEXT_MISSION.md`
7. `QUALITY.md`
8. `PLAYTEST.md`
9. `ARCHITECTURE.md`
10. `DECISIONS.md`
11. `reference/LEGACY_SOURCE_EVIDENCE.md`

Also apply Creative Studio 0.4 and `docs/HUMAN_PRODUCT_GATE.md` from `Mikayilzade/creative-studio` when accessible.

## Product identity

1. This is a source-dependent rebuild of `Mikayilzade/Epohi`.
2. Preserve turn-based civilization strategy on a generated tile map with exploration, persistent units/cities, economy, autonomous actors, conflict and era progression.
3. Never replace the spatial strategy with event cards, linear narrative, idle/menu-only play or a cosmetic map.

## Current mission authority

4. The active mission is M1R: first-ten-minute human experience recovery.
5. Preserve useful PR #7 engineering work. Do not expand into diplomacy, later eras or additional content counts.
6. Make reversible visual, interaction, layout and wording decisions independently.
7. Do not ask ordinary questions or return after internal stages.
8. Use at most two complete verification-and-repair cycles.
9. Do not trigger GitHub Actions.

## Human Product Gate

10. A class, configuration entry, test fixture, log line or bot-completed campaign does not prove a human-facing feature.
11. Every core entity needs identity, selection, understandable state, visible actions, blocked-action feedback, consequences and change over time.
12. A real build human test is mandatory before `playable slice`, `alpha` or `release` may be claimed.
13. Without a real passing human test, report exactly: `technical prototype — human gate pending`.
14. A failed human gate must be answered by repairing one coherent experience slice, not by adding more global systems.

## Delivery

15. Update `STATE.md`, `MISSION.md`, `NEXT_MISSION.md`, `QUALITY.md`, `DECISIONS.md` and `PLAYTEST.md`.
16. Deliver one coherent draft PR from `agent/first-ten-minutes`.
17. Preserve honest limitations and stop when the gate passes or bounded repair is exhausted.
