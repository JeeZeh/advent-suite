import { ProblemInput } from "../../../lib/types";

const providedExample = `199
200
208
210
200
207
240
269
260
263`;

export default [
  {
    name: "All Correct",
    data: providedExample,
    expected: {
      partOne: "7",
      partTwo: "5",
    },
  },
  {
    name: "Partially Incorrect with really really long name omg!",
    data: providedExample,
    expected: {
      partOne: "-1",
      partTwo: "5",
    },
  },
  {
    name: "All Incorrect",
    data: providedExample,
    expected: {
      partOne: "-1",
      partTwo: "-1",
    },
  },
] as ProblemInput[];
