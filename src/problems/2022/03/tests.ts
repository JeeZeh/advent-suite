import { ProblemInput } from "../../../lib/types";

const providedExample = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

export default [
  {
    name: "Example",
    data: providedExample,
    expected: {
      partOne: "157",
      partTwo: "70",
    },
  },
] as ProblemInput[];
