import { Badge, BadgeColors, Spinner, Textarea } from "flowbite-react";
import { AnswerEval } from "../inputs/inputs";
import { RunResult } from "../layouts/Landing";
import { InputDisplay } from "./EnumeratedTextDisplay";
import * as cs from "classnames";

interface ResultDisplayProps {
  isRunning: boolean;
  result?: RunResult;
}
function formatResult(result?: RunResult): string | undefined {
  if (!result) {
    return;
  }

  const { answer, runtimeMs } = result;
  return `Part 1: ${answer.partOne}\nPart 2: ${
    answer.partTwo
  }\nRuntime: ${runtimeMs.toPrecision(4)}ms`;
}

function getBadgeColor(answerEval: AnswerEval): keyof BadgeColors {
  if (answerEval === AnswerEval.Correct) {
    return "success";
  }

  if (answerEval === AnswerEval.Incomplete) {
    return "gray";
  }

  return "failure";
}

interface EvaluationBadgeProps {
  answer?: string;
  expected: string;
  evaluation: AnswerEval;
}
function EvaluationBadge({
  evaluation,
  answer,
  expected,
}: EvaluationBadgeProps) {
  if (answer == null) {
    <Badge color="gray" size="md">
      Incomplete
    </Badge>;
  }

  return (
    <Badge color={getBadgeColor(evaluation)} size="md">
      <div>Answer: {answer}</div>
      {evaluation === AnswerEval.Incorrect && <div>Expected: {expected}</div>}
    </Badge>
  );
}

export function ResultDisplay({ isRunning, result }: ResultDisplayProps) {
  if (isRunning) {
    return <Spinner />;
  }

  if (result == null) {
    return null;
  }

  return (
    <div
      className={cs(
        "p-4",
        "w-64",
        "rounded-md",
        "bg-slate-50",
        "border",
        "bg-slate-50",
        "dark:bg-slate-800",
        "dark:text-slate-100",
        "border-gray-300",
        "dark:border-gray-600"
      )}
    >
      <p className="text-lg font-bold font-mono mb-2">{result.problemInput.name}</p>
      <div className="flex flex-col gap-1">
        <EvaluationBadge
          answer={result.answer.partOne}
          expected={result.problemInput.expected.partOne}
          evaluation={result.evaluation[0]}
        />
        <EvaluationBadge
          answer={result.answer.partTwo}
          expected={result.problemInput.expected.partTwo}
          evaluation={result.evaluation[1]}
        />
        <Badge color="info" size="md">
          <div>Runtime: {result.runtimeMs.toPrecision(2)}ms</div>
        </Badge>
      </div>
    </div>
  );
}
