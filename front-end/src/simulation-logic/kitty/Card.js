export default class Card {
  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
    this.id = `${rank}-${suit}`;
    Object.freeze(this);
  }

  get isRed() {
    return this.suit === 'hearts' || this.suit === 'diamonds';
  }
}
