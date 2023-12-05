import { BunFile } from "bun";
import { expect, test } from "bun:test";

const exampleFile = Bun.file("./AoC/2023/input/day5_example.txt");
const inputFile = Bun.file("./AoC/2023/input/day5.txt");

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
  return (
    conversionMapList.find(
      (map) => map.destinationName === destination && map.sourceName === source
    )?.schemaList || []
  );
};

const solveDestination: (
  source: number,
  schemaList: conversionSchema[]
) => number = (source, schemaList) => {
  for (let i = 0; i < schemaList.length; i++) {
    const schema = schemaList[i];
    const sourcesMap = {
      start: schema.source,
      end: schema.source + schema.range - 1,
    };
    const destinationsMap = {
      start: schema.destination,
      end: schema.destination + schema.range - 1,
    };

    const dest =
      source >= sourcesMap.start && source <= sourcesMap.end
        ? destinationsMap.start +
          schema.range -
          (sourcesMap.start + schema.range - source)
        : -1;

    if (dest >= 0) {
      return dest;
    } else {
      continue;
    }
  }
  return source;
};

const getDestinationsList = (
  source: number[],
  schemaList: conversionSchema[]
) => {
  const destination: number[] = [];
  source.forEach((s) => {
    destination.push(solveDestination(s, schemaList));
  });
  return destination;
};

test("AoC 2023 day 5 answer", async () => {
  const { seeds, conversionMaps } = await getInputList(inputFile);

  const soilFromSeed = findSchema("seed", "soil", conversionMaps);
  const soil = getDestinationsList(seeds, soilFromSeed);

  const fertilizerFromSoil = findSchema("soil", "fertilizer", conversionMaps);
  const fertilizer = getDestinationsList(soil, fertilizerFromSoil);

  const waterFromFertilizer = findSchema("fertilizer", "water", conversionMaps);
  const water = getDestinationsList(fertilizer, waterFromFertilizer);

  const lightFromWater = findSchema("water", "light", conversionMaps);
  const light = getDestinationsList(water, lightFromWater);

  const tempFromLight = findSchema("light", "temperature", conversionMaps);
  const temperature = getDestinationsList(light, tempFromLight);

  const humidityFromTemp = findSchema(
    "temperature",
    "humidity",
    conversionMaps
  );
  const humidity = getDestinationsList(temperature, humidityFromTemp);

  const locFromHumidity = findSchema("humidity", "location", conversionMaps);
  const location = getDestinationsList(humidity, locFromHumidity);

  const lowestLocation = location.toSorted((a, b) => a - b)[0];
  console.log("AoC 2023 Day 5 part 1 answer =", lowestLocation);
});

test("AoC 2023 day 5 example", async () => {
  const { seeds, conversionMaps } = await getInputList(exampleFile);

  const seedToSoil = findSchema("seed", "soil", conversionMaps);

  const soil = getDestinationsList(seeds, seedToSoil);

  expect(soil[0]).toBe(81);
  expect(soil[1]).toBe(14);
  expect(soil[2]).toBe(57);
  expect(soil[3]).toBe(13);

  const soilToFertilizer = findSchema("soil", "fertilizer", conversionMaps);

  const fertilizer = getDestinationsList(soil, soilToFertilizer);
  expect(fertilizer[0]).toBe(81);
  expect(fertilizer[1]).toBe(53);
  expect(fertilizer[2]).toBe(57);
  expect(fertilizer[3]).toBe(52);

  const fertilizerToWater = findSchema("fertilizer", "water", conversionMaps);

  const water = getDestinationsList(fertilizer, fertilizerToWater);
  const waterToLight = findSchema("water", "light", conversionMaps);
  const light = getDestinationsList(water, waterToLight);
  const lightToTemperature = findSchema("light", "temperature", conversionMaps);
  const temperature = getDestinationsList(light, lightToTemperature);
  const temperatureToHumidity = findSchema(
    "temperature",
    "humidity",
    conversionMaps
  );
  const humidity = getDestinationsList(temperature, temperatureToHumidity);
  const humidityToLocation = findSchema("humidity", "location", conversionMaps);
  const location = getDestinationsList(humidity, humidityToLocation);
  expect(location[0]).toBe(82);
  expect(location[1]).toBe(43);
  expect(location[2]).toBe(86);
  expect(location[3]).toBe(35);
  const lowestLocation = location.toSorted((a, b) => a - b)[0];
  expect(lowestLocation).toBe(35);
});
