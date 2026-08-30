import Card from './Card';
import { scoreHand } from './HandScorer';

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
