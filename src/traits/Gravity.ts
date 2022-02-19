import Entity from "../Entity";
import { GameContext } from "../Level";
import Trait from "../Trait";

export default class Gravity extends Trait {
  private gravity: number = 1500;
  update(entity: Entity, gameContext: GameContext): void {
    const { dt } = gameContext;

    entity.vel.y += this.gravity * dt;
  }
}