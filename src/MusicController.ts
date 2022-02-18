import MusicPlayer from "./MusicPlayer";

export default class MusicController {
  private musicPlayer: MusicPlayer = null;

  play(name: string){
    this.musicPlayer.play(name);
  }

  setPlayer(player: MusicPlayer){
    this.musicPlayer = player;
  }
}