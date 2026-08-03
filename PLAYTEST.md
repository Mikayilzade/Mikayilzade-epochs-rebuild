# Human Product Gate — First Ten Minutes

## Previous build

- Build: draft PR #7, Ancient World Alpha 0.2 claim.
- Environment: real desktop Chrome, 2026-08-03.
- Human reviewer: repository owner/player.
- Result: **FAIL**.

## Observed failure

- Units appeared as unexplained letter markers and lacked immediate identity.
- The player found almost no discoverable actions beyond horizontal/adjacent movement.
- Cities did not appear openable or meaningfully manageable.
- The interface contained data and instructions but did not create a clear action → consequence loop.
- The result felt like a constrained technical demo rather than a small 4X game.

Automated tests and a command-level terminal campaign had passed, proving simulation consistency but not human usability.

## Repair build under test

- Branch: `agent/first-ten-minutes`.
- Honest maturity before re-test: `technical prototype — human gate pending`.

## First-ten-minute test

Run from a clean/new campaign without reading README.

- [ ] Within 30 seconds, identify capital, scout, settler and warrior.
- [ ] Select the scout and understand movement, role and available actions.
- [ ] Move the scout and see newly revealed terrain.
- [ ] Select/open the capital from map and from the owned-object roster.
- [ ] Understand population, growth, yields, defence, buildings and queue.
- [ ] Choose production after comparing cost, turns and effect.
- [ ] Choose research and understand prerequisite/progress/unlock.
- [ ] Understand where and how settlers found a second city.
- [ ] Understand worker improvement and military attack before using them.
- [ ] End a turn and identify at least one visible consequence.
- [ ] Save and continue the same state.

## Core entity interaction contracts

### City

- [ ] Recognizable identity.
- [ ] Reliable selection.
- [ ] Understandable state.
- [ ] Multiple visible decisions.
- [ ] Blocked choices explain why.
- [ ] Production progress and completion are visible.

### Units

- [ ] Scout, settler, warrior, worker and ranged unit have distinct visual language.
- [ ] Role, health, movement and combat values are visible.
- [ ] Role actions are visible.
- [ ] Legal targets are highlighted.
- [ ] Invalid actions return useful feedback.

## Visual evidence to capture

- [ ] opening state;
- [ ] scout selected;
- [ ] capital selected/open;
- [ ] production choice;
- [ ] research progress;
- [ ] narrow/mobile state if supported.

## Independent product review

Reviewer must begin from the build, not the implementation report.

- Next action understandable without repository instructions: pass / fail / pending
- City feels manageable rather than decorative: pass / fail / pending
- Units feel like roles rather than tokens: pass / fail / pending
- First ten minutes create an understandable decision loop: pass / fail / pending

## Human Product Gate

Status: **pending re-test**.

The build must not be called alpha or release until this section records a real pass.
