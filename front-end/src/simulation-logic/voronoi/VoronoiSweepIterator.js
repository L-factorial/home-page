const clipPolygon = (polygon, site, other) => {
  const midpoint = { x: (site.x + other.x) / 2, y: (site.y + other.y) / 2 };
  const normal = { x: other.x - site.x, y: other.y - site.y };
  const side = (point) => (point.x - midpoint.x) * normal.x + (point.y - midpoint.y) * normal.y;
  const output = [];
  for (let index = 0; index < polygon.length; index += 1) {
    const start = polygon[index];
    const end = polygon[(index + 1) % polygon.length];
    const startSide = side(start);
    const endSide = side(end);
    if (startSide <= 0) output.push(start);
    if ((startSide <= 0) !== (endSide <= 0)) {
      const ratio = startSide / (startSide - endSide);
      output.push({ x: start.x + (end.x - start.x) * ratio, y: start.y + (end.y - start.y) * ratio });
    }
  }
  return output;
};

export default class VoronoiSweepIterator {
  constructor(points, bounds) {
    if (!Array.isArray(points) || points.length === 0) throw new TypeError('Voronoi requires at least one point.');
    this.points = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
    this.bounds = bounds;
    this.index = 0;
  }

  hasNext() { return this.index < this.points.length; }

  next() {
    if (!this.hasNext()) throw new RangeError('Voronoi sweep is complete.');
    this.index += 1;
    const activeSites = this.points.slice(0, this.index);
    const cells = activeSites.map((site) => {
      let polygon = [
        { x: this.bounds.minX, y: this.bounds.minY }, { x: this.bounds.maxX, y: this.bounds.minY },
        { x: this.bounds.maxX, y: this.bounds.maxY }, { x: this.bounds.minX, y: this.bounds.maxY },
      ];
      for (const other of activeSites) {
        if (other !== site) polygon = clipPolygon(polygon, site, other);
      }
      return { site, polygon };
    });
    return {
      step: this.index,
      totalSteps: this.points.length,
      sweepX: activeSites[activeSites.length - 1].x,
      activeSites,
      pendingSites: this.points.slice(this.index),
      cells,
      complete: !this.hasNext(),
    };
  }
}
