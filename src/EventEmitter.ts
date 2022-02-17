type EventCallback = (...args: any[]) => void;

export default class EventEmitter {
  private listeners: Map<string, EventCallback[]> = new Map();

  listen(name: string, callback: EventCallback){
    const callbacks = this.listeners.get(name) || [];
    callbacks.push(callback);
    this.listeners.set(name, callbacks);
  }

  emit(name: string, ...args: any[]){
    const callbacks = this.listeners.get(name);
    if(!callbacks) return;
    callbacks.forEach(callback => {
      callback(...args);
    });
  }
}