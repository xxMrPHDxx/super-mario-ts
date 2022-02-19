import Timer from './Timer';
import { setupKeyboard } from './input';
import { createLevelLoader, TriggerSpec } from './loaders/level';
import { loadEntities } from './entities';
import { createCollisionLayer } from './layers/collision';
import { loadFont } from './loaders/font';
import { createDashboardLayer } from './layers/dashboard';
import { createPlayerEnv } from './player';
import SceneRunner from './SceneRunner';
import { createPlayerProgressLayer } from './layers/player-progress';
import TimedScene from './TimedScene';
import { createColorLayer } from './layers/color';
import Level from './Level';
import Entity from './Entity';
import Player from './traits/Player';
import Scene from './Scene';
import { createTextLayer } from './layers/text';

async function main(canvas: HTMLCanvasElement){
  const videoContext: CanvasRenderingContext2D = canvas.getContext('2d');
  videoContext.imageSmoothingEnabled = false;
  const audioContext = new AudioContext();

  const [entityFactory, font] = await Promise.all([
    loadEntities(audioContext),
    loadFont(),
  ]);

  const loadLevel = await createLevelLoader(entityFactory);

  const sceneRunner = new SceneRunner();
  
  const mario = entityFactory.mario();
  mario.player.name = 'MARIO';

  const inputRouter = setupKeyboard(window);
  inputRouter.addReceiver(mario);

  async function runLevel(name: string){
    const loadScreen = new Scene();
    loadScreen.comp.add(createColorLayer('#000'));
    loadScreen.comp.add(createTextLayer(font, `Loading ${name}`));
    sceneRunner.addScene(loadScreen);
    sceneRunner.runNext();

    const level = await loadLevel(name);

    level.events.listen(Level.TRIGGER, (spec: TriggerSpec, trigger: Entity, touches: Set<Entity>) => {
      if(spec.type === 'goto'){
        for(const entity of touches){
          if(entity.hasTrait(Player)){
            return runLevel(spec.name);
          }
        }
      }
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
  
    const dashboardLayer = createDashboardLayer(font, level);
    const playerProgressLayer = createPlayerProgressLayer(font, level);

    mario.pos.set(0, 0);
    level.entities.add(mario);
  
    const playerEnv = createPlayerEnv(mario);
    level.entities.add(playerEnv);
  
    const waitScreen = new TimedScene();
    waitScreen.comp.add(createColorLayer('#000'));
    waitScreen.comp.add(dashboardLayer);
    waitScreen.comp.add(playerProgressLayer);
    sceneRunner.addScene(waitScreen);
  
    level.comp.add(createCollisionLayer(level));
    level.comp.add(dashboardLayer);
    sceneRunner.addScene(level);

    sceneRunner.runNext();
  }

  const timer = new Timer();

  timer.update = (dt) => {
    sceneRunner.update({ dt, audioContext, entityFactory, videoContext });
  }

  timer.start();

  runLevel('debug-progression');
}

const canvas: HTMLCanvasElement = document.querySelector('canvas#screen');

const start = () => {
  window.removeEventListener('click', start);
  main(canvas);
}
window.addEventListener('click', start);
