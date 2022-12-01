import _ from "lodash";
import { SolutionRunner } from "../../../lib/types";

type Elf = {
  food: number[];
};

const parseElf = (mealsString: string): Elf => {
  const food = mealsString.split("\n").map((m) => parseInt(m, 10));

  return {
    food,
  };
};

const parseInput = (input: string): Elf[] => {
  return input.split("\n\n").map((l) => parseElf(l));
};

const partOne = (elves: Elf[]): string => {
  return `${_.max(elves.map((e) => _.sum(e.food)))}`;
};

const partTwo = (elves: Elf[]): string => {
  const topThreeSum = _.chain(elves)
    .sortBy((e) => _.sum(e.food))
    .slice(elves.length - 3, elves.length)
    .sumBy((e) => _.sum(e.food));
  return `${topThreeSum}`;
};

const run: SolutionRunner = async (input) => {
  if (!input) throw Error("Invalid input");

  const elves: Elf[] = parseInput(input);

  return {
    answer: {
      partOne: partOne(elves),
      partTwo: partTwo(elves),
    },
  };
};

export default run;
