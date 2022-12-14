import classNames from "classnames";
import React, { useMemo } from "react";

interface InputDisplayProps {
  data?: string;
}
export function EnumeratedTextDisplay({
  data,
}: InputDisplayProps): React.ReactElement {
  if (!data) {
    return (
      <div
        className={classNames(
          "flex",
          "justify-center",
          "items-center",
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
    <div
      className={classNames(
        "flex",
        "flex-row",
        "font-mono",
        "h-min",
        "min-h-full"
      )}
    >
      {/* Left-hand gutter with line numbers  */}
      {/* Required 'height: min-content; min-height: 100%' for resizable + scrollable bg to always be visible */}
      <div
        className={classNames(
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
          "dark:bg-gray-700",
          "text-gray-500",
          "dark:text-gray-400"
        )}
      >
        {lines.map(
          (_, i) => `${(i + 1).toString().padStart(linePaddingSize)}\n`
        )}
      </div>
      {/* Right-hand input display  */}
      <div className={classNames("whitespace-pre-wrap", "py-2")}>
        {lines.map((l, i) => `${l}\n`) ?? ""}
      </div>
    </div>
  );
}
