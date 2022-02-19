import { LayerRenderer } from "../Compositor";
import Level from "../Level";
import { FontSheet } from "../loaders/font";
import { findPlayers } from "../player";
import LevelTimer from "../traits/LevelTimer";
import Player from "../traits/Player";

function getPlayerTrait(level: Level) : Player {
  for(const entity of findPlayers(level)){
    return entity.getTrait(Player) as Player;
  }
}

function getTimerTrait(level: Level) : LevelTimer {
  for(const entity of level.entities){
    if(entity.hasTrait(LevelTimer)){
      return entity.getTrait(LevelTimer) as LevelTimer;
    }
  }
}

export function createDashboardLayer(font: FontSheet, level: Level) : LayerRenderer {
  const LINE1 = font.size;
  const LINE2 = font.size * 2;

  const timer = getTimerTrait(level);

  return function drawDashboard(ctx: CanvasRenderingContext2D){
    const player = getPlayerTrait(level);
    if(!player) return;
    
    font.draw(player.name, ctx, 16, LINE1);
    font.draw(player.score.toString().padStart(6, '0'), ctx, 16, LINE2);

    font.draw(`@x${player.coins.toString().padStart(2, '0')}`, ctx, 96, LINE2);

    font.draw('WORLD', ctx, 152, LINE1);
    font.draw(level.name, ctx, 160, LINE2);

    font.draw('TIME', ctx, 208, LINE1);
    font.draw(Math.max(0, timer.currentTime).toFixed(0).padStart(3, '0'), ctx, 216, LINE2);
  }
}