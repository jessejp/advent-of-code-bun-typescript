import { BunFile } from "bun";
import { expect, test } from "bun:test";

const exampleFile = Bun.file("./AoC/2023/input/day5_example.txt");
// const inputFile = Bun.file("./AoC/2023/input/day5.txt");

type category =
  | "seed"
  | "soil"
  | "fertilizer"
  | "water"
  | "light"
  | "temperature"
  | "humidity"
  | "location";

type seed = number;

type conversionSchema = {
  destination: number;
  source: number;
  range: number;
};

type conversionMap = {
  sourceName: category;
  destinationName: category;
  schemaList: conversionSchema[];
};

const getInputList = async (
  file: BunFile
): Promise<{ seeds: seed[]; conversionMaps: conversionMap[] }> => {
  const seeds: seed[] = [];
  const conversionMaps: conversionMap[] = [];
  const categories = (await file.text()).split("\n\n");

  categories.forEach((row) => {
    if (row.indexOf("seeds:") === 0) {
      const seedRaw = row.split(":")[1];
      seedRaw
        .split(" ")
        .slice(1, seedRaw.length)
        .forEach((s) => {
          seeds.push(Number(s));
        });
    } else {
      const conversionCategory = row.split(" map:");
      const conversionName = conversionCategory[0].split("-to-");
      const schemaList: conversionSchema[] = [];

      const conversionSchema = conversionCategory[1].split("\n");

      conversionSchema
        .slice(1, conversionSchema.length)
        .forEach((schemaRow) => {
          const schema = schemaRow.split(" ");
          schemaList.push({
            destination: Number(schema[0]),
            source: Number(schema[1]),
            range: Number(schema[2]),
          });
        });

      conversionMaps.push({
        sourceName: conversionName[0] as category,
        destinationName: conversionName[1] as category,
        schemaList,
      });
    }
  });

  return {
    seeds,
    conversionMaps,
  };
};

const findSchema = (
  source: category,
  destination: category,
  conversionMapList: conversionMap[]
) => {
  return conversionMapList.find(
    (map) => map.destinationName === destination && map.sourceName === source
  )?.schemaList;
};

const solveDestination: (
  source: number,
  schemaList: conversionSchema[]
) => number = (source, schemaList) => {
  for (let i = 0; i < schemaList.length; i++) {
    const schema = schemaList[i];
    const sourcesMap = [...Array(schema.range)].map(
      (_, index) => schema.source + index
    );
    const destinationsMap = [...Array(schema.range)].map(
      (_, index) => schema.destination + index
    );

    const destIndex = sourcesMap.findIndex((s) => s === source);
    if (destIndex >= 0) {
      return destinationsMap[destIndex];
    } else {
      continue;
      //   return source;
    }
  }
  return source;
};

test("AoC 2023 day 5 example", async () => {
  const almanac = await getInputList(exampleFile);

  const seedToSoil = findSchema("seed", "soil", almanac.conversionMaps);

  console.log(seedToSoil);
  const soil: number[] = [];
  if (seedToSoil) {
    almanac.seeds.forEach((s) => {
      soil.push(solveDestination(s, seedToSoil));
    });
  }

  expect(soil[0]).toBe(81);
  expect(soil[1]).toBe(14);
  expect(soil[2]).toBe(57);
  expect(soil[3]).toBe(13);
});
