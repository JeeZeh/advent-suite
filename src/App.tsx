import { Button, Label, Select, Spinner, Textarea } from "flowbite-react";
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./App.css";
import {
  getDayOptions,
  getProblemInputs,
  getYearOptions,
  ProblemInput,
} from "./inputs/inputs";

interface IHeaderProps {
  year?: string;
  yearOptions: string[];
  setYear: (v: string) => void;
  day?: string;
  dayOptions: string[];
  setDay: (v: string) => void;
}

function Header(props: IHeaderProps) {
  const { setYear, yearOptions, setDay, dayOptions } = props;
  return (
    <div className="flex flex-row items-center justify-between w-full max-w-4xl mt-4 shadow-lg py-6 px-10 rounded-lg bg-slate-50">
      <div>
        <p className="text-4xl font-bold font-mono">Advent of Code</p>
        <p className="text-base font-normal font"> suite</p>
      </div>
      <div className="flex flex-col space-y-2 items-start">
        <div>
          <Label>Year</Label>
          <Select
            title="test"
            sizing="base"
            onChange={(e) => setYear(e.target.value)}
          >
            {yearOptions.map((o) => (
              <option value={o}>{o}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Day</Label>
          <Select
            title="test"
            sizing="base"
            shadow
            onChange={(e) => setDay(e.target.value)}
          >
            {dayOptions.map((o) => (
              <option value={o}>{o}</option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}

type SolverModule = {
  default: (input?: string) => Promise<any[]>;
};
interface ResultDisplayProps {
  isRunning: boolean;
  toDisplay?: any[];
}
function formatResult(result: any[]): string {
  const [partOne, partTwo] = result;

  return `Part 1: ${partOne}\nPart 2: ${partTwo}`;
}
function ResultDisplay({ isRunning, toDisplay: result }: ResultDisplayProps) {
  if (isRunning) {
    return <Spinner />;
  }
  if (!result) {
    return null;
  }
  return <Textarea value={formatResult(result)}></Textarea>;
}

async function dynRunSolution(
  year: string,
  day: string,
  input: string
): Promise<any[]> {
  const module: SolverModule = await import(
    /* @vite-ignore */ `./solutions/${year}/${day}/Solver.ts`
  );
  return await module.default(input);
}

function App() {
  const [year, setYear] = useState<string>(getYearOptions()[0]);
  const [day, setDay] = useState<string>(getDayOptions(year)[0]);
  const [problemInput, setProblemInput] = useState<ProblemInput>(
    getProblemInputs(year, day)[0]
  );
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<any[]>();

  const yearOptions = useMemo(() => getYearOptions(), []);
  const dayOptions = useMemo(() => getDayOptions(year), [year]);
  const problemInputs = useMemo(() => getProblemInputs(year, day), [year, day]);

  const runSolution = useCallback(async () => {
    const showSpinnerAfter = setTimeout(() => setIsRunning(true), 1000);
    setRunResult(await dynRunSolution(year, day, problemInput.data));
    clearTimeout(showSpinnerAfter);
    setIsRunning(false);
  }, [year, day, problemInput]);

  return (
    <div className="App font-sans bg-slate-100 min-h-screen">
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
                onChange={(e) => {
                  const input = problemInputs.find(
                    (x) => x.name == e.target.value
                  );
                  if (input) {
                    setProblemInput(input);
                  }
                }}
              >
                {problemInputs.map((i) => (
                  <option value={i.name}>{i.name}</option>
                ))}
              </Select>
            </div>
            <Button
              color={isRunning ? "info" : "success"}
              onClick={runSolution}
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
          </div>
          <ResultDisplay isRunning={isRunning} toDisplay={runResult} />
          <Textarea
            value={problemInput?.data ?? ""}
            style={{ minHeight: "16em" }}
            disabled
          />
        </div>
      </div>
    </div>
  );
}

export default App;
