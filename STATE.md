# Verified Current State

Updated: 2026-08-02

## Implemented and locally verified

- A new dependency-free browser implementation presents a seeded, generated 16 × 12 tile world as the primary surface.
- Plains, forests, hills, water and mountains have data-defined yields/passability; some land carries visible resources.
- Per-tile fog is revealed by persistent scouts and settlers. Orthogonal movement spends role-specific movement points and rejects range, impassable terrain, exhausted movement and every occupied destination tile, preventing inaccessible unit stacks.
- The First Hearth settlement has population/development and works local terrain for food, production and knowledge. A settler may found a distant second settlement.
- Agriculture and masonry form a prerequisite research path with visible unlock messages, tribe → settlement → city status, and production-funded Ambar/Quarry construction whose yields affect later turns.
- End turn resolves yields, population development, research, autonomous deterministic raider movement and consequential raids, movement refresh and fog.
- Version 1 JSON saves validate the complete map shape, terrain, resources, entity bounds, identifiers, research prerequisites/progress and building unlock relationships before restoration; missing, malformed and unsupported saves fail safely.
- Canvas camera supports mouse/touch pan, two-finger pinch and wheel/buttons zoom, whole-map fit and selected-unit refocus. The panels reflow for phone widths.
- Twelve pure-rule automated tests and the deterministic turn-13 save/reload smoke scenario pass; the smoke path rejects friendly stacking, researches Agriculture, spends production on an Ambar, restores it, and observes a raid. Chronicle entries are rendered as text rather than restored HTML. Production output is generated in `dist/`.

## Verified legacy state

The original repository is `https://github.com/Mikayilzade/Epohi`.

Verified legacy sources show:

- generated maps with sizes 20, 28, and 36 tiles per side;
- terrain, features, improvements, buildings, units, technologies, rivals, and barbarians;
- fog/reveal state on individual tiles;
- player and rival cities and units;
- tile-based economy with food, production, gold, and science;
- civilization progression from tribe toward settlement, city, kingdom, and empire;
- persistent campaigns, multiple save slots, autosaves, camera persistence, and save-schema migration;
- map camera with pan, pinch, fit-to-map, focus, and deep tile zoom;
- generated persistent unit names and navigation through multiple units on one tile;
- barbarian camps that spawn, are discovered independently, create units, and can return after destruction.

Exact evidence and source references are in `SOURCE_AUDIT.md` and `reference/LEGACY_SOURCE_EVIDENCE.md`.

## Tested boundaries

- Content/configuration: `src/content/`.
- Deterministic world, movement, fog, economy, progression and AI simulation: `src/domain/`.
- Commands and persistence: `src/app/`.
- Canvas/input/camera/panels: `src/ui/` and `src/main.js`.

## Known limitations

- This finite first slice has one hostile actor and no tactical combat resolution; the raider creates map pressure through autonomous movement and production-stealing raids near the capital.
- Settlements automatically work nearby tiles and buildings complete immediately when purchased; citizens and multi-turn production queues remain future work.
- Saves use one local browser slot rather than the legacy multi-slot IndexedDB campaign system.
- The map size is fixed at 16 × 12 for this slice, though its contents are genuinely seed-generated.
- Final art, audio, diplomacy and a long multi-era campaign are outside the mission.
- Automated browser capture was unavailable in the production environment, so a real desktop and narrow-viewport visual pass is still required before merge.

## Best next player action

Run the PR branch locally, verify the desktop layout and core interactions, then inspect camera controls at a narrow viewport. After the visual pass, merge PR #4 if no blocker is found.
