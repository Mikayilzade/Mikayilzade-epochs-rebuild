import { MAP, ERAS, BUILDINGS, createGame, owned, income, recruit, build, march, endTurn, score } from './game.js';

const app = document.querySelector('#app');
let state;
const save = () => localStorage.setItem('epochs-map-save', JSON.stringify(state));
const esc = text => String(text).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

function boot(resume = false) {
  state = resume && localStorage.getItem('epochs-map-save') ? JSON.parse(localStorage.getItem('epochs-map-save')) : createGame();
  render();
}

function mapSvg() {
  const lines = MAP.flatMap(r => r.links.filter(id => r.id < id).map(id => { const b = MAP.find(x => x.id === id); return `<line x1="${r.x}%" y1="${r.y}%" x2="${b.x}%" y2="${b.y}%"/>`; })).join('');
  const nodes = MAP.map(r => { const s = state.regions[r.id], selected = state.selected === r.id; return `<button class="province ${s.owner} ${selected ? 'selected' : ''}" data-region="${r.id}" style="left:${r.x}%;top:${r.y}%" aria-label="${r.name}, ${s.army} отрядов"><span class="marker"><i>${s.building ? BUILDINGS[s.building].icon : '◆'}</i><b>${s.army}</b></span><em>${r.name}</em></button>`; }).join('');
  return `<div class="map-wrap"><svg class="routes" aria-hidden="true">${lines}</svg><div class="continent"></div>${nodes}<div class="map-key"><span class="player">● Вы</span><span class="ember">● Багряный союз</span><span class="azure">● Лазурный дом</span><span>● Свободные земли</span></div></div>`;
}

function panel() {
  const r = MAP.find(x => x.id === state.selected), s = state.regions[r.id], friendly = s.owner === 'player';
  const adjacent = r.links.map(id => MAP.find(x => x.id === id)).filter(Boolean);
  return `<aside class="inspector"><button class="close-panel" aria-label="Закрыть">×</button><div class="terrain ${r.terrain}"></div><p class="kicker">${friendly ? 'ВАША ОБЛАСТЬ' : s.owner === 'neutral' ? 'СВОБОДНАЯ ЗЕМЛЯ' : 'ВЛАДЕНИЕ СОПЕРНИКА'}</p><h2>${r.name}</h2><div class="yield"><span>♟ ${s.army} отрядов</span><span>● +${r.food} пищи</span><span>✦ +${r.science} знания</span></div>${s.building ? `<div class="built">${BUILDINGS[s.building].icon}<b>${BUILDINGS[s.building].name}</b><small>${BUILDINGS[s.building].text}</small></div>` : ''}
  ${friendly ? `<section><h3>Приказы</h3><button data-recruit ${state.food < 2 ? 'disabled' : ''}>＋ Собрать 2 отряда <small>2 пищи · 1 действие</small></button><div class="build-grid">${Object.entries(BUILDINGS).map(([id,b]) => `<button data-build="${id}" ${s.building || state.food < b.cost ? 'disabled' : ''}>${b.icon} ${b.name}<small>${b.cost} пищи</small></button>`).join('')}</div></section>` : ''}
  <section><h3>${friendly ? 'Отправить поход' : 'Соседние земли'}</h3>${adjacent.map(n => { const ns=state.regions[n.id]; return `<button class="march" data-target="${n.id}" ${!friendly || s.army < 2 ? 'disabled' : ''}><span>${n.name}<small>${ns.owner === 'player' ? 'союзная' : `${ns.army} защитников`}</small></span>${friendly ? '<b>→</b>' : ''}</button>`; }).join('')}</section></aside>`;
}

function render() {
  if (state.won !== null) return renderEnd();
  const era = ERAS[state.era], gain = income(state);
  app.innerHTML = `<header><div class="brand"><b>ЭПОХИ</b><span>СТРАТЕГИЯ СКВОЗЬ ВЕКА</span></div><div class="top-resources"><span>● <b>${state.food}</b><small>+${gain.food-owned(state).length}</small></span><span>✦ <b>${state.science}</b><small>+${gain.science}</small></span><span>⌘ <b>${state.legacy}</b><small>наследие</small></span></div><button id="menu" aria-label="Сохранение">☰</button></header>
  <main class="strategy"><section class="era-panel"><p>ГЛАВА ${String(state.turn).padStart(2,'0')} / ${state.maxTurns}</p><h1>${era.name}</h1><span>${era.year}</span><div class="era-track">${ERAS.map((_,i)=>`<i class="${i<=state.era?'active':''}"></i>`).join('')}</div><blockquote>${era.goal}</blockquote><div class="chronicle"><h3>Летопись</h3>${state.log.slice(0,4).map(x=>`<p>${esc(x)}</p>`).join('')}</div></section>${mapSvg()}${panel()}</main>
  <footer><div><span>ДЕЙСТВИЯ</span><b>${'◆'.repeat(state.actions)}${'◇'.repeat(Math.max(0,3-state.actions))}</b></div><p>Выберите область, отдайте приказы и завершите ход</p><button id="end-turn">Завершить ход <b>→</b></button></footer>`;
  bind(); save();
}

function bind() {
  document.querySelectorAll('[data-region]').forEach(el => el.onclick = () => { state.selected = el.dataset.region; render(); });
  document.querySelector('[data-recruit]')?.addEventListener('click', () => { state = recruit(state, state.selected); render(); });
  document.querySelectorAll('[data-build]').forEach(el => el.onclick = () => { state = build(state, state.selected, el.dataset.build); render(); });
  document.querySelectorAll('[data-target]').forEach(el => el.onclick = () => { state = march(state, state.selected, el.dataset.target, Math.ceil(state.regions[state.selected].army / 2)); state.selected = el.dataset.target; render(); });
  document.querySelector('#end-turn').onclick = () => { state = endTurn(state); render(); };
  document.querySelector('#menu').onclick = () => { if (confirm('Начать новую летопись? Текущий прогресс будет утрачен.')) boot(false); };
}

function renderEnd() {
  const victory = state.won;
  app.innerHTML = `<main class="final"><p class="kicker">ЛЕТОПИСЬ ЗАВЕРШЕНА</p><div class="final-sigil">${victory ? '♛' : '◈'}</div><h1>${victory ? 'Держава пережила века' : 'Имя растаяло во времени'}</h1><p>${victory ? 'Вы связали земли, сохранили память и создали цивилизацию, способную встретить новую эпоху.' : 'Народу не удалось исполнить предназначение. Но каждая неудача — ещё одна строка в великой летописи.'}</p><div class="score"><span><b>${owned(state).length}</b> земель</span><span><b>${state.legacy}</b> наследия</span><span><b>${score(state)}</b> итог</span></div><button class="primary" id="again">Начать новую летопись →</button></main>`;
  document.querySelector('#again').onclick = () => { localStorage.removeItem('epochs-map-save'); boot(false); };
}

const previous = localStorage.getItem('epochs-map-save');
document.querySelector('#new-game').onclick = () => boot(false);
if (previous) { const button = document.querySelector('#continue'); button.classList.remove('hidden'); button.onclick = () => boot(true); }
