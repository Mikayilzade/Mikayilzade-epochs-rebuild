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
