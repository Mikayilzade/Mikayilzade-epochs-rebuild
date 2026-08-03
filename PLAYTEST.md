# Human Product Gate — First Ten Minutes

## Previous build

- Build: draft PR #7, Ancient World Alpha 0.2 claim.
- Environment: real desktop Chrome, 2026-08-03.
- Human reviewer: repository owner/player.
- Result: **FAIL**.

## First observed failure

- Units appeared as unexplained letter markers and lacked immediate identity.
- Unit roles and actions were not discoverable.
- Cities did not appear openable or meaningfully manageable.
- The interface contained data and instructions but did not create a clear action → consequence loop.
- The result felt like a constrained technical demo rather than a small 4X game.

Automated tests and a command-level terminal campaign had passed, proving simulation consistency but not human usability.

## Repair build — second human playtest

- Branch: `agent/first-ten-minutes` through GitHub Pages `preview`.
- Environment: real desktop Chrome, 2026-08-03.
- Human reviewer: repository owner/player.
- Result: **meaningful improvement, gate still pending**.

### What improved

- City production and technology dependencies became understandable.
- Locked production choices were correctly recognized as technology-gated rather than missing.
- Research progression and dependencies were enjoyable.
- Archers created a visibly useful tactical role.
- The campaign reached a real terminal result.
- Overall progress was judged substantially better than the letter-token build.

### Remaining Human Product Gate blockers found

- Movement allowed only four cardinal directions; diagonal movement was expected.
- A unit could move only one tile per click even when it had several movement points; the player expected automatic pathing to a farther reachable tile.
- Clicking a tile while a unit was selected could spend movement accidentally; inspection and orders were not safely separated.
- There was no obvious way to clear selection.
- Archer range used Manhattan distance, so an offset target two rows and one column away incorrectly appeared out of range.
- Enemy city health and armour were not visible enough.
- The defeat screen named the winner but did not explain the exact triggering condition. A city recapture and rival objective completion happened in the same turn, so causality was unclear.

## Interaction repair implemented after second playtest

- Eight-direction movement.
- Automatic pathfinding to a farther tile, consuming available movement points and stopping partway when needed.
- Explicit action modes: ordinary tile clicks inspect only; movement occurs only after choosing `Идти`.
- Selection can be cleared through a button, repeated object click, `Escape` or right click.
- Archer and attack range now use square/Chebyshev distance, so an offset of two by one counts as range two.
- City health bar, HP and armour are visible on the map and in inspection/combat messages.
- Locked production cards name the required technology.
- World progress shows every civilization against the same city/knowledge objective.
- Terminal screen records the exact reason, winner progress and final chronicle events.
- Starvation now trims worked tiles immediately, preventing an invalid save after population loss.

## Engineering evidence for the interaction repair

Local mirror reconstructed from branch files on 2026-08-03:

- JavaScript syntax checks: pass for world, simulation, controller, persistence, main UI and map modules.
- `node --test`: **24/24 passed**.
- Command-level campaign smoke: player victory on turn **47**, including exploration, cities, queues, production, improvements, rivals, battle, capture/loss and save/reload evidence.
- Production build script: pass; static `dist/` created.
- GitHub Actions were not run.

## Re-test checklist

Run from the permanent GitHub Pages preview after deployment and hard refresh.

- [ ] Diagonal movement works.
- [ ] Clicking a farther reachable tile makes the unit follow an automatic route up to its available movement.
- [ ] Normal tile inspection never spends movement unless `Идти`, `Атаковать` or `Улучшить землю` is active.
- [ ] Selection can be cleared using the visible button, repeated click, Escape and right click.
- [ ] An archer can attack an enemy offset by two cells on one axis and one on the other.
- [ ] Enemy cities show health and armour before an attack.
- [ ] The world panel makes rival victory progress understandable.
- [ ] A terminal result states the exact reason for victory or defeat.

## First-ten-minute product checklist

- [x] Within 30 seconds, identify capital, scout, settler and warrior.
- [x] Open the capital and compare production choices.
- [x] Understand research dependencies and unlocks.
- [x] Recognize a useful ranged-combat role.
- [ ] Move and inspect the map without accidental orders.
- [ ] Understand a rival's victory before the terminal screen appears.
- [ ] Confirm the revised result screen explains the final causal event.

## Graphics scope

Current vector/browser-native graphics are functional readability assets, not final art. Final character art, animation, effects, sound and broader visual polish remain later production work. The Human Product Gate still requires current symbols to be distinguishable and usable; it does not require final commercial art at this stage.

## Human Product Gate

Status: **pending focused re-test**.

The build must not be called alpha or release until the remaining interaction and outcome-clarity checks pass in a real browser.
