import { expect, test } from "bun:test";
import { AoC_2022_day1_example, getData, getElfCalorieList } from "./day1";

test("test the five example elves", async () => {
  const data = await getData(AoC_2022_day1_example);
  const elfCalories = getElfCalorieList(data);
  expect(elfCalories[0]).toBe(6000);
  expect(elfCalories[1]).toBe(4000);
  expect(elfCalories[2]).toBe(11000);
  expect(elfCalories[3]).toBe(24000);
  expect(elfCalories[4]).toBe(10000);
});
