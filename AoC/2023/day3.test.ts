import { BunFile } from "bun";
import { expect, test } from "bun:test";

const exampleFile = Bun.file("./AoC/2023/input/day3_example.txt");
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
  isGearRatio: boolean
): boolean {
  const offset = {
    start: isGearRatio ? start - 3 : start - 1,
    end: isGearRatio ? end + 4 : end + 2,
  };
  let block = "";
  const nonClippingStartOffset = Math.max(0, offset.start);

  console.log(" ");
  listSnippet.forEach((row) => {
    const area = row.slice(nonClippingStartOffset, offset.end);
    block += area;
    console.log(area);
  });

  console.log("symbol in block?", notNumberOrDotRegex.test(block));

  return notNumberOrDotRegex.test(block);
}

function getAnswerSum(list: enginePart[]) {
  let sum = 0;
  list.forEach((e) => {
    sum += parseInt(e.value);
  });
  return sum;
}

test("day 3 part 1 answer", async () => {
  const rawList = await getInputList(inputFile);
  const enginePartsList = getEnginePartList(rawList, numberRegex);

  const answerPart1 = getAnswerSum(
    enginePartsList.filter((f) => f.relevant === true)
  );
  console.log("2023 aoc day 3 part 1 answer = ", answerPart1);
  // answer 1 = 559667
});

test("day 3 example", async () => {
  const testList = await getInputList(exampleFile);
  /*   const enginePartsList = getEnginePartList(testList, numberRegex);

  //   console.log(enginePartsList);

  const relevantEngineParts = enginePartsList.filter(
    (f) => f.relevant === true
  );

  const sum = getAnswerSum(relevantEngineParts);

  expect(sum).toBe(4361); // part 1
 */
  const gearPartsList = getEnginePartList(testList, gearRegex, true);
  console.log(gearPartsList);
});
