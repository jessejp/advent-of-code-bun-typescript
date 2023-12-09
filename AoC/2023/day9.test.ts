import { BunFile } from "bun";
import { expect, test } from "bun:test";

const exampleFile = Bun.file("./AoC/2023/input/day9_example.txt");
const inputFile = Bun.file("./AoC/2023/input/day9.txt");

const getInputList = async (file: BunFile) => {
  return (await file.text()).split("\n").map((r) => {
    return r.split(" ").map((n) => Number(n));
  });
};

const calculateRowDifference = (row: number[]) => {
  let diff = [];
  let allAreZero = true;
  for (let i = 0; i < row.length - 1; i++) {
    const d = row[i + 1] - row[i];
    diff.push(d);
    if (d !== 0) allAreZero = false;
  }
  return {
    diff,
    allAreZero,
  };
};

const getDiffToZero = (row: number[]) => {
  const diffList: number[][] = [row];
  let differencesCalculated = false;
  while (!differencesCalculated) {
    const c = calculateRowDifference(diffList[diffList.length - 1]);
    diffList.push(c.diff);
    differencesCalculated = c.allAreZero;
  }
  return diffList;
};

const forecastNextValue = (diffList: number[][], forward: boolean = true) => {
  let lastSolved = null;

  for (let i = diffList.length - 2; i >= 0; i = i - 1) {
    lastSolved = forward
      ? (lastSolved || 0) + diffList[i][diffList[i].length - 1]
      : diffList[i][0] - (lastSolved || 0);
  }

  if (lastSolved === null) throw new Error("funked");

  return lastSolved;
};

const sumAllForecastedValues = (data: number[][], forward: boolean = true) => {
  let sum = 0;

  data.forEach((d) => {
    sum += forecastNextValue(getDiffToZero(d), forward);
  });

  return sum;
};

test("AoC 2023 day 9 answer part 1", async () => {
  const data = await getInputList(inputFile);
  // const diffs = getDiffToZero(data[1]);
  // console.log(diffs);
  // const forecast = forecastNextValue(diffs);
  // console.log(forecast);

  // const answer = sumAllForecastedValues(data);
  // console.log("part 1 answer=", answer);
  // answer = 2101499000
  
  const answer2 = sumAllForecastedValues(data, false);
  console.log("part 2 answer=", answer2);
  // attempt 1 =  748857786 (too high)
  // answer = 1089
});

// test("AoC 2023 day 9 example", async () => {
//   const data = await getInputList(exampleFile);

//   const diffsExample1 = getDiffToZero(data[0]);
//   const forecastExample1 = forecastNextValue(diffsExample1);
//   expect(forecastExample1).toBe(18);

//   const diffsExample2 = getDiffToZero(data[1]);
//   const forecastExample2 = forecastNextValue(diffsExample2);
//   expect(forecastExample2).toBe(28);

//   const diffsExample3 = getDiffToZero(data[2]);
//   const forecastExample3 = forecastNextValue(diffsExample3);
//   expect(forecastExample3).toBe(68);

//   const answerExample = sumAllForecastedValues(data);
//   expect(answerExample).toBe(114);
// });
