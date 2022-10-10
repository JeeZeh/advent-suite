import { AnswerEval } from "../inputs/inputs";
import {
  CheckCircleIcon,
  EllipsisHorizontalCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import classNames from "classnames";

function IconWrapper({
  evaluations,
  useColor,
  ...rest
}: ResultIconProps & React.ComponentProps<"svg">) {
  const baseClass = rest.className;

  if (evaluations == null) {
    return <EllipsisHorizontalCircleIcon />;
  }

  // Everything is correct
  if (evaluations.every((e) => e == AnswerEval.Correct)) {
    return (
      <CheckCircleIcon
        {...rest}
        className={
          useColor
            ? classNames("fill-green-600", "dark:fill-green-400", baseClass)
            : baseClass
        }
      />
    );
  }

  // Nothing is Incorrect, but not everything is Correct (some Incomplete)
  if (evaluations.every((e) => e !== AnswerEval.Incorrect)) {
    return (
      <QuestionMarkCircleIcon
        {...rest}
        className={
          useColor ? classNames("fill-yellow-400", baseClass) : baseClass
        }
      />
    );
  }

  return (
    <XCircleIcon
      {...rest}
      className={
        useColor
          ? classNames("fill-red-600", "dark:fill-red-400", baseClass)
          : baseClass
      }
    />
  );
}

type IconSizes = {
  sm: "h-4";
  md: "h-6";
  lg: "h-8";
};


interface ResultIconProps {
  evaluations: AnswerEval[] | undefined;
  useColor?: boolean;
  size?: keyof IconSizes;
}
/**
 * Determine and return which icon to display for the RunResult evaluation.
 * @returns An SVG with the icon corresponding to the input evaluation result.
 */
export function ResultIcon(props: ResultIconProps) {
  let size = props.size ?? "md";

  return <IconWrapper {...props} className={size} />;
}
