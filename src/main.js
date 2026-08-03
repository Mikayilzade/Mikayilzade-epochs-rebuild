import { Controller } from "./app/controller.js";
import {
  BUILDINGS,
  CIVS,
  IMPROVEMENTS,
  TECHS,
  TERRAIN,
  UNIT_TYPES,
  VICTORY
} from "./content/config.js";
import { cityYield, civ, combatPreview, era } from "./domain/simulation.js";
import { distance, indexOf } from "./domain/world.js";
import { Camera } from "./ui/camera.js";
import { MapView, TILE } from "./ui/map.js";

const $ = id => document.getElementById(id);
const canvas = $("map");
const camera = new Camera(canvas);
let tab = "object";
let actionMode = null;
let resultShown = false;
let messageTimer = null;

const controller = new Controller(render);
const map = new MapView(canvas, camera, onTile, onHover);

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[char]);

const ROLE_LABELS = {
  recon: "разведка",
  settler: "основание городов",
  melee: "ближний бой",
  ranged: "дальний бой",
  worker: "улучшение земель"
};

const UNIT_ICONS = {
  scout: "🧭",
  settler: "⛺",
  warrior: "⚔",
  archer: "🏹",
  worker: "🔨",
  spearman: "🔱",
  raider: "☠"
};

function selectedUnit(state) {
  return state.units.find(unit => unit.id === state.selected?.id);
}

function selectedCity(state) {
  return state.cities.find(city => city.id === state.selected?.id);
}

function selectEntity(kind, id, focus = false) {
  const result = controller.select(kind, id);
  if (!result.ok) return;
  tab = "object";
  actionMode = null;
  const entity = kind === "unit"
    ? controller.state.units.find(item => item.id === id)
    : controller.state.cities.find(item => item.id === id);
  if (focus && entity) camera.focus(entity, TILE);
  render(controller.state);
}

function issue(type, payload) {
  const result = controller.command(type, payload);
  if (result.ok && type !== "move") actionMode = null;
  if (result.ok && type === "move" && selectedUnit(controller.state)?.movement < 1) actionMode = null;
  render(controller.state);
  return result;
}

function onTile(position) {
  const state = controller.state;
  if (!state || position.x < 0 || position.y < 0 ||
      position.x >= state.map.width || position.y >= state.map.height) return;

  const unit = state.units.find(item => item.x === position.x && item.y === position.y);
  const city = state.cities.find(item => item.x === position.x && item.y === position.y);
  const selected = selectedUnit(state);
  const ownUnit = unit?.owner === "player" ? unit : null;
  const ownCity = city?.owner === "player" ? city : null;

  if (ownUnit && ownCity) {
    if (state.selected?.id === ownUnit.id) selectEntity("city", ownCity.id);
    else selectEntity("unit", ownUnit.id);
    return;
  }
  if (ownCity) {
    selectEntity("city", ownCity.id);
    return;
  }
  if (ownUnit) {
    selectEntity("unit", ownUnit.id);
    return;
  }

  if (unit && selected) {
    if (unit.owner === "player") return;
    const definition = UNIT_TYPES[selected.type];
    if (!definition.strength || definition.strength <= 1) {
      showMessage("Этот отряд не предназначен для боя.");
      return;
    }
    const preview = combatPreview(state, selected, unit);
    if (confirm(`Атаковать: ${UNIT_TYPES[unit.type].name}?\nВаш урон: ${preview.damage}. Ответный урон: ${preview.retaliation}.`)) {
      issue("attack", { id: unit.id });
    }
    return;
  }

  if (city && selected) {
    if (city.owner === "player") return;
    const definition = UNIT_TYPES[selected.type];
    if (distance(selected, city) > definition.range) {
      showMessage(`Город вне дальности атаки (${definition.range}).`);
      return;
    }
    const preview = combatPreview(state, selected, city);
    if (confirm(`Штурмовать ${city.name}?\nОжидаемый урон: ${preview.damage}. Ответный урон: ${preview.retaliation}.`)) {
      issue("attack", { id: city.id });
    }
    return;
  }

  if (!selected) return;
  const tileIndex = indexOf(position.x, position.y, state.map.width);
  const tile = state.map.tiles[tileIndex];
  if (actionMode === "attack") {
    showMessage("Красным выделены доступные цели атаки.");
    return;
  }
  if (actionMode === "improve") {
    issue("improve", { index: tileIndex });
    return;
  }
  if (!tile.revealed && actionMode !== "move") actionMode = "move";
  issue("move", position);
}

