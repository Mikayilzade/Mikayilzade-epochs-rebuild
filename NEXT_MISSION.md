# Active Recovery Mission M1R — First Ten Minutes

Status: **implemented; focused Human Product Gate re-test pending**

## Why this mission exists

The M1 engineering branch implemented many 4X systems and passed automated simulation checks, but a real player still experienced it as a constrained technical demo. Human usability therefore blocks the Ancient World Alpha claim.

This recovery mission preserves the simulation foundation and repairs one coherent product slice: the first ten minutes of map interaction, city management, unit control and outcome understanding.

## Required outcome

Without reading repository instructions, a player must be able to:

1. identify the capital and initial unit roles;
2. inspect the map safely without issuing accidental orders;
3. move units diagonally and select farther reachable destinations;
4. understand automatic route movement and remaining movement points;
5. open and manage a city;
6. compare production choices and understand technology locks;
7. choose research and understand its unlocks;
8. understand worker, settler, melee and ranged actions;
9. inspect enemy city health and defence;
10. understand the shared victory condition and the exact cause of a terminal result.

## Interaction contract

- Ordinary tile clicks inspect only.
- Movement, attack and improvement require an explicit action mode.
- Selection can be cleared visibly and through common cancel controls.
- Eight-direction movement is supported.
- Clicking a farther reachable destination uses pathfinding and spends only available movement.
- Ranged attacks use square/Chebyshev distance so offset targets behave as players expect on a square grid.
- City and enemy inspection expose health, armour, ownership and relevant combat information.

## Visual contract

Current browser-native vector visuals are functional readability assets, not final commercial art. They must distinguish terrain, cities, factions and unit roles at normal zoom. Final illustration, animation, effects and audio remain later roadmap work.

## Outcome contract

- The world panel shows every civilization's progress toward the same objective.
- Victory or defeat states the exact triggering condition.
- The terminal screen shows winner city/technology totals and recent final events.
- A city recapture and a rival victory in the same turn must be causally understandable.

## Required evidence

- JavaScript syntax checks.
- Full domain/controller tests.
- Regression tests for diagonal pathing, multi-cell movement, safe deselection, offset archer range and causal defeat summary.
- Command-level terminal campaign smoke with save/reload.
- Production build.
- Real-browser re-test recorded in `PLAYTEST.md`.

## Current implementation evidence

Local mirror reconstructed from the active branch on 2026-08-03:

- syntax checks passed;
- `node --test`: 24/24 passed;
- command-level smoke reached player victory on turn 47 with all required evidence;
- production build completed;
- GitHub Actions were not run.

## Acceptance

M1R passes only after the repository owner verifies through the permanent GitHub Pages preview that:

- diagonal and multi-cell movement work naturally;
- map inspection cannot spend movement accidentally;
- deselection and cancellation are clear;
- archer offset range matches expectation;
- enemy city HP/armour are visible;
- defeat and victory causality are understandable.

Do not begin M2 or claim Alpha 0.2 until this focused Human Product Gate passes.
