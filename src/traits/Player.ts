import { Trait } from "../Entity";

export default class Player extends Trait {
  public lives: number = 3;
  public score: number = 0;
}