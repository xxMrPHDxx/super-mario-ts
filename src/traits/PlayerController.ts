import Mario from "../entities/Mario";
import Entity, { Trait } from "../Entity";
import { GameContext } from "../Level";
import { Vector } from "../math";

export default class PlayerController extends Trait {
  public player: Mario = null;
  public checkpoint: Vector = new Vector();
  public time: number = 300;
  public score: number = 0;

  setPlayer(player: Mario){
    this.player = player;

    this.player.stomper.events.listen('stomp', () => {
      this.score += 100;
    });
  }

  update(entity: Entity, gameContext: GameContext): void {
    const { dt, level } = gameContext;

    if(this.player && !level.entities.has(this.player)){
      this.player.killable.revive();
      this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
      level.entities.add(this.player);
    }else{
      this.time -= dt * 2;
    }
  }
}