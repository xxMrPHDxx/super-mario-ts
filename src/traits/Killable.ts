import Entity, { Trait } from "../Entity";
import Level, { GameContext } from "../Level";

export default class Killable extends Trait {
  public dead: boolean = false;
  public removeAfter: number = 2;
  private deadTime: number = 0;

  kill(){
    this.queue(() => this.dead = true);
  }

  revive(){
    this.dead = false;
    this.deadTime = 0;
  }

  update(entity: Entity, gameContext: GameContext): void {
    const { dt, level } = gameContext;

    if(this.dead){
      this.deadTime += dt;
      if(this.deadTime > this.removeAfter){
        this.queue(() => level.entities.delete(entity));
      }
    }
  }
}