# Current Mission — First Playable Map Strategy

Status: ready for production

## Outcome

Create from scratch a coherent, locally runnable first rebuild of `Эпохи` that proves the real product identity through a complete turn-based map-strategy loop.

A player must be able to start a new campaign, explore a generated map with units, establish or operate a settlement, gain and spend meaningful resources, research initial progress, encounter at least one independent world threat or rival actor, end turns, save, reload, and continue.

## Required identity sources

| Source | Role | Status |
|---|---|---|
| `VISION.md` | Canonical rebuild direction | available, identity-defining |
| `SOURCE_AUDIT.md` | Verified identity and provenance | available, identity-defining |
| `reference/LEGACY_SOURCE_EVIDENCE.md` | Local evidence extracted from the legacy repository | available, identity-defining |
| `reference/legacy-snapshot/` | Exact representative legacy source files | available, identity-defining |
| `https://github.com/Mikayilzade/Epohi` | Full legacy provenance and optional deeper reference | use when accessible; local bundle is sufficient for identity |
| `https://github.com/Mikayilzade/creative-studio` | Production rules | read when accessible; local control files remain binding |

The Source Dependency Gate passes only after the agent opens the local identity sources and records the inspected files in `SOURCE_AUDIT.md`.

## In scope

- Generated tile map with at least three terrain types and meaningful passability/yields.
- Fog of war and exploration.
- Camera suitable for desktop and mobile: pan, zoom, and a reliable way to show or refocus the map.
- Persistent player units with selection, movement points, and at least two distinct roles.
- At least one settlement with population or development state.
- Economy with a minimum of food, production, and knowledge/science; gold may be included when it serves the loop.
- One small research/progression path that visibly changes available actions or status.
- A turn pipeline in which economy and non-player actors advance after the player ends the turn.
- At least one independent threat or rival actor that moves or changes state without direct player control.
- Campaign save/load with a versioned schema and graceful handling of absent or invalid data.
- Responsive, understandable interface.
- Automated tests for pure core rules and one reproducible smoke path for a full short session.
- Exact local launch and production-build instructions.

## Out of scope for this mission

- Recreating every legacy feature or balance value.
- Full diplomacy, religion, governments, trade networks, or victory variety.
- Final graphics, audio, localization, accounts, cloud saves, multiplayer, or monetization.
- Large historical content libraries.
- Complex unit training and full intelligence algorithms; architecture must leave room for them.
- A long campaign spanning all planned eras.

## Mandatory acceptance criteria

- [ ] The main play screen is a tile map, not a list of event cards.
- [ ] A fresh campaign can be started without editing files or using developer tools.
- [ ] The player can select and move a unit across passable tiles while movement rules prevent invalid movement.
- [ ] Unseen map areas begin hidden and can be revealed through exploration.
- [ ] The player can found or use a settlement and observe resource production after ending a turn.
- [ ] Research or progression produces at least one visible gameplay unlock or era/status change.
- [ ] At least one non-player actor performs a meaningful autonomous turn action.
- [ ] Saving, closing/reloading, and continuing preserves the campaign state.
- [ ] The interface is usable at common desktop and phone viewport sizes.
- [ ] Game rules are separated from rendering and content data sufficiently to change balance and presentation without rewriting the engine.
- [ ] Local tests pass, a production build is created, and launch instructions are verified.
- [ ] `STATE.md`, `SOURCE_AUDIT.md`, `DECISIONS.md`, and `PLAYTEST.md` are updated.
- [ ] One draft PR contains the coherent result and honest limitations.

## Autonomous authority

The agent may independently choose technology, directory structure, visual direction, algorithms, initial balance, content names, tests, and implementation order. Prefer a browser game that can run locally and be statically deployed, unless verified repository constraints justify another choice.

All such choices must preserve the product identity and remain change-friendly.

## Hard constraints

- Do not ask routine questions.
- Do not create a narrative card game as a substitute for the map strategy.
- Do not copy the legacy monolith merely to claim a rebuild; use a clean modular architecture.
- Do not enable or trigger GitHub Actions.
- Use at most two complete verification-and-repair cycles.
- Do not expand scope after the acceptance criteria are met.

## Delivery

- Working branch: `codex/first-map-strategy-rebuild` or equivalent.
- Result: one draft pull request into `main`.
- Final report: inspected source files, runnable result, launch steps, checks, major decisions, limitations, and best next player action.
