# Autonomous Release Campaign

## Purpose

This file lets any capable implementation agent continue the long-running production program without the user rewriting the assignment every time.

## Read order

Read, in order:

1. `AGENTS.md`
2. `PROGRAM.md`
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
13. relevant source and tests

## Campaign loop

1. Confirm the active milestone in `NEXT_MISSION.md` matches the first non-complete row in `ROADMAP.tsv`.
2. Inspect the current product in code, tests and a local run when the environment permits.
3. Perform at most four bounded preproduction passes: product/core loop, systems/realism, alternatives/risks, red team.
4. Create or refresh a semantic checkpoint before production.
5. Implement the whole active release mission, not one isolated bullet.
6. Validate continuously with unit, integration, save/load, deterministic scenario and build checks.
7. Run the mission playtest path. Use a real browser when available; otherwise record the limitation honestly and still complete deterministic checks.
8. Perform at most two full repair cycles for the release mission.
9. Update `STATE.md`, `DECISIONS.md`, `PLAYTEST.md`, `ROADMAP.tsv` and `NEXT_MISSION.md`.
10. Return one draft PR containing a coherent playable release.

## Communication

Do not return after internal design, implementation or testing stages. Continue automatically when there is no hard blocker.

Communicate only:

- at mission start if necessary;
- when a true hard blocker prevents progress;
- with the final draft PR and concise release report.

Do not ask the user to choose ordinary technical, visual, balance or content details. Choose reversibly and keep them data-driven.

## Checkpoints

A commit stores files. A checkpoint explains the project state and safe continuation point.

Create a semantic checkpoint:

- after a completed major system block;
- before a fundamental architectural change;
- at a phase boundary;
- before a long interruption;
- before release packaging.

A checkpoint records completed systems, canonical files, material decisions, validation performed, open risks and the next concrete action. It should reference the relevant commit or branch state.

## Anti-loop rule

Within one release mission, allow at most one fundamental rollback to the last reliable checkpoint. If the rebuilt foundation fails again, end the mission as architecturally unready, preserve evidence and define a new mission. Do not cycle indefinitely.

## Scope rule

The active mission is a floor and a boundary.

- Deliver every mandatory acceptance criterion.
- Repair adjacent defects required for a coherent release.
- Do not stop after the easiest subset.
- Do not expand into later roadmap milestones unless necessary to avoid a dead-end architecture.

## Definition of implementation

A feature counts only when it has:

- simulation/domain behavior;
- player or AI access to that behavior;
- readable UI feedback where player-facing;
- persistence when campaign state is affected;
- tests for core invariants;
- inclusion in the mission playtest path.

Text labels and placeholders do not count.

## PR policy

Use one branch and one draft PR for the release mission. Keep updating that PR through bounded repair. Do not create a new PR for each finding.

GitHub Actions remain off unless explicitly authorized. Run local checks instead.
