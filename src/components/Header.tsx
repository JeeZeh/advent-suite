import { DarkThemeToggle, Label, Select } from "flowbite-react";
import React from "react";

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
    <div className="flex flex-row items-center justify-between w-full max-w-4xl mt-4 shadow-lg py-6 px-10 rounded-lg bg-slate-50 dark:bg-slate-800 dark:text-slate-50">
      <div>
        <div className="flex flex-row space-x-2">
          <p className="text-4xl font-bold font-mono">Advent of Code</p>
          <DarkThemeToggle />
        </div>
        <p className="text-base font-normal font opacity-75"> suite</p>
      </div>
      <div className="flex flex-col space-y-2 items-start">
        <div>
          <Label>Year</Label>
          <Select
            title="test"
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
            title="test"
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
