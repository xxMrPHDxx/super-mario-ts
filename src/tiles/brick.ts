import { Sides } from "../Entity";
import { TileCollisionContext } from "../TileCollider";

function handleX(tileCollisionContext: TileCollisionContext){
  const { entity, match } = tileCollisionContext;
  if(entity.vel.x > 0){
    if(entity.bounds.right > match.x1){
      entity.obstruct(Sides.RIGHT, match);
    }
  }else if(entity.vel.x < 0){
    if(entity.bounds.left < match.x2){
      entity.obstruct(Sides.LEFT, match);
    }
  }
}

function handleY(tileCollisionContext: TileCollisionContext){
  const { entity, match, resolver, gameContext } = tileCollisionContext; 

  if(entity.vel.y > 0){
    if(entity.bounds.bottom > match.y1){
      entity.obstruct(Sides.BOTTOM, match);
    }
  }else if(entity.vel.y < 0){
    if(entity.getTrait('player')){
      const grid = resolver.matrix;
      grid.delete(match.indexX, match.indexY);
      const goomba = gameContext.entityFactory.goomba();
      goomba.pos.set(entity.pos.x, match.y1);
      goomba.vel.set(50, -400);
      gameContext.level.entities.add(goomba);
    }
    if(entity.bounds.top < match.y2){
      entity.obstruct(Sides.TOP, match);
    }
  }
}

export const brick = [ handleX, handleY ];