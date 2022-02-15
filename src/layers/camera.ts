import Camera from "../Camera";

export function createCameraLayer(cameraToDraw: Camera){
  return function drawCameraRect(ctx: CanvasRenderingContext2D, fromCamera: Camera){
    ctx.strokeStyle = 'purple';
    ctx.beginPath();
      ctx.rect(
        cameraToDraw.pos.x - fromCamera.pos.x, 
        cameraToDraw.pos.y - fromCamera.pos.y, 
        cameraToDraw.size.x, cameraToDraw.size.y
      );
      ctx.stroke();
      ctx.closePath();
  }
}