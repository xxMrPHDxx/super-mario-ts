import Camera from "./Camera";

export type LayerRenderer = (ctx: CanvasRenderingContext2D, camera?: Camera) => void;

export default class Compositor {
  private layers: LayerRenderer[];
  constructor(){
    this.layers = [];
  }
  add(layer: LayerRenderer){
    this.layers.push(layer);
  }
  draw(ctx: CanvasRenderingContext2D, camera: Camera){
    this.layers.forEach(layer => layer(ctx, camera))
  }
}