# Vision — Эпохи

## Product identity

`Эпохи` is a turn-based civilization strategy played on a generated tile map. The player begins with a small people, explores an unknown living world, directs units, establishes and develops settlements, researches knowledge, manages resources, interacts or fights with other actors, and advances through historical stages.

The game must feel like a compact, understandable civilization simulation rather than a sequence of scripted event cards.

## Core player loop

1. Inspect the map and current civilization state.
2. Direct units or allow suitably intelligent units to follow assigned policies.
3. Explore fogged territory, discover terrain, resources, points of interest, camps, and other civilizations.
4. Found and develop settlements; choose production, improvements, research, and priorities.
5. End the turn.
6. The rest of the world acts: rivals move and develop, barbarians operate, settlements generate yields, and the world state changes.
7. Adapt plans and progress toward later eras and larger goals.

## Non-negotiable identity traits

- A spatial tile map is the main play surface.
- Exploration and fog of war matter.
- Units are persistent entities with positions, movement, roles, and future room for attributes and autonomy.
- Settlements and territory matter.
- Economy is derived from land, improvements, settlements, buildings, and decisions.
- Turns advance the player and simulated world.
- Rival civilizations and non-civilized threats exist independently of the player.
- Progression changes the civilization from tribe through settlements, cities, kingdoms, and later forms.
- Saves preserve an ongoing campaign.
- Desktop and mobile play are both first-class targets.

## Long-term direction

The rebuild should make deeper systems practical instead of hard-coding a small imitation of Civilization:

- units can have trainable attributes and behavioural intelligence;
- intelligence determines how many orders, priorities, and conditional algorithms a unit can follow autonomously;
- terrain has meaningful passability and strategic value;
- the world continues to act without waiting to be directly observed;
- civilizations may develop differently rather than following one fixed script;
- eras should unlock qualitatively new systems, not only higher numbers;
- balance and content should be data-driven so large changes do not require rewriting the engine.

## Experience goals

- Clear enough to learn on a phone without reading a manual first.
- Deep enough that planning, geography, specialization, and autonomous behaviour matter.
- A complete playable loop early, then gradual expansion without architectural collapse.
- Decisions emerge from the simulation; narrative events may support the world but never replace the map strategy.

## Explicitly not the product

- not a 12-card historical questionnaire;
- not a linear visual novel;
- not an idle resource counter;
- not a static design mock-up;
- not a disconnected collection of promised future systems.
