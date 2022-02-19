import Entity, { Listener, Sides, Task } from "./Entity";
import Level, { GameContext } from "./Level";
import { ResolvedTile } from "./TileCollider";

export default class Trait {
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
  update(entity: Entity, gameContext?: GameContext, level?: Level){}
}