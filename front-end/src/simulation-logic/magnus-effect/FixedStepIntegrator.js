/** Keeps the physical result independent of the browser's rendering frame rate. */
export default class FixedStepIntegrator {
  constructor(timeStep) {
    this.timeStep = timeStep;
    this.accumulator = 0;
  }

  reset() {
    this.accumulator = 0;
  }

  advance(elapsedSeconds, step) {
    // Avoid a simulation jump after returning from a background browser tab.
    this.accumulator += Math.min(elapsedSeconds, 0.08);
    while (this.accumulator >= this.timeStep) {
      step(this.timeStep);
      this.accumulator -= this.timeStep;
    }
  }
}
