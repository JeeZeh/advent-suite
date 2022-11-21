import { DarkThemeToggle, Label, Select } from "flowbite-react";

import classNames from "classnames";
import { getDayOptions, getYearOptions } from "../lib/problems";
import { useEffect, useState } from "react";
import { AocDay, AocYear, Problem } from "../lib/types";

interface IHeaderProps {
  problem: Problem;
  setProblem: (p: Problem) => void;
}

export function Header(props: IHeaderProps): JSX.Element {
  const { problem, setProblem } = props;
  const [year, setYear] = useState(problem.year);
  const [day, setDay] = useState(problem.day);

  const updateYear = (newYear: AocYear) => {
    setYear((previousYear: AocYear) => {
      if (previousYear !== newYear) {
        const newDay = getDayOptions(newYear)[0];
        setDay(newDay);
        setProblem({ year: newYear, day: newDay });
      }
      return newYear;
    });
  };

  const updateDay = (newDay: AocDay) => {
    setDay((previousDay: AocDay) => {
      if (previousDay !== newDay) {
        setProblem({ year, day: newDay });
      }
      return newDay;
    });
  };

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
            Advent
            <span className={classNames("text-2xl", "opacity-80", "pl-1")}>
              suite
            </span>
          </p>
          <DarkThemeToggle />
        </div>
      </div>
      <div className={classNames("flex", "flex-row", "gap-2", "items-start")}>
        <div>
          <Label>Year</Label>
          <Select
            sizing="base"
            onChange={(e) => updateYear(e.target.value as AocYear)}
          >
            {getYearOptions().map((o) => (
              <option key={`option-${o}`} value={o}>
                {o}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Day</Label>
          {/* TODO: Improve typing of value to be explicitly AocYear and AocDay */}
          <Select
            sizing="base"
            onChange={(e) => updateDay(e.target.value as AocDay)}
          >
            {getDayOptions(problem.year).map((o) => (
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
