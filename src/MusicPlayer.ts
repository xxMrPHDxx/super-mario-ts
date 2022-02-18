export default class MusicPlayer {
  private tracks: Map<string, HTMLAudioElement> = new Map();

  addTrack(name: string, track: string){
    const audio = new Audio(track);
    audio.loop = true;
    this.tracks.set(name, audio);
  }

  play(name: string){
    const track = this.tracks.get(name);
    if(track) track.play();
  }
}