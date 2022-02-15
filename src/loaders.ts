import { createAnim } from "./anim";
import SpriteSheet from "./SpriteSheet";

export async function loadImage(path: string) : Promise<HTMLImageElement>{
  return new Promise((resolve, reject)=>{
    const img = new Image();
    img.onload = ()=>resolve(img);
    img.onerror = reject;
    img.src = path;
  });
}

export function loadJSON(path: string) : Promise<object> {
  return fetch(path).then(res=>res.json());
}

export interface TileSpec {
  name: string,
  index: [number, number],
}
export interface FrameSpec {
  name: string,
  rect: [number, number, number, number],
}
export interface AnimationSpec {
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