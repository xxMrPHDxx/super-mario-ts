import Entity from "../Entity";
import Trait from "../Trait";
import Stomper from "./Stomper";

const COIN_LIFE_THRESHOLD = 100;

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

  addCoins(count: number){
    this.coins += count;
    this.queue((entity: Entity) => entity.sounds.add('coin'));
    while(this.coins >= COIN_LIFE_THRESHOLD){
      this.addLives(1);
      this.coins -= COIN_LIFE_THRESHOLD;
    }
  }

  addLives(count: number){
    this.lives += count;
  }
}