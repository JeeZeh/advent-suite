import { useCallback, useMemo, useState } from "react";
import { Header } from "../components/Header";
import {
  getDayOptions,
  getDefaultProblem,
  getProblemInputs,
  getYearOptions,
  Problem,
  ProblemInput,
} from "../inputs/inputs";

import { ResultContainer } from "../components/ResultsContainer";
import InputSelector from "../components/InputSelector";
import { RunResult, runSolution } from "../solutions/utils";
import classNames from "classnames";

export function Landing() {
  const [problem, setProblem] = useState<Problem>(getDefaultProblem());
  const [selectedProblemInput, setSelectedProblemInput] =
    useState<ProblemInput>(getProblemInputs(problem.year, problem.day)[0]);
  const [runResults, setRunResults] = useState(
    new Map<string, Promise<RunResult>>()
  );
  const [lastRunInputs, setLastRunInputs] = useState<ProblemInput[]>([]);

  const problemInputs = getProblemInputs(problem.year, problem.day);

  const runProblemInputs = (problemInputs: ProblemInput[]) => {
    if (problemInputs.length == 0) {
      return;
    }

    const newResults = new Map(runResults);
    problemInputs.forEach((p) =>
      newResults.set(p.name, runSolution(problem.year, problem.day, p))
    );
    setLastRunInputs(problemInputs);
    setRunResults(newResults);
  };

  // When a new problem is set, make sure it's actually changed
  // and if so:
  // 1. clear the run results
  // 2. set the new default problem input
  const updateProblem = (newProblem: Problem) => {
    if (problem.year !== newProblem.year || problem.day != newProblem.day) {
      setProblem(newProblem);
      setRunResults(new Map());
      setSelectedProblemInput(
        getProblemInputs(newProblem.year, newProblem.day)[0]
      );
    }
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
        <Header problem={problem} setProblem={updateProblem} />
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
