import { TileCollisionContext } from "../TileCollider";
import Player from "../traits/Player";

function handle(tileCollisionContext: TileCollisionContext){
  const { entity, resolver, match } = tileCollisionContext;
  const player = entity.getTrait('player');
  if(player instanceof Player){
    player.addCoins(1);
    const grid = resolver.matrix;
    grid.delete(match.indexX, match.indexY);
  }
}

export const coin = [ handle, handle ];