import { GameContext } from "./Level";
import Scene from "./Scene";

export default class TimedScene extends Scene {
  public countdown: number = 2;

  draw(ctx: CanvasRenderingContext2D){
    this.comp.draw(ctx);
  }
  
  update(gameContext: GameContext){
    this.countdown -= gameContext.dt;
    if(this.countdown <= 0){
      this.events.emit(Scene.COMPLETE);
    }
  }
}