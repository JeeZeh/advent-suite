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

export const PointDirections = {
  LEFT: new Point(-1, 0),
  RIGHT: new Point(1, 0),
  UP: new Point(0, -1),
  DOWN: new Point(0, 1),
  UP_LEFT: new Point(-1, -1),
  UP_RIGHT: new Point(1, -1),
  DOWN_LEFT: new Point(-1, 1),
  DOWN_RIGHT: new Point(1, 1),
};
