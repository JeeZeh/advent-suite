import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Header } from "../components/Header";
import { getDefaultProblem, getProblemInputs } from "../lib/problems";

import { ResultContainer } from "../components/ResultsContainer";
import InputSelector from "../components/InputSelector";
import classNames from "classnames";
import { Problem, ProblemInput, RunResult } from "../lib/types";
import { toast } from "react-toastify";
import { runSolution } from "../lib/utils";
import Canvas from "../components/Canvas";

export function Landing() {
  const [problem, setProblem] = useState<Problem>(getDefaultProblem());
  const [selectedProblemInput, setSelectedProblemInput] =
    useState<ProblemInput>(getProblemInputs(problem.year, problem.day)[0]);
  const [runResults, setRunResults] = useState(
    new Map<string, Promise<RunResult>>()
  );
  const [lastRunInputs, setLastRunInputs] = useState<ProblemInput[]>([]);
  const [runOnSave, setRunOnSave] = useState(false);
  const [shouldShowCanvas, setShouldShowCanvas] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);

  const problemInputs = useMemo(
    () => getProblemInputs(problem.year, problem.day),
    [problem]
  );

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
    setShouldShowCanvas(false);
    if (problemInputs.length === 0) {
      return;
    }

    const newResults = new Map(runResults);
    if (problemInputs.length === 1) {
      let problemInput = problemInputs[0];
      setShouldShowCanvas(true);
      newResults.set(
        problemInput.name,
        runSolution(problem.year, problem.day, problemInput, canvas.current)
      );
    }

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
          {shouldShowCanvas && (
            <Canvas canvasRef={canvas} width={400} height={200} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Landing;