function onHover(position) {
  const tip = $("tile-tip");
  const state = controller.state;
  if (!state || !position || position.x < 0 || position.y < 0 ||
      position.x >= state.map.width || position.y >= state.map.height) {
    tip.textContent = "";
    return;
  }
  const tile = state.map.tiles[indexOf(position.x, position.y, state.map.width)];
  if (!tile.revealed) {
    tip.textContent = "Неизведанная земля — отправьте разведчика ближе.";
    return;
  }
  const terrain = TERRAIN[tile.terrain];
  const parts = [
    `${terrain.name}: ${terrain.passable ? "проходимо" : "непроходимо"}`,
    `пища ${terrain.yield.food || 0}`,
    `производство ${terrain.yield.production || 0}`,
    `знания ${terrain.yield.science || 0}`
  ];
  const unit = state.units.find(item => item.x === position.x && item.y === position.y);
  const city = state.cities.find(item => item.x === position.x && item.y === position.y);
  if (tile.resource) parts.push(`ресурс: ${tile.resource}`);
  if (tile.improvement) parts.push(`улучшение: ${IMPROVEMENTS[tile.improvement].name}`);
  if (tile.owner) parts.push(`земля: ${CIVS[tile.owner].name}`);
  if (city) parts.push(`город: ${city.name}, население ${city.population}`);
  if (unit) parts.push(`отряд: ${UNIT_TYPES[unit.type].name}, здоровье ${unit.health}`);
  tip.textContent = parts.join(" · ");
}

function meter(value, maximum, color = "#78b68b") {
  const percent = Math.max(0, Math.min(100, maximum ? value / maximum * 100 : 0));
  return `<div class="meter" style="--meter:${color}"><i style="width:${percent}%"></i></div>`;
}

function unitPanel(state, unit) {
  const definition = UNIT_TYPES[unit.type];
  const faction = CIVS[unit.owner];
  const canFight = definition.strength > 1;
  const healthColor = unit.health / definition.maxHealth > .45 ? "#78b68b" : "#d86f63";
  const modeText = actionMode === "move"
    ? "Выберите соседнюю зелёную клетку."
    : actionMode === "attack"
      ? "Выберите красную цель атаки."
      : actionMode === "improve"
        ? "Выберите соседнюю золотую клетку своей территории."
        : "Выберите действие или нажмите доступную клетку на карте.";

  return `
    <div class="entity-hero">
      <div class="entity-emblem" style="--faction:${faction.color}">${UNIT_ICONS[unit.type] || "◆"}</div>
      <div>
        <p class="eyebrow">${escapeHtml(faction.name)} · ${escapeHtml(ROLE_LABELS[definition.role] || definition.role)}</p>
        <h2>${escapeHtml(definition.name)}</h2>
        <p>Клетка ${unit.x + 1}:${unit.y + 1}. ${modeText}</p>
      </div>
    </div>
    <div class="stat-grid">
      <div class="stat"><span>Здоровье</span><b>${unit.health}/${definition.maxHealth}</b></div>
      <div class="stat"><span>Движение</span><b>${unit.movement}/${definition.movement}</b></div>
      <div class="stat"><span>Сила / дальность</span><b>${definition.strength}/${definition.range}</b></div>
    </div>
    ${meter(unit.health, definition.maxHealth, healthColor)}
    <div class="action-grid">
      <button data-mode="move" class="${actionMode === "move" ? "active" : ""}" ${unit.movement < 1 ? "disabled" : ""}>
        <b>Идти</b><small>соседняя зелёная клетка</small>
      </button>
      ${canFight ? `<button data-mode="attack" class="${actionMode === "attack" ? "active" : ""}" ${unit.movement < 1 ? "disabled" : ""}><b>Атаковать</b><small>красная цель в дальности</small></button>` : ""}
      ${definition.role === "settler" ? '<button data-action="found"><b>Основать город</b><small>нужна свободная земля вдали от городов</small></button>' : ""}
      ${definition.role === "worker" ? `<button data-mode="improve" class="${actionMode === "improve" ? "active" : ""}" ${unit.movement < 1 ? "disabled" : ""}><b>Улучшить землю</b><small>ферма, рудник или лесной стан</small></button>` : ""}
      <button data-action="wait" ${unit.movement < 1 ? "disabled" : ""}><b>Ждать</b><small>завершить действия отряда</small></button>
      <button data-action="focus"><b>Показать на карте</b><small>центрировать камеру</small></button>
    </div>
    <p class="rule-note">${unitPurpose(definition.role)}</p>
  `;
}

