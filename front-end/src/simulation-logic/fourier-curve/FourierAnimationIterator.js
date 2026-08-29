/**
 * Owns animation time and trace state. Rendering code consumes one immutable
 * frame from next(timestamp) and never needs to know how Fourier math works.
 */
export default class FourierAnimationIterator {
  constructor(series, componentCount = 51) {
    this.series = series;
    this.durationSeconds = 14;
    this.componentCount = componentCount;
    this.components = series.selectComponents(componentCount);
    this.trace = [];
    this.time = 0;
    this.lastTimestamp = null;
    this.paused = false;
  }

  setComponentCount(componentCount) {
    this.componentCount = componentCount;
    this.components = this.series.selectComponents(componentCount);
    this.restart();
  }

  setPaused(paused) {
    this.paused = paused;
    this.lastTimestamp = null;
  }

  restart() {
    this.time = 0;
    this.trace = [];
    this.lastTimestamp = null;
  }

  next(timestamp) {
    if (this.lastTimestamp !== null && !this.paused) {
      const elapsedSeconds = Math.min((timestamp - this.lastTimestamp) / 1000, 0.05);
      this.time += elapsedSeconds / this.durationSeconds;
      if (this.time >= 1) {
        this.time %= 1;
        this.trace = [];
      }
    }
    this.lastTimestamp = timestamp;

    const { vectors, endpoint } = this.series.epicyclesAt(this.time, this.components);
    if (!this.paused) this.trace.push(endpoint);
    if (this.trace.length > 2400) this.trace.shift();

    return {
      done: false,
      value: {
        time: this.time,
        vectors,
        endpoint,
        tracedPath: [...this.trace],
        componentCount: this.components.length,
        paused: this.paused,
      },
    };
  }
}
