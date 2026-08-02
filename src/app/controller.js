import { createGame, moveUnit } from "../domain/world.js";
import {
  attack,
  chooseProduction,
  chooseResearch,
  endTurn,
  foundCity,
  improveTile
} from "../domain/simulation.js";
import { loadGame, saveGame } from "./persistence.js";

export class Controller {
  constructor(render = () => {}, storage = globalThis.localStorage) {
    this.render = render;
    this.storage = storage;
    this.state = null;
  }

  newGame(seed) {
    this.state = createGame(seed);
    this.render(this.state, "Новый мир создан.");
    return { ok: true, state: this.state };
  }

  load() {
    const result = loadGame(this.storage);
    if (result.ok) {
      this.state = result.state;
      this.render(this.state, "Кампания продолжена.");
    }
    return result;
  }

  save() {
    if (!this.state) return { ok: false, reason: "Нет активной кампании." };
    saveGame(this.state, this.storage);
    this.render(this.state, "Сохранено.");
    return { ok: true };
  }

  select(kind, id) {
    const collection = kind === "unit" ? this.state.units : this.state.cities;
    const entity = collection.find(item => item.id === id);
    if (!entity || entity.owner !== "player") {
      return { ok: false, reason: "Можно выбирать только собственный объект." };
    }
    this.state.selected = { kind, id };
    this.render(this.state, "");
    return { ok: true };
  }

  command(type, payload = {}) {
    let result = { ok: false, reason: "Неизвестная команда." };
    const selectedId = this.state.selected?.id;
    if (type === "move") result = moveUnit(this.state, selectedId, payload);
    if (type === "attack") result = attack(this.state, selectedId, payload.id);
    if (type === "found") result = foundCity(this.state, selectedId);
    if (type === "improve") result = improveTile(this.state, selectedId, payload.index);
    if (type === "research") result = chooseResearch(this.state, payload);
    if (type === "produce") {
      result = chooseProduction(this.state, payload.cityId, payload.kind, payload.id);
    }
    if (type === "end") result = endTurn(this.state);
    this.render(this.state, result.ok ? "" : result.reason);
    return result;
  }
}
