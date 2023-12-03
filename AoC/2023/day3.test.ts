import { BunFile } from "bun";
import { expect, test } from "bun:test";

const exampleFile = Bun.file("./AoC/2023/input/day3_example.txt");
const redditExampleFile = Bun.file("./AoC/2023/input/day3_reddit_example.txt");
const inputFile = Bun.file("./AoC/2023/input/day3.txt");

const getInputList = async (file: BunFile) => {
  return (await file.text()).split("\n");
};

const notNumberOrDotRegex: RegExp = /[^.0-9]/;
const numberRegex: RegExp = /[0-9]/;
const gearRegex: RegExp = /[*]/;

type enginePart = {
  value: string;
  start: number;
  end: number;
  listIndex: number;
  relevant: boolean;
};

function getEnginePartsOfRow(
  row: string,
  listIndex: number,
  regex: RegExp
): enginePart[] {
  // solve one string
  const currentRow = row;
  let { value, start }: enginePart = {
    value: "",
    start: -1,
    end: -1,
    relevant: false,
    listIndex,
  };

  const rowEngineParts: enginePart[] = [];

  // get engine part number
  for (let i = 0; i <= currentRow.length; i++) {
    if (
      (!regex.test(currentRow[i]) && !!value) ||
      (i === currentRow.length && !!value)
    ) {
      rowEngineParts.push({
        value: value,
        start: start,
        end: i - 1,
        relevant: false,
        listIndex,
      });
    }

    // reset and skip
    if (!regex.test(currentRow[i])) {
      value = "";
      start = -1;
      continue;
    }

    start = !value ? i : start;
    value = value + currentRow[i];
  }

  return rowEngineParts;
}

function getEnginePartList(
  list: string[],
  regex: RegExp,
  isGearRatio: boolean = false
): enginePart[] {
  const engineParts: enginePart[] = [];

  for (let i = 0; i < list.length; i++) {
    const currentRow = list[i];
    if (!regex.test(currentRow)) continue;

    const rowEngineParts = getEnginePartsOfRow(currentRow, i, regex);
    rowEngineParts.forEach((ep) => {
      ep.relevant = solveRelevancy(
        ep.start,
        ep.end,
        list.slice(ep.listIndex === 0 ? 0 : ep.listIndex - 1, ep.listIndex + 2),
        isGearRatio
      );
      engineParts.push(ep);
    });
  }

  return engineParts;
}

function solveRelevancy(
  start: number,
  end: number,
  listSnippet: string[],
  isGearRatio: boolean = false
): boolean {
  const offset = {
    start: start - 1,
    end: end + 2,
  };
  let block = "";
  const nonClippingStartOffset = Math.max(0, offset.start);
  listSnippet.forEach((row) => {
    const area = row.slice(nonClippingStartOffset, offset.end);
    block += area;
    // console.log(area);
  });
  //   console.log("symbol in block?", notNumberOrDotRegex.test(block));

  return isGearRatio ? gearRegex.test(block) : notNumberOrDotRegex.test(block);
}

function getPart1AnswerSum(list: enginePart[]) {
  let sum = 0;
  list.forEach((e) => {
    sum += parseInt(e.value);
  });
  return sum;
}

function getPart2AnswerSum(list: number[]) {
  let sum = 0;
  list.forEach((e) => {
    sum += e;
  });
  return sum;
}

