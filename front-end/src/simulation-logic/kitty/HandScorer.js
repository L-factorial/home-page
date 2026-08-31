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

// Category controls most of the final score; ordinal strength inside that
// category provides the remaining refinement. Values are normalized 0..1.
export const CATEGORY_WEIGHT = Object.freeze({
  'high-card': 0,
  pair: 0.2,
  color: 0.4,
  run: 0.6,
  'double-run': 0.8,
  trial: 1,
});

export const HAND_SCORE_WEIGHT = Object.freeze({
  category: 0.85,
  rankWithinCategory: 0.15,
});

export const CATEGORY_RANK_COUNT = {
  trial: 13,
  'double-run': 12,
  run: 12,
  color: 274,
  pair: 156,
  'high-card': 274,
};

// There are 741 distinct three-card Kitty strength ranks once suit-equivalent
// hands are tied. Rank 1 is strongest; rank 741 is weakest.
export const TOTAL_HAND_RANKS = Object.values(CATEGORY_RANK_COUNT)
  .reduce((total, count) => total + count, 0);

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

/**
 * Classifies one three-card hand. `rank` remains local to its category for
 * comparisons and display; `overallRank` uses the public 1 = best convention.
 */
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

  const weakToStrongRank = CATEGORY_OFFSET[category] + rank;
  const overallRank = TOTAL_HAND_RANKS - weakToStrongRank + 1;
  const rankWithinCategory = CATEGORY_RANK_COUNT[category] === 1
    ? 1
    : (rank - 1) / (CATEGORY_RANK_COUNT[category] - 1);
  const normalizedScore = 100 * (
    HAND_SCORE_WEIGHT.category * CATEGORY_WEIGHT[category]
    + HAND_SCORE_WEIGHT.rankWithinCategory * rankWithinCategory
  );

  return Object.freeze({
    category,
    categoryScore: CATEGORY_SCORE[category],
    rank,
    rankCount: CATEGORY_RANK_COUNT[category],
    overallRank,
    normalizedScore,
    score: Object.freeze([CATEGORY_SCORE[category], rank]),
  });
};

export const compareHandScores = (left, right) =>
  left.categoryScore - right.categoryScore || left.rank - right.rank;

export const globalHandRank = (handScore) =>
  CATEGORY_OFFSET[handScore.category] + handScore.rank;

/** Returns an absolute rank for any valid hand: 1 is best and 741 is worst. */
export const rankHand = (cards) => scoreHand(cards).overallRank;

export const normalizedHandScore = (handScore) =>
  handScore.normalizedScore
    ?? 100 * (
      HAND_SCORE_WEIGHT.category * CATEGORY_WEIGHT[handScore.category]
      + HAND_SCORE_WEIGHT.rankWithinCategory * (
        CATEGORY_RANK_COUNT[handScore.category] === 1
          ? 1
          : (handScore.rank - 1) / (CATEGORY_RANK_COUNT[handScore.category] - 1)
      )
    );

export default scoreHand;
