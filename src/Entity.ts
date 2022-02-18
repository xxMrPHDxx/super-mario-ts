import AudioBoard from "./AudioBoard";
import BoundingBox from "./BoundingBox";
import { LayerRenderer } from "./Compositor";
import EventBuffer from "./EventBuffer";
import { GameContext } from "./Level";
import { Vector } from "./math";
import { ResolvedTile } from "./TileCollider";

export enum Sides {
  TOP, BOTTOM, LEFT, RIGHT,
}

export type Task = (entity?: Entity) => void;
export type Listener = {
  name: Symbol,
  callback: Task,
  count: number,
};

export class Trait {
  static TASK = Symbol('task');
  public listeners: Listener[] = [];

  collides(us: Entity, them: Entity){}
  finalize(entity: Entity){
    this.listeners = this.listeners.filter(listener => {
      entity.events.process(listener.name, listener.callback);
      return --listener.count;
    });
  }
  listen(name: Symbol, callback: Task, count: number = Infinity){
    this.listeners.push({ name, callback, count });
  }
  obstruct(entity: Entity, side: Sides, match?: ResolvedTile){}
  queue(task: Task){
    this.listen(Trait.TASK, task, 1);
  }
  update(entity: Entity, gameContext?: GameContext){}
}

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

  private traits: Map<string, Trait> = new Map();

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
    this.events.emit(Trait.TASK, this);

    this.traits.forEach(trait => {
      trait.finalize(this);
    });

    this.events.clear();
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