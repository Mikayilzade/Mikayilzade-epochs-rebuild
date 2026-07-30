import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, owned, income, recruit, build, march, endTurn, score } from '../src/game.js';

test('new campaign has two player lands and two actions', () => {
  const state = createGame();
  assert.equal(owned(state).length, 2);
  assert.equal(state.actions, 2);
  assert.equal(state.turn, 1);
});

test('recruitment consumes one action and two food', () => {
  const before = createGame(), after = recruit(before, 'haven');
  assert.equal(after.regions.haven.army, before.regions.haven.army + 2);
  assert.equal(after.food, before.food - 2);
  assert.equal(after.actions, 1);
  assert.notEqual(after, before);
});

test('invalid orders leave state untouched', () => {
  const state = createGame();
  assert.equal(recruit(state, 'crown'), state);
  assert.equal(march(state, 'haven', 'orchard', 3), state);
  assert.equal(build(state, 'crown', 'farm'), state);
});

test('a superior army captures an adjacent region', () => {
  const state = createGame();
  state.regions.haven.army = 8;
  const after = march(state, 'haven', 'ford', 6);
  assert.equal(after.regions.ford.owner, 'player');
  assert.equal(owned(after).length, 3);
  assert.equal(after.actions, 1);
});

test('buildings cost food and contribute to income', () => {
  const state = createGame();
  const before = income(state);
  const after = build(state, 'reed', 'archive');
  assert.equal(after.food, state.food - 4);
  assert.equal(after.regions.reed.building, 'archive');
  assert.equal(income(after).science, before.science + 2);
});

test('ending a turn grants income, advances era and runs rivals', () => {
  let state = createGame();
  for (let i = 0; i < 4; i++) state = endTurn(state);
  assert.equal(state.turn, 5);
  assert.equal(state.era, 1);
  assert.ok(state.food > 0);
  assert.ok(state.log.length > 1);
});

test('campaign resolves after sixteen turns and has a score', () => {
  let state = createGame();
  state.legacy = 20;
  for (const id of ['ford','steppe','grove','crown','cliffs']) state.regions[id].owner = 'player';
  while (state.won === null) state = endTurn(state);
  assert.equal(state.won, true);
  assert.ok(score(state) >= 100);
});
