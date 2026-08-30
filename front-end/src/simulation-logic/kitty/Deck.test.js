import Deck from './Deck';

test('creates a complete deck and deals nine unique cards', () => {
  const deck = new Deck().shuffle(() => 0.5);
  const hand = deck.deal(9);

  expect(hand).toHaveLength(9);
  expect(deck.cards).toHaveLength(43);
  expect(new Set([...hand, ...deck.cards].map((card) => card.id)).size).toBe(52);
});

test('does not deal more cards than remain in the deck', () => {
  expect(() => new Deck().deal(53)).toThrow(RangeError);
});
