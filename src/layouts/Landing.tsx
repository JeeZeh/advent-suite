import { useCallback, useMemo, useState } from "react";
import { Header } from "../components/Header";
import {
  getDayOptions,
  getProblemInputs,
  getYearOptions,
  ProblemInput,
} from "../inputs/inputs";

import { ResultContainer } from "../components/ResultsContainer";
import InputSelector from "../components/InputSelector";
import { RunResult, runSolution } from "../solutions/utils";
import classNames from "classnames";

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

  return (
    <div
      className={classNames(
        "font-sans",
        "bg-slate-100",
        "dark:bg-slate-900",
        "min-h-screen"
      )}
    >
      <div
        className={classNames(
          "grid",
          "grid-flow-row",
          "place-items-center",
          "w-2/3",
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
        <div
          className={classNames(
            "flex",
            "flex-col",
            "space-y-3",
            "mt-10",
            "w-3/4",
          )}
        >
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

/**
 * Consider continually rerunning the input or running it every time you save it.
 * Each problem input would be mapped to an ongoing promise which runs the latest state of each solution.
 * If a problem is still running when a new solution is saved, cancel the existing promise and resubmit the new solution.
 *
 * Live feedback as you work.
 */
