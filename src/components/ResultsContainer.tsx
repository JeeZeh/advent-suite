import { ResultDisplay } from "./ResultDisplay";
import classNames, * as cs from "classnames";
import { ResultProgressBar } from "./ResultProgressBar";
import { Label, Radio, Select, ToggleSwitch } from "flowbite-react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { ProblemInput, RunResult } from "../lib/types";

interface ResultContainerProps {
  problemInputs: ProblemInput[];
  runResults: Map<string, Promise<RunResult>>;
  setSelectedProblemInput: (input: ProblemInput) => void;
}
export function ResultContainer({
  problemInputs,
  runResults,
  setSelectedProblemInput,
}: ResultContainerProps) {
  return (
    <div className={cs("flex", "flex-col", "gap-4", "px-2", "py-8")}>
      <div
        className={classNames(
          "flex",
          "flex-row",
          "justify-between",
          "items-center"
        )}
      >
        <h3 className={cs("text-3xl", "dark:text-slate-100")}>Results</h3>
      </div>
      <ResultProgressBar runResults={runResults} />
      <div className={cs("flex", "flex-wrap", "gap-6", "justify-center")}>
        {problemInputs
          .filter((p) => runResults.has(p.name))
          .map((p) => (
            <ResultDisplay
              key={p.name}
              name={p.name}
              result={runResults.get(p.name)}
              setSelectedProblemInput={() => setSelectedProblemInput(p)}
            />
          ))}
      </div>
    </div>
  );
}
