import { loadMario } from './entities/Mario';
import { loadGoomba } from './entities/Goomba';
import { loadKoopa } from './entities/Koopa';
import Entity from './Entity';

type EntityCreator = () => Entity;

export interface EntityFactory {
  [key: string]: EntityCreator,
}

export function loadEntities() : Promise<EntityFactory> {
  return Promise.all([
    loadMario(),
    loadGoomba(),
    loadKoopa(),
  ]).then(([createMario, createGoomba, createKoopa]) => {
    const entityFactory: EntityFactory = {};
    entityFactory['mario'] = createMario;
    entityFactory['goomba'] = createGoomba;
    entityFactory['koopa'] = createKoopa;
    return entityFactory;
  });
}