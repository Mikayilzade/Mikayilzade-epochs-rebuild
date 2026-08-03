# Verified Current State

Updated: 2026-08-03 — **experience repair implemented; engineering checks pass; Human Product Gate pending re-test**

## Engineering foundation preserved

- Deterministic generated 20 × 14 map with terrain, resources, fog, territory and improvements.
- Persistent player, two rivals and independent actors.
- Cities with population, growth, health/defence, worked territory, buildings and multi-turn production.
- Scout, settler, warrior, archer, worker and spearman definitions.
- Research, combat, capture, victory/defeat and schema-2 persistence.
- Command-level terminal campaign evidence from the superseded PR #7 branch.

## Human Product Gate result for draft PR #7

Result: **FAIL**.

A real Chrome desktop playtest found:

- map units were perceived as unexplained letters;
- unit roles and actions were not discoverable;
- city interaction did not feel like opening and managing a city;
- the interface exposed values but did not form a clear decision flow;
- the product felt severely limited despite extensive systems in code.

Therefore PR #7 is not an accepted Ancient World Alpha 0.2 release.

## Experience repair implemented

Branch `agent/first-ten-minutes` now adds:

- browser-native vector silhouettes for unit roles;
- distinct city architecture symbols and labels;
- terrain texture/pattern cues, resource marks and improvement marks;
- an owned-object roster with direct selection and camera focus;
- explicit move, attack, found-city, improve-land and wait/defend actions;
- role explanations, health/movement/combat values and blocked-action feedback;
- a city-management panel with growth, yields, defence, buildings and independent production;
- production cost, approximate turns, effect and progress;
- research prerequisites, active progress and unlock descriptions;
- a dynamic first-steps objective tracker;
- richer terrain/entity hover information;
- a real Human Product Gate checklist in `PLAYTEST.md`.

## Engineering verification

A local mirror reconstructed from the actual GitHub branch was tested on 2026-08-03:

- JavaScript syntax checks: pass for main UI, map, controller, world, simulation and persistence modules;
- `npm test`: **19/19 passed**;
- `npm run build`: pass; static `dist/` created;
- local static server: pass;
- HTTP retrieval: pass for `/`, `/src/main.js` and `/src/ui/map.js`.

GitHub Actions were not run.

## Current maturity

`technical prototype — human gate pending`

## Current action

Open one draft PR superseding PR #7, then run a new real-browser first-ten-minute playtest. Do not merge or claim alpha until the Human Product Gate records a pass.
