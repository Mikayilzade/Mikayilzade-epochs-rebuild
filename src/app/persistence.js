import {
  BUILDINGS,
  CIVS,
  IMPROVEMENTS,
  RESOURCES,
  TECHS,
  TERRAIN,
  UNIT_TYPES
} from "../content/config.js";

export const SAVE_KEY = "epohi-rebuild-campaign";
export const SAVE_SCHEMA_VERSION = 2;

const integer = (value, minimum = 0) => Number.isInteger(value) && value >= minimum;
const finite = value => Number.isFinite(value) && value >= 0;
const unique = values => new Set(values).size === values.length;

function validPosition(entity, map) {
  return integer(entity?.x) && integer(entity?.y) &&
    entity.x < map.width && entity.y < map.height;
}

function validResearch(research) {
  if (!research || !Array.isArray(research.completed) || !unique(research.completed)) return false;
  if (research.completed.some(id => !TECHS[id])) return false;
  if (research.completed.some(id =>
    TECHS[id].requires?.some(required => !research.completed.includes(required)))) return false;
  if (research.active !== null && (!TECHS[research.active] ||
    research.completed.includes(research.active) ||
    TECHS[research.active].requires?.some(id => !research.completed.includes(id)))) return false;
  if (!finite(research.progress)) return false;
  if (research.active === null) return research.progress === 0;
  return research.progress < TECHS[research.active].cost;
}

function validQueue(queue) {
  if (queue === null) return true;
  if (!queue || !["unit", "building"].includes(queue.kind)) return false;
  const definition = queue.kind === "unit" ? UNIT_TYPES[queue.id] : BUILDINGS[queue.id];
  return Boolean(definition) && finite(queue.progress) &&
    queue.cost === definition.cost && queue.progress <= queue.cost;
}

function validCivilizations(game) {
  if (!Array.isArray(game.civilizations) ||
    game.civilizations.length !== Object.keys(CIVS).length ||
    !unique(game.civilizations.map(item => item.id))) return false;
  return game.civilizations.every(item => {
    const resources = item.resources;
    return CIVS[item.id] && typeof item.name === "string" &&
      typeof item.color === "string" && typeof item.defeated === "boolean" &&
      resources && ["food", "production", "science"].every(key => finite(resources[key])) &&
      validResearch(item.research);
  });
}

function validKnowledge(game) {
  if (!game.knowledge || Object.keys(CIVS).some(id => !Array.isArray(game.knowledge[id]))) return false;
  return Object.keys(CIVS).every(id => {
    const indices = game.knowledge[id];
    return unique(indices) && indices.every(index => integer(index) && index < game.map.tiles.length);
  });
}

