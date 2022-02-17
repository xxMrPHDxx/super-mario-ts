import AudioBoard from "../AudioBoard";
import { loadJSON } from "../loaders";

type AudioLoader = (url: string) => Promise<AudioBuffer>;

interface AudioSpec {
  name: string,
  url: string,
}
interface AudioSheetSpec {
  fx: AudioSpec[],
}

export async function loadAudioBoard(name: string, audioContext: AudioContext) : Promise<AudioBoard> {
  const loadAudio = createAudioLoader(audioContext);
  const audioSheet = await loadJSON(`./sounds/${name}.json`) as AudioSheetSpec;
  const audioBoard = new AudioBoard();
  const jobs: any[] = [];
  audioSheet.fx.forEach(({ name, url }) => {
    jobs.push(
      loadAudio(url)
      .then(buffer => {
        audioBoard.add(name, buffer);
      })
    );
  });
  await Promise.all(jobs);
  return audioBoard;
}

export function createAudioLoader(context: AudioContext) : AudioLoader {
  return function loadAudio(url: string) : Promise<AudioBuffer> {
    return fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => {
      return context.decodeAudioData(arrayBuffer);
    });
  }
}