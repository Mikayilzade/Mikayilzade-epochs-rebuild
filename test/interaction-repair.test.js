import test from "node:test";
import assert from "node:assert/strict";
import { Controller } from "../src/app/controller.js";
import { deserialize, serialize } from "../src/app/persistence.js";
import { TECHS } from "../src/content/config.js";
import { attack, checkOutcome } from "../src/domain/simulation.js";
import { createGame, moveUnit, rangeDistance, reachableTiles } from "../src/domain/world.js";

test("movement supports diagonals and pathing across several cells", () => {
  const state = createGame("diagonal-path");
  const scout = state.units.find(unit => unit.id === "p-scout");
  state.units = state.units.filter(unit => unit.id === scout.id || unit.owner !== "player");
  const diagonal = { x: scout.x - 1, y: scout.y - 1 };
  assert.equal(rangeDistance(scout, diagonal), 1);
  assert.equal(moveUnit(state, scout.id, diagonal).ok, true);
  scout.movement = 3;
  const target = { x: scout.x + 3, y: scout.y };
  const result = moveUnit(state, scout.id, target);
  assert.equal(result.ok, true);
  assert.equal(result.steps, 3);
  assert.deepEqual({ x: scout.x, y: scout.y }, target);
});

test("reachable overlay model includes diagonal and multi-step cells", () => {
  const state = createGame("reachable-diagonal");
  const scout = state.units.find(unit => unit.id === "p-scout");
  state.units = state.units.filter(unit => unit.id === scout.id || unit.owner !== "player");
  const reachable = reachableTiles(state, scout);
  assert.ok(reachable.some(tile => tile.x === scout.x + 1 && tile.y === scout.y + 1));
  assert.ok(reachable.some(tile => tile.cost > 1));
});

test("archer range uses square distance for offset targets", () => {
  const state = createGame("archer-square-range");
  const archer = { id: "archer-test", type: "archer", owner: "player", x: 5, y: 5, movement: 2, health: 70, fortified: false };
  const enemy = { id: "enemy-test", type: "warrior", owner: "ochre", x: 4, y: 7, movement: 2, health: 100, fortified: false };
  state.units.push(archer, enemy);
  assert.equal(rangeDistance(archer, enemy), 2);
  assert.equal(attack(state, archer.id, enemy.id).ok, true);
  assert.equal(archer.health, 70);
});

test("selection can be cleared and saved safely", () => {
  const controller = new Controller(() => {}, { getItem: () => null, setItem: () => {} });
  controller.newGame("clear-selection");
  assert.equal(controller.clearSelection().ok, true);
  assert.equal(controller.state.selected, null);
  const restored = deserialize(serialize(controller.state));
  assert.equal(restored.ok, true);
  assert.equal(restored.state.selected, null);
});

test("defeat summary explains which objective the rival completed", () => {
  const state = createGame("defeat-reason");
  const river = state.civilizations.find(civilization => civilization.id === "river");
  river.research.completed = Object.keys(TECHS);
  while (state.cities.filter(city => city.owner === "river").length < 4) {
    const template = structuredClone(state.cities.find(city => city.owner === "river"));
    template.id = `river-extra-${state.cities.length}`;
    template.x = 10 + state.cities.length;
    template.territory = [];
    template.worked = [];
    state.cities.push(template);
  }
  assert.equal(checkOutcome(state), "defeat");
  assert.match(state.summary.reason, /Речное царство/);
  assert.match(state.summary.reason, /4\/4/);
  assert.match(state.summary.reason, /8\/8/);
});
