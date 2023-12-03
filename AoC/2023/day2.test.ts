/* import { BunFile } from "bun";
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

type GameCubesTotalWithRules = GameCubesTotal & {
  exceededLimits: boolean;
  minRequiredCubes: GameCubesTotal;
};

const gamesListExample = getInputList(exampleFile);
const gamesList = getInputList(inputFile);

function countGameCubes(
  revealedCubeSets: string[],
  cubeLimits: GameCubesTotal
): GameCubesTotalWithRules {
  let r = 0;
  let g = 0;
  let b = 0;
  let exceededLimits = false;
  let currentHighest = { r: 0, g: 0, b: 0 };

  revealedCubeSets.forEach((set) => {
    const splittedSet = set.split(" ");
    const redIdx = splittedSet.findIndex((i) => i.includes("red")) - 1;
    const greenIdx = splittedSet.findIndex((i) => i.includes("green")) - 1;
    const blueIdx = splittedSet.findIndex((i) => i.includes("blue")) - 1;

    const setRed = redIdx > -1 ? parseInt(splittedSet[redIdx]) : 0;
    const setGreen = greenIdx > -1 ? parseInt(splittedSet[greenIdx]) : 0;
    const setBlue = blueIdx > -1 ? parseInt(splittedSet[blueIdx]) : 0;

    currentHighest = highestValue(currentHighest, {
      r: setRed,
      g: setGreen,
      b: setBlue,
    });

    if (
      setRed > cubeLimits.r ||
      setGreen > cubeLimits.g ||
      setBlue > cubeLimits.b
    ) {
      exceededLimits = true;
    }

    r = r + setRed;
    g = g + setGreen;
    b = b + setBlue;
  });

  return {
    r,
    g,
    b,
    exceededLimits,
    minRequiredCubes: currentHighest,
  };
}

function highestValue(
  currentHighest: GameCubesTotal,
  newComparison: GameCubesTotal
) {
  let highestValue = currentHighest;

  if (highestValue.r < newComparison.r) {
    highestValue.r = newComparison.r;
  }

  if (highestValue.g < newComparison.g) {
    highestValue.g = newComparison.g;
  }

  if (highestValue.b < newComparison.b) {
    highestValue.b = newComparison.b;
  }

  return {
    ...highestValue,
  };
}

function listTotalCubesPerGame(games: string[][], cubeLimits: GameCubesTotal) {
  const totalCubesPerGame: GameCubesTotalWithRules[] = [];

  games.forEach((game) => {
    const count = countGameCubes(game, cubeLimits);
    totalCubesPerGame.push(count);
  });

  return totalCubesPerGame;
}

function listPossibleGamesIDs(games: GameCubesTotalWithRules[]) {
  const listIDs: number[] = [];

  games.forEach((game, index) => {
    if (!game.exceededLimits) {
      listIDs.push(index + 1);
    }
  });
  return listIDs;
}

function getPowerList(games: GameCubesTotalWithRules[]) {
  const powerList: number[] = [];

  games.forEach((game) => {
    const { r, g, b } = game.minRequiredCubes;
    powerList.push(r * g * b);
  });

  return powerList;
}

function sumList(list: number[]) {
  let sum = 0;
  list.forEach((i) => {
    sum += i;
  });
  return sum;
}

test("2023/day 2 part 2 answer", async () => {
  const games = await gamesList;
  expect(games.length).toBe(100);

  const count = listTotalCubesPerGame(games, {
    r: 12,
    g: 13,
    b: 14,
  });
  const powerList = getPowerList(count);
  const powerSum = sumList(powerList);

  console.log("answer part 2 = ", powerSum);
});

test("2023/day2 part 1 answer", async () => {
  const games = await gamesList;
  expect(games.length).toBe(100);

  const count = listTotalCubesPerGame(games, {
    r: 12,
    g: 13,
    b: 14,
  });
  expect(count[1].r).toBe(7);
  expect(count[1].g).toBe(31);
  expect(count[1].b).toBe(35);

  expect(count[78].r).toBe(2);
  expect(count[78].g).toBe(17);
  expect(count[78].b).toBe(6);

  expect(count[44].r).toBe(1);
  expect(count[44].g).toBe(4);
  expect(count[44].b).toBe(5);

  const IDs = listPossibleGamesIDs(count);
  //   console.log(IDs);

  const summed = sumList(IDs);
  console.log("answer part 1 = ", summed);
  // part 1 answer attempt 1 = 200 (too low)
  // game rule problem: one set cant exceed game limit!
  // part 1 answer attempt 2 = 2237 (correct)
});

test("2023/day2 part2 example test answer, sum = 2286", async () => {
  const games = await gamesListExample;
  const count = listTotalCubesPerGame(games, {
    r: 12,
    g: 13,
    b: 14,
  });

  expect(count[0].minRequiredCubes.r).toBe(4);
  expect(count[3].minRequiredCubes.r).toBe(14);

  const powerList = getPowerList(count);
  expect(sumList(powerList)).toBe(2286);
});

test("2023/day2 part1 example test answer", async () => {
  const games = await gamesListExample;
  const count = listTotalCubesPerGame(games, {
    r: 12,
    g: 13,
    b: 14,
  });

  const IDs = listPossibleGamesIDs(count);

  expect(IDs[0]).toBe(1);
  expect(IDs[1]).toBe(2);
  expect(IDs[2]).toBe(5);

  const summed = sumList(IDs);

  expect(summed).toBe(8);
});

test("test 3b,4r|1r,2g,6b|12g return {r:5, g:4, b:9}", () => {
  const testCubeSet = ["3 blue, 4 red", " 1 red, 2 green, 6 blue", " 12 green"];
  const count = countGameCubes(testCubeSet, { r: 0, g: 0, b: 0 });
  expect(count.r).toBe(5);
  expect(count.g).toBe(14);
  expect(count.b).toBe(9);
});
 */