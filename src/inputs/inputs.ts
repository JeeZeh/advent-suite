import i2021_01_ex from "./2021/01/example";
import i2021_01_real from "./2021/01/real";

export type Answer = {
  partOne?: string;
  partTwo?: string;
};

export type ProblemInput = {
  name: string;
  data: string;
  isReal?: boolean;
  expected: Answer;
};

export const INPUT_INDEX: {
  [key: string]: { [key: string]: ProblemInput[] };
} = {
  "2021": {
    "01": [
      {
        name: "Example 1",
        data: i2021_01_ex,
        expected: {
          partOne: "7",
          partTwo: "5",
        },
      },
      {
        name: "Example with Bad Answer",
        data: i2021_01_ex,
        expected: {
          partOne: "4",
          partTwo: "5",
        },
      },
      {
        name: "Real Input",
        data: i2021_01_real,
        isReal: true,
        expected: {
          partOne: "1564",
          partTwo: "1611",
        },
      },
    ],
  },
};

export function getYearOptions(): string[] {
  return Object.keys(INPUT_INDEX);
}

export function getDayOptions(year: string): string[] {
  return Object.keys(INPUT_INDEX[year] ?? {});
}

export function getProblemInputs(
  year: string | undefined,
  day: string | undefined
): ProblemInput[] {
  if (!year || !day) return [];

  return (INPUT_INDEX[year] ?? {})[day] ?? [];
}
