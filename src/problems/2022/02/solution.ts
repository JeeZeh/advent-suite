import _ from "lodash";
import { SolutionRunner } from "../../../lib/types";

type HandValue = 1 | 2 | 3;
type Keys = "A" | "B" | "C";
type Strategy<T extends string> = { [key in T]: HandValue };
type OpponentStrategy = Strategy<"A" | "B" | "C">;
type PlayerStrategy = Strategy<"X" | "Y" | "Z">;

const opponentStrategy: OpponentStrategy = {
  A: 1,
  B: 2,
  C: 3,
};

const honestStrategy: PlayerStrategy = {
  X: 1,
  Y: 2,
  Z: 3,
};

// If you are LHS, you win if your opponent is RHS
const LhsWin: { [key in HandValue]: HandValue } = {
  1: 3,
  2: 1,
  3: 2,
};

// If you are LHS, you lose if your opponent is RHS
const RhsWin: { [key in HandValue]: HandValue } = {
  1: 2,
  2: 3,
  3: 1,
};

type Turn = [HandValue, HandValue];

const play = (game: Turn[]): string => {
  let player: number = 0;
  let opponent: number = 0;

  for (const [oHand, pHand] of game) {
    if (LhsWin[pHand] === oHand) {
      player += 6;
    } else if (LhsWin[oHand] === pHand) {
      opponent += 6;
    } else {
      player += 3;
      opponent += 3;
    }
    player += pHand;
    opponent += oHand;
  }

  console.log(opponent, player);

  return `${player}`;
};

const determineCorrectHandValue = (
  opponentHand: keyof OpponentStrategy,
  instruction: keyof PlayerStrategy
): Turn => {
  const opponent = opponentStrategy[opponentHand];
  switch (instruction) {
    // Lose
    case "X":
      return [opponent, LhsWin[opponent]];
    // Draw
    case "Y":
      return [opponent, opponent];
    // Win
    case "Z":
      return [opponent, RhsWin[opponent]];
    default:
      throw Error("");
  }
};

const run: SolutionRunner = async (input) => {
  if (!input) throw Error("Invalid input");

  const realGame = input
    .split("\n")
    .map((t) => t.split(" "))
    .map(
      ([l, r]) =>
        [
          opponentStrategy[l as keyof OpponentStrategy],
          honestStrategy[r as keyof PlayerStrategy],
        ] as Turn
    );

  const riggedGame = input
    .split("\n")
    .map((t) => t.split(" "))
    .map(([l, r]) =>
      determineCorrectHandValue(
        l as keyof OpponentStrategy,
        r as keyof PlayerStrategy
      )
    );

  return {
    answer: {
      partOne: play(realGame),
      partTwo: play(riggedGame),
    },
  };
};

export default run;
