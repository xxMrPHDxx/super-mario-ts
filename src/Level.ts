import Compositor from "./Compositor";
import { EntityFactory } from "./entities";
import Entity from "./Entity";
import EntityCollider from "./EntityCollider";
import EventEmitter from "./EventEmitter";
import MusicController from "./MusicController";
import TileCollider from "./TileCollider";

export interface GameContext {
  dt: number,
  level: Level,
  audioContext: AudioContext,
  entityFactory: EntityFactory,
}

export default class Level {
  public events: EventEmitter = new EventEmitter();
  public music: MusicController = new MusicController();
  public comp: Compositor = new Compositor();
  public entities: Set<Entity> = new Set();
  public tileCollider: TileCollider = new TileCollider();
  public entityCollider: EntityCollider = new EntityCollider(this.entities);
  public time: number = 0;
  
  update(dt: number, audioContext: AudioContext, entityFactory: EntityFactory){
    this.entities.forEach(entity => {
      entity.update({ dt, level: this, audioContext, entityFactory });
    });

    this.entities.forEach(entity => {
      this.entityCollider.check(entity);
    });

    this.entities.forEach(entity => {
      entity.finalize();
    });

    this.time += dt;
  }
}