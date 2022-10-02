import React, { useMemo } from "react";
import * as cs from "classnames";

interface InputDisplayProps {
  data?: string;
}
export function InputDisplay({ data }: InputDisplayProps): React.ReactElement {
  if (!data) {
    return (
      <div
        className={cs(
          "flex",
          "justify-center",
          "items-center",
          "w-full",
          "h-full",
          "p-5",
          "opacity-75"
        )}
      >
        <p>No text to display</p>
      </div>
    );
  }

  const linePaddingSize = useMemo(() => data.length.toString().length, [data]);

  const lines = useMemo(() => data.split("\n"), [data]);

  return (
    <>
      {/* Left-hand gutter with line numbers  */}
      {/* Required 'height: min-content; min-height: 100%' for resizable + scrollable bg to always be visible */}
      <div
        className={cs(
          "whitespace-pre-wrap",
          "font-light",
          "select-none",
          "border-r-2",
          "border-gray-300",
          "dark:border-gray-600",
          "px-4",
          "py-2",
          "mr-4",
          "bg-gray-200",
          "text-gray-500",
          "dark:bg-gray-700",
          "dark:text-gray-400",
          "h-min",
          "min-h-full"
        )}
      >
        {lines.map(
          (_, i) => `${(i + 1).toString().padStart(linePaddingSize)}\n`
        )}
      </div>
      {/* Right-hand input display  */}
      <div className={cs("whitespace-pre-wrap", "py-2")}>
        {lines.map((l, i) => `${l}\n`) ?? ""}
      </div>
    </>
  );
}
