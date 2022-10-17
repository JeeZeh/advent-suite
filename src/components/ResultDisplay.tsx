import { Badge, BadgeColors, Spinner, Tooltip } from "flowbite-react";
import {
  AggregateEvaluation,
  AnswerEval,
  getAggregateEvaluation,
} from "../inputs/inputs";
import { ResultIcon } from "./ResultIcon";
import { useCallback, useRef } from "react";
import classNames from "classnames";
import { RunResult } from "../solutions/utils";

/**
 * Given an AggregateEvaluation, returns an array of styles to be applied to the header,
 * comprising a 'theme' for the header.
 */
function getHeaderStyle(evaluation: AggregateEvaluation): string {
  switch (evaluation) {
    case AggregateEvaluation.AllCorrect:
      return classNames("border-green-400");
    case AggregateEvaluation.PartialCorrect:
      return classNames("border-yellow-400", "dark:border-yellow-300");
    case AggregateEvaluation.AllIncorrect:
      return classNames("border-red-400");
    default:
      return classNames("border-gray-400");
  }
}

interface HeaderTextProps {
  result: RunResult;
}

function HeaderText({ result }: HeaderTextProps) {
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
      {result.problemInput.name}
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
      <ResultIcon evaluations={result.evaluation} size="md" />
      <div
        className={classNames("flex", "items-baseline", "gap-2", "select-none")}
      >
        {isEllipsisActive() ? (
          <Tooltip content={result.problemInput.name} animation="duration-50">
            {headerTitle}
          </Tooltip>
        ) : (
          headerTitle
        )}
        <p className={classNames("text-sm", "opacity-70")}>
          {result.runtimeMs.toFixed(2)}ms
        </p>
      </div>
    </div>
  );
}

interface PartResultProps {
  label: string;
  evaluation: AnswerEval;
  result?: string;
  expected?: string;
}
function PartResult({ label, evaluation, result, expected }: PartResultProps) {
  const tooltip = (
    <div>
      <p>Expected: {expected ?? "?"}</p>
      <p>Result: {result ?? "?"}</p>
    </div>
  );
  return (
    <Tooltip content={tooltip} animation="duration-50">
      <div
        className={classNames(
          "font-mono",
          "flex",
          "gap-2",
          "items-center",
          "cursor-default"
        )}
      >
        <div>
          <ResultIcon evaluations={evaluation} size="md" useColor />
        </div>
        <h4>{label}</h4>
      </div>
    </Tooltip>
  );
}

interface ResultDisplayProps {
  isRunning: boolean;
  result?: RunResult;
}
export function ResultDisplay({ isRunning, result }: ResultDisplayProps) {
  if (isRunning) {
    return <Spinner />;
  }

  if (result == null) {
    return null;
  }

  const headerTheme = getHeaderStyle(getAggregateEvaluation(result.evaluation));

  return (
    <div
      className={classNames(
        "w-80",
        "bg-slate-100",
        "dark:bg-gray-700",
        "shadow-md",
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
          "shadow-sm",
          headerTheme
        )}
      >
        <HeaderText result={result} />
      </div>
      <div
        className={classNames(
          "p-4",
          "flex",
          "justify-center",
          "gap-16"
        )}
      >
        <PartResult
          label="Part 1"
          evaluation={result.evaluation[0]}
          expected={result.problemInput.expected.partOne}
          result={result.answer.partOne}
        />
        <PartResult
          label="Part 2"
          evaluation={result.evaluation[1]}
          expected={result.problemInput.expected.partTwo}
          result={result.answer.partTwo}
        />
      </div>
    </div>
  );
}
