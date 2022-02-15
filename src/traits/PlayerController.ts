import Mario from "../entities/Mario";
import Entity, { Trait } from "../Entity";
import Level from "../Level";
import { Vector } from "../math";

export default class PlayerController extends Trait {
  private player: Mario = null;
  public checkpoint: Vector = new Vector();
  public time: number = 300;

  setPlayer(player: Mario){
    this.player = player;
  }

  update(entity: Entity, dt: number, level: Level): void {
    if(this.player && !level.entities.has(this.player)){
      this.player.killable.revive();
      this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
      level.entities.add(this.player);
    }else{
      this.time -= dt * 2;
    }
  }
}