import {
  getAggregateEvaluation,
} from "../lib/problems";
import {
  CheckCircleIcon,
  EllipsisHorizontalCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import classNames from "classnames";
import { getEvaluationColor } from "../lib/utils";
import { useEffect, useState } from "react";
import { AggregateEvaluation, AnswerEval } from "../lib/types";

/**
 * Given an AggregateEvaluation, returns an appropriate SVG icon to be used
 * as the ResultIcon.
 */
function getIcon(
  evaluation: AggregateEvaluation
): (props: React.SVGProps<SVGSVGElement>) => JSX.Element {
  switch (evaluation) {
    case AggregateEvaluation.AllCorrect:
      return CheckCircleIcon;
    case AggregateEvaluation.PartialCorrect:
      return QuestionMarkCircleIcon;
    case AggregateEvaluation.AllIncorrect:
      return XCircleIcon;
    default:
      return EllipsisHorizontalCircleIcon;
  }
}

const iconSizes = {
  sm: "h-4",
  md: "h-5",
  lg: "h-6",
};

interface ResultIconProps extends React.SVGProps<SVGSVGElement> {
  evaluations: AnswerEval[] | AnswerEval | undefined;
  useColor?: boolean;
  size?: keyof typeof iconSizes;
}

/**
 * Determine and return which icon to display for the RunResult evaluation.
 * @returns An SVG with the icon corresponding to the input evaluation result.
 */
export function ResultIcon(props: ResultIconProps) {
  const { evaluations, useColor, size, className, ...otherSvgProps } = props;

  // Collect classes to apply to icon
  const determinedClasses = [];

  const aggregateEvaluation = getAggregateEvaluation(evaluations);
  const Icon = getIcon(aggregateEvaluation);

  // Apply color to the icon conditionally
  if (props.useColor) {
    determinedClasses.push(getEvaluationColor(aggregateEvaluation));
  }

  determinedClasses.push(iconSizes[props.size ?? "md"]);

  return <Icon {...otherSvgProps} className={classNames(determinedClasses)} />;
}

export function AsyncResultIcon(
  props: Omit<ResultIconProps, "evaluations"> & {
    evaluations?: Promise<AnswerEval[] | AnswerEval>;
  }
) {
  const [resolvedEvaluation, setResolvedEvaluation] = useState<
    AnswerEval[] | AnswerEval
  >();

  useEffect(() => {
    if (props.evaluations) {
      props.evaluations.then(
        (r) => resolvedEvaluation != r && setResolvedEvaluation(r)
      );
    }
  }, [props.evaluations]);

  const newProps: ResultIconProps = {
    ...props,
    evaluations: AnswerEval.Incomplete,
  };

  if (!resolvedEvaluation) {
    return <ResultIcon {...newProps} />;
  }

  newProps.evaluations = resolvedEvaluation;

  return <ResultIcon {...newProps} />;
}