function unitPurpose(role) {
  const purposes = {
    recon: "Разведчик открывает туман быстрее других. Избегайте боя и ищите хорошие земли для второго города.",
    settler: "Поселенцы создают новый город и исчезают после основания. Между городами должно быть не менее четырёх клеток.",
    melee: "Ближний отряд получает ответный урон, но только он может захватывать город после разрушения защиты.",
    ranged: "Дальний отряд атакует с расстояния и не получает ответный урон, пока враг не стоит рядом.",
    worker: "Работник усиливает контролируемые клетки: равнина становится фермой, холмы — рудником, лес — лесным станом."
  };
  return purposes[role] || "У отряда есть собственная роль в развитии и защите державы.";
}

function cityPanel(state, city) {
  const faction = CIVS[city.owner];
  const output = cityYield(state, city);
  const growthNeed = 12 + city.population * 5;
  const queue = city.queue;
  const queueName = queue
    ? (queue.kind === "unit" ? UNIT_TYPES[queue.id].name : BUILDINGS[queue.id].name)
    : null;
  const turns = queue ? Math.max(1, Math.ceil((queue.cost - queue.progress) / Math.max(1, output.production))) : null;
  const available = [
    ...Object.entries(UNIT_TYPES)
      .filter(([, definition]) => definition.cost && definition.role !== "raider")
      .map(([id, definition]) => ["unit", id, definition]),
    ...Object.entries(BUILDINGS).map(([id, definition]) => ["building", id, definition])
  ];
  const player = civ(state, "player");

  return `
    <div class="entity-hero">
      <div class="entity-emblem" style="--faction:${faction.color}">🏛</div>
      <div>
        <p class="eyebrow">${escapeHtml(faction.name)} · город</p>
        <h2>${escapeHtml(city.name)}</h2>
        <p>Население ${city.population}. Контролирует ${city.territory.length} клеток, использует ${city.worked.length}.</p>
      </div>
    </div>
    <div class="city-summary">
      <div><span>Рост</span><b>${city.food}/${growthNeed} пищи</b>${meter(city.food, growthNeed, "#8fbe72")}</div>
      <div><span>Защита</span><b>${city.health}/${city.maxHealth} · броня ${city.defence}</b>${meter(city.health, city.maxHealth, "#d2a75c")}</div>
      <div><span>Доход за ход</span><b>🍲 ${output.food} · ⚒ ${output.production} · ✦ ${output.science}</b></div>
      <div><span>Постройки</span><b>${city.buildings.length ? city.buildings.map(id => BUILDINGS[id].name).join(", ") : "нет"}</b></div>
    </div>
    <h3>Текущее производство</h3>
    ${queue ? `
      <div class="queue-card">
        <header><b>${escapeHtml(queueName)}</b><span>≈ ${turns} ход.</span></header>
        <small>${queue.progress}/${queue.cost} производства</small>
        ${meter(queue.progress, queue.cost, "#e7bd67")}
      </div>` : '<p class="empty">Очередь пуста. Без проекта город теряет потенциальное производство.</p>'}
    <h3>Выберите следующий проект</h3>
    <div class="catalog">
      ${available.map(([kind, id, definition]) => {
        const locked = Boolean(definition.requires && !player.research.completed.includes(definition.requires));
        const duplicate = kind === "building" && city.buildings.includes(id);
        const active = queue?.kind === kind && queue?.id === id;
        const projectTurns = Math.ceil(definition.cost / Math.max(1, output.production));
        return `<button data-produce="${kind}:${id}" ${locked || duplicate ? "disabled" : ""} class="${active ? "active" : ""}">
          <b>${kind === "unit" ? UNIT_ICONS[id] || "◆" : "▦"} ${escapeHtml(definition.name)}</b>
          <small>${definition.cost} производства · ≈ ${projectTurns} ход. · ${escapeHtml(definition.effect || ROLE_LABELS[definition.role] || "")}</small>
        </button>`;
      }).join("")}
    </div>
    <div class="action-grid">
      <button data-action="focus"><b>Показать город</b><small>центрировать камеру</small></button>
      <button data-action="next-city"><b>Следующий город</b><small>переключить управление</small></button>
    </div>
    <p class="rule-note">Смена проекта обнуляет накопленный прогресс. Каждый город имеет собственную независимую очередь.</p>
  `;
}

