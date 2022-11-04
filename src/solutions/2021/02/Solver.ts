function partOne(commands: Input[]): number {
  let x = 0;
  let y = 0;

  for (const [dir, amt] of commands) {
    if (dir === Direction.Forward) {
      x += amt;
    } else if (dir === Direction.Down) {
      y += amt;
    } else {
      y -= amt;
    }
  }

  return x * y;
}

function partTwo(commands: Input[]): number {
  let x = 0;
  let y = 0;
  let aim = 0;

  for (const [dir, amt] of commands) {
    if (dir === Direction.Forward) {
      x += amt;
      y += aim * amt;
    } else if (dir === Direction.Down) {
      aim += amt;
    } else {
      aim -= amt;
    }
  }

  return x * y;
}

enum Direction {
  Up,
  Down,
  Forward,
}

type Input = [Direction, number];

function parseLine(line: string): Input {
  const [_dir, _amt] = line.split(" ");

  const dir =
    _dir === "up"
      ? Direction.Up
      : _dir === "down"
      ? Direction.Down
      : Direction.Forward;

  return [dir, parseInt(_amt)];
}

export default async function solution(input?: string): Promise<string[]> {
  if (!input) throw Error("Invalid input");

  const measurements: Input[] = input.split("\n").map((l) => parseLine(l));

  return [`${partOne(measurements)}`, `${partTwo(measurements)}`];
}
