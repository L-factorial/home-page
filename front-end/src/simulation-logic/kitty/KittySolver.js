import KittyPermutationIterator from './KittyPermutationIterator';
import { compareHandScores, normalizedHandScore, scoreHand } from './HandScorer';

export const DEFAULT_HAND_WEIGHTS = Object.freeze([5, 3, 1]);

/** Hands are duplicates only when category and within-category rank both match. */
export const areDuplicateHands = (left, right) =>
  Boolean(
    left
    && right
    && left.category === right.category
    && left.rank === right.rank
  );

/**
 * Category order matters because Kitty assigns different weights to hands 1–3.
 * The key deliberately ignores card identity and suit, but preserves the
 * strength rank within each category.
 */
export const solutionHandRankKey = (solution) =>
  solution.hands.map((hand) => `${hand.category}:${hand.rank}`).join('|');

export const areDuplicateSolutions = (left, right) =>
  left.hands.length === right.hands.length
  && left.hands.every((hand, index) => areDuplicateHands(hand, right.hands[index]));

export const solveKitty = (cards, limit = 5, weights = DEFAULT_HAND_WEIGHTS) => {
  if (!Array.isArray(cards) || cards.length !== 9) {
    throw new TypeError('The Kitty solver requires exactly nine cards.');
  }
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new TypeError('The solution limit must be a positive integer.');
  }
  if (!Array.isArray(weights) || weights.length !== 3 || weights.some((weight) => weight <= 0)) {
    throw new TypeError('Exactly three positive hand weights are required.');
  }

  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
  const normalizedWeights = weights.map((weight) => weight / weightTotal);
  const iterator = new KittyPermutationIterator(9);
  const bestByHandRankPattern = new Map();

  while (iterator.hasNext()) {
    const sequence = iterator.next();
    const hands = [0, 3, 6].map((start, handIndex) => {
      const indexes = sequence.slice(start, start + 3);
      const handCards = indexes.map((index) => cards[index - 1]);
      const handScore = scoreHand(handCards);
      return {
        indexes,
        cards: handCards,
        ...handScore,
        handScore: normalizedHandScore(handScore),
        weight: normalizedWeights[handIndex],
      };
    });

    if (compareHandScores(hands[0], hands[1]) <= 0) continue;
    if (compareHandScores(hands[1], hands[2]) < 0) continue;

    const combinationScore = hands.reduce(
      (total, hand) => total + hand.handScore * hand.weight,
      0
    );
    const candidate = { sequence, hands, combinationScore };
    const handRankKey = solutionHandRankKey(candidate);
    const existing = bestByHandRankPattern.get(handRankKey);
    if (!existing || candidate.combinationScore > existing.combinationScore) {
      bestByHandRankPattern.set(handRankKey, candidate);
    }
  }

  return [...bestByHandRankPattern.values()]
    .sort((left, right) => right.combinationScore - left.combinationScore)
    .slice(0, limit);
};

export default solveKitty;
