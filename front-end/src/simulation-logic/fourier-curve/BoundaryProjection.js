/**
 * Projects a small geographic region onto a local Cartesian plane.
 * Longitude is compressed by cos(latitude) so east/west and north/south
 * distances remain comparable around Nepal's latitude.
 */
export const projectBoundary = (coordinates) => {
  const centerLongitude = coordinates.reduce((sum, point) => sum + point[0], 0) / coordinates.length;
  const centerLatitude = coordinates.reduce((sum, point) => sum + point[1], 0) / coordinates.length;
  const longitudeScale = Math.cos(centerLatitude * Math.PI / 180);

  return coordinates.map(([longitude, latitude]) => ({
    x: (longitude - centerLongitude) * longitudeScale,
    y: latitude - centerLatitude,
  }));
};

/** Centers the resampled curve and scales its largest dimension to two units. */
export const normalizeBoundary = (points) => {
  const centerX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const centerY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  const centered = points.map((point) => ({ x: point.x - centerX, y: point.y - centerY }));
  const extentX = Math.max(...centered.map((point) => Math.abs(point.x)));
  const extentY = Math.max(...centered.map((point) => Math.abs(point.y)));
  const scale = Math.max(extentX, extentY) || 1;

  return centered.map((point) => ({ x: point.x / scale, y: point.y / scale }));
};
