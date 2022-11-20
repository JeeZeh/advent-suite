import { ProblemInput } from "../../../lib/types";

const providedExample = `forward 5
down 5
forward 8
up 3
down 8
forward 2`;

export default [
  {
    name: "Example",
    data: providedExample,
    expected: {
      partOne: "150",
      partTwo: "900",
    },
  },
] as ProblemInput[];
