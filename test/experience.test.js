import test from "node:test";
import assert from "node:assert/strict";
import { Controller } from "../src/app/controller.js";

const memoryStorage = () => {
  const values = new Map();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key)
  };
};

test("wait command ends actions and fortifies a combat unit until world turn resolves", () => {
  const controller = new Controller(() => {}, memoryStorage());
  controller.newGame("human-gate-wait");
  assert.equal(controller.select("unit", "p-warrior").ok, true);
  const warrior = controller.state.units.find(unit => unit.id === "p-warrior");
  assert.ok(warrior.movement > 0);
  assert.equal(controller.command("wait").ok, true);
  assert.equal(warrior.movement, 0);
  assert.equal(warrior.fortified, true);
  assert.equal(controller.command("end").ok, true);
  assert.equal(warrior.movement > 0, true);
  assert.equal(warrior.fortified, false);
});

test("wait command rejects non-unit or already exhausted selection", () => {
  const controller = new Controller(() => {}, memoryStorage());
  controller.newGame("human-gate-wait-reject");
  assert.equal(controller.select("city", "c-dawn").ok, true);
  assert.equal(controller.command("wait").ok, false);
  assert.equal(controller.select("unit", "p-scout").ok, true);
  assert.equal(controller.command("wait").ok, true);
  assert.equal(controller.command("wait").ok, false);
});
