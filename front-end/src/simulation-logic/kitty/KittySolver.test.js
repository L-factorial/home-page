import Card from './Card';
import {
  areDuplicateHands,
  areDuplicateSolutions,
  solutionHandRankKey,
  solveKitty,
} from './KittySolver';
import { compareHandScores } from './HandScorer';

const cards = [
  new Card('A', 'spades'), new Card('A', 'hearts'), new Card('A', 'clubs'),
  new Card('K', 'spades'), new Card('K', 'hearts'), new Card('7', 'clubs'),
  new Card('Q', 'spades'), new Card('9', 'hearts'), new Card('4', 'clubs'),
];

test('returns the five highest-scoring valid Kitty solutions', () => {
  const solutions = solveKitty(cards);
  expect(solutions).toHaveLength(5);

  solutions.forEach((solution) => {
    expect(solution.sequence).toHaveLength(9);
    expect(new Set(solution.sequence).size).toBe(9);
    expect(compareHandScores(solution.hands[0], solution.hands[1])).toBeGreaterThan(0);
    expect(compareHandScores(solution.hands[1], solution.hands[2])).toBeGreaterThanOrEqual(0);
    expect(solution.combinationScore).toBeGreaterThanOrEqual(1);
    expect(solution.combinationScore).toBeLessThanOrEqual(100);
  });

  for (let index = 1; index < solutions.length; index += 1) {
    expect(solutions[index - 1].combinationScore).toBeGreaterThanOrEqual(solutions[index].combinationScore);
  }

  expect(new Set(solutions.map(solutionHandRankKey)).size).toBe(solutions.length);
});

test('detects duplicate hand meanings by category and rank', () => {
  expect(areDuplicateHands({ category: 'pair', rank: 12 }, { category: 'pair', rank: 12 })).toBe(true);
  expect(areDuplicateHands({ category: 'pair', rank: 12 }, { category: 'pair', rank: 13 })).toBe(false);
  expect(areDuplicateHands({ category: 'pair', rank: 12 }, { category: 'color', rank: 12 })).toBe(false);
});

test('detects duplicate solutions from corresponding hand categories and ranks', () => {
  const first = { hands: [{ category: 'trial', rank: 13 }, { category: 'pair', rank: 20 }, { category: 'high-card', rank: 4 }] };
  const sameMeaning = { hands: [{ category: 'trial', rank: 13 }, { category: 'pair', rank: 20 }, { category: 'high-card', rank: 4 }] };
  const differentRank = { hands: [{ category: 'trial', rank: 13 }, { category: 'pair', rank: 21 }, { category: 'high-card', rank: 4 }] };
  const differentOrder = { hands: [{ category: 'pair', rank: 20 }, { category: 'trial', rank: 13 }, { category: 'high-card', rank: 4 }] };

  expect(areDuplicateSolutions(first, sameMeaning)).toBe(true);
  expect(areDuplicateSolutions(first, differentRank)).toBe(false);
  expect(areDuplicateSolutions(first, differentOrder)).toBe(false);
});
