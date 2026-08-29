export default String.raw`# Elastic collision with convex hull

The particles use the same algorithm described in the main **Elastic Collision** example, with a convex-hull calculation added after every position update.

The convex hull is the smallest convex boundary containing every particle center. The implementation first sorts the points and then constructs the upper and lower boundaries with a monotonic-chain style scan.

    points.sort((a, b) => a.x - b.x || a.y - b.y);

    function buildHalf(points, makesWrongTurn) {
      const hull = [];
      for (const point of points) {
        // The newest point belongs inside the hull when it makes the wrong turn.
        while (hull.length >= 2 && makesWrongTurn(
          hull[hull.length - 2], hull[hull.length - 1], point
        )) {
          hull.pop();
        }
        hull.push(point);
      }
      return hull;
    }

    const lower = buildHalf(points, turnsClockwise);
    const upper = buildHalf([...points].reverse(), turnsClockwise);
    const hull = [...lower.slice(0, -1), ...upper.slice(0, -1)];

The turn test uses a two-dimensional cross product:

    function cross(origin, a, b) {
      return (a.x - origin.x) * (b.y - origin.y)
        - (a.y - origin.y) * (b.x - origin.x);
    }

The sign indicates whether three points turn clockwise or counter-clockwise. Points creating an inward turn are removed from the working stack. Drawing lines through the remaining vertices produces the white envelope that changes as the particles move.`;
