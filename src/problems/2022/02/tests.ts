import { ProblemInput } from "../../../lib/types";

const providedExample = `A Y
B X
C Z`;

export default [
  {
    name: "Example",
    data: providedExample,
    expected: {
      partOne: "15",
      // partTwo: "-1",
    },
  },
] as ProblemInput[];
