import Entity, { Trait } from "../Entity";
import Level from "../Level";
import { loadSpriteSheet } from "../loaders";
import SpriteSheet from "../SpriteSheet";
import Killable from "../traits/Killable";
import PendulumMove from "../traits/PendulumMove";
import Physics from "../traits/Physics";
import Solid from "../traits/Solid";
import Stomper from "../traits/Stomper";
import Mario from "./Mario";

enum KoopaState {
  WALKING, HIDING, PANIC,
}

class Behavior extends Trait {
  public state: KoopaState = KoopaState.WALKING;
  public hideTime: number = 0;
  private hideDuration: number = 5;
  private panicSpeed: number = 300;
  private walkSpeed: number = null;

  collides(us: Entity, them: Entity): void {
    const stomper = them.getTrait('stomper');
    if(us instanceof Koopa && !us.killable.dead && stomper instanceof Stomper){
      if(them.vel.y > us.vel.y){
        this.handleStomp(us, them);
      }else if(them instanceof Mario){
        this.handleNudge(us, them);
      }
    }
  }

  handleNudge(us: Koopa, them: Mario){
    switch(this.state){
      case KoopaState.WALKING: them.killable.kill(); break;
      case KoopaState.HIDING: this.panic(us, them); break;
      case KoopaState.PANIC: {
        const travelDir = Math.sign(us.vel.x);
        const impactDir = Math.sign(us.pos.x - them.pos.x);
        if(travelDir !== 0 && travelDir !== impactDir){
          them.killable.kill();
        }
      } break;
    }
  }

  handleStomp(us: Koopa, them: Entity){
    switch(this.state){
      case KoopaState.WALKING: this.hide(us); break;
      case KoopaState.HIDING: {
        us.killable.kill();
        us.vel.set(100, -200);
        us.solid.obstructs = false;
      } break;
      case KoopaState.PANIC: this.hide(us); break;
    }
  }

  hide(us: Koopa){
    us.vel.x = 0;
    us.pendulumMove.enabled = false;
    if(!this.walkSpeed) this.walkSpeed = us.pendulumMove.speed;
    this.state = KoopaState.HIDING;
  }

  panic(us: Koopa, them: Entity){
    us.pendulumMove.enabled = true;
    us.pendulumMove.speed = this.panicSpeed * Math.sign(them.vel.x);
    this.state = KoopaState.PANIC;
  }

  unhide(us: Koopa){
    us.pendulumMove.enabled = true;
    us.pendulumMove.speed = this.walkSpeed;
    this.state = KoopaState.WALKING;
  }

  update(us: Entity, dt: number, level?: Level): void {
    if(!(us instanceof Koopa)) return;
    if(this.state === KoopaState.HIDING){
      this.hideTime += dt;
      if(this.hideTime > this.hideDuration){
        this.unhide(us as Koopa);
      }
    }
  }
}

class Koopa extends Entity {
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

export type KoopaFactory = () => Koopa;

export function loadKoopa() : Promise<KoopaFactory> {
  return loadSpriteSheet('koopa')
  .then(createKoopaFactory);
}

function createKoopaFactory(sprites: SpriteSheet) : KoopaFactory {
  const walkAnim = sprites.getAnimation('walk');
  const wakeAnim = sprites.getAnimation('wake');

  function routeAnim(koopa: Koopa){
    switch(koopa.behavior.state){
      case KoopaState.HIDING: {
        if(koopa.behavior.hideTime > 3) return wakeAnim(koopa.lifetime);
      }
      case KoopaState.PANIC: return 'hiding';
      default: return walkAnim(koopa.lifetime);
    }
  }

  function drawKoopa(ctx: CanvasRenderingContext2D){
    sprites.draw(routeAnim(this), ctx, 0, 0, this.vel.x < 0);
  }
  
  return function createKoopa(){
    const koopa = new Koopa();
    koopa.size.set(16, 16);
    koopa.offset.y = 8;

    koopa.draw = drawKoopa;

    return koopa;
  }
}