import { MAP, TERRAIN, UNIT_TYPES } from "../content/config.js";
import { hashSeed, rng } from "./random.js";

export const indexOf = (x, y, width = MAP.width) => y * width + x;
export const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
export function neighbors(state, pos) { return [{x:pos.x+1,y:pos.y},{x:pos.x-1,y:pos.y},{x:pos.x,y:pos.y+1},{x:pos.x,y:pos.y-1}].filter(p => p.x >= 0 && p.y >= 0 && p.x < state.map.width && p.y < state.map.height); }
export function reveal(state, pos, radius) { for (let y=0;y<state.map.height;y++) for(let x=0;x<state.map.width;x++) if(distance(pos,{x,y})<=radius) state.map.tiles[indexOf(x,y,state.map.width)].revealed=true; }

export function generateWorld(seed) {
  const random = rng(hashSeed(seed)); const tiles=[];
  for (let y=0;y<MAP.height;y++) for(let x=0;x<MAP.width;x++) {
    const edge = x===0||y===0||x===MAP.width-1||y===MAP.height-1; const v=random();
    let terrain=edge&&v<.72?"water":v<.13?"water":v<.27?"forest":v<.39?"hills":v<.46?"mountains":"plains";
    tiles.push({x,y,terrain,revealed:false,resource: terrain==="forest"&&random()<.18?"Дичь":terrain==="hills"&&random()<.18?"Кремень":null});
  }
  const start={x:4,y:5}; const safe=[[4,5],[5,5],[3,5],[4,4],[4,6],[5,4],[3,6]];
  for(const [x,y] of safe) tiles[indexOf(x,y)].terrain=(x+y)%3===0?"forest":"plains";
  const threat={x:12,y:7}; tiles[indexOf(threat.x,threat.y)].terrain="plains";
  return { width:MAP.width,height:MAP.height,tiles,start,threat };
}

export function createGame(seed="epohi-1") {
  const world=generateWorld(seed); const state={schemaVersion:1,seed,turn:1,phase:"player",map:world,resources:{food:4,production:3,science:0},research:{active:null,progress:0,completed:[]},units:[
    {id:"u-scout",type:"scout",owner:"player",x:4,y:5,movement:UNIT_TYPES.scout.movement},
    {id:"u-settler",type:"settler",owner:"player",x:5,y:5,movement:UNIT_TYPES.settler.movement},
    {id:"u-raider",type:"raider",owner:"ai",x:world.threat.x,y:world.threat.y,movement:UNIT_TYPES.raider.movement}
  ],settlements:[{id:"s-hearth",name:"Первый Очаг",x:4,y:5,population:1,development:0}],selectedUnitId:"u-scout",log:["Племя разбило Первый Очаг. Мир скрыт туманом."]};
  reveal(state,{x:4,y:5},2); return state;
}

export function canMove(state, unit, target) {
  if(!unit||unit.owner!=="player") return {ok:false,reason:"Это не ваш отряд."};
  if(unit.movement<1) return {ok:false,reason:"Очки движения исчерпаны."};
  if(distance(unit,target)!==1) return {ok:false,reason:"Можно двигаться только на соседнюю клетку."};
  if(target.x<0||target.y<0||target.x>=state.map.width||target.y>=state.map.height) return {ok:false,reason:"За краем карты пути нет."};
  const tile=state.map.tiles[indexOf(target.x,target.y,state.map.width)];
  if(!TERRAIN[tile.terrain].passable) return {ok:false,reason:`${TERRAIN[tile.terrain].name}: местность непроходима.`};
  if(state.units.some(u=>u.owner!==unit.owner&&u.x===target.x&&u.y===target.y)) return {ok:false,reason:"Клетка занята враждебным отрядом."};
  return {ok:true};
}
export function moveUnit(state,id,target){const unit=state.units.find(u=>u.id===id);const verdict=canMove(state,unit,target);if(!verdict.ok)return verdict;unit.x=target.x;unit.y=target.y;unit.movement--;reveal(state,target,UNIT_TYPES[unit.type].vision);state.log.unshift(`${UNIT_TYPES[unit.type].name} исследует новую клетку.`);return {ok:true};}
