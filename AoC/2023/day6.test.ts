import { BunFile } from "bun";
import { expect, test } from "bun:test";

const exampleFile = Bun.file("./AoC/2023/input/day6_example.txt");
const inputFile = Bun.file("./AoC/2023/input/day6.txt");

type raceHighscore = {
  time: number;
  distance: number;
};

const getInputList = async (file: BunFile) => {
  const raceHighscoreList: raceHighscore[] = [];
  const fileAsText = await file.text();
  const raceHighscoreColumn = fileAsText
    .split("\n")
    .map((row) => row.split(" ").filter((f) => !!f));

  if (!raceHighscoreColumn.length) return;

  raceHighscoreColumn[0].slice(1).forEach((row, index) => {
    raceHighscoreList.push({
      time: Number(row),
      //offset index by 1 due to slice
      distance: Number(raceHighscoreColumn[1][index + 1]),
    });
  });
  return raceHighscoreList;
};

const getPart2InputList = async (file: BunFile): Promise<raceHighscore> => {
  const fileAsText = await file.text();
  const raceHighscoreColumn = fileAsText.split("\n").map((row) =>
    row
      .split(" ")
      .filter((f) => !!f)
      .slice(1)
  );

  const time = raceHighscoreColumn[0].join("");
  const distance = raceHighscoreColumn[1].join("");

  return {
    time: Number(time),
    distance: Number(distance),
  };
};

const getRecordSettingButtonPressTime = (raceRecord: raceHighscore) => {
  const { distance: prevRecord, time: raceTime } = raceRecord;
  let sumOfRecordBeatingButtonPressTimes = 0;

  for (let i = 1; i < raceTime; i++) {
    const travelDistance = i * (raceTime - i);
    if (travelDistance > prevRecord) sumOfRecordBeatingButtonPressTimes++;
  }
  return sumOfRecordBeatingButtonPressTimes;
};

const multiplyListTogether = (list: number[]) => {
  let sum = list[0];

  list.slice(1, list.length).forEach((w) => (sum *= w));

  return sum;
};
test("Aoc 2023 day 6 Part 2 answer", async () => {
  const data = await getPart2InputList(inputFile);
  const waysToBeatHighscore = getRecordSettingButtonPressTime(data);
  console.log("Part 2 answer=", waysToBeatHighscore);
});

// test("Aoc 2023 day 6 Part 2 example", async () => {
//   const data = await getPart2InputList(exampleFile);
//   const waysToBeatHighscore = getRecordSettingButtonPressTime(data);
//   expect(waysToBeatHighscore).toBe(71503);
// });

// test("AoC 2023 day 6 Part 1 answer", async () => {
//   const data = await getInputList(inputFile);
//   const waysToBeatHighscore: number[] = [];
//   data?.forEach((race) => {
//     waysToBeatHighscore.push(getRecordSettingButtonPressTime(race));
//   });
//   console.log("part 1 answer = ", multiplyListTogether(waysToBeatHighscore));
// });

// test("AoC 2023 day 6 example", async () => {
//   const data = await getInputList(exampleFile);
//   const waysToBeatHighscore: number[] = [];
//   data?.forEach((race) => {
//     waysToBeatHighscore.push(getRecordSettingButtonPressTime(race));
//   });
//   expect(multiplyListTogether(waysToBeatHighscore)).toBe(288);
// });
