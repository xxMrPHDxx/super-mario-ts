export function createAnim(frames: string[], frameLen: number){
  return function resolveFrame(distance: number){
    return frames[Math.floor(distance / frameLen) % frames.length];
  }
}