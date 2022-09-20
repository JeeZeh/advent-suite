import i2021_01_ex from "./2021/01/example";

export type ProblemInput = {
  name: string;
  data: string;
};

export const INPUT_INDEX: {
  [key: string]: { [key: string]: ProblemInput[] };
} = {
  "2021": {
    "01": [
      {
        name: "Example",
        data: i2021_01_ex,
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
