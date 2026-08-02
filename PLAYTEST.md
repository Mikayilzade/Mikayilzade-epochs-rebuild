# Playtest Record — Ancient World Alpha 0.2

Status: deterministic full-system terminal path **PASS**; real-browser visual pass pending because no browser executable is installed.

## Reproducible campaign

- Date/build: 2026-08-02, current M1 branch.
- Seed: `campaign-alpha-02`.
- Runtime: Node.js v24.15; `npm run smoke`.
- Path: create generated world → verify player/two rivals/independents → move scout and reveal terrain → open capital and select warrior queue → choose Agriculture → resolve six world turns while rival research/production and raider actions execute → found second city → choose its independent granary queue → create a worker improvement on its controlled tile → schema-2 save/reload → destroy an Ochre unit → reduce and melee-capture Ochre city → satisfy the combined four-city/eight-technology objective in the deterministic terminal fixture → save/reload the victory result.
- Result: terminal player victory, preserved result and chronicle, no blocker or exception.

The terminal fixture accelerates final objective state after proving each contributing subsystem; it is a deterministic regression scenario, not a balance-duration claim. Normal interactive pacing targets roughly 40–100 turns and remains a balance subject for M2.

## Automated observations

- Map contains 280 seeded tiles, varied terrain, fog and separated civilization starts.
- Every city has an independent production queue and controlled/worked territory.
- Melee damage, destruction and city capture were observed; focused tests additionally cover ranged no-retaliation.
- Both rivals choose research/production and move/attack in the ordinary end-turn phase; independent raiders use distinct all-factions hostility.
- Save/reload preserved queues, territory, health, AI research, improvements and outcome. Malformed schema 2 and legacy schema 1 fail safely.

## Visual/accessibility checklist pending

When a browser is available, inspect at 1440 × 900 and 390 × 844: readable faction colours and symbols, reachable overlay, territory borders, combat confirmation, tabs/object cycling, production catalog, result dialog, keyboard focus and touch pan/zoom. No visual pass is claimed from Node-only evidence.

## Release declaration

Product complete for target gate: **yes**. Mandatory criteria passed: **yes, programmatically; visual pass pending but non-blocking for draft**. Automated checks: 12/12 plus terminal smoke/build/syntax/diff. Release blockers: none found. Accepted limitations: bounded AI, deterministic citizen allocation, one save slot, no diplomacy/trade, pending browser visual pass. Save compatibility: schema 2 round-trip; schema 1 explicitly rejected. Build/package: static `dist/` created.
