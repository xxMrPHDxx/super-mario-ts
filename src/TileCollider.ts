import Entity, { Sides } from "./Entity";
import { Tile } from "./loaders/level";
import { Matrix } from "./math";

export interface ResolvedTile {
  tile: Tile,
  x1: number, x2: number,
  y1: number, y2: number,
}

export class TileResolver {
  private matrix: Matrix<Tile>;
  private tileSize: number;
  constructor(matrix: Matrix<Tile>, tileSize: number = 16){
    this.matrix = matrix;
    this.tileSize = tileSize;
  }
  getTileSize(){ return this.tileSize; }
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
  public tiles: TileResolver;
  constructor(matrix: Matrix<Tile>){
    this.tiles = new TileResolver(matrix);
  }

  checkX(entity: Entity){
    if(entity.vel.x === 0) return;
    let x = entity.bounds.left + (entity.vel.x > 0 ? entity.size.x : 0);

    const matches = this.tiles.searchByRange(
      x, x,
      entity.bounds.top, entity.bounds.bottom
    );

    matches.forEach(match =>{
      if(match.tile.type !== 'ground') return;
      
      if(entity.vel.x > 0){
        if(entity.bounds.right > match.x1){
          entity.obstruct(Sides.RIGHT, match);
        }
      }else if(entity.vel.x < 0){
        if(entity.bounds.left < match.x2){
          entity.obstruct(Sides.LEFT, match);
        }
      }
    })
  }

  checkY(entity: Entity){
    if(entity.vel.y === 0) return;
    let y = entity.bounds.top + (entity.vel.y > 0 ? entity.size.y : 0);
  
    const matches = this.tiles.searchByRange(
      entity.bounds.left, entity.bounds.right, 
      y, y
    );

    matches.forEach(match =>{
      if(match.tile.type !== 'ground') return;
      
      if(entity.vel.y > 0){
        if(entity.bounds.bottom > match.y1){
          entity.obstruct(Sides.BOTTOM, match);
        }
      }else if(entity.vel.y < 0){
        if(entity.bounds.top < match.y2){
          entity.obstruct(Sides.TOP, match);
        }
      }
    })
  }
}