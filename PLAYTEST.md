# Playtest Record — Ancient World Alpha 0.2 release audit

Status: **command-level terminal campaign PASS**; desktop/narrow visual inspection remains pending because this container has no browser executable.

## Honest deterministic campaign

- Date/build: 2026-08-02, repaired draft PR #7.
- Seed: `honest-command-campaign`.
- Runtime and command: Node.js v24.15, `npm run smoke`.
- Driver: the public `Controller` command surface used by the browser (`newGame`, `select`, `command`, `save`, `load`). The driver inspects state to choose legal orders, but never edits map, actors, resources, research, health, territory, queues, progress or outcome.
- Result: player victory on turn **49**, inside the intended 40–100-turn release window.
- Terminal summary: 7 player-controlled cities (including conquests), 8 technologies and 106 recorded battle entries.

## Executed path

1. Started a genuinely generated 280-tile world and expanded player visibility with legal scout movement commands.
2. Selected cities and assigned independent multi-turn queues through controller commands.
3. Selected every research through the prerequisite-aware research command.
4. Moved the starting and produced settlers one legal step at a time and founded separated cities through the founding command.
5. Completed buildings, settlers, workers and military units through ordinary end-turn production.
6. Produced a worker, moved it to controlled terrain and created a real tile improvement through the worker command.
7. Observed both rivals completing production and expanding; independent and rival battle actions resolved during normal world turns.
8. Selected military units, approached targets through legal movement, fought battles and captured cities without direct health/owner changes.
9. Saved at turn 20, discarded the in-memory controller state, loaded it through schema-2 persistence and proved exact equality before continuing.
10. Reached the real four-city/eight-technology victory predicate on turn 49, then saved and exactly restored the terminal result.

The smoke test asserts every item above and fails if the game remains non-terminal, terminates outside turns 40–100, omits the second city, production, improvement, rival production/expansion, battle, capture/loss or reload evidence. There is no accelerated fixture and no assignment of victory state in the test.

## Automated release checks

- 17 focused tests cover deterministic starts, controller selection, city queue independence and switching, growth/starvation, founding distance, non-overlapping territory, production completion/prerequisites, occupancy, melee/ranged combat/destruction/capture, worker improvements, technology prerequisites, rival production/research/expansion/combat, both terminal outcomes and deep persistence rejection.
- Schema-2 validation checks technology prerequisites, queue definitions/costs, unique IDs and positions, health/movement bounds, non-overlapping territory, worked-tile allocation, tile ownership/improvements, civilization resources/knowledge, selected ownership and terminal summaries.
- Production build, syntax checks, static server requests and `git diff --check` pass locally.

## Visual/accessibility limitation

No Chromium, Chrome, Firefox or WebKit executable is installed, so a screenshot and real pointer/touch pass cannot be honestly claimed. The repair nevertheless adds legal/illegal/attack overlays, terrain/resource/territory hover feedback, safe city selection when a unit shares its tile, numeric previews for unit and city attacks, accessible camera labels and responsive panels. A human desktop 1440 × 900 and narrow 390 × 844 inspection remains the only pending non-programmatic check before merge.

## Release declaration

Product complete for target gate: **yes**. Mandatory criteria passed: **yes**. Automated checks: **17/17 plus honest turn-49 terminal smoke, build, syntax, server and diff checks**. Release blockers found: **none**. Accepted limitations: bounded deterministic AI, automatic worked-tile allocation, one browser save slot, numeric combat forecast and unavailable local browser visual pass. Save compatibility: schema 2 round-trip; schema 1 safely rejected with an explicit message. Build/package: static `dist/` created.
