import { Button, Label, Select, Spinner, Textarea } from "flowbite-react";
import React, {
  ChangeEvent,
  FC,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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

export type RunResult = {
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

  function changeProblemInput(e: ChangeEvent<HTMLSelectElement>) {
    const input = problemInputs.find((x) => x.name == e.target.value);
    if (input) {
      setProblemInput(input);
    }
  }

  return (
    <div className="font-sans bg-slate-100 dark:bg-slate-900 min-h-screen">
      <div className="grid max-w-4xl grid-flow-row place-items-center m-auto">
        <Header
          year={year}
          yearOptions={yearOptions}
          setYear={setYear}
          day={day}
          dayOptions={dayOptions}
          setDay={setDay}
        />
        <div className="flex flex-col items-center space-y-3 mt-10 w-10/12">
          <div className="flex space-x-4 items-end justify-center ">
            <div>
              <Label>Input</Label>
              <Select
                title="Input"
                sizing="base"
                shadow
                onChange={changeProblemInput}
              >
                {problemInputs.map((i) => (
                  <option key={`option-${i.name}`} value={i.name}>
                    {i.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex space-x-1">
              <Button
                color={isRunning ? "info" : "success"}
                onClick={runSolutionWithSelectedInput}
              >
                {isRunning ? (
                  <>
                    <Spinner size="sm" aria-label="Spinner button example" />
                    <span className="pl-3">Running...</span>
                  </>
                ) : (
                  "Run"
                )}
              </Button>
              {/* <Button
                color={isRunning ? "info" : "light"}
                onClick={runSolutionWithSelectedInput}
              >
                {isRunning ? (
                  <>
                    <Spinner size="sm" aria-label="Spinner button example" />
                    <span className="pl-3">Running...</span>
                  </>
                ) : (
                  "Run all"
                )}
              </Button> */}
            </div>
          </div>
          <ResultDisplay isRunning={isRunning} toDisplay={runResult} />
          <InputDisplay problemInput={problemInput} />
        </div>
      </div>
    </div>
  );
}

export default Landing;
