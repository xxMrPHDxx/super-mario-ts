import { loadImage } from "../loaders";
import SpriteSheet from "../SpriteSheet";

const LETTERS = ` !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~`

export class FontSheet {
  private sheet: SpriteSheet;
  public size: number;
  constructor(sheet: SpriteSheet, size: number){
    this.sheet = sheet;
    this.size = size;
  }
  draw(text: string, ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number){
    for(let x=0; x<text.length; x++){
      this.sheet.draw(text[x], ctx, offsetX + x * this.size, offsetY);
    }
  }
}

export async function loadFont() : Promise<FontSheet> {
  const image = await loadImage('./sheets/font.png')
  const sprites = new SpriteSheet(image);

  const size = 8;
  for(let i=0; i<LETTERS.length; i++){
    const x = (i & 15) * size;
    const y = (i >> 4) * size;
    sprites.define(LETTERS[i], x, y, size, size);
  }

  return new FontSheet(sprites, size);
}