function partOne(measurements: number[]): number {
  let count = 0;
  let last = measurements[0];
  for (const num of measurements.slice(1)) {
    if (num > last) {
      count++;
    }
    last = num;
  }

  return count;
}

function partTwo(measurements: number[]): number {
  let count = 0;
  let last = measurements.slice(0, 3).reduce((a, b) => a + b, 0);

  for (let i = 0; i < measurements.length - 2; i++) {
    let sum = measurements.slice(i, i + 3).reduce((a, b) => a + b, 0);
    if (sum > last) {
      count++;
    }
    last = sum;
  }

  return count;
}

export default async function solution(input?: string): Promise<string[]> {
  if (!input) throw Error("Invalid input");

  const measurements: number[] = input.split("\n").map((l) => parseInt(l));
  return [`${partOne(measurements)}`, `${partTwo(measurements)}`];
}
