import { TERRAIN, UNIT_TYPES } from "../content/config.js";
import { indexOf } from "../domain/world.js";
const TILE=56;
export class MapView {
  constructor(canvas,camera,onTile,onUnit){this.canvas=canvas;this.ctx=canvas.getContext("2d");this.camera=camera;this.onTile=onTile;this.onUnit=onUnit;this.wasDrag=false;this.pointers=new Map();this.gesture=null;this.bind();}
  resize(){const rect=this.canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;this.canvas.width=rect.width*dpr;this.canvas.height=rect.height*dpr;this.ctx.setTransform(dpr,0,0,dpr,0,0);}
  bind(){
    this.canvas.addEventListener("pointerdown",event=>{
      this.canvas.setPointerCapture(event.pointerId);
      this.pointers.set(event.pointerId,{x:event.offsetX,y:event.offsetY});
      this.wasDrag=false;
      this.beginGesture();
    });
    this.canvas.addEventListener("pointermove",event=>{
      if(!this.pointers.has(event.pointerId))return;
      this.pointers.set(event.pointerId,{x:event.offsetX,y:event.offsetY});
      const points=[...this.pointers.values()];
      if(points.length===1&&this.gesture){
        const dx=points[0].x-this.gesture.point.x,dy=points[0].y-this.gesture.point.y;
        if(Math.hypot(dx,dy)>6)this.wasDrag=true;
        this.camera.x=this.gesture.cameraX+dx;this.camera.y=this.gesture.cameraY+dy;
      }else if(points.length>=2&&this.gesture){
        const center={x:(points[0].x+points[1].x)/2,y:(points[0].y+points[1].y)/2};
        const distance=Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y);
        this.camera.scale=Math.max(.35,Math.min(2.5,this.gesture.scale*distance/this.gesture.distance));
        const ratio=this.camera.scale/this.gesture.scale;
        this.camera.x=center.x-(this.gesture.center.x-this.gesture.cameraX)*ratio;
        this.camera.y=center.y-(this.gesture.center.y-this.gesture.cameraY)*ratio;
        this.wasDrag=true;
      }
      this.draw();
    });
    const finish=event=>{
      const tap=!this.wasDrag&&this.pointers.size===1;
      this.pointers.delete(event.pointerId);
      if(tap){const p=this.camera.screenToTile(event.offsetX,event.offsetY,TILE);const u=this.state?.units.find(v=>v.owner==="player"&&v.x===p.x&&v.y===p.y);u?this.onUnit(u.id):this.onTile(p);}
      this.beginGesture();
    };
    this.canvas.addEventListener("pointerup",finish);
    this.canvas.addEventListener("pointercancel",finish);
    this.canvas.addEventListener("wheel",e=>{e.preventDefault();this.camera.zoom(e.deltaY<0?1.12:.89,{x:e.offsetX,y:e.offsetY});this.draw();},{passive:false});
  }
  beginGesture(){const points=[...this.pointers.values()];if(points.length===0){this.gesture=null;return;}this.gesture={point:points[0],cameraX:this.camera.x,cameraY:this.camera.y,scale:this.camera.scale};if(points.length>=2){this.gesture.center={x:(points[0].x+points[1].x)/2,y:(points[0].y+points[1].y)/2};this.gesture.distance=Math.max(1,Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y));}}
  setState(state){this.state=state;this.draw();}
  draw(){if(!this.state)return;const ctx=this.ctx,rect=this.canvas.getBoundingClientRect(),s=this.camera.scale;ctx.clearRect(0,0,rect.width,rect.height);ctx.save();ctx.translate(this.camera.x,this.camera.y);ctx.scale(s,s);for(const tile of this.state.map.tiles){const x=tile.x*TILE,y=tile.y*TILE;if(tile.revealed){ctx.fillStyle=TERRAIN[tile.terrain].color;ctx.fillRect(x,y,TILE,TILE);ctx.strokeStyle="rgba(240,226,180,.15)";ctx.strokeRect(x+.5,y+.5,TILE-1,TILE-1);if(tile.resource){ctx.fillStyle="#f3ce72";ctx.font="11px sans-serif";ctx.fillText(tile.resource,x+5,y+50);}if(tile.terrain==="forest"){ctx.fillStyle="#173e2f";ctx.font="22px serif";ctx.fillText("♠",x+18,y+34);}if(tile.terrain==="mountains"){ctx.fillStyle="#d2d0c4";ctx.font="22px serif";ctx.fillText("▲",x+17,y+35);}}else{ctx.fillStyle="#101a22";ctx.fillRect(x,y,TILE,TILE);ctx.strokeStyle="#162832";ctx.strokeRect(x+.5,y+.5,TILE-1,TILE-1);}}
    for(const city of this.state.settlements){if(!this.state.map.tiles[indexOf(city.x,city.y,this.state.map.width)].revealed)continue;ctx.fillStyle="#f2d087";ctx.beginPath();ctx.arc((city.x+.5)*TILE,(city.y+.5)*TILE,11,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#392d24";ctx.lineWidth=3;ctx.stroke();}
    for(const u of this.state.units){if(!this.state.map.tiles[indexOf(u.x,u.y,this.state.map.width)].revealed)continue;const selected=u.id===this.state.selectedUnitId;if(selected){ctx.strokeStyle="#ffe8a6";ctx.lineWidth=3;ctx.strokeRect(u.x*TILE+4,u.y*TILE+4,TILE-8,TILE-8);}ctx.fillStyle=u.owner==="player"?"#ecdfbe":"#bd5142";ctx.font="bold 25px sans-serif";ctx.textAlign="center";ctx.fillText(UNIT_TYPES[u.type].icon,(u.x+.5)*TILE,(u.y+.5)*TILE+9);ctx.textAlign="left";}ctx.restore();}
}
