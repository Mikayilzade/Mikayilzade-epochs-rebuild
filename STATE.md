# Verified Current State

Updated: 2026-08-03 — **second human playtest completed; focused interaction repair implemented; Human Product Gate pending re-test**

## Engineering foundation preserved

- Deterministic generated 20 × 14 map with terrain, resources, fog, territory and improvements.
- Persistent player, two rivals and independent actors.
- Cities with population, growth, health/defence, worked territory, buildings and multi-turn production.
- Scout, settler, warrior, archer, worker and spearman definitions.
- Research, combat, capture, victory/defeat and schema-2 persistence.
- Command-level terminal campaign evidence.

## Human Product Gate history

### Draft PR #7

Result: **FAIL**.

The first real Chrome playtest found unexplained letter tokens, weakly discoverable actions, decorative-feeling cities and no clear action → consequence loop.

### Draft PR #8 — first experience-repair test

Result: **meaningful improvement, not yet a pass**.

The player reported:

- city production and science dependencies were understandable and enjoyable;
- archers felt useful;
- the campaign reached a real terminal result;
- movement and inspection remained unsafe or too restricted;
- defeat causality and enemy city combat state were unclear.

## Focused interaction repair now implemented

- eight-direction movement;
- automatic pathfinding to farther reachable tiles;
- partial route movement when a destination exceeds current movement points;
- explicit action modes so ordinary map clicks inspect rather than issue orders;
- visible deselection plus repeated-click, Escape and right-click cancellation;
- square/Chebyshev ranged combat, matching the player's expected two-by-one archer range;
- map-level enemy city health bars and HP/armour labels;
- detailed enemy unit/city inspection messages;
- required technology named on locked production projects;
- visible progress of all civilizations toward the shared victory objective;
- terminal summaries with exact cause, winner city/technology totals and final events;
- worked-tile trimming after starvation to keep save state valid.

## Engineering verification

Local mirror reconstructed from the actual branch files on 2026-08-03:

- JavaScript syntax checks: pass for main UI, map, controller, world, simulation and persistence modules;
- `node --test`: **24/24 passed**;
- command-level campaign smoke: player victory on turn **47** with all required evidence;
- production build: pass; static `dist/` created;
- GitHub Actions were not run.

## Graphics maturity

Current browser-native vector assets are functional readability art. Final character art, animation, effects, audio and commercial visual polish are intentionally later work, but symbols must remain distinguishable enough to pass the current Human Product Gate.

## Current maturity

`technical prototype — focused human re-test pending`

## Current action

Publish the latest `agent/first-ten-minutes` head to the permanent `preview` branch, then re-test diagonal/path movement, safe inspection, deselection, archer range, enemy city status and exact terminal reasoning. Do not merge or claim alpha until the Human Product Gate records a pass.
