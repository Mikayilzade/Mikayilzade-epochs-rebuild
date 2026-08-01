import { TERRAIN, UNIT_TYPES } from "../content/config.js";

export const SAVE_KEY = "epohi-rebuild-campaign";
export const SAVE_SCHEMA_VERSION = 1;

const integer = (value, minimum = 0) => Number.isInteger(value) && value >= minimum;
const positionIsValid = (entity, map) =>
  integer(entity?.x) && integer(entity?.y) && entity.x < map.width && entity.y < map.height;

function validateGame(game) {
  if (!game || !integer(game.turn, 1) || game.phase !== "player") return false;
  if (!integer(game.map?.width, 1) || !integer(game.map?.height, 1)) return false;
  if (game.map.width * game.map.height !== game.map.tiles?.length) return false;
  if (!game.map.tiles.every((tile, index) =>
    tile?.x === index % game.map.width &&
    tile?.y === Math.floor(index / game.map.width) &&
    Object.hasOwn(TERRAIN, tile.terrain) &&
    typeof tile.revealed === "boolean")) return false;
  if (!game.resources || !["food", "production", "science"].every(key =>
    Number.isFinite(game.resources[key]) && game.resources[key] >= 0)) return false;
  if (!Array.isArray(game.units) || !game.units.every(unit =>
    typeof unit.id === "string" &&
    Object.hasOwn(UNIT_TYPES, unit.type) &&
    ["player", "ai"].includes(unit.owner) &&
    positionIsValid(unit, game.map) &&
    integer(unit.movement) && unit.movement <= UNIT_TYPES[unit.type].movement)) return false;
  if (new Set(game.units.map(unit => unit.id)).size !== game.units.length) return false;
  if (!Array.isArray(game.settlements) || game.settlements.length < 1 ||
    !game.settlements.every(settlement => positionIsValid(settlement, game.map) &&
      typeof settlement.name === "string" && integer(settlement.population, 1) &&
      integer(settlement.development))) return false;
  if (!Array.isArray(game.research?.completed) ||
    (game.selectedUnitId !== null && !game.units.some(unit => unit.id === game.selectedUnitId))) return false;
  return Array.isArray(game.log);
}

export function serialize(state) {
  return JSON.stringify({ schemaVersion: SAVE_SCHEMA_VERSION, savedAt: new Date().toISOString(), game: state });
}

export function deserialize(raw) {
  if (!raw) return { ok: false, error: "Сохранение отсутствует." };
  try {
    const data = JSON.parse(raw);
    if (data.schemaVersion !== SAVE_SCHEMA_VERSION) {
      return { ok: false, error: "Версия сохранения не поддерживается." };
    }
    if (!validateGame(data.game)) return { ok: false, error: "Сохранение повреждено." };
    return { ok: true, state: data.game };
  } catch {
    return { ok: false, error: "Сохранение повреждено и было безопасно отклонено." };
  }
}

export function saveGame(state, storage = localStorage) {
  storage.setItem(SAVE_KEY, serialize(state));
  return true;
}

export function loadGame(storage = localStorage) {
  return deserialize(storage.getItem(SAVE_KEY));
}
