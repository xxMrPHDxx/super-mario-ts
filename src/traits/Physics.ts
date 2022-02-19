import Entity from "../Entity";
import Level, { GameContext } from "../Level";
import Trait from "../Trait";

export default class Physics extends Trait {
  private gravity: number = 1500;
  update(entity: Entity, gameContext: GameContext, level: Level): void {
    const { dt } = gameContext;

    entity.pos.x += entity.vel.x * dt;
    level.tileCollider.checkX(entity, gameContext, level);

    entity.pos.y += entity.vel.y * dt;
    level.tileCollider.checkY(entity, gameContext, level);

    entity.vel.y += this.gravity * dt;
  }
}