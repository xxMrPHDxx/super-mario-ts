export default class AudioBoard {
  private buffers: Map<string, AudioBuffer> = new Map();

  add(name: string, buffer: AudioBuffer){
    this.buffers.set(name, buffer);
  }

  play(name: string, context: AudioContext){
    const buffer = this.buffers.get(name);
    if(!buffer) return;
    const source = context.createBufferSource();
    source.connect(context.destination);
    source.buffer = buffer;
    source.start(0);
  }
}