import { LayerRenderer } from "../Compositor";

export function createColorLayer(color: string) : LayerRenderer {
  return function drawDashboard(ctx: CanvasRenderingContext2D){
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}