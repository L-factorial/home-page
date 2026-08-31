/**
 * In-place radix-2 FFT for typed real/imaginary arrays. The same routine runs
 * the inverse transform with a positive phase and 1/N normalization.
 */
export const transform = (real, imaginary, inverse = false) => {
  const size = real.length;
  if (size !== imaginary.length || size === 0 || (size & (size - 1)) !== 0) {
    throw new TypeError('FFT arrays must have the same power-of-two length.');
  }

  for (let index = 1, reversed = 0; index < size; index += 1) {
    let bit = size >> 1;
    while (reversed & bit) {
      reversed ^= bit;
      bit >>= 1;
    }
    reversed ^= bit;
    if (index < reversed) {
      [real[index], real[reversed]] = [real[reversed], real[index]];
      [imaginary[index], imaginary[reversed]] = [imaginary[reversed], imaginary[index]];
    }
  }

  const direction = inverse ? 1 : -1;
  for (let blockSize = 2; blockSize <= size; blockSize <<= 1) {
    const angle = direction * 2 * Math.PI / blockSize;
    const rootReal = Math.cos(angle);
    const rootImaginary = Math.sin(angle);

    for (let start = 0; start < size; start += blockSize) {
      let twiddleReal = 1;
      let twiddleImaginary = 0;
      const half = blockSize >> 1;

      for (let offset = 0; offset < half; offset += 1) {
        const evenIndex = start + offset;
        const oddIndex = evenIndex + half;
        const oddReal = real[oddIndex] * twiddleReal - imaginary[oddIndex] * twiddleImaginary;
        const oddImaginary = real[oddIndex] * twiddleImaginary + imaginary[oddIndex] * twiddleReal;
        const evenReal = real[evenIndex];
        const evenImaginary = imaginary[evenIndex];

        real[evenIndex] = evenReal + oddReal;
        imaginary[evenIndex] = evenImaginary + oddImaginary;
        real[oddIndex] = evenReal - oddReal;
        imaginary[oddIndex] = evenImaginary - oddImaginary;

        const nextReal = twiddleReal * rootReal - twiddleImaginary * rootImaginary;
        twiddleImaginary = twiddleReal * rootImaginary + twiddleImaginary * rootReal;
        twiddleReal = nextReal;
      }
    }
  }

  if (inverse) {
    for (let index = 0; index < size; index += 1) {
      real[index] /= size;
      imaginary[index] /= size;
    }
  }
};

export const fft = (real, imaginary) => transform(real, imaginary, false);
export const ifft = (real, imaginary) => transform(real, imaginary, true);