export function validateGame(game) {
  if (!game || game.schemaVersion !== SAVE_SCHEMA_VERSION || !integer(game.turn, 1) ||
    !["player", "world"].includes(game.phase) ||
    !["playing", "victory", "defeat"].includes(game.status)) return false;

  const map = game.map;
  if (!integer(map?.width, 1) || !integer(map?.height, 1) ||
    map.tiles?.length !== map.width * map.height) return false;
  if (!map.tiles.every((tile, index) => {
    const improvement = tile.improvement;
    return tile?.x === index % map.width && tile.y === Math.floor(index / map.width) &&
      TERRAIN[tile.terrain] && typeof tile.revealed === "boolean" &&
      (tile.owner === null || CIVS[tile.owner]) &&
      (tile.resource === null || RESOURCES[tile.resource]) &&
      (improvement === null || (IMPROVEMENTS[improvement] &&
        IMPROVEMENTS[improvement].terrains.includes(tile.terrain) && tile.owner));
  })) return false;
  if (!validCivilizations(game) || !validKnowledge(game)) return false;

  if (!Array.isArray(game.units) || !unique(game.units.map(unit => unit.id))) return false;
  const occupied = new Set();
  for (const unit of game.units) {
    const definition = UNIT_TYPES[unit.type];
    const position = `${unit.x}:${unit.y}`;
    if (typeof unit.id !== "string" || !definition || !CIVS[unit.owner] ||
      !validPosition(unit, map) || occupied.has(position) ||
      !integer(unit.movement) || unit.movement > definition.movement ||
      !finite(unit.health) || unit.health <= 0 || unit.health > definition.maxHealth + 10 ||
      typeof unit.fortified !== "boolean") return false;
    occupied.add(position);
  }

  if (!Array.isArray(game.cities) || !unique(game.cities.map(city => city.id))) return false;
  const claimed = new Set();
  for (const city of game.cities) {
    if (typeof city.id !== "string" || typeof city.name !== "string" || !city.name.trim() ||
      !CIVS[city.owner] || !validPosition(city, map) || !integer(city.population, 1) ||
      !finite(city.food) || !finite(city.health) || city.health <= 0 ||
      !finite(city.maxHealth) || city.health > city.maxHealth || !finite(city.defence) ||
      !Array.isArray(city.buildings) || !unique(city.buildings) ||
      city.buildings.some(id => !BUILDINGS[id]) ||
      !Array.isArray(city.territory) || !unique(city.territory) ||
      !Array.isArray(city.worked) || !unique(city.worked) || !validQueue(city.queue)) return false;
    const cityIndex = city.y * map.width + city.x;
    if (!city.territory.includes(cityIndex) ||
      city.worked.some(index => !city.territory.includes(index)) ||
      city.worked.length > city.population + 1) return false;
    for (const index of city.territory) {
      if (!integer(index) || index >= map.tiles.length || claimed.has(index) ||
        map.tiles[index].owner !== city.owner) return false;
      claimed.add(index);
    }
  }

  const entityIds = new Set([...game.units, ...game.cities].map(item => item.id));
  if (entityIds.size !== game.units.length + game.cities.length) return false;
  if (game.selected !== null) {
    const selected = [...game.units, ...game.cities].find(item => item.id === game.selected?.id);
    if (!["unit", "city"].includes(game.selected?.kind) || !selected ||
      selected.owner !== "player" ||
      (game.selected.kind === "unit") !== game.units.includes(selected)) return false;
  }
  if (!Array.isArray(game.log) || game.log.some(entry => typeof entry !== "string")) return false;
  if (game.status === "playing" && (game.winner !== null || game.summary !== null)) return false;
  if (game.status !== "playing" && (!CIVS[game.winner] || !game.summary ||
    !integer(game.summary.turn, 1) || !integer(game.summary.cities) ||
    !integer(game.summary.techs) || !integer(game.summary.battles) ||
    (game.summary.reason !== undefined && typeof game.summary.reason !== "string") ||
    (game.summary.winnerCities !== undefined && !integer(game.summary.winnerCities)) ||
    (game.summary.winnerTechs !== undefined && !integer(game.summary.winnerTechs)))) return false;
  return true;
}

export function serialize(state) {
  return JSON.stringify({
    schemaVersion: SAVE_SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    game: state
  });
}

export function deserialize(raw) {
  if (!raw) return { ok: false, error: "Сохранение отсутствует." };
  try {
    const data = JSON.parse(raw);
    if (data.schemaVersion === 1) {
      return {
        ok: false,
        error: "Сохранение 0.1 несовместимо с новой картой. Начните Ancient World 0.2."
      };
    }
    if (data.schemaVersion !== SAVE_SCHEMA_VERSION) {
      return { ok: false, error: "Версия сохранения не поддерживается." };
    }
    if (!validateGame(data.game)) return { ok: false, error: "Сохранение повреждено." };
    return { ok: true, state: data.game };
  } catch {
    return { ok: false, error: "Сохранение повреждено и отклонено." };
  }
}

export function saveGame(state, storage = globalThis.localStorage) {
  if (!storage?.setItem) throw new Error("Хранилище сохранений недоступно.");
  storage.setItem(SAVE_KEY, serialize(state));
  return true;
}

export function loadGame(storage = globalThis.localStorage) {
  if (!storage?.getItem) return { ok: false, error: "Хранилище сохранений недоступно." };
  return deserialize(storage.getItem(SAVE_KEY));
}
