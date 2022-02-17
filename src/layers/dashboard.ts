import { LayerRenderer } from "../Compositor";
import { FontSheet } from "../loaders/font";
import PlayerController from "../traits/PlayerController";

export function createDashboardLayer(font: FontSheet, playerController: PlayerController) : LayerRenderer {
  const LINE1 = font.size;
  const LINE2 = font.size * 2;

  const coins = 26;

  return function drawDashboard(ctx: CanvasRenderingContext2D){
    const time = Math.max(0, playerController.time);

    font.draw('MARIO', ctx, 16, LINE1);
    font.draw(playerController.score.toString().padStart(6, '0'), ctx, 16, LINE2);

    font.draw(`@x${coins.toString().padStart(2, '0')}`, ctx, 96, LINE2);

    font.draw('WORLD', ctx, 152, LINE1);
    font.draw('1-1', ctx, 160, LINE2);

    font.draw('TIME', ctx, 208, LINE1);
    font.draw(time.toFixed(0).padStart(3, '0'), ctx, 216, LINE2);
  }
}