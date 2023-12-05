// import { BunFile } from "bun";
// import { expect, test } from "bun:test";

// const exampleFile = Bun.file("./AoC/2023/input/day4_example.txt");
// const inputFile = Bun.file("./AoC/2023/input/day4.txt");

// type ScratchCardNumbers = {
//   winNumbers: string[];
//   cardNumbers: string[];
// };

// interface ScratchCard extends ScratchCardNumbers {
//   id: string;
// }

// const getInputList = async (file: BunFile): Promise<ScratchCard[]> => {
//   const splitFile = (await file.text()).split("\n");
//   return splitFile.map((row) => {
//     const splitRow = row.split(":");
//     const scratchCard = splitRow[1]
//       .split("|")
//       .map((n) => n.split(" ").filter((f) => !!f));

//     return {
//       id: splitRow[0].split(" ")[1] || "error",
//       winNumbers: scratchCard[0] || "error",
//       cardNumbers: scratchCard[1] || "error",
//     };
//   });
// };

// function getMatchingNumbers({ winNumbers, cardNumbers }: ScratchCardNumbers) {
//   const winList = winNumbers.filter(
//     (n) => n === cardNumbers.find((c) => c === n)
//   );
//   let points = winList.length ? 1 : 0;
//   for (let i = 1; i <= winList.length; i++) {
//     points *= i === 1 ? 1 : 2;
//   }
//   return points;
// }

// function calcPointsTotal(points: number[]) {
//   let sum = 0;
//   points
//     .filter((p) => p > 0)
//     .forEach((p) => {
//       sum += p;
//     });
//   return sum;
// }

// test("AoC 2023 day 4 answer", async () => {
//   const data = await getInputList(inputFile);
//   const points = data.map((d) => {
//     const { winNumbers, cardNumbers } = d;
//     const wins = getMatchingNumbers({ winNumbers, cardNumbers });
//     return wins;
//   });
//   const calcPoints = calcPointsTotal(points);
//   console.log("answer part 1 =", calcPoints);
// });

// test("AoC 2023 day 4 example part 1", async () => {
//   const exampleData = await getInputList(exampleFile);
//   //   console.log(exampleData);

//   const points = exampleData.map((d) => {
//     const { winNumbers, cardNumbers } = d;
//     const wins = getMatchingNumbers({ winNumbers, cardNumbers });
//     return wins;
//   });
//   expect(calcPointsTotal(points)).toBe(13);
// });
