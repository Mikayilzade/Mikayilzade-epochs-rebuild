# Current Mission — First Ten Minutes Human Experience Recovery

Status: active
Mission type: source-dependent continuation
Project scale: major experience-repair mission
Source gate: passed
Human Product Gate: failed on PR #7; re-test required
Fundamental rollback used: no

## Product outcome

Transform the useful technical foundation from draft PR #7 into one coherent, understandable and satisfying first-ten-minute playable slice.

The mission does not add another layer of global systems. It makes the existing map, city, research, production and unit rules legible and controllable to a real player without reading repository documentation.

The intended result is the first honestly testable `0.2` candidate, not a claim of Civilization-scale completeness.

## Verified failure evidence

A real desktop Chrome playtest on 2026-08-03 showed that:

- units were mainly letter tokens with weak identity;
- the player could not discover meaningful actions beyond clicking adjacent tiles;
- cities did not feel openable or manageable;
- the right panel exposed data but not a clear decision flow;
- automated completion and configuration counts overstated product maturity.

The implementation is therefore a **technical prototype**, not an accepted alpha.

## Preserve

- generated 20 × 14 map, terrain, resources and fog;
- persistent cities, units, rivals and independent actors;
- research, production queues, territory, combat, victory and defeat;
- schema-2 save/load and deterministic tests;
- modular domain/content/persistence boundaries;
- the verified legacy product identity.

## In scope

### 1. Core entity interaction contracts

Every player city and primary unit role must provide:

- recognizable visual identity without relying on a single Latin letter;
- reliable selection from the map and from an owned-object list;
- understandable current state;
- visible available actions;
- explicit feedback for blocked actions;
- visible consequences after an action;
- meaningful change across turns.

Required entities:

- capital/owned city;
- scout;
- settler;
- worker;
- melee military unit;
- ranged military unit when available.

### 2. First-ten-minute path

A new player must be able to discover and perform, without README instructions:

1. identify the capital, scout, settler and warrior;
2. move the scout and reveal terrain;
3. open the capital and understand population, growth, yields, defence and production;
4. choose a production project and see cost, progress and estimated turns;
5. choose an available research and see its progress/unlock;
6. understand how to found a second city;
7. understand worker improvement and combat actions before those units are used;
8. end a turn and understand what changed.

Contextual guidance may assist, but it must not replace direct, discoverable interaction.

### 3. Visual and interaction language

- Replace letter-only map tokens with browser-native vector silhouettes or comparably readable symbols.
- Make cities visibly different from units.
- Add terrain texture/pattern cues in addition to color.
- Show selected objects and legal movement, attack and improvement targets clearly.
- Provide hover details for terrain yields, ownership, resources, improvements, units and cities.
- Provide an owned-object roster and reliable focus/next-object controls.
- Make a city on the same tile as a unit selectable without hidden tricks.

### 4. Decision interface

- The selected unit panel must explain role, health, movement, strength/range and actions.
- The selected city panel must expose growth, yields, defence, buildings and independent production.
- Production choices must show cost, rough turns and effect before commitment.
- Research choices must show cost, prerequisites, active progress and unlocks.
- Add a compact dynamic first-steps objective tracker.

### 5. Human Product Gate evidence

Before acceptance:

- run a real desktop browser build;
- record first-ten-minute findings in `PLAYTEST.md`;
- capture at least the opening state, selected unit, opened city and production/research state;
- have the human reviewer answer whether the next action is understandable without repository instructions;
- mark the gate pass/fail/pending honestly.

Automated tests and scripted campaigns remain useful engineering evidence but cannot pass the Human Product Gate.

## Out of scope

- diplomacy, trade, religion, governments or later eras;
- more technologies, units, civilizations or victory types;
- final art, animation, sound or music;
- broad AI expansion;
- rewriting the simulation solely to improve presentation;
- claiming parity with Civilization VI.

## Mandatory acceptance criteria

- [ ] The opening screen communicates the player goal and first useful actions.
- [ ] Capital, scout, settler and warrior are visually distinguishable at normal zoom without letter-only tokens.
- [ ] Any owned city can be selected and managed through a clear city panel.
- [ ] Every starting unit has visible role-specific actions and blocked-action feedback.
- [ ] An owned-object roster reliably selects and focuses cities and units.
- [ ] Terrain and resources convey more than flat color.
- [ ] Production and research choices show cost, progress and consequences.
- [ ] A dynamic objective tracker covers the first meaningful actions.
- [ ] Existing domain, persistence and campaign tests remain passing.
- [ ] New controller behaviour for ending unit actions is tested.
- [ ] Desktop build and launch path work.
- [ ] Real human first-ten-minute playtest is recorded.
- [ ] Human Product Gate is marked pass, fail or pending; pending/fail cannot be labelled alpha/release.

## Autonomous authority

All reversible visual, layout, wording and interaction decisions are authorized when compatible with `VISION.md`, `PROGRAM.md` and the verified product identity.

## Hard constraints

- Do not add new global game systems to compensate for weak interaction.
- Do not count entity definitions, test fixtures or bot completion as human usability.
- Do not return after internal stages when no hard blocker exists.
- Do not trigger GitHub Actions.
- Use at most two complete review-and-repair cycles.
- Preserve the useful technical foundation unless evidence proves it blocks this experience slice.

## Delivery

- Working branch: `agent/first-ten-minutes`.
- Result: one draft PR into `main`, superseding draft PR #7.
- Maturity before human re-test: `technical prototype — human gate pending`.
