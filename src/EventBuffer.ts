type Event = {
  name: Symbol,
  args: any[],
}
type EventCallback = (...args: any[]) => void;

export default class EventBuffer {
  private events: Event[] = [];
  
  clear(){
    this.events.length = 0;
  }

  emit(name: Symbol, ...args: any[]){
    const event = { name, args };
    this.events.push(event);
  }

  process(name: Symbol, callback: EventCallback){
    this.events.forEach(event => {
      if(event.name === name){
        callback(...event.args);
      }
    });
  }
}