import { AnswerEval } from "../inputs/inputs";
import {
  CheckCircleIcon,
  EllipsisHorizontalCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

interface ResultIconProps {
  evaluations: AnswerEval[] | undefined;
}
/**
 * Determine and return which icon to display for the RunResult evaluation.
 * @returns An SVG with the icon corresponding to the input evaluation result.
 */
export function ResultIcon({ evaluations }: ResultIconProps) {
  if (evaluations == null) {
    return <EllipsisHorizontalCircleIcon />;
  }

  // Everything is correct
  if (evaluations.every((e) => e == AnswerEval.Correct)) {
    return <CheckCircleIcon />;
  }

  // Nothing is Incorrect, but not everything is Correct (some Incomplete)
  if (evaluations.every((e) => e !== AnswerEval.Incorrect)) {
    return <QuestionMarkCircleIcon />;
  }

  return <XCircleIcon />;
}