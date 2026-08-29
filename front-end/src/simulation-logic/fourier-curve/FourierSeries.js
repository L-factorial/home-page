import { fft } from './FFT';

export default class FourierSeries {
  constructor(samples) {
    const transform = fft(samples);
    this.coefficients = transform.map((value, index) => {
      const re = value.re / transform.length;
      const im = value.im / transform.length;
      return {
        frequency: index <= transform.length / 2 ? index : index - transform.length,
        re,
        im,
        amplitude: Math.hypot(re, im),
        phase: Math.atan2(im, re),
      };
    });
  }

  /** Selects low frequencies symmetrically, then orders them for clear epicycles. */
  selectComponents(requestedCount) {
    const count = Math.max(1, Math.min(requestedCount, this.coefficients.length));
    return [...this.coefficients]
      .sort((a, b) => Math.abs(a.frequency) - Math.abs(b.frequency) || a.frequency - b.frequency)
      .slice(0, count)
      .sort((a, b) => b.amplitude - a.amplitude);
  }

  epicyclesAt(time, components) {
    const vectors = [];
    let x = 0;
    let y = 0;

    for (const coefficient of components) {
      const angle = coefficient.phase + 2 * Math.PI * coefficient.frequency * time;
      const nextX = x + coefficient.amplitude * Math.cos(angle);
      const nextY = y + coefficient.amplitude * Math.sin(angle);
      vectors.push({ x, y, endX: nextX, endY: nextY, radius: coefficient.amplitude });
      x = nextX;
      y = nextY;
    }

    return { vectors, endpoint: { x, y } };
  }
}
