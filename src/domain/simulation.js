import {
  BUILDINGS,
  CIVS,
  IMPROVEMENTS,
  RESOURCES,
  TECHS,
  TERRAIN,
  UNIT_TYPES,
  VICTORY
} from "../content/config.js";
import {
  claimTerritory,
  distance,
  indexOf,
  neighbors,
  rangeDistance,
  reveal
} from "./world.js";

export const civ = (state, id) => state.civilizations.find(item => item.id === id);

export function cityYield(state, city) {
  const output = { food: 1, production: 1, science: 1 };
  for (const tileIndex of city.worked) {
    const tile = state.map.tiles[tileIndex];
    const terrainYield = TERRAIN[tile.terrain].yield;
    for (const key in output) output[key] += terrainYield[key] || 0;
    if (tile.resource) {
      for (const key in output) output[key] += RESOURCES[tile.resource]?.yield[key] || 0;
    }
    if (tile.improvement) {
      for (const key in output) output[key] += IMPROVEMENTS[tile.improvement].yield[key] || 0;
    }
  }
  for (const buildingId of city.buildings) {
    for (const key in output) output[key] += BUILDINGS[buildingId].yield?.[key] || 0;
  }
  return output;
}

function available(state, owner, id, kind) {
  const data = kind === "unit" ? UNIT_TYPES[id] : BUILDINGS[id];
  const civilization = civ(state, owner);
  return data && (!data.requires || civilization.research.completed.includes(data.requires));
}

export function chooseProduction(state, cityId, kind, id) {
  const city = state.cities.find(item => item.id === cityId);
  if (!city || city.owner !== "player") return { ok: false, reason: "Выберите свой город." };
  const data = kind === "unit" ? UNIT_TYPES[id] : BUILDINGS[id];
  if (!data || !available(state, city.owner, id, kind) ||
      (kind === "building" && city.buildings.includes(id))) {
    return { ok: false, reason: "Проект пока недоступен." };
  }
  const retained = city.queue?.kind === kind && city.queue?.id === id ? city.queue.progress : 0;
  city.queue = { kind, id, progress: retained, cost: data.cost };
  return { ok: true, message: `${city.name}: выбран проект «${data.name}».` };
}

export function chooseResearch(state, id, owner = "player") {
  const civilization = civ(state, owner);
  const technology = TECHS[id];
  if (!technology || civilization.research.completed.includes(id) ||
      technology.requires?.some(required => !civilization.research.completed.includes(required))) {
    return { ok: false, reason: "Исследование заблокировано." };
  }
  civilization.research = { ...civilization.research, active: id, progress: 0 };
  return { ok: true, message: `Начато исследование «${technology.name}».` };
}

export function foundCity(state, unitId) {
  const settler = state.units.find(unit => unit.id === unitId);
  if (!settler || settler.type !== "settler") return { ok: false, reason: "Нужны поселенцы." };
  if (state.cities.some(city => distance(city, settler) < 4)) {
    return { ok: false, reason: "До другого города должно быть не менее 4 клеток." };
  }
  const tile = state.map.tiles[indexOf(settler.x, settler.y, state.map.width)];
  if (!TERRAIN[tile.terrain].passable || tile.owner) {
    return { ok: false, reason: "Эта земля не подходит." };
  }
  const city = {
    id: `c-${settler.owner}-${state.turn}-${settler.x}-${settler.y}`,
    name: settler.owner === "player"
      ? `Рубеж ${state.cities.filter(item => item.owner === settler.owner).length + 1}`
      : "Новый город",
    owner: settler.owner,
    x: settler.x,
    y: settler.y,
    population: 1,
    food: 0,
    health: 100,
    maxHealth: 100,
    defence: 20,
    buildings: [],
    queue: null,
    territory: [],
    worked: []
  };
  state.cities.push(city);
  claimTerritory(state, city);
  state.units = state.units.filter(unit => unit.id !== settler.id);
  if (settler.owner === "player") state.selected = { kind: "city", id: city.id };
  state.log.unshift(`${city.name} основан.`);
  return { ok: true, city, message: `${city.name} основан.` };
}

export function improveTile(state, unitId, tileIndex) {
  const worker = state.units.find(unit => unit.id === unitId);
  const tile = state.map.tiles[tileIndex];
  if (!worker || worker.type !== "worker" || !tile || rangeDistance(worker, tile) > 1 ||
      tile.owner !== worker.owner || tile.improvement) {
    return { ok: false, reason: "Работник может улучшить соседнюю контролируемую клетку." };
  }
  const improvementId = tile.terrain === "plains" ? "farm"
    : tile.terrain === "hills" ? "mine"
      : tile.terrain === "forest" ? "lumber" : null;
  if (!improvementId) return { ok: false, reason: "Здесь нет доступного улучшения." };
  tile.improvement = improvementId;
  worker.movement = 0;
  state.log.unshift(`Создано улучшение «${IMPROVEMENTS[improvementId].name}».`);
  return { ok: true, message: `Создано улучшение «${IMPROVEMENTS[improvementId].name}».` };
}

