import Entity, { Trait } from "../Entity";
import { GameContext } from "../Level";

export default class Velocity extends Trait {
  update(entity: Entity, gameContext: GameContext): void {
    const { dt } = gameContext;
    entity.pos.x += entity.vel.x * dt;
    entity.pos.y += entity.vel.y * dt;
  }
}