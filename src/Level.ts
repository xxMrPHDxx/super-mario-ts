import Camera from "./Camera";
import { EntityFactory } from "./entities";
import Entity from "./Entity";
import EntityCollider from "./EntityCollider";
import MusicController from "./MusicController";
import { findPlayers } from "./player";
import Scene from "./Scene";
import TileCollider from "./TileCollider";

export interface GameContext {
  dt: number,
  audioContext: AudioContext,
  entityFactory: EntityFactory,
  videoContext: CanvasRenderingContext2D,
}

function focusPlayer(level: Level){
  for(const player of findPlayers(level)){
    level.camera.pos.x = Math.max(0, player.pos.x - 100);
  }
}

export default class Level extends Scene {
  static TRIGGER = Symbol('trigger');

  public name: string = '';
  public camera: Camera = new Camera();
  public music: MusicController = new MusicController();
  public entities: Set<Entity> = new Set();
  public tileCollider: TileCollider = new TileCollider();
  public entityCollider: EntityCollider = new EntityCollider(this.entities);
  public time: number = 0;

  draw(ctx: CanvasRenderingContext2D){
    this.comp.draw(ctx, this.camera);
  }

  pause() {
    this.music.pause();
  }
  
  update(gameContext: GameContext){
    const { dt } = gameContext;

    this.entities.forEach(entity => {
      entity.update(gameContext, this);
    });

    this.entities.forEach(entity => {
      this.entityCollider.check(entity);
    });

    this.entities.forEach(entity => {
      entity.finalize();
    });

    focusPlayer(this);

    this.time += dt;
  }
}