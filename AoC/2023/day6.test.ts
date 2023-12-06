import { BunFile } from "bun";
import { expect, test } from "bun:test";

const exampleFile = Bun.file("./AoC/2023/input/day6_example.txt");
const inputFile = Bun.file("./AoC/2023/input/day6.txt");

type raceHighscore = {
  id: number;
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

  raceHighscoreColumn[0]
    .slice(1)
    .forEach((row, index) => {
      raceHighscoreList.push({
        id: index,
        time: Number(row),
        //offset index by 1 due to slice
        distance: Number(raceHighscoreColumn[1][index + 1]),
      });
    });
  return raceHighscoreList;
};

// const getPart2InputList = async (file: BunFile) => {
//     const raceHighscoreList: raceHighscore[] = [];
//     const fileAsText = await file.text();
//     const raceHighscoreColumn = fileAsText
//       .split("\n")
//       .map((row) => row.split(" ").filter((f) => !!f).slice(1));
  
//     if (!raceHighscoreColumn.length) return;
  
//     raceHighscoreColumn[0]
//       .slice(1)
//       .forEach((row, index) => {
//         raceHighscoreList.push({
//           id: index,
//           time: Number(row),
//           //offset index by 1 due to slice
//           distance: Number(raceHighscoreColumn[1][index + 1]),
//         });
//       });
//     return raceHighscoreList;
//   };

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

test("AoC 2023 day 6 answer", async () => {
  const data = await getInputList(inputFile);
  console.log(data);

  const waysToBeatHighscore: number[] = [];

  data?.forEach((race) => {
    waysToBeatHighscore.push(getRecordSettingButtonPressTime(race));
  });

  console.log(waysToBeatHighscore);

  console.log("answer = ", multiplyListTogether(waysToBeatHighscore));
});

test("AoC 2023 day 6 example", async () => {
  const data = await getInputList(exampleFile);

  const waysToBeatHighscore: number[] = [];

  data?.forEach((race) => {
    waysToBeatHighscore.push(getRecordSettingButtonPressTime(race));
  });

  expect(multiplyListTogether(waysToBeatHighscore)).toBe(288);
});
