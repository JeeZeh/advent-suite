import _, { values } from "lodash";
import { SolutionRunner } from "../../../lib/types";

type Sack = [string, string];

const parseSack = (line: string): Sack => {
  const left = line.slice(0, line.length / 2);
  const right = line.slice(line.length / 2);

  return [left, right];
};

const charValues: { [key in string]: number } = {};
"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  .split("")
  .forEach((v, i) => (charValues[v] = i + 1));

const findCommonChar = (groups: string[]): string => {
  const intersection = _.intersection(...groups.map((g) => g.split("")));
  if (intersection.length !== 1) {
    console.warn(groups, intersection);
    throw Error("Expected only a single common item");
  }

  return intersection[0];
};

const run: SolutionRunner = async (input) => {
  if (!input) throw Error("Invalid input");

  const sacks = input.split("\n").map((l) => parseSack(l));

  const commonItems = _.chain(sacks)
    .map((s) => findCommonChar(s))
    .sumBy((i) => charValues[i]);

  const badges = _.chain(sacks)
    .map((s) => s[0] + s[1])
    .chunk(3)
    .map(findCommonChar)
    .sumBy((i) => charValues[i]);

  return {
    answer: {
      partOne: `${commonItems}`,
      partTwo: `${badges}`,
    },
  };
};

export default run;
