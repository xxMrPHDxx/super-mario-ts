import Mario from './entities/Mario';
import Keyboard from './KeyboardState';

export function setupKeyboard(mario: Mario) : Keyboard {
  const input = new Keyboard();
  
  input.addMapping('KeyP', keyState => {
    if(keyState){
      mario.jump.start();
    }else{
      mario.jump.cancel();
    }
  });
  
  input.addMapping('KeyO', keyState => {
    mario.turbo(keyState === 1);
  });

  input.addMapping('KeyA', keyState => {
    mario.go.dir += keyState ? -1 : 1;
  });
  
  input.addMapping('KeyD', keyState => {
    mario.go.dir += keyState ? 1 : -1;
  });
  
  return input;
}