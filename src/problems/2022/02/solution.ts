import _ from "lodash";
import { SolutionRunner } from "../../../lib/types";

type HandValue = 1 | 2 | 3;

type OpponentStrategyKey = "A" | "B" | "C";
type PlayerStrategyKey = "X" | "Y" | "Z";

type Strategy = { [key in OpponentStrategyKey & PlayerStrategyKey]: number };

const opponentStrategy: Strategy = {
  A: 1,
  B: 2,
  C: 3,
};

const playerStrategy: Strategy = {
  X: 1,
  Y: 2,
  Z: 3,
};

const Rules: { [key in HandValue]: HandValue } = {
  1: 3,
  2: 1,
  3: 2,
};

type Turn = [HandValue, HandValue];

const play = (game: Turn[]): string => {
  let player: number = 0;
  let opponent: number = 0;

  for (const [oHand, pHand] of game) {
    if (Rules[pHand] === oHand) {
      player += 6;
    } else if (Rules[oHand] === pHand) {
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

const run: SolutionRunner = async (input) => {
  if (!input) throw Error("Invalid input");

  const game: Turn[] = input
    .split("\n")
    .map((t) => t.split(" "))
    .map(
      ([l, r]) =>
        [
          opponentStrategy[l as OpponentStrategyKey],
          playerStrategy[r as PlayerStrategyKey],
        ] as Turn
    );

  return {
    answer: {
      partOne: play(game),
    },
  };
};

export default run;
