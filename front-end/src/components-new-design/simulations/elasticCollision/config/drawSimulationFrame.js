const roundedRectPath = (ctx, x, y, width, height, radius) => {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
};

const drawSimulationFrame = (ctx, canvas, margin) => {
    const x = margin;
    const y = margin;
    const width = canvas.width - 2 * margin;
    const height = canvas.height - 2 * margin;
    const radius = Math.max(10, Math.min(22, margin * 0.8));
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);

    gradient.addColorStop(0, 'rgba(213, 255, 95, 0.72)');
    gradient.addColorStop(0.5, 'rgba(143, 190, 159, 0.35)');
    gradient.addColorStop(1, 'rgba(213, 255, 95, 0.58)');

    ctx.save();
    roundedRectPath(ctx, x, y, width, height, radius);
    ctx.lineWidth = Math.max(1.5, Math.min(3, margin * 0.12));
    ctx.strokeStyle = gradient;
    ctx.shadowColor = 'rgba(213, 255, 95, 0.2)';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.restore();
};

export default drawSimulationFrame;
