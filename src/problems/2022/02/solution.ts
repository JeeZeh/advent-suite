import _ from "lodash";
import { SolutionRunner } from "../../../lib/types";

type HandValue = 1 | 2 | 3;
type Strategy<T extends string> = { [key in T]: HandValue };
type OpponentStrategy = Strategy<"A" | "B" | "C">;
type PlayerStrategy = Strategy<"X" | "Y" | "Z">;
type Turn = [HandValue, HandValue];

const opponentStrategy: OpponentStrategy = { A: 1, B: 2, C: 3 };
const honestStrategy: PlayerStrategy = { X: 1, Y: 2, Z: 3 };

// If you are RHS, you lose if your opponent is LHS
const RhsLose: { [key in HandValue]: HandValue } = { 1: 3, 2: 1, 3: 2 };
// If you are RHS, you win if your opponent is LHS
const RhsWin: { [key in HandValue]: HandValue } = { 1: 2, 2: 3, 3: 1 };

const play = (game: Turn[]): string => {
  let player: number = 0;
  for (const [oHand, pHand] of game) {
    if (pHand === RhsWin[oHand]) {
      player += 6;
    } else if (pHand === oHand) {
      player += 3;
    }
    player += pHand;
  }
  return `${player}`;
};

const determineRiggedRhsValue = (
  opponentHand: keyof OpponentStrategy,
  instruction: keyof PlayerStrategy
): Turn => {
  const opponent = opponentStrategy[opponentHand];
  switch (instruction) {
    // Lose
    case "X":
      return [opponent, RhsLose[opponent]];
    // Draw
    case "Y":
      return [opponent, opponent];
    // Win
    default:
      return [opponent, RhsWin[opponent]];
  }
};

const run: SolutionRunner = async (input) => {
  if (!input) throw Error("Invalid input");

  const lines = input.split("\n").map((t) => t.split(" "));
  const realGame = lines.map(
    ([l, r]) =>
      [
        opponentStrategy[l as keyof OpponentStrategy],
        honestStrategy[r as keyof PlayerStrategy],
      ] as Turn
  );

  const riggedGame = lines.map(([l, r]) =>
    determineRiggedRhsValue(
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
