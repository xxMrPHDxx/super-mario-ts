import { EntityFactory } from "../entities";
import { createBackgroundLayer } from "../layers/background";
import { createSpriteLayer } from "../layers/sprite";
import Level from "../Level";
import { loadJSON, loadSpriteSheet } from "../loaders";
import { Matrix } from "../math";
import SpriteSheet from "../SpriteSheet";

type Range = [number, number, number?, number?];
interface TileSpec {
  name: string,
  pattern?: string,
  type?: string,
  ranges: Range[],
}
interface PatternSpec {
  tiles: TileSpec[],
}
interface PatternsSpec {
  [key: string]: PatternSpec,
};
interface LayerSpec {
  tiles: TileSpec[],
}
interface EntitySpec {
  name: string,
  pos: [number, number],
}
interface LevelSpec {
  spriteSheet: string,
  patterns: PatternsSpec,
  layers: LayerSpec[],
  entities: EntitySpec[],
}
interface ExpandedTile {
  tile: TileSpec,
  x: number,
  y: number,
}

function setupCollision(levelSpec: LevelSpec, level: Level){
  const mergedTiles = levelSpec.layers.reduce((mergedTiles, layerSpec) => {
    return mergedTiles.concat(layerSpec.tiles);
  }, []);
  const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);
  level.setCollisionGrid(collisionGrid);
}

function setupBackgrounds(levelSpec: LevelSpec, level: Level, sprites: SpriteSheet){
  levelSpec.layers.forEach((layer, i) => {
    const backgroundGrid = createBackgroundGrid(layer.tiles, levelSpec.patterns);
    const backgroundLayer = createBackgroundLayer(level, backgroundGrid, sprites);
    level.comp.add(backgroundLayer);
  });
}

function setupEntities(levelSpec: LevelSpec, level: Level, entityFactory: EntityFactory){
  levelSpec.entities.forEach(({name, pos: [x, y]}) => {
    const createEntity = entityFactory[name];
    const entity = createEntity();
    entity.pos.set(x, y);
    level.entities.add(entity);
  })

  const spriteLayer = createSpriteLayer(level.entities);
  level.comp.add(spriteLayer);
}

type LevelLoader = (name: string) => Promise<Level>;
export function createLevelLoader(entityFactory: EntityFactory) : LevelLoader {
  return function loadLevel(name: string) : Promise<Level> {
    return (loadJSON(`./levels/${name}.json`) as Promise<LevelSpec>)
    .then(levelSpec => Promise.all([
      levelSpec,
      loadSpriteSheet(levelSpec.spriteSheet),
    ]))
    .then(([levelSpec, sprites]) => {
      const level = new Level();

      setupCollision(levelSpec, level);
      setupBackgrounds(levelSpec, level, sprites);
      setupEntities(levelSpec, level, entityFactory);
      
      return level;
    });
  }
}

export interface Tile { name?: string, type?: string };
function createCollisionGrid(tiles: TileSpec[], patterns: PatternsSpec) : Matrix<Tile> {
  const grid: Matrix<Tile> = new Matrix();

  for(const { tile, x, y } of expandTiles(tiles, patterns)){
    grid.set(x, y, { type: tile.type });
  }

  return grid;
}

function createBackgroundGrid(tiles: TileSpec[], patterns: PatternsSpec) : Matrix<Tile> {
  const grid: Matrix<Tile> = new Matrix();

  for(const { tile, x, y } of expandTiles(tiles, patterns)){
    grid.set(x, y, { name: tile.name });
  }

  return grid;
}

type Coord = { x: number, y:number };
function* expandSpan(xStart: number, xLen: number, yStart: number, yLen: number) : Generator<Coord> {
  const xEnd = xStart + xLen, yEnd = yStart + yLen;
  for(let x=xStart; x<xEnd; x++){
    for(let y=yStart; y<yEnd; y++){
      yield { x, y };
    }
  }
}

function expandRange(range: Range) : Generator<Coord> {
  switch(range.length){
    case 4: return expandSpan(...range);
    case 3: return expandSpan(range[0], range[1], range[2], 1);
    case 2: return expandSpan(range[0], 1, range[1], 1);
  }
}

function* expandRanges(ranges: Range[]) : Generator<any> {
  for(const range of ranges){
    yield* expandRange(range);
  }
}

function* expandTiles(tiles: TileSpec[], patterns: PatternsSpec) : Generator<ExpandedTile> {
  function* walkTiles(tiles: TileSpec[], offsetX: number, offsetY: number) : Generator<ExpandedTile> {
    for(const tile of tiles){
      for(const { x, y } of expandRanges(tile.ranges)){
        const derivedX = x + offsetX, derivedY = y + offsetY;
        if(tile.pattern){
          const tiles = patterns[tile.pattern].tiles;
          yield* walkTiles(tiles, derivedX, derivedY);
        }else{
          yield {
            tile,
            x: derivedX,
            y: derivedY,
          };
        }
      }
    }
  }

  yield* walkTiles(tiles, 0, 0);
}