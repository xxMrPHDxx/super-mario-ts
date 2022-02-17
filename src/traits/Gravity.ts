import Entity, { Trait } from "../Entity";
import { GameContext } from "../Level";

export default class Gravity extends Trait {
  private gravity: number = 1500;
  update(entity: Entity, gameContext: GameContext): void {
    const { dt } = gameContext;

    entity.vel.y += this.gravity * dt;
  }
}