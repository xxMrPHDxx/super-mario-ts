type EventCallback = (...args: any[]) => void;

export default class EventEmitter {
  private listeners: Map<Symbol, EventCallback[]> = new Map();

  listen(name: Symbol, callback: EventCallback){
    const callbacks = this.listeners.get(name) || [];
    callbacks.push(callback);
    this.listeners.set(name, callbacks);
  }

  emit(name: Symbol, ...args: any[]){
    const callbacks = this.listeners.get(name);
    if(!callbacks) return;
    callbacks.forEach(callback => {
      callback(...args);
    });
  }
}