function objectPanel(state) {
  const unit = selectedUnit(state);
  const city = selectedCity(state);
  if (unit) return unitPanel(state, unit);
  if (city) return cityPanel(state, city);
  return `<div class="entity-hero"><div class="entity-emblem">?</div><div><h2>Ничего не выбрано</h2><p>Нажмите свой город или отряд на карте либо выберите объект в списке державы.</p></div></div>`;
}

function researchPanel(state) {
  const research = civ(state, "player").research;
  return `
    <p class="eyebrow">РАЗВИТИЕ ДЕРЖАВЫ</p>
    <h2>Древние знания</h2>
    <p class="lead">Выберите одно направление. Знания всех городов каждый ход продвигают активное исследование.</p>
    ${Object.entries(TECHS).map(([id, technology]) => {
      const completed = research.completed.includes(id);
      const locked = technology.requires?.some(required => !research.completed.includes(required));
      const active = research.active === id;
      const progress = active ? research.progress : 0;
      return `<div class="tech">
        <div class="tech-head"><b>${completed ? "✓ " : active ? "◉ " : locked ? "🔒 " : ""}${escapeHtml(technology.name)}</b><span>${technology.cost} ✦</span></div>
        <small>${escapeHtml(technology.description)}${technology.requires?.length ? ` · требует: ${technology.requires.map(req => TECHS[req].name).join(", ")}` : ""}</small>
        ${active ? meter(progress, technology.cost, "#7aa9d8") : ""}
        ${!completed && !active ? `<button data-tech="${id}" ${locked || research.active ? "disabled" : ""}>${locked ? "Сначала откройте условие" : research.active ? "Уже идёт другое исследование" : "Начать исследование"}</button>` : ""}
      </div>`;
    }).join("")}
  `;
}

