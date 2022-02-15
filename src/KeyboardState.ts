export enum KeyState { RELEASED, PRESSED };

type KeyMap = (state: KeyState) => void;

export default class KeyboardState {
  private keyStates: Map<string,KeyState>;
  private keyMap: Map<string,KeyMap>;
  constructor(){
    this.keyStates = new Map();
    this.keyMap = new Map();
  }
  addMapping(code: string, callback: KeyMap){
    this.keyMap.set(code, callback);
  }
  handleEvent(event: KeyboardEvent){
    const { code, type } = event;

    if(!this.keyMap.has(code)) return;

    event.preventDefault();

    const keyState = type === 'keydown' ? KeyState.PRESSED : KeyState.RELEASED;

    if(this.keyStates.get(code) === keyState){
      return;
    }

    this.keyStates.set(code, keyState);

    this.keyMap.get(code)(keyState);
  }
  listenTo(window: any){
    ['keydown', 'keyup'].forEach(eventName=>{
      window.addEventListener(eventName, (event: KeyboardEvent) => {
        this.handleEvent(event);
      });
    });
  }
}