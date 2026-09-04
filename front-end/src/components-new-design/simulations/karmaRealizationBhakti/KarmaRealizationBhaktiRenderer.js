import { MODES } from '../../../simulation-logic/karma-realization-bhakti/KarmaRealizationBhaktiSystem';

const LABELS = [
  { x: 0.06, title: 'KARMA', subtitle: 'many modes · complex motion', note: 'superposition' },
  { x: 0.36, title: 'REALIZATION', subtitle: 'damping · simplification', note: 'spectral entropy ↓' },
  { x: 0.72, title: 'BHAKTI', subtitle: 'one mode · equilibrium', note: '(y, dy/dt) → (0, 0)' },
];

export default class KarmaRealizationBhaktiRenderer {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
  }

  point(position) {
    const { width, height } = this.canvas.getBoundingClientRect();
    const compact = width < 620;
    const left = compact ? 24 : Math.max(42, width * 0.055);
    const right = compact ? 24 : Math.max(42, width * 0.055);
    const top = compact ? 92 : 105;
    const bottom = compact ? 82 : 98;
    return {
      x: left + position.x * (width - left - right),
      y: top + (0.5 - position.y) * (height - top - bottom),
    };
  }

  drawBackground(width, height) {
    const ctx = this.context;
    const gradient = ctx.createRadialGradient(width * 0.72, height * 0.48, 0, width * 0.55, height * 0.5, width * 0.78);
    gradient.addColorStop(0, '#10251e');
    gradient.addColorStop(0.55, '#091713');
    gradient.addColorStop(1, '#050a08');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const start = this.point({ x: 0.03, y: 0 });
    const end = this.point({ x: 0.97, y: 0 });
    ctx.strokeStyle = 'rgba(202, 239, 218, 0.055)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  drawLabels(width, activePhase) {
    const ctx = this.context;
    const compact = width < 620;
    const phaseMap = { karma: 0, realization: 1, bhakti: 2, hold: 2, release: -1 };
    LABELS.forEach((label, index) => {
      const anchor = this.point({ x: label.x, y: 0.43 });
      const active = phaseMap[activePhase] === index;
      ctx.save();
      ctx.textAlign = 'left';
      ctx.fillStyle = active ? 'rgba(234, 255, 241, 0.96)' : 'rgba(190, 215, 200, 0.42)';
      ctx.font = `600 ${compact ? 9 : 12}px system-ui, sans-serif`;
      ctx.fillText(label.title, anchor.x, anchor.y);
      ctx.fillStyle = active ? 'rgba(204, 225, 211, 0.72)' : 'rgba(171, 195, 180, 0.29)';
      ctx.font = `${compact ? 7 : 10}px system-ui, sans-serif`;
      ctx.fillText(label.subtitle, anchor.x, anchor.y + (compact ? 14 : 18));
      if (!compact) {
        ctx.fillStyle = active ? 'rgba(213, 255, 95, 0.5)' : 'rgba(190, 215, 200, 0.19)';
        ctx.font = 'italic 9px Georgia, serif';
        ctx.fillText(label.note, anchor.x, anchor.y + 35);
      }
      ctx.restore();
    });
  }

  drawStory(frame, width) {
    const ctx = this.context;
    const compact = width < 620;
    const stories = {
      karma: ['A STRUCK STRING', 'Five simple tones combine into one complex vibration'],
      realization: ['THE SAME STRING, LOSING ENERGY', 'Higher frequencies fade faster; one clear tone remains'],
      bhakti: ['THE LAST TONE IN PHASE SPACE', 'Position × velocity spirals naturally toward rest'],
      hold: ['EQUILIBRIUM', 'position = 0  ·  velocity = 0'],
      release: ['A NEW IMPULSE', 'Energy returns and the spectrum opens again'],
    };
    const [heading, explanation] = stories[frame.phase];
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(225, 245, 233, 0.68)';
    ctx.font = `600 ${compact ? 8 : 10}px system-ui, sans-serif`;
    ctx.fillText(heading, width / 2, compact ? 24 : 28);
    ctx.fillStyle = 'rgba(183, 211, 195, 0.42)';
    ctx.font = `${compact ? 7 : 9}px system-ui, sans-serif`;
    ctx.fillText(explanation, width / 2, compact ? 38 : 44);
    ctx.restore();
  }

  drawString(width) {
    if (width < 620) return;
    const ctx = this.context;
    const x = Math.max(28, width * 0.035);
    const y = 34;
    ctx.save();
    ctx.strokeStyle = 'rgba(184, 216, 198, 0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x, y + 10);
    ctx.moveTo(x + 72, y - 10);
    ctx.lineTo(x + 72, y + 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + 18, y - 8, x + 50, y + 8, x + 72, y);
    ctx.strokeStyle = 'rgba(213, 255, 95, 0.42)';
    ctx.stroke();
    ctx.fillStyle = 'rgba(190, 215, 200, 0.3)';
    ctx.font = 'italic 8px Georgia, serif';
    ctx.fillText('pluck', x + 25, y - 10);
    ctx.restore();
  }

  drawHarmonicComponents(frame) {
    if (frame.phase !== 'karma' && frame.phase !== 'realization') return;
    const ctx = this.context;
    const samples = 70;
    ctx.save();
    ctx.lineWidth = 0.65;
    MODES.forEach((mode, modeIndex) => {
      const amplitude = frame.spectrum.amplitudes[modeIndex];
      if (amplitude < 0.012) return;
      ctx.beginPath();
      for (let index = 0; index <= samples; index += 1) {
        const pathProgress = frame.waveProgress * index / samples;
        const position = {
          x: 0.06 + 0.56 * smoothVisual(pathProgress),
          y: amplitude * Math.sin(2 * Math.PI * mode.harmonic * pathProgress) * 0.045,
        };
        const point = this.point(position);
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      }
      ctx.strokeStyle = `${mode.color}${frame.phase === 'karma' ? '25' : '18'}`;
      ctx.stroke();
    });
    ctx.restore();
  }

  drawTrail(trail, frame) {
    if (trail.length < 2) return;
    const ctx = this.context;
    const clarity = 1 - frame.spectrum.entropy;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let index = 1; index < trail.length; index += 1) {
      const previous = this.point(trail[index - 1]);
      const current = this.point(trail[index]);
      const age = index / trail.length;
      ctx.beginPath();
      ctx.moveTo(previous.x, previous.y);
      ctx.lineTo(current.x, current.y);
      ctx.strokeStyle = `rgba(${Math.round(157 + clarity * 56)}, ${Math.round(213 + clarity * 42)}, ${Math.round(190 - clarity * 95)}, ${0.04 + age * 0.4})`;
      ctx.lineWidth = 0.5 + age * (0.8 + clarity * 0.55);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawSpectrum(frame, width, height) {
    if (frame.phase === 'bhakti' || frame.phase === 'hold') return;
    const ctx = this.context;
    const compact = width < 620;
    const barWidth = compact ? 9 : 13;
    const gap = compact ? 6 : 8;
    const spectrumWidth = MODES.length * barWidth + (MODES.length - 1) * gap;
    const startX = Math.max(compact ? 24 : 42, width * 0.18 - spectrumWidth / 2);
    const baseline = height - (compact ? 28 : 34);
    const maxHeight = compact ? 25 : 34;

    ctx.save();
    ctx.fillStyle = 'rgba(193, 219, 205, 0.28)';
    ctx.font = `${compact ? 7 : 8}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillText('SPECTRUM', startX, baseline - maxHeight - 10);
    frame.spectrum.amplitudes.forEach((amplitude, index) => {
      const normalized = amplitude / MODES[0].amplitude;
      const x = startX + index * (barWidth + gap);
      const barHeight = Math.max(1, normalized * maxHeight);
      ctx.fillStyle = `${MODES[index].color}${index === 0 ? 'c7' : '91'}`;
      ctx.fillRect(x, baseline - barHeight, barWidth, barHeight);
      ctx.fillStyle = 'rgba(190, 215, 200, 0.25)';
      ctx.font = `${compact ? 6 : 7}px ui-monospace, monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(`${MODES[index].harmonic}ω`, x + barWidth / 2, baseline + 10);
    });
    ctx.restore();
  }

  drawModelState(frame, width, height) {
    if (frame.phase !== 'karma' && frame.phase !== 'realization') return;
    const ctx = this.context;
    const compact = width < 620;
    const anchorX = width * (compact ? 0.57 : 0.51);
    const anchorY = height - (compact ? 27 : 33);
    const state = frame.spectrum;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = frame.phase === 'realization' ? 'rgba(213, 255, 95, 0.76)' : 'rgba(188, 218, 202, 0.38)';
    ctx.font = `500 ${compact ? 7 : 9}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillText(`Hₛ ${state.entropy.toFixed(2)}  ·  ${state.activeModes} ${state.activeModes === 1 ? 'mode' : 'modes'}`, anchorX, anchorY - 10);
    const barWidth = compact ? 90 : 150;
    ctx.fillStyle = 'rgba(211, 238, 221, 0.09)';
    ctx.fillRect(anchorX - barWidth / 2, anchorY, barWidth, 2);
    ctx.fillStyle = 'rgba(213, 255, 95, 0.66)';
    ctx.fillRect(anchorX - barWidth / 2, anchorY, barWidth * state.entropy, 2);
    ctx.restore();
  }

  drawCenter(frame) {
    const ctx = this.context;
    const center = this.point(frame.center);
    const strength = frame.phase === 'karma' ? 0.12 : frame.phase === 'realization' ? 0.35 + frame.spectrum.lambda * 0.45 : 1;
    if (frame.phase === 'bhakti') {
      ctx.save();
      ctx.strokeStyle = 'rgba(213, 255, 95, 0.11)';
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(center.x - 70, center.y);
      ctx.lineTo(center.x + 70, center.y);
      ctx.moveTo(center.x, center.y - 55);
      ctx.lineTo(center.x, center.y + 55);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(194, 220, 205, 0.28)';
      ctx.font = 'italic 8px Georgia, serif';
      ctx.fillText('y', center.x + 73, center.y + 3);
      ctx.fillText('dy/dt', center.x + 5, center.y - 58);
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(213, 255, 95, 0.42)';
      ctx.font = 'italic 8px Georgia, serif';
      ctx.fillText('same vibration, now viewed as state (y, dy/dt)', center.x, center.y + 73);
      ctx.restore();
    }
    ctx.save();
    ctx.beginPath();
    ctx.arc(center.x, center.y, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(213, 255, 95, ${0.3 + strength * 0.64})`;
    ctx.shadowColor = '#d5ff5f';
    ctx.shadowBlur = 6 + strength * 20;
    ctx.fill();
    ctx.restore();
  }

  drawParticle(frame) {
    const ctx = this.context;
    const particle = this.point(frame.particle);
    ctx.save();
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, frame.phase === 'hold' ? 4.5 : 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#f5fff8';
    ctx.shadowColor = frame.phase === 'hold' ? '#d5ff5f' : '#a9ffd1';
    ctx.shadowBlur = frame.phase === 'hold' ? 28 : 16;
    ctx.fill();
    ctx.restore();
  }

  render(frame, trail) {
    const bounds = this.canvas.getBoundingClientRect();
    this.drawBackground(bounds.width, bounds.height);
    this.drawString(bounds.width);
    this.drawStory(frame, bounds.width);
    this.drawLabels(bounds.width, frame.phase);
    this.drawHarmonicComponents(frame);
    this.drawTrail(trail, frame);
    this.drawCenter(frame);
    this.drawParticle(frame);
    this.drawSpectrum(frame, bounds.width, bounds.height);
    this.drawModelState(frame, bounds.width, bounds.height);
  }
}

const smoothVisual = (value) => value * value * (3 - 2 * value);
