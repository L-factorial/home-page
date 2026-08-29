import defaults from '../../../../data/magnusEffectDefaults';
import AirflowAnimationIterator from '../../../../simulation-logic/magnus-effect/AirflowAnimationIterator';
import TrajectoryAnimationIterator from '../../../../simulation-logic/magnus-effect/TrajectoryAnimationIterator';
import MagnusEffectRenderer from '../MagnusEffectRenderer';
import soccerBallImage from '../../../../img/soccer-ball-realistic.png';

export default class MagnusEffectConfig {
  constructor(canvas, context, controls) {
    this.renderer = new MagnusEffectRenderer(canvas, context);
    const ballImage = new Image();
    ballImage.src = soccerBallImage;
    this.renderer.setBallImage(ballImage);
    this.mode = controls.mode;
    this.paused = controls.paused;
    const parameters = this.parametersFrom(controls);
    this.trajectoryIterator = new TrajectoryAnimationIterator(parameters);
    this.airflowIterator = new AirflowAnimationIterator(parameters);
  }

  parametersFrom(controls) {
    return {
      ...defaults,
      initialSpin: controls.spin,
      initialSpeed: controls.speed,
      magnusStrength: controls.magnusStrength,
      gravityEnabled: controls.gravityEnabled,
      dragEnabled: controls.dragEnabled,
    };
  }

  updateControls(controls) {
    this.mode = controls.mode;
    this.paused = controls.paused;
    const parameters = this.parametersFrom(controls);
    this.trajectoryIterator.setParameters(parameters);
    this.airflowIterator.setParameters(parameters);
    this.trajectoryIterator.setPaused(this.paused);
    this.airflowIterator.setPaused(this.paused);
  }

  setPaused(paused) {
    this.paused = paused;
    this.trajectoryIterator.setPaused(paused);
    this.airflowIterator.setPaused(paused);
  }

  restart() {
    this.trajectoryIterator.restart();
    this.airflowIterator.restart();
  }

  renderNextFrame(timestamp) {
    const iterator = this.mode === 'airflow' ? this.airflowIterator : this.trajectoryIterator;
    const frame = iterator.next(timestamp);
    if (!frame.done) this.renderer.render(frame.value);
  }
}
