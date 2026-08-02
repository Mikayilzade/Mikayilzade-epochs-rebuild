# Active Release Mission M1 — Ancient World Alpha 0.2

Status: **release audit repaired; M1 remains the current mission until PR #7 is accepted**

## Mission statement

Transform the 0.1 technical foundation into a coherent, readable and finishable ancient-era 4X game. This is one large release mission, not a UI patch and not a collection of unrelated prototypes.

A player must be able to start a generated world, understand the map, explore, found and manage multiple cities, produce units and buildings over time, claim territory, meet rival civilizations, fight, survive independent threats, progress through an ancient technology tree, and finish the campaign with victory or defeat.

## Preserve

Preserve the verified product identity and useful 0.1 architecture:

- generated tile map and fog of war;
- modular simulation/content/persistence/UI boundaries;
- deterministic seeds and tests;
- persistent units, settlements, economy and research;
- camera controls and validated save/load;
- browser-first local launch.

Refactor where needed, but do not replace the map strategy with menus, events or a cosmetic map.

## Mandatory release systems

### 1. Readable map and interaction

- Replace ambiguous geometric glyphs with a consistent readable visual language using generated/vector/browser-native assets where practical.
- Distinguish player scout, settler, military units, rival units, independent units, cities, resources and terrain at normal zoom.
- Provide an in-game legend or contextual tooltip system.
- Show selected object, reachable tiles, illegal destinations and attack targets clearly.
- Clicking any owned city selects and opens that city. Clicking a unit selects that unit. Selection state survives ordinary rerenders.
- The player can switch among owned cities and units without hunting for hidden objects.
- Desktop is primary. Narrow viewport must remain usable for core actions, with panels that can collapse or switch context rather than covering the map.

### 2. Real city management

Every city has persistent:

- name;
- population;
- food storage and growth;
- production output;
- science/culture contribution as supported by the mission design;
- worked or controlled tiles;
- buildings;
- current production item and progress;
- health/defence or equivalent capture state;
- owner.

The city interface must show these values and let the player:

- choose a building or unit to produce;
- inspect cost, turns and effect before committing;
- change the queue with a clear rule for retained or lost progress;
- see completion and resulting effects;
- manage each city independently.

Use multi-turn production queues. Instant purchases may exist only as an optional separate mechanic, not the sole production model.

### 3. Territory and tile use

- Cities claim a visible territory.
- Territory affects legal founding, tile yields, movement or control in a meaningful way.
- City output comes from explicit controlled/worked tiles or another readable allocation model.
- Terrain and resources influence settlement choice and specialization.
- Founding distance and ownership conflicts are enforced.

### 4. Units and roles

Implement at least these player-usable roles with data-driven definitions:

- scout/reconnaissance;
- settler;
- basic melee military unit;
- basic ranged or support military unit;
- worker/builder or an equivalent tile-improvement role.

Units must have readable stats, movement, owner, position, health where combat-capable, and role-specific actions. Production and technology requirements must be enforced.

### 5. Tactical combat and capture

Implement a deterministic, understandable combat model:

- legal attack targeting;
- melee and ranged distinction or another comparably meaningful role distinction;
- health and damage;
- unit destruction;
- retaliation where appropriate;
- terrain/defence modifiers;
- city defence and city capture;
- no friendly-fire or inaccessible stacking states;
- clear combat preview or at minimum clear expected-risk feedback;
- battle results recorded in the chronicle.

Combat must be accessible through the map UI and covered by tests. A moving enemy icon without combat does not satisfy this system.

### 6. Rival civilizations and independent world

Create at least two autonomous rival civilizations in addition to the player, plus independent threats or peoples.

Each rival must have persistent identity and be able to:

- explore under its own fog/knowledge model as practical;
- found or control cities;
- produce units/buildings;
- choose research/progression;
- expand territory;
- evaluate threats;
- defend and attack;
- pursue the mission victory condition.

Independent actors must do more than walk toward the capital. They may raid, defend camps, migrate, trade or evolve according to a bounded design, but they must create distinct world pressure.

AI need not be expert, but it must play the same world rather than use decorative scripts.

### 7. Ancient progression and content

Provide a coherent ancient-era progression with enough content to support a full short campaign:

- at least 8 meaningful technologies or combined technology/civic choices;
- prerequisites and visible unlocks;
- at least 6 buildings/improvements;
- at least 5 player-producible unit types including required roles;
- strategic or luxury resources if they are needed for unit/building choices;
- at least one material era/status transition inside the campaign;
- no unlock that is only a text promise.

