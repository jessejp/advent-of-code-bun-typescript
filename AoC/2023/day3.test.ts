import { BunFile } from "bun";
import { expect, test } from "bun:test";

const exampleFile = Bun.file("./AoC/2023/input/day3_example.txt");
const inputFile = Bun.file("./AoC/2023/input/day3.txt");

const getInputList = async (file: BunFile) => {
  return (await file.text()).split("\n");
};

const notNumberOrDotRegex: RegExp = /[^.0-9]/;
const numberRegex: RegExp = /[0-9]/;

type enginePart = {
  value: string;
  start: number;
  end: number;
  listIndex: number;
  relevant: boolean;
};

function getEnginePartsOfRow(row: string, listIndex: number): enginePart[] {
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
      (!numberRegex.test(currentRow[i]) && !!value) ||
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
    if (!numberRegex.test(currentRow[i])) {
      value = "";
      start = -1;
      continue;
    }

    start = !value ? i : start;
    value = value + currentRow[i];
  }

  return rowEngineParts;
}

function getEnginePartList(list: string[]): enginePart[] {
  const engineParts: enginePart[] = [];

  for (let i = 0; i < list.length; i++) {
    const currentRow = list[i];
    if (!numberRegex.test(currentRow)) continue;

    const rowEngineParts = getEnginePartsOfRow(currentRow, i);
    rowEngineParts.forEach((ep) => {
      ep.relevant = solveRelevancy(
        ep.start,
        ep.end,
        list.slice(ep.listIndex === 0 ? 0 : ep.listIndex - 1, ep.listIndex + 2)
      );
      engineParts.push(ep);
    });
  }

  return engineParts;
}

function solveRelevancy(
  start: number,
  end: number,
  listSnippet: string[]
): boolean {
  let block = "";

  //   console.log(" ");
  listSnippet.forEach((row) => {
    const startOffset = Math.max(0, start - 1);
    const area = row.slice(startOffset, end + 2);
    block += area;
    // console.log(area);
  });

  //   console.log("symbol in block?", notNumberOrDotRegex.test(block));

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
  const enginePartsList = getEnginePartList(rawList);
  const answerPart1 = getAnswerSum(
    enginePartsList.filter((f) => f.relevant === true)
  );
  console.log("2023 aoc day 3 part 1 answer = ", answerPart1);
  // answer 1 = 559667
});

test("day 3 example", async () => {
  const testList = await getInputList(exampleFile);
  const enginePartsList = getEnginePartList(testList);

  //   console.log(enginePartsList);

  const sum = getAnswerSum(enginePartsList.filter((f) => f.relevant === true));

  expect(sum).toBe(4361);
});
