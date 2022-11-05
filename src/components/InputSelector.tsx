import { Button, Spinner, ToggleSwitch } from "flowbite-react";
import { AnswerEval, ProblemInput } from "../inputs/inputs";
import { EnumeratedTextDisplay } from "./EnumeratedTextDisplay";
import classNames, * as cs from "classnames";
import { ResultIcon } from "./ResultIcon";
import { TabGroup, TabItem } from "./Tabs";
import ButtonGroup from "flowbite-react/lib/esm/components/Button/ButtonGroup";
import { RunResult } from "../solutions/utils";
import { useEffect, useState } from "react";

interface InputTabProps {
  problemInput: ProblemInput;
  result?: Promise<RunResult>;
  isActive: boolean;
  setActive: () => void;
}
function InputTab({
  problemInput,
  result,
  isActive,
  setActive,
}: InputTabProps) {
  const [evaluation, setEvaluation] = useState<[AnswerEval, AnswerEval]>();

  useEffect(() => {
    if (result) {
      result.then(
        (r) => evaluation != r.evaluation && setEvaluation(r.evaluation)
      );
    }
  }, [result]);

  return (
    <TabItem
      key={`option-${problemInput.name}`}
      title={
        <div className={cs("flex", "gap-2", "items-center", "justify-center")}>
          <div>
            <ResultIcon
              evaluations={evaluation ?? []}
              useColor
              size="md"
              className="flex-shrink-0"
            />
          </div>
          <div
            className={cs(
              "text-ellipsis",
              "overflow-hidden",
              "whitespace-nowrap",
              "flex-shrink"
            )}
          >
            {problemInput.name}
          </div>
        </div>
      }
      ariaLabel={problemInput.name}
      active={isActive}
      onClick={setActive}
    />
  );
}

interface InputTabsProps {
  problemInputs: ProblemInput[];
  runResults: Map<string, Promise<RunResult>>;
  selectedProblemInput: ProblemInput;
  setSelectedProblemInput: (input: ProblemInput) => void;
}
function InputTabs({
  problemInputs,
  runResults,
  selectedProblemInput,
  setSelectedProblemInput,
}: InputTabsProps) {
  return (
    <TabGroup aria-label="Default tabs">
      {problemInputs.map((p) => (
        <InputTab
          problemInput={p}
          result={runResults.get(p.name)}
          isActive={selectedProblemInput.name === p.name}
          setActive={() =>
            selectedProblemInput.name !== p.name && setSelectedProblemInput(p)
          }
          key={`inputselect-${p.name}`}
        />
      ))}
    </TabGroup>
  );
}

interface InputSelectorProps {
  problemInputs: ProblemInput[];
  runResults: Map<string, Promise<RunResult>>;
  selectedProblemInput: ProblemInput;
  runOnSave: boolean;
  setRunOnSave: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedProblemInput: (input: ProblemInput) => void;
  runProblemInputs: (inputs: ProblemInput[]) => void;
}
function InputSelector({
  problemInputs,
  selectedProblemInput,
  setSelectedProblemInput,
  runResults,
  runProblemInputs,
  runOnSave,
  setRunOnSave,
}: InputSelectorProps) {
  return (
    <>
      <div className={cs("flex", "flex-col", "gap-2", "w-auto")}>
        <div
          className={cs("flex", "space-x-4", "items-end", "justify-between")}
        >
          <div className={cs("flex", "items-center", "gap-4")}>
            <ButtonGroup>
              <Button
                color="success"
                onClick={() => runProblemInputs([selectedProblemInput])}
              >
                Run
              </Button>
              <Button
                color="light"
                onClick={() => runProblemInputs(problemInputs)}
              >
                Run all
              </Button>
            </ButtonGroup>
            <div className={classNames("flex", "flex-col", "gap-1")}>
              <ToggleSwitch
                checked={runOnSave}
                label="Run on save"
                onChange={() => setRunOnSave((toggle) => !toggle)}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={cs(
          "flex",
          "flex-col",
          "rounded-md",
          "border",
          "border-gray-300",
          "dark:border-gray-600",
          "divide-y",
          "divide-gray-300",
          "dark:divide-gray-600"
        )}
      >
        <InputTabs
          problemInputs={problemInputs}
          runResults={runResults}
          selectedProblemInput={selectedProblemInput}
          setSelectedProblemInput={setSelectedProblemInput}
        />
        <div
          className={cs(
            "h-64",
            "resize-y",
            "rounded-b-md",
            "bg-slate-50",
            "dark:bg-slate-800",
            "dark:text-slate-100",
            "overflow-y-auto"
          )}
        >
          <EnumeratedTextDisplay data={selectedProblemInput.data} />
        </div>
      </div>
    </>
  );
}

export default InputSelector;
