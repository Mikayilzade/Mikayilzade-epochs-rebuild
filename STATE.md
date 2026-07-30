# Verified Current State

Updated: 2026-07-30

## Repository state

- This repository is the clean target for a new implementation of `Эпохи`.
- The previous PR that implemented a linear 12-event narrative game was rejected and closed because it changed the product identity.
- No product implementation from that PR is canonical.
- Control files and a local legacy evidence bundle are being established before the next Codex production mission.

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

## What is ready

- Product identity is locked in `VISION.md`.
- The first finite rebuild mission is defined in `MISSION.md`.
- Release criteria are defined in `QUALITY.md`.
- Architecture boundaries are defined in `ARCHITECTURE.md`.
- Local source evidence is available under `reference/`, so the next agent does not need cross-repository cloning merely to understand what game this is.

## Known limitations

- The complete legacy repository has not been copied here.
- The local bundle is intended to preserve identity and representative system behaviour, not to force reuse of legacy architecture.
- Exact legacy balance values and every old feature are not mandatory for the first rebuild mission.

## Next action

Merge the setup PR, then run one Codex mission from this repository using the short prompt supplied by Creative Studio. The agent must build the first map-strategy vertical slice and must not reinterpret the genre.
