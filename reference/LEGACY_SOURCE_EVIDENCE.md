# Legacy Source Evidence Bundle

Purpose: preserve enough verified evidence from `Mikayilzade/Epohi` for a production agent to understand the existing game's identity even when cross-repository cloning is blocked.

This is not a complete copy of the old repository and does not require reuse of its architecture.

## 1. World and persistence configuration

Source: `src/config.js` on legacy `main`

Blob: `01812f07f54b0c348a0a820e249403d4c9ce813c`

Verified facts:

- default map is 28 × 28;
- selectable sizes are 20, 28, and 36;
- save schema is explicitly versioned;
- campaigns, manual saves, and autosaves use persistent stores;
- camera has separate persisted state and supports substantial zoom range.

Exact file: `reference/legacy-snapshot/config.js`.

## 2. Main simulation evidence

Source: `src/app.js` on legacy `main`

Blob: `978c79b275e6220c0a7a05914896c550d7bf900d`

Verified module dependencies include:

- terrain, features, improvements, buildings;
- unit definitions;
- barbarian rules and activity;
- AI civilization names, colours, limits, and weights;
- technologies;
- selectors, territory, economy, progression, storage, save utilities, and camera.

Verified tile shape begins with spatial simulation state equivalent to:

```js
{ terrain, revealed, improvement, feature, poi, camp, pillaged }
```

Verified world generation creates a square terrain grid with water, plains, forests, hills, deserts, swamps, dead land, resources, and points of interest.

Verified world actors include:

- player cities and units;
- rival cities and units;
- barbarian units;
- camps with health, spawn schedules, discovery by player and individual civilizations, and replacement rules;
- independent visibility based on city and unit positions.

Verified interaction/UI state includes selected tile/unit, current turn, era, food, production, gold, science, city, research, end-turn action, camera, context actions, and save/campaign state.

## 3. Economy

Source: `src/economy.js` on legacy `main`

Blob: `c5f7fec5f095aae39ae885e8deb7d8f12c8960ac`

The old game calculates tile yield from terrain plus unpillaged improvements and feature bonuses. Empire income aggregates city income and additional settlement income using food, production, gold, and science.

Exact file: `reference/legacy-snapshot/economy.js`.

## 4. Progression

Source: `src/progression.js` on legacy `main`

Blob: `effc4657bbf600f2db8718a08d7a56c1be449298`

Verified progression:

- tribe;
- settlement after initial research or population growth;
- city after more research or population;
- kingdom after statehood;
- empire after victory.

Exact file: `reference/legacy-snapshot/progression.js`.

## 5. Recent development intent

Source: `.github/codex/task-queue.md` on legacy `main`

Blob: `8adfb64a772471dc5a1ccce4db78fab97d654a3e`

The recent queue shows that gameplay was already being modularized without changing its identity:

- selectors for technologies, buildings, and affordability;
- territory helpers;
- tile yield and income modules;
- progression module;
- inspection of multiple own units on one tile;
- previous/next stack navigation without spending movement;
- persistent generated unit names;
- responsive placement of contextual move/build/attack actions;
- Camera 2.0 with whole-map fit, deep tile zoom, focus, pinch, pan, persistence, resize safety, and tile clicking.

## 6. Camera 2.0 merged evidence

Legacy PR: `Mikayilzade/Epohi#68`

Merge commit: `e7fd3fc8154ef427b3479de49d82cd8d3c5a704f`

Files included `src/camera.js`, `src/camera-storage.js`, `src/app.js`, `index.html`, `styles/app.css`, and focused browser tests. The goal was not a decorative map image: it preserved selectable tiles, focus on units/capital, persistence, and pointer interaction across full-map and deep zoom.

## Identity conclusion

A compatible rebuild must remain a spatial, turn-based civilization simulation. The following would contradict the verified sources:

- replacing the map with twelve scripted event cards;
- making resource bars the only simulation;
- removing persistent units and settlements;
- advancing history only through narrative choices;
- eliminating autonomous rival/barbarian world actions;
- delivering only a mock-up of systems that are not playable.

The first rebuild may be smaller than the legacy game, but its playable vertical slice must contain the same category of core loop.
