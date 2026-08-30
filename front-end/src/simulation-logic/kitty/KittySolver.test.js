import Card from './Card';
import { solveKitty } from './KittySolver';
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
});
