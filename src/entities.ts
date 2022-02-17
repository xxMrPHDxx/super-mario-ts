import Mario, { loadMario } from './entities/Mario';
import Goomba, { loadGoomba } from './entities/Goomba';
import Koopa, { loadKoopa } from './entities/Koopa';
import Entity from './Entity';

type EntityCreator<T extends Entity> = () => T;
type EntityType = 'mario' | 'goomba' | 'koopa';

export type IEntityFactory = {
  [key in EntityType]: EntityCreator<Entity>;
};

export class EntityFactory implements IEntityFactory {
  [key: string]: EntityCreator<Entity>;
  get mario() : EntityCreator<Mario> { return this['mario']; }
  get goomba() : EntityCreator<Goomba> { return this['goomba']; }
  get koopa() : EntityCreator<Koopa> { return this['koopa']; }
}

export function loadEntities(audioContext: AudioContext) : Promise<EntityFactory> {
  return Promise.all([
    loadMario(audioContext),
    loadGoomba(audioContext),
    loadKoopa(audioContext),
  ]).then(([createMario, createGoomba, createKoopa]) => {
    const entityFactory: EntityFactory = {
      mario: createMario,
      goomba: createGoomba,
      koopa: createKoopa,
    };
    return entityFactory;
  });
}