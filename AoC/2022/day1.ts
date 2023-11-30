import type { BunFile } from "bun";

export const AoC_2022_day1_example = Bun.file(
  "./AoC/2022/input/day1_example.txt"
);

export const AoC_2022_day1_input = Bun.file("./AoC/2022/input/day1.txt");

export async function getData(file: BunFile) {
  return (await file.text()).split("\n");
}

export function getElfCalorieList(input: string[]) {
  const elfCaloriesSum: number[] = [];
  let currentElfCalories = 0;

  input.forEach((c, index) => {
    if (c !== "") {
      currentElfCalories = currentElfCalories + parseInt(c);
    }

    if (c === "" || index === input.length - 1) {
      elfCaloriesSum.push(currentElfCalories);
      currentElfCalories = 0;
    }
  });

  return elfCaloriesSum;
}

export async function Answer1() {
  const data = await getData(AoC_2022_day1_input);
  const elves = getElfCalorieList(data);
  let mostCalories = 0;

  elves.forEach((e) => {
    if (e > mostCalories) {
      mostCalories = e;
    }
  });

  return mostCalories;
}

// answer 1 = 72240

export async function Answer2() {
  const data = await getData(AoC_2022_day1_input);
  const elves = getElfCalorieList(data);

  const orderedElves = elves.toSorted((a, b) => b - a);

  return orderedElves[0] + orderedElves[1] + orderedElves[2];
}

// answer 2 = 210957
