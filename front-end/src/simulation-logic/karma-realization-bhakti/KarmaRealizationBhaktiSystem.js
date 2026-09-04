export const LOOP_DURATION = 14000;

// A struck body's normal modes. Higher modes lose energy faster.
export const MODES = [
  { harmonic: 3, amplitude: 0.62, decayPower: 0, color: '#d5ff5f' },
  { harmonic: 7, amplitude: 0.5, decayPower: 1, color: '#9de8c0' },
  { harmonic: 13, amplitude: 0.38, decayPower: 1.45, color: '#75c9bb' },
  { harmonic: 19, amplitude: 0.29, decayPower: 1.9, color: '#609faa' },
  { harmonic: 29, amplitude: 0.22, decayPower: 2.35, color: '#727e9b' },
];

const clamp01 = (value) => Math.max(0, Math.min(1, value));
export const smoothstep = (value) => {
  const x = clamp01(value);
  return x * x * (3 - 2 * x);
};
const mix = (from, to, amount) => from + (to - from) * amount;

/** Frequency-dependent damping and its normalized spectral entropy. */
export function getSpectrum(realization) {
  const lambda = smoothstep(realization);
  const amplitudes = MODES.map((mode) => (
    mode.decayPower === 0 ? mode.amplitude : mode.amplitude * (1 - lambda) ** mode.decayPower
  ));
  const energies = amplitudes.map((amplitude) => amplitude ** 2);
  const totalEnergy = energies.reduce((sum, energy) => sum + energy, 0);
  const probabilities = energies.map((energy) => energy / totalEnergy);
  const entropy = -probabilities.reduce(
    (sum, probability) => sum + (probability > 0 ? probability * Math.log(probability) : 0),
    0
  ) / Math.log(MODES.length);

  return {
    lambda,
    amplitudes,
    energies,
    probabilities,
    entropy,
    totalEnergy,
    activeModes: amplitudes.filter((amplitude) => amplitude > 0.045).length,
    damping: mix(0.08, 1.35, lambda),
  };
}

/** Pure timeline model. Positions are normalized to the drawing viewport. */
export function getKarmaFrame(elapsedMs, pointer = null, reducedMotion = false) {
  const progress = ((elapsedMs % LOOP_DURATION) + LOOP_DURATION) % LOOP_DURATION / LOOP_DURATION;
  const karmaEnd = 0.32;
  const realizationEnd = 0.6;
  const bhaktiEnd = 0.84;
  const holdEnd = 0.94;

  let phase;
  let phaseProgress;
  let spectrum;
  let x;
  let y;
  let spiralRadius = null;

  if (progress < realizationEnd) {
    const pathProgress = progress / realizationEnd;
    const realizationProgress = clamp01((progress - karmaEnd) / (realizationEnd - karmaEnd));
    phase = progress < karmaEnd ? 'karma' : 'realization';
    phaseProgress = phase === 'karma' ? progress / karmaEnd : realizationProgress;
    spectrum = getSpectrum(realizationProgress);
    const waveform = MODES.reduce((sum, mode, index) => (
      sum + spectrum.amplitudes[index] * Math.sin(2 * Math.PI * mode.harmonic * pathProgress)
    ), 0);
    x = mix(0.06, 0.62, smoothstep(pathProgress));
    y = waveform * 0.105 * smoothstep(Math.min(1, pathProgress / 0.06));

    if (pointer && phase === 'karma') {
      const distance = Math.hypot(pointer.x - x, pointer.y - y);
      y += (pointer.y - y) * Math.max(0, 1 - distance / 0.4) * 0.025;
    }
  } else if (progress < bhaktiEnd) {
    phase = 'bhakti';
    phaseProgress = (progress - realizationEnd) / (bhaktiEnd - realizationEnd);
    spectrum = getSpectrum(1);
    const theta = Math.PI + phaseProgress * Math.PI * 5.6;
    // Phase portrait of the remaining underdamped fundamental mode.
    spiralRadius = 0.2 * Math.exp(-2.4 * phaseProgress) * (1 - smoothstep(phaseProgress));
    x = 0.82 + spiralRadius * Math.cos(theta);
    y = spiralRadius * 0.72 * Math.sin(theta);
  } else if (progress < holdEnd) {
    phase = 'hold';
    phaseProgress = (progress - bhaktiEnd) / (holdEnd - bhaktiEnd);
    spectrum = getSpectrum(1);
    x = 0.82;
    y = 0;
    spiralRadius = 0;
  } else {
    phase = 'release';
    phaseProgress = (progress - holdEnd) / (1 - holdEnd);
    const release = smoothstep(phaseProgress);
    spectrum = getSpectrum(1 - release);
    x = mix(0.82, 0.06, release);
    y = Math.sin(phaseProgress * Math.PI) * 0.028 * (1 - release);
  }

  if (reducedMotion) y *= 0.16;

  return {
    progress,
    phase,
    phaseProgress: clamp01(phaseProgress),
    particle: { x, y },
    spectrum,
    spiralRadius,
    center: { x: 0.82, y: 0 },
    waveProgress: Math.min(1, progress / realizationEnd),
  };
}
