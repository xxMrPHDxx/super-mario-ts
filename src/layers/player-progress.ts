import { LayerRenderer } from "../Compositor";
import Mario from "../entities/Mario";
import Level from "../Level";
import { FontSheet } from "../loaders/font";
import { findPlayers } from "../player";

function getPlayer(level: Level) : Mario {
  for(const entity of findPlayers(level)){
    if(entity instanceof Mario) return entity;
  }
}

export function createPlayerProgressLayer(font: FontSheet, level: Level) : LayerRenderer {
  const size = font.size;

  const buffer: HTMLCanvasElement = document.createElement('canvas');
  buffer.width = buffer.height = 32;
  const bufferCtx = buffer.getContext('2d');

  return function drawPlayerProgress(ctx: CanvasRenderingContext2D){
    const player = getPlayer(level);
    font.draw(`WORLD ${level.name}`, ctx, size*12, size*12);

    bufferCtx.clearRect(0, 0, buffer.width, buffer.height);
    player.draw(bufferCtx);
    ctx.drawImage(buffer, size*12, size*15);

    font.draw(`x ${player.player.lives.toString().padStart(3, ' ')}`, ctx, size*16, size*16);
  }
}