import assert from "node:assert/strict";
import { Controller } from "../src/app/controller.js";
import { SAVE_KEY } from "../src/app/persistence.js";
import { TECHS, TERRAIN, UNIT_TYPES } from "../src/content/config.js";
import { civ } from "../src/domain/simulation.js";
import { distance, indexOf, neighbors } from "../src/domain/world.js";

class MemoryStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, value); }
}

const storage = new MemoryStorage();
const controller = new Controller(() => {}, storage);
assert.equal(controller.newGame("honest-command-campaign").ok, true);

const researchOrder = [
  "agriculture", "tracking", "craftsmanship", "pottery",
  "archery", "masonry", "bronze", "writing"
];
const evidence = {
  explored: false,
  secondCity: false,
  independentQueues: false,
  completedProduction: false,
  improvement: false,
  rivalProduction: false,
  rivalExpansion: false,
  battle: false,
  captureOrLoss: false,
  reloaded: false
};
const initialRevealed = controller.state.map.tiles.filter(tile => tile.revealed).length;
const initialRivalUnits = controller.state.units.filter(unit =>
  unit.owner === "ochre" || unit.owner === "river").length;
const initialRivalCities = controller.state.cities.filter(city =>
  city.owner === "ochre" || city.owner === "river").length;
const initialPlayerUnitIds = new Set(controller.state.units.filter(unit =>
  unit.owner === "player").map(unit => unit.id));

function passableUnoccupied(state, position, movingId) {
  const tile = state.map.tiles[indexOf(position.x, position.y, state.map.width)];
  return TERRAIN[tile.terrain].passable && !state.units.some(unit =>
    unit.id !== movingId && unit.x === position.x && unit.y === position.y);
}

function nextStep(state, unit, isGoal) {
  const startKey = `${unit.x}:${unit.y}`;
  const queue = [{ x: unit.x, y: unit.y }];
  const previous = new Map([[startKey, null]]);
  let goal = null;
  while (queue.length) {
    const current = queue.shift();
    if (isGoal(current) && (current.x !== unit.x || current.y !== unit.y)) {
      goal = current;
      break;
    }
    for (const candidate of neighbors(state, current)) {
      const key = `${candidate.x}:${candidate.y}`;
      if (previous.has(key) || !passableUnoccupied(state, candidate, unit.id)) continue;
      previous.set(key, current);
      queue.push(candidate);
    }
  }
  if (!goal) return null;
  let step = goal;
  while (true) {
    const parent = previous.get(`${step.x}:${step.y}`);
    if (!parent || (parent.x === unit.x && parent.y === unit.y)) break;
    step = parent;
  }
  return step;
}

function chooseResearch() {
  const player = civ(controller.state, "player");
  if (player.research.active) return;
  const id = researchOrder.find(candidate =>
    !player.research.completed.includes(candidate) &&
    (!TECHS[candidate].requires || TECHS[candidate].requires.every(required =>
      player.research.completed.includes(required))));
  if (id) assert.equal(controller.command("research", id).ok, true);
}

function chooseCityProduction() {
  const state = controller.state;
  const player = civ(state, "player");
  let projectedCities = state.cities.filter(city => city.owner === "player").length +
    state.units.filter(unit => unit.owner === "player" && unit.type === "settler").length +
    state.cities.filter(city => city.owner === "player" && city.queue?.id === "settler").length;
  const workerExists = state.units.some(unit => unit.owner === "player" && unit.type === "worker") ||
    state.cities.some(city => city.owner === "player" && city.queue?.id === "worker");
  let workerPlanned = workerExists;

  for (const city of state.cities.filter(item => item.owner === "player" && !item.queue)) {
    let project = null;
    if (projectedCities < 4 && player.research.completed.includes("agriculture")) {
      project = { kind: "unit", id: "settler" };
      projectedCities += 1;
    } else if (!workerPlanned && player.research.completed.includes("craftsmanship")) {
      project = { kind: "unit", id: "worker" };
      workerPlanned = true;
    } else if (!city.buildings.includes("granary") &&
      player.research.completed.includes("agriculture")) {
      project = { kind: "building", id: "granary" };
    } else {
      project = { kind: "unit", id: "warrior" };
    }
    controller.select("city", city.id);
    assert.equal(controller.command("produce", { cityId: city.id, ...project }).ok, true);
  }
  const queues = state.cities.filter(city => city.owner === "player" && city.queue);
  evidence.independentQueues ||= queues.length >= 2 &&
    new Set(queues.map(city => city.queue.id)).size >= 1;
}

function directSettlers() {
  for (const unit of [...controller.state.units].filter(item =>
    item.owner === "player" && item.type === "settler")) {
    controller.select("unit", unit.id);
    for (let move = 0; move < UNIT_TYPES.settler.movement; move += 1) {
      const founded = controller.command("found");
      if (founded.ok) {
        evidence.secondCity = controller.state.cities.filter(city => city.owner === "player").length >= 2;
        break;
      }
      const state = controller.state;
      const step = nextStep(state, unit, position => {
        const tile = state.map.tiles[indexOf(position.x, position.y, state.map.width)];
        return !tile.owner && state.cities.every(city => distance(city, position) >= 4);
      });
      if (!step) break;
      assert.equal(controller.command("move", step).ok, true);
    }
  }
}

