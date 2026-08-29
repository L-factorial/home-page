export default class BallState {
  constructor({ position, velocity, spinRevolutionsPerSecond }) {
    this.position = { ...position };
    this.velocity = { ...velocity };
    this.spin = spinRevolutionsPerSecond * 2 * Math.PI;
    this.rotationAngle = 0;
    this.elapsedTime = 0;
  }

  clone() {
    const copy = new BallState({
      position: this.position,
      velocity: this.velocity,
      spinRevolutionsPerSecond: this.spin / (2 * Math.PI),
    });
    copy.rotationAngle = this.rotationAngle;
    copy.elapsedTime = this.elapsedTime;
    return copy;
  }
}
