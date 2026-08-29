export default String.raw`# Nepal as a Fourier curve

This visualization does not draw the GeoJSON polygon directly as its result. The polygon is used only as input to a Fourier approximation.

## 1. Project and resample the border

GeoJSON vertices are not equally spaced. Longitude and latitude are first projected into a local Cartesian plane, then the closed border is sampled at equal distances along its perimeter.

    const projected = coordinates.map(([longitude, latitude]) => ({
      x: (longitude - centerLongitude) * Math.cos(centerLatitude * Math.PI / 180),
      y: latitude - centerLatitude
    }));

    // Walk cumulative segment lengths and interpolate 2,048 equal-distance samples.
    const samples = resampleByArcLength(projected, 2048);

Uniform arc-length sampling matters because FFT input positions represent equal increments of the parameter t. Using raw vertices would give detailed GeoJSON sections disproportionate influence.

## 2. Interpret the curve as complex samples

Each normalized point becomes a complex number:

    z[n] = samples[n].x + i * samples[n].y;

An FFT calculates every coefficient efficiently in O(n log n) time. The transform is divided by the sample count to obtain Fourier-series coefficients.

    const transform = fft(samples);
    const coefficients = transform.map((value, k) => ({
      frequency: k <= sampleCount / 2 ? k : k - sampleCount,
      re: value.re / sampleCount,
      im: value.im / sampleCount
    }));

## 3. Reconstruct with rotating vectors

At time t, every selected coefficient contributes one rotating vector. Vectors are placed head-to-tail, and their final endpoint lies on the approximation.

    for (const coefficient of selectedComponents) {
      const angle = coefficient.phase + 2 * Math.PI * coefficient.frequency * t;
      x += coefficient.amplitude * Math.cos(angle);
      y += coefficient.amplitude * Math.sin(angle);
    }

The endpoint is saved into the traced path. Increasing the component count adds higher spatial frequencies, progressively recovering smaller details in Nepal's boundary.

## 4. Iterator-driven rendering

The animation loop contains no Fourier mathematics. It requests the next computed frame and gives that frame to the Canvas renderer.

    function animate(timestamp) {
      const frame = iterator.next(timestamp);
      renderer.render(frame.value);
      requestAnimationFrame(animate);
    }`;
