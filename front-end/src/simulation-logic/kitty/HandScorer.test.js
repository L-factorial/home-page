import Card from './Card';
import {
  normalizedHandScore,
  rankHand,
  scoreHand,
  TOTAL_HAND_RANKS,
} from './HandScorer';

const hand = (...cards) => cards.map(([rank, suit]) => new Card(rank, suit));

test.each([
  ['trial', [['A', 'spades'], ['A', 'hearts'], ['A', 'clubs']], [6, 13]],
  ['double-run', [['Q', 'hearts'], ['K', 'hearts'], ['A', 'hearts']], [5, 12]],
  ['run', [['A', 'spades'], ['2', 'hearts'], ['3', 'clubs']], [4, 11]],
  ['color', [['A', 'clubs'], ['9', 'clubs'], ['4', 'clubs']], [3, 233]],
  ['pair', [['K', 'spades'], ['K', 'hearts'], ['7', 'clubs']], [2, 138]],
  ['high-card', [['A', 'spades'], ['9', 'hearts'], ['4', 'clubs']], [1, 233]],
])('scores a %s hand', (category, cards, score) => {
  expect(scoreHand(hand(...cards))).toMatchObject({ category, score });
});

test('orders important edge cases inside their categories', () => {
  const trial2 = scoreHand(hand(['2', 'spades'], ['2', 'hearts'], ['2', 'clubs']));
  const trialA = scoreHand(hand(['A', 'spades'], ['A', 'hearts'], ['A', 'clubs']));
  const aceLow = scoreHand(hand(['A', 'spades'], ['2', 'hearts'], ['3', 'clubs']));
  const aceHigh = scoreHand(hand(['A', 'spades'], ['K', 'hearts'], ['Q', 'clubs']));

  expect(trial2.rank).toBe(1);
  expect(trialA.rank).toBe(13);
  expect(aceHigh.rank).toBeGreaterThan(aceLow.rank);
});

test('ranks ace trial first and unsuited 2-3-5 last', () => {
  const aceTrial = hand(['A', 'spades'], ['A', 'hearts'], ['A', 'clubs']);
  const kingTrial = hand(['K', 'spades'], ['K', 'hearts'], ['K', 'clubs']);
  const lowestHighCard = hand(['2', 'spades'], ['3', 'hearts'], ['5', 'clubs']);

  expect(rankHand(aceTrial)).toBe(1);
  expect(rankHand(kingTrial)).toBe(2);
  expect(rankHand(lowestHighCard)).toBe(TOTAL_HAND_RANKS);
});

test('normalizes the complete ranking from 100 for best to 0 for worst', () => {
  const aceTrial = scoreHand(hand(['A', 'spades'], ['A', 'hearts'], ['A', 'clubs']));
  const lowestHighCard = scoreHand(hand(['2', 'spades'], ['3', 'hearts'], ['5', 'clubs']));

  expect(normalizedHandScore(aceTrial)).toBe(100);
  expect(normalizedHandScore(lowestHighCard)).toBe(0);
});

test('weights category above rank within a category', () => {
  const weakestTrial = scoreHand(hand(['2', 'spades'], ['2', 'hearts'], ['2', 'clubs']));
  const strongestDoubleRun = scoreHand(hand(['Q', 'hearts'], ['K', 'hearts'], ['A', 'hearts']));

  expect(normalizedHandScore(weakestTrial)).toBe(85);
  expect(normalizedHandScore(strongestDoubleRun)).toBe(83);
  expect(normalizedHandScore(weakestTrial)).toBeGreaterThan(normalizedHandScore(strongestDoubleRun));
});
