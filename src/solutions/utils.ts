import { ToastContent, ToastOptions } from "react-toastify/dist/types";
import { Flip, toast as _toast } from "react-toastify";
import {
  AggregateEvaluation,
  Answer,
  AnswerEval,
  evaluateRunResult,
  getAggregateEvaluation,
  ProblemInput,
} from "../inputs/inputs";
import classNames from "classnames";

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

export function getLocalTheme(): "dark" | "light" {
  const item = localStorage.getItem("theme");

  if (item === "dark") {
    return "dark";
  }

  return "light";
}

export const toast = (content: ToastContent, options?: ToastOptions) => {
  const defaultOptions: ToastOptions = {
    theme: getLocalTheme(),
    pauseOnFocusLoss: false,
    hideProgressBar: true,
    transition: Flip,
    ...options,
  };

  return _toast(content, defaultOptions);
};

/**
 * Given an AggregateEvaluation, returns an appropriate color to be used
 * for the ResultIcon, if useColor is provided.
 */
export function getEvaluationColor(evaluation: AggregateEvaluation): string {
  switch (evaluation) {
    case AggregateEvaluation.AllCorrect:
      return classNames("fill-green-600", "dark:fill-green-400");
    case AggregateEvaluation.PartialCorrect:
      return classNames("fill-yellow-400", "dark:fill-yellow-300");
    case AggregateEvaluation.AllIncorrect:
      return classNames("fill-red-600", "dark:fill-red-500");
    default:
      return "";
  }
}
