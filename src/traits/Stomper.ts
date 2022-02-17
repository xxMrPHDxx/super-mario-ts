import Entity, { Trait } from "../Entity";
import Killable from "./Killable";

export default class Stomper extends Trait {
  private boundSpeed: number = 400;
  
  private bounce(us: Entity, them: Entity){
    us.bounds.bottom = them.bounds.top;
    us.vel.y = -this.boundSpeed
  }

  collides(us: Entity, them: Entity): void {
    const killable = them.getTrait('killable');
    if(!killable || !(killable instanceof Killable) || killable.dead) return;
    
    if(us.vel.y > them.vel.y){
      this.bounce(us, them);
      this.sounds.add('stomp');
    }
  }
}