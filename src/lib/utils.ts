import { ToastContent, ToastOptions } from "react-toastify/dist/types";
import { Flip, toast as _toast } from "react-toastify";
import { evaluateRunResult, getAggregateEvaluation } from "./problems";
import classNames from "classnames";
import {
  AggregateEvaluation,
  AocDay,
  AocYear,
  ProblemInput,
  RunResult,
  SolutionRunner,
  SolutionRunnerResult,
} from "./types";

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
  year: AocYear,
  day: AocDay,
  input: ProblemInput
): Promise<RunResult> {
  const run: SolutionRunner = (
    await import(/* @vite-ignore */ `../problems/${year}/${day}/solution.ts`)
  ).default;
  const start = window.performance.now();
  const runnerResult: SolutionRunnerResult = await run(input.data);
  const runtimeMs = window.performance.now() - start;
  const evaluation = evaluateRunResult(runnerResult.answer, input.expected);
  return {
    problemInput: input,
    answer: runnerResult.answer,
    runtimeMs,
    evaluation,
    aggregateEvaluation: getAggregateEvaluation(evaluation),
    animation: runnerResult.animation,
  };
}

export const LONG_RUNTIME_MS = 100;

export const getLocalTheme = (): "dark" | "light" => {
  const item = localStorage.getItem("theme");

  if (item === "dark") {
    return "dark";
  }

  return "light";
};

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
export const getEvaluationColor = (evaluation: AggregateEvaluation): string => {
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
};

export const sleep = async (ms: number) => {
  return new Promise((res, _) => {
    setTimeout(() => res(true), ms);
  });
};