function worldPanel(state) {
  const player = civ(state, "player");
  const playerCities = state.cities.filter(city => city.owner === "player").length;
  return `
    <p class="eyebrow">ЦЕЛЬ КАМПАНИИ</p>
    <h2>Путь к Союзу городов</h2>
    <p class="lead">Для победы контролируйте ${VICTORY.cities} города и откройте ${VICTORY.knowledge} знаний. Потеря всех городов и поселенцев означает поражение.</p>
    <div class="objective-list">
      <div class="objective-row ${playerCities >= VICTORY.cities ? "done" : ""}"><strong>${playerCities}/${VICTORY.cities}</strong><span>городов под вашим контролем</span></div>
      <div class="objective-row ${player.research.completed.length >= VICTORY.knowledge ? "done" : ""}"><strong>${player.research.completed.length}/${VICTORY.knowledge}</strong><span>открытых древних знаний</span></div>
    </div>
    <h3>Народы мира</h3>
    ${state.civilizations.filter(item => item.id !== "independent").map(item => `
      <div class="civ-card">
        <div class="civ-head"><b><i style="background:${item.color}"></i>${escapeHtml(item.name)}</b><span>${state.cities.filter(city => city.owner === item.id).length} гор.</span></div>
        <small>${item.research.completed.length} знаний · ${state.units.filter(unit => unit.owner === item.id).length} отрядов</small>
      </div>`).join("")}
    <div class="civ-card"><div class="civ-head"><b><i style="background:${CIVS.independent.color}"></i>Вольные племена</b><span>${state.units.filter(unit => unit.owner === "independent").length}</span></div><small>Независимые налётчики воюют со всеми державами.</small></div>
  `;
}

function helpPanel() {
  return `
    <p class="eyebrow">ПЕРВЫЕ ДЕСЯТЬ МИНУТ</p>
    <h2>Как начать</h2>
    <div class="objective-list">
      <div class="objective-row"><strong>1</strong><span>Выберите разведчика 🧭 и нажмите соседнюю зелёную клетку.</span></div>
      <div class="objective-row"><strong>2</strong><span>Откройте город Заря 🏛 и назначьте производство.</span></div>
      <div class="objective-row"><strong>3</strong><span>На вкладке «Знания» выберите первое исследование.</span></div>
      <div class="objective-row"><strong>4</strong><span>Отведите поселенцев ⛺ минимум на четыре клетки от Зари и основайте город.</span></div>
      <div class="objective-row"><strong>5</strong><span>Работник 🔨 улучшает соседнюю контролируемую равнину, холмы или лес.</span></div>
      <div class="objective-row"><strong>6</strong><span>Воин ⚔ и лучник 🏹 атакуют красные цели. Только ближний отряд захватывает города.</span></div>
    </div>
    <p class="rule-note">Повторный клик по клетке, где стоят город и отряд, переключает между ними. Кнопка «Следующий» перебирает все ваши объекты.</p>
  `;
}

function renderRoster(state) {
  const cities = state.cities.filter(city => city.owner === "player");
  const units = state.units.filter(unit => unit.owner === "player");
  const items = [
    ...cities.map(city => ({ kind: "city", id: city.id, icon: "🏛", title: city.name, subtitle: `население ${city.population}`, color: CIVS.player.color })),
    ...units.map(unit => ({ kind: "unit", id: unit.id, icon: UNIT_ICONS[unit.type] || "◆", title: UNIT_TYPES[unit.type].name, subtitle: `${unit.movement}/${UNIT_TYPES[unit.type].movement} движ. · ${unit.health} зд.`, color: CIVS.player.color }))
  ];
  $("roster").innerHTML = items.map(item => `
    <button data-select="${item.kind}:${item.id}" class="${state.selected?.id === item.id ? "selected" : ""}">
      <span class="roster-icon" style="--faction:${item.color}">${item.icon}</span>
      <span><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.subtitle)}</small></span>
    </button>`).join("");
}

