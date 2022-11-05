import { useCallback, useEffect, useState } from "react";
import { Header } from "../components/Header";
import {
  getDefaultProblem,
  getProblemInputs,
  Problem,
  ProblemInput,
} from "../inputs/inputs";

import { ResultContainer } from "../components/ResultsContainer";
import InputSelector from "../components/InputSelector";
import { RunResult, runSolution, toast } from "../solutions/utils";
import classNames from "classnames";

export function Landing() {
  const [problem, setProblem] = useState<Problem>(getDefaultProblem());
  const [selectedProblemInput, setSelectedProblemInput] =
    useState<ProblemInput>(getProblemInputs(problem.year, problem.day)[0]);
  const [runResults, setRunResults] = useState(
    new Map<string, Promise<RunResult>>()
  );
  const [lastRunInputs, setLastRunInputs] = useState<ProblemInput[]>([]);
  const [runOnSave, setRunOnSave] = useState(false);

  const problemInputs = getProblemInputs(problem.year, problem.day);

  const rerunProblemInputs = useCallback(() => {
    if (runOnSave && lastRunInputs.length > 0) {
      runProblemInputs(lastRunInputs);
      toast(
        `Re-ran ${lastRunInputs.length} input${
          lastRunInputs.length > 1 ? "s" : ""
        }`,
        { autoClose: 1000, hideProgressBar: true }
      );
    }
  }, [runOnSave, lastRunInputs]);

  useEffect(() => rerunProblemInputs(), []);

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
  // 1. Clear the run results
  // 2. Set the new default problem input
  const updateProblem = (newProblem: Problem) => {
    if (problem.year !== newProblem.year || problem.day != newProblem.day) {
      setProblem(newProblem);
      setRunResults(new Map());
      setLastRunInputs([]);
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
      <div
        className={classNames(
          "flex",
          "flex-col",
          "items-center",
          "w-3/4",
          "max-w-7xl"
        )}
      >
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
            runOnSave={runOnSave}
            setRunOnSave={setRunOnSave}
            runProblemInputs={runProblemInputs}
          />
          {runResults.size > 0 && (
            <ResultContainer
              problemInputs={problemInputs}
              runResults={runResults}
              setSelectedProblemInput={setSelectedProblemInput}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Landing;
