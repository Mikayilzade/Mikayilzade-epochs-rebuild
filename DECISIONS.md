# Material Decisions

## 2026-07-30 — Preserve identity, replace implementation

The old repository is evidence for what the product is, not a requirement to preserve its monolithic architecture. The rebuild may be technically new while retaining the map-strategy core.

## 2026-07-30 — Local identity bundle is sufficient for the next mission

A previous Codex environment received HTTP 403 when attempting cross-repository access. Verified legacy evidence and exact representative source files are therefore stored under `reference/` in this repository. The full old repository remains provenance and optional deeper reference, while the local bundle is mandatory and sufficient to pass the identity gate for the first rebuild mission.

## 2026-07-30 — First mission is a vertical slice

The next mission proves a complete map loop before expanding content. It must include map, fog, units, settlement/economy, progression, autonomous world action, turns, and persistence. Breadth beyond that is deliberately postponed.

## 2026-07-30 — Browser-first delivery

A browser implementation is the default because the legacy game and desired phone/desktop accessibility fit static deployment and fast testing. The production agent may choose the exact browser technology, including a minimal dependency approach, provided architecture and release criteria are met.

## 2026-07-30 — Narrative events are subordinate

Historical events may later enrich the simulation, but they cannot become the primary game loop or replace spatial strategy.

## 2026-08-01 — Dependency-free canvas vertical slice

Use browser-native ES modules, Canvas 2D and Node's built-in test runner. This keeps local launch and static deployment reproducible without a package install while preserving a strict boundary between data, pure simulation, persistence/controller and rendering/input.

## 2026-08-01 — Seeded compact world and deterministic threat

The first mission uses a generated 16 × 12 square grid and deterministic random/AI choices. Compact scale makes ten-turn sessions legible on phones and tests reproducible; map dimensions, terrain and balance remain data-driven and replaceable.

## 2026-08-01 — One validated local save schema

Begin with an explicit version-1 JSON envelope in localStorage and reject malformed/unsupported data without mutating the running game. Multiple campaign slots and migrations are postponed rather than coupling the simulation to a premature storage system.

## 2026-08-01 — Bounded autonomous review repair

Keep the existing architecture and close three quality gaps in one repair pass: validate restored campaigns deeply enough that malformed terrain and out-of-bounds entities cannot reach rendering, support genuine two-pointer camera zoom, and make the autonomous raider affect production when it reaches settlement outskirts. Tactical combat remains explicitly out of scope.

## 2026-08-01 — Research unlocks must be playable, not labels

Agriculture and masonry now unlock production-funded buildings rather than merely announcing future content. Buildings are content data, persist in settlement state and contribute to land-derived income. They complete immediately in this compact slice; a production queue can later replace the purchase timing without changing research, settlement or rendering boundaries.
