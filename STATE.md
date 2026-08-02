# Verified Current State

Updated: 2026-08-02 — release **0.2 Ancient World Alpha**

## Implemented and locally verified

- A seeded 20 × 14 generated world is the main play surface. Terrain, resources, fog, civilization knowledge, visible coloured territory and tile improvements persist.
- The player, two rival civilizations (Ochre and River), and independent raiders occupy and act in the same world. Rivals research, produce, move, evaluate targets and fight; independent raiders attack every state.
- Cities persist owner, name, population, food/growth, health/defence, territory, worked tiles, buildings and an independent multi-turn unit/building queue. Changing to a different project loses progress; retaining the same project retains it.
- Five producible player roles are available: scout, settler, warrior, archer and worker, plus bronze spearmen. Requirements are data-driven and enforced.
- Deterministic combat includes melee/ranged range, health, damage, retaliation, terrain defence, destruction, city defence and melee capture. The UI provides expected damage before attacks and the chronicle records results.
- Eight prerequisite-linked ancient technologies unlock seven buildings and unit roles. Writing produces the material “City Union” status transition.
- Victory requires four controlled cities and all eight ancient technologies. Loss of all cities is defeat; a result summary records turn, cities, knowledge and battle count. Rivals evaluate the same objective.
- Schema 2 persistence validates the complete campaign: map/territory, units and health, cities/queues, civilization research/resources, AI actors, objective and chronicle. Schema 1 is rejected with a specific safe message because the new multi-civilization topology cannot be faithfully inferred.
- The responsive canvas identifies every role with faction colour, readable letters, city/population marks, health bars, reach overlays, territory borders, improvements and an in-game legend. Object cycling, tabbed contextual panels and narrow stacking keep core controls accessible.

## Verification evidence

- 12 Node domain tests cover deterministic starts, city queues, growth/starvation, founding/territory, production/unlocks, occupancy, melee/ranged combat/destruction/capture, improvements, progression, AI, outcomes and persistence.
- `scripts/smoke.js` deterministically exercises exploration, research, two independent city queues, production, improvement, rival/independent world phases, save/reload, battle, capture and terminal victory.
- Static production build completes in `dist/`; local HTTP launch responds successfully.

## Known 0.2 limitations

- AI is intentionally bounded and tactical rather than expert; there is no diplomacy, trade, alliances or economic specialization yet.
- Territory expands on city growth using a deterministic nearest-tile rule; direct citizen reassignment is deferred.
- One browser save slot is supported. Schema 1 receives an explicit incompatibility message rather than a lossy migration.
- Combat preview is numeric and deterministic; it does not yet visualize every modifier separately.
- Browser automation is unavailable in this container, so the release retains a pending human visual/accessibility pass at desktop and 390 px width.

## Next action

Begin M2 Economy and Diplomacy from `NEXT_MISSION.md`, preserving schema-2 compatibility and the complete terminal campaign.
