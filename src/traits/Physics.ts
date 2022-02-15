import Entity, { Trait } from "../Entity";
import Level from "../Level";

export default class Physics extends Trait {
  private gravity: number = 1500;
  update(entity: Entity, dt: number, level?: Level): void {
    entity.pos.x += entity.vel.x * dt;
    level.tileCollider.checkX(entity);

    entity.pos.y += entity.vel.y * dt;
    level.tileCollider.checkY(entity);

    entity.vel.y += this.gravity * dt;
  }
}