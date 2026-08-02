# Release Gates

## General rule

A release number is earned by evidence. It is not assigned because work has lasted a long time or because a PR is large.

Every release must pass:

- product identity;
- mandatory systems;
- interface access to those systems;
- persistence where relevant;
- automated rules and scenario checks;
- required playtest path;
- build/launch reproducibility;
- honest limitations.

## 0.1 Foundation — complete

Technical foundation with generated map, fog, basic persistent actors, settlements, economy, research, save/load, camera and deterministic checks.

It is not a finished game.

## 0.2 Ancient World Alpha

A fresh player can play a complete ancient-era 4X campaign to victory or defeat.

Required:

- readable map objects and actions;
- independently manageable cities;
- territory and tile use;
- production queues;
- multiple unit roles;
- combat and city capture;
- at least two rival civilizations plus independent actors;
- meaningful ancient progression;
- campaign objective and terminal outcome;
- save/reload of the whole campaign;
- deterministic terminal smoke scenario.

## 0.3 Economy and Diplomacy

Required:

- strategic resource constraints;
- tile improvements and specialization;
- trade routes or logistics;
- diplomacy state and readable relations;
- agreements with enforceable effects;
- AI use of economic and diplomatic systems;
- non-war strategic path that is viable.

## 0.4 Classical-to-Medieval Transformation

Required:

- materially different era rules/content;
- government/institution choice;
- broader technology/civic tree;
- wonders or comparable strategic projects;
- culture/religion/belief system if retained by design;
- campaign continuity across era transition.

## 0.5 Living World

Required:

- persistent named actors where useful;
- migration or population movement;
- independent peoples that can transform;
- rebellion, union, collapse or successor-state mechanics;
- history ledger generated from simulation;
- AI participation in these systems.

## 0.7 Full Campaign

Required:

- several eras through a late game;
- multiple integrated victory paths;
- complete world-scale pacing;
- stable long saves;
- coherent war, diplomacy, economy and progression through the full arc;
- at least one full campaign playtest to each victory path.

## 0.9 Beta

Required:

- strategic AI that can finish campaigns;
- multiple civilizations and map configurations;
- difficulty options;
- onboarding and accessibility baseline;
- performance targets;
- save migrations;
- broad content and balance passes;
- no known blocker in the main campaign loop.

## 1.0 Release Candidate

Required:

- complete supported campaign;
- stable packaging and installation/launch flow;
- final visual language and supported audio/art pipeline;
- clear settings, help, accessibility and error recovery;
- full regression suite;
- release documentation;
- no critical or high-severity known defects;
- release-readiness declaration with evidence and accepted limitations.

## Release-readiness declaration

Before promoting a release, record:

```text
Product complete for target gate: yes/no
Mandatory criteria passed: yes/no
Automated checks: ...
Playtest paths completed: ...
Release blockers: ...
Accepted limitations: ...
Save compatibility: ...
Build/package created: ...
```

A `no` does not trigger endless polishing. Complete the remaining bounded repair or keep the release candidate as a draft and document why the gate is not passed.
