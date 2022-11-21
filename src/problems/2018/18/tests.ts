import { ProblemInput } from "../../../lib/types";

const providedExample = `.#.#...|#.
.....#|##|
.|..|...#.
..|#.....#
#.#|||#|#|
...#.||...
.|....|...
||...#|.#|
|.||||..|.
...#.|..|.`;

export default [
  {
    name: "Example",
    data: providedExample,
    expected: {
      partOne: "1147",
    },
  },
] as ProblemInput[];
