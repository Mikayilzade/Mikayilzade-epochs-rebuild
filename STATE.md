# Verified Current State

Updated: 2026-08-02 — **M1 Ancient World Alpha 0.2 release candidate, draft PR #7**

## Implemented

- A deterministic generated 20 × 14 tile world remains the primary interaction surface, with terrain yields/defence, resources, fog, per-civilization knowledge, territory and improvements.
- The player, two rival civilizations and independent raiders use persistent actors in the same world. Rivals research, complete production, create settlers, expand, select threats, fight, capture cities and pursue the shared objective.
- Every city persists owner, name, population, food/growth, health/defence, non-overlapping territory, worked tiles, buildings and its own multi-turn production project/progress.
- The player can produce scouts, settlers, warriors, archers, workers and spearmen. Technology requirements, movement, occupancy, health and role actions are enforced.
- Combat supports legal melee/ranged targets, deterministic preview/damage, ranged no-retaliation, melee retaliation, terrain defence, destruction and melee city capture.
- Eight prerequisite-linked ancient technologies unlock real unit/building choices; Writing changes status to City Union. Victory requires four cities and all eight technologies. Defeat requires loss of all cities and any remaining settler continuation capacity.
- Schema 2 saves deeply validate and preserve the complete world, AI, queues, territory, health, research, chronicle and terminal result. Schema 1 fails safely with a specific incompatibility message.
- The interface shows faction/role symbols, health, territory, legal/illegal/attack overlays, tile hover details, object cycling, per-turn empire output, queue forecasts, combat confirmations, objective progress, onboarding and a terminal summary.

## Release-audit repairs

- Replaced the turn-7 state-forging fixture with a controller-command campaign that reaches real victory on turn 49 without direct state mutation.
- Fixed overlapping same-owner territory during growth, repeated AI buildings, AI founding changing player selection, stale selection after destruction/capture, and premature defeat while a settler can continue.
- Made controller selection ownership-safe and persistence injectable so the same browser command surface can be exercised headlessly through save/reload.
- Strengthened save validation for malformed queues, prerequisites, knowledge, improvements, ownership, allocation, identities, stacking, health, selection and terminal summaries.
- Corrected misleading reachable overlays and aggregate-resource UI; city tiles shared with units and enemy city attacks now remain explicitly accessible.

## Verification evidence

- `npm test`: 17/17 focused tests.
- `npm run smoke`: honest command-level player victory on turn 49 with exploration, multiple queues, production, improvement, rivals, independents, combat, capture, mid-campaign reload and terminal reload.
- `npm run build`, JavaScript syntax checks, local static-server HTTP checks and `git diff --check` pass.

## Accepted 0.2 limitations

- Rival strategy is deterministic and bounded rather than expert; diplomacy/trade remain future roadmap work, not M1 requirements.
- Worked tiles are allocated deterministically rather than assigned manually.
- There is one local browser save slot and schema 1 cannot be losslessly migrated.
- No browser executable is installed in the environment; the desktop/narrow screenshot and human accessibility pass remain explicitly pending.

## Current action

Keep M1 and draft PR #7 active for release acceptance. Do not begin M2 in this repair branch.
