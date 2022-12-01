import { ProblemInput } from "../../../lib/types";

const providedExample = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

export default [
  {
    name: "Example",
    data: providedExample,
    expected: {
      partOne: "24000",
      partTwo: "45000",
    },
  },
] as ProblemInput[];
