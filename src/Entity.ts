import AudioBoard from "./AudioBoard";
import BoundingBox from "./BoundingBox";
import { LayerRenderer } from "./Compositor";
import EventBuffer from "./EventBuffer";
import Level, { GameContext } from "./Level";
import { Vector } from "./math";
import { ResolvedTile } from "./TileCollider";
import Trait from "./Trait";

export enum Sides {
  TOP, BOTTOM, LEFT, RIGHT,
}

export type Task = (entity?: Entity) => void;
export type Listener = {
  name: Symbol,
  callback: Task,
  count: number,
};

export default class Entity {
  public audioBoard: AudioBoard;
  public sounds: Set<string> = new Set();

  public events: EventBuffer = new EventBuffer();
  
  public pos: Vector = new Vector();
  public size: Vector = new Vector();
  public offset: Vector = new Vector();
  public bounds: BoundingBox;
  public vel: Vector = new Vector();
  public lifetime: number = 0;

  private traits: Map<Function, Trait> = new Map();

  constructor(audioBoard?: AudioBoard){
    this.audioBoard = audioBoard;
    this.bounds = new BoundingBox(this.pos, this.size, this.offset);
  }

  addTrait(trait: Trait){
    this.traits.set(trait.constructor, trait);
  }

  collides(candidate: Entity){
    this.traits.forEach(trait => {
      trait.collides(this, candidate);
    })
  }

  finalize(){
    this.events.emit(Trait.TASK, this);

    this.traits.forEach(trait => {
      trait.finalize(this);
    });

    this.events.clear();
  }

  getTrait<T extends Trait>(cls: Function) : T {
    return this.traits.get(cls) as T;
  }

  hasTrait(cls: Function) : boolean {
    return this.traits.has(cls);
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

  update(gameContext: GameContext, level?: Level){
    this.traits.forEach(trait => {
      trait.update(this, gameContext, level);
    });
    this.playSounds(this.audioBoard, gameContext.audioContext);
    this.lifetime += gameContext.dt;
  }

  public draw: LayerRenderer = (ctx, camera) => {};
}