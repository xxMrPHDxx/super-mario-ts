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
  env.addTrait(controller);
  return env;
}

export function* findPlayers(level: Level) : Generator<Entity> {
  if(!level) return;
  for(const entity of level.entities){
    if(entity.hasTrait(Player)) yield entity;
  }
}