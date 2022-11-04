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
export const problemInputs: {
  [key: string]: { [key: string]: ProblemInput[] };
} = {
  "2021": {
    "01": [
      {
        name: "All Correct",
        data: i2021_01_ex,
        expected: {
          partOne: "7",
          partTwo: "5",
        },
      },
      {
        name: "Partially Incorrect with really really long name omg!",
        data: i2021_01_ex,
        expected: {
          partOne: "-1",
          partTwo: "5",
        },
      },
      {
        name: "All Incorrect",
        data: i2021_01_real,
        expected: {
          partOne: "-1",
          partTwo: "-1",
        },
      },
      {
        name: "Real Input",
        data: i2021_01_real,
        isReal: true,
        expected: {
          partOne: "1564"
        },
      },
    ],
  },
};

export function getYearOptions(): string[] {
  return Object.keys(problemInputs);
}

export function getDayOptions(year: string): string[] {
  return Object.keys(problemInputs[year] ?? {});
}

export type Problem = {
  year: string;
  day: string;
};
export function getDefaultProblem(): Problem {
  const year = getYearOptions()[0];
  const day = getDayOptions(year)[0];

  return { year, day };
}

export function getProblemInputs(
  year: string | undefined,
  day: string | undefined
): ProblemInput[] {
  if (!year || !day) return [];

  return (problemInputs[year] ?? {})[day] ?? [];
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
  if (wrappedEvaluations.every((e) => e === AnswerEval.Incomplete)) {
    return AggregateEvaluation.Incomplete;
  }

  // Everything is correct
  if (wrappedEvaluations.every((e) => e === AnswerEval.Correct)) {
    return AggregateEvaluation.AllCorrect;
  }

  // Everything is incorrect
  if (wrappedEvaluations.every((e) => e === AnswerEval.Incorrect)) {
    return AggregateEvaluation.AllIncorrect;
  }

  // Partial correct
  return AggregateEvaluation.PartialCorrect;
}
