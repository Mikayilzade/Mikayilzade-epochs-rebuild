# Active Release Mission M2 — Economy and Diplomacy 0.3

Status: **active after Ancient World Alpha 0.2**

## Mission statement

Extend the complete ancient campaign with an interdependent economy and enforceable diplomacy. Preserve the generated map, terminal objective, city queues/territory, tactical combat, rivals, independents and schema-2 campaign continuity.

## Mandatory systems

1. Add strategic resource deposits, extraction requirements, stockpiles and readable unit/building constraints.
2. Expand worker improvements and explicit tile allocation so cities can specialize in food, production, knowledge or commerce.
3. Implement spatial trade routes or logistics with capacity, risk, interruption and visible economic effects.
4. Add persistent relations, contact, war/peace state and at least three enforceable agreements such as peace, open borders, resource exchange or alliance.
5. Make rival AI evaluate resources, improvements, routes, specialization, relations and agreements rather than treating diplomacy as decoration.
6. Provide a viable non-conquest strategic path and integrate it with the existing dominance/development objective.
7. Persist and deeply validate all new economy/diplomacy state, including migration from accepted schema 2.
8. Add contextual onboarding, readable forecasts and a relations/economy interface usable on desktop and narrow layouts.

## Required verification

- Tests for deposits/extraction, stockpiles, allocation, specialization, route creation/yields/interruption, contact/relations, every agreement effect, war legality, AI economic/diplomatic choices, alternate victory/defeat and schema migration.
- One deterministic terminal smoke campaign that uses specialization, a strategic resource, an active trade/logistics route and at least two enforceable diplomatic state changes.
- Local build/server checks and a real-browser desktop/narrow playtest when available.

## Acceptance

M2 passes only when economy and diplomacy change player and AI decisions in the same finishable map campaign. Labels, relation numbers without actions, or bonuses without spatial/state consequences do not count. Do not expand into governments, religion or the medieval transformation planned for M3.
