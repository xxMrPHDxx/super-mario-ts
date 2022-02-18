export default class Timer {
  public update: (dt: number) => void;
  private updateProxy: (dt: number) => void;
  private running: boolean = false;
  constructor(deltaTime: number = 1/60){
    let accumulatedTime = 0, lastTime: number = null;

    this.updateProxy = (time: number = 0) => {
      if(lastTime){
        accumulatedTime += (time - lastTime) / 1000;

        if(accumulatedTime > 1) accumulatedTime = 1;
    
        while(accumulatedTime > deltaTime){
          this.update(deltaTime)
          accumulatedTime -= deltaTime;
        }
      }

      lastTime = time;

      this.enqueue();
    }
  }
  enqueue(){
    requestAnimationFrame(this.updateProxy);
  }
  start(){
    if(this.running) return;
    this.running = true;
    this.enqueue();
  }
}