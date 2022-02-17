import Entity, { Sides, Trait } from "../Entity";
import { GameContext } from "../Level";

export default class PendulumWalk extends Trait {
  public enabled: boolean = true;
  public speed: number = -30;
  obstruct(entity: Entity, side: Sides): void {
    if(side === Sides.LEFT || side === Sides.RIGHT)
      this.speed *= -1;
  }
  update(entity: Entity, gameContext: GameContext): void {
    if(this.enabled) entity.vel.x = this.speed;
  }
}