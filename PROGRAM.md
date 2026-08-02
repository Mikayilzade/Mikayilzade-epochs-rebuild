# Эпохи — Civilization-Scale Production Program

## Product target

Build a complete standalone turn-based 4X civilization strategy that a player can begin, develop through multiple eras, finish with victory or defeat, save, resume, understand without external instructions, and replay with meaningfully different worlds.

The target quality bar is not “another prototype”. The long-term comparison class is Civilization-scale strategy, while the product identity remains its own: a living world, autonomous actors, emergent history, deeper continuity of cities, units, peoples and states, and progression from tribe toward empire.

This target is aspirational, not permission to claim parity before evidence exists. Repository state and release gates determine what is actually complete.

## Non-negotiable pillars

1. **Spatial 4X core** — exploration, expansion, exploitation and conflict happen on a generated map.
2. **Persistent world** — cities, units, peoples, resources, borders, discoveries and history survive turns and saves.
3. **Meaningful decisions** — the player chooses where to settle, what to build, research, field, trade, defend and pursue.
4. **Autonomous world** — rivals, independent peoples, raiders and later states act without waiting for the player.
5. **Era transformation** — technologies and institutions change available actions and the structure of society, not only numerical bonuses.
6. **Readable interface** — objects, actions, costs, risks and consequences are understandable from the game itself.
7. **Finishable campaigns** — every release target defines victory, defeat, pacing and a complete playable arc.
8. **Data-driven growth** — units, buildings, technologies, resources, terrain, policies and balance remain replaceable content where practical.

## Production mode

The repository is the durable memory of the project. Work is performed as a sequence of **large release missions**, not a chain of tiny user-directed patches.

Each release mission:

- starts from current `main`;
- reads the program, roadmap, current state and next mission;
- performs bounded preproduction, implementation, testing, playtest and repair internally;
- saves semantic checkpoints after major blocks;
- returns one coherent draft PR;
- updates roadmap, state, decisions, tests and playtest records;
- is judged against an explicit release gate rather than whether some code was added.

Ordinary UI defects discovered during a mission are repaired inside that mission. They do not become separate user-facing tasks unless bounded repair is exhausted or a true blocker exists.

## Scale rule

Do not attempt to implement the entire final game in one unbounded change. Do not shrink missions into cosmetic micro-tasks either.

A normal mission should deliver one substantial playable release such as:

- a complete ancient-era game loop;
- warfare, territory and rival civilizations;
- economy, trade and diplomacy;
- multi-era progression and victory systems;
- AI, content and balance expansion;
- release-quality UX, art pipeline, performance and packaging.

## Completion discipline

“Playable” means the user can understand and exercise the feature through the interface. A label, placeholder, log message or future promise is not implementation.

A milestone is complete only when its acceptance criteria, automated checks and required playtest path pass. Known limitations may remain only when explicitly allowed by the milestone gate.

## Program outcome

The program ends at `1.0` only when:

- a fresh player can start and finish a full campaign;
- multiple rival civilizations and independent actors produce a changing world;
- cities, units, economy, research, warfare, territory and diplomacy form one coherent loop;
- several eras materially transform play;
- victory and defeat are real;
- saves are stable and recoverable;
- desktop interaction is release quality and the supported narrow/mobile experience is honestly defined;
- content, performance, accessibility, onboarding and balance pass the final gates.
