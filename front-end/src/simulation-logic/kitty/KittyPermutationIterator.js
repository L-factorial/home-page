/**
 * Generates permutations of 1..n while ignoring order inside each chunk of 3.
 */
export default class KittyPermutationIterator {
  constructor(n) {
    if (!Number.isInteger(n) || n <= 0 || n % 3 !== 0) {
      throw new TypeError('n must be a positive integer divisible by 3.');
    }

    this.iterator = this.generate(
      Array.from({ length: n }, (_, index) => index + 1),
      n / 3
    );
    this.nextResult = this.iterator.next();
  }

  hasNext() {
    return !this.nextResult.done;
  }

  next() {
    if (!this.hasNext()) {
      throw new RangeError('The Kitty permutation iterator is exhausted.');
    }

    const sequence = this.nextResult.value;
    this.nextResult = this.iterator.next();
    return sequence;
  }

  *generate(remaining, chunksLeft, prefix = []) {
    if (chunksLeft === 1) {
      yield [...prefix, ...remaining];
      return;
    }

    for (const indices of KittyPermutationIterator.combinations(remaining.length, 3)) {
      const selectedIndices = new Set(indices);
      const chunk = indices.map((index) => remaining[index]);
      const rest = remaining.filter((_, index) => !selectedIndices.has(index));
      yield* this.generate(rest, chunksLeft - 1, [...prefix, ...chunk]);
    }
  }

  static *combinations(itemCount, selectionCount, start = 0, prefix = []) {
    if (prefix.length === selectionCount) {
      yield prefix;
      return;
    }

    const needed = selectionCount - prefix.length;
    for (let index = start; index <= itemCount - needed; index += 1) {
      yield* KittyPermutationIterator.combinations(
        itemCount,
        selectionCount,
        index + 1,
        [...prefix, index]
      );
    }
  }
}
