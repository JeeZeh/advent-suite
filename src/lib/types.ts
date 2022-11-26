export enum AocYear {
  Y2015 = "2015",
  Y2016 = "2016",
  Y2017 = "2017",
  Y2018 = "2018",
  Y2019 = "2019",
  Y2020 = "2020",
  Y2021 = "2021",
  Y2022 = "2022",
}

export enum AocDay {
  D01 = "01",
  D02 = "02",
  D03 = "03",
  D04 = "04",
  D05 = "05",
  D06 = "06",
  D07 = "07",
  D08 = "08",
  D09 = "09",
  D10 = "10",
  D11 = "11",
  D12 = "12",
  D13 = "13",
  D14 = "14",
  D15 = "15",
  D16 = "16",
  D17 = "17",
  D18 = "18",
  D19 = "19",
  D20 = "20",
  D21 = "21",
  D22 = "22",
  D23 = "23",
  D24 = "24",
  D25 = "25",
}

export type Problem = {
  year: AocYear;
  day: AocDay;
};

export type Answer = {
  partOne: string;
  partTwo: string;
};

export enum AnswerEval {
  Correct,
  Incorrect,
  Incomplete,
}

export type ProblemInput = {
  name: string;
  data: string;
  isReal?: boolean;
  expected: Partial<Answer>;
};

export enum AggregateEvaluation {
  AllCorrect,
  PartialCorrect,
  AllIncorrect,
  Incomplete,
}

export type RunResult = {
  problemInput: ProblemInput;
  answer: Partial<Answer>;
  runtimeMs: number;
  evaluation: [AnswerEval, AnswerEval];
  aggregateEvaluation: AggregateEvaluation;
};

export type SolutionRunner = (input?: string, canvas?: HTMLCanvasElement) => Promise<Partial<Answer>>;
