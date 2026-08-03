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

## 2026-08-02 — Compact shared-rules Ancient World

Use a 20 × 14 seeded map and one serializable actor model for the player, two rivals and independent peoples. Rivals use the same city yields, research, production, movement, health and objective state as the player; their strategy is deliberately deterministic and bounded so campaign checks remain reproducible.

## 2026-08-02 — Territory, queues and combat are domain state

Cities explicitly own territory indices, worked indices, food, defence and one multi-turn queue. Switching away loses progress while reselecting the same project retains it. Combat is deterministic: strength against terrain-adjusted defence yields damage, melee retaliation applies, ranged attacks beyond adjacency avoid retaliation, and only melee captures a city. These rules remain independent of Canvas and DOM code.

## 2026-08-02 — Objective combines expansion and knowledge

Ancient victory requires control of four cities and completion of all eight technologies. This avoids an arbitrary turn ending and requires both expansion/conflict and development. Every civilization stores objective progress; loss of all player cities is terminal defeat.

## 2026-08-02 — Explicit schema break from foundation saves

Schema 2 stores civilization knowledge, city queues/territory/health, combat units, AI progress and terminal state. A 0.1 save lacks enough information to reconstruct two rivals and non-overlapping ownership honestly, so it receives a specific incompatibility message rather than a fabricated migration.

## 2026-08-02 — Release audit requires command-level evidence

A terminal smoke test may inspect state to choose deterministic orders, but it may not assign positions, health, technologies, cities, owners or victory state. The M1 gate is now demonstrated through the same controller commands exposed to browser input, including a real mid-campaign save/load and a terminal save/load. Pacing was retuned so the audited campaign ends on turn 49 rather than using an accelerated turn-7 fixture.

## 2026-08-02 — M1 remains active until PR acceptance

Passing local release evidence does not silently start the next roadmap mission. `ROADMAP.tsv` and `NEXT_MISSION.md` continue to identify M1 while draft PR #7 is under review; M2 remains planned.

## 2026-08-03 — Human Product Gate overrides formal feature completion

A real browser review rejected the alpha claim even though simulation tests and a terminal smoke passed. Human ability to identify objects, understand actions, manage a city and connect actions to consequences is now a blocking product criterion. Draft PR #7 was closed and superseded by an experience-recovery branch.

## 2026-08-03 — Functional visual language before final art

Browser-native vector silhouettes, terrain patterns, clear selection, health bars and contextual panels are sufficient for the current readability gate. Final illustration, animation, audio and commercial polish remain later work; functional art must still be distinguishable and usable now.

## 2026-08-03 — Inspection and orders are separate modes

Ordinary map clicks inspect terrain and entities without spending movement. A unit moves or attacks only after the player explicitly selects the corresponding action. Selection may be cleared through a visible button, repeated click, Escape or right click. This prevents accidental orders and makes the map safe to explore.

## 2026-08-03 — Eight-direction pathing and square ranged distance

Movement uses eight neighboring cells. Clicking a farther reachable destination runs deterministic pathfinding and spends the unit's current movement allowance, stopping partway when necessary. Ranged combat uses square/Chebyshev distance so an offset of two cells on one axis and one on the other counts as range two, matching the player's spatial expectation.

## 2026-08-03 — Terminal outcomes must explain causality

A result screen may not merely name the winner. It records the exact trigger, the winner's city and technology totals and the latest chronicle events. The world panel shows each civilization's progress toward the same four-city/eight-technology objective before the game ends.
