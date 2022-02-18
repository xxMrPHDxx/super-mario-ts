import { loadJSON } from "../loaders";
import MusicPlayer from "../MusicPlayer";

interface MusicSpec {
  url: string,
}
interface MusicSheetSpec {
  [name: string]: MusicSpec,
}

export async function loadMusicSheet(name: string) : Promise<MusicPlayer> {
  const musicSheet = await loadJSON(`./music/${name}.json`) as MusicSheetSpec;
  const musicPlayer = new MusicPlayer();
  for(const [name, track] of Object.entries(musicSheet)){
    musicPlayer.addTrack(name, track.url);
  }
  return musicPlayer;
}