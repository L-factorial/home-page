import { add, leftPerpendicular, magnitude, normalize, scale } from './Vector2';

export default class MagnusPhysics {
  constructor(parameters) {
    this.parameters = parameters;
  }

  setParameters(parameters) {
    this.parameters = parameters;
  }

  forcesFor(state) {
    const p = this.parameters;
    const speed = magnitude(state.velocity);
    const area = Math.PI * p.ballRadius * p.ballRadius;
    const velocityDirection = normalize(state.velocity);
    const normal = leftPerpendicular(velocityDirection);
    const spinDirection = Math.sign(state.spin);
    const spinRatio = speed < 1e-9 ? 0 : Math.abs(state.spin) * p.ballRadius / speed;
    const coefficient = Math.min(
      p.maximumMagnusCoefficient,
      p.magnusCoefficientScale * spinRatio
    );

    const magnusMagnitude = coefficient * p.airDensity * area * speed * speed * p.magnusStrength;
    const magnusForce = scale(normal, spinDirection * magnusMagnitude);

    const dragMagnitude = p.dragEnabled
      ? 0.5 * p.dragCoefficient * p.airDensity * area * speed * speed
      : 0;
    const dragForce = scale(velocityDirection, -dragMagnitude);
    const gravityForce = p.gravityEnabled ? { x: 0, y: -p.ballMass * p.gravity } : { x: 0, y: 0 };
    const totalForce = add(add(magnusForce, dragForce), gravityForce);

    return {
      speed,
      coefficient,
      magnusForce,
      magnusMagnitude,
      dragForce,
      gravityForce,
      acceleration: scale(totalForce, 1 / p.ballMass),
    };
  }
}
