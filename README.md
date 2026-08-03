# Эпохи — rebuild

This repository is rebuilding the existing map strategy `Mikayilzade/Epohi` into a complete standalone civilization-scale 4X game.

## Играть в браузере

Постоянная тестовая версия публикуется через GitHub Pages:

`https://mikayilzade.github.io/Mikayilzade-epochs-rebuild/`

После обновления ветки `preview` может понадобиться 1–3 минуты и жёсткая перезагрузка `Ctrl + F5`.

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

The repository contains a substantial Ancient World engineering foundation: generated map and fog, cities and production queues, territory and improvements, unit roles, deterministic combat/capture, rival civilizations, technologies, victory/defeat and validated saves.

The current honest maturity is:

`technical prototype — focused Human Product Gate re-test pending`

Draft PR #8 repairs the first-ten-minute experience, including readable objects, city management, explicit actions, safe inspection, eight-direction pathfinding, understandable ranged combat and causal terminal results. It must pass a real human browser re-test before merge or an alpha claim.

## Production program

- `PROGRAM.md` — final product target and pillars.
- `AUTONOMOUS_CAMPAIGN.md` — how agents continue without micro-task supervision.
- `ROADMAP.tsv` — release sequence from 0.1 to 1.0.
- `NEXT_MISSION.md` — the active Human Product Gate recovery mission.
- `RELEASE_GATES.md` — evidence required to call each release complete.
- `PLAYTEST.md` — actual human findings and the focused re-test checklist.

## Read order for agents

Start with `AGENTS.md`; it contains the authoritative read order and production contract.

## Identity in one sentence

A turn-based civilization strategy on a generated tile map with exploration, persistent cities and units, economy, conflict, era progression, saves and an independently acting world.

GitHub Actions remain disabled unless the active mission explicitly permits them. Run checks locally and return one coherent draft PR per release mission.
