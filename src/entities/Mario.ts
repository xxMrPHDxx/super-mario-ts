import AudioBoard from "../AudioBoard";
import Entity from "../Entity";
import { loadSpriteSheet } from "../loaders";
import { loadAudioBoard } from "../loaders/audio";
import SpriteSheet from "../SpriteSheet";
import Go from "../traits/Go";
import Jump from "../traits/Jump";
import Killable from "../traits/Killable";
import Physics from "../traits/Physics";
import Player from "../traits/Player";
import Solid from "../traits/Solid";
import Stomper from "../traits/Stomper";

const enum Drag {
  SLOW = 1/1000,
  FAST = 1/5000,
};

export default class Mario extends Entity {
  public player: Player;
  public physics: Physics;
  public solid: Solid;
  public go: Go;
  public jump: Jump;
  public stomper: Stomper;
  public killable: Killable;

  constructor(audioBoard: AudioBoard){
    super(audioBoard);
    this.size.set(14, 16);
    this.addTrait('player', this.player = new Player());
    this.addTrait('physics', this.physics = new Physics());
    this.addTrait('solid', this.solid = new Solid());
    this.addTrait('go', this.go = new Go());
    this.addTrait('jump', this.jump = new Jump());
    this.addTrait('stomper', this.stomper = new Stomper());
    this.addTrait('killable', this.killable = new Killable());
    this.go.drag = Drag.SLOW;
  }

  turbo(enabled: boolean){
    this.go.drag = enabled ? Drag.FAST : Drag.SLOW;
  }
}

export type MarioFactory = () => Mario;

export function loadMario(audioContext: AudioContext) : Promise<MarioFactory> {
  return Promise.all([
    loadSpriteSheet('mario'),
    loadAudioBoard('mario', audioContext),
  ])
  .then(([sprites, audio]) => {
    return createMarioFactory(sprites, audio);
  });
}

function createMarioFactory(sprites: SpriteSheet, audioBoard: AudioBoard) : MarioFactory {
  const runAnim = sprites.getAnimation('run');

  function routeFrame(mario: Mario){
    if(mario.jump.falling){
      return 'jump';
    }
    if(mario.go.distance > 0){
      if((mario.vel.x > 0 && mario.go.dir < 0) || (mario.vel.x < 0 && mario.go.dir > 0))
        return 'break';
  
      return runAnim(mario.go.distance);
    }
    return 'idle';
  }

  function drawMario(ctx: CanvasRenderingContext2D){
    sprites.draw(routeFrame(this), ctx, 0, 0, this.go.heading < 0);
  }
  
  return function createMario(){
    const mario = new Mario(audioBoard);

    mario.draw = drawMario;
    mario.killable.removeAfter = 0;

    return mario;
  }
}