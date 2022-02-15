import { LayerRenderer } from "../Compositor";
import Level from "../Level";
import { Tile } from "../loaders/level";
import { Matrix } from "../math";
import SpriteSheet from "../SpriteSheet";
import { TileResolver } from "../TileCollider";

export function createBackgroundLayer(level: Level, tiles: Matrix<Tile>, sprites: SpriteSheet) : LayerRenderer {
  const resolver = new TileResolver(tiles);

  const ctx = document.createElement('canvas').getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.canvas.width = 256 + 16;
  ctx.canvas.height = 240;

  function redraw(drawFrom: number, drawTo: number){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for(let x=drawFrom; x<=drawTo; x++){
      const col = tiles.grid[x];
      if(!col) continue;
      col.forEach((tile, y)=>{
        sprites.drawAnim(tile.name, ctx, x-drawFrom, y, level.time);
      });
    }
  }

  return function drawBackgroundLayer(screen, camera){ 
    const drawWidth = resolver.toIndex(camera.size.x);
    const drawFrom = resolver.toIndex(camera.pos.x);
    const drawTo = drawFrom + drawWidth;
    redraw(drawFrom, drawTo);
    screen.drawImage(
      ctx.canvas, 
      -camera.pos.x % 16, 
      -camera.pos.y
    );
  }
}