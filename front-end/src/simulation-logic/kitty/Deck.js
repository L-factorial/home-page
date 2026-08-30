import Card from './Card';

export const SUITS = ['spades', 'hearts', 'diamonds', 'clubs'];
export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export default class Deck {
  constructor(cards = Deck.standardCards()) {
    this.cards = [...cards];
  }

  static standardCards() {
    return SUITS.flatMap((suit) => RANKS.map((rank) => new Card(rank, suit)));
  }

  shuffle(random = Math.random) {
    for (let index = this.cards.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [this.cards[index], this.cards[swapIndex]] = [this.cards[swapIndex], this.cards[index]];
    }
    return this;
  }

  deal(count) {
    if (count < 0 || count > this.cards.length) {
      throw new RangeError(`Cannot deal ${count} cards from a ${this.cards.length}-card deck.`);
    }
    return this.cards.splice(0, count);
  }
}
