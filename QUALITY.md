# Quality Gate

A mission is ready only when the promised map-strategy experience is usable, not merely described.

## Product identity

- [ ] The map is the primary interaction surface.
- [ ] Player agency is expressed through units, settlements, geography, economy and turns.
- [ ] Events, tutorials or text panels support the simulation but do not replace it.
- [ ] The result is recognizably the rebuild described by `VISION.md` and `SOURCE_AUDIT.md`.

## Safe map interaction

- [ ] Ordinary tile inspection cannot spend movement or trigger combat.
- [ ] Move, attack and improve are explicit modes with visible valid targets.
- [ ] Selection can be cleared with a visible control and common cancel interactions.
- [ ] Eight-direction movement works.
- [ ] A farther destination uses pathfinding and spends no more than the unit's current movement.
- [ ] Invalid or unreachable destinations explain why.
- [ ] Camera pan/zoom and map inspection remain usable while nothing is selected.

## Units and combat

- [ ] Unit roles are distinguishable at normal zoom.
- [ ] Role, health, movement, strength and range are visible.
- [ ] Melee and ranged rules match the grid's spatial model.
- [ ] Offset ranged targets use square/Chebyshev distance.
- [ ] Enemy units and cities expose health and relevant defence before commitment.
- [ ] Attack confirmation shows expected damage and retaliation.
- [ ] City capture and recapture are recorded clearly.

## Cities and progression

- [ ] Any owned city can be selected from map and roster.
- [ ] Population, growth, yields, defence, buildings and queue are understandable.
- [ ] Production cards show cost, turns and effect.
- [ ] Locked projects name the required technology.
- [ ] Each city manages its own queue.
- [ ] Research prerequisites, progress and unlocks are understandable.

## Victory and defeat

- [ ] The shared victory condition is visible before the game ends.
- [ ] Every civilization's progress toward the objective is visible.
- [ ] Loss of all continuation capacity is explained distinctly from rival objective victory.
- [ ] Terminal result states the exact trigger, winner progress and final events.
- [ ] A player can explain why the game ended without reconstructing hidden AI actions.

## Persistence

- [ ] Save data has an explicit schema version.
- [ ] Save/reload preserve map, units, cities, queues, progression, outcome and a cleared selection.
- [ ] Invalid or missing saves fail safely.
- [ ] A new game can be started after an old save exists.

## Architecture

- [ ] Domain rules do not depend directly on DOM elements.
- [ ] Content and balance values are stored in data/configuration.
- [ ] Rendering, input, persistence, simulation and content have clear boundaries.
- [ ] Pathfinding and range rules are testable without Canvas.
- [ ] Future art can replace current vector rendering without rewriting simulation.

## Verification

- [ ] Tests cover diagonal/multi-cell pathing, reachability, offset ranged combat and safe deselection.
- [ ] Tests cover city queues, progression, combat, AI, victory/defeat and persistence.
- [ ] A command-level smoke reaches a terminal result without direct state forging.
- [ ] Production build completes.
- [ ] Real GitHub Pages preview opens successfully.
- [ ] No release-blocking console errors or missing assets.

## Human Product Gate

- [ ] A real player completes a focused re-test from the browser build.
- [ ] The player can inspect tiles safely.
- [ ] Movement and ranged combat match spatial expectations.
- [ ] City combat state is readable.
- [ ] The player understands the exact cause of victory or defeat.
- [ ] `PLAYTEST.md` records pass/fail with actual observations.

## Delivery

- [ ] README contains the permanent preview link and local launch steps.
- [ ] `STATE.md` distinguishes implemented, tested and human-accepted work.
- [ ] Known limitations are honest and specific.
- [ ] One draft PR contains the integrated result.

Pending or failed Human Product Gate blocks merge and any alpha/release claim.
