import Entity from "../Entity";
import Trait from "../Trait";
import Killable from "./Killable";

export default class Stomper extends Trait {
  static STOMP = Symbol('stomp');
  private boundSpeed: number = 400;
  
  private bounce(us: Entity, them: Entity){
    us.bounds.bottom = them.bounds.top;
    us.vel.y = -this.boundSpeed
  }

  collides(us: Entity, them: Entity): void {
    if(!them.hasTrait(Killable)) return;
    const killable = them.getTrait<Killable>(Killable);
    if(!killable || killable.dead) return;
  
    if(us.vel.y > them.vel.y){
      this.queue(() => this.bounce(us, them));
      us.sounds.add('stomp');
      us.events.emit(Stomper.STOMP, us, them);
    }
  }
}