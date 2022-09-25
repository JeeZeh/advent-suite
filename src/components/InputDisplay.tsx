import React, { PropsWithChildren, useMemo } from "react";
import { ProblemInput } from "../inputs/inputs";

function InputDisplayWrapper({ children }: PropsWithChildren) {
  return (
    <div className="whitespace-pre-wrap w-full h-64 bg-slate-50 dark:bg-slate-800 dark:text-slate-100 resize-y overflow-y-auto rounded-md font-mono flex flex-row shadow-md border-gray-300 dark:border-gray-600 border">
      {children}
    </div>
  );
}
interface InputDisplayProps {
  problemInput?: ProblemInput;
}
export function InputDisplay({
  problemInput,
}: InputDisplayProps): React.ReactElement {
  if (!problemInput || !problemInput.data) {
    return <InputDisplayWrapper>No input data!</InputDisplayWrapper>;
  }

  const linePaddingSize = useMemo(
    () => problemInput.data.length.toString().length,
    [problemInput]
  );

  const lines = useMemo(() => problemInput.data.split("\n"), [problemInput]);

  return (
    <InputDisplayWrapper>
      {/* Left-hand gutter with line numbers  */}
      {/* Required 'height: min-content; min-height: 100%' for resizable + scrollable bg to always be visible */}
      <div className="font-light select-none border-r-2 border-gray-300 dark:border-gray-600 px-4 py-2 mr-4 bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 h-min min-h-full">
        {lines.map(
          (_, i) => `${(i + 1).toString().padStart(linePaddingSize)}\n`
        )}
      </div>
      {/* Right-hand input display  */}
      <div className="py-2">{lines.map((l, i) => `${l}\n`) ?? ""}</div>
    </InputDisplayWrapper>
  );
}
