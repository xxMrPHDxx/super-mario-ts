import Entity, { Trait } from "../Entity";
import { loadSpriteSheet } from "../loaders/sprite";
import SpriteSheet from "../SpriteSheet";
import Killable from "../traits/Killable";
import PendulumMove from "../traits/PendulumMove";
import Physics from "../traits/Physics";
import Solid from "../traits/Solid";
import Stomper from "../traits/Stomper";
import Mario from "./Mario";

class Behavior extends Trait {
  collides(us: Entity, them: Entity): void {
    const stomper = them.getTrait('stomper');
    if(us instanceof Goomba && !us.killable.dead && stomper instanceof Stomper){
      if(them.vel.y > us.vel.y){
        us.killable.kill();
        us.pendulumMove.speed = 0;
      }else if(them instanceof Mario){
        them.killable.kill();
      }
    }
  }
}

export default class Goomba extends Entity {
  public physics: Physics;
  public solid: Solid;
  public pendulumMove: PendulumMove;
  public behavior: Behavior;
  public killable: Killable;

  constructor(){
    super();
    this.addTrait('physics', this.physics = new Physics());
    this.addTrait('solid', this.solid = new Solid());
    this.addTrait('pendulumMove', this.pendulumMove = new PendulumMove());
    this.addTrait('goomba', this.behavior = new Behavior());
    this.addTrait('killable', this.killable = new Killable());
  }
}

export type GoombaFactory = () => Goomba;

export function loadGoomba(audioContext: AudioContext) : Promise<GoombaFactory> {
  return loadSpriteSheet('goomba')
  .then(createGoombaFactory);
}

function createGoombaFactory(sprites: SpriteSheet) : GoombaFactory {
  const walkAnim = sprites.getAnimation('walk');

  function routeAnim(goomba: Goomba) : string {
    if(goomba.killable.dead){
      return 'flat';
    }
    return walkAnim(goomba.lifetime);
  }

  function drawGoomba(ctx: CanvasRenderingContext2D){
    sprites.draw(routeAnim(this), ctx, 0, 0);
  }
  
  return function createGoomba(){
    const goomba = new Goomba();
    goomba.size.set(16, 16);

    goomba.draw = drawGoomba;

    return goomba;
  }
}