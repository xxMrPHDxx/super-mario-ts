import Entity, { Sides } from "../Entity";
import { ResolvedTile } from "../TileCollider";
import Trait from "../Trait";

export default class Solid extends Trait {
  public obstructs: boolean = true;
  obstruct(entity: Entity, side: Sides, match: ResolvedTile){
    if(!this.obstructs) return;
    switch(side){
      case Sides.RIGHT: {
        entity.bounds.left = match.x1 - entity.size.x;
        entity.vel.x = 0;
      } break;
      case Sides.LEFT: {
        entity.bounds.left = match.x2;
        entity.vel.x = 0;
      } break;
      case Sides.BOTTOM: {
        entity.bounds.top = match.y1 - entity.size.y;
        entity.vel.y = 0;
      } break;
      case Sides.TOP: {
        entity.bounds.top = match.y2;
        entity.vel.y = 0;
      } break;
    }
  }
}