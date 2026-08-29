export default class FourierNepalRenderer {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
  }

  toCanvas(point) {
    const padding = Math.min(this.canvas.width, this.canvas.height) * 0.08;
    const scale = Math.min(
      (this.canvas.width - 2 * padding) / 2,
      (this.canvas.height - 2 * padding) / 2
    );
    return {
      x: this.canvas.width / 2 + point.x * scale,
      y: this.canvas.height / 2 - point.y * scale,
    };
  }

  drawPath(points, style, width) {
    if (points.length < 2) return;
    const ctx = this.context;
    const first = this.toCanvas(points[0]);
    ctx.beginPath();
    ctx.moveTo(first.x, first.y);
    for (let i = 1; i < points.length; i += 1) {
      const point = this.toCanvas(points[i]);
      ctx.lineTo(point.x, point.y);
    }
    ctx.strokeStyle = style;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  render(frame) {
    const ctx = this.context;
    const width = this.canvas.width;
    const height = this.canvas.height;
    ctx.clearRect(0, 0, width, height);

    const background = ctx.createRadialGradient(width * 0.55, height * 0.45, 0, width / 2, height / 2, width * 0.75);
    background.addColorStop(0, '#172b21');
    background.addColorStop(1, '#07100c');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    const scale = Math.min(width, height) * 0.42;
    ctx.save();
    ctx.lineCap = 'round';

    frame.vectors.forEach((vector, index) => {
      const start = this.toCanvas({ x: vector.x, y: vector.y });
      const end = this.toCanvas({ x: vector.endX, y: vector.endY });
      const radius = vector.radius * scale;

      // Very small circles become visual noise at high component counts, but
      // their vectors still contribute to the endpoint and traced curve.
      if (radius > 1.25 && index < 180) {
        ctx.beginPath();
        ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(150, 190, 166, 0.17)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = index < 24 ? 'rgba(213, 255, 95, 0.58)' : 'rgba(190, 218, 199, 0.2)';
      ctx.lineWidth = index < 24 ? 1.2 : 0.65;
      ctx.stroke();
    });
    ctx.restore();

    this.drawPath(frame.tracedPath, '#d5ff5f', 2.2);

    const endpoint = this.toCanvas(frame.endpoint);
    ctx.beginPath();
    ctx.arc(endpoint.x, endpoint.y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#d5ff5f';
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}
