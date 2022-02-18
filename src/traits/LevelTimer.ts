import Entity, { Trait } from "../Entity";
import { GameContext } from "../Level";

export default class LevelTimer extends Trait {
  static TIMER_HURRY = Symbol('timer.hurry');
  static TIMER_OKAY = Symbol('timer.okay');

  private totalTime: number = 300;
  public currentTime: number = this.totalTime;
  private hurryTime: number = 100;
  private hurryEmitted: boolean = null;

  update(entity: Entity, gameContext: GameContext): void {
    const { dt, level } = gameContext;
    this.currentTime -= dt * 2;
    if(this.hurryEmitted !== true && this.currentTime < this.hurryTime){
      level.events.emit(LevelTimer.TIMER_HURRY);
      this.hurryEmitted = true;
    }
    if(this.hurryEmitted !== false && this.currentTime > this.hurryTime){
      level.events.emit(LevelTimer.TIMER_OKAY);
      this.hurryEmitted = false;
    }
  }
}