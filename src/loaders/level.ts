import { EntityFactory } from "../entities";
import Entity from "../Entity";
import { createBackgroundLayer } from "../layers/background";
import { createSpriteLayer } from "../layers/sprite";
import Level from "../Level";
import { loadJSON } from "../loaders";
import { Matrix } from "../math";
import SpriteSheet from "../SpriteSheet";
import LevelTimer from "../traits/LevelTimer";
import Trigger from "../traits/Trigger";
import { loadMusicSheet } from "./music";
import { loadSpriteSheet } from "./sprite";

type Range = [number, number, number?, number?];
export type LevelTileSpec = {
  name: string,
  pattern?: string,
  type?: string,
  ranges: Range[],
}
type PatternSpec = {
  tiles: LevelTileSpec[],
}
type PatternsSpec = {
  [key: string]: PatternSpec,
};
type LayerSpec = {
  tiles: LevelTileSpec[],
}
type EntitySpec = {
  name: string,
  pos: [number, number],
}
export type TriggerSpec = {
  type: string,
  name: string,
  pos: [number, number],
}
type LevelSpec = {
  spriteSheet: string,
  musicSheet: string,
  patternSheet: string,
  layers: LayerSpec[],
  entities: EntitySpec[],
  triggers?: TriggerSpec[],
}
type ExpandedTile = {
  tile: LevelTileSpec,
  x: number,
  y: number,
}

async function loadPattern(name: string) : Promise<PatternsSpec> {
  return await loadJSON(`./sprites/patterns/${name}.json`) as PatternsSpec;
}

function setupBehavior(level: Level){
  const timer = new Entity();
  timer.addTrait(new LevelTimer());
  level.entities.add(timer);

  level.events.listen(LevelTimer.TIMER_OKAY, () => level.music.playTheme());
  level.events.listen(LevelTimer.TIMER_HURRY, () => level.music.playHurryTheme());
}

function setupBackgrounds(levelSpec: LevelSpec, level: Level, sprites: SpriteSheet, patternsSpec: PatternsSpec){
  levelSpec.layers.forEach(layer => {
    const grid = createGrid(layer.tiles, patternsSpec);
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

function setupTriggers(levelSpec: LevelSpec, level: Level){
  if(!levelSpec.triggers) return;
  for(const triggerSpec of levelSpec.triggers){
    const trigger = new Trigger();

    if(!trigger) continue;
    trigger.conditions.push((entity, touches, gc, level) => {
      level.events.emit(Level.TRIGGER, triggerSpec, entity, touches);
    });

    const entity = new Entity();
    entity.addTrait(trigger);
    entity.pos.set(...triggerSpec.pos);
    entity.size.set(16, 16);
    level.entities.add(entity);
  }
}

type LevelLoader = (name: string) => Promise<Level>;
export function createLevelLoader(entityFactory: EntityFactory) : LevelLoader {
  return function loadLevel(name: string) : Promise<Level> {
    return (loadJSON(`./levels/${name}.json`) as Promise<LevelSpec>)
    .then(levelSpec => Promise.all([
      levelSpec,
      loadSpriteSheet(levelSpec.spriteSheet),
      loadMusicSheet(levelSpec.musicSheet),
      loadPattern(levelSpec.patternSheet),
    ]))
    .then(([levelSpec, sprites, musicPlayer, patternSpec]) => {
      const level = new Level();
      level.name = name;
      level.music.setPlayer(musicPlayer);

      setupBackgrounds(levelSpec, level, sprites, patternSpec);
      setupEntities(levelSpec, level, entityFactory);
      setupTriggers(levelSpec, level);
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