The content must be data-driven and internally balanced enough that multiple strategies are viable in the target playtest length.

### 8. Victory, defeat and pacing

Implement a complete ancient-world campaign arc.

At minimum:

- one clear player victory condition involving dominance, development, objective control or a deliberately chosen combination;
- defeat when the player loses all viable cities/continuation capacity;
- rival ability to achieve the objective or otherwise force defeat;
- visible progress toward victory/defeat;
- end screen with result and campaign summary;
- expected campaign length suitable for repeated testing, roughly 40–100 turns depending on balance.

Do not use an arbitrary fixed-turn ending without strategic meaning.

### 9. Persistence and deterministic validation

- Bump or migrate the save schema for all new state.
- Reject malformed state safely.
- Preserve cities, queues, territory, AI state, health, research, victory progress and chronicle across save/reload.
- Keep deterministic seeded scenarios for testing.
- Add migration from the accepted 0.1 save when reasonably possible; otherwise fail with an explicit supported message rather than crashing.

### 10. Onboarding and feedback

A new player must be able to understand the first ten turns without reading repository instructions.

Include concise contextual guidance for:

- selecting and moving units;
- founding/opening cities;
- choosing production;
- choosing research;
- ending turns;
- combat;
- victory objective.

Avoid modal spam. Prefer contextual prompts, tooltips, highlighted next actions and dismissible help.

## Architecture requirements

- Keep simulation rules independent from DOM/canvas rendering.
- Keep content definitions separate from rule execution.
- Introduce stable identifiers for civilizations, cities, units, technologies, buildings and resources.
- Avoid turning `src/main.js` or a single simulation file into a new monolith.
- Add modules for combat, AI strategy, territory/cities and victory as appropriate.
- Keep rendering replaceable so later art improvements do not require rewriting simulation.

## Required automated checks

Add or expand tests for at least:

- deterministic map and starts for several seeds;
- city selection and independent city queues at domain/controller level;
- growth and starvation/limits as designed;
- legal and illegal founding;
- territory ownership invariants;
- production cost/progress/completion;
- unit production prerequisites;
- movement and occupancy;
- melee/ranged combat, destruction and city capture;
- AI produces, expands and performs a legal attack/defence action;
- technology prerequisites and real unlocks;
- victory and defeat;
- save round-trip and malformed/migration cases;
- a complete deterministic campaign smoke scenario to a terminal result.

## Required playtest path

Record at least one reproducible campaign that:

1. starts a generated world;
2. identifies player, rival and independent actors visually;
3. explores and reveals meaningful terrain;
4. opens the capital city;
5. selects research and a multi-turn production item;
6. completes a unit or building;
7. improves or works territory;
8. founds a second city and manages its queue independently;
9. encounters a rival;
10. fights at least one battle;
11. observes rival production/expansion;
12. saves and reloads mid-campaign;
13. captures or loses a city;
14. reaches victory or defeat without a blocker.

Use a real browser if available. Otherwise run deterministic simulation and server/build checks, then mark visual verification pending rather than claiming it.

## Release acceptance

M1 passes only when:

- the game is recognizably a small but complete ancient-era 4X, not a mechanics demo;
- cities are real manageable entities;
- combat, territory, rivals and a terminal campaign outcome exist;
- the interface explains objects and legal actions;
- the complete campaign smoke path reaches victory or defeat;
- saves resume the same campaign;
- local tests and production build pass;
- known limitations are appropriate for 0.2 and do not remove a mandatory system.

## Out of scope for M1

Do not expand this mission into the full final game. The following may remain for later roadmap stages:

- deep diplomacy and trade treaties;
- religion, governments and complex culture;
- migration/state collapse simulation;
- many eras and late-game systems;
- final art/audio;
- multiplayer;
- dozens of civilizations;
- expert strategic AI.

## Final delivery

Return one draft PR with:

- the complete M1 release;
- updated `STATE.md`, `DECISIONS.md`, `PLAYTEST.md`, `ROADMAP.tsv` and this file;
- exact launch/build/test commands;
- test and campaign-playtest results;
- screenshots when the environment permits;
- known limitations;
- a proposed `NEXT_MISSION.md` for M2 only after M1 acceptance criteria are genuinely met.
