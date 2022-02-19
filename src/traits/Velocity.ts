import Entity from "../Entity";
import { GameContext } from "../Level";
import Trait from "../Trait";

export default class Velocity extends Trait {
  update(entity: Entity, gameContext: GameContext): void {
    const { dt } = gameContext;
    entity.pos.x += entity.vel.x * dt;
    entity.pos.y += entity.vel.y * dt;
  }
}