import Compositor from "./Compositor";
import Entity from "./Entity";
import EntityCollider from "./EntityCollider";
import { Tile } from "./loaders/level";
import { Matrix } from "./math";
import TileCollider from "./TileCollider";

export interface GameContext {
  dt: number,
  level: Level,
  audioContext: AudioContext,
}

export default class Level {
  public comp: Compositor;
  public entities: Set<Entity>;
  public tileCollider: TileCollider;
  public entityCollider: EntityCollider;
  public time: number;
  constructor(){
    this.comp = new Compositor();
    this.entities = new Set();

    this.tileCollider = null;
    this.entityCollider = new EntityCollider(this.entities);

    this.time = 0;
  }
  setCollisionGrid(matrix: Matrix<Tile>){
    this.tileCollider = new TileCollider(matrix);
  }
  update(dt: number, audioContext: AudioContext){
    this.entities.forEach(entity => {
      entity.update({ dt, level: this, audioContext });
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