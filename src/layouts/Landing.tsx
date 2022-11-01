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
  const [runResults, setRunResults] = useState(
    new Map<string, Promise<RunResult>>()
  );
  const [lastRunInputs, setLastRunInputs] = useState<ProblemInput[]>([]);

  const yearOptions = useMemo(() => getYearOptions(), []);
  const dayOptions = useMemo(() => getDayOptions(year), [year]);
  const problemInputs = useMemo(() => getProblemInputs(year, day), [year, day]);

  const runProblemInputs = (problemInputs: ProblemInput[]) => {
    if (problemInputs.length == 0) {
      return;
    }

    const newResults = new Map(runResults);
    problemInputs.forEach((p) =>
      newResults.set(p.name, runSolution(year, day, p))
    );
    setLastRunInputs(problemInputs);
    setRunResults(newResults);
  };

  return (
    <div
      className={classNames(
        "font-sans",
        "bg-slate-100",
        "dark:bg-slate-900",
        "min-h-screen",
        "flex",
        "flex-col",
        "items-center"
      )}
    >
      <div className={classNames("flex", "flex-col", "items-center", "w-2/3")}>
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
            "justify-center",
            "space-y-3",
            "mt-10",
            "w-5/6"
          )}
        >
          <InputSelector
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
              triggerRerun={() => runProblemInputs(lastRunInputs)}
              setSelectedProblemInput={setSelectedProblemInput}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Landing;
