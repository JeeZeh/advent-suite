import { RunResult } from "../layouts/Landing";
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
  expected: Required<Answer>;
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

export enum AnswerEval {
  Correct,
  Incorrect,
  Incomplete,
}

export function evaluateRunResult(
  expected: Answer,
  result: Answer
): [AnswerEval, AnswerEval] {
  const answers = [AnswerEval.Incomplete, AnswerEval.Incomplete];

  if (expected.partOne && result.partOne) {
    answers[0] =
      expected.partOne === result.partOne
        ? AnswerEval.Correct
        : AnswerEval.Incorrect;
  }

  if (expected.partTwo && result.partTwo) {
    answers[1] =
      expected.partTwo === result.partTwo
        ? AnswerEval.Correct
        : AnswerEval.Incorrect;
  }

  return [answers[0], answers[1]];
}

export enum AggregateEvaluation {
  AllCorrect,
  PartialCorrect,
  AllIncorrect,
  Incomplete,
}

export function getAggregateEvaluation(
  evaluations: AnswerEval[] | AnswerEval | undefined
): AggregateEvaluation {
  if (evaluations == null) {
    return AggregateEvaluation.Incomplete;
  }

  const wrappedEvaluations =
    evaluations instanceof Array ? evaluations : [evaluations];
  if (wrappedEvaluations.some((e) => e === AnswerEval.Incomplete)) {
    return AggregateEvaluation.Incomplete;
  }

  // Everything is correct
  if (wrappedEvaluations.every((e) => e === AnswerEval.Correct)) {
    return AggregateEvaluation.AllCorrect;
  }

  // Nothing is Incorrect, but not everything is Correct (some Incomplete)
  if (wrappedEvaluations.every((e) => e !== AnswerEval.Incorrect)) {
    return AggregateEvaluation.PartialCorrect;
  }

  return AggregateEvaluation.AllIncorrect;
}
