export const LOOP_DURATION = 16000;

export const MODES = [
  { harmonic: 3, amplitude: 0.62, decayPower: 0, color: '#d5ff5f', concern: 'essential' },
  { harmonic: 7, amplitude: 0.5, decayPower: 0.85, color: '#9de8c0', concern: 'achievement' },
  { harmonic: 13, amplitude: 0.38, decayPower: 1.25, color: '#75c9bb', concern: 'possession' },
  { harmonic: 19, amplitude: 0.29, decayPower: 1.7, color: '#609faa', concern: 'identity' },
  { harmonic: 29, amplitude: 0.22, decayPower: 2.15, color: '#727e9b', concern: 'fear' },
];

export const PHASE_OFFSETS = [-1.35, -0.68, 0, 0.82, 1.48];

const clamp01 = (value) => Math.max(0, Math.min(1, value));
export const smoothstep = (value) => {
  const x = clamp01(value);
  return x * x * (3 - 2 * x);
};
const mix = (from, to, amount) => from + (to - from) * amount;

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
    probabilities,
    entropy,
    activeModes: amplitudes.filter((amplitude) => amplitude > 0.045).length,
  };
}
export function getPhaseAlignment(lockProgress, referencePhase = 0) {
  const lock = smoothstep(lockProgress);
  const phases = PHASE_OFFSETS.map((offset) => referencePhase + offset * (1 - lock));
  const meanCos = phases.reduce((sum, phase) => sum + Math.cos(phase), 0) / phases.length;
  const meanSin = phases.reduce((sum, phase) => sum + Math.sin(phase), 0) / phases.length;
  return {
    lock,
    phases,
    coherence: Math.hypot(meanCos, meanSin),
    meanPhase: Math.atan2(meanSin, meanCos),
  };
}

export function getKarmaFrame(elapsedMs, pointer = null, reducedMotion = false) {
  const progress = ((elapsedMs % LOOP_DURATION) + LOOP_DURATION) % LOOP_DURATION / LOOP_DURATION;
  const karmaEnd = 0.25;
  const realizationEnd = 0.62;
  const bhaktiEnd = 0.86;
  const transcendenceEnd = 0.95;
  const referencePhase = elapsedMs * 0.0018;
  let phase;
  let phaseProgress;
  let spectrum = getSpectrum(0);
  let alignment = getPhaseAlignment(0, referencePhase);
  let day = 0;
  let teachingStrength = 0;
  let physicalOpacity = 1;
  let signalOpacity = 1;
  let particle;
  let waveProgress = 0;

  if (progress < realizationEnd) {
    waveProgress = progress / realizationEnd;
    const realizationProgress = clamp01((progress - karmaEnd) / (realizationEnd - karmaEnd));
    phase = progress < karmaEnd ? 'karma' : 'realization';
    phaseProgress = phase === 'karma' ? progress / karmaEnd : realizationProgress;
    spectrum = getSpectrum(realizationProgress);
    day = phase === 'realization' ? Math.min(7, Math.floor(realizationProgress * 7) + 1) : 0;
    teachingStrength = smoothstep((realizationProgress - 0.48) / 0.42);
    const waveform = MODES.reduce((sum, mode, index) => (
      sum + spectrum.amplitudes[index] * Math.sin(2 * Math.PI * mode.harmonic * waveProgress)
    ), 0);
    particle = {
      x: mix(0.06, 0.62, smoothstep(waveProgress)),
      y: waveform * 0.105 * smoothstep(Math.min(1, waveProgress / 0.06)),
    };
    if (pointer && phase === 'karma') {
      const distance = Math.hypot(pointer.x - particle.x, pointer.y - particle.y);
      particle.y += (pointer.y - particle.y) * Math.max(0, 1 - distance / 0.4) * 0.025;
    }
  } else if (progress < bhaktiEnd) {
    phase = 'bhakti';
    phaseProgress = (progress - realizationEnd) / (bhaktiEnd - realizationEnd);
    spectrum = getSpectrum(1);
    alignment = getPhaseAlignment(phaseProgress, referencePhase);
    day = 7;
    teachingStrength = 1;
    const radius = 0.115;
    const alignedPoint = {
      x: 0.82 + radius * alignment.coherence * Math.cos(alignment.meanPhase),
      y: radius * 0.72 * alignment.coherence * Math.sin(alignment.meanPhase),
    };
    const entry = smoothstep(phaseProgress / 0.16);
    particle = { x: mix(0.62, alignedPoint.x, entry), y: mix(0, alignedPoint.y, entry) };
  } else if (progress < transcendenceEnd) {
    phase = 'transcendence';
    phaseProgress = (progress - bhaktiEnd) / (transcendenceEnd - bhaktiEnd);
    spectrum = getSpectrum(1);
    alignment = getPhaseAlignment(1, referencePhase);
    day = 7;
    teachingStrength = 1;
    physicalOpacity = 1 - smoothstep(phaseProgress);
    particle = {
      x: 0.82 + 0.115 * Math.cos(alignment.meanPhase),
      y: 0.115 * 0.72 * Math.sin(alignment.meanPhase),
    };
  } else {
    phase = 'release';
    phaseProgress = (progress - transcendenceEnd) / (1 - transcendenceEnd);
    const release = smoothstep(phaseProgress);
    spectrum = getSpectrum(1 - release);
    alignment = getPhaseAlignment(1 - release, referencePhase);
    teachingStrength = 1 - release;
    signalOpacity = 1 - smoothstep(Math.max(0, phaseProgress - 0.45) / 0.55);
    particle = {
      x: mix(0.82, 0.06, release),
      y: Math.sin(phaseProgress * Math.PI) * 0.025 * (1 - release),
    };
  }

  if (reducedMotion) particle.y *= 0.16;
  return {
    progress,
    phase,
    phaseProgress: clamp01(phaseProgress),
    particle,
    spectrum,
    alignment,
    day,
    teachingStrength,
    physicalOpacity,
    signalOpacity,
    waveProgress,
    center: { x: 0.82, y: 0 },
  };
}
