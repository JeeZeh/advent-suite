import { Spinner, Textarea } from "flowbite-react";
import { RunResult } from "../layouts/Landing";
import { InputDisplay } from "./EnumeratedTextDisplay";

interface ResultDisplayProps {
  isRunning: boolean;
  toDisplay?: RunResult;
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
export function ResultDisplay({
  isRunning,
  toDisplay: result,
}: ResultDisplayProps) {
  if (isRunning) {
    return <Spinner />;
  }

  return <InputDisplay data={formatResult(result)}></InputDisplay>;
}
