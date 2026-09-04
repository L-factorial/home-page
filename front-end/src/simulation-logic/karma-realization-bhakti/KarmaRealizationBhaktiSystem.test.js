import { getKarmaFrame, getPhaseAlignment, getSpectrum, LOOP_DURATION, smoothstep } from './KarmaRealizationBhaktiSystem';

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

  test('realization advances through seven explicit days', () => {
    expect(getKarmaFrame(LOOP_DURATION * 0.251).day).toBe(1);
    expect(getKarmaFrame(LOOP_DURATION * 0.61).day).toBe(7);
  });

  test('phase alignment converges to full coherence', () => {
    const distributed = getPhaseAlignment(0, 0.4);
    const partial = getPhaseAlignment(0.5, 0.4);
    const aligned = getPhaseAlignment(1, 0.4);
    expect(distributed.coherence).toBeLessThan(partial.coherence);
    expect(partial.coherence).toBeLessThan(aligned.coherence);
    expect(aligned.coherence).toBeCloseTo(1);
    aligned.phases.forEach((phase) => expect(phase).toBeCloseTo(0.4));
  });

  test('the physical point fades on the seventh day while the signal remains', () => {
    const beginning = getKarmaFrame(LOOP_DURATION * 0.861);
    const end = getKarmaFrame(LOOP_DURATION * 0.949);
    expect(beginning.physicalOpacity).toBeGreaterThan(end.physicalOpacity);
    expect(end.signalOpacity).toBe(1);
  });

  test('smoothstep clamps values to its domain', () => {
    expect(smoothstep(-1)).toBe(0);
    expect(smoothstep(2)).toBe(1);
  });
});
