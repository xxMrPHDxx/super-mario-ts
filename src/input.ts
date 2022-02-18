import Mario from './entities/Mario';
import InputRouter from './InputRouter';
import Keyboard from './KeyboardState';

export function setupKeyboard(window: Window) : InputRouter {
  const input = new Keyboard();
  const router = new InputRouter();

  input.listenTo(window);
  
  input.addMapping('KeyP', keyState => {
    if(keyState){
      router.route((entity: Mario) => entity.jump.start());
    }else{
      router.route((entity: Mario) => entity.jump.cancel());
    }
  });
  
  input.addMapping('KeyO', keyState => {
    router.route((entity: Mario) => entity.turbo(keyState === 1));
  });

  input.addMapping('KeyA', keyState => {
    router.route((entity: Mario) => entity.go.dir += keyState ? -1 : 1);
  });
  
  input.addMapping('KeyD', keyState => {
    router.route((entity: Mario) => entity.go.dir += keyState ? 1 : -1);
  });
  
  return router;
}