import {
  AggregateEvaluation,
  Answer,
  AnswerEval,
  AocDay,
  AocYear,
  Problem,
  ProblemInput,
} from "./types";

type ProblemInputs = {
  [key in AocYear]?: {
    [key in AocDay]?: { real: ProblemInput; tests: ProblemInput[] };
  };
};

export const problemInputs: ProblemInputs = {
  "2022": {
    "01": {
      real: (await import("../problems/2022/01/input")).default,
      tests: (await import("../problems/2022/01/tests")).default,
    },
  },
  "2021": {
    "01": {
      real: (await import("../problems/2021/01/input")).default,
      tests: (await import("../problems/2021/01/tests")).default,
    },
    "02": {
      real: (await import("../problems/2021/02/input")).default,
      tests: (await import("../problems/2021/02/tests")).default,
    },
  },
  "2018": {
    "18": {
      real: (await import("../problems/2018/18/input")).default,
      tests: (await import("../problems/2018/18/tests")).default,
    },
  },
};

export function getYearOptions(): AocYear[] {
  return Object.keys(problemInputs) as AocYear[];
}

export function getDayOptions(year: AocYear): AocDay[] {
  return Object.keys(problemInputs[year] ?? {}) as AocDay[];
}

export function getDefaultProblem(): Problem {
  const year = getYearOptions()[0];
  const day = getDayOptions(year)[0];

  return { year, day };
}

export function getProblemInputs(year: AocYear, day: AocDay): ProblemInput[] {
  if (!year || !day) return [];

  const yearProblems = problemInputs[year];
  if (!yearProblems) return [];

  const problems = yearProblems[day];
  if (!problems) return [];

  return [...(problems.tests ?? []), problems.real];
}

export function evaluateRunResult(
  result: Partial<Answer>,
  expected: Partial<Answer>
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
