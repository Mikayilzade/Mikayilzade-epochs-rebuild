export const MAP = [
  { id: 'haven', name: 'Белый берег', x: 16, y: 24, terrain: 'coast', food: 2, science: 0, links: ['reed', 'ford'] },
  { id: 'reed', name: 'Камыши', x: 29, y: 17, terrain: 'marsh', food: 3, science: 0, links: ['haven', 'ford', 'steppe'] },
  { id: 'ford', name: 'Старый брод', x: 29, y: 34, terrain: 'plain', food: 2, science: 1, links: ['haven', 'reed', 'grove', 'crown'] },
  { id: 'steppe', name: 'Медная степь', x: 44, y: 13, terrain: 'plain', food: 2, science: 1, links: ['reed', 'crown', 'cliffs'] },
  { id: 'grove', name: 'Священная роща', x: 43, y: 43, terrain: 'forest', food: 3, science: 0, links: ['ford', 'crown', 'south'] },
  { id: 'crown', name: 'Долина Короны', x: 47, y: 29, terrain: 'plain', food: 3, science: 1, links: ['ford', 'steppe', 'grove', 'cliffs', 'lake'] },
  { id: 'cliffs', name: 'Красные скалы', x: 60, y: 17, terrain: 'mountain', food: 0, science: 3, links: ['steppe', 'crown', 'lake', 'gate'] },
  { id: 'south', name: 'Южные нивы', x: 56, y: 51, terrain: 'plain', food: 4, science: 0, links: ['grove', 'crown', 'lake', 'delta'] },
  { id: 'lake', name: 'Зеркальное озеро', x: 64, y: 36, terrain: 'lake', food: 3, science: 1, links: ['crown', 'cliffs', 'south', 'gate', 'delta'] },
  { id: 'gate', name: 'Восточные врата', x: 75, y: 22, terrain: 'mountain', food: 1, science: 3, links: ['cliffs', 'lake', 'orchard'] },
  { id: 'delta', name: 'Синяя дельта', x: 72, y: 52, terrain: 'coast', food: 4, science: 1, links: ['south', 'lake', 'orchard'] },
  { id: 'orchard', name: 'Сады Восхода', x: 84, y: 38, terrain: 'forest', food: 3, science: 1, links: ['gate', 'delta'] }
];

export const ERAS = [
  { name: 'Эпоха истоков', year: '3200 до н. э.', goal: 'Укрепите столицу и исследуйте границы' },
  { name: 'Эпоха городов', year: '800 до н. э.', goal: 'Соедините земли и создайте знания' },
  { name: 'Эпоха держав', year: '600 н. э.', goal: 'Сдержите соперников и сохраните народ' },
  { name: 'Эпоха открытий', year: '1680 н. э.', goal: 'Оставьте наследие, достойное веков' }
];

export const BUILDINGS = {
  farm: { name: 'Поселение', icon: '⌂', cost: 3, yield: 'food', text: '+2 пищи за ход' },
  archive: { name: 'Архив', icon: '▥', cost: 4, yield: 'science', text: '+2 знания за ход' },
  fort: { name: 'Крепость', icon: '♜', cost: 5, yield: 'defence', text: '+2 к обороне области' }
};

export const SAVE_VERSION = 2;

export const createGame = () => ({
  version: SAVE_VERSION,
  turn: 1, maxTurns: 16, era: 0, actions: 2, food: 8, science: 3, legacy: 0,
  selected: 'haven', log: ['Народ высадился на Белом берегу. Летопись начата.'], won: null,
  regions: Object.fromEntries(MAP.map((r, i) => [r.id, {
    owner: i < 2 ? 'player' : i > 9 ? 'ember' : i === 9 ? 'azure' : 'neutral',
    army: i === 0 ? 4 : i === 1 ? 2 : i > 9 ? 3 : i === 9 ? 3 : i % 3 === 0 ? 2 : 1,
    building: i === 0 ? 'farm' : null
  }]))
});

export function restoreGame(value) {
  if (!value || value.version !== SAVE_VERSION || !Number.isInteger(value.turn) || !value.regions) return null;
  if (!MAP.every(r => value.regions[r.id] && ['player', 'neutral', 'ember', 'azure'].includes(value.regions[r.id].owner))) return null;
  return value;
}

export const owned = (state, who = 'player') => MAP.filter(r => state.regions[r.id].owner === who);
export const region = id => MAP.find(r => r.id === id);
export const neighbours = id => region(id).links;
export const canReach = (state, from, to) => state.regions[from]?.owner === 'player' && neighbours(from).includes(to);

