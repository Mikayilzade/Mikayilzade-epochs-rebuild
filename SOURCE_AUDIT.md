# Source Audit — Epohi Rebuild

Audit date: 2026-07-30

Gate status: **PASS for product identity and the first rebuild mission**

## Files actually inspected for the 2026-08-01 production mission

Before design and implementation the mission opened in full: `AGENTS.md`, `VISION.md`, `SOURCE_AUDIT.md`, `STATE.md`, `MISSION.md`, `QUALITY.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `PLAYTEST.md`, `reference/LEGACY_SOURCE_EVIDENCE.md`, and every file in `reference/legacy-snapshot/` (`config.js`, `economy.js`, `progression.js`). `README.md` was also inspected.

The seven requested Creative Studio 0.3.0 paths were requested from the upstream raw GitHub repository on 2026-08-01; each returned HTTP 403. Per the mission contract this did not block production, and the local identity bundle remained authoritative and sufficient.

## Delivered-source mapping

- Generated square tiles, per-tile fog, terrain and resources preserve the verified spatial world model.
- Persistent role-based units, settlements, land-derived yields, technology/status progression and a moving raider preserve the verified core simulation loop.
- A schema-versioned browser save and recoverable camera preserve the campaign and mobile map intent without copying the legacy monolith or its storage implementation.

## Mission classification

Source-dependent rebuild of an existing game.

Legacy repository:

`https://github.com/Mikayilzade/Epohi`

Target repository:

`https://github.com/Mikayilzade/Mikayilzade-epochs-rebuild`

## Access history

A first Codex task could write to the target repository but received HTTP 403 when trying to clone or inspect the studio and legacy repositories. It then created an unrelated linear event-card game. That implementation was rejected and its PR was closed.

To prevent a repeat, this target repository now contains a verified local identity bundle under `reference/`. The next agent must inspect that bundle before implementation. Direct access to the full legacy repository is useful but not required merely to determine product identity.

## Representative sources inspected during preparation

| Source | Ref / blob | Verified evidence |
|---|---|---|
| `Mikayilzade/Epohi/src/config.js` | `main`, blob `01812f07f54b0c348a0a820e249403d4c9ce813c` | map sizes 20/28/36; game and save-schema versions; campaign/save stores; camera persistence and zoom configuration |
| `Mikayilzade/Epohi/src/app.js` | `main`, blob `978c79b275e6220c0a7a05914896c550d7bf900d` | terrain/features/improvements/buildings/units/tech data; generated map; revealed tiles; units, cities, rivals, barbarians; map camera; turn-state application |
| `Mikayilzade/Epohi/src/economy.js` | `main`, blob `c5f7fec5f095aae39ae885e8deb7d8f12c8960ac` | terrain/improvement/feature yields and combined city/settlement income |
| `Mikayilzade/Epohi/src/progression.js` | `main`, blob `effc4657bbf600f2db8718a08d7a56c1be449298` | progression labels and thresholds from tribe through settlement, city, kingdom, and empire |
| `Mikayilzade/Epohi/.github/codex/task-queue.md` | `main`, blob `8adfb64a772471dc5a1ccce4db78fab97d654a3e` | preserved gameplay refactors; stack navigation; persistent generated unit names; camera 2.0 requirements |
| `Mikayilzade/Epohi` PR #68 | merged commit `e7fd3fc8154ef427b3479de49d82cd8d3c5a704f` | dynamic fit-to-map and deep tile zoom while preserving pinch, pan, focus, persistence, resize, and tile clicking |

Exact small legacy source files are copied under `reference/legacy-snapshot/`. A structured evidence summary is in `reference/LEGACY_SOURCE_EVIDENCE.md`.

## Verified product category

Turn-based civilization strategy on a generated tile map, designed for browser play on desktop and mobile.

## Verified core loop

- inspect and navigate a spatial map;
- select and move persistent units;
- reveal fog and discover map content;
- operate cities/settlements and improvements;
- generate food, production, gold, and science;
- research technologies and advance civilization status;
- end the turn;
- resolve rivals, barbarians, camps, economy, and world changes;
- save and continue an ongoing campaign.

## Main entities and systems

