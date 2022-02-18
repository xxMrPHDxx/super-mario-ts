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
import CompositionScene from './CompositionScene';
import { createColorLayer } from './layers/color';
import Level from './Level';
import Entity from './Entity';
import Player from './traits/Player';

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
    const level = await loadLevel(name);

    level.events.listen(Level.TRIGGER, (spec: TriggerSpec, trigger: Entity, touches: Set<Entity>) => {
      if(spec.type !== 'goto') return;
      console.log('Emitting level trigger event', spec);
      for(const entity of touches){
        const player = entity.getTrait('player') as Player;
        if(!player) continue;
        return runLevel(spec.name);
      }
    });
  
    const dashboardLayer = createDashboardLayer(font, level);
    const playerProgressLayer = createPlayerProgressLayer(font, level);

    mario.pos.set(0, 0);
    level.entities.add(mario);
  
    const playerEnv = createPlayerEnv(mario);
    level.entities.add(playerEnv);
  
    const waitScreen = new CompositionScene();
    waitScreen.comp.add(createColorLayer('#000'));
    waitScreen.comp.add(dashboardLayer);
    waitScreen.comp.add(playerProgressLayer);
    sceneRunner.addScene(waitScreen);
  
    level.comp.add(createCollisionLayer(level));
    level.comp.add(dashboardLayer);
    sceneRunner.addScene(level);

    console.log('Running next scene', sceneRunner.sceneIndex);
    sceneRunner.runNext();
    console.log('Running next scene', sceneRunner.sceneIndex);
    sceneRunner.runNext();
    console.log('Running next scene', sceneRunner.sceneIndex);
  }

  (window as any).runLevel = runLevel;

  const timer = new Timer();

  console.log(sceneRunner);
  timer.update = (dt) => {
    console.log('Updating...');
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
