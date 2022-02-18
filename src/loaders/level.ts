import { EntityFactory } from "../entities";
import Entity from "../Entity";
import { createBackgroundLayer } from "../layers/background";
import { createSpriteLayer } from "../layers/sprite";
import Level from "../Level";
import { loadJSON } from "../loaders";
import { Matrix } from "../math";
import SpriteSheet from "../SpriteSheet";
import LevelTimer from "../traits/LevelTimer";
import { loadMusicSheet } from "./music";
import { loadSpriteSheet } from "./sprite";

type Range = [number, number, number?, number?];
export interface LevelTileSpec {
  name: string,
  pattern?: string,
  type?: string,
  ranges: Range[],
}
interface PatternSpec {
  tiles: LevelTileSpec[],
}
interface PatternsSpec {
  [key: string]: PatternSpec,
};
interface LayerSpec {
  tiles: LevelTileSpec[],
}
interface EntitySpec {
  name: string,
  pos: [number, number],
}
interface LevelSpec {
  spriteSheet: string,
  musicSheet: string,
  patterns: PatternsSpec,
  layers: LayerSpec[],
  entities: EntitySpec[],
}
interface ExpandedTile {
  tile: LevelTileSpec,
  x: number,
  y: number,
}

function createTimer() : Entity {
  const timer = new Entity();
  timer.addTrait('levelTimer', new LevelTimer());
  return timer;
}

function setupBehavior(level: Level){
  const timer = createTimer();
  level.entities.add(timer);

  level.events.listen(LevelTimer.TIMER_OKAY, () => level.music.playTheme());
  level.events.listen(LevelTimer.TIMER_HURRY, () => level.music.playHurryTheme());
}

function setupBackgrounds(levelSpec: LevelSpec, level: Level, sprites: SpriteSheet){
  levelSpec.layers.forEach((layer, i) => {
    const grid = createGrid(layer.tiles, levelSpec.patterns);
    const backgroundLayer = createBackgroundLayer(level, grid, sprites);
    level.comp.add(backgroundLayer);
    level.tileCollider.addGrid(grid);
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
      loadMusicSheet(levelSpec.musicSheet),
    ]))
    .then(([levelSpec, sprites, musicPlayer]) => {
      const level = new Level();
      level.music.setPlayer(musicPlayer);

      setupBackgrounds(levelSpec, level, sprites);
      setupEntities(levelSpec, level, entityFactory);
      setupBehavior(level);
      
      return level;
    });
  }
}

function createGrid(tiles: LevelTileSpec[], patterns: PatternsSpec) : Matrix<LevelTileSpec> {
  const grid: Matrix<LevelTileSpec> = new Matrix();

  for(const { tile, x, y } of expandTiles(tiles, patterns)){
    grid.set(x, y, tile);
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

function* expandTiles(tiles: LevelTileSpec[], patterns: PatternsSpec) : Generator<ExpandedTile> {
  function* walkTiles(tiles: LevelTileSpec[], offsetX: number, offsetY: number) : Generator<ExpandedTile> {
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