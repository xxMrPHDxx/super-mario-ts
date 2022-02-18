import { GameContext } from "./Level";
import Scene from "./Scene";

export default class SceneRunner {
  public sceneIndex: number = -1;
  public scenes: Scene[] = [];

  addScene(scene: Scene){
    scene.events.listen(Scene.COMPLETE, () => this.runNext());
    this.scenes.push(scene);
  }

  runNext(){
    const currentScene = this.scenes[this.sceneIndex];
    if(currentScene){
      currentScene.pause();
    }
    this.sceneIndex++;
  }

  update(gameContext: GameContext){
    const currentScene = this.scenes[this.sceneIndex];
    if(!currentScene) return;
    currentScene.update(gameContext);
    currentScene.draw(gameContext.videoContext);
  }
}