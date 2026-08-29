import { magnitude, normalize } from '../../../simulation-logic/magnus-effect/Vector2';

export default class MagnusEffectRenderer {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.ballImage = null;
  }

  setBallImage(image) {
    this.ballImage = image;
  }

  drawBackground() {
    const ctx = this.context;
    const gradient = ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, '#0c2118');
    gradient.addColorStop(0.55, '#102b20');
    gradient.addColorStop(1, '#07120d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += 44) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvas.height);
      ctx.stroke();
    }
  }

  worldToCanvas(point, bounds) {
    const padding = 46;
    return {
      x: padding + (point.x - bounds.left) / (bounds.right - bounds.left) * (this.canvas.width - 2 * padding),
      y: padding + (bounds.top - point.y) / (bounds.top - bounds.bottom) * (this.canvas.height - 2 * padding),
    };
  }

  drawArrow(origin, vector, length, color, label) {
    const ctx = this.context;
    const direction = normalize(vector);
    if (magnitude(direction) < 1e-9) return;
    const end = { x: origin.x + direction.x * length, y: origin.y - direction.y * length };
    const angle = Math.atan2(end.y - origin.y, end.x - origin.x);

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(end.x - 10 * Math.cos(angle - Math.PI / 6), end.y - 10 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(end.x - 10 * Math.cos(angle + Math.PI / 6), end.y - 10 * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.fillText(label, end.x + 7, end.y - 7);
    ctx.restore();
  }

  drawSpinIndicator(center, radius, spin) {
    if (Math.abs(spin) < 1e-9) return;

    const ctx = this.context;
    const clockwise = spin > 0;
    const startAngle = clockwise ? Math.PI * 0.18 : Math.PI * 0.82;
    const endAngle = clockwise ? Math.PI * 1.48 : -Math.PI * 0.48;
    const orbitRadius = radius * 1.28;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 224, 122, 0.92)';
    ctx.fillStyle = 'rgba(255, 224, 122, 0.92)';
    ctx.lineWidth = Math.max(2, radius * 0.035);
    ctx.beginPath();
    ctx.arc(center.x, center.y, orbitRadius, startAngle, endAngle, !clockwise);
    ctx.stroke();

    const tangentAngle = endAngle + (clockwise ? Math.PI / 2 : -Math.PI / 2);
    const tip = {
      x: center.x + orbitRadius * Math.cos(endAngle),
      y: center.y + orbitRadius * Math.sin(endAngle),
    };
    ctx.beginPath();
    ctx.moveTo(tip.x, tip.y);
    ctx.lineTo(tip.x - 10 * Math.cos(tangentAngle - Math.PI / 6), tip.y - 10 * Math.sin(tangentAngle - Math.PI / 6));
    ctx.lineTo(tip.x - 10 * Math.cos(tangentAngle + Math.PI / 6), tip.y - 10 * Math.sin(tangentAngle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
    ctx.font = '700 10px system-ui, sans-serif';
    ctx.fillText('SPIN', center.x - radius * 0.28, center.y - radius * 1.45);
    ctx.restore();
  }

  drawPressureExplanation(center, radius, frame, compact = false) {
    if (frame.fastSide === null) return;

    const ctx = this.context;
    const lowDirection = frame.fastSide === 'top' ? -1 : 1;
    const highDirection = -lowDirection;
    const fieldWidth = compact ? radius * 2.9 : radius * 4.1;
    const fieldHeight = compact ? radius * 0.72 : radius * 0.95;

    const drawField = (direction, color) => {
      const y = center.y + direction * radius * 1.08;
      const gradient = ctx.createRadialGradient(center.x, y, 0, center.x, y, fieldWidth * 0.55);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color.replace(/0\.2[08]\)/, '0)'));
      ctx.fillStyle = gradient;
      ctx.fillRect(center.x - fieldWidth / 2, y - fieldHeight / 2, fieldWidth, fieldHeight);
    };

    ctx.save();
    drawField(lowDirection, 'rgba(75, 184, 255, 0.28)');
    drawField(highDirection, 'rgba(255, 122, 100, 0.28)');

    // Short arrows show the net pressure-gradient push from the high-pressure
    // side toward the low-pressure side; they do not represent added torque.
    const arrowCount = compact ? 3 : 5;
    for (let index = 0; index < arrowCount; index += 1) {
      const offsetX = (index - (arrowCount - 1) / 2) * radius * (compact ? 0.58 : 0.72);
      const fromY = center.y + highDirection * radius * 1.42;
      const toY = center.y + lowDirection * radius * 1.42;
      const alpha = 0.28 + (1 - Math.abs(index - (arrowCount - 1) / 2) / arrowCount) * 0.28;
      ctx.strokeStyle = `rgba(255, 178, 151, ${alpha})`;
      ctx.fillStyle = `rgba(139, 218, 255, ${Math.min(0.9, alpha + 0.2)})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(center.x + offsetX, fromY);
      ctx.lineTo(center.x + offsetX, toY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(center.x + offsetX, toY);
      ctx.lineTo(center.x + offsetX - 4, toY - lowDirection * 8);
      ctx.lineTo(center.x + offsetX + 4, toY - lowDirection * 8);
      ctx.closePath();
      ctx.fill();
    }

    const labelX = compact ? center.x - radius * 1.7 : center.x - radius * 1.85;
    ctx.textAlign = 'right';
    ctx.font = `700 ${compact ? 8 : 10}px system-ui, sans-serif`;
    ctx.fillStyle = '#8ed7ff';
    ctx.fillText('LOW PRESSURE', labelX, center.y + lowDirection * radius * (compact ? 1.42 : 1.7));
    ctx.fillStyle = '#ffad99';
    ctx.fillText('HIGH PRESSURE', labelX, center.y + highDirection * radius * (compact ? 1.42 : 1.7));
    ctx.restore();
  }

  polygon(centerX, centerY, radius, sides, rotation) {
    const ctx = this.context;
    ctx.beginPath();
    for (let i = 0; i < sides; i += 1) {
      const angle = rotation + i * 2 * Math.PI / sides;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  drawSoccerBall(center, radius, rotationAngle) {
    const ctx = this.context;

    if (this.ballImage?.complete && this.ballImage.naturalWidth > 0) {
      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.rotate(rotationAngle);
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = radius * 0.62;
      ctx.shadowOffsetY = radius * 0.24;
      ctx.drawImage(this.ballImage, -radius, -radius, radius * 2, radius * 2);
      ctx.restore();

      // A stationary highlight keeps the sphere grounded in the scene even
      // while the photographic panel texture rotates.
      ctx.save();
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
      const highlight = ctx.createRadialGradient(
        center.x - radius * 0.38,
        center.y - radius * 0.42,
        0,
        center.x,
        center.y,
        radius
      );
      highlight.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      highlight.addColorStop(0.48, 'rgba(255, 255, 255, 0)');
      highlight.addColorStop(1, 'rgba(0, 0, 0, 0.12)');
      ctx.fillStyle = highlight;
      ctx.fill();
      ctx.restore();
      return;
    }

    // Procedural fallback shown only while the photographic asset loads.
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.48)';
    ctx.shadowBlur = radius * 0.6;
    ctx.shadowOffsetY = radius * 0.25;

    const shell = ctx.createRadialGradient(-radius * 0.35, -radius * 0.4, radius * 0.08, 0, 0, radius);
    shell.addColorStop(0, '#ffffff');
    shell.addColorStop(0.62, '#edf0eb');
    shell.addColorStop(1, '#9ca59f');
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = shell;
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.clip();

    ctx.rotate(rotationAngle);
    const panelColor = '#17201c';
    const seamColor = 'rgba(28, 39, 33, 0.58)';
    const centralRadius = radius * 0.25;
    this.polygon(0, 0, centralRadius, 5, -Math.PI / 2);
    ctx.fillStyle = panelColor;
    ctx.fill();

    for (let i = 0; i < 5; i += 1) {
      const angle = -Math.PI / 2 + i * 2 * Math.PI / 5;
      const patchX = Math.cos(angle) * radius * 0.72;
      const patchY = Math.sin(angle) * radius * 0.72;
      this.polygon(patchX, patchY, radius * 0.2, 5, angle);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * centralRadius, Math.sin(angle) * centralRadius);
      ctx.lineTo(patchX - Math.cos(angle) * radius * 0.2, patchY - Math.sin(angle) * radius * 0.2);
      ctx.strokeStyle = seamColor;
      ctx.lineWidth = Math.max(1, radius * 0.035);
      ctx.stroke();
    }

    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  drawTrajectoryAirflow(center, radius, frame) {
    const ctx = this.context;
    const lines = [-1.3, -0.82, -0.42, 0.42, 0.82, 1.3];

    lines.forEach((normalizedY, index) => {
      const side = normalizedY < 0 ? 'top' : 'bottom';
      const speedFactor = frame.fastSide === null
        ? 1
        : side === frame.fastSide ? 1.45 : 0.68;
      const startX = center.x + radius * 2.35;
      const endX = center.x - radius * 2.35;
      const baseY = center.y + normalizedY * radius;
      const bend = Math.sign(normalizedY) * radius * 0.24;

      ctx.beginPath();
      ctx.moveTo(startX, baseY);
      ctx.bezierCurveTo(
        center.x + radius * 0.85,
        baseY + bend,
        center.x - radius * 0.85,
        baseY + bend,
        endX,
        baseY
      );
      ctx.strokeStyle = speedFactor > 1
        ? 'rgba(112, 207, 255, 0.68)'
        : 'rgba(189, 211, 199, 0.3)';
      ctx.lineWidth = speedFactor > 1 ? 1.7 : 1;
      ctx.stroke();

      // Air travels opposite the ball. Faster-side particles advance farther
      // along an identical elapsed-time interval.
      const progress = (frame.airflowPhase * speedFactor + index * 0.14) % 1;
      const particleX = startX + (endX - startX) * progress;
      const curveAmount = Math.sin(progress * Math.PI);
      const particleY = baseY + bend * curveAmount;
      ctx.beginPath();
      ctx.arc(particleX, particleY, speedFactor > 1 ? 2.7 : 1.8, 0, Math.PI * 2);
      ctx.fillStyle = speedFactor > 1 ? '#8ed7ff' : '#afc1b6';
      ctx.fill();
    });

    ctx.font = '600 9px system-ui, sans-serif';
    ctx.textAlign = 'left';
    if (frame.fastSide === null) {
      ctx.fillStyle = 'rgba(220, 232, 224, 0.7)';
      ctx.fillText('equal airflow', center.x + radius * 1.25, center.y - radius * 1.55);
    } else {
      const fastY = frame.fastSide === 'top' ? center.y - radius * 1.55 : center.y + radius * 1.72;
      const slowY = frame.slowSide === 'top' ? center.y - radius * 1.55 : center.y + radius * 1.72;
      ctx.fillStyle = '#8ed7ff';
      ctx.fillText('fast airflow', center.x + radius * 1.2, fastY);
      ctx.fillStyle = '#ffb09f';
      ctx.fillText('slow airflow', center.x + radius * 1.2, slowY);
    }
  }

  renderTrajectory(frame) {
    const ctx = this.context;
    if (frame.trajectory.length > 1) {
      const first = this.worldToCanvas(frame.trajectory[0], frame.worldBounds);
      ctx.beginPath();
      ctx.moveTo(first.x, first.y);
      frame.trajectory.slice(1).forEach((point) => {
        const canvasPoint = this.worldToCanvas(point, frame.worldBounds);
        ctx.lineTo(canvasPoint.x, canvasPoint.y);
      });
      ctx.strokeStyle = '#d5ff5f';
      ctx.lineWidth = 2.3;
      ctx.shadowColor = 'rgba(213, 255, 95, 0.38)';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    const center = this.worldToCanvas(frame.ball.position, frame.worldBounds);
    const radius = Math.max(18, Math.min(this.canvas.width, this.canvas.height) * 0.038);
    this.drawPressureExplanation(center, radius, frame, true);
    this.drawTrajectoryAirflow(center, radius, frame);
    this.drawSoccerBall(center, radius, frame.ball.rotationAngle);
    this.drawSpinIndicator(center, radius, frame.spin);
    this.drawArrow(center, frame.velocityVector, 72, '#8ed7ff', 'V');
    this.drawArrow(center, frame.magnusVector, 58, '#ff8aa1', 'Fₘ');

    ctx.fillStyle = 'rgba(239, 247, 241, 0.72)';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText(`${frame.speed.toFixed(1)} m/s`, 22, 30);
    ctx.fillText(`${(frame.spin / (2 * Math.PI)).toFixed(1)} rev/s`, 22, 49);
  }

  airflowPoint(progress, normalizedY, center, radius) {
    const x = center.x + radius * 3.2 - progress * radius * 6.4;
    const baseY = normalizedY * radius * 1.55;
    const distanceX = (x - center.x) / radius;
    const direction = normalizedY === 0 ? 1 : Math.sign(normalizedY);
    const influence = Math.exp(-distanceX * distanceX * 1.2);
    const clearance = Math.max(0, radius * 1.12 - Math.abs(baseY));
    return { x, y: center.y + baseY + direction * clearance * influence };
  }

  renderAirflow(frame) {
    const ctx = this.context;
    const center = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    const radius = Math.max(58, Math.min(this.canvas.width, this.canvas.height) * 0.15);

    // Soft color fields indicate lower pressure on the fast side and higher
    // pressure on the slow side without implying a CFD calculation.
    const fastY = frame.fastSide === 'top' ? center.y - radius : center.y + radius;
    const slowY = frame.slowSide === 'top' ? center.y - radius : center.y + radius;
    if (frame.fastSide !== null) {
      const fastGlow = ctx.createRadialGradient(center.x, fastY, 0, center.x, fastY, radius * 1.4);
      fastGlow.addColorStop(0, 'rgba(80, 183, 255, 0.17)');
      fastGlow.addColorStop(1, 'rgba(80, 183, 255, 0)');
      ctx.fillStyle = fastGlow;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      const slowGlow = ctx.createRadialGradient(center.x, slowY, 0, center.x, slowY, radius * 1.4);
      slowGlow.addColorStop(0, 'rgba(255, 135, 112, 0.13)');
      slowGlow.addColorStop(1, 'rgba(255, 135, 112, 0)');
      ctx.fillStyle = slowGlow;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    frame.streamlines.forEach((streamline) => {
      ctx.beginPath();
      for (let step = 0; step <= 60; step += 1) {
        const point = this.airflowPoint(step / 60, streamline.normalizedY, center, radius);
        if (step === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      }
      ctx.strokeStyle = streamline.speedFactor > 1 ? 'rgba(119, 210, 255, 0.52)' : 'rgba(205, 226, 215, 0.24)';
      ctx.lineWidth = streamline.speedFactor > 1 ? 1.8 : 1;
      ctx.stroke();

      const particle = this.airflowPoint(streamline.particleProgress, streamline.normalizedY, center, radius);
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, streamline.speedFactor > 1 ? 3 : 2, 0, Math.PI * 2);
      ctx.fillStyle = streamline.speedFactor > 1 ? '#8ed7ff' : '#b7c8be';
      ctx.fill();
    });

    this.drawPressureExplanation(center, radius, frame);
    this.drawSoccerBall(center, radius, frame.ball.rotationAngle);
    this.drawSpinIndicator(center, radius, frame.spin);
    this.drawArrow({ x: center.x, y: center.y - radius - 48 }, frame.airflowVector, 76, '#8ed7ff', 'relative airflow');
    this.drawArrow(center, frame.magnusVector, radius * 1.05, '#ff8aa1', 'Fₘ');

    ctx.font = '600 11px system-ui, sans-serif';
    if (frame.fastSide === null) {
      ctx.fillStyle = '#b7c8be';
      ctx.fillText('EQUAL AIRFLOW · NO SIDE FORCE', center.x + radius * 1.18, center.y);
    } else {
      ctx.fillStyle = '#8ed7ff';
      ctx.fillText(`FAST · ${frame.relativeSpeeds.fast.toFixed(1)} m/s`, center.x + radius * 1.25, fastY);
      ctx.fillStyle = '#ffb09f';
      ctx.fillText(`SLOW · ${frame.relativeSpeeds.slow.toFixed(1)} m/s`, center.x + radius * 1.25, slowY);
    }
  }

  render(frame) {
    this.drawBackground();
    if (frame.mode === 'airflow') this.renderAirflow(frame);
    else this.renderTrajectory(frame);
  }
}
