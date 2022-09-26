import {
  Badge,
  Button,
  Label,
  ListGroup,
  Select,
  Spinner,
  Textarea,
} from "flowbite-react";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { Header } from "../components/Header";
import {
  Answer,
  getDayOptions,
  getProblemInputs,
  getYearOptions,
  ProblemInput,
} from "../inputs/inputs";
import { ResultDisplay } from "../components/ResultDisplay";
import { InputDisplay } from "../components/InputDisplay";
import * as cs from "classnames";
import {
  ListGroupItem,
  ListGroupItemProps,
} from "flowbite-react/lib/esm/components/ListGroup/ListGroupItem";
import {
  CheckBadgeIcon,
  CheckCircleIcon,
  EllipsisHorizontalCircleIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/solid";

export type RunResult = {
  problemInput: ProblemInput;
  answer: Answer;
  runtimeMs: number;
};

type SolverModule = {
  default: (input?: string) => Promise<any[]>;
};
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

  return {
    problemInput: input,
    answer: { partOne, partTwo },
    runtimeMs,
  };
}

function Landing() {
  const [year, setYear] = useState<string>(getYearOptions()[0]);
  const [day, setDay] = useState<string>(getDayOptions(year)[0]);
  const [problemInput, setProblemInput] = useState<ProblemInput>(
    getProblemInputs(year, day)[0]
  );
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunResult>();

  const yearOptions = useMemo(() => getYearOptions(), []);
  const dayOptions = useMemo(() => getDayOptions(year), [year]);
  const problemInputs = useMemo(() => getProblemInputs(year, day), [year, day]);

  const runSolutionWithSelectedInput = useCallback(async () => {
    const showSpinnerAfter = setTimeout(() => setIsRunning(true), 1000);
    setRunResult(await runSolution(year, day, problemInput));
    clearTimeout(showSpinnerAfter);
    setIsRunning(false);
  }, [year, day, problemInput]);

  const runSolutionWithAllInputs = useCallback(async () => {
    const showSpinnerAfter = setTimeout(() => setIsRunning(true), 1000);
    // Run result should be an array that maps back to the example inputs
    // Maybe split this into a different view, a wrapper over ResultDisplay with tabs?
    // Consider including in the result the time taken to run in addition to the answer
    // Could also include the whether or not each part matches the expected output
    // setRunResult(await dynRunSolution(year, day, problemInput.data));
    clearTimeout(showSpinnerAfter);
    setIsRunning(false);
  }, [year, day, problemInput]);

  function changeProblemInput(name: string) {
    const input = problemInputs.find((x) => x.name == name);
    if (input) {
      setProblemInput(input);
    }
  }

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
        <div
          className={cs(
            "flex",
            "flex-col",
            "items-center",
            "space-y-3",
            "mt-10",
            "w-full"
          )}
        >
          <ResultDisplay isRunning={isRunning} toDisplay={runResult} />
          <div className={cs("flex flex-row gap-2 w-full")}>
            <div
              className={cs(
                "w-full",
                "h-64",
                "resize-y",
                "bg-slate-50",
                "dark:bg-slate-800",
                "dark:text-slate-100",
                "rounded-md",
                "font-mono",
                "shadow-md",
                "border-gray-300",
                "dark:border-gray-600",
                "border",
                "flex",
                "flex-row",
                "col-span-1",
                "overflow-y-auto"
              )}
            >
              <InputDisplay problemInput={problemInput} />
            </div>
            <div className={cs("flex", "flex-col", "gap-2", "w-96")}>
              <div
                className={cs(
                  "flex",
                  "space-x-4",
                  "items-end",
                  "justify-between"
                )}
              >
                <div className={cs("flex", "space-x-2")}>
                  <Button
                    color={isRunning ? "info" : "success"}
                    onClick={runSolutionWithSelectedInput}
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
                    onClick={runSolutionWithSelectedInput}
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
                </div>
              </div>
              <ListGroup>
                {problemInputs.map((p) => (
                  <ListGroupItem
                    key={`option-${p.name}`}
                    active={problemInput?.name == p.name}
                    onClick={() => changeProblemInput(p.name)}
                  >
                    <div className={cs("flex", "space-x-2", "items-center", "justify-center")}>
                      <div className={cs("w-6")}>
                        {runResult?.answer &&
                        runResult.problemInput.name == p.name ? (
                          <CheckBadgeIcon />
                        ) : (
                          <EllipsisHorizontalCircleIcon />
                        )}
                      </div>
                      <div>{p.name}</div>
                    </div>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
