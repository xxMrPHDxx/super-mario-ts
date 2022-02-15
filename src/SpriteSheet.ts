type AnimationRenderer = (distance: number) => string;

export default class SpriteSheet {
  private image: HTMLImageElement;
  private width: number; 
  private height: number;
  private frames: Map<string, HTMLCanvasElement[]>;
  private animations: Map<string, AnimationRenderer>;
  constructor(image: HTMLImageElement, width?: number, height?: number){
    this.image = image;
    this.width = width;
    this.height = height;
    this.frames = new Map();
    this.animations = new Map();
  }
  getAnimation(name: string){
    return this.animations.get(name);
  }
  defineAnim(name: string, animation: AnimationRenderer){
    this.animations.set(name, animation);
  }  
  define(name: string, x: number, y: number, width: number, height: number){
    const buffers = [false, true].map(flip => {
      const ctx = document.createElement('canvas').getContext('2d');
      ctx.canvas.setAttribute('width', `${this.width}px`);
      ctx.canvas.setAttribute('height', `${this.height}px`);

      if(flip){
        ctx.scale(-1, 1);
        ctx.translate(-width, 0);
      }

      ctx.drawImage(
        this.image, 
        x, y, width, height,
        0, 0, width, height
      );
      
      return ctx.canvas;
    })

    this.frames.set(name, buffers);
  }
  defineTile(name: string, x: number, y: number){
    this.define(name, x*this.width, y*this.height, this.width, this.height);
  }
  draw(name: string, ctx: CanvasRenderingContext2D, x: number, y: number, flip: boolean = false){
    const frame = this.frames.get(name);
    if(!frame){
      console.warn(`Frame ${name} is not defined!`);
    }
    ctx.drawImage(frame[flip?1:0], x, y);
  }
  drawAnim(name: string, ctx: CanvasRenderingContext2D, x: number, y: number, distance: number){
    const animation = this.animations.get(name);
    if(!animation) return this.drawTile(name, ctx, x, y);
    this.drawTile(animation(distance), ctx, x, y);
  }
  drawTile(name: string, ctx: CanvasRenderingContext2D, x: number, y: number, flip: boolean = false){
    this.draw(name, ctx, x*this.width, y*this.height, flip);
  }
}