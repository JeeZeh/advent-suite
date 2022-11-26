import { SolutionRunner } from "../../../lib/types";
import { Point, PointDirections } from "../../helpers";
import _ from "lodash";

enum Tile {
  Tree = "|",
  Open = ".",
  Lumber = "#",
}

type Yard = Map<Point, Tile>;

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
      yard.set(new Point(x, y), buildTileFromChar(char));
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

const getAdjacent = (yard: Yard, point: Point): (Tile | undefined)[] => {
  return Object.values(PointDirections).map((dir) => yard.get(dir));
};

const tick = (yard: Yard): Yard => {
  const newYard = new Map(yard);

  for (const [point, tile] of yard.entries()) {
    newYard.set(point, getNextState(tile, getAdjacent(yard, point)));
  }

  return newYard;
};

const printYard = (yard: Yard, maxX: number, maxY: number) => {
  const rows = [];
  for (let y = 0; y < maxY; y++) {
    const row = [];
    for (let x = 0; x < maxX; x++) {
      row.push(yard.get(new Point(x, y)));
    }
    rows.push(row.join(""));
  }
  console.log(rows.join("\n"));
};

const getAnswer = (yard: Yard): string => {
  const counts = _.countBy(Array.from(yard.values()));

  return `${counts[Tile.Tree] * counts[Tile.Lumber]}`;
};

const run: SolutionRunner = async (input?: string) => {
  if (!input) throw Error("Invalid input");

  let [yard, maxX, maxY] = buildYard(input);

  for (let i = 0; i < 10; i++) {
    yard = tick(yard);
    printYard(yard, maxX, maxY);
  }

  const partOne = getAnswer(yard);

  return { partOne };
};

export default run;
