import AudioBoard from "./AudioBoard";
import BoundingBox from "./BoundingBox";
import { LayerRenderer } from "./Compositor";
import EventEmitter from "./EventEmitter";
import { GameContext } from "./Level";
import { Vector } from "./math";
import { ResolvedTile } from "./TileCollider";

export enum Sides {
  TOP, BOTTOM, LEFT, RIGHT,
}

export type Task = () => void;

export class Trait {
  public tasks: Task[] = [];
  public events: EventEmitter = new EventEmitter();

  collides(us: Entity, them: Entity){}
  finalize(){
    this.tasks.forEach(task => task());
    this.tasks.length = 0;
  }
  obstruct(entity: Entity, side: Sides, match?: ResolvedTile){}
  queue(task: Task){
    this.tasks.push(task);
  }
  update(entity: Entity, gameContext?: GameContext){}
}

export default class Entity {
  public audioBoard: AudioBoard;
  public sounds: Set<string> = new Set();
  
  public pos: Vector = new Vector();
  public size: Vector = new Vector();
  public offset: Vector = new Vector();
  public bounds: BoundingBox;
  public vel: Vector = new Vector();
  private traits: Map<string, Trait> = new Map();
  public lifetime: number = 0;

  constructor(audioBoard?: AudioBoard){
    this.audioBoard = audioBoard;
    this.bounds = new BoundingBox(this.pos, this.size, this.offset);
  }

  addTrait(name: string, trait: Trait){
    this.traits.set(name, trait);
  }

  collides(candidate: Entity){
    this.traits.forEach(trait => {
      trait.collides(this, candidate);
    })
  }

  finalize(){
    this.traits.forEach(trait => {
      trait.finalize();
    });
  }

  getTrait(name: string) : Trait {
    const trait = this.traits.get(name);
    return trait;
  }

  obstruct(side: Sides, match?: ResolvedTile){
    this.traits.forEach(trait => {
      trait.obstruct(this, side, match);
    });
  }

  playSounds(audioBoard: AudioBoard, audioContext: AudioContext){
    this.sounds.forEach(name => {
      audioBoard.play(name, audioContext);
    });
    this.sounds.clear();
  }

  update(gameContext: GameContext){
    this.traits.forEach(trait => {
      trait.update(this, gameContext);
    });
    this.playSounds(this.audioBoard, gameContext.audioContext);
    this.lifetime += gameContext.dt;
  }

  public draw: LayerRenderer = (ctx, camera) => {};
}