import { useCallback, useMemo, useState } from "react";
import { Header } from "../components/Header";
import {
  getDayOptions,
  getProblemInputs,
  getYearOptions,
  ProblemInput,
} from "../inputs/inputs";
import * as cs from "classnames";

import { ResultContainer } from "../components/ResultsContainer";
import InputSelector from "../components/InputSelector";
import { RunResult, runSolution } from "../solutions/utils";

export function Landing() {
  const [year, setYear] = useState<string>(getYearOptions()[0]);
  const [day, setDay] = useState<string>(getDayOptions(year)[0]);
  const [selectedProblemInput, setSelectedProblemInput] =
    useState<ProblemInput>(getProblemInputs(year, day)[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [runResults, setRunResults] = useState<Map<string, RunResult>>(
    new Map()
  );

  const yearOptions = useMemo(() => getYearOptions(), []);
  const dayOptions = useMemo(() => getDayOptions(year), [year]);
  const problemInputs = useMemo(() => getProblemInputs(year, day), [year, day]);

  const runProblemInputs = useCallback(
    async (problemInputs: ProblemInput[]) => {
      console.log(problemInputs);
      const showSpinnerAfter = setTimeout(() => setIsRunning(true), 1000);
      const results = await Promise.all(
        problemInputs.map(async (p) => await runSolution(year, day, p))
      );

      setRunResults((currentResults) => {
        for (const result of results) {
          currentResults.set(result.problemInput.name, result);
        }
        return new Map(currentResults);
      });

      clearTimeout(showSpinnerAfter);
      setIsRunning(false);
    },
    [year, day]
  );

  // TODO: Refactor this render into smaller components
  return (
    <div
      className={cs(
        "font-sans",
        "bg-slate-100",
        "dark:bg-slate-900",
        "min-h-screen"
      )}
    >
      <div
        className={cs(
          "grid",
          "max-w-4xl",
          "grid-flow-row",
          "place-items-center",
          "m-auto"
        )}
      >
        <Header
          year={year}
          yearOptions={yearOptions}
          setYear={setYear}
          day={day}
          dayOptions={dayOptions}
          setDay={setDay}
        />
        <div className={cs("flex", "flex-col", "space-y-3", "mt-10", "w-full")}>
          <InputSelector
            isRunning={isRunning}
            problemInputs={problemInputs}
            runResults={runResults}
            selectedProblemInput={selectedProblemInput}
            setSelectedProblemInput={setSelectedProblemInput}
            runProblemInputs={runProblemInputs}
          />
          {runResults.size > 0 && (
            <ResultContainer
              problemInputs={problemInputs}
              runResults={runResults}
              isRunning={isRunning}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Landing;
