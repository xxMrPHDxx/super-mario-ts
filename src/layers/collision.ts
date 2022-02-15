import Camera from "../Camera";
import { LayerRenderer } from "../Compositor";
import Entity from "../Entity";
import Level from "../Level";
import TileCollider from "../TileCollider";

interface Vec2 { x: number, y: number };

function createEntityLayer(entities: Set<Entity>){
  return function drawBoundingBox(ctx: CanvasRenderingContext2D, camera: Camera){
    ctx.strokeStyle = 'red';
    entities.forEach(entity => {
      ctx.beginPath();
      ctx.rect(
        entity.bounds.left - camera.pos.x, 
        entity.bounds.top - camera.pos.y, 
        entity.size.x, entity.size.y
      );
      ctx.stroke();
      ctx.closePath();
    });
  };
}

function createTileCandidateLayer(tileCollider: TileCollider){
  const resolvedTiles: Vec2[] = [];

  const resolver = tileCollider.tiles;
  const tileSize = resolver.getTileSize();

  const getByIndexOriginal = resolver.getByIndex;
  resolver.getByIndex = function getByIndexFake(x: number, y: number){
    resolvedTiles.push({x, y});
    return getByIndexOriginal.call(resolver, x, y);
  }

  return function drawTileCandidates(ctx: CanvasRenderingContext2D, camera: Camera){
    ctx.strokeStyle = 'blue';
    resolvedTiles.forEach(({x,y}) => {
      ctx.beginPath();
      ctx.rect(
        x*tileSize - camera.pos.x, 
        y*tileSize - camera.pos.y, 
        tileSize, tileSize
      );
      ctx.stroke();
      ctx.closePath();
    });

    resolvedTiles.length = 0;
  };
}

export function createCollisionLayer(level: Level) : LayerRenderer {
  const drawTileCandidates = createTileCandidateLayer(level.tileCollider);
  const drawBoundingBoxes = createEntityLayer(level.entities);

  return function drawCollision(ctx: CanvasRenderingContext2D, camera: Camera){
    drawTileCandidates(ctx, camera);
    drawBoundingBoxes(ctx, camera);
  }
}