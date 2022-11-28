import { Animation, DrawCall, SolutionRunner } from "../../../lib/types";
import { Point, PointDirections } from "../../helpers";
import _, { max } from "lodash";

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

const yardAsString = (yard: Yard, maxX: number, maxY: number) => {
  const rows = [];
  for (let y = 0; y < maxY; y++) {
    const row = [];
    for (let x = 0; x < maxX; x++) {
      row.push(yard.get(new Point(x, y).toString()));
    }
    rows.push(row.join(""));
  }
  return rows.join("\n");
};

const getAnswer = (yard: Yard): string => {
  const counts = _.countBy(Array.from(yard.values()));

  return `${counts[Tile.Tree] * counts[Tile.Lumber]}`;
};

const drawFrame = (
  ctx: CanvasRenderingContext2D,
  [yard, tick]: [Yard, number]
) => {
  const scale = 5;

  ctx.clearRect(0, 0, 400, 400);
  for (const [point, tile] of yard.entries()) {
    const pos = Point.fromString(point);
    ctx.fillStyle =
      tile === Tile.Open
        ? "rgb(0,0,0)"
        : tile === Tile.Lumber
        ? "rgb(150,75,0)"
        : "rgb(0,225,0)";

    ctx.fillRect(pos.x * scale, pos.y * scale, scale, scale);
  }
  ctx.fillStyle = "rgb(255,255,255)";
  ctx.font = "16px monospace";
  ctx.fillText(`Tick: ${tick}`, 100, 20);
};

const generateAnimation = (states: [Yard, number][]): Animation => {
  const frames: DrawCall[] = [];
  for (const state of states) {
    frames.push((ctx: CanvasRenderingContext2D) => drawFrame(ctx, state));
  }
  return { frames };
};

const run: SolutionRunner = async (input) => {
  if (!input) throw Error("Invalid input");

  let [yard, maxX, maxY] = buildYard(input);

  // String = state, Number = tick that it occurred on
  let seen = new Map<string, number>();
  seen.set(yardAsString(yard, maxX, maxY), 0);
  let yardStates: [Yard, number][] = [[yard, 0]];
  for (let i = 0; i < 10; i++) {
    yard = tick(yard);
    seen.set(yardAsString(yard, maxX, maxY), i + 1);
    yardStates.push([yard, i + 1]);
  }
  const partOne = getAnswer(yard);

  // Part 2
  const desiredTick = 1_000_000_000;

  // Find the first repeat in the yard state
  yard = tick(yard);
  let currentYardState = yardAsString(yard, maxX, maxY);
  let currentTick = 11;
  while (!seen.has(currentYardState)) {
    yardStates.push([yard, currentTick]);
    seen.set(currentYardState, currentTick);

    yard = tick(yard);
    currentTick++;
    currentYardState = yardAsString(yard, maxX, maxY);
  }

  // Determine the interval at which the yard repeats its state
  const lastSeen = seen.get(currentYardState);
  if (!lastSeen) {
    throw Error("Expected to know last-seen tick");
  }
  const repeatInterval = currentTick - lastSeen;

  // Calculate how close we can get to the desired tick simply
  // by skipping yard state calculations
  const ticksLeft = desiredTick - currentTick;
  const repeatsToSkip = Math.floor(ticksLeft / repeatInterval);
  currentTick += repeatsToSkip * repeatInterval;

  // Calculate the remaining few ticks until we reach the desired tick
  while (currentTick < desiredTick) {
    yardStates.push([yard, currentTick]);
    yard = tick(yard);
    currentTick++;
  }
  yardStates.push([yard, currentTick]);
  const partTwo = getAnswer(yard);

  return {
    answer: { partOne, partTwo },
    animation: generateAnimation(yardStates),
  };
};

export default run;