export function combatPreview(state, attacker, target) {
  const type = UNIT_TYPES[attacker.type];
  const tile = state.map.tiles[indexOf(target.x, target.y, state.map.width)];
  const defence = (target.health ? UNIT_TYPES[target.type]?.strength || target.defence : 20) +
    (TERRAIN[tile.terrain].defence || 0) + (target.fortified ? 3 : 0);
  const attackStrength = type.strength;
  const damage = Math.max(8, Math.round(24 * attackStrength / Math.max(8, defence)));
  const retaliation = type.role === "ranged" && rangeDistance(attacker, target) > 1
    ? 0
    : Math.max(5, Math.round(18 * defence / Math.max(8, attackStrength)));
  return { damage, retaliation };
}

export function attack(state, attackerId, targetId) {
  const attacker = state.units.find(unit => unit.id === attackerId);
  const target = state.units.find(unit => unit.id === targetId) ||
    state.cities.find(city => city.id === targetId);
  if (!attacker || !target || attacker.owner !== "player" || target.owner === attacker.owner) {
    return { ok: false, reason: "Недопустимая цель." };
  }
  const type = UNIT_TYPES[attacker.type];
  const targetDistance = rangeDistance(attacker, target);
  if (!type.strength || targetDistance > type.range || attacker.movement < 1) {
    return { ok: false, reason: `Цель вне дальности (${type.range}).` };
  }
  const preview = combatPreview(state, attacker, target);
  target.health -= preview.damage;
  attacker.health -= preview.retaliation;
  attacker.movement = 0;
  state.log.unshift(`${type.name} наносит ${preview.damage} урона${preview.retaliation ? `, получает ${preview.retaliation}` : " без ответа"}.`);

  if (target.health <= 0) {
    if ("population" in target) {
      if (type.role !== "melee") {
        target.health = 1;
      } else {
        const oldOwner = target.owner;
        target.owner = attacker.owner;
        target.health = 55;
        target.queue = null;
        for (const tileIndex of target.territory) state.map.tiles[tileIndex].owner = attacker.owner;
        attacker.x = target.x;
        attacker.y = target.y;
        state.log.unshift(`${target.name} захвачен у ${civ(state, oldOwner).name}!`);
      }
    } else {
      state.units = state.units.filter(unit => unit.id !== target.id);
      state.log.unshift(`${UNIT_TYPES[target.type].name} уничтожен.`);
    }
  }
  if (attacker.health <= 0) state.units = state.units.filter(unit => unit.id !== attacker.id);
  ensurePlayerSelection(state);
  checkOutcome(state);
  return { ok: true, preview, message: `Атака завершена: ${preview.damage} урона цели.` };
}

function completeProduction(state, city) {
  const queue = city.queue;
  if (!queue) return;
  const data = queue.kind === "unit" ? UNIT_TYPES[queue.id] : BUILDINGS[queue.id];
  if (queue.kind === "building") {
    if (!city.buildings.includes(queue.id)) {
      city.buildings.push(queue.id);
      city.defence += data.defence || 0;
      state.log.unshift(`${city.name}: завершено «${data.name}».`);
    }
  } else {
    const position = neighbors(state, city).find(candidate =>
      TERRAIN[state.map.tiles[indexOf(candidate.x, candidate.y, state.map.width)].terrain].passable &&
      !state.units.some(unit => unit.x === candidate.x && unit.y === candidate.y));
    if (!position) {
      queue.progress = queue.cost;
      return;
    }
    const id = `u-${city.owner}-${state.turn}-${state.units.length}`;
    state.units.push({
      id,
      type: queue.id,
      owner: city.owner,
      ...position,
      movement: 0,
      health: data.maxHealth + (city.buildings.includes("barracks") ? 10 : 0),
      fortified: false
    });
    state.log.unshift(`${city.name}: создан отряд «${data.name}».`);
  }
  city.queue = null;
}

