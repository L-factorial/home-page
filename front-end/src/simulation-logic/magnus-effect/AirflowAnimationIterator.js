import BallState from './BallState';
import MagnusPhysics from './MagnusPhysics';

export default class AirflowAnimationIterator {
  constructor(parameters) {
    this.parameters = { ...parameters };
    this.physics = new MagnusPhysics(this.parameters);
    this.phase = 0;
    this.rotationAngle = 0;
    this.paused = false;
    this.lastTimestamp = null;
  }

  setPaused(paused) {
    this.paused = paused;
    this.lastTimestamp = null;
  }

  restart() {
    this.phase = 0;
    this.rotationAngle = 0;
    this.lastTimestamp = null;
  }

  setParameters(parameters) {
    this.parameters = { ...parameters };
    this.physics.setParameters(this.parameters);
    this.restart();
  }

  next(timestamp) {
    if (this.lastTimestamp !== null && !this.paused) {
      const elapsed = Math.min((timestamp - this.lastTimestamp) / 1000, 0.08);
      this.phase = (this.phase + elapsed * 0.34) % 1;
      this.rotationAngle += this.parameters.initialSpin * 2 * Math.PI * elapsed;
    }
    this.lastTimestamp = timestamp;

    const state = new BallState({
      position: { x: 0, y: 0 },
      velocity: { x: this.parameters.initialSpeed, y: 0 },
      spinRevolutionsPerSecond: this.parameters.initialSpin,
    });
    const forces = this.physics.forcesFor(state);
    const fastSide = this.parameters.initialSpin > 0
      ? 'top'
      : this.parameters.initialSpin < 0 ? 'bottom' : null;
    const surfaceSpeed = Math.abs(state.spin) * this.parameters.ballRadius;

    const streamlines = Array.from({ length: 9 }, (_, index) => {
      const normalizedY = (index - 4) / 4;
      const side = normalizedY < 0 ? 'top' : normalizedY > 0 ? 'bottom' : 'center';
      const speedFactor = fastSide === null
        ? 1
        : side === fastSide ? 1.35 : side === 'center' ? 1 : 0.72;
      return {
        normalizedY,
        speedFactor,
        particleProgress: (this.phase * speedFactor + index * 0.11) % 1,
      };
    });

    return {
      done: false,
      value: {
        mode: 'airflow',
        ball: { position: { x: 0, y: 0 }, radius: 1, rotationAngle: this.rotationAngle },
        streamlines,
        fastSide,
        slowSide: fastSide === null ? null : fastSide === 'top' ? 'bottom' : 'top',
        relativeSpeeds: {
          fast: this.parameters.initialSpeed + surfaceSpeed,
          slow: Math.max(0, this.parameters.initialSpeed - surfaceSpeed),
        },
        airflowVector: { x: -this.parameters.initialSpeed, y: 0 },
        magnusVector: { ...forces.magnusForce },
        spin: state.spin,
        paused: this.paused,
      },
    };
  }
}