function directWorkers() {
  for (const unit of [...controller.state.units].filter(item =>
    item.owner === "player" && item.type === "worker")) {
    controller.select("unit", unit.id);
    const state = controller.state;
    const candidates = state.map.tiles.filter(tile => tile.owner === "player" &&
      !tile.improvement && ["plains", "hills", "forest"].includes(tile.terrain));
    const adjacent = candidates.find(tile => distance(unit, tile) <= 1);
    if (adjacent) {
      const result = controller.command("improve", {
        index: indexOf(adjacent.x, adjacent.y, state.map.width)
      });
      if (result.ok) evidence.improvement = true;
      continue;
    }
    const step = nextStep(state, unit, position =>
      candidates.some(tile => distance(position, tile) <= 1));
    if (step) controller.command("move", step);
  }
}

function directMilitary() {
  const military = [...controller.state.units].filter(unit =>
    unit.owner === "player" && UNIT_TYPES[unit.type].strength > 1 && unit.type !== "scout");
  for (const unit of military) {
    if (!controller.state.units.includes(unit)) continue;
    controller.select("unit", unit.id);
    for (let move = 0; move < UNIT_TYPES[unit.type].movement; move += 1) {
      const state = controller.state;
      const targets = [...state.units, ...state.cities]
        .filter(target => target.owner !== "player")
        .sort((a, b) => distance(unit, a) - distance(unit, b));
      const target = targets[0];
      if (!target) break;
      if (distance(unit, target) <= UNIT_TYPES[unit.type].range) {
        const beforeOwner = "population" in target ? target.owner : null;
        const result = controller.command("attack", { id: target.id });
        if (result.ok) {
          evidence.battle = true;
          if (beforeOwner && target.owner === "player") evidence.captureOrLoss = true;
        }
        break;
      }
      const step = nextStep(state, unit, position =>
        distance(position, target) <= UNIT_TYPES[unit.type].range);
      if (!step) break;
      const result = controller.command("move", step);
      if (!result.ok) break;
    }
  }
}

function explore() {
  const scout = controller.state.units.find(unit =>
    unit.owner === "player" && unit.type === "scout");
  if (!scout) return;
  controller.select("unit", scout.id);
  for (let move = 0; move < UNIT_TYPES.scout.movement; move += 1) {
    const state = controller.state;
    const step = nextStep(state, scout, position =>
      !state.map.tiles[indexOf(position.x, position.y, state.map.width)].revealed);
    if (!step || !controller.command("move", step).ok) break;
  }
  evidence.explored ||= controller.state.map.tiles.filter(tile => tile.revealed).length > initialRevealed;
}

for (let cycle = 0; cycle < 100 && controller.state.status === "playing"; cycle += 1) {
  chooseResearch();
  chooseCityProduction();
  directSettlers();
  directWorkers();
  directMilitary();
  explore();

  if (controller.state.turn === 20 && !evidence.reloaded) {
    const snapshot = structuredClone(controller.state);
    assert.equal(controller.save().ok, true);
    assert.ok(storage.getItem(SAVE_KEY));
    controller.state = null;
    assert.equal(controller.load().ok, true);
    assert.deepEqual(controller.state, snapshot);
    evidence.reloaded = true;
  }

  assert.equal(controller.command("end").ok, true);
  evidence.completedProduction ||= controller.state.units.some(unit =>
    unit.owner === "player" && !initialPlayerUnitIds.has(unit.id)) ||
    controller.state.cities.some(city => city.owner === "player" && city.buildings.length);
  evidence.rivalProduction ||= controller.state.units.filter(unit =>
    unit.owner === "ochre" || unit.owner === "river").length > initialRivalUnits;
  evidence.rivalExpansion ||= controller.state.cities.filter(city =>
    city.owner === "ochre" || city.owner === "river").length > initialRivalCities;
  evidence.captureOrLoss ||= controller.state.log.some(entry => entry.includes("захват"));
}

assert.notEqual(controller.state.status, "playing", "campaign must reach a terminal result");
assert.ok(controller.state.turn >= 40 && controller.state.turn <= 100,
  `terminal turn ${controller.state.turn} must be in the 40–100 target`);
for (const [criterion, passed] of Object.entries(evidence)) {
  assert.equal(passed, true, `campaign evidence missing: ${criterion}`);
}
assert.equal(controller.save().ok, true);
const terminal = structuredClone(controller.state);
controller.state = null;
assert.equal(controller.load().ok, true);
assert.deepEqual(controller.state, terminal);

console.log(JSON.stringify({
  result: controller.state.status,
  winner: controller.state.winner,
  turn: controller.state.turn,
  cities: controller.state.summary.cities,
  technologies: controller.state.summary.techs,
  battles: controller.state.summary.battles,
  evidence
}, null, 2));
