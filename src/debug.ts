import Camera from "./Camera";
import Entity from "./Entity";

export function setupMouseControl(canvas: HTMLCanvasElement, entity: Entity, camera: Camera){
  let lastX: number = 0;
  ['mousedown', 'mousemove'].forEach(name => {
    canvas.addEventListener(name, (event: MouseEvent) => {
      if(event.buttons === 1){
        entity.vel.set(0, 0);
        entity.pos.set(
          event.offsetX + camera.pos.x, 
          event.offsetY + camera.pos.y
        );
      }else if (event.buttons === 2 && event.type === 'mousemove') {
        const dx = event.offsetX - lastX;
        camera.pos.x -= dx;
      }
      lastX = event.offsetX;
    });

    canvas.addEventListener('contextmenu', e => e.preventDefault());
  });
}