import { DarkThemeToggle, Label, Select } from "flowbite-react";

import classNames from "classnames";

interface IHeaderProps {
  year?: string;
  yearOptions: string[];
  setYear: (v: string) => void;
  day?: string;
  dayOptions: string[];
  setDay: (v: string) => void;
}

export function Header(props: IHeaderProps): JSX.Element {
  const { setYear, yearOptions, setDay, dayOptions } = props;
  return (
    <div
      className={classNames(
        "flex",
        "flex-row",
        "items-center",
        "justify-between",
        "w-full",
        "mt-4",
        "shadow-lg",
        "py-6",
        "px-10",
        "rounded-lg",
        "bg-slate-50",
        "dark:bg-slate-800",
        "text-blue-900",
        "dark:text-orange-50"
      )}
    >
      <div>
        <div className={classNames("flex", "flex-row", "space-x-2")}>
          <p className={classNames("text-4xl", "font-bold", "font-mono")}>
            Advent<span className={classNames("text-2xl","opacity-80", "pl-1")}>suite</span>
          </p>
          <DarkThemeToggle />
        </div>

      </div>
      <div className={classNames("flex", "flex-row", "gap-2", "items-start")}>
        <div>
          <Label>Year</Label>
          <Select
            sizing="base"
            onChange={(e) => setYear(e.target.value)}
          >
            {yearOptions.map((o) => (
              <option key={`option-${o}`} value={o}>
                {o}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Day</Label>
          <Select
            sizing="base"
            onChange={(e) => setDay(e.target.value)}
          >
            {dayOptions.map((o) => (
              <option key={`option-${o}`} value={o}>
                {o}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
