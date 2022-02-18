import Entity from "./Entity";
import { GameContext } from "./Level";
import { LevelTileSpec } from "./loaders/level";
import { Matrix } from "./math";
import { brick } from "./tiles/brick";
import { ground } from "./tiles/ground";

export interface ResolvedTile {
  tile: LevelTileSpec,
  x1: number, x2: number,
  y1: number, y2: number,
  indexX: number, indexY: number,
}

export type TileCollisionContext = {
  entity: Entity, 
  match: ResolvedTile, 
  resolver: TileResolver, 
  gameContext: GameContext
}

type HandlerCallback = (tileCollisionContext: TileCollisionContext) => void;

interface Handlers {
  [key: string]: HandlerCallback[],
}

const handlers: Handlers = {
  brick,
  ground,
};

export class TileResolver {
  public matrix: Matrix<LevelTileSpec>;
  public tileSize: number;
  constructor(matrix: Matrix<LevelTileSpec>, tileSize: number = 16){
    this.matrix = matrix;
    this.tileSize = tileSize;
  }
  toIndex(pos: number) : number {
    return Math.floor(pos / this.tileSize);
  }
  toIndexRange(pos1: number, pos2: number): number[]{
    const pMax = Math.ceil(pos2 / this.tileSize) * this.tileSize;
    const range = [];
    let pos = pos1;
    do {
      range.push(this.toIndex(pos));
      pos += this.tileSize;
    }while(pos < pMax);
    return range;
  }
  getByIndex(x: number, y: number) : ResolvedTile {
    const tile = this.matrix.get(x, y);
    if(tile) return {
      tile,
      x1: x * this.tileSize,
      x2: (x+1) * this.tileSize,
      y1: y * this.tileSize,
      y2: (y+1) * this.tileSize,
      indexX: x, indexY: y,
    }
    return null;
  }
  searchByPosition(x: number, y: number) : ResolvedTile {
    return this.getByIndex(this.toIndex(x), this.toIndex(y));
  }
  searchByRange(x1: number, x2: number, y1: number, y2: number) : ResolvedTile[] {
    const matches: ResolvedTile[] = [];
    this.toIndexRange(x1, x2).forEach(x => {
      this.toIndexRange(y1, y2).forEach(y => {
        const match = this.getByIndex(x, y);
        if(!match) return;
        matches.push(match);
      });
    });
    return matches;
  }
}

export default class TileCollider {
  public resolvers: TileResolver[] = [];

  addGrid(tileMatrix: Matrix<LevelTileSpec>){
    this.resolvers.push(new TileResolver(tileMatrix));
  }

  checkX(entity: Entity, gameContext: GameContext){
    if(entity.vel.x === 0) return;
    let x = entity.bounds.left + (entity.vel.x > 0 ? entity.size.x : 0);

    for(const resolver of this.resolvers){
      const matches = resolver.searchByRange(
        x, x,
        entity.bounds.top, entity.bounds.bottom
      );

      matches.forEach(match =>{
        this.handle(0, { entity, match, resolver, gameContext });
      });
    }
  }

  checkY(entity: Entity, gameContext: GameContext){
    if(entity.vel.y === 0) return;
    let y = entity.bounds.top + (entity.vel.y > 0 ? entity.size.y : 0);
  
    for(const resolver of this.resolvers){
      const matches = resolver.searchByRange(
        entity.bounds.left, entity.bounds.right, 
        y, y
      );

      matches.forEach(match =>{
        this.handle(1, { entity, match, resolver, gameContext });
      });
    }
  }

  private handle(index: number, tileCollisionContext: TileCollisionContext){
    const handler = handlers[tileCollisionContext.match.tile.type];
    if(!handler || !handler[index]) return;
    handler[index](tileCollisionContext);
  }
}