# Current Mission — Human Product Gate Recovery

Status: **implementation complete; focused real-browser re-test pending**

## Outcome

Preserve the substantial Ancient World simulation foundation while making the first ten minutes understandable, safe and causally readable for a human player.

This mission is not a content-expansion pass. It repairs the interaction contract between the player and the existing map, units, cities, research, combat and victory systems.

## Required interaction experience

- The player can inspect a normal map tile without spending movement.
- Movement, attack and improvement happen only after an explicit action choice.
- Selected objects can be deselected through a visible control, repeated click, Escape or right click.
- Units move in eight directions.
- Clicking a farther reachable tile builds a path automatically and spends only available movement points.
- Legal destinations and targets are highlighted only while the corresponding mode is active.
- Invalid orders explain why and preserve state.

## Required combat experience

- Ranged attacks use square/Chebyshev distance on the square grid.
- An offset target two cells on one axis and one on the other is range two.
- Enemy unit and city inspection exposes owner, health and relevant combat values.
- Enemy cities display health and armour before an attack.
- Attack confirmation shows expected damage and retaliation.

## Required city and progression experience

- Any owned city can be selected from map or roster.
- City panel explains growth, yields, health, armour, buildings and queue.
- Locked production choices name the technology that unlocks them.
- Research dependencies and concrete unlocks remain visible.

## Required terminal experience

- The world panel explains that every civilization uses the same four-city/eight-technology victory condition.
- Rival progress is visible before the result.
- Victory or defeat states the exact trigger.
- Result panel shows winner city/technology totals and the final chronicle events.

## Graphics scope

Current browser-native vector symbols are functional readability assets. They need to distinguish roles and state, but final character art, animation, effects and audio are later roadmap work.

## Automated acceptance evidence

- 24 focused tests pass in the reconstructed local branch mirror.
- Command-level campaign smoke reaches a real player victory on turn 47 with all evidence.
- JavaScript syntax checks pass for changed modules.
- Production build completes.
- GitHub Actions are not run.

## Human acceptance

The permanent GitHub Pages preview must be re-tested for:

1. diagonal movement;
2. farther-tile automatic routing;
3. safe inspection and deselection;
4. expected archer offset range;
5. enemy city HP/armour visibility;
6. exact and understandable defeat/victory cause.

Do not merge PR #8, begin M2 or claim Alpha 0.2 until the focused Human Product Gate re-test passes and `PLAYTEST.md` records it.