function firstTenObjectives(state) {
  const revealed = state.map.tiles.filter(tile => tile.revealed).length;
  const playerCities = state.cities.filter(city => city.owner === "player");
  const research = civ(state, "player").research;
  const improved = state.map.tiles.some(tile => tile.owner === "player" && tile.improvement);
  const battle = state.log.some(entry => entry.includes("урона") || entry.includes("бой") || entry.includes("захвачен"));
  return [
    { label: "Расширить разведанную область", done: revealed >= 24 },
    { label: "Назначить производство в Заре", done: playerCities.some(city => city.queue || city.buildings.length) },
    { label: "Начать первое исследование", done: Boolean(research.active || research.completed.length) },
    { label: "Основать второй город", done: playerCities.length >= 2 },
    { label: "Улучшить землю или провести бой", done: improved || battle }
  ];
}

function renderCoach(state) {
  const objectives = firstTenObjectives(state);
  const complete = objectives.filter(item => item.done).length;
  const next = objectives.find(item => !item.done);
  $("coach").className = `coach ${complete === objectives.length ? "done" : ""}`;
  $("coach").innerHTML = `
    <div class="coach-head"><strong>${complete === objectives.length ? "Первые шаги завершены" : `Следующая цель: ${escapeHtml(next.label)}`}</strong><span>${complete}/${objectives.length}</span></div>
    <small>${complete === objectives.length ? "Теперь развивайте города, создавайте войско и ищите соперников." : "Выполняйте цели в любом порядке. Игра сама отмечает прогресс."}</small>
    <div class="coach-progress"><i style="width:${complete / objectives.length * 100}%"></i></div>
  `;
  $("goal-badge").textContent = complete === objectives.length ? "Свободная игра" : `Первые шаги ${complete}/${objectives.length}`;
}

function renderResources(state) {
  const income = state.cities
    .filter(city => city.owner === "player")
    .map(city => cityYield(state, city))
    .reduce((sum, output) => ({
      food: sum.food + output.food,
      production: sum.production + output.production,
      science: sum.science + output.science
    }), { food: 0, production: 0, science: 0 });
  $("resources").innerHTML = `
    <div><span>Пища / ход</span><b>+${income.food}</b></div>
    <div><span>Производство</span><b>+${income.production}</b></div>
    <div><span>Знания / ход</span><b>+${income.science}</b></div>
    <div><span>Города</span><b>${state.cities.filter(city => city.owner === "player").length}</b></div>
  `;
}

function bindPanel(state) {
  document.querySelector("[data-action=found]")?.addEventListener("click", () => issue("found"));
  document.querySelector("[data-action=wait]")?.addEventListener("click", () => issue("wait"));
  document.querySelectorAll("[data-action=focus]").forEach(button => button.addEventListener("click", () => {
    const entity = selectedUnit(state) || selectedCity(state);
    if (entity) {
      camera.focus(entity, TILE);
      map.draw();
    }
  }));
  document.querySelector("[data-action=next-city]")?.addEventListener("click", () => selectNext("city"));
  document.querySelectorAll("[data-mode]").forEach(button => button.addEventListener("click", () => {
    actionMode = actionMode === button.dataset.mode ? null : button.dataset.mode;
    render(controller.state);
  }));
  document.querySelectorAll("[data-tech]").forEach(button => button.addEventListener("click", () => issue("research", button.dataset.tech)));
  document.querySelectorAll("[data-produce]").forEach(button => button.addEventListener("click", () => {
    const [kind, id] = button.dataset.produce.split(":");
    issue("produce", { cityId: state.selected.id, kind, id });
  }));
  document.querySelectorAll("[data-select]").forEach(button => button.addEventListener("click", () => {
    const [kind, id] = button.dataset.select.split(":");
    selectEntity(kind, id, true);
  }));
}

function selectNext(kind = null) {
  const state = controller.state;
  const all = [
    ...state.cities.filter(city => city.owner === "player").map(city => ({ ...city, kind: "city" })),
    ...state.units.filter(unit => unit.owner === "player").map(unit => ({ ...unit, kind: "unit" }))
  ].filter(item => !kind || item.kind === kind);
  if (!all.length) return;
  const index = all.findIndex(item => item.id === state.selected?.id);
  const next = all[(index + 1 + all.length) % all.length];
  selectEntity(next.kind, next.id, true);
}

