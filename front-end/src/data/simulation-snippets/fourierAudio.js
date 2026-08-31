export default String.raw`# Fourier Transform — hear a frequency disappear

This visualization loads the local WAV file with the Web Audio API. The decoded mono channel is copied before processing so Reset can always restore the exact source signal.

    const response = await fetch('/audio/fourier_stadium_demo_with_noise.wav');
    const encoded = await response.arrayBuffer();
    const decoded = await audioContext.decodeAudioData(encoded);
    const samples = new Float32Array(decoded.getChannelData(0));

## From time samples to frequencies

The sample count is padded with zeros to the next power of two. A radix-2 FFT converts the real-valued time signal into complex frequency coefficients. This expensive transform happens when the file loads—not during canvas animation.

    const real = new Float64Array(nextPowerOfTwo(samples.length));
    const imaginary = new Float64Array(real.length);
    real.set(samples);
    fft(real, imaginary);

The spectrum plots coefficient magnitude, \`sqrt(re² + im²)\`, from 0–10 kHz. Display buckets retain the strongest bin and use logarithmic compression so smaller musical harmonics remain visible beside the narrow interference near 6 kHz.

## Removing a real-valued frequency band

A real signal has conjugate-symmetric FFT coefficients. Removing only the clicked positive-frequency bins would break that symmetry, so the matching negative-frequency bins are cleared too.

    for (let bin = firstBin; bin <= lastBin; bin += 1) {
      const conjugateBin = transformSize - bin;
      real[bin] = imaginary[bin] = 0;
      real[conjugateBin] = imaginary[conjugateBin] = 0;
    }

    ifft(real, imaginary);
    const filteredSamples = real.slice(0, originalSampleCount);

The inverse FFT produces a new waveform and AudioBuffer. If music is playing, the original and filtered sources overlap for 80 ms while their gains move in opposite directions. The new source starts at the current timestamp, so filtering neither clicks nor jumps back to zero.

    oldGain.linearRampToValueAtTime(0, now + 0.08);
    newGain.linearRampToValueAtTime(1, now + 0.08);

The animation loop only advances the playhead. FFT, inverse FFT, waveform downsampling, and spectrum aggregation run on load or when the user filters/resets the signal.`;
