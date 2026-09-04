import { getKarmaFrame, getSpectrum, LOOP_DURATION, smoothstep } from './KarmaRealizationBhaktiSystem';

describe('KarmaRealizationBhaktiSystem', () => {
  test('returns deterministic state for the same timestamp', () => {
    expect(getKarmaFrame(2345)).toEqual(getKarmaFrame(2345));
  });

  test('closes the visual loop continuously', () => {
    const start = getKarmaFrame(0);
    const end = getKarmaFrame(LOOP_DURATION - 0.001);
    expect(end.particle.x).toBeCloseTo(start.particle.x, 4);
    expect(end.particle.y).toBeCloseTo(start.particle.y, 4);
    expect(end.spectrum.entropy).toBeCloseTo(start.spectrum.entropy, 4);
  });

  test('damping removes higher modes while preserving the fundamental', () => {
    const initial = getSpectrum(0);
    const middle = getSpectrum(0.5);
    const final = getSpectrum(1);
    expect(middle.amplitudes[0]).toBe(initial.amplitudes[0]);
    expect(final.amplitudes[0]).toBe(initial.amplitudes[0]);
    initial.amplitudes.slice(1).forEach((amplitude, index) => {
      expect(amplitude).toBeGreaterThan(middle.amplitudes[index + 1]);
      expect(final.amplitudes[index + 1]).toBe(0);
    });
    expect(final.activeModes).toBe(1);
  });

  test('spectral entropy decreases through realization', () => {
    const initial = getSpectrum(0);
    const middle = getSpectrum(0.5);
    const final = getSpectrum(1);
    expect(initial.entropy).toBeGreaterThan(middle.entropy);
    expect(middle.entropy).toBeGreaterThan(final.entropy);
    expect(final.entropy).toBeCloseTo(0);
    expect(final.probabilities.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1);
  });

  test('phase-space radius converges toward equilibrium', () => {
    const outer = getKarmaFrame(LOOP_DURATION * 0.61);
    const middle = getKarmaFrame(LOOP_DURATION * 0.72);
    const inner = getKarmaFrame(LOOP_DURATION * 0.83);
    expect(outer.spiralRadius).toBeGreaterThan(middle.spiralRadius);
    expect(middle.spiralRadius).toBeGreaterThan(inner.spiralRadius);
  });

  test('smoothstep clamps values to its domain', () => {
    expect(smoothstep(-1)).toBe(0);
    expect(smoothstep(2)).toBe(1);
  });
});

