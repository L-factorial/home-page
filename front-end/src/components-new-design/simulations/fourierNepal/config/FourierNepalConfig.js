import nepalBoundary from '../../../../data/nepalBoundary';
import { projectBoundary, normalizeBoundary } from '../../../../simulation-logic/fourier-curve/BoundaryProjection';
import { resampleByArcLength } from '../../../../simulation-logic/fourier-curve/ArcLengthResampler';
import FourierSeries from '../../../../simulation-logic/fourier-curve/FourierSeries';
import FourierAnimationIterator from '../../../../simulation-logic/fourier-curve/FourierAnimationIterator';
import FourierNepalRenderer from '../FourierNepalRenderer';

export default class FourierNepalConfig {
  constructor(canvas, context, componentCount) {
    // Preprocessing and FFT happen once. Only series evaluation occurs per frame.
    const projected = projectBoundary(nepalBoundary);
    const uniformlySampled = resampleByArcLength(projected, 2048);
    const normalized = normalizeBoundary(uniformlySampled);
    this.iterator = new FourierAnimationIterator(
      new FourierSeries(normalized),
      componentCount
    );
    this.renderer = new FourierNepalRenderer(canvas, context);
  }

  renderNextFrame(timestamp) {
    const frame = this.iterator.next(timestamp);
    if (!frame.done) this.renderer.render(frame.value);
  }
}
