import Compositor from "./Compositor";
import EventEmitter from "./EventEmitter";
import { GameContext } from "./Level";

export default class Scene {
  static COMPLETE = Symbol('scene.complete');

  public events: EventEmitter = new EventEmitter();
  public comp: Compositor = new Compositor();

  draw(ctx: CanvasRenderingContext2D){
    this.comp.draw(ctx);
  }

  pause(){}
  
  update(gameContext: GameContext){}
}