import { Spinner, Tooltip } from "flowbite-react";
import {
  AggregateEvaluation,
  AnswerEval,
  getAggregateEvaluation,
} from "../inputs/inputs";
import { ResultIcon } from "./ResultIcon";
import { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import {
  getLocalTheme,
  LONG_RUNTIME_MS,
  RunResult,
  toast,
} from "../solutions/utils";

/**
 * Given an AggregateEvaluation, returns an array of styles to be applied to the header,
 * comprising a 'theme' for the header.
 */
function getHeaderStyle(evaluation: AggregateEvaluation): string {
  switch (evaluation) {
    case AggregateEvaluation.AllCorrect:
      return classNames("border-green-600", "dark:border-green-400");
    case AggregateEvaluation.PartialCorrect:
      return classNames("border-yellow-400", "dark:border-yellow-400");
    case AggregateEvaluation.AllIncorrect:
      return classNames("border-red-600", "dark:border-red-500");
    default:
      return classNames("border-gray-600");
  }
}

interface HeaderTextProps {
  name: string;
  result: RunResult | null;
}

function HeaderText({ name, result }: HeaderTextProps) {
  const headerTextRef = useRef<HTMLHeadingElement>(null);

  const headerTitle = (
    <h3
      ref={headerTextRef}
      style={{ maxWidth: "10rem" }} // Not sure how to do this in Tailwind yet
      className={classNames(
        "text-lg",
        "font-semibold",
        "dark:font-normal",
        "text-ellipsis",
        "overflow-hidden",
        "whitespace-nowrap"
      )}
    >
      {name}
    </h3>
  );

  // Used to check if text is truncated, i.e. with ellipsis
  const isEllipsisActive = useCallback(() => {
    const current = headerTextRef.current;
    if (current && current.offsetWidth < current.scrollWidth) {
      return true;
    }
    return false;
  }, [headerTextRef, result]);

  return (
    <div className={classNames("font-mono", "flex", "gap-2", "items-center")}>
      <ResultIcon evaluations={result?.evaluation} size="md" />
      <div
        className={classNames("flex", "items-baseline", "gap-2", "select-none")}
      >
        {isEllipsisActive() ? (
          <Tooltip content={name} animation="duration-50">
            {headerTitle}
          </Tooltip>
        ) : (
          headerTitle
        )}
        {result && (
          <p className={classNames("text-xs", "opacity-70")}>
            {result.runtimeMs.toFixed(2)}ms
          </p>
        )}
      </div>
    </div>
  );
}

interface PartResultProps {
  label: string;
  evaluation: AnswerEval;
  result: string;
  expected?: string;
}
function PartResult({ label, evaluation, result, expected }: PartResultProps) {
  const tooltip = (
    <div className={classNames("flex", "flex-col", "gap-2")}>
      <div>
        <p>Expected: {expected ?? "?"}</p>
        <p>Result: {result ?? "?"}</p>
      </div>
      <p
        className={classNames("text-xs", "italic", "opacity-75", "self-center")}
      >
        Click to copy
      </p>
    </div>
  );

  const getCodeTheme = () => {
    return getLocalTheme() === "dark"
      ? ["bg-slate-700", "text-orange-300"]
      : ["bg-slate-100", "text-orange-800"];
  };

  const copyResultToClipboard = () => {
    navigator.clipboard.writeText(result).then(() =>
      toast(
        <div>
          Copied answer
          <code className={classNames("mx-1", "px-1", getCodeTheme())}>
            {result}
          </code>
          to clipboard
        </div>,
        { autoClose: 3000 }
      )
    );
  };

  return (
    <Tooltip content={tooltip} animation="duration-50">
      <div
        className={classNames(
          "font-mono",
          "flex",
          "gap-2",
          "items-center",
          "cursor-pointer",
          "select-none"
        )}
        onClick={copyResultToClipboard}
      >
        <div>
          <ResultIcon evaluations={evaluation} size="md" useColor />
        </div>
        <h4>{label}</h4>
      </div>
    </Tooltip>
  );
}

function getEvaluationsToConsider(settledResult: RunResult | null) {
  const evaluationsForTheme = [];
  if (settledResult?.problemInput.expected.partOne != null) {
    evaluationsForTheme.push(settledResult.evaluation[0]);
  }
  if (settledResult?.problemInput.expected.partTwo != null) {
    evaluationsForTheme.push(settledResult.evaluation[1]);
  }
  return evaluationsForTheme;
}

interface ResultDisplayProps {
  name: string;
  result?: Promise<RunResult>;
  setSelectedProblemInput: () => void;
}
export function ResultDisplay({
  name,
  result,
  setSelectedProblemInput: setInputActive,
}: ResultDisplayProps) {
  const [settledResult, setSettledResult] = useState<RunResult | null>(null);

  useEffect(() => {
    if (result) {
      // Proactively set a timer at which to clear the current settledResult
      // indicating that the 'new' result has not yet settled, and a spinner should be shown.
      // TODO: Maybe tidy this into separate states?
      const longRunTimeout = setTimeout(
        () => setSettledResult(null),
        LONG_RUNTIME_MS
      );
      result.then((r) => {
        clearTimeout(longRunTimeout);
        setSettledResult(r);
      });
    }
  }, [result]);

  const evaluationsForTheme = getEvaluationsToConsider(settledResult);
  const headerTheme = getHeaderStyle(
    getAggregateEvaluation(evaluationsForTheme)
  );

  return (
    <div
      className={classNames(
        "w-80",
        "bg-slate-100",
        "dark:bg-gray-700",
        "shadow",
        "rounded-2xl",
        "text-slate-700",
        "dark:text-slate-200"
      )}
    >
      <div
        className={classNames(
          "bg-slate-50",
          "dark:bg-slate-800",
          "rounded-t-2xl",
          "rounded-b-lg",
          "p-4",
          "box-border",
          "border-b-4",
          "cursor-pointer",
          "shadow-sm",
          "hover:shadow-md",
          "dark:hover:shadow-none",
          "dark:hover:bg-slate-700",
          "transition-all",
          headerTheme
        )}
        onClick={setInputActive}
      >
        <HeaderText name={name} result={settledResult} />
      </div>
      <div className={classNames("p-4", "flex", "justify-center", "gap-16")}>
        {settledResult != null ? (
          <>
            <PartResult
              label="Part 1"
              evaluation={settledResult.evaluation[0]}
              expected={settledResult.problemInput.expected.partOne}
              result={settledResult.answer.partOne}
            />
            <PartResult
              label="Part 2"
              evaluation={settledResult.evaluation[1]}
              expected={settledResult.problemInput.expected.partTwo}
              result={settledResult.answer.partTwo}
            />
          </>
        ) : (
          // TODO: Make this overlay the previous results so they're always visible
          <Spinner />
        )}
      </div>
    </div>
  );
}
