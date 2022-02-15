import { Vector } from "./math";

export default class Camera {
  public pos: Vector;
  public size: Vector;
  constructor(){
    this.pos = new Vector(0, 0);
    this.size = new Vector(256, 224);
  }
}