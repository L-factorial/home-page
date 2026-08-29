export default String.raw`# Magnus effect — why a soccer ball curves

A spinning ball curves because its motion through air creates a force perpendicular to its velocity. The animation integrates that force over time; the path is not hardcoded.

## Magnus force

For velocity **v** and angular velocity **ω**, the sideways direction comes from a perpendicular to the normalized velocity. The sign of the spin selects which side.

    const speed = magnitude(velocity);
    const velocityDirection = normalize(velocity);
    const normal = { x: -velocityDirection.y, y: velocityDirection.x };
    const spinRatio = Math.abs(omega) * ballRadius / speed;
    const coefficient = clamp(k * spinRatio, 0, maximumCoefficient);

    const forceMagnitude = coefficient * airDensity * area * speed * speed;
    const magnusForce = scale(normal, Math.sign(omega) * forceMagnitude);

The dot product of the Magnus force and velocity is approximately zero, confirming that the force is perpendicular to the current flight direction. Reversing spin reverses the normal force.

## Numerical integration

The browser may render at different frame rates, so physics advances with a fixed 1/120-second timestep. Semi-implicit Euler updates velocity before position.

    acceleration = totalForce / mass;
    velocity += acceleration * dt;
    position += velocity * dt;
    rotationAngle += angularVelocity * dt;

The visible trajectory is the history of these integrated positions. Gravity and drag are optional additional forces.

## Iterator-driven animation

Trajectory and airflow modes use separate iterators. Each frame, React requests data and the Canvas renderer only draws what it receives.

    function animate(timestamp) {
      const frame = activeIterator.next(timestamp);
      renderer.render(frame.value);
      requestAnimationFrame(animate);
    }

Airflow mode is an educational relative-speed model, not computational fluid dynamics. It shows how surface rotation reinforces airflow on one side, opposes it on the other, and reverses when spin reverses.`;
