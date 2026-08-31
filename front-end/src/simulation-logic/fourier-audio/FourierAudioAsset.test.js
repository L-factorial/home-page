import fs from 'fs';
import path from 'path';
import FourierAudioProcessor from './FourierAudioProcessor';

const readMonoPcm16Wave = (filePath) => {
  const bytes = fs.readFileSync(filePath);
  expect(bytes.toString('ascii', 0, 4)).toBe('RIFF');
  expect(bytes.toString('ascii', 8, 12)).toBe('WAVE');

  let offset = 12;
  let sampleRate;
  let channels;
  let bitsPerSample;
  let data;
  while (offset + 8 <= bytes.length) {
    const chunk = bytes.toString('ascii', offset, offset + 4);
    const size = bytes.readUInt32LE(offset + 4);
    if (chunk === 'fmt ') {
      channels = bytes.readUInt16LE(offset + 10);
      sampleRate = bytes.readUInt32LE(offset + 12);
      bitsPerSample = bytes.readUInt16LE(offset + 22);
    } else if (chunk === 'data') {
      data = bytes.subarray(offset + 8, offset + 8 + size);
      break;
    }
    offset += 8 + size + (size % 2);
  }

  expect(channels).toBe(1);
  expect(bitsPerSample).toBe(16);
  const samples = new Float32Array(data.length / 2);
  for (let index = 0; index < samples.length; index += 1) {
    samples[index] = data.readInt16LE(index * 2) / 32768;
  }
  return { samples, sampleRate };
};

test('the bundled WAV contains removable energy around 6000 Hz', () => {
  const assetPath = path.resolve(process.cwd(), 'public/audio/fourier_stadium_demo_with_noise.wav');
  const { samples, sampleRate } = readMonoPcm16Wave(assetPath);
  expect(sampleRate).toBe(44100);
  expect(samples.length).toBeGreaterThan(400000);

  const processor = new FourierAudioProcessor(samples, sampleRate);
  const interferenceBin = Math.round(6000 * processor.transformSize / sampleRate);
  const magnitudeBefore = Math.hypot(
    processor.activeReal[interferenceBin],
    processor.activeImaginary[interferenceBin]
  );
  expect(magnitudeBefore).toBeGreaterThan(1000);

  processor.removeBand(6000, 35);
  expect(processor.activeReal[interferenceBin]).toBe(0);
  expect(processor.activeImaginary[interferenceBin]).toBe(0);
  expect(processor.activeReal[processor.transformSize - interferenceBin]).toBe(0);
  expect(processor.activeImaginary[processor.transformSize - interferenceBin]).toBe(0);
});

