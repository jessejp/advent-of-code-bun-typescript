/* import { BunFile } from "bun";
import { expect, test } from "bun:test";

export const exampleFile = Bun.file("./AoC/2023/input/day1_example.txt");
export const exampleFile2 = Bun.file("./AoC/2023/input/day1_example_part2.txt");
export const inputFile = Bun.file("./AoC/2023/input/day1.txt");

const getInputList = async (file: BunFile) => {
  return (await file.text()).split("\n");
};

const data = await getInputList(inputFile);

const exampleDataPart1 = await getInputList(exampleFile);
const exampleDataPart2 = await getInputList(exampleFile2);

function isANumber(n: string) {
  return !Number.isNaN(parseInt(n));
}

const spelledOutDigits = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
] as const;

function transformSpelledDigit(input: string) {
  switch (input) {
    case "one":
      return "1";
    case "two":
      return "2";
    case "three":
      return "3";
    case "four":
      return "4";
    case "five":
      return "5";
    case "six":
      return "6";
    case "seven":
      return "7";
    case "eight":
      return "8";
    case "nine":
      return "9";
    default:
      return "";
  }
}

function isSpelledDigit(n: string, currentWord: string) {
  let isMatch = false;

  spelledOutDigits.forEach((spelledDigit) => {
    if (n === spelledDigit[currentWord.length]) {
      if (currentWord.length > 0) {
        for (let i = 0; i < currentWord.length; i++) {
          if (currentWord[i] === spelledDigit[i]) {
            // if on last currentWord index and its still a match = true
            if (i === currentWord.length - 1) {
              isMatch = true;
            }
            continue;
          } else {
            break;
          }
        }
      } else if (currentWord.length === 0 && n === spelledDigit[0]) {
        isMatch = true;
      }
    }
  });

  return isMatch;
}

function getRowDigit(row: string) {
  let digits: { digit: string; index: number }[] = [];
  let spelledDigit = "";

  for (let i = 0; i < row.length; i++) {
    if (isANumber(row[i])) {
      digits.push({ digit: row[i], index: i });
    } else {
      const testDigit = isSpelledDigit(row[i], spelledDigit);

      if (testDigit) {
        spelledDigit += row[i];
      }

      const findSpelledDigit = spelledOutDigits.find(
        (letters) => letters === spelledDigit
      );

      if (findSpelledDigit) {
        digits.push({
          digit: transformSpelledDigit(findSpelledDigit),
          index: i - findSpelledDigit.length,
        });
      }

      if (!testDigit) {
        // ternary fix to "eighthree" edgecase
        spelledDigit = isSpelledDigit(row[i - 1], "")
          ? `${row[i - 1]}${row[i]}`
          : row[i];
      }
    }
  }

  const sortedByIndex = digits.toSorted((a, b) => a.index - b.index);

  const { digit: firstDigit } = sortedByIndex[0];
  const { digit: lastDigit } = sortedByIndex[sortedByIndex.length - 1];

  return {
    firstDigit,
    lastDigit,
  };
}

function getCalibrationDigitsList(data: string[]) {
  const list: string[] = [];

  data.forEach((row) => {
    const solveDigits = getRowDigit(row);
    const combineDigits = `${solveDigits.firstDigit}${solveDigits.lastDigit}`;
    list.push(combineDigits);
  });

  return list;
}

function sumList(list: string[]) {
  let sum = 0;
  list.forEach((i) => {
    sum += parseInt(i);
  });
  return sum;
}

const testData = [
  "a2jgny5",
  "twofgsm5zsyurdf",
  "5rmhgmhooone",
  "oneoneoneone",
  "onemhfbhrx99",
  "sixninefivejpqgkcx3sixnine15",
  "jpxt9",
  "eighthree", // supposed to be 83 not 88..
  "sevenine", // supposed to be 79 not 77..
  "oneight",
];

test("edgecases testData summed to be 475", () => {
  expect(sumList(getCalibrationDigitsList(testData))).toBe(475);
});

test("calculates sum of first 3 indexes from calibration list to be 101", () => {
  const calibrateList = getCalibrationDigitsList(testData);
  expect(sumList(calibrateList.splice(0, 3))).toBe(101);
});

test("calculates sum of first 6 indexes from calibration list to be 196", () => {
  const calibrateList = getCalibrationDigitsList(testData);
  expect(sumList(calibrateList.splice(0, 6))).toBe(196);
});

test("part 2 example data calibration list summed = 281", () => {
  const calibrationList = getCalibrationDigitsList(exampleDataPart2);
  expect(sumList(calibrationList)).toBe(281);
});

test("part 2 example data first and last digit for 'two1nine' are 2 and 9", () => {
  const row = "two1nine";
  const digits = getRowDigit(row);

  expect(digits.firstDigit).toBe("2");
  expect(digits.lastDigit).toBe("9");
});

test("isSpelledDigit fn ret true for 's', false for 'x' if passed empty string", () => {
  let currentWord = "";
  expect(isSpelledDigit("s", currentWord)).toBe(true);
  expect(isSpelledDigit("x", currentWord)).toBe(false);
});

test("isSpelledDigit fn ret true for 'h' after 'eig', false for 'a'", () => {
  let currentWord = "eig";
  expect(isSpelledDigit("h", currentWord)).toBe(true);
  expect(isSpelledDigit("a", currentWord)).toBe(false);
});

test("isSpelledDigit fn ret true params: (w, t) | false: (r, t)", () => {
  let currentWord = "t";
  expect(isSpelledDigit("w", currentWord)).toBe(true);
  expect(isSpelledDigit("r", currentWord)).toBe(false);
});

test("isANumber returns false for letter, true for number strings", () => {
  expect(isANumber("a")).toBe(false);
  expect(isANumber("2")).toBe(true);
});

test("getRowDigit(asdf4gh6hj) returns {4, 6}", () => {
  const digits = getRowDigit("asdf4gh6hj");
  expect(digits.firstDigit).toBe("4");
  expect(digits.lastDigit).toBe("6");
});

test("when string contains only one digit, lastdigit = firstdigit", () => {
  const digits = getRowDigit("treb7uchet");
  expect(digits.firstDigit).toBe("7");
  expect(digits.lastDigit).toBe("7");
  expect(digits.firstDigit === digits.lastDigit).toBe(true);
});

test("example data four digits are 12, 38, 15, 77", () => {
  const calibrationList = getCalibrationDigitsList(exampleDataPart1);
  expect(calibrationList[0]).toBe("12");
  expect(calibrationList[1]).toBe("38");
  expect(calibrationList[2]).toBe("15");
  expect(calibrationList[3]).toBe("77");
});

test("example data sum is 142", () => {
  const calibrationList = getCalibrationDigitsList(exampleDataPart1);
  expect(sumList(calibrationList)).toBe(142);
});

test("answer for 2023/day 1", () => {
  const calibrationList = getCalibrationDigitsList(data);
  const summedList = sumList(calibrationList);
  console.log("answer =", summedList);
  expect(summedList).toBe(53515);
});
 */