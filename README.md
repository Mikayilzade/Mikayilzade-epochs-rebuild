# Эпохи — rebuild

This repository is rebuilding the existing map strategy `Mikayilzade/Epohi` into a complete standalone civilization-scale 4X game.

## Играть локально

Нужен Node.js 20 или новее. Установка внешних зависимостей не требуется.

В PowerShell используйте:

```powershell
npm.cmd run dev
```

В обычном терминале:

```bash
npm run dev
```

Откройте `http://127.0.0.1:4173`.

Production-сборка и её просмотр:

```bash
npm run build
npm run preview
```

Статические файлы появятся в `dist/`. Инженерные проверки: `npm test` и `npm run smoke`.

## Current status

Honest maturity: **technical prototype — human gate pending**.

The repository contains a substantial ancient-world engineering foundation: generated map and fog, persistent cities and units, production queues, territory, improvements, research, deterministic combat/capture, two rivals, independent raiders, victory/defeat and validated saves.

A real desktop playtest showed that the previous interface did not make those systems understandable or satisfying. Draft PR #7 is therefore not accepted as an alpha.

The active branch `agent/first-ten-minutes` repairs one coherent experience slice:

- readable vector map symbols rather than letter-only tokens;
- an owned city/unit roster;
- explicit unit actions and feedback;
- a real city-management panel;
- production cost, progress, turns and effects;
- research prerequisites and progress;
- a dynamic first-steps objective tracker;
- terrain patterns, resource detail and richer hover feedback.

The build may be promoted to a playable slice only after a real human first-ten-minute test passes.

## Production program

- `PROGRAM.md` — final product target and pillars.
- `MISSION.md` — current finite outcome.
- `NEXT_MISSION.md` — active experience-repair mission.
- `QUALITY.md` — engineering and Human Product Gate criteria.
- `PLAYTEST.md` — real human test record.
- `ROADMAP.tsv` — release sequence from 0.1 to 1.0.

## Identity in one sentence

A turn-based civilization strategy on a generated tile map with exploration, persistent cities and units, economy, conflict, era progression, saves and an independently acting world.

GitHub Actions remain disabled unless an active mission explicitly permits them.
