import Mario from "./entities/Mario";
import Entity from "./Entity";
import Level from "./Level";
import Player from "./traits/Player";
import PlayerController from "./traits/PlayerController";

export function createPlayerEnv(player: Mario) : Entity {
  const env = new Entity();
  const controller = new PlayerController();
  controller.checkpoint.set(64, 64);
  controller.setPlayer(player);
  env.addTrait('controller', controller);
  return env;
}

export function* findPlayers(level: Level) : Generator<Entity> {
  for(const entity of level.entities){
    if(entity.getTrait('player') instanceof Player) yield entity;
  }
}