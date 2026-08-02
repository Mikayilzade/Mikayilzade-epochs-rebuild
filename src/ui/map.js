import { CIVS, RESOURCES, TERRAIN, UNIT_TYPES } from "../content/config.js";
import { canMove, distance, indexOf } from "../domain/world.js";

const TILE = 52;

export class MapView {
  constructor(canvas, camera, click, hover = () => {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.camera = camera;
    this.click = click;
    this.hover = hover;
    this.pointers = new Map();
    this.gesture = null;
    this.dragged = false;

    canvas.addEventListener("click", event => {
      if (!this.dragged) click(camera.screenToTile(event.offsetX, event.offsetY, TILE));
    });
    canvas.addEventListener("pointerdown", event => {
      this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      this.dragged = false;
      canvas.setPointerCapture(event.pointerId);
      this.beginGesture();
    });
    canvas.addEventListener("pointermove", event => {
      const tile = camera.screenToTile(event.offsetX, event.offsetY, TILE);
      hover(tile);
      if (!this.pointers.has(event.pointerId) || !this.gesture) return;
      this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      const points = [...this.pointers.values()];
      if (points.length === 1) {
        const dx = points[0].x - this.gesture.point.x;
        const dy = points[0].y - this.gesture.point.y;
        if (Math.hypot(dx, dy) > 5) this.dragged = true;
        camera.x = this.gesture.cameraX + dx;
        camera.y = this.gesture.cameraY + dy;
      } else if (points.length >= 2) {
        const center = {
          x: (points[0].x + points[1].x) / 2,
          y: (points[0].y + points[1].y) / 2
        };
        const separation = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
        camera.scale = Math.max(0.35, Math.min(2.5,
          this.gesture.scale * separation / this.gesture.separation));
        const ratio = camera.scale / this.gesture.scale;
        camera.x = center.x - (this.gesture.center.x - this.gesture.cameraX) * ratio;
        camera.y = center.y - (this.gesture.center.y - this.gesture.cameraY) * ratio;
        this.dragged = true;
      }
      this.draw();
    });
    const finishPointer = event => {
      this.pointers.delete(event.pointerId);
      this.beginGesture();
    };
    canvas.addEventListener("pointerup", finishPointer);
    canvas.addEventListener("pointercancel", finishPointer);
    canvas.addEventListener("pointerleave", () => hover(null));
    canvas.addEventListener("wheel", event => {
      event.preventDefault();
      camera.zoom(event.deltaY < 0 ? 1.12 : 0.89, { x: event.offsetX, y: event.offsetY });
      this.draw();
    }, { passive: false });
  }

  beginGesture() {
    const points = [...this.pointers.values()];
    if (!points.length) {
      this.gesture = null;
      return;
    }
    this.gesture = {
      point: points[0],
      cameraX: this.camera.x,
      cameraY: this.camera.y,
      scale: this.camera.scale
    };
    if (points.length >= 2) {
      this.gesture.center = {
        x: (points[0].x + points[1].x) / 2,
        y: (points[0].y + points[1].y) / 2
      };
      this.gesture.separation = Math.max(1,
        Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y));
    }
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const ratio = devicePixelRatio || 1;
    this.canvas.width = rect.width * ratio;
    this.canvas.height = rect.height * ratio;
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  setState(state) {
    this.state = state;
    this.draw();
  }

  drawActionOverlay(ctx, selected) {
    if (!selected || selected.owner !== "player" || selected.movement < 1) return;
    const definition = UNIT_TYPES[selected.type];
    for (const tile of this.state.map.tiles) {
      if (!tile.revealed) continue;
      const enemy = this.state.units.find(unit => unit.owner !== "player" &&
        unit.x === tile.x && unit.y === tile.y) ||
        this.state.cities.find(city => city.owner !== "player" &&
          city.x === tile.x && city.y === tile.y);
      let color = null;
      if (enemy && definition.strength > 1 && distance(selected, enemy) <= definition.range) {
        color = "#ef625f66";
      } else if (distance(selected, tile) === 1) {
        color = canMove(this.state, selected, tile).ok ? "#73d99355" : "#a7b0b02b";
      }
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(tile.x * TILE + 4, tile.y * TILE + 4, TILE - 8, TILE - 8);
      }
    }
  }

  draw() {
    if (!this.state) return;
    const ctx = this.ctx;
    const rect = this.canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.save();
    ctx.translate(this.camera.x, this.camera.y);
    ctx.scale(this.camera.scale, this.camera.scale);

    for (const tile of this.state.map.tiles) {
      const x = tile.x * TILE;
      const y = tile.y * TILE;
      ctx.fillStyle = tile.revealed ? TERRAIN[tile.terrain].color : "#101a22";
      ctx.fillRect(x, y, TILE, TILE);
      ctx.strokeStyle = tile.owner && tile.revealed ? CIVS[tile.owner].color : "#ffffff18";
      ctx.lineWidth = tile.owner && tile.revealed ? 3 : 1;
      ctx.strokeRect(x + 1, y + 1, TILE - 2, TILE - 2);
      if (!tile.revealed) continue;
      if (tile.resource) {
        ctx.fillStyle = "#ffe39a";
        ctx.font = "10px sans-serif";
        ctx.fillText(RESOURCES[tile.resource]?.name ?? tile.resource, x + 3, y + 49);
      }
      if (tile.improvement) {
        ctx.fillStyle = "#fff";
        ctx.font = "bold 13px sans-serif";
        ctx.fillText("+", x + 39, y + 14);
      }
    }

    const selectedUnit = this.state.units.find(unit => unit.id === this.state.selected?.id);
    this.drawActionOverlay(ctx, selectedUnit);

    for (const city of this.state.cities) {
      if (!this.state.map.tiles[indexOf(city.x, city.y, this.state.map.width)].revealed) continue;
      ctx.fillStyle = CIVS[city.owner].color;
      ctx.fillRect(city.x * TILE + 9, city.y * TILE + 9, 34, 34);
      ctx.fillStyle = "#17202a";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`⌂${city.population}`, (city.x + 0.5) * TILE, (city.y + 0.5) * TILE + 4);
      if (city.id === this.state.selected?.id) {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.strokeRect(city.x * TILE + 5, city.y * TILE + 5, 42, 42);
      }
    }

    for (const unit of this.state.units) {
      if (!this.state.map.tiles[indexOf(unit.x, unit.y, this.state.map.width)].revealed) continue;
      ctx.beginPath();
      ctx.arc((unit.x + 0.5) * TILE, (unit.y + 0.5) * TILE, 15, 0, Math.PI * 2);
      ctx.fillStyle = CIVS[unit.owner].color;
      ctx.fill();
      ctx.fillStyle = "#17202a";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(UNIT_TYPES[unit.type].symbol,
        (unit.x + 0.5) * TILE, (unit.y + 0.5) * TILE + 5);
      if (unit.id === this.state.selected?.id) {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      ctx.fillStyle = "#311";
      ctx.fillRect(unit.x * TILE + 7, unit.y * TILE + 44, 38, 4);
      ctx.fillStyle = "#65c778";
      ctx.fillRect(unit.x * TILE + 7, unit.y * TILE + 44,
        38 * unit.health / (UNIT_TYPES[unit.type].maxHealth + 10), 4);
    }
    ctx.restore();
  }
}
