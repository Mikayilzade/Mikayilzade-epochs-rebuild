# Эпохи — rebuild

This repository is the clean implementation target for rebuilding the existing map strategy `Mikayilzade/Epohi`.

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

Первый вертикальный срез реализован: генерируемая тайловая карта, туман войны, постоянные отряды, поселения, экономика, исследования с реальными постройками за производство, автономная угроза и локальные сохранения. Это новая модульная реализация, не код закрытого PR и не фиксированный граф регионов.

## Read order for agents

1. `AGENTS.md`
2. `VISION.md`
3. `SOURCE_AUDIT.md`
4. `reference/LEGACY_SOURCE_EVIDENCE.md`
5. exact files under `reference/legacy-snapshot/`
6. `STATE.md`
7. `MISSION.md`
8. `QUALITY.md`
9. `ARCHITECTURE.md`
10. `DECISIONS.md`
11. `PLAYTEST.md`

## Identity in one sentence

A mobile-friendly turn-based civilization strategy on a generated tile map with exploration, persistent units, settlements, economy, progression, saves, and an independently acting world.

## Next production mission

Implement the finite scope in `MISSION.md` as one coherent runnable vertical slice. Do not reinterpret the game as a card-based narrative.

GitHub Actions are disabled unless the mission explicitly permits them. Run checks locally and return one draft PR.
