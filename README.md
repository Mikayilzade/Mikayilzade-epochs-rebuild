# Эпохи — rebuild

This repository is rebuilding the existing map strategy `Mikayilzade/Epohi` into a complete standalone civilization-scale 4X game.

## Играть локально

Нужен Node.js 20 или новее. Зависимости устанавливать не требуется.

```bash
npm run dev
```

Откройте `http://127.0.0.1:4173`. Для production-сборки и её проверки:

```bash
npm run build
npm run preview
```

Статические файлы появятся в `dist/`. Проверки: `npm test` и `npm run smoke`.

## Current status

Release `0.1 Foundation` is merged: generated tile map, fog of war, persistent units and settlements, economy, research, production spending, autonomous threat, validated saves, camera controls and deterministic checks.

This is the technical foundation, not the finished game.

The active program now develops the product through large autonomous release missions toward a complete 4X campaign.

## Production program

- `PROGRAM.md` — final product target and pillars.
- `AUTONOMOUS_CAMPAIGN.md` — how agents continue without micro-task supervision.
- `ROADMAP.tsv` — release sequence from 0.1 to 1.0.
- `NEXT_MISSION.md` — the full active release mission.
- `RELEASE_GATES.md` — evidence required to call each release complete.

The current active milestone is `M1 / 0.2 Ancient World Alpha`: a readable and finishable ancient-era campaign with real cities, production queues, territory, combat, rivals, independent actors, progression, victory and defeat.

## Read order for agents

Start with `AGENTS.md`; it contains the authoritative read order and production contract.

## Identity in one sentence

A turn-based civilization strategy on a generated tile map with exploration, persistent cities and units, economy, conflict, era progression, saves and an independently acting world.

GitHub Actions remain disabled unless the active mission explicitly permits them. Run checks locally and return one coherent draft PR per release mission.
