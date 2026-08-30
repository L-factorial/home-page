import KittyPermutationIterator from './KittyPermutationIterator';
import { compareHandScores, normalizedHandScore, scoreHand } from './HandScorer';

export const DEFAULT_HAND_WEIGHTS = Object.freeze([5, 3, 1]);

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
  const best = [];

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
    best.push({ sequence, hands, combinationScore });
    best.sort((left, right) => right.combinationScore - left.combinationScore);
    if (best.length > limit) best.pop();
  }

  return best;
};

export default solveKitty;
