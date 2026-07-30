import test from 'node:test';import assert from 'node:assert/strict';import {initialState,applyChoice,EVENTS,score,ending} from '../src/game.js';
test('choice advances chapter and records legacy',()=>{const s=applyChoice(initialState(),EVENTS[0],0);assert.equal(s.turn,1);assert.deepEqual(s.legacy,['земледелие']);assert.equal(s.food,8)});
test('resources remain within the game scale',()=>{let s=initialState();for(const e of EVENTS)s=applyChoice(s,e,0);for(const k of ['food','knowledge','culture','stability','people'])assert.ok(s[k]>=0&&s[k]<=12)});
test('full chronicle ends and produces a scored ending',()=>{let s=initialState();for(const e of EVENTS)s=applyChoice(s,e,0);assert.equal(s.ended,true);assert.equal(s.history.length,12);assert.ok(score(s)>0);assert.equal(ending(s).length,2)});
