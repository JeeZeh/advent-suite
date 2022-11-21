export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(o: Point): Point {
    return new Point(this.x + o.x, this.y + o.y);
  }
}

