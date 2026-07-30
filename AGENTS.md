# Epohi Rebuild Agent Contract

Read this file first, then `VISION.md`, `SOURCE_AUDIT.md`, `STATE.md`, `MISSION.md`, `QUALITY.md`, `ARCHITECTURE.md`, `DECISIONS.md`, and `reference/LEGACY_SOURCE_EVIDENCE.md`.

1. This is a source-dependent rebuild of the existing game `Mikayilzade/Epohi`, not a greenfield game.
2. The local `reference/` bundle is an identity-defining source prepared from verified legacy files and repository history. Inspect it before design or implementation.
3. Preserve product identity: a turn-based civilization strategy on a generated tile map with exploration, units, settlements, economy, AI actors, and era progression.
4. Never replace the map strategy with event cards, a linear narrative choice game, an idle game, or a menu-only prototype.
5. A new architecture and new implementation are authorized. Silent changes to genre, core loop, player agency, spatial model, or long-term direction are not.
6. Decide reversible technical, visual, balancing, content, and workflow details independently. Record only material decisions in `DECISIONS.md`.
7. Ask only for a true blocker: missing protected access, spending, irreversible action, or an identity conflict unsupported by the local source bundle.
8. Keep likely feedback areas data-driven and replaceable: terrain, units, balance, AI policies, progression thresholds, visuals, and content.
9. Use one reconnaissance pass, one design pass, one production pass, and at most two full verification-and-repair cycles.
10. Run checks locally. Do not trigger GitHub Actions unless `MISSION.md` explicitly permits it.
11. Update `STATE.md` and `SOURCE_AUDIT.md` before finalizing.
12. Deliver one coherent runnable result in one draft pull request. No routine progress spam.
13. Stop when the mission criteria are met or bounded repair is exhausted and limitations are documented.
