import { ProblemInput } from "../inputs/inputs";
import { ResultDisplay } from "./ResultDisplay";
import classNames, * as cs from "classnames";
import { ResultProgressBar } from "./ResultProgressBar";
import { RunResult } from "../solutions/utils";
import { Label, Select } from "flowbite-react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

interface ResultContainerProps {
  problemInputs: ProblemInput[];
  runResults: Map<string, Promise<RunResult>>;
  triggerRerun: () => void;
  setSelectedProblemInput: (input: ProblemInput) => void;
}
export function ResultContainer({
  problemInputs,
  runResults,
  triggerRerun,
  setSelectedProblemInput,
}: ResultContainerProps) {
  const [rerunInterval, setRerunInterval] = useState<any>(null);
  const [rerunIntervalMs, setRerunIntervalMs] = useState(0);

  useEffect(() => {
    if (rerunInterval) {
      clearInterval(rerunInterval);
    }
    if (rerunIntervalMs > 0) {
      setRerunInterval(setInterval(triggerRerun, rerunIntervalMs));
    }

    return () => {
      clearInterval(rerunInterval);
    };
  }, [rerunIntervalMs, triggerRerun]);

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
        <div className={classNames("flex", "flex-col", "gap-1")}>
          <div className={classNames("flex", "items-baseline", "gap-2")}>
            <Label>Auto re-run</Label>
            {rerunIntervalMs !== 0 && <svg height="10" width="10" className="blink">
              <circle cx="5" cy="5" r="5" className="fill-blue-600" />
              Sorry, your browser does not support inline SVG.
            </svg>}
          </div>

          <Select
            sizing="base"
            icon={ArrowPathIcon}
            title="Auto re-run"
            onChange={(e) => setRerunIntervalMs(parseInt(e.target.value))}
          >
            <option value={0}>None</option>
            <option value={1000}>1s</option>
            <option value={2000}>2s</option>
            <option value={5000}>5s</option>
          </Select>
        </div>
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
