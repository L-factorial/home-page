export default String.raw`# Nepali Kitty — dealing the cards

This first stage keeps the card model independent from the animation. A standard deck creates all 52 unique rank-and-suit combinations, uses a Fisher–Yates shuffle, and removes nine cards from the top.

    const deck = new Deck();
    const nineCards = deck.shuffle().deal(9);

The screen shuffles and deals first, then evaluates and presents the best five arrangements.

## Iterating through three-hand arrangements

The order of the three hands matters, but order inside a hand does not. Instead of generating all \`9!\` permutations, choose three indices for the first hand and three from the six remaining indices for the second. The final three make the third hand.

    import KittyPermutationIterator from './KittyPermutationIterator';

    const arrangements = new KittyPermutationIterator(9);

    while (arrangements.hasNext()) {
      const sequence = arrangements.next();
      const hand1 = sequence.slice(0, 3);
      const hand2 = sequence.slice(3, 6);
      const hand3 = sequence.slice(6, 9);
      // Later: map positions to cards and rank the three hands.
    }

This produces exactly:

    C(9, 3) × C(6, 3) = 84 × 20 = 1,680

Each result contains all nine cards exactly once, and no result differs from another only by rearranging cards inside one of its three hands.

## Keeping five meaningfully different solutions

Two hands count as duplicates only when both their category and their rank within that category match. A complete solution is therefore identified by the ordered category-and-rank pairs of its three hands:

    const handRankKey = solution.hands
      .map((hand) => hand.category + ':' + hand.rank)
      .join('|');

For every category-and-rank pattern, the solver retains only its highest-scoring arrangement. It then sorts those unique representatives and displays the best five. Hand order remains significant because hands one, two, and three may carry different weights.

## Scoring a three-card hand

The scorer returns category strength first and the hand's ordinal rank within that category second. Both numbers increase with strength.

    const result = scoreHand(cards);
    // {
    //   category: 'trial',
    //   categoryScore: 6,
    //   rank: 13,
    //   rankCount: 13,
    //   overallRank: 1,
    //   normalizedScore: 100,
    //   score: [6, 13]
    // }

Categories compare as Trial (6), Double Run (5), Run (4), Color (3), Pair (2), and High Card (1). Run order is A-K-Q, A-2-3, K-Q-J, down through 2-3-4.

For a single absolute ranking, \`rankHand(cards)\` returns 1 for the strongest hand and 741 for the weakest. Three aces are rank 1, three kings are rank 2, and an unsuited 2-3-5 is rank 741.

The score out of 100 deliberately gives category 85% of the weight and rank within that category 15%. This ensures every Trial beats every Double Run, every Double Run beats every Run, and so on. Three aces score 100, while an unsuited 2-3-5 scores 0:

    const rank = rankHand(cards);
    const scored = scoreHand(cards);
    const scoreOutOf100 = normalizedHandScore(scored);
`;
