export async function loadImage(path: string) : Promise<HTMLImageElement>{
  return new Promise((resolve, reject)=>{
    const img = new Image();
    img.onload = ()=>resolve(img);
    img.onerror = reject;
    img.src = path;
  });
}

export function loadJSON(path: string) : Promise<object> {
  return fetch(path).then(res=>res.json());
}