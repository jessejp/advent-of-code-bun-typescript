import { BunFile } from "bun";
import { expect, test } from "bun:test";

const exampleFile = Bun.file("./AoC/2023/input/day2_example.txt");
const inputFile = Bun.file("./AoC/2023/input/day2.txt");

const getInputList = async (file: BunFile) => {
  const listInput = (await file.text()).split("\n");

  const gamesList = listInput.map((game) => {
    const gameList = game.split(": ").splice(1, 2);
    return gameList[0].split(";");
  });

  return gamesList;
};

type GameCubesTotal = {
  r: number;
  g: number;
  b: number;
};

const gamesListExample = getInputList(exampleFile);
const gamesList = getInputList(inputFile);

function countGameCubes(revealedCubeSets: string[]): GameCubesTotal {
  let r = 0;
  let g = 0;
  let b = 0;

  revealedCubeSets.forEach((set) => {
    const splittedSet = set.split(" ");
    const red = splittedSet.findIndex((i) => i.includes("red")) - 1;
    const green = splittedSet.findIndex((i) => i.includes("green")) - 1;
    const blue = splittedSet.findIndex((i) => i.includes("blue")) - 1;

    r = r + (red > -1 ? parseInt(splittedSet[red]) : 0);
    g = g + (green > -1 ? parseInt(splittedSet[green]) : 0);
    b = b + (blue > -1 ? parseInt(splittedSet[blue]) : 0);
  });

  return {
    r,
    g,
    b,
  };
}

function listTotalCubesPerGame(games: string[][]) {
  const totalCubesPerGame: GameCubesTotal[] = [];
  games.forEach((game) => {
    const count = countGameCubes(game);
    totalCubesPerGame.push(count);
  });

  return totalCubesPerGame;
}

function listPossibleGamesIDs(
  games: GameCubesTotal[],
  cubeLimits: GameCubesTotal
) {
  const listIDs: number[] = [];

  games.forEach((game, index) => {
    if (
      game.r < cubeLimits.r &&
      game.g < cubeLimits.g &&
      game.b < cubeLimits.b
    ) {
      listIDs.push(index + 1);
    }
  });
  return listIDs;
}

function sumList(list: number[]) {
  let sum = 0;
  list.forEach((i) => {
    sum += i;
  });
  return sum;
}

test("2023/day2 part 1 answer", async () => {
  const games = await gamesList;
  expect(games.length).toBe(100);

  const count = listTotalCubesPerGame(games);
  expect(count[1].r).toBe(7);
  expect(count[1].g).toBe(31);
  expect(count[1].b).toBe(35);

  expect(count[78].r).toBe(2);
  expect(count[78].g).toBe(17);
  expect(count[78].b).toBe(6);

  expect(count[44].r).toBe(1);
  expect(count[44].g).toBe(4);
  expect(count[44].b).toBe(5);

  const IDs = listPossibleGamesIDs(count, {
    r: 12,
    g: 13,
    b: 14,
  });
  console.log(IDs);

  const summed = sumList(IDs);
  console.log("answer = ", summed);
  // part 1 answer attempt 1 = 200 (too low)
});

test("2023/day2 part1 example test answer", async () => {
  const count = listTotalCubesPerGame(await gamesListExample);
  const IDs = listPossibleGamesIDs(count, {
    r: 12,
    g: 13,
    b: 14,
  });

  expect(IDs[0]).toBe(1);
  expect(IDs[1]).toBe(2);
  expect(IDs[2]).toBe(5);

  const summed = sumList(IDs);

  expect(summed).toBe(8);
});

test("test 3b,4r|1r,2g,6b|12g return {r:5, g:4, b:9}", () => {
  const testCubeSet = ["3 blue, 4 red", " 1 red, 2 green, 6 blue", " 12 green"];
  const count = countGameCubes(testCubeSet);
  expect(count.r).toBe(5);
  expect(count.g).toBe(14);
  expect(count.b).toBe(9);
});
