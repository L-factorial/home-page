import BallState from './BallState';
import FixedStepIntegrator from './FixedStepIntegrator';
import MagnusPhysics from './MagnusPhysics';
import { add, scale } from './Vector2';

export default class TrajectoryAnimationIterator {
  constructor(parameters) {
    this.parameters = { ...parameters };
    this.physics = new MagnusPhysics(this.parameters);
    this.integrator = new FixedStepIntegrator(parameters.fixedTimeStep);
    this.paused = false;
    this.lastTimestamp = null;
    this.restart();
  }

  createInitialState() {
    return new BallState({
      position: { x: this.parameters.worldBounds.left + 5, y: 0 },
      velocity: { x: this.parameters.initialSpeed, y: 0 },
      spinRevolutionsPerSecond: this.parameters.initialSpin,
    });
  }

  restart() {
    this.state = this.createInitialState();
    this.trace = [{ ...this.state.position }];
    this.lastTimestamp = null;
    this.integrator.reset();
  }

  setPaused(paused) {
    this.paused = paused;
    this.lastTimestamp = null;
  }

  setParameters(parameters) {
    this.parameters = { ...parameters };
    this.physics.setParameters(this.parameters);
    this.integrator = new FixedStepIntegrator(parameters.fixedTimeStep);
    this.restart();
  }

  isOutsideWorld() {
    const { position } = this.state;
    const bounds = this.parameters.worldBounds;
    return position.x > bounds.right + 5
      || position.y > bounds.top + 8
      || position.y < bounds.bottom - 8;
  }

  integrate(timeStep) {
    const forces = this.physics.forcesFor(this.state);
    // Semi-implicit Euler: update velocity before position for better stability.
    this.state.velocity = add(this.state.velocity, scale(forces.acceleration, timeStep));
    this.state.position = add(this.state.position, scale(this.state.velocity, timeStep));
    this.state.rotationAngle += this.state.spin * timeStep;
    this.state.elapsedTime += timeStep;
    this.trace.push({ ...this.state.position });
    if (this.trace.length > 1800) this.trace.shift();
  }

  next(timestamp) {
    if (this.lastTimestamp !== null && !this.paused) {
      this.integrator.advance((timestamp - this.lastTimestamp) / 1000, (dt) => this.integrate(dt));
      if (this.isOutsideWorld()) this.restart();
    }
    this.lastTimestamp = timestamp;

    const forces = this.physics.forcesFor(this.state);
    const spinRevolutionsPerSecond = this.state.spin / (2 * Math.PI);
    const fastSide = spinRevolutionsPerSecond > 0
      ? 'top'
      : spinRevolutionsPerSecond < 0 ? 'bottom' : null;
    const surfaceSpeed = Math.abs(this.state.spin) * this.parameters.ballRadius;
    return {
      done: false,
      value: {
        mode: 'trajectory',
        ball: {
          position: { ...this.state.position },
          radius: this.parameters.ballRadius,
          rotationAngle: this.state.rotationAngle,
        },
        trajectory: this.trace.map((point) => ({ ...point })),
        velocityVector: { ...this.state.velocity },
        magnusVector: { ...forces.magnusForce },
        speed: forces.speed,
        spin: this.state.spin,
        magnusMagnitude: forces.magnusMagnitude,
        airflowPhase: (this.state.elapsedTime * 0.75) % 1,
        fastSide,
        slowSide: fastSide === null ? null : fastSide === 'top' ? 'bottom' : 'top',
        relativeSpeeds: {
          fast: forces.speed + surfaceSpeed,
          slow: Math.max(0, forces.speed - surfaceSpeed),
        },
        worldBounds: this.parameters.worldBounds,
        paused: this.paused,
      },
    };
  }
}
