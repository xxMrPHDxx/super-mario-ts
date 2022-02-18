import { createAnim } from "../anim";
import { loadImage, loadJSON } from "../loaders";
import SpriteSheet from "../SpriteSheet";

export interface TileSpec {
  name: string,
  index: [number, number],
}
interface FrameSpec {
  name: string,
  rect: [number, number, number, number],
}
interface AnimationSpec {
  name: string,
  frameLen: number,
  frames: string[],
}
interface SheetSpec {
  imageURL: string,
  tileW: number, tileH: number,
  tiles?: TileSpec[],
  frames?: FrameSpec[],
  animations?: AnimationSpec[],
}

export function loadSpriteSheet(name: string){
  return (loadJSON(`./sprites/${name}.json`) as Promise<SheetSpec>)
  .then(sheetSpec => Promise.all([
    sheetSpec,
    loadImage(sheetSpec.imageURL),
  ]))
  .then(([sheetSpec, image])=>{
    const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH);

    if(sheetSpec.tiles){
      sheetSpec.tiles.forEach(tileSpec => {
        sprites.defineTile(tileSpec.name, ...tileSpec.index);
      });
    }

    if(sheetSpec.frames){
      sheetSpec.frames.forEach(({name, rect}) => {
        sprites.define(name, ...rect);
      });
    }

    if(sheetSpec.animations){
      sheetSpec.animations.forEach(({name, frameLen, frames}) => {
        const animation = createAnim(frames, frameLen);
        sprites.defineAnim(name, animation);
      });
    }

    return sprites;
  })
}