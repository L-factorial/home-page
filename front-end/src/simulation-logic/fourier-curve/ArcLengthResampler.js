const distance = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

/**
 * Resamples a closed polyline at equal distances along its perimeter.
 * FFT samples must represent equal increments of t; using raw GeoJSON vertices
 * would overweight detailed sections of the source polygon.
 */
export const resampleByArcLength = (inputPoints, sampleCount) => {
  if (inputPoints.length < 2) throw new Error('A boundary requires at least two points.');

  const points = [...inputPoints];
  const first = points[0];
  const last = points[points.length - 1];
  if (first.x !== last.x || first.y !== last.y) points.push({ ...first });

  const cumulativeLengths = [0];
  for (let i = 1; i < points.length; i += 1) {
    cumulativeLengths.push(cumulativeLengths[i - 1] + distance(points[i - 1], points[i]));
  }

  const perimeter = cumulativeLengths[cumulativeLengths.length - 1];
  const samples = [];
  let segment = 1;

  for (let sample = 0; sample < sampleCount; sample += 1) {
    const targetDistance = perimeter * sample / sampleCount;
    while (segment < cumulativeLengths.length - 1 && cumulativeLengths[segment] < targetDistance) {
      segment += 1;
    }

    const segmentStart = points[segment - 1];
    const segmentEnd = points[segment];
    const startDistance = cumulativeLengths[segment - 1];
    const segmentLength = cumulativeLengths[segment] - startDistance;
    const ratio = segmentLength === 0 ? 0 : (targetDistance - startDistance) / segmentLength;
    samples.push({
      x: segmentStart.x + (segmentEnd.x - segmentStart.x) * ratio,
      y: segmentStart.y + (segmentEnd.y - segmentStart.y) * ratio,
    });
  }

  return samples;
};
