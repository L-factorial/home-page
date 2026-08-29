import Particle from './../../../../simulation-logic/elastic-collision/Particle';

/**
 * A snooker-specific visual treatment layered on the regular elastic particle.
 * Movement, mass, and collision handling remain inherited from Particle; only
 * canvas rendering changes here so other collision demonstrations are unaffected.
 */
export default class SnookerBallParticle extends Particle {
    draw(ctx, height) {
        const progress = this.potted ? Math.min(1, this.potProgress || 0) : 0;
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const target = this.pocket || { x: this.rx, y: this.ry };
        const start = this.potStart || { x: this.rx, y: this.ry };
        const x = start.x + (target.x - start.x) * easedProgress;
        const worldY = start.y + (target.y - start.y) * easedProgress;
        const y = height - worldY;
        const radius = this.radius * (1 - easedProgress * 0.82);

        ctx.save();
        ctx.globalAlpha = 1 - easedProgress * 0.92;

        // A restrained floor shadow visually separates the ball from the cloth.
        ctx.beginPath();
        ctx.ellipse(
            x + radius * 0.12,
            y + radius * 0.68,
            radius * 0.72,
            radius * 0.28,
            0,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = 'rgba(0, 0, 0, 0.34)';
        ctx.filter = `blur(${Math.max(1, radius * 0.12)}px)`;
        ctx.fill();
        ctx.filter = 'none';

        // Off-centre lighting creates a spherical, polished lacquer appearance.
        const shell = ctx.createRadialGradient(
            x - radius * 0.38,
            y - radius * 0.44,
            radius * 0.04,
            x + radius * 0.08,
            y + radius * 0.12,
            radius * 1.08
        );
        shell.addColorStop(0, this.color.highlight);
        shell.addColorStop(0.28, this.color.base);
        shell.addColorStop(0.76, this.color.shadow);
        shell.addColorStop(1, this.color.edge);

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = shell;
        ctx.fill();

        // Subtle edge reflections and two highlights suggest a glossy finish.
        const rim = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
        rim.addColorStop(0, 'rgba(255, 255, 255, 0.58)');
        rim.addColorStop(0.42, 'rgba(255, 255, 255, 0.05)');
        rim.addColorStop(1, 'rgba(0, 0, 0, 0.46)');
        ctx.strokeStyle = rim;
        ctx.lineWidth = Math.max(1, radius * 0.065);
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(
            x - radius * 0.34,
            y - radius * 0.4,
            radius * 0.2,
            radius * 0.11,
            -0.62,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x - radius * 0.1, y - radius * 0.12, radius * 0.07, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.24)';
        ctx.fill();

        if (this.withText && !this.potted) {
            const badgeRadius = radius * 0.34;
            ctx.beginPath();
            ctx.arc(x, y, badgeRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(250, 247, 226, 0.95)';
            ctx.fill();
            ctx.fillStyle = '#172019';
            ctx.font = `700 ${Math.max(7, radius * 0.42)}px system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(String(this.id), x, y + radius * 0.02);
        }
        ctx.restore();
    }
}
