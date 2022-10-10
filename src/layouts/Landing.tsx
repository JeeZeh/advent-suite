import { Button, ListGroup, Spinner } from "flowbite-react";
import { useCallback, useMemo, useState } from "react";
import { Header } from "../components/Header";
import {
  Answer,
  AnswerEval,
  evaluateRunResult,
  getDayOptions,
  getProblemInputs,
  getYearOptions,
  ProblemInput,
} from "../inputs/inputs";
import { ResultDisplay } from "../components/ResultDisplay";
import { InputDisplay } from "../components/EnumeratedTextDisplay";
import * as cs from "classnames";

import { ResultIcon } from "../components/ResultIcon";
import { TabGroup, TabItem } from "../components/Tabs";
import ButtonGroup from "flowbite-react/lib/esm/components/Button/ButtonGroup";

export type RunResult = {
  problemInput: ProblemInput;
  answer: Answer;
  runtimeMs: number;
  evaluation: [AnswerEval, AnswerEval];
};

type SolverModule = {
  default: (input?: string) => Promise<any[]>;
};

/**
 * Dynamically imports the solver for this year and day, and runs the provided ProblemInput against it,
 * returning the result as a promise which resolves once the solution has run.
 *
 * @param year Solution year
 * @param day Solution day
 * @param input ProblemInput to be passed to the SolverModule
 * @returns A promise returning the RunResult of the imported SolverModule
 * running the given input, resolving when the solution is finished running.
 */
async function runSolution(
  year: string,
  day: string,
  input: ProblemInput
): Promise<RunResult> {
  const module: SolverModule = await import(
    /* @vite-ignore */ `../solutions/${year}/${day}/Solver.ts`
  );
  const start = window.performance.now();
  const [partOne, partTwo] = await module.default(input.data);
  const runtimeMs = window.performance.now() - start;
  const answer = { partOne, partTwo };
  return {
    problemInput: input,
    answer,
    runtimeMs,
    evaluation: evaluateRunResult(answer, input.expected),
  };
}

function Landing() {
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
          <div className={cs("flex", "flex-col", "gap-2", "w-full")}>
            <div
              className={cs(
                "flex",
                "space-x-4",
                "items-end",
                "justify-between"
              )}
            >
              <div className={cs("flex", "space-x-2")}>
                <ButtonGroup>
                  <Button
                    color={isRunning ? "info" : "success"}
                    onClick={() => runProblemInputs([selectedProblemInput])}
                  >
                    {isRunning ? (
                      <>
                        <Spinner
                          size="sm"
                          aria-label="Spinner button example"
                        />
                        <span className={cs("pl-3")}>Running...</span>
                      </>
                    ) : (
                      "Run"
                    )}
                  </Button>
                  <Button
                    color={isRunning ? "info" : "light"}
                    onClick={() => runProblemInputs(problemInputs)}
                  >
                    {isRunning ? (
                      <>
                        <Spinner
                          size="sm"
                          aria-label="Spinner button example"
                        />
                        <span className="pl-3">Running...</span>
                      </>
                    ) : (
                      "Run all"
                    )}
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
          <div
            className={cs(
              "flex",
              "flex-col",
              "w-full",
              "rounded-md",
              "border",
              "border-gray-300",
              "dark:border-gray-600",
              "divide-y",
              "divide-gray-300",
              "dark:divide-gray-600"
            )}
          >
            <div className={cs()}>
              <TabGroup aria-label="Default tabs">
                {problemInputs.map((p) => (
                  <TabItem
                    key={`option-${p.name}`}
                    title={
                      <div
                        className={cs(
                          "flex",
                          "space-x-2",
                          "items-center",
                          "justify-center"
                        )}
                      >
                        <div className={cs("w-6")}>
                          <ResultIcon
                            evaluations={runResults.get(p.name)?.evaluation}
                            useColor
                          />
                        </div>
                        <div>{p.name}</div>
                      </div>
                    }
                    ariaLabel={p.name}
                    active={selectedProblemInput?.name == p.name}
                    onClick={() => setSelectedProblemInput(p)}
                  />
                ))}
              </TabGroup>
            </div>

            <div
              className={cs(
                "w-full",
                "h-64",
                "resize-y",
                "rounded-b-md",
                "bg-slate-50",
                "dark:bg-slate-800",
                "dark:text-slate-100",
                "overflow-y-auto"
              )}
            >
              <InputDisplay data={selectedProblemInput.data} />
            </div>
          </div>
          <ResultDisplay
            isRunning={isRunning}
            result={runResults.get(selectedProblemInput.name)}
          />
        </div>
      </div>
    </div>
  );
}

export default Landing;
