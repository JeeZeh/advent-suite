import { ReactNode } from "react";
import * as cs from "classnames";

interface GroupProps {
  children: ReactNode[];
}
export function TabGroup({ children }: GroupProps) {
  return (
    <ul
      className={cs(
        "flex",
        "text-sm",
        "font-medium",
        "text-center",
        "text-gray-500",
        "rounded-t-md",
        "divide-x",
        "divide-gray-200",
        "dark:divide-gray-700",
        "dark:text-gray-400",
        "bg-gray-200",
        "overflow-hidden",
        "overflow-x-auto"
      )}
    >
      {children}
    </ul>
  );
}

interface ItemProps {
  title: ReactNode;
  ariaLabel: string;
  active?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
}

export function TabItem({ title, ariaLabel, active, onClick }: ItemProps) {
  let classes = [
    "inline-block",
    "p-3",
    "first:rounded-tl-md",
    "last:rounded-tr-md",
    "cursor-pointer",
    "w-48",
  ];

  if (!active) {
    classes.push(
      "bg-white",
      "hover:text-gray-700",
      "hover:bg-gray-50",
      "focus:outline-none",
      "dark:hover:text-white",
      "dark:bg-gray-800",
      "dark:hover:bg-gray-700",
      "dark:hover:text-white",
      "dark:bg-gray-800",
      "dark:hover:bg-gray-700"
    );
  } else {
    classes.push(
      "text-blue-700",
      "bg-gray-100",
      "focus:outline-none",
      "dark:bg-gray-700",
      "dark:text-blue-300"
    );
  }

  return (
    <>
      <li
        className={cs(classes)}
        onClick={onClick}
        aria-current={active}
        aria-label={ariaLabel}
        tabIndex={0}
      >
        {title}
      </li>
    </>
  );
}