export function income(state) {
  return owned(state).reduce((sum, r) => {
    const building = state.regions[r.id].building;
    return { food: sum.food + r.food + (building === 'farm' ? 2 : 0), science: sum.science + r.science + (building === 'archive' ? 2 : 0) };
  }, { food: 0, science: 0 });
}

export function recruit(state, id) {
  if (state.actions < 1 || state.food < 2 || state.regions[id]?.owner !== 'player') return state;
  const next = structuredClone(state); next.food -= 2; next.actions--; next.regions[id].army += 2;
  next.log.unshift(`В области «${region(id).name}» собрано новое ополчение.`); return next;
}

export function build(state, id, type) {
  const def = BUILDINGS[type], target = state.regions[id];
  if (!def || state.actions < 1 || target?.owner !== 'player' || target.building || state.food < def.cost) return state;
  const next = structuredClone(state); next.food -= def.cost; next.actions--; next.regions[id].building = type;
  next.legacy += type === 'archive' ? 2 : 1; next.log.unshift(`${def.name} возведён в области «${region(id).name}».`); return next;
}

export function march(state, from, to, amount) {
  if (state.actions < 1 || !canReach(state, from, to)) return state;
  const send = Math.min(Math.max(1, amount), state.regions[from].army - 1); if (send < 1) return state;
  const next = structuredClone(state), source = next.regions[from], target = next.regions[to]; source.army -= send; next.actions--;
  if (target.owner === 'player') { target.army += send; next.log.unshift(`Отряд перемещён в область «${region(to).name}».`); return next; }
  const fort = target.building === 'fort' ? 2 : 0;
  if (send > target.army + fort) { const old = target.owner; target.owner = 'player'; target.army = Math.max(1, send - target.army - fort); target.building = null; next.legacy += old === 'neutral' ? 1 : 3; next.log.unshift(`Область «${region(to).name}» присоединилась к вашей державе.`); }
  else { target.army = Math.max(1, target.army - Math.ceil(send / 2)); next.log.unshift(`Поход на «${region(to).name}» отбит. Потеряно ${send} отрядов.`); }
  return next;
}

function aiMove(state, faction) {
  const lands = owned(state, faction); if (!lands.length) return;
  // Every surviving rival receives a small, visible reinforcement. This keeps the
  // late campaign contested instead of turning the AI into a finite puzzle.
  const capital = lands.reduce((best, land) => state.regions[land.id].army > state.regions[best.id].army ? land : best, lands[0]);
  state.regions[capital.id].army++;
  const options = lands.flatMap(from => neighbours(from.id).map(to => ({ from, to: region(to) }))).filter(x => state.regions[x.to.id].owner !== faction);
  options.sort((a, b) => state.regions[a.to.id].army - state.regions[b.to.id].army);
  const pick = options[0]; if (!pick || state.regions[pick.from.id].army < 2) return;
  const send = state.regions[pick.from.id].army - 1, target = state.regions[pick.to.id]; state.regions[pick.from.id].army = 1;
  if (send > target.army + (target.building === 'fort' ? 2 : 0)) { const wasPlayer = target.owner === 'player'; target.owner = faction; target.army = Math.max(1, send - target.army); target.building = null; state.log.unshift(`${faction === 'ember' ? 'Багряный союз' : 'Лазурный дом'} захватил область «${pick.to.name}».`); if (wasPlayer) state.legacy = Math.max(0, state.legacy - 2); }
  else { target.army = Math.max(1, target.army - 1); state.log.unshift(`${faction === 'ember' ? 'Багряный союз' : 'Лазурный дом'} атаковал область «${pick.to.name}», но не смог её взять.`); }
}

export function endTurn(state) {
  if (state.won !== null) return state; const next = structuredClone(state), gain = income(next);
  next.food = Math.min(99, next.food + gain.food - owned(next).length); next.science = Math.min(99, next.science + gain.science);
  owned(next).forEach(r => { if (next.regions[r.id].army > 1 && next.food <= 0) next.regions[r.id].army--; });
  aiMove(next, 'ember'); aiMove(next, 'azure'); next.turn++; next.era = Math.min(3, Math.floor((next.turn - 1) / 4)); next.actions = 2 + (next.science >= 20 ? 1 : 0);
  if (!owned(next).length) next.won = false;
  else if (next.turn > next.maxTurns) next.won = owned(next).length >= 7 && next.legacy >= 12;
  return next;
}

export function score(state) { return owned(state).length * 10 + state.legacy * 4 + state.science + state.food; }
