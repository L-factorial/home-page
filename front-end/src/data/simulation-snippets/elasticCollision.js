export default String.raw`# Elastic collision

Each frame advances the particles in small substeps. Nearby circles are tested for overlap, separated if necessary, and given an elastic impulse only when they are moving toward each other.

    // A smaller step reduces the chance of fast particles passing through one another.
    const substeps = 3;
    const dt = frameTime / substeps;

    for (let step = 0; step < substeps; step++) {
      particles.forEach(resolveWallAndParticleCollisions);
      particles.forEach((particle) => particle.move(dt));
      rebuildSpatialGrid(); // Keep neighbour lookups synchronized with positions.
    }

The collision normal points from one center to the other. The relative velocity projected onto that normal tells us whether the circles are approaching.

    const nx = (b.x - a.x) / centerDistance;
    const ny = (b.y - a.y) / centerDistance;
    const closingSpeed = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;

    separateOverlap(a, b, nx, ny); // Prevent interlocking after a collision.
    if (closingSpeed >= 0) return; // They are already moving apart.

    const impulse = (2 * closingSpeed) / (1 / a.mass + 1 / b.mass);
    a.vx += impulse * nx / a.mass;
    a.vy += impulse * ny / a.mass;
    b.vx -= impulse * nx / b.mass;
    b.vy -= impulse * ny / b.mass;

This preserves momentum and kinetic energy for an ideal elastic collision while positional correction keeps the numerical simulation stable.`;
