import { Button, Spinner } from "flowbite-react";
import { ProblemInput } from "../inputs/inputs";
import { InputDisplay } from "./EnumeratedTextDisplay";
import * as cs from "classnames";
import { ResultIcon } from "./ResultIcon";
import { TabGroup, TabItem } from "./Tabs";
import ButtonGroup from "flowbite-react/lib/esm/components/Button/ButtonGroup";
import { RunResult } from "../solutions/utils";

interface InputSelectorProps {
  isRunning: boolean;
  problemInputs: ProblemInput[];
  runResults: Map<string, RunResult>;
  selectedProblemInput: ProblemInput;
  setSelectedProblemInput: (input: ProblemInput) => void;
  runProblemInputs: (inputs: ProblemInput[]) => void;
}
function InputSelector({
  isRunning,
  problemInputs,
  selectedProblemInput,
  setSelectedProblemInput,
  runResults,
  runProblemInputs,
}: InputSelectorProps) {
  return (
    <>
      <div className={cs("flex", "flex-col", "gap-2", "w-full")}>
        <div
          className={cs("flex", "space-x-4", "items-end", "justify-between")}
        >
          <div className={cs("flex", "space-x-2")}>
            <ButtonGroup>
              <Button
                color={isRunning ? "info" : "success"}
                onClick={() => runProblemInputs([selectedProblemInput])}
              >
                {isRunning ? (
                  <>
                    <Spinner size="sm" aria-label="Spinner button example" />
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
                    <Spinner size="sm" aria-label="Spinner button example" />
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
    </>
  );
}

export default InputSelector;
