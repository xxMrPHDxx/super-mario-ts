type MatrixCallback<T> = (x: number, y: number, tile: T) => void;

export class Matrix<T> {
  public grid: T[][];
  constructor(){
    this.grid = [];
  }
  get(x: number, y: number) : T {
    const col = this.grid[x];
    if(col) return col[y];
    return undefined;
  }
  set(x: number, y: number, value: T){
    if(!this.grid[x]) this.grid[x] = [];
    this.grid[x][y] = value;
  }
  forEach(callback: MatrixCallback<T>){
    this.grid.forEach((columns, x) => {
      columns.forEach((tile, y) => {
        callback(x, y, tile);
      });
    });
  }
}

export class Vector {
  public x: number;
  public y: number;
  constructor(x: number = 0, y: number = 0){
    this.set(x, y);
  }
  copy(source: Vector){
    this.set(source.x, source.y);
  }
  set(x: number, y: number){
    this.x = x;
    this.y = y;
  }
}