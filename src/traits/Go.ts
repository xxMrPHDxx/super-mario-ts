import Entity, { Trait } from "../Entity";
import Jump from "./Jump";

export default class Go extends Trait {
  public dir: number;
  private acceleration: number;
  private deceleration: number;
  private friction: number;
  public distance: number;
  public heading: number;
  constructor(){
    super();
    this.dir = 0;
    this.acceleration = 400;
    this.deceleration = 300;
    this.friction = 1/5000;
    this.distance = 0;
    this.heading = 1;
  }

  set drag(friction: number){ this.friction = friction; }

  update(entity: Entity, dt: number){
    const absX = Math.abs(entity.vel.x);

    if(this.dir !== 0){
      entity.vel.x += this.acceleration * dt * this.dir;

      const jump = entity.getTrait('jump');
      if(jump){
        if(jump instanceof Jump && !jump.falling){
          this.heading = this.dir;
        }
      }else{
        this.heading = this.dir;
      }
    }else if(entity.vel.x !== 0){
      const decel = Math.min(absX, this.deceleration * dt);
      entity.vel.x += decel * (entity.vel.x > 0 ? -1 : 1);
    }else{
      this.distance = 0;
    }

    const drag = this.friction * entity.vel.x * absX;
    entity.vel.x -= drag;
    
    this.distance += absX * dt;
  }
}