import { Trait } from "../Entity";
import Stomper from "./Stomper";

export default class Player extends Trait {
  public name: string = 'N/A';
  public coins: number = 0;
  public lives: number = 3;
  public score: number = 0;

  constructor(){
    super();

    this.listen(Stomper.STOMP, () => {
      this.score += 100;
    });
  }
}