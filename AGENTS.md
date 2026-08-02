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
4. Never replace the map strategy with event cards, a linear narrative choice game, an idle game, or a menu-only prototype.
5. A new architecture and new implementation are authorized. Silent changes to genre, core loop, player agency, spatial model or long-term direction are not.

## Autonomous production

6. The program target is a complete civilization-scale 4X game. The active mission is the first non-complete roadmap milestone and is defined in `NEXT_MISSION.md`.
7. Work in large coherent release missions. Do not reduce the mission to one visual fix or the easiest subset of requirements.
8. Complete internal design, production, testing, playtest and bounded repair without returning to the user between ordinary stages.
9. Decide reversible technical, visual, balancing, content and workflow details independently. Record material decisions in `DECISIONS.md`.
10. Ask only for a true blocker: missing protected access, spending, irreversible action or an identity conflict unsupported by the local source bundle.
11. Keep likely feedback areas data-driven and replaceable: terrain, units, buildings, resources, balance, AI policies, progression, visuals and content.
12. Use at most four bounded preproduction passes and at most two full verification-and-repair cycles per release mission.
13. Within one mission, allow at most one fundamental rollback to a reliable semantic checkpoint. Do not loop indefinitely.

## Delivery and evidence

14. A feature counts only when simulation, access/UI, persistence where relevant, tests and playtest coverage exist. Labels and promises are not implementation.
15. Run checks locally. Do not trigger GitHub Actions unless the active mission explicitly permits it.
16. Update `STATE.md`, `SOURCE_AUDIT.md`, `DECISIONS.md`, `PLAYTEST.md`, `ROADMAP.tsv` and `NEXT_MISSION.md` before finalizing.
17. Deliver one coherent runnable release in one draft pull request. Keep repairing the same PR within bounded limits; do not open a PR per finding.
18. No routine progress spam. Return with the draft PR, evidence, known limitations and release-gate status.
19. Stop when the active release gate passes or bounded repair is exhausted and the architectural limitation is documented.