function getGearRatioList(gearParts: enginePart[], engineParts: enginePart[]) {
  const gearRatios: number[] = [];

  gearParts.forEach((gear) => {
    let firstPart: enginePart | undefined = undefined;
    let secondPart: enginePart | undefined = undefined;

    function matchingRules(gear: enginePart, part: enginePart): boolean {
      const diagonalMatchAbove =
        part.listIndex === gear.listIndex - 1 &&
        (part.end === gear.start - 1 || part.start === gear.end + 1);
      const diagonalMatchBelow =
        part.listIndex === gear.listIndex + 1 &&
        (part.end === gear.start - 1 || part.start === gear.end + 1);
      const horizontalMatch =
        part.listIndex === gear.listIndex &&
        (part.end === gear.start - 1 || part.start === gear.end + 1);
      const verticalMatch =
        (part.listIndex === gear.listIndex - 1 &&
          (part.end === gear.start ||
            part.start === gear.start ||
            (part.start <= gear.start && part.end >= gear.end))) ||
        (part.listIndex === gear.listIndex + 1 &&
          (part.end === gear.start ||
            part.start === gear.start ||
            (part.start <= gear.start && part.end >= gear.end)));

      return (
        diagonalMatchAbove ||
        diagonalMatchBelow ||
        horizontalMatch ||
        verticalMatch
      );
    }

    const createPartId = (part: enginePart) => {
      return `${part.start}${part.end}${part.listIndex}${part.value}`;
    };

    firstPart = engineParts.find((part) => matchingRules(gear, part));

    if (firstPart === undefined) return;

    const firstPartID = createPartId(firstPart);

    secondPart = engineParts.find(
      (part) => matchingRules(gear, part) && firstPartID !== createPartId(part)
    );

    if (secondPart === undefined) return;

    // console.log("first part", firstPart);
    // console.log("second part", secondPart);
    // console.log(
    //   "multiplied to: ",
    //   parseInt(firstPart.value) * parseInt(secondPart.value)
    // );
    // console.log(" ");

    gearRatios.push(parseInt(firstPart.value) * parseInt(secondPart.value));
  });
  return gearRatios;
}

test("day 3 answer", async () => {
  const rawList = await getInputList(inputFile);
  const enginePartsList = getEnginePartList(rawList, numberRegex);
  const filteredRelevantEngineParts = enginePartsList.filter(
    (f) => f.relevant === true
  );
  const answerPart1 = getPart1AnswerSum(filteredRelevantEngineParts);
  console.log("2023 aoc day 3 part 1 answer = ", answerPart1);
  // answer 1 = 559667

  const enginePartsNearGearList = getEnginePartList(rawList, numberRegex, true);
  const gearPartsList = getEnginePartList(rawList, gearRegex);

  const gearRatioList = getGearRatioList(
    gearPartsList,
    enginePartsNearGearList
  );

  const answerPart2 = getPart2AnswerSum(gearRatioList);

  console.log("2023 aoc day 3 part 2 answer = ", answerPart2);
  // attempt 1 = 59 356 781 (too low)
  // attempt 2 = 62 309 374 (too low)
  // attempt 3 = 74 494 197 (too low)
  // correct answer = 86 841 457 
});

/* test("day 3 example", async () => {
  const testList = await getInputList(exampleFile);
  const enginePartsList = getEnginePartList(testList, numberRegex);

  //   console.log(enginePartsList);

  const relevantEngineParts = enginePartsList.filter(
    (f) => f.relevant === true
  );

  const sum = getPart1AnswerSum(relevantEngineParts);
  expect(sum).toBe(4361); // part 1

  const gearPartsList = getEnginePartList(testList, gearRegex);
  const gearRatios = getGearRatioList(gearPartsList, relevantEngineParts);
  expect(getPart2AnswerSum(gearRatios)).toBe(467835);
}); */

test("day 3 reddit example data set", async () => {
  const redditSample = await getInputList(redditExampleFile);

  const getAllEnginePartsNextToSymbols = getEnginePartList(
    redditSample,
    numberRegex
  );

  const relevantEngineParts = getAllEnginePartsNextToSymbols.filter(
    (f) => f.relevant === true
  );
  expect(getPart1AnswerSum(relevantEngineParts)).toBe(925);

  const gearParts = getEnginePartList(redditSample, gearRegex, true);

  const gearRatio = getGearRatioList(gearParts, relevantEngineParts);
  console.log(gearRatio);

  expect(getPart2AnswerSum(gearRatio)).toBe(6756);
});
