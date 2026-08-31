import FourierAudioProcessor from './FourierAudioProcessor';
import { fft, ifft } from './RealFFT';

test('FFT and inverse FFT reconstruct the original real signal', () => {
  const real = new Float64Array([0.2, -0.5, 0.8, 0.1, -0.2, 0.4, 0.7, -0.1]);
  const original = [...real];
  const imaginary = new Float64Array(real.length);

  fft(real, imaginary);
  ifft(real, imaginary);

  real.forEach((value, index) => expect(value).toBeCloseTo(original[index], 10));
  imaginary.forEach((value) => expect(value).toBeCloseTo(0, 10));
});

test('removes a frequency and its conjugate before reconstructing audio', () => {
  const sampleRate = 1024;
  const frequency = 64;
  const samples = Float32Array.from(
    { length: 1024 },
    (_, index) => Math.sin(2 * Math.PI * frequency * index / sampleRate)
  );
  const processor = new FourierAudioProcessor(samples, sampleRate);

  const filtered = processor.removeBand(frequency, 1);
  const peak = Math.max(...filtered.map(Math.abs));
  expect(peak).toBeLessThan(0.00001);

  const restored = processor.reset();
  expect(restored[17]).toBeCloseTo(samples[17], 7);
});

