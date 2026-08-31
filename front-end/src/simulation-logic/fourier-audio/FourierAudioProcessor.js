import { fft, ifft } from './RealFFT';

const nextPowerOfTwo = (value) => {
  let result = 1;
  while (result < value) result <<= 1;
  return result;
};

export default class FourierAudioProcessor {
  constructor(samples, sampleRate) {
    this.sampleRate = sampleRate;
    this.sampleCount = samples.length;
    this.transformSize = nextPowerOfTwo(samples.length);
    this.originalSamples = new Float32Array(samples);

    const real = new Float64Array(this.transformSize);
    real.set(samples);
    const imaginary = new Float64Array(this.transformSize);
    fft(real, imaginary);

    this.originalReal = real;
    this.originalImaginary = imaginary;
    this.activeReal = new Float64Array(real);
    this.activeImaginary = new Float64Array(imaginary);
    this.activeSamples = new Float32Array(samples);
  }

  removeBand(centerFrequency, halfWidth = 35) {
    const firstBin = Math.max(1, Math.floor((centerFrequency - halfWidth) * this.transformSize / this.sampleRate));
    const lastBin = Math.min(
      this.transformSize / 2 - 1,
      Math.ceil((centerFrequency + halfWidth) * this.transformSize / this.sampleRate)
    );

    for (let bin = firstBin; bin <= lastBin; bin += 1) {
      const conjugateBin = this.transformSize - bin;
      this.activeReal[bin] = 0;
      this.activeImaginary[bin] = 0;
      this.activeReal[conjugateBin] = 0;
      this.activeImaginary[conjugateBin] = 0;
    }

    this.reconstructSamples();
    return this.activeSamples;
  }

  reset() {
    this.activeReal.set(this.originalReal);
    this.activeImaginary.set(this.originalImaginary);
    this.activeSamples = new Float32Array(this.originalSamples);
    return this.activeSamples;
  }

  reconstructSamples() {
    const real = new Float64Array(this.activeReal);
    const imaginary = new Float64Array(this.activeImaginary);
    ifft(real, imaginary);
    const samples = new Float32Array(this.sampleCount);
    for (let index = 0; index < samples.length; index += 1) {
      samples[index] = Math.max(-1, Math.min(1, real[index]));
    }
    this.activeSamples = samples;
  }

  waveform(bucketCount = 1000) {
    const minimum = new Float32Array(bucketCount);
    const maximum = new Float32Array(bucketCount);
    const samplesPerBucket = this.activeSamples.length / bucketCount;

    for (let bucket = 0; bucket < bucketCount; bucket += 1) {
      const start = Math.floor(bucket * samplesPerBucket);
      const end = Math.max(start + 1, Math.floor((bucket + 1) * samplesPerBucket));
      let low = 1;
      let high = -1;
      for (let index = start; index < end && index < this.activeSamples.length; index += 1) {
        low = Math.min(low, this.activeSamples[index]);
        high = Math.max(high, this.activeSamples[index]);
      }
      minimum[bucket] = low;
      maximum[bucket] = high;
    }
    return { minimum, maximum };
  }

  spectrum(maxFrequency = 10000, bucketCount = 1000) {
    const maximumBin = Math.min(
      this.transformSize / 2,
      Math.floor(maxFrequency * this.transformSize / this.sampleRate)
    );
    const magnitudes = new Float32Array(bucketCount);
    const binsPerBucket = maximumBin / bucketCount;
    let maximumMagnitude = 0;

    for (let bucket = 0; bucket < bucketCount; bucket += 1) {
      const start = Math.floor(bucket * binsPerBucket);
      const end = Math.max(start + 1, Math.floor((bucket + 1) * binsPerBucket));
      let peak = 0;
      for (let bin = start; bin < end && bin <= maximumBin; bin += 1) {
        peak = Math.max(peak, Math.hypot(this.activeReal[bin], this.activeImaginary[bin]));
      }
      magnitudes[bucket] = peak;
      maximumMagnitude = Math.max(maximumMagnitude, peak);
    }

    // Log compression keeps musical harmonics visible beside the strong tone.
    for (let bucket = 0; bucket < bucketCount; bucket += 1) {
      const relative = maximumMagnitude === 0 ? 0 : magnitudes[bucket] / maximumMagnitude;
      magnitudes[bucket] = Math.max(0, 1 + Math.log10(Math.max(relative, 0.00001)) / 5);
    }
    return { magnitudes, maxFrequency };
  }
}
