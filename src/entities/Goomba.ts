import Entity from "../Entity";
import { loadSpriteSheet } from "../loaders/sprite";
import SpriteSheet from "../SpriteSheet";
import Trait from "../Trait";
import Killable from "../traits/Killable";
import PendulumMove from "../traits/PendulumMove";
import Physics from "../traits/Physics";
import Solid from "../traits/Solid";
import Stomper from "../traits/Stomper";
import Mario from "./Mario";

class Behavior extends Trait {
  collides(us: Entity, them: Entity): void {
    if(!(us instanceof Goomba && them.hasTrait(Stomper))) return;
    if(!us.killable.dead){
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
    this.addTrait(this.physics = new Physics());
    this.addTrait(this.solid = new Solid());
    this.addTrait(this.pendulumMove = new PendulumMove());
    this.addTrait(this.behavior = new Behavior());
    this.addTrait(this.killable = new Killable());
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