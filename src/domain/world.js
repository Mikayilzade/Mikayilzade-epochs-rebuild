import { CIVS, MAP, TERRAIN, UNIT_TYPES } from "../content/config.js";
import { hashSeed, rng } from "./random.js";

export const indexOf = (x, y, width = MAP.width) => y * width + x;
export const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
export const rangeDistance = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));

const DIRECTIONS = [
  { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 },
  { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }
];

export function neighbors(state, position) {
  return DIRECTIONS
    .map(step => ({ x: position.x + step.x, y: position.y + step.y }))
    .filter(next => next.x >= 0 && next.y >= 0 &&
      next.x < state.map.width && next.y < state.map.height);
}

export function reveal(state, position, radius, owner = "player") {
  state.knowledge[owner] ??= [];
  const known = new Set(state.knowledge[owner]);
  for (let y = 0; y < state.map.height; y += 1) {
    for (let x = 0; x < state.map.width; x += 1) {
      if (rangeDistance(position, { x, y }) <= radius) {
        known.add(indexOf(x, y, state.map.width));
      }
    }
  }
  state.knowledge[owner] = [...known].sort((a, b) => a - b);
  if (owner === "player") {
    for (const tileIndex of known) state.map.tiles[tileIndex].revealed = true;
  }
}

function unit(id, type, owner, x, y) {
  return {
    id,
    type,
    owner,
    x,
    y,
    movement: UNIT_TYPES[type].movement,
    health: UNIT_TYPES[type].maxHealth,
    fortified: false
  };
}

function city(id, name, owner, x, y) {
  return {
    id,
    name,
    owner,
    x,
    y,
    population: 2,
    food: 0,
    health: 100,
    maxHealth: 100,
    defence: 20,
    buildings: [],
    queue: null,
    territory: [],
    worked: []
  };
}

export function generateWorld(seed) {
  const random = rng(hashSeed(seed));
  const tiles = [];
  for (let y = 0; y < MAP.height; y += 1) {
    for (let x = 0; x < MAP.width; x += 1) {
      const edge = x === 0 || y === 0 || x === MAP.width - 1 || y === MAP.height - 1;
      const value = random();
      const terrain = edge && value < .75 ? "water"
        : value < .1 ? "water"
          : value < .25 ? "forest"
            : value < .37 ? "hills"
              : value < .43 ? "mountains"
                : value < .52 ? "desert"
                  : "plains";
      tiles.push({
        x,
        y,
        terrain,
        revealed: false,
        resource: terrain === "hills" && random() < .2 ? "Медь"
          : terrain === "forest" && random() < .2 ? "Дичь" : null,
        owner: null,
        improvement: null
      });
    }
  }

  const starts = [
    { x: 3, y: 4 }, { x: 15, y: 3 }, { x: 15, y: 10 },
    { x: 9, y: 11 }, { x: 10, y: 6 }
  ];
  for (const position of starts) {
    for (let y = position.y - 2; y <= position.y + 2; y += 1) {
      for (let x = position.x - 2; x <= position.x + 2; x += 1) {
        if (x > 0 && y > 0 && x < MAP.width - 1 && y < MAP.height - 1 &&
            !TERRAIN[tiles[indexOf(x, y)].terrain].passable) {
          tiles[indexOf(x, y)].terrain = (x + y) % 3 ? "plains" : "forest";
        }
      }
    }
  }
  return { width: MAP.width, height: MAP.height, tiles, starts };
}

export function claimTerritory(state, targetCity) {
  const claimedByOthers = new Set(state.cities
    .filter(cityItem => cityItem.id !== targetCity.id)
    .flatMap(cityItem => cityItem.territory));
  const available = state.map.tiles
    .filter(tile => distance(tile, targetCity) <= 2 &&
      !claimedByOthers.has(indexOf(tile.x, tile.y, state.map.width)) &&
      (!tile.owner || tile.owner === targetCity.owner))
    .sort((a, b) => distance(a, targetCity) - distance(b, targetCity) ||
      a.y - b.y || a.x - b.x)
    .slice(0, 9);
  targetCity.territory = available.map(tile => indexOf(tile.x, tile.y, state.map.width));
  for (const tileIndex of targetCity.territory) state.map.tiles[tileIndex].owner = targetCity.owner;
  targetCity.worked = targetCity.territory.slice(0,
    Math.min(targetCity.population + 1, targetCity.territory.length));
}

export function createGame(seed = "epohi-2") {
  const map = generateWorld(seed);
  const state = {
    schemaVersion: 2,
    seed,
    turn: 1,
    phase: "player",
    map,
    knowledge: { player: [], ochre: [], river: [], independent: [] },
    civilizations: Object.entries(CIVS).map(([id, definition]) => ({
      id,
      ...definition,
      research: { active: null, progress: 0, completed: [] },
      resources: { food: 8, production: 0, science: 0 },
      defeated: false
    })),
    units: [
      unit("p-scout", "scout", "player", 3, 4),
      unit("p-settler", "settler", "player", 4, 4),
      unit("p-warrior", "warrior", "player", 3, 5),
      unit("o-warrior", "warrior", "ochre", 15, 4),
      unit("r-warrior", "warrior", "river", 15, 9),
      unit("i-raider-1", "raider", "independent", 9, 11),
      unit("i-raider-2", "raider", "independent", 10, 6)
    ],
    cities: [
      city("c-dawn", "Заря", "player", 3, 4),
      city("c-ochre", "Охра", "ochre", 15, 3),
      city("c-river", "Излучина", "river", 15, 10)
    ],
    selected: { kind: "unit", id: "p-scout" },
    status: "playing",
    winner: null,
    summary: null,
    log: ["Ход 1. Заря начинает летопись древнего мира."],
    tutorial: { dismissed: false }
  };
  for (const targetCity of state.cities) claimTerritory(state, targetCity);
  for (const targetUnit of state.units) {
    reveal(state, targetUnit, UNIT_TYPES[targetUnit.type].vision, targetUnit.owner);
  }
  return state;
}

function occupiedByOtherUnit(state, unitItem, position) {
  return state.units.some(other => other.id !== unitItem.id &&
    other.x === position.x && other.y === position.y);
}

function hostileCityAt(state, unitItem, position) {
  return state.cities.some(cityItem => cityItem.owner !== unitItem.owner &&
    cityItem.x === position.x && cityItem.y === position.y);
}

function canEnter(state, unitItem, position) {
  const tile = state.map.tiles[indexOf(position.x, position.y, state.map.width)];
  return Boolean(tile && TERRAIN[tile.terrain].passable &&
    !occupiedByOtherUnit(state, unitItem, position) &&
    !hostileCityAt(state, unitItem, position));
}

export function findPath(state, unitItem, target) {
  if (!unitItem || target.x < 0 || target.y < 0 ||
      target.x >= state.map.width || target.y >= state.map.height) return null;
  if (unitItem.x === target.x && unitItem.y === target.y) return [];
  if (!canEnter(state, unitItem, target)) return null;

  const startKey = `${unitItem.x}:${unitItem.y}`;
  const targetKey = `${target.x}:${target.y}`;
  const queue = [{ x: unitItem.x, y: unitItem.y }];
  const previous = new Map([[startKey, null]]);

  while (queue.length) {
    const current = queue.shift();
    for (const next of neighbors(state, current)) {
      const key = `${next.x}:${next.y}`;
      if (previous.has(key) || !canEnter(state, unitItem, next)) continue;
      previous.set(key, current);
      if (key === targetKey) {
        const path = [next];
        let cursor = current;
        while (cursor && `${cursor.x}:${cursor.y}` !== startKey) {
          path.push(cursor);
          cursor = previous.get(`${cursor.x}:${cursor.y}`);
        }
        return path.reverse();
      }
      queue.push(next);
    }
  }
  return null;
}

export function reachableTiles(state, unitItem) {
  if (!unitItem || unitItem.movement < 1) return [];
  const queue = [{ x: unitItem.x, y: unitItem.y, cost: 0 }];
  const best = new Map([[`${unitItem.x}:${unitItem.y}`, 0]]);
  const result = [];
  while (queue.length) {
    const current = queue.shift();
    if (current.cost >= unitItem.movement) continue;
    for (const next of neighbors(state, current)) {
      const nextCost = current.cost + 1;
      const key = `${next.x}:${next.y}`;
      if (!canEnter(state, unitItem, next) || (best.has(key) && best.get(key) <= nextCost)) continue;
      best.set(key, nextCost);
      result.push({ ...next, cost: nextCost });
      queue.push({ ...next, cost: nextCost });
    }
  }
  return result;
}

export function canMove(state, unitItem, target) {
  if (!unitItem || unitItem.owner !== "player") return { ok: false, reason: "Это не ваш отряд." };
  if (unitItem.movement < 1) return { ok: false, reason: "Движение исчерпано." };
  const path = findPath(state, unitItem, target);
  if (!path) return { ok: false, reason: "До этой клетки нет доступного пути." };
  if (!path.length) return { ok: false, reason: "Отряд уже находится на этой клетке." };
  if (path.length > unitItem.movement) {
    return { ok: false, reason: `До клетки ${path.length} шагов, сейчас доступно ${unitItem.movement}.` };
  }
  return { ok: true, path };
}

export function moveUnit(state, id, target) {
  const unitItem = state.units.find(candidate => candidate.id === id);
  if (!unitItem || unitItem.owner !== "player") return { ok: false, reason: "Это не ваш отряд." };
  if (unitItem.movement < 1) return { ok: false, reason: "Движение исчерпано." };
  const path = findPath(state, unitItem, target);
  if (!path) return { ok: false, reason: "До этой клетки нет доступного пути." };
  if (!path.length) return { ok: false, reason: "Отряд уже находится на этой клетке." };

  const steps = Math.min(unitItem.movement, path.length);
  const destination = path[steps - 1];
  unitItem.x = destination.x;
  unitItem.y = destination.y;
  unitItem.movement -= steps;
  unitItem.fortified = false;
  reveal(state, unitItem, UNIT_TYPES[unitItem.type].vision, unitItem.owner);
  const reached = steps === path.length;
  return {
    ok: true,
    reached,
    steps,
    remaining: path.length - steps,
    message: reached
      ? `Отряд прошёл ${steps} ${steps === 1 ? "клетку" : "клетки"}.`
      : `Отряд прошёл ${steps} клетки по маршруту. До цели осталось ${path.length - steps}.`
  };
}
