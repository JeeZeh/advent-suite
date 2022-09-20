import { Spinner, Textarea } from "flowbite-react";
import React from "react";
import { Answer } from "../inputs/inputs";
import { RunResult } from "../layouts/Landing";

interface ResultDisplayProps {
  isRunning: boolean;
  toDisplay?: RunResult;
}
function formatAnswer({ answer, runtimeMs }: RunResult): string {
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
  if (!result) {
    return null;
  }
  return (
    <Textarea
      style={{ minHeight: "6em", resize: "none", fontFamily: "Berkeley Mono Regular" }}
      value={formatAnswer(result)}
      readOnly
    ></Textarea>
  );
}
