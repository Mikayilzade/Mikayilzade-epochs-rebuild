# Epohi Rebuild Agent Contract

Read this file first, then:

1. `PROGRAM.md`
2. `AUTONOMOUS_CAMPAIGN.md`
3. `VISION.md`
4. `SOURCE_AUDIT.md`
5. `STATE.md`
6. `ROADMAP.tsv`
7. `NEXT_MISSION.md`
8. `RELEASE_GATES.md`
9. `QUALITY.md`
10. `ARCHITECTURE.md`
11. `DECISIONS.md`
12. `PLAYTEST.md`
13. `reference/LEGACY_SOURCE_EVIDENCE.md`

## Product identity

1. This is a source-dependent rebuild of the existing game `Mikayilzade/Epohi`, not a greenfield game.
2. The local `reference/` bundle is an identity-defining source prepared from verified legacy files and repository history. Inspect it before design or implementation.
3. Preserve product identity: a turn-based civilization strategy on a generated tile map with exploration, units, settlements, economy, AI actors, conflict and era progression.
4. Never replace the map strategy with event cards, a linear narrative choice game, an idle game or a menu-only prototype.
5. A new architecture and implementation are authorized. Silent changes to genre, core loop, player agency, spatial model or long-term direction are not.

## Human Product Gate

6. Automated tests, content counts and a terminal bot campaign do not prove that the game is playable for a human.
7. A release claim requires a real browser playtest recorded in `PLAYTEST.md`.
8. Ordinary map inspection must be safe. Do not bind selection alone to automatic movement or attack.
9. Every major entity must expose identity, state, available actions, blocked reasons and visible consequences.
10. A terminal result must explain the exact causal trigger, not merely name a winner.
11. Current functional/vector assets may remain temporary, but they must make terrain, cities, factions and unit roles distinguishable.
12. When Human Product Gate fails, improve the current experience before expanding diplomacy, eras, content counts or other systems.

## Autonomous production

13. The program target is a complete civilization-scale 4X game. The active mission is defined in `NEXT_MISSION.md`.
14. Work in large coherent release missions. Do not reduce the mission to one cosmetic fix or the easiest subset.
15. Complete internal design, production, testing, playtest and bounded repair without returning to the user between ordinary stages.
16. Decide reversible technical, visual, balancing, content and workflow details independently. Record material decisions in `DECISIONS.md`.
17. Ask only for a true blocker: missing protected access, spending, irreversible action or an identity conflict unsupported by the local source bundle.
18. Keep likely feedback areas data-driven and replaceable: terrain, units, buildings, resources, balance, AI policies, progression, visuals and content.
19. Use at most four bounded preproduction passes and at most two full verification-and-repair cycles per release mission.
20. Within one mission, allow at most one fundamental rollback to a reliable semantic checkpoint. Do not loop indefinitely.

## Delivery and evidence

21. A feature counts only when simulation, access/UI, persistence where relevant, tests and playtest coverage exist. Labels and promises are not implementation.
22. Run checks locally. Do not trigger GitHub Actions unless the active mission explicitly permits it.
23. Update `STATE.md`, `SOURCE_AUDIT.md`, `DECISIONS.md`, `PLAYTEST.md`, `ROADMAP.tsv` and `NEXT_MISSION.md` before finalizing.
24. Deliver one coherent runnable release in one draft pull request. Keep repairing the same PR within bounded limits; do not open a PR per finding.
25. Maintain the permanent `preview` branch for human testing when authorized; preview does not imply merge or release acceptance.
26. No routine progress spam. Return with the draft PR, evidence, known limitations and release-gate status.
27. Stop when the active Human Product Gate passes or bounded repair is exhausted and the architectural limitation is documented.
