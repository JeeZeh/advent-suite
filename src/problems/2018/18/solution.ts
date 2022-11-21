import { SolutionRunner } from "../../../lib/types";
import { Point } from "../../helpers";
import _ from "lodash";

enum Tile {
  Tree = "|",
  Open = ".",
  Yard = "#",
}

const buildTileFromChar = (c: string): Tile => {
  switch (c) {
    case "|":
      return Tile.Tree;
    case "#":
      return Tile.Yard;
    case ".":
      return Tile.Open;
    default:
      throw Error(`Unknown char => Tile mapping for '${c}'`);
  }
};

const buildForest = (input: string): Map<Point, Tile> => {
  const forest: Map<Point, Tile> = new Map();

  for (const [y, row] of input.split("\n").entries()) {
    for (const [x, char] of [...row].entries()) {
      forest.set(new Point(x, y), buildTileFromChar(char));
    }
  }

  return forest;
};

const run: SolutionRunner = async (input?: string) => {
  if (!input) throw Error("Invalid input");

  const forest: Map<Point, Tile> = buildForest(input);
  console.log(forest);
  

  return { partOne: "1" };
};

export default run;