- map tiles with terrain, reveal state, features, improvements, points of interest, cities, and camps;
- player units and multiple units on one tile;
- player cities and settlements;
- rival civilizations with cities, units, exploration, and independent visibility;
- barbarian units and persistent/reappearing camps;
- terrain yields and city/empire income;
- technologies and era/progression state;
- campaign/save records and camera state.

## Spatial and interaction model

- square tile grid;
- generated maps with selectable sizes;
- camera pan, zoom, pinch, focus, and whole-map fit;
- fog/reveal tracked per tile;
- tile inspection and contextual actions;
- responsive desktop/mobile interface.

## Non-negotiable identity traits

1. The map is the main game surface.
2. Units, settlements, geography, economy, research, and turns form the core loop.
3. The world contains independently acting rivals and threats.
4. Exploration and visibility matter.
5. Campaign state persists.
6. Progression represents the development of a civilization.
7. Narrative events may supplement but may not replace the simulation.

## Reusable prior decisions

- browser-first delivery;
- generated tile maps and fog;
- persistent campaign/save schema;
- responsive camera with whole-map recovery;
- data definitions for terrain, improvements, units, buildings, technologies, AI, and balance;
- stable identity for units;
- independent camp/rival discovery and world processing.

## Legacy constraints explicitly rejected

- one very large application module as the main architecture;
- implementing new systems by adding more global mutable logic to that monolith;
- preserving exact visuals, balance, storage details, or every feature in the first vertical slice;
- treating the old code as more authoritative than the product identity and current `VISION.md`.

## Authorized major changes

- complete rewrite and new module structure;
- new rendering approach and visual language;
- revised balance and content;
- smaller first feature set;
- cleaner state, command, simulation, AI, persistence, and UI boundaries;
- testable deterministic systems;
- future-ready seams for unit attributes and autonomous policies.

## Identity test answers

1. **What kind of product is this?** A compact turn-based civilization strategy on a generated map.
2. **What does the player repeatedly do?** Explore, direct units, develop settlements and economy, research, end turns, and react to an independently changing world.
3. **What are the main entities?** Tiles, units, settlements/cities, civilizations, technologies, resources, improvements, camps, and barbarian/rival actors.
4. **What makes it itself?** A mobile-friendly civilization simulation where geography, persistent entities, autonomous world action, and gradual era development combine in one map loop.
5. **Which major changes are authorized?** Architecture and implementation may be replaced; product identity may not.

## Agent completion requirement

Before implementation, append the local files actually opened. In the final report, name those files and explain how the delivered loop preserves this audit.

## M1 source-dependent implementation audit — 2026-08-02

The M1 mission opened in full the required program documents (`AGENTS.md`, `PROGRAM.md`, `AUTONOMOUS_CAMPAIGN.md`, `VISION.md`, this audit, `STATE.md`, `ROADMAP.tsv`, `NEXT_MISSION.md`, `RELEASE_GATES.md`, `QUALITY.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `PLAYTEST.md`), `reference/LEGACY_SOURCE_EVIDENCE.md`, and every file in `reference/legacy-snapshot/`. It also inspected the complete 0.1 source, tests, scripts, HTML, package metadata and README before production.

Ancient World 0.2 extends, rather than substitutes, the verified legacy loop: generated tiles and per-civilization knowledge drive exploration; persistent named cities work controlled terrain and production queues; role-based units move and fight spatially; two rival civilizations and independents process world turns; technologies cause concrete unlocks/status change; and schema-2 saves preserve a finishable campaign. The local evidence bundle remains sufficient and no unsupported genre or identity change was made.

## M1 release-audit repair mapping — 2026-08-02

The audit repair preserves the same source-dependent mapping while replacing synthetic evidence with play-surface commands. The deterministic turn-49 campaign selects and moves persistent units, founds cities at legal map positions, works controlled terrain, completes queues and research, resolves autonomous rival/independent turns, fights and captures spatial targets, and resumes the same versioned campaign twice. Territory exclusivity, civilization knowledge and full campaign persistence are now validated rather than merely assumed. M1 remains the active roadmap row until draft PR #7 is accepted; no M2 system was introduced.
