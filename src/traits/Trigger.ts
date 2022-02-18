import Entity, { Trait } from "../Entity";
import Level, { GameContext } from "../Level";

type Touch = (entity: Entity, touches: Set<Entity>, gameContext: GameContext, level: Level) => void;

export default class Trigger extends Trait {
  public touches: Set<Entity> = new Set();
  public conditions: Touch[] = [];

  collides(us: Entity, them: Entity): void {
    this.touches.add(them);
  }

  update(entity: Entity, gameContext: GameContext, level: Level) {
    if(this.touches.size > 0){
      for(const condition of this.conditions){
        condition(entity, this.touches, gameContext, level);
      }
      this.touches.clear();
    }
  }
}