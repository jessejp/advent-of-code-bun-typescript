import { BunFile } from "bun";
import { expect, test } from "bun:test";

const exampleFile1 = Bun.file("./AoC/2023/input/day8_example1.txt");
const exampleFile2 = Bun.file("./AoC/2023/input/day8_example2.txt");
const inputFile = Bun.file("./AoC/2023/input/day8.txt");

type RouteMap = {
  instructions: string;
  routing: {
    loc: string;
    L: string;
    R: string;
  }[];
};

const getInputList = async (file: BunFile): Promise<RouteMap> => {
  const raw = (await file.text()).split("\n\n");
  const routing: RouteMap["routing"] = raw[1].split("\n").map((r) => {
    const locAndRoutes = r.split(" = ");

    const routes = locAndRoutes[1].split(", ");
    let L = routes[0].slice(1);
    let R = routes[1].slice(0, routes[1].length - 1);

    return {
      loc: locAndRoutes[0],
      L,
      R,
    };
  });

  return {
    instructions: raw[0],
    routing: routing,
  };
};

const followInstuctions = ({ instructions, routing }: RouteMap) => {
  let currentLoc = 0;
  let steps = 0;

  while (routing[currentLoc].loc !== "ZZZ") {
    const instruction = instructions[steps % instructions.length];

    switch (instruction) {
      case "R":
        currentLoc = routing.findIndex(
          ({ loc }) => loc === routing[currentLoc].R
        );
        break;
      case "L":
        currentLoc = routing.findIndex(
          ({ loc }) => loc === routing[currentLoc].L
        );
        break;
    }
    steps += 1;
  }
  return steps;
};

// test("AoC 2023 day 8 answer", async () => {
//   const data = await getInputList(inputFile);
//   console.log(data);

//   const steps = followInstuctions(data);
//   console.log("AoC 2023 day 8 part 1 =", steps);
// });

test("AoC 2023 day 8 example", async () => {
  const dataExample1 = await getInputList(exampleFile1);
  const dataExample2 = await getInputList(exampleFile2);
  expect(followInstuctions(dataExample1)).toBe(2);
  expect(followInstuctions(dataExample2)).toBe(6);
});
