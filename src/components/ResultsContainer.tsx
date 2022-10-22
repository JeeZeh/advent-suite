import { ProblemInput } from "../inputs/inputs";
import { ResultDisplay } from "./ResultDisplay";
import * as cs from "classnames";
import { ResultProgressBar } from "./ResultProgressBar";
import { AsyncResult, RunResult } from "../solutions/utils";

interface ResultContainerProps {
  problemInputs: ProblemInput[];
  runResults: Map<string, Promise<RunResult>>;
}
export function ResultContainer({
  problemInputs,
  runResults,
}: ResultContainerProps) {
  return (
    <div className={cs("flex", "flex-col", "gap-4", "px-2", "py-8")}>
      <h3 className={cs("text-3xl", "dark:text-slate-100")}>Results</h3>
      <ResultProgressBar runResults={runResults} />
      <div className={cs("flex", "flex-wrap", "gap-6", "justify-center")}>
        {problemInputs
          .filter((p) => runResults.has(p.name))
          .map((p) => (
            <ResultDisplay
              key={p.name}
              name={p.name}
              result={runResults.get(p.name)}
            />
          ))}
      </div>
    </div>
  );
}
