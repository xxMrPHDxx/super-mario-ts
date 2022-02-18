import Mario from "../entities/Mario";
import Entity, { Trait } from "../Entity";
import Level, { GameContext } from "../Level";
import { Vector } from "../math";

export default class PlayerController extends Trait {
  public checkpoint: Vector = new Vector();
  public player: Mario = null;

  setPlayer(player: Mario){
    this.player = player;
  }

  update(entity: Entity, gameContext: GameContext, level: Level): void {
    if(this.player && !level.entities.has(this.player)){
      this.player.killable.revive();
      this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
      level.entities.add(this.player);
    }
  }
}