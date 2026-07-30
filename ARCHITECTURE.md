# Architecture Direction

This file defines boundaries, not a mandatory framework.

## Principles

- Rebuild from clean modules rather than reproducing the legacy `app.js` monolith.
- Keep the simulation deterministic enough to test.
- Treat UI as a view/controller over domain state.
- Keep content and balance data replaceable.
- Version persisted state from the first release.
- Prefer the simplest architecture that supports the current mission and the long-term unit-autonomy direction.

## Required boundaries

### Domain state

Owns serializable campaign data:

- world seed and map;
- turn and phase;
- player civilization;
- settlements and territory;
- units and movement state;
- resources and research;
- rival/barbarian actors;
- progression and notifications.

No DOM nodes, functions, timers, or browser objects inside saved state.

### Simulation

Pure or mostly pure operations:

- generate world;
- validate and apply commands;
- resolve movement and exploration;
- resolve settlement/economy phase;
- resolve AI/world phase;
- update progression;
- emit structured results or log entries.

Randomness should use an explicit seed or injectable generator where practical.

### Content and configuration

Data definitions for:

- terrain and passability;
- yields and resources;
- unit types and initial attributes;
- technologies and unlocks;
- buildings/improvements;
- AI policies and balance;
- visual labels and icons.

Changing a yield or unit stat must not require editing rendering logic.

### Application/controller

Translates player input into validated domain commands, sequences phases, schedules saving, and exposes current view state.

### Rendering and input

Owns map drawing, panels, camera, responsive layout, pointer/touch controls, action availability, and feedback. It must not secretly mutate domain state.

### Persistence

Owns save schema version, serialization, validation, migrations, slot/autosave policy, and safe recovery from invalid data.

## Recommended initial directory shape

```text
src/
  domain/
    state.*
    commands.*
    simulation.*
    world.*
    economy.*
    progression.*
    ai.*
  content/
    terrain.*
    units.*
    tech.*
    balance.*
  app/
    controller.*
    persistence.*
  ui/
    map.*
    camera.*
    panels.*
    input.*
  main.*
tests/
```

Equivalent organization is allowed when the boundaries remain clear.

## Extension seams

The first version should leave explicit room for:

- unit attributes such as strength, mobility, perception, endurance, and intelligence;
- orders composed from priorities, destinations, conditions, and fallback rules;
- autonomous unit policies limited by intelligence/training;
- additional civilizations and diplomacy;
- multiple eras with system unlocks;
- workers, improvements, resources, combat, and logistics;
- world simulation outside the current camera view.

Do not implement all extension seams now. Avoid interfaces with no current caller, but do not bake future identity features into UI-specific shortcuts.
