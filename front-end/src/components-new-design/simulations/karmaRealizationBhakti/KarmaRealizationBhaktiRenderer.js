import { MODES } from '../../../simulation-logic/karma-realization-bhakti/KarmaRealizationBhaktiSystem';

const LABELS = [
  { x: 0.06, title: 'KARMA', subtitle: 'action · consequence', note: 'an impulse enters time' },
  { x: 0.34, title: 'REALIZATION', subtitle: 'seven days · discernment', note: 'attention becomes selective' },
  { x: 0.72, title: 'BHAKTI', subtitle: 'listening · alignment', note: 'phase difference → 0' },
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
    const phaseMap = { karma: 0, realization: 1, bhakti: 2, transcendence: 2, release: -1 };
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
      karma: ['PARIKSHIT ACTS IN ANGER', 'The action is brief, but its consequence has entered time'],
      realization: [`PARIKSHIT LEARNS: ${8 - frame.day} ${8 - frame.day === 1 ? 'DAY' : 'DAYS'} REMAIN`, 'With limited time, ordinary concerns begin to lose their hold'],
      bhakti: ['PARIKSHIT LISTENS TO SHUKADEVA', 'Many concerns give way to complete attention'],
      transcendence: ['THE SEVENTH DAY', 'The body reaches its limit; what was understood remains'],
      release: ['THE STORY BECOMES A NEW IMPULSE', 'What one person understands can awaken another'],
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

  drawAnalogyKey(frame, width) {
    const ctx = this.context;
    const compact = width < 620;
    const keys = {
      karma: 'many waves = consequences and competing concerns',
      realization: 'fading spectrum = attention separating essential from unnecessary',
      bhakti: 'converging dots = attention aligning with one teaching',
      transcendence: 'continuing wave = understanding carried beyond the final day',
      release: 'returning impulse = the story beginning again for a new listener',
    };
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(213, 255, 95, 0.43)';
    ctx.font = `italic ${compact ? 7 : 8}px Georgia, serif`;
    ctx.fillText(keys[frame.phase], width / 2, compact ? 54 : 62);
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
    ctx.fillText('impulse', x + 20, y - 10);
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
    ctx.shadowColor = clarity > 0.55 ? 'rgba(213, 255, 95, 0.72)' : 'rgba(137, 255, 199, 0.58)';
    for (let index = 1; index < trail.length; index += 1) {
      const previous = this.point(trail[index - 1]);
      const current = this.point(trail[index]);
      const age = index / trail.length;
      ctx.beginPath();
      ctx.moveTo(previous.x, previous.y);
      ctx.lineTo(current.x, current.y);
      ctx.strokeStyle = `rgba(${Math.round(157 + clarity * 56)}, ${Math.round(213 + clarity * 42)}, ${Math.round(190 - clarity * 95)}, ${0.08 + age * 0.58})`;
      ctx.lineWidth = 0.65 + age * (1.05 + clarity * 0.72);
      ctx.shadowBlur = 2 + age * 10;
      ctx.stroke();
    }
    ctx.restore();
  }

  drawSpectrum(frame, width, height) {
    if (frame.phase === 'bhakti' || frame.phase === 'transcendence') return;
    const ctx = this.context;
    const compact = width < 620;
    const barWidth = compact ? 9 : 13;
    const gap = compact ? 6 : 40;
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
      ctx.fillText(compact ? `${MODES[index].harmonic}ω` : MODES[index].concern, x + barWidth / 2, baseline + 10);
    });
    ctx.restore();
  }

  drawSevenDays(frame) {
    if (frame.phase === 'karma' || frame.phase === 'release') return;
    const ctx = this.context;
    const y = this.point({ x: 0, y: 0.29 }).y;
    ctx.save();
    ctx.textAlign = 'center';
    for (let day = 1; day <= 7; day += 1) {
      const x = this.point({ x: 0.29 + (day - 1) * 0.052, y: 0 }).x;
      const reached = day <= frame.day;
      ctx.beginPath();
      ctx.moveTo(x, y + 5);
      ctx.lineTo(x, y + 13);
      ctx.strokeStyle = reached ? 'rgba(213, 255, 95, 0.66)' : 'rgba(190, 215, 200, 0.16)';
      ctx.stroke();
      ctx.fillStyle = reached ? 'rgba(225, 244, 232, 0.7)' : 'rgba(190, 215, 200, 0.22)';
      ctx.font = '7px ui-monospace, monospace';
      ctx.fillText(String(day), x, y);
    }
    ctx.restore();
  }

  drawTeachingSignal(frame) {
    if (frame.teachingStrength <= 0.002) return;
    const ctx = this.context;
    const strength = frame.teachingStrength * frame.signalOpacity;
    const startX = 0.54;
    const endX = 0.96;
    ctx.save();
    ctx.beginPath();
    for (let index = 0; index <= 80; index += 1) {
      const u = index / 80;
      const point = this.point({
        x: startX + (endX - startX) * u,
        y: -0.31 + Math.sin(u * Math.PI * 6) * 0.018,
      });
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    }
    ctx.strokeStyle = `rgba(213, 255, 95, ${0.15 + strength * 0.48})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    const label = this.point({ x: 0.75, y: -0.36 });
    ctx.fillStyle = `rgba(218, 240, 225, ${strength * 0.58})`;
    ctx.textAlign = 'center';
    ctx.font = 'italic 8px Georgia, serif';
    ctx.fillText('Śukadeva’s teaching · reference frequency ω₀', label.x, label.y);
    ctx.restore();
  }

  drawAlignment(frame) {
    if (frame.phase !== 'bhakti' && frame.phase !== 'transcendence') return;
    const ctx = this.context;
    const center = this.point(frame.center);
    const radiusPoint = this.point({ x: frame.center.x + 0.115, y: 0 });
    const radius = radiusPoint.x - center.x;
    ctx.save();
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(196, 226, 208, 0.12)';
    ctx.setLineDash([3, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    frame.alignment.phases.forEach((phase, index) => {
      const point = this.point({
        x: frame.center.x + 0.115 * Math.cos(phase),
        y: 0.115 * 0.72 * Math.sin(phase),
      });
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = `${MODES[index].color}${Math.round(frame.physicalOpacity * 150).toString(16).padStart(2, '0')}`;
      ctx.fill();
    });
    ctx.fillStyle = `rgba(213, 255, 95, ${0.42 + frame.alignment.coherence * 0.45})`;
    ctx.textAlign = 'center';
    ctx.font = '9px ui-monospace, monospace';
    ctx.fillText(`coherence R = ${frame.alignment.coherence.toFixed(2)}`, center.x, center.y + radius + 24);
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
    ctx.save();
    ctx.beginPath();
    ctx.arc(center.x, center.y, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(213, 255, 95, ${(0.3 + strength * 0.64) * frame.signalOpacity})`;
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
    ctx.arc(particle.x, particle.y, frame.phase === 'transcendence' ? 4.5 : 3.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245, 255, 248, ${frame.physicalOpacity})`;
    ctx.shadowColor = '#a9ffd1';
    ctx.shadowBlur = frame.phase === 'transcendence' ? 28 : 16;
    ctx.fill();
    ctx.restore();
  }

  render(frame, trail) {
    const bounds = this.canvas.getBoundingClientRect();
    this.drawBackground(bounds.width, bounds.height);
    this.drawString(bounds.width);
    this.drawStory(frame, bounds.width);
    this.drawAnalogyKey(frame, bounds.width);
    this.drawLabels(bounds.width, frame.phase);
    this.drawSevenDays(frame);
    this.drawHarmonicComponents(frame);
    this.drawTrail(trail, frame);
    this.drawTeachingSignal(frame);
    this.drawAlignment(frame);
    this.drawCenter(frame);
    this.drawParticle(frame);
    this.drawSpectrum(frame, bounds.width, bounds.height);
    this.drawModelState(frame, bounds.width, bounds.height);
  }
}

const smoothVisual = (value) => value * value * (3 - 2 * value);
