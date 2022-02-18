import MusicPlayer from "./MusicPlayer";

export default class MusicController {
  private musicPlayer: MusicPlayer = null;

  setPlayer(player: MusicPlayer){
    this.musicPlayer = player;
  }

  playTheme(speed: number = 1){
    const audio = this.musicPlayer.play('main');
    audio.playbackRate = speed;
  }

  playHurryTheme(){
    const audio = this.musicPlayer.play('hurry');
    audio.loop = false;
    audio.onended = () => this.playTheme(1.3);
  }
}