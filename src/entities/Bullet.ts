import Entity, { Trait } from "../Entity";
import { GameContext } from "../Level";
import { loadSpriteSheet } from "../loaders";
import SpriteSheet from "../SpriteSheet";
import Gravity from "../traits/Gravity";
import Killable from "../traits/Killable";
import Physics from "../traits/Physics";
import Solid from "../traits/Solid";
import Stomper from "../traits/Stomper";
import Velocity from "../traits/Velocity";
import Mario from "./Mario";

class Behavior extends Trait {
  private gravity: Gravity = new Gravity();

  collides(us: Entity, them: Entity): void {
    const stomper = them.getTrait('stomper');
    if(us instanceof Bullet && !us.killable.dead && stomper instanceof Stomper){
      if(them.vel.y > us.vel.y){
        us.killable.kill();
        us.vel.set(100, -200);
      }else if(them instanceof Mario){
        them.killable.kill();
      }
    }
  }

  update(entity: Entity, gameContext: GameContext): void {
    if(!(entity instanceof Bullet)) return;
    if(entity.killable.dead){
      this.gravity.update(entity, gameContext);
    }
  }
}

export default class Bullet extends Entity {
  public velocity: Velocity;
  public behavior: Behavior;
  public killable: Killable;

  constructor(){
    super();
    this.addTrait('velocity', this.velocity = new Velocity());
    this.addTrait('bullet', this.behavior = new Behavior());
    this.addTrait('killable', this.killable = new Killable());
  }
}

export type BulletFactory = () => Bullet;

export function loadBullet(audioContext: AudioContext) : Promise<BulletFactory> {
  return loadSpriteSheet('bullet')
  .then(createBulletFactory);
}

function createBulletFactory(sprites: SpriteSheet) : BulletFactory {
  function drawBullet(ctx: CanvasRenderingContext2D){
    sprites.draw('bullet', ctx, 0, 0, this.vel.x < 0);
  }
  
  return function createBullet(){
    const bullet = new Bullet();
    bullet.size.set(16, 16);

    bullet.draw = drawBullet;

    return bullet;
  }
}