function cityPhase(state, city) {
  const output = cityYield(state, city);
  const owner = civ(state, city.owner);
  owner.resources.food += output.food;
  owner.resources.production += output.production;
  owner.resources.science += output.science;
  city.food += output.food - Math.max(2, city.population * 2);
  if (city.food >= 12 + city.population * 5) {
    city.food -= 12 + city.population * 5;
    city.population += 1;
    claimTerritory(state, city);
    state.log.unshift(`${city.name} вырос: ${city.population}.`);
  }
  if (city.food < 0) {
    city.food = 0;
    if (city.population > 1) city.population -= 1;
  }
  city.worked = city.territory.slice(0, Math.min(city.population + 1, city.territory.length));
  if (city.queue) {
    city.queue.progress += output.production;
    if (city.queue.progress >= city.queue.cost) completeProduction(state, city);
  }
  city.health = Math.min(city.maxHealth, city.health + 5);
}

function pickResearch(state, owner) {
  const civilization = civ(state, owner);
  if (civilization.research.active) return;
  const id = Object.keys(TECHS).find(technologyId =>
    !civilization.research.completed.includes(technologyId) &&
    (!TECHS[technologyId].requires || TECHS[technologyId].requires.every(required =>
      civilization.research.completed.includes(required))));
  if (id) chooseResearch(state, id, owner);
}

function nearestEnemy(state, unit) {
  return [...state.units, ...state.cities]
    .filter(entity => entity.owner !== unit.owner)
    .sort((a, b) => rangeDistance(unit, a) - rangeDistance(unit, b))[0];
}

function aiPhase(state, owner) {
  pickResearch(state, owner);
  const cities = state.cities.filter(city => city.owner === owner);
  for (const city of cities) {
    if (city.queue) continue;
    const actor = civ(state, owner);
    const count = state.units.filter(unit => unit.owner === owner).length;
    const canSettle = actor.research.completed.includes("agriculture") &&
      cities.length < VICTORY.cities &&
      !state.units.some(unit => unit.owner === owner && unit.type === "settler");
    const unitId = canSettle ? "settler" : count < cities.length * 2 ? "warrior" : null;
    const buildingId = Object.keys(BUILDINGS).find(id =>
      !city.buildings.includes(id) &&
      (!BUILDINGS[id].requires || actor.research.completed.includes(BUILDINGS[id].requires)));
    if (unitId) city.queue = { kind: "unit", id: unitId, progress: 0, cost: UNIT_TYPES[unitId].cost };
    else if (buildingId) city.queue = { kind: "building", id: buildingId, progress: 0, cost: BUILDINGS[buildingId].cost };
    else city.queue = { kind: "unit", id: "warrior", progress: 0, cost: UNIT_TYPES.warrior.cost };
  }

  for (const unit of state.units.filter(item => item.owner === owner)) {
    if (unit.type === "settler") {
      if (!state.cities.some(city => distance(city, unit) < 4) &&
          !state.map.tiles[indexOf(unit.x, unit.y, state.map.width)].owner) {
        foundCity(state, unit.id);
        continue;
      }
      const options = neighbors(state, unit).filter(position =>
        TERRAIN[state.map.tiles[indexOf(position.x, position.y, state.map.width)].terrain].passable &&
        !state.units.some(other => other.x === position.x && other.y === position.y));
      options.sort((a, b) => Math.min(...state.cities.map(city => distance(b, city))) -
        Math.min(...state.cities.map(city => distance(a, city))));
      if (options[0]) Object.assign(unit, options[0]);
      continue;
    }

    const target = nearestEnemy(state, unit);
    if (!target) continue;
    if (UNIT_TYPES[unit.type].strength &&
        rangeDistance(unit, target) <= UNIT_TYPES[unit.type].range) {
      const preview = combatPreview(state, unit, target);
      target.health -= preview.damage;
      unit.health -= preview.retaliation;
      unit.movement = 0;
      state.log.unshift(`${civ(state, owner).name} вступает в бой.`);
      if (target.health <= 0) {
        if ("population" in target && UNIT_TYPES[unit.type].role === "melee") {
          const oldOwner = target.owner;
          target.owner = owner;
          target.health = 55;
          target.queue = null;
          for (const tileIndex of target.territory) state.map.tiles[tileIndex].owner = owner;
          state.log.unshift(`${civ(state, owner).name} захватывает ${target.name} у ${civ(state, oldOwner).name}.`);
        } else if ("population" in target) {
          target.health = 1;
        } else {
          state.units = state.units.filter(item => item.id !== target.id);
        }
      }
      continue;
    }

    const options = neighbors(state, unit).filter(position =>
      TERRAIN[state.map.tiles[indexOf(position.x, position.y, state.map.width)].terrain].passable &&
      !state.units.some(other => other.x === position.x && other.y === position.y));
    options.sort((a, b) => rangeDistance(a, target) - rangeDistance(b, target));
    if (options[0]) Object.assign(unit, options[0]);
    reveal(state, unit, UNIT_TYPES[unit.type].vision, owner);
  }
}

