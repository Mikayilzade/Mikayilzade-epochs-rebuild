# Verified Current State

Updated: 2026-08-03 — **technical foundation preserved; Human Product Gate failed; experience-repair branch active**

## Engineering foundation present

- Deterministic generated 20 × 14 map with terrain, resources, fog, territory and improvements.
- Persistent player, two rivals and independent actors.
- Cities with population, growth, health/defence, worked territory, buildings and multi-turn production.
- Scout, settler, warrior, archer, worker and spearman definitions.
- Research, combat, capture, victory/defeat and schema-2 persistence.
- Automated domain tests and command-level campaign smoke.

## Human Product Gate result for draft PR #7

Result: **FAIL**.

A real Chrome desktop playtest found:

- map units were perceived as unexplained letters;
- unit roles and actions were not discoverable;
- city interaction did not feel like opening and managing a city;
- the interface exposed values but did not form a clear decision flow;
- the product felt severely limited despite extensive systems in code.

Therefore PR #7 is not an accepted Ancient World Alpha 0.2 release.

## Active repair direction

Branch `agent/first-ten-minutes` preserves the technical foundation and focuses on:

- vector/silhouette map language instead of letter-only tokens;
- visible entity roles and actions;
- a real city-management panel;
- owned-object roster and focus controls;
- contextual first-step objectives;
- terrain texture and detailed hover feedback;
- honest human re-test.

## Current maturity

`technical prototype — human gate pending`

## Current action

Complete M1R, run automated checks, then perform a new real-browser first-ten-minute playtest before any merge or alpha claim.
