import { Progress } from "flowbite-react";
import { AnswerEval } from "../inputs/inputs";
import { RunResult } from "../solutions/utils";

function getTestCaseProgress(
  results: IterableIterator<RunResult>
): [number, number] {
  let upperBoundSuccess = 0;
  let actualSuccess = 0;

  for (const res of results) {
    if (res.problemInput.expected.partOne != null) {
      upperBoundSuccess++;
    }
    if (res.problemInput.expected.partTwo != null) {
      upperBoundSuccess++;
    }
    if (res.evaluation[0] === AnswerEval.Correct) {
      actualSuccess++;
    }
    if (res.evaluation[1] === AnswerEval.Correct) {
      actualSuccess++;
    }
  }

  return [actualSuccess, upperBoundSuccess];
}

export function getTestCaseProgressBarColor(
  progress: [number, number]
): string {
  const successRatio = progress[0] / progress[1];
  if (successRatio < 0.3) {
    return "red";
  }
  if (successRatio < 0.6) {
    return "yellow";
  }
  if (successRatio < 1) {
    return "blue";
  }

  return "green";
}
interface ResultProgressBarProps {
  runResults: Map<string, RunResult>;
}
export function ResultProgressBar({ runResults }: ResultProgressBarProps) {
  const testCaseProgress = getTestCaseProgress(runResults.values());
  const progressBarColor = getTestCaseProgressBarColor(testCaseProgress);
  const progressBarLabel = `Total Cases Passed (${testCaseProgress[0]}/${testCaseProgress[1]})`;
  const progressBarCompletion =
    ((testCaseProgress[0] / Math.max(testCaseProgress[1], 1)) * 100).toPrecision(3);
  return (
    <Progress
      progress={parseFloat(progressBarCompletion)}
      label={progressBarLabel}
      labelPosition="outside"
      labelProgress={true}
      color={progressBarColor}
    />
  );
}