function terminalSummary(state, winner, reason) {
  const winnerCities = state.cities.filter(city => city.owner === winner).length;
  const winnerTechs = civ(state, winner)?.research.completed.length || 0;
  return {
    turn: state.turn,
    cities: state.cities.filter(city => city.owner === "player").length,
    techs: civ(state, "player").research.completed.length,
    battles: state.log.filter(entry => entry.includes("урона") || entry.includes("бой")).length,
    reason,
    winnerCities,
    winnerTechs
  };
}

export function checkOutcome(state) {
  if (state.status !== "playing") return state.status;
  const playerCities = state.cities.filter(city => city.owner === "player");
  const hasSettler = state.units.some(unit => unit.owner === "player" && unit.type === "settler");
  if (!playerCities.length && !hasSettler) {
    const contenders = state.civilizations
      .filter(item => !["player", "independent"].includes(item.id))
      .sort((a, b) => {
        const score = id => state.cities.filter(city => city.owner === id).length * 10 +
          civ(state, id).research.completed.length;
        return score(b.id) - score(a.id);
      });
    state.status = "defeat";
    state.winner = contenders[0]?.id || "independent";
    const reason = `${CIVS.player.name} потерял все города и не имеет поселенцев для продолжения.`;
    state.log.unshift(`Поражение: ${reason}`);
    state.summary = terminalSummary(state, state.winner, reason);
    return state.status;
  }

  for (const civilization of state.civilizations.filter(item => item.id !== "independent")) {
    const cityCount = state.cities.filter(city => city.owner === civilization.id).length;
    const technologyCount = civilization.research.completed.length;
    if (cityCount >= VICTORY.cities && technologyCount >= VICTORY.knowledge) {
      state.status = civilization.id === "player" ? "victory" : "defeat";
      state.winner = civilization.id;
      const reason = `${civilization.name} достигло цели: ${cityCount}/${VICTORY.cities} города и ${technologyCount}/${VICTORY.knowledge} знаний.`;
      state.log.unshift(`${state.status === "victory" ? "Победа" : "Поражение"}: ${reason}`);
      state.summary = terminalSummary(state, civilization.id, reason);
      return state.status;
    }
  }
  return state.status;
}

function ensurePlayerSelection(state) {
  if (state.selected === null) return;
  const all = [...state.units, ...state.cities];
  const selected = all.find(entity => entity.id === state.selected?.id);
  if (selected?.owner === "player") return;
  const next = state.units.find(unit => unit.owner === "player") ||
    state.cities.find(city => city.owner === "player");
  state.selected = next ? { kind: "population" in next ? "city" : "unit", id: next.id } : null;
}

export function endTurn(state) {
  if (state.phase !== "player" || state.status !== "playing") {
    return { ok: false, reason: "Кампания завершена или ход уже идёт." };
  }
  state.phase = "world";
  for (const city of state.cities) cityPhase(state, city);
  for (const civilization of state.civilizations) {
    const research = civilization.research;
    if (!research.active) continue;
    research.progress += civilization.resources.science;
    civilization.resources.science = 0;
    if (research.progress >= TECHS[research.active].cost) {
      research.completed.push(research.active);
      state.log.unshift(`${civilization.name}: открыто «${TECHS[research.active].name}».`);
      research.active = null;
      research.progress = 0;
    }
  }
  aiPhase(state, "ochre");
  aiPhase(state, "river");
  aiPhase(state, "independent");
  state.units = state.units.filter(unit => unit.health > 0);
  state.turn += 1;
  for (const unit of state.units) {
    unit.movement = UNIT_TYPES[unit.type].movement;
    unit.fortified = false;
  }
  for (const unit of state.units.filter(item => item.owner === "player")) {
    reveal(state, unit, UNIT_TYPES[unit.type].vision);
  }
  ensurePlayerSelection(state);
  checkOutcome(state);
  state.phase = "player";
  if (state.status === "playing") state.log.unshift(`Ход ${state.turn}. Мир продолжает свою историю.`);
  return {
    ok: true,
    message: state.status === "playing"
      ? `Ход ${state.turn}. Города произвели ресурсы, соперники завершили действия.`
      : state.summary?.reason || "Кампания завершена."
  };
}

export function era(state) {
  return civ(state, "player").research.completed.includes("writing") ? "Союз городов"
    : civ(state, "player").research.completed.length >= 3 ? "Ранний город"
      : civ(state, "player").research.completed.length ? "Оседлое племя" : "Племя";
}