function showMessage(message) {
  if (!message) return;
  clearTimeout(messageTimer);
  $("message").textContent = message;
  $("message").className = "visible";
  messageTimer = setTimeout(() => { $("message").className = ""; }, 2600);
}

function render(state, message = "") {
  if (!state) return;
  map.setState(state, actionMode);
  $("turn-badge").textContent = `Ход ${state.turn} · ${era(state)}`;
  renderResources(state);
  renderRoster(state);
  renderCoach(state);

  document.querySelectorAll("[data-tab]").forEach(button => {
    button.setAttribute("aria-selected", String(button.dataset.tab === tab));
  });
  $("panel").innerHTML = tab === "object"
    ? objectPanel(state)
    : tab === "research"
      ? researchPanel(state)
      : tab === "world"
        ? worldPanel(state)
        : helpPanel();

  $("log").replaceChildren(...state.log.slice(0, 14).map(entry => {
    const item = document.createElement("li");
    item.textContent = entry;
    return item;
  }));
  bindPanel(state);
  if (message) showMessage(message);

  if (state.status !== "playing" && !resultShown) {
    resultShown = true;
    $("result-body").innerHTML = `
      <p class="eyebrow">ИТОГ ЛЕТОПИСИ</p>
      <h2>${state.status === "victory" ? "Победа" : "Поражение"}</h2>
      <p class="lead">Кампания завершена на ходу ${state.turn}. Победитель: ${escapeHtml(CIVS[state.winner]?.name || "неизвестен")}.</p>
      <div class="objective-list">
        <div class="objective-row"><strong>${state.summary.cities}</strong><span>ваших городов</span></div>
        <div class="objective-row"><strong>${state.summary.techs}</strong><span>открытых знаний</span></div>
        <div class="objective-row"><strong>${state.summary.battles}</strong><span>сражений в летописи</span></div>
      </div>`;
    $("result").showModal();
  }
  $("end-turn").disabled = state.status !== "playing";
}

document.querySelectorAll("[data-tab]").forEach(button => button.addEventListener("click", () => {
  tab = button.dataset.tab;
  actionMode = null;
  render(controller.state);
}));

$("zoom-in").addEventListener("click", () => { camera.zoom(1.2); map.draw(); });
$("zoom-out").addEventListener("click", () => { camera.zoom(.82); map.draw(); });
$("fit").addEventListener("click", () => {
  camera.fit(controller.state.map.width, controller.state.map.height, TILE);
  map.draw();
});
$("focus").addEventListener("click", () => {
  const entity = selectedUnit(controller.state) || selectedCity(controller.state);
  if (entity) camera.focus(entity, TILE);
  map.draw();
});
$("next").addEventListener("click", () => selectNext());
$("end-turn").addEventListener("click", () => issue("end"));
$("save").addEventListener("click", () => controller.save());
$("new-game").addEventListener("click", () => $("welcome").showModal());

const dialog = $("welcome");
const loaded = controller.load();
if (!loaded.ok) {
  controller.newGame("experience-preview");
  $("continue").hidden = true;
  dialog.showModal();
}

$("create").addEventListener("click", event => {
  event.preventDefault();
  resultShown = false;
  actionMode = null;
  tab = "object";
  controller.newGame($("seed").value || "dawn-experience");
  dialog.close();
  camera.fit(controller.state.map.width, controller.state.map.height, TILE);
  map.draw();
});
$("continue").addEventListener("click", () => dialog.close());

addEventListener("resize", () => {
  map.resize();
  map.draw();
});
requestAnimationFrame(() => {
  map.resize();
  camera.fit(controller.state.map.width, controller.state.map.height, TILE);
  map.draw();
});
