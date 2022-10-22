import {
  AggregateEvaluation,
  Answer,
  AnswerEval,
  evaluateRunResult,
  getAggregateEvaluation,
  ProblemInput,
} from "../inputs/inputs";

export type RunResult = {
  problemInput: ProblemInput;
  answer: Answer;
  runtimeMs: number;
  evaluation: [AnswerEval, AnswerEval];
  aggregateEvaluation: AggregateEvaluation;
};

type SolverModule = {
  default: (input?: string) => Promise<any[]>;
};

/**
 * Dynamically imports the solver for this year and day, and runs the provided ProblemInput against it,
 * returning the result as a promise which resolves once the solution has run.
 *
 * @param year Solution year
 * @param day Solution day
 * @param input ProblemInput to be passed to the SolverModule
 * @returns A promise returning the RunResult of the imported SolverModule
 * running the given input, resolving when the solution is finished running.
 */
export async function runSolution(
  year: string,
  day: string,
  input: ProblemInput
): Promise<RunResult> {
  const module: SolverModule = await import(
    /* @vite-ignore */ `../solutions/${year}/${day}/Solver.ts`
  );
  const start = window.performance.now();
  const [partOne, partTwo] = await module.default(input.data);
  const runtimeMs = window.performance.now() - start;
  const answer = { partOne, partTwo };
  const evaluation = evaluateRunResult(answer, input.expected);
  return {
    problemInput: input,
    answer,
    runtimeMs,
    evaluation,
    aggregateEvaluation: getAggregateEvaluation(evaluation),
  };
}

export const LONG_RUNTIME_MS = 100;
