import Entity, { Sides } from "../Entity";
import { GameContext } from "../Level";
import Trait from "../Trait";

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