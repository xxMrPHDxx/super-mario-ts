export default class MusicPlayer {
  private tracks: Map<string, HTMLAudioElement> = new Map();

  addTrack(name: string, track: string){
    const audio = new Audio(track);
    audio.loop = true;
    this.tracks.set(name, audio);
  }

  pauseAll(){
    for(const audio of this.tracks.values()){
      audio.pause();
    }
  }

  play(name: string) : HTMLAudioElement {
    this.pauseAll();
    const track = this.tracks.get(name);
    if(track) track.play();
    return track;
  }
}