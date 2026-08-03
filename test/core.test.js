import test from"node:test";import assert from"node:assert/strict";import{TECHS}from"../src/content/config.js";import{createGame,generateWorld,indexOf,moveUnit}from"../src/domain/world.js";import{attack,checkOutcome,chooseProduction,chooseResearch,cityYield,endTurn,foundCity,improveTile}from"../src/domain/simulation.js";import{deserialize,serialize}from"../src/app/persistence.js";
import { Controller } from "../src/app/controller.js";
test("several seeds are deterministic with separated starts",()=>{for(const seed of["a","b","c"]){assert.deepEqual(generateWorld(seed),generateWorld(seed));const s=createGame(seed);assert.equal(s.cities.length,3);assert.ok(s.map.tiles.some(t=>!t.revealed));}});
test("selection supports independent city queues",()=>{const s=createGame();const c=s.cities[0];assert.ok(chooseProduction(s,c.id,"unit","warrior").ok);const settler=s.units.find(u=>u.type==="settler");settler.x=8;settler.y=4;assert.ok(foundCity(s,settler.id).ok);const c2=s.cities.at(-1);assert.ok(chooseProduction(s,c2.id,"building","granary").ok===false);s.civilizations[0].research.completed.push("agriculture");assert.ok(chooseProduction(s,c2.id,"building","granary").ok);assert.notDeepEqual(c.queue,c2.queue);});
test("growth and starvation limits are enforced",()=>{const s=createGame(),c=s.cities[0];c.food=100;endTurn(s);assert.equal(c.population,3);c.food=-100;c.worked=[];endTurn(s);assert.ok(c.population>=1);});
test("founding enforces distance and territory conflicts",()=>{const s=createGame(),u=s.units.find(x=>x.type==="settler");assert.equal(foundCity(s,u.id).ok,false);u.x=8;u.y=4;assert.ok(foundCity(s,u.id).ok);const ids=s.cities.flatMap(c=>c.territory);assert.equal(ids.length,new Set(ids).size);});
test("production progresses over turns and enforces prerequisites",()=>{const s=createGame(),c=s.cities[0];assert.equal(chooseProduction(s,c.id,"unit","archer").ok,false);assert.ok(chooseProduction(s,c.id,"unit","warrior").ok);for(let i=0;i<10&&!s.units.some(u=>u.id.startsWith("u-player"));i++)endTurn(s);assert.ok(s.units.some(u=>u.id.startsWith("u-player")));});
test("movement rejects occupancy",()=>{const s=createGame(),u=s.units[0],other=s.units[2];other.x=u.x+1;other.y=u.y;assert.equal(moveUnit(s,u.id,other).ok,false);});
test("melee, ranged, destruction and capture",()=>{const s=createGame(),w=s.units.find(u=>u.id==="p-warrior"),enemy=s.units.find(u=>u.id==="o-warrior");enemy.x=w.x+1;enemy.y=w.y;enemy.health=5;assert.ok(attack(s,w.id,enemy.id).ok);assert.ok(!s.units.includes(enemy));const ar={id:"arch",type:"archer",owner:"player",x:10,y:3,movement:2,health:70};s.units.push(ar);const target={id:"target",type:"warrior",owner:"ochre",x:12,y:3,movement:2,health:100};s.units.push(target);const hp=ar.health;assert.ok(attack(s,ar.id,target.id).ok);assert.equal(ar.health,hp);w.x=14;w.y=3;w.movement=2;const city=s.cities.find(c=>c.owner==="ochre");city.health=1;assert.ok(attack(s,w.id,city.id).ok);assert.equal(city.owner,"player");});
test("worker creates a real territory improvement",()=>{const s=createGame(),c=s.cities[0],i=c.territory.find(i=>s.map.tiles[i].terrain==="plains"),t=s.map.tiles[i];s.units.push({id:"worker",type:"worker",owner:"player",x:t.x,y:t.y,movement:2,health:45});const before=cityYield(s,c).food;assert.ok(improveTile(s,"worker",i).ok);assert.ok(cityYield(s,c).food>=before);});
test("worked resources materially change city output",()=>{const s=createGame("resource-yield"),city=s.cities[0],tile=s.map.tiles[city.worked[0]],before=cityYield(s,city);tile.resource="Дичь";assert.equal(cityYield(s,city).food,before.food+1);tile.resource="Медь";assert.equal(cityYield(s,city).production,before.production+1);});
test("technology prerequisites and unlocks",()=>{const s=createGame();assert.equal(chooseResearch(s,"writing").ok,false);assert.ok(chooseResearch(s,"agriculture").ok);s.civilizations[0].research.completed.push("agriculture");s.civilizations[0].research.active=null;assert.ok(chooseResearch(s,"pottery").ok);});
test("AI produces, researches and moves legally",()=>{const s=createGame(),before=s.units.find(u=>u.owner==="ochre");for(let i=0;i<20&&s.status==="playing";i++)endTurn(s);assert.ok(s.civilizations.find(c=>c.id==="ochre").research.completed.length>0);assert.ok(s.units.filter(u=>u.owner==="ochre").length>=1);assert.ok(before.x>=0&&before.x<s.map.width);});
test("victory and defeat are terminal",()=>{const s=createGame();s.civilizations[0].research.completed=Object.keys(TECHS);while(s.cities.filter(c=>c.owner==="player").length<4)s.cities.push({...structuredClone(s.cities[0]),id:`extra${s.cities.length}`,x:5+s.cities.length});assert.equal(checkOutcome(s),"victory");const d=createGame();d.cities=d.cities.filter(c=>c.owner!=="player");assert.equal(checkOutcome(d),"playing");d.units=d.units.filter(u=>u.owner!=="player");assert.equal(checkOutcome(d),"defeat");});
test("schema 2 round trip and malformed/0.1 handling",()=>{const s=createGame();chooseProduction(s,s.cities[0].id,"unit","warrior");endTurn(s);assert.deepEqual(deserialize(serialize(s)).state,s);const bad=JSON.parse(serialize(s));bad.game.units[0].x=999;assert.equal(deserialize(JSON.stringify(bad)).ok,false);assert.match(deserialize(JSON.stringify({schemaVersion:1,game:{}})).error,/0.1/);});

test("changing production loses old progress while reselecting current keeps it",()=>{
  const state=createGame("queue-switch"),city=state.cities[0];
  assert.equal(chooseProduction(state,city.id,"unit","warrior").ok,true);
  city.queue.progress=7;
  assert.equal(chooseProduction(state,city.id,"unit","warrior").ok,true);
  assert.equal(city.queue.progress,7);
  state.civilizations[0].research.completed.push("agriculture");
  assert.equal(chooseProduction(state,city.id,"building","granary").ok,true);
  assert.equal(city.queue.progress,0);
  assert.equal(chooseProduction(state,city.id,"unit","warrior").ok,true);
  assert.equal(city.queue.progress,0);
});

test("controller rejects enemy selection and preserves owned city selection",()=>{
  const controller=new Controller();
  controller.newGame("controller-selection");
  assert.equal(controller.select("city","c-dawn").ok,true);
  assert.deepEqual(controller.state.selected,{kind:"city",id:"c-dawn"});
  assert.equal(controller.select("city","c-ochre").ok,false);
  assert.deepEqual(controller.state.selected,{kind:"city",id:"c-dawn"});
});

test("deep persistence rejects forged queues, ownership, knowledge and selection",()=>{
  const original=createGame("deep-validation");
  const mutate=callback=>{const data=JSON.parse(serialize(original));callback(data.game);return deserialize(JSON.stringify(data));};
  assert.equal(mutate(game=>{game.cities[0].queue={kind:"unit",id:"dragon",progress:0,cost:1};}).ok,false);
  assert.equal(mutate(game=>{game.cities[1].territory[0]=game.cities[0].territory[0];}).ok,false);
  assert.equal(mutate(game=>{game.knowledge.player.push(9999);}).ok,false);
  assert.equal(mutate(game=>{game.selected={kind:"city",id:"c-ochre"};}).ok,false);
  assert.equal(mutate(game=>{game.cities[0].buildings=["granary","granary"];}).ok,false);
  assert.equal(mutate(game=>{game.civilizations[0].research.completed=["writing"];}).ok,false);
});

test("AI completes production, expands territory and records combat",()=>{
  const state=createGame("ai-release-audit");
  const initialUnits=state.units.filter(unit=>unit.owner==="ochre"||unit.owner==="river").length;
  const initialCities=state.cities.length;
  let maximumUnits=initialUnits,maximumCities=initialCities;
  for(let turn=0;turn<60&&state.status==="playing";turn+=1){
    endTurn(state);
    maximumUnits=Math.max(maximumUnits,state.units.filter(unit=>unit.owner==="ochre"||unit.owner==="river").length);
    maximumCities=Math.max(maximumCities,state.cities.length);
  }
  assert.ok(maximumUnits>initialUnits);
  assert.ok(maximumCities>initialCities);
  assert.ok(state.log.some(entry=>entry.includes("бой")||entry.includes("захватывает")));
});
