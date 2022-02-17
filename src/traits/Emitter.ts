import Entity, { Trait } from "../Entity";
import Level, { GameContext } from "../Level";

type EmitterCallback = (entity: Entity, level: Level) => void;

export default class Emitter extends Trait {
  private cooldown: number = 2;
  public interval: number = 2;
  public emitters: EmitterCallback[] = [];

  emit(entity: Entity, level: Level){
    for(const emitter of this.emitters){
      emitter(entity, level);
    }
  }

  update(entity: Entity, gameContext: GameContext): void {
    const { dt, level } = gameContext;
    this.cooldown -= dt;
    if(this.cooldown < 0){
      this.emit(entity, level);
      this.cooldown = this.interval;
    }
  }
}