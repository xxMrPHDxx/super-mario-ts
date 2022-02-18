import Entity, { Trait } from "../Entity";
import Level, { GameContext } from "../Level";

type EmitterCallback = (entity: Entity, gameContext: GameContext, level?: Level) => void;

export default class Emitter extends Trait {
  private cooldown: number = 2;
  public interval: number = 2;
  public emitters: EmitterCallback[] = [];

  emit(entity: Entity, gameContext: GameContext){
    for(const emitter of this.emitters){
      emitter(entity, gameContext);
    }
  }

  update(entity: Entity, gameContext: GameContext): void {
    const { dt } = gameContext;
    this.cooldown -= dt;
    if(this.cooldown < 0){
      this.emit(entity, gameContext);
      this.cooldown = this.interval;
    }
  }
}