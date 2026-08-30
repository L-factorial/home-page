import KittyPermutationIterator from './KittyPermutationIterator';

const collect = (iterator) => {
  const values = [];
  while (iterator.hasNext()) values.push(iterator.next());
  return values;
};

test('generates all 1,680 distinct sequences for n = 9', () => {
  const arrangements = collect(new KittyPermutationIterator(9));
  expect(arrangements).toHaveLength(1680);
  expect(new Set(arrangements.map((sequence) => sequence.join(','))).size).toBe(1680);
});

test('returns 1 through n once and keeps every chunk of three ordered', () => {
  const iterator = new KittyPermutationIterator(9);
  while (iterator.hasNext()) {
    const sequence = iterator.next();
    expect([...sequence].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (let index = 0; index < sequence.length; index += 3) {
      expect(sequence[index]).toBeLessThan(sequence[index + 1]);
      expect(sequence[index + 1]).toBeLessThan(sequence[index + 2]);
    }
  }
});

test('supports other positive multiples of three and reports exhaustion', () => {
  const iterator = new KittyPermutationIterator(6);
  expect(iterator.next()).toEqual([1, 2, 3, 4, 5, 6]);
  expect(collect(iterator)).toHaveLength(19);
  expect(iterator.hasNext()).toBe(false);
  expect(() => iterator.next()).toThrow(RangeError);
});

test('rejects invalid sizes', () => {
  expect(() => new KittyPermutationIterator(8)).toThrow(TypeError);
  expect(() => new KittyPermutationIterator(0)).toThrow(TypeError);
});
