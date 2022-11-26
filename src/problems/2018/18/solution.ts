import { SolutionRunner } from "../../../lib/types";
import { Point, PointDirections } from "../../helpers";
import _ from "lodash";

enum Tile {
  Tree = "|",
  Open = ".",
  Lumber = "#",
}

type Yard = Map<string, Tile>;

const buildTileFromChar = (c: string): Tile => {
  switch (c) {
    case "|":
      return Tile.Tree;
    case "#":
      return Tile.Lumber;
    case ".":
      return Tile.Open;
    default:
      throw Error(`Unknown char => Tile mapping for '${c}'`);
  }
};

const buildYard = (input: string): [Yard, number, number] => {
  const lines = input.split("\n");
  const yard: Yard = new Map();
  const [maxX, maxY] = [lines[0].length, lines.length];

  for (const [y, row] of input.split("\n").entries()) {
    for (const [x, char] of [...row].entries()) {
      yard.set(new Point(x, y).toString(), buildTileFromChar(char));
    }
  }

  return [yard, maxX, maxY];
};

const getNextState = (state: Tile, adjacent: (Tile | undefined)[]): Tile => {
  const counts = _.countBy(adjacent);

  switch (state) {
    // An open acre will become filled with trees if three
    // or more adjacent acres contained trees. Otherwise, nothing happens.
    case Tile.Open:
      return counts[Tile.Tree] >= 3 ? Tile.Tree : Tile.Open;
    // An acre filled with trees will become a lumberyard if three or more
    // adjacent acres were lumberyards. Otherwise, nothing happens.
    case Tile.Tree:
      return counts[Tile.Lumber] >= 3 ? Tile.Lumber : Tile.Tree;
    // An acre containing a lumberyard will remain a lumberyard if it was adjacent to
    // at least one other lumberyard and at least one acre containing trees. Otherwise, it becomes open.
    case Tile.Lumber:
      return counts[Tile.Lumber] >= 1 && counts[Tile.Tree] >= 1
        ? Tile.Lumber
        : Tile.Open;
  }
};

const getAdjacent = (yard: Yard, point: Point): Tile[] => {
  const adjacent: Tile[] = [];
  for (const dir of Object.values(PointDirections)) {
    const newPoint = point.add(dir);
    const check = yard.get(newPoint.toString());
    if (check) {
      adjacent.push(check);
    }
  }
  return adjacent;
};

const tick = (yard: Yard): Yard => {
  const newYard = new Map(yard);

  for (const [point, tile] of yard.entries()) {
    const adjacent = getAdjacent(yard, Point.fromString(point));
    newYard.set(point, getNextState(tile, adjacent));
  }

  return newYard;
};

const printYard = (yard: Yard, maxX: number, maxY: number) => {
  const rows = [];
  for (let y = 0; y < maxY; y++) {
    const row = [];
    for (let x = 0; x < maxX; x++) {
      row.push(yard.get(new Point(x, y).toString()));
    }
    rows.push(row.join(""));
  }
  console.log(rows.join("\n"));
};

const getAnswer = (yard: Yard): string => {
  const counts = _.countBy(Array.from(yard.values()));

  return `${counts[Tile.Tree] * counts[Tile.Lumber]}`;
};

const drawFrame = (ctx: CanvasRenderingContext2D, frame: Yard) => {
  const scale = 5;

  ctx.clearRect(0, 0, 500, 500);
  for (const [point, tile] of frame.entries()) {
    const pos = Point.fromString(point);
    ctx.fillStyle =
      tile === Tile.Open
        ? "rgba(0,0,0, 0)"
        : tile === Tile.Lumber
        ? "rgb(150,75,0)"
        : "rgb(0, 225, 0)";
    ctx.fillRect(pos.x * scale, pos.y * scale, scale, scale);
  }
};

const draw = (
  ctx: CanvasRenderingContext2D,
  frames: Yard[],
  durationMs: number,
  start?: number
) => {
  const time = Date.now();
  const currentMs = start ? time - start : time;
  const frameNumber = Math.floor(
    ((currentMs % durationMs) / durationMs) * frames.length
  );

  const frame = frames[frameNumber];
  if (frame) {
    drawFrame(ctx, frame);
  }
};

const run: SolutionRunner = async (input, canvas) => {
  if (!input) throw Error("Invalid input");

  let [yard, maxX, maxY] = buildYard(input);

  let frames: Yard[] = [yard];
  for (let i = 0; i < 100; i++) {
    yard = tick(yard);
    frames.push(yard);
  }

  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      if ((window as any).animationInterval) {
        clearInterval((window as any).animationInterval);
      }
      const start = Date.now();
      (window as any).animationInterval = setInterval(
        () => draw(ctx, frames, 10000, start),
        16.6
      );
    }
  }

  const partOne = getAnswer(yard);

  return { partOne };
};

export default run;
