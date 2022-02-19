import { LayerRenderer } from "../Compositor";
import Entity from "../Entity";

export function createSpriteLayer(entities: Set<Entity>, width: number = 64, height: number = 64) : LayerRenderer {
  const spriteCtx = document.createElement('canvas').getContext('2d');
  spriteCtx.imageSmoothingEnabled = false;
  spriteCtx.canvas.width = width;
  spriteCtx.canvas.height = height;

  return function drawSpriteLayer(ctx, camera){
    entities.forEach(entity => {
      spriteCtx.clearRect(0, 0, width, height);
      entity.draw(spriteCtx);

      ctx.drawImage(
        spriteCtx.canvas, 
        Math.floor(entity.pos.x - camera.pos.x),
        Math.floor(entity.pos.y - camera.pos.y)
      );
    })
  }
}