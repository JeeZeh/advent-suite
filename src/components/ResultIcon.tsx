import {
  AggregateEvaluation,
  AnswerEval,
  getAggregateEvaluation,
} from "../inputs/inputs";
import {
  CheckCircleIcon,
  EllipsisHorizontalCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import classNames from "classnames";

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

/**
* Given an AggregateEvaluation, returns an appropriate color to be used
* for the ResultIcon, if useColor is provided.
*/
function getColor(evaluation: AggregateEvaluation): string {
  switch (evaluation) {
    case AggregateEvaluation.AllCorrect:
      return classNames("fill-green-500", "dark:fill-green-400");
    case AggregateEvaluation.PartialCorrect:
      return classNames("fill-yellow-400", "dark:fill-yellow-300");
    case AggregateEvaluation.AllIncorrect:
      return classNames("fill-red-500", "dark:fill-red-400");
    default:
      return "";
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
    determinedClasses.push(getColor(aggregateEvaluation));
  }

  determinedClasses.push(iconSizes[props.size ?? "md"]);

  return <Icon {...otherSvgProps} className={classNames(determinedClasses)} />;
}
