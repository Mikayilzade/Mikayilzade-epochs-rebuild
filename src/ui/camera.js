export class Camera {
  constructor(canvas){this.canvas=canvas;this.x=0;this.y=0;this.scale=1;this.drag=null;}
  fit(width,height,tile=56){const r=this.canvas.getBoundingClientRect();this.scale=Math.min(r.width/(width*tile+24),r.height/(height*tile+24),1.2);this.x=(r.width-width*tile*this.scale)/2;this.y=(r.height-height*tile*this.scale)/2;}
  zoom(factor,point){const rect=this.canvas.getBoundingClientRect(),p=point||{x:rect.width/2,y:rect.height/2};const old=this.scale;this.scale=Math.max(.35,Math.min(2.5,this.scale*factor));this.x=p.x-(p.x-this.x)*this.scale/old;this.y=p.y-(p.y-this.y)*this.scale/old;}
  focus(pos,tile=56){const r=this.canvas.getBoundingClientRect();this.x=r.width/2-(pos.x+.5)*tile*this.scale;this.y=r.height/2-(pos.y+.5)*tile*this.scale;}
  screenToTile(x,y,tile=56){return {x:Math.floor((x-this.x)/(tile*this.scale)),y:Math.floor((y-this.y)/(tile*this.scale))};}
}
