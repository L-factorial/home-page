const RANK_VALUE = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
  '9': 9, '10': 10, J: 11, Q: 12, K: 13, A: 14,
};

export const CATEGORY_SCORE = {
  'high-card': 1,
  pair: 2,
  color: 3,
  run: 4,
  'double-run': 5,
  trial: 6,
};

export const CATEGORY_RANK_COUNT = {
  trial: 13,
  'double-run': 12,
  run: 12,
  color: 274,
  pair: 156,
  'high-card': 274,
};

const CATEGORY_OFFSET = {
  'high-card': 0,
  pair: 274,
  color: 430,
  run: 704,
  'double-run': 716,
  trial: 728,
};

const combinations = (values, count, start = 0, prefix = [], output = []) => {
  if (prefix.length === count) {
    output.push(prefix);
    return output;
  }
  for (let index = start; index <= values.length - (count - prefix.length); index += 1) {
    combinations(values, count, index + 1, [...prefix, values[index]], output);
  }
  return output;
};

// Weakest to strongest. A-2-3 is conventionally second only to A-K-Q.
const RUNS = [
  [2, 3, 4], [3, 4, 5], [4, 5, 6], [5, 6, 7], [6, 7, 8],
  [7, 8, 9], [8, 9, 10], [9, 10, 11], [10, 11, 12],
  [11, 12, 13], [2, 3, 14], [12, 13, 14],
];

const key = (values) => [...values].sort((a, b) => a - b).join(',');
const RUN_RANKS = new Map(RUNS.map((ranks, index) => [key(ranks), index + 1]));

const compareHighCards = (left, right) => {
  const a = [...left].sort((x, y) => y - x);
  const b = [...right].sort((x, y) => y - x);
  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) return a[index] - b[index];
  }
  return 0;
};

const distinctRankHands = combinations(
  Array.from({ length: 13 }, (_, index) => index + 2),
  3
).filter((ranks) => !RUN_RANKS.has(key(ranks))).sort(compareHighCards);

const HIGH_CARD_RANKS = new Map(
  distinctRankHands.map((ranks, index) => [key(ranks), index + 1])
);

const PAIR_RANKS = new Map();
let pairOrdinal = 1;
for (let pair = 2; pair <= 14; pair += 1) {
  for (let kicker = 2; kicker <= 14; kicker += 1) {
    if (kicker !== pair) {
      PAIR_RANKS.set(`${pair}:${kicker}`, pairOrdinal);
      pairOrdinal += 1;
    }
  }
}

const validateCards = (cards) => {
  if (!Array.isArray(cards) || cards.length !== 3) {
    throw new TypeError('A Kitty hand must contain exactly three cards.');
  }
  if (cards.some((card) => !card || !RANK_VALUE[card.rank] || !card.suit)) {
    throw new TypeError('Every card must have a valid rank and suit.');
  }
  if (new Set(cards.map((card) => `${card.rank}-${card.suit}`)).size !== 3) {
    throw new TypeError('A Kitty hand cannot contain the same card twice.');
  }
};

/** Returns a score where both numeric values increase with hand strength. */
export const scoreHand = (cards) => {
  validateCards(cards);
  const ranks = cards.map((card) => RANK_VALUE[card.rank]);
  const counts = new Map();
  ranks.forEach((rank) => counts.set(rank, (counts.get(rank) || 0) + 1));

  const sameSuit = cards.every((card) => card.suit === cards[0].suit);
  const runRank = RUN_RANKS.get(key(ranks));
  let category;
  let rank;

  if (counts.size === 1) {
    category = 'trial';
    rank = ranks[0] - 1; // 222 = 1, AAA = 13
  } else if (runRank && sameSuit) {
    category = 'double-run';
    rank = runRank;
  } else if (runRank) {
    category = 'run';
    rank = runRank;
  } else if (sameSuit) {
    category = 'color';
    rank = HIGH_CARD_RANKS.get(key(ranks));
  } else if (counts.size === 2) {
    category = 'pair';
    const pairRank = [...counts].find(([, count]) => count === 2)[0];
    const kickerRank = [...counts].find(([, count]) => count === 1)[0];
    rank = PAIR_RANKS.get(`${pairRank}:${kickerRank}`);
  } else {
    category = 'high-card';
    rank = HIGH_CARD_RANKS.get(key(ranks));
  }

  return Object.freeze({
    category,
    categoryScore: CATEGORY_SCORE[category],
    rank,
    rankCount: CATEGORY_RANK_COUNT[category],
    score: Object.freeze([CATEGORY_SCORE[category], rank]),
  });
};

export const compareHandScores = (left, right) =>
  left.categoryScore - right.categoryScore || left.rank - right.rank;

export const globalHandRank = (handScore) =>
  CATEGORY_OFFSET[handScore.category] + handScore.rank;

export const normalizedHandScore = (handScore) =>
  1 + (99 * (globalHandRank(handScore) - 1)) / 740;

export default scoreHand;
