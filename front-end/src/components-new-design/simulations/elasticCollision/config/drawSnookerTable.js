const roundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
};

/** Draws the baize, timber rail, cushions, sights, and six pocket openings. */
const drawSnookerTable = (ctx, canvas, margin, pockets) => {
    const width = canvas.width - 2 * margin;
    const height = canvas.height - 2 * margin;
    const railWidth = Math.max(12, margin * 0.72);

    ctx.save();
    const wood = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    wood.addColorStop(0, '#6e3e1e');
    wood.addColorStop(0.48, '#2e170b');
    wood.addColorStop(1, '#754524');
    roundedRect(ctx, margin - railWidth, margin - railWidth, width + 2 * railWidth, height + 2 * railWidth, railWidth * 0.72);
    ctx.fillStyle = wood;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.52)';
    ctx.shadowBlur = 22;
    ctx.fill();
    ctx.shadowBlur = 0;

    const felt = ctx.createRadialGradient(canvas.width * 0.45, canvas.height * 0.38, 0, canvas.width / 2, canvas.height / 2, canvas.width * 0.7);
    felt.addColorStop(0, '#16814f');
    felt.addColorStop(0.62, '#075f39');
    felt.addColorStop(1, '#034329');
    roundedRect(ctx, margin, margin, width, height, Math.max(8, margin * 0.24));
    ctx.fillStyle = felt;
    ctx.fill();
    ctx.strokeStyle = '#0b8c56';
    ctx.lineWidth = Math.max(4, railWidth * 0.42);
    ctx.stroke();

    // Small cushion sights add table scale without competing with the balls.
    ctx.fillStyle = 'rgba(238, 218, 148, 0.64)';
    for (let i = 1; i < 8; i += 1) {
        const x = margin + width * i / 8;
        [margin - railWidth * 0.48, canvas.height - margin + railWidth * 0.48].forEach((y) => {
            ctx.beginPath();
            ctx.arc(x, y, 1.8, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    pockets.forEach((pocket) => {
        const canvasY = canvas.height - pocket.y;
        const opening = ctx.createRadialGradient(pocket.x - pocket.radius * 0.18, canvasY - pocket.radius * 0.2, 0, pocket.x, canvasY, pocket.radius);
        opening.addColorStop(0, '#020302');
        opening.addColorStop(0.72, '#050706');
        opening.addColorStop(1, '#15110c');
        ctx.beginPath();
        ctx.arc(pocket.x, canvasY, pocket.radius, 0, Math.PI * 2);
        ctx.fillStyle = opening;
        ctx.fill();
        ctx.strokeStyle = 'rgba(190, 142, 76, 0.5)';
        ctx.lineWidth = Math.max(1.5, pocket.radius * 0.12);
        ctx.stroke();
    });
    ctx.restore();
};

export default drawSnookerTable;
