import { ReactNode } from "react";
import * as cs from "classnames";
import { useHorizontalScroll } from "../hooks/useHorizontalScroll";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

interface GroupProps {
  children: ReactNode[];
}
export function TabGroup({ children }: GroupProps) {
  const scrollableRef = useHorizontalScroll();
  return (
    <SimpleBar
      autoHide={false}
      style={{ overflowY: "hidden" }}
      scrollableNodeProps={{ ref: scrollableRef }}
    >
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
          "bg-gray-200"
        )}
      >
        {children}
      </ul>
    </SimpleBar>
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
    "w-full",
  ];

  if (active) {
    classes.push(
      "text-blue-800",
      "bg-gray-100",
      "focus:outline-none",
      "dark:bg-gray-700",
      "dark:text-orange-50"
    );
  } else {
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
