/** Iterative radix-2 Cooley-Tukey FFT for complex-valued boundary samples. */
export const fft = (samples) => {
  const size = samples.length;
  if (size === 0 || (size & (size - 1)) !== 0) {
    throw new Error('FFT sample count must be a power of two.');
  }

  const output = samples.map(({ x, y }) => ({ re: x, im: y }));

  // Bit-reversal permutation places values in the order required by the
  // iterative butterfly stages.
  for (let i = 1, reversed = 0; i < size; i += 1) {
    let bit = size >> 1;
    while (reversed & bit) {
      reversed ^= bit;
      bit >>= 1;
    }
    reversed ^= bit;
    if (i < reversed) [output[i], output[reversed]] = [output[reversed], output[i]];
  }

  for (let blockSize = 2; blockSize <= size; blockSize <<= 1) {
    const angle = -2 * Math.PI / blockSize;
    const rootRe = Math.cos(angle);
    const rootIm = Math.sin(angle);

    for (let start = 0; start < size; start += blockSize) {
      let twiddleRe = 1;
      let twiddleIm = 0;
      for (let offset = 0; offset < blockSize / 2; offset += 1) {
        const even = output[start + offset];
        const odd = output[start + offset + blockSize / 2];
        const oddRe = odd.re * twiddleRe - odd.im * twiddleIm;
        const oddIm = odd.re * twiddleIm + odd.im * twiddleRe;

        output[start + offset] = { re: even.re + oddRe, im: even.im + oddIm };
        output[start + offset + blockSize / 2] = { re: even.re - oddRe, im: even.im - oddIm };

        const nextTwiddleRe = twiddleRe * rootRe - twiddleIm * rootIm;
        twiddleIm = twiddleRe * rootIm + twiddleIm * rootRe;
        twiddleRe = nextTwiddleRe;
      }
    }
  }

  return output;
};
