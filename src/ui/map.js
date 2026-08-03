import { CIVS, TERRAIN, UNIT_TYPES } from "../content/config.js";
import { indexOf, rangeDistance, reachableTiles } from "../domain/world.js";

export const TILE = 56;

function roundedRect(ctx, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
  ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
  ctx.arcTo(x, y + height, x, y, safeRadius);
  ctx.arcTo(x, y, x + width, y, safeRadius);
  ctx.closePath();
}

function drawTerrainPattern(ctx, tile, x, y) {
  ctx.save();
  ctx.globalAlpha = .34;
  ctx.strokeStyle = "#0b1612";
  ctx.fillStyle = "#10201a";
  ctx.lineWidth = 1.5;
  if (tile.terrain === "water") {
    for (let row = 0; row < 3; row += 1) {
      ctx.beginPath();
      ctx.arc(x + 12 + row * 5, y + 15 + row * 12, 8, Math.PI, Math.PI * 2);
      ctx.arc(x + 34 + row * 3, y + 15 + row * 12, 8, Math.PI, Math.PI * 2);
      ctx.stroke();
    }
  } else if (tile.terrain === "forest") {
    for (const [dx, dy] of [[14,16],[36,14],[25,34],[44,38]]) {
      ctx.beginPath();
      ctx.moveTo(x + dx, y + dy - 7);
      ctx.lineTo(x + dx - 5, y + dy + 3);
      ctx.lineTo(x + dx + 5, y + dy + 3);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(x + dx - 1, y + dy + 2, 2, 5);
    }
  } else if (tile.terrain === "hills") {
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 42);
    ctx.quadraticCurveTo(x + 18, y + 18, x + 31, y + 42);
    ctx.quadraticCurveTo(x + 42, y + 26, x + 53, y + 42);
    ctx.stroke();
  } else if (tile.terrain === "mountains") {
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 47);
    ctx.lineTo(x + 20, y + 14);
    ctx.lineTo(x + 29, y + 31);
    ctx.lineTo(x + 38, y + 10);
    ctx.lineTo(x + 53, y + 47);
    ctx.stroke();
  } else if (tile.terrain === "desert") {
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 38);
    ctx.quadraticCurveTo(x + 18, y + 27, x + 31, y + 38);
    ctx.quadraticCurveTo(x + 42, y + 45, x + 53, y + 35);
    ctx.stroke();
  } else {
    for (const [dx, dy] of [[13,15],[34,12],[24,34],[45,38]]) {
      ctx.beginPath();
      ctx.arc(x + dx, y + dy, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawResource(ctx, resource, x, y) {
  ctx.save();
  ctx.translate(x + 44, y + 11);
  ctx.fillStyle = "#f0d48f";
  ctx.strokeStyle = "#3b2b19";
  ctx.lineWidth = 1.5;
  if (resource === "Медь") {
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(6, 0);
    ctx.lineTo(0, 6);
    ctx.lineTo(-6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-3, -3);
    ctx.lineTo(-7, -8);
    ctx.moveTo(3, -3);
    ctx.lineTo(7, -8);
    ctx.stroke();
  }
  ctx.restore();
}

function drawImprovement(ctx, improvement, x, y) {
  ctx.save();
  ctx.translate(x + 12, y + 44);
  ctx.strokeStyle = "#fff3c4";
  ctx.fillStyle = "#fff3c4";
  ctx.lineWidth = 2;
  if (improvement === "farm") {
    for (let offset = -5; offset <= 5; offset += 5) {
      ctx.beginPath();
      ctx.moveTo(offset, 5);
      ctx.lineTo(offset, -5);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(-7, 0);
    ctx.lineTo(7, 0);
    ctx.stroke();
  } else if (improvement === "mine") {
    ctx.beginPath();
    ctx.moveTo(-6, 5);
    ctx.lineTo(0, -6);
    ctx.lineTo(6, 5);
    ctx.stroke();
    ctx.fillRect(-5, 3, 10, 3);
  } else {
    ctx.beginPath();
    ctx.moveTo(-6, 5);
    ctx.lineTo(0, -7);
    ctx.lineTo(6, 5);
    ctx.closePath();
    ctx.stroke();
    ctx.fillRect(-1, 4, 2, 4);
  }
  ctx.restore();
}

function drawUnitIcon(ctx, type, centerX, centerY, scale = 1) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(scale, scale);
  ctx.strokeStyle = "#15221d";
  ctx.fillStyle = "#15221d";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (type === "scout") {
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(5, -5);
    ctx.lineTo(11, -11);
    ctx.moveTo(11, -11);
    ctx.lineTo(8, -11);
    ctx.moveTo(11, -11);
    ctx.lineTo(11, -8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "settler") {
    ctx.beginPath();
    ctx.arc(-4, -4, 3, 0, Math.PI * 2);
    ctx.arc(4, -4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-9, 8);
    ctx.quadraticCurveTo(-4, -1, 0, 8);
    ctx.quadraticCurveTo(4, -1, 9, 8);
    ctx.stroke();
  } else if (type === "warrior") {
    ctx.beginPath();
    ctx.moveTo(-8, -8);
    ctx.lineTo(7, 7);
    ctx.moveTo(-3, 7);
    ctx.lineTo(8, -4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-5, 5, 4, 0, Math.PI * 2);
    ctx.stroke();
  } else if (type === "archer") {
    ctx.beginPath();
    ctx.arc(-2, 0, 9, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-2, -9);
    ctx.lineTo(-2, 9);
    ctx.moveTo(-8, 0);
    ctx.lineTo(10, 0);
    ctx.lineTo(6, -3);
    ctx.moveTo(10, 0);
    ctx.lineTo(6, 3);
    ctx.stroke();
  } else if (type === "worker") {
    ctx.beginPath();
    ctx.moveTo(-8, 8);
    ctx.lineTo(6, -6);
    ctx.moveTo(2, -10);
    ctx.lineTo(10, -2);
    ctx.stroke();
  } else if (type === "spearman") {
    ctx.beginPath();
    ctx.moveTo(-7, 9);
    ctx.lineTo(6, -7);
    ctx.lineTo(7, -1);
    ctx.moveTo(6, -7);
    ctx.lineTo(0, -6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-5, 4, 4, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(-7, -7);
    ctx.lineTo(7, 7);
    ctx.moveTo(7, -7);
    ctx.lineTo(-7, 7);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCityIcon(ctx, city, x, y) {
  const faction = CIVS[city.owner];
  ctx.save();
  ctx.translate(x + 28, y + 28);
  ctx.fillStyle = faction.color;
  ctx.strokeStyle = "#17221e";
  ctx.lineWidth = 2;
  roundedRect(ctx, -18, -16, 36, 32, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#17221e";
  ctx.beginPath();
  ctx.moveTo(-12, 2);
  ctx.lineTo(0, -9);
  ctx.lineTo(12, 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(-10, 2, 20, 11);
  ctx.fillStyle = faction.color;
  ctx.fillRect(-3, 6, 6, 7);
  ctx.restore();
}

function drawCityStatus(ctx, city, x, y, scale) {
  ctx.fillStyle = "rgba(48,19,19,.9)";
  roundedRect(ctx, x + 8, y + 3, 40, 5, 3);
  ctx.fill();
  ctx.fillStyle = city.health / city.maxHealth > .45 ? "#75bd84" : "#d66e61";
  roundedRect(ctx, x + 8, y + 3, 40 * Math.max(0, city.health) / city.maxHealth, 5, 3);
  ctx.fill();

  if (scale <= .72) return;
  const first = `${city.name} · ${city.population}`;
  const second = `HP ${city.health}/${city.maxHealth} · BR ${city.defence}`;
  ctx.font = "bold 10px sans-serif";
  const width = Math.max(ctx.measureText(first).width, ctx.measureText(second).width) + 12;
  ctx.fillStyle = "rgba(10,20,17,.9)";
  roundedRect(ctx, x + TILE / 2 - width / 2, y - 28, width, 27, 5);
  ctx.fill();
  ctx.fillStyle = "#f3e7c8";
  ctx.textAlign = "center";
  ctx.fillText(first, x + TILE / 2, y - 16);
  ctx.font = "9px sans-serif";
  ctx.fillStyle = "#cbd7cf";
  ctx.fillText(second, x + TILE / 2, y - 5);
}

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
    this.mode = null;

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
        const separation = Math.hypot(points[0].x - points[1].x,
          points[0].y - points[1].y);
        camera.scale = Math.max(.35, Math.min(2.5,
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
      camera.zoom(event.deltaY < 0 ? 1.12 : .89, { x: event.offsetX, y: event.offsetY });
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

  setState(state, mode = null) {
    this.state = state;
    this.mode = mode;
    this.draw();
  }

  drawActionOverlay(ctx, selected) {
    if (!selected || selected.owner !== "player" || selected.movement < 1 || !this.mode) return;
    const definition = UNIT_TYPES[selected.type];

    if (this.mode === "move") {
      for (const tile of reachableTiles(this.state, selected)) {
        const mapTile = this.state.map.tiles[indexOf(tile.x, tile.y, this.state.map.width)];
        if (!mapTile.revealed) continue;
        ctx.fillStyle = "#78b68b60";
        roundedRect(ctx, tile.x * TILE + 4, tile.y * TILE + 4, TILE - 8, TILE - 8, 8);
        ctx.fill();
      }
      return;
    }

    for (const tile of this.state.map.tiles) {
      if (!tile.revealed) continue;
      let color = null;
      if (this.mode === "attack") {
        const enemy = this.state.units.find(unit => unit.owner !== "player" &&
          unit.x === tile.x && unit.y === tile.y) ||
          this.state.cities.find(city => city.owner !== "player" &&
            city.x === tile.x && city.y === tile.y);
        if (enemy && definition.strength > 1 &&
            rangeDistance(selected, enemy) <= definition.range) color = "#d95f527d";
      } else if (this.mode === "improve" && rangeDistance(selected, tile) === 1) {
        const improvement = tile.owner === "player" && !tile.improvement &&
          ["plains", "hills", "forest"].includes(tile.terrain);
        color = improvement ? "#e8bd6875" : "#87918d22";
      }
      if (color) {
        ctx.fillStyle = color;
        roundedRect(ctx, tile.x * TILE + 4, tile.y * TILE + 4, TILE - 8, TILE - 8, 8);
        ctx.fill();
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
      ctx.fillStyle = tile.revealed ? TERRAIN[tile.terrain].color : "#0a1512";
      ctx.fillRect(x, y, TILE, TILE);
      if (tile.revealed) drawTerrainPattern(ctx, tile, x, y);
      ctx.strokeStyle = tile.owner && tile.revealed ? CIVS[tile.owner].color : "#ffffff16";
      ctx.lineWidth = tile.owner && tile.revealed ? 3 : 1;
      ctx.strokeRect(x + 1, y + 1, TILE - 2, TILE - 2);
      if (!tile.revealed) continue;
      if (tile.resource) drawResource(ctx, tile.resource, x, y);
      if (tile.improvement) drawImprovement(ctx, tile.improvement, x, y);
    }

    const selectedUnit = this.state.units.find(unit => unit.id === this.state.selected?.id);
    this.drawActionOverlay(ctx, selectedUnit);

    for (const city of this.state.cities) {
      const tile = this.state.map.tiles[indexOf(city.x, city.y, this.state.map.width)];
      if (!tile.revealed) continue;
      const x = city.x * TILE;
      const y = city.y * TILE;
      drawCityIcon(ctx, city, x, y);
      drawCityStatus(ctx, city, x, y, this.camera.scale);
      if (city.id === this.state.selected?.id) {
        ctx.strokeStyle = "#fff4c5";
        ctx.lineWidth = 3;
        roundedRect(ctx, x + 3, y + 3, TILE - 6, TILE - 6, 10);
        ctx.stroke();
      }
    }

    for (const unit of this.state.units) {
      const tile = this.state.map.tiles[indexOf(unit.x, unit.y, this.state.map.width)];
      if (!tile.revealed) continue;
      const centerX = (unit.x + .5) * TILE;
      const centerY = (unit.y + .5) * TILE;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 17, 0, Math.PI * 2);
      ctx.fillStyle = CIVS[unit.owner].color;
      ctx.fill();
      ctx.strokeStyle = unit.id === this.state.selected?.id ? "#fff4c5" : "#1a2823";
      ctx.lineWidth = unit.id === this.state.selected?.id ? 4 : 2;
      ctx.stroke();
      drawUnitIcon(ctx, unit.type, centerX, centerY, .82);

      const maximum = UNIT_TYPES[unit.type].maxHealth;
      ctx.fillStyle = "#3b1717";
      roundedRect(ctx, unit.x * TILE + 8, unit.y * TILE + 46, 40, 5, 3);
      ctx.fill();
      ctx.fillStyle = unit.health / maximum > .45 ? "#75bd84" : "#d66e61";
      roundedRect(ctx, unit.x * TILE + 8, unit.y * TILE + 46,
        40 * Math.max(0, unit.health) / maximum, 5, 3);
      ctx.fill();
    }

    ctx.restore();
  }
}
