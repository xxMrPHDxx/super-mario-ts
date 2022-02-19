import { LayerRenderer } from "../Compositor";
import { FontSheet } from "../loaders/font";

export function createTextLayer(font: FontSheet, text: string) : LayerRenderer {
  const size = font.size;
  return function drawText(ctx: CanvasRenderingContext2D){
    const textW = text.length;
    const screenW = Math.floor(ctx.canvas.width / size);
    const screenH = Math.floor(ctx.canvas.height / size);
    const x = (screenW - textW) / 2;
    const y = screenH / 2;

    font.draw(text, ctx, x * size, y * size);
  }
}