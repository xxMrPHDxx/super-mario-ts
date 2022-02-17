import Entity, { Sides, Trait } from "../Entity";
import { GameContext } from "../Level";

const SPEED_BOOST = 0.3;

export default class Jump extends Trait {
  private duration: number;
  private velocity: number;
  private engageTime: number;
  private ready: number;

  private graceTime: number;
  private graceDuration: number;
  constructor(){
    super();
    this.duration = 0.3;
    this.velocity = 200;
    this.engageTime = 0;
    this.ready = 0;

    this.graceTime = 0;
    this.graceDuration = 0.1;
  }
  public get falling() : boolean { return this.ready < 0; }
  start(){
    this.graceTime = this.graceDuration;
  }
  cancel(){
    this.engageTime = 0;
    this.graceTime = 0;
  }
  obstruct(entity: Entity, side: Sides){
    if(side === Sides.BOTTOM) this.ready = 1;
    if(side === Sides.TOP) this.cancel();
  }
  update(entity: Entity, gameContext: GameContext){
    const { dt } = gameContext;
    
    if(this.graceTime > 0){
      if(this.ready > 0){
        entity.sounds.add('jump');
        this.engageTime = this.duration;
        this.graceTime = 0;
      }

      this.graceTime -= dt;
    }

    if(this.engageTime > 0){
      entity.vel.y = -(this.velocity + Math.abs(entity.vel.x) * SPEED_BOOST);
      this.engageTime -= dt;
    }

    this.ready--;
  }
}