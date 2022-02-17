import Mario, { loadMario } from './entities/Mario';
import Goomba, { loadGoomba } from './entities/Goomba';
import Koopa, { loadKoopa } from './entities/Koopa';
import Entity from './Entity';
import Bullet, { loadBullet } from './entities/Bullet';
import Cannon, { loadCannon } from './entities/Cannon';

export type EntityCreator<T extends Entity> = () => T;

export interface EntityFactory {
  [key: string]: EntityCreator<Entity>;
  mario?: EntityCreator<Mario>,
  goomba?: EntityCreator<Goomba>,
  koopa?: EntityCreator<Koopa>,
  bullet?: EntityCreator<Bullet>,
  cannon?: EntityCreator<Cannon>,
}

export function loadEntities(audioContext: AudioContext) : Promise<EntityFactory> {
  const entityFactory: EntityFactory = {};

  function addAs(name: string){
    return (factory: EntityCreator<Entity>) => entityFactory[name] = factory;
  }

  return Promise.all([
    loadMario(audioContext).then(addAs('mario')),
    loadGoomba(audioContext).then(addAs('goomba')),
    loadKoopa(audioContext).then(addAs('koopa')),
    loadBullet(audioContext).then(addAs('bullet')),
    loadCannon(audioContext, entityFactory).then(addAs('cannon')),
  ])
  .then(() => entityFactory);
}