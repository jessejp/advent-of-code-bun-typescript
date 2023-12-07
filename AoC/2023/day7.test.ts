import { BunFile } from "bun";
import { expect, test } from "bun:test";

const exampleFile = Bun.file("./AoC/2023/input/day7_example.txt");
const inputFile = Bun.file("./AoC/2023/input/day7.txt");

const getInputList = async (file: BunFile): Promise<CamelCardHand[]> => {
  const text = (await file.text()).split("\n");

  return text.map((row) => {
    const handAndBid = row.split(" ");
    return {
      hand: handAndBid[0],
      bid: Number(handAndBid[1]),
      type: 0,
    };
  });
};

const labels = {
  "2": 1,
  "3": 2,
  "4": 3,
  "5": 4,
  "6": 5,
  "7": 6,
  "8": 7,
  "9": 8,
  T: 9,
  J: 10,
  Q: 11,
  K: 12,
  A: 13,
} as const;

type HandType =
  | 7 // FiveOfAKind
  | 6 // FourOfAKind
  | 5 // FullHouse
  | 4 // ThreeOfAKind
  | 3 // TwoPair
  | 2 // OnePair
  | 1 // HighCard
  | 0; // Not played yet

type CamelCardHand = {
  hand: string;
  bid: number;
  type: HandType;
};

const getHandType = (hand: string): HandType => {
  let handStr: HandType = 1;
  let parsedHand = "";
  let same = "";

  for (let i = 0; i <= hand.length; i++) {
    const label = hand[i];
    if (parsedHand.length > 0 && parsedHand.indexOf(label) > -1) {
      switch (handStr) {
        case 1:
          same += label;
          handStr = 2;
          break;
        case 2:
          if (same.includes(label)) {
            handStr = 4; // Three of a kind
          } else {
            handStr = 3;
          }
          same += label;
          break;
        case 3:
          handStr = 5; // full house
          same += label;
          break;
        case 4:
          handStr = 6; // Four of a kind
          same += label;
          break;
        case 6:
          handStr = 7;
          same += label;
          break;
      }
    }
    parsedHand += label;
  }

  return handStr;
};

const getHandRankings = (hands: CamelCardHand[]) => {
  return hands.sort((a, b) => {
    let A: number = a.type;
    let B: number = b.type;

    if (a.type === b.type) {
      for (let i = 0; i <= a.hand.length; i++) {
        const cA = a.hand[i] as keyof typeof labels;
        const cB = b.hand[i] as keyof typeof labels;
        if (labels[cA] !== labels[cB]) {
          A = labels[cA] > labels[cB] ? A + 1 : A - 1;
          break;
        }
      }
    }

    return A - B;
  });
};

const getTotalWinnings = (handsRanked: CamelCardHand[]) => {
  let sum = 0;
  handsRanked.forEach(({ bid }, index) => {
    console.log(
      "bid and index",
      bid,
      "*",
      index + 1,
      "=",
      bid * (index + 1),
      "| sum",
      sum
    );

    sum += bid * (index + 1);
  });
  return sum;
};

test("AoC 2023 day 7 example part 1", async () => {
  const data = await getInputList(inputFile);
  data.forEach((cc, index) => {
    const str = getHandType(cc.hand);
    data[index].type = str;
  });

  const rankings = getHandRankings(data);

  const total = getTotalWinnings(rankings);
  console.log("day 7 answer part 1 =", total);
  // attempt 1 = 247943275 (too high)
});

test("AoC 2023 day 7 example part 1", async () => {
  const data = await getInputList(exampleFile);

  data.forEach((cc, index) => {
    const str = getHandType(cc.hand);
    data[index].type = str;
  });

  const rankings = getHandRankings(data);
  expect(rankings[0].hand).toBe("32T3K");
  expect(rankings[1].hand).toBe("KTJJT");
  expect(rankings[2].hand).toBe("KK677");
  expect(rankings[3].hand).toBe("T55J5");
  expect(rankings[4].hand).toBe("QQQJA");
  expect(getTotalWinnings(rankings)).toBe(6440);
});
