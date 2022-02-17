import Timer from './Timer';
import { setupKeyboard } from './input';
import Camera from './Camera';
import { createLevelLoader } from './loaders/level';
import { loadEntities } from './entities';
import Mario from './entities/Mario';
import PlayerController from './traits/PlayerController';
import { createCollisionLayer } from './layers/collision';
import { loadFont } from './loaders/font';
import { createDashboardLayer } from './layers/dashboard';
import { createPlayerEnv } from './player';

async function main(canvas: HTMLCanvasElement){
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const audioContext = new AudioContext();

  const [entityFactory, font] = await Promise.all([
    loadEntities(audioContext),
    loadFont(),
  ]);

  const loadLevel = await createLevelLoader(entityFactory);
  const level = await loadLevel('1-1');
  
  const camera = new Camera();
  
  const mario = entityFactory.mario();
  console.log(mario.player);

  const playerEnv = createPlayerEnv(mario);
  level.entities.add(playerEnv);

  level.comp.add(createCollisionLayer(level));
  level.comp.add(createDashboardLayer(font, playerEnv.getTrait('controller') as PlayerController));

  const input = setupKeyboard(mario);
  input.listenTo(window);

  const timer = new Timer();

  timer.update = (dt) => {
    level.update(dt, audioContext);

    camera.pos.x = Math.max(0, mario.pos.x - 100);

    level.comp.draw(ctx, camera);
  }

  timer.start();
}

const canvas: HTMLCanvasElement = document.querySelector('canvas#screen');

const start = () => {
  window.removeEventListener('click', start);
  main(canvas);
}
window.addEventListener('click', start);
