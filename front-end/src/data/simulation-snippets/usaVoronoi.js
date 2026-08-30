export default String.raw`# Iterative Voronoi sweep

The geometry engine is initialized with sites and a rectangular working extent. It exposes hasNext() and next(), independently of React or canvas rendering.

    const sweep = new VoronoiSweepIterator(capitalPoints, bounds);

    while (sweep.hasNext()) {
      const frame = sweep.next();
      render(frame);
    }

Each frame contains the sweep longitude, active and pending sites, current Voronoi cell polygons, progress counters, and completion state. Sites are processed west-to-east. A cell is formed by repeatedly clipping the working polygon against the perpendicular-bisector half-plane between its site and every other active site.

    {
      step,
      totalSteps,
      sweepX,
      activeSites,
      pendingSites,
      cells,
      complete
    }

The animation advances once per second through the capitals of the 48 contiguous states. This phase deliberately has no USA boundary: sites and cells occupy the full centered working plane.

After the final site event, the local USA boundary follows the same processing pipeline as the Nepal animation: geographic projection, equal arc-length resampling, normalization, FFT, and Fourier epicycles. When one complete Fourier trace closes, canvas clipping applies that outline to the completed Voronoi cells.

This is an incremental site-event sweep designed for visualization. It recomputes active cells at each step for clarity; it is not the beach-line/event-queue optimization used by Fortune's O(n log n) algorithm.`;
