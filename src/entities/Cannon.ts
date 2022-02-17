import AudioBoard from "../AudioBoard";
import { EntityFactory } from "../entities";
import Entity from "../Entity";
import Level from "../Level";
import { loadAudioBoard } from "../loaders/audio";
import { findPlayers } from "../player";
import Emitter from "../traits/Emitter";

const HOLD_FIRE_THRESHOLD = 30;

export default class Cannon extends Entity {
  public emitter: Emitter;

  constructor(audioBoard: AudioBoard){
    super(audioBoard);
    this.addTrait('emitter', this.emitter = new Emitter());
    this.size.set(16, 14);
  }
}

export type CannonFactory = () => Cannon;

export function loadCannon(audioContext: AudioContext, entityFactory: EntityFactory) : Promise<CannonFactory> {
  return loadAudioBoard('cannon', audioContext)
  .then(audio => {
    return createCannonFactory(audio, entityFactory);
  });
}


function createCannonFactory(audioBoard: AudioBoard, entityFactory: EntityFactory) : CannonFactory {
  function emitBullet(entity: Entity, level: Level){
    if(!(entity instanceof Cannon)) return;

    let dir;
    for(const player of findPlayers(level)){
      dir = player.pos.x - entity.pos.x;
      if(Math.abs(player.pos.x - entity.pos.x) <= HOLD_FIRE_THRESHOLD){
        return;
      }
    }

    const bullet = entityFactory.bullet();
    bullet.pos.copy(entity.pos);
    bullet.vel.x = 80 * Math.sign(dir);

    entity.sounds.add('shoot');
    level.entities.add(bullet);
  }

  return function createCannon(){
    const cannon = new Cannon(audioBoard);

    cannon.emitter.interval = 4;
    cannon.emitter.emitters.push(emitBullet);

    return cannon;
  }
}