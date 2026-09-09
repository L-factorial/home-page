import FourierAudioProcessor from './FourierAudioProcessor';

const CROSSFADE_SECONDS = 0.08;

export default class FourierAudioEngine {
  constructor() {
    this.context = null;
    this.processor = null;
    this.buffer = null;
    this.source = null;
    this.gain = null;
    this.playing = false;
    this.offset = 0;
    this.startedAt = 0;
    this.starting = false;
    this.disposed = false;
  }

  async load(url) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error('This browser does not support audio playback. Please try another browser.');
    this.context = new AudioContextClass();
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Audio request failed with ${response.status}.`);
    const encodedAudio = await response.arrayBuffer();
    const decoded = await this.context.decodeAudioData(encodedAudio);
    if (this.disposed) return null;
    const samples = new Float32Array(decoded.getChannelData(0));
    this.processor = new FourierAudioProcessor(samples, decoded.sampleRate);
    this.buffer = this.createBuffer(samples);
    return this.visualData();
  }

  createBuffer(samples) {
    const buffer = this.context.createBuffer(1, samples.length, this.processor.sampleRate);
    buffer.copyToChannel(samples, 0);
    return buffer;
  }

  visualData() {
    return {
      waveform: this.processor.waveform(),
      spectrum: this.processor.spectrum(),
      duration: this.processor.sampleCount / this.processor.sampleRate,
      sampleRate: this.processor.sampleRate,
    };
  }

  currentTime() {
    if (!this.buffer) return 0;
    if (!this.playing) return this.offset;
    return (this.offset + this.context.currentTime - this.startedAt) % this.buffer.duration;
  }

  createSource(buffer, offset, initialGain = 1) {
    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    source.buffer = buffer;
    source.loop = true;
    gain.gain.setValueAtTime(initialGain, this.context.currentTime);
    source.connect(gain);
    gain.connect(this.context.destination);
    source.start(0, offset % buffer.duration);
    return { source, gain };
  }

  async play() {
    if (!this.buffer || this.playing || this.starting || this.disposed) return;
    this.starting = true;
    let timeout;
    try {
      // Resume and start the source during the tap, before yielding the gesture.
      const resumed = this.context.resume();
      const nodes = this.createSource(this.buffer, this.offset);
      this.source = nodes.source;
      this.gain = nodes.gain;
      this.startedAt = this.context.currentTime;
      await Promise.race([
        resumed,
        new Promise((resolve, reject) => {
          timeout = window.setTimeout(() => reject(new Error('Audio could not start. Tap Play to try again.')), 5000);
        }),
      ]);
      if (this.disposed) return;
      if (this.context.state !== 'running') throw new Error('Audio was interrupted. Tap Play to try again.');
      this.playing = true;
    } catch (error) {
      this.stopCurrentSource();
      this.playing = false;
      throw error;
    } finally {
      window.clearTimeout(timeout);
      this.starting = false;
    }
  }

  pause() {
    if (!this.playing) return;
    this.offset = this.currentTime();
    this.stopCurrentSource();
    this.playing = false;
  }

  restart() {
    if (this.starting || this.disposed) return Promise.resolve();
    const wasPlaying = this.playing;
    if (wasPlaying) this.stopCurrentSource();
    this.offset = 0;
    this.playing = false;
    if (wasPlaying) return this.play();
    return Promise.resolve();
  }

  stopCurrentSource() {
    if (!this.source) return;
    this.source.onended = null;
    try { this.source.stop(); } catch (error) { /* Source may already be stopped. */ }
    this.source.disconnect();
    this.gain?.disconnect();
    this.source = null;
    this.gain = null;
  }

  switchSamples(samples) {
    const nextBuffer = this.createBuffer(samples);
    const position = this.currentTime();

    if (!this.playing) {
      this.buffer = nextBuffer;
      this.offset = Math.min(position, nextBuffer.duration);
      return;
    }

    const oldSource = this.source;
    const oldGain = this.gain;
    const now = this.context.currentTime;
    const next = this.createSource(nextBuffer, position, 0);
    next.gain.gain.linearRampToValueAtTime(1, now + CROSSFADE_SECONDS);
    oldGain.gain.cancelScheduledValues(now);
    oldGain.gain.setValueAtTime(oldGain.gain.value, now);
    oldGain.gain.linearRampToValueAtTime(0, now + CROSSFADE_SECONDS);

    this.buffer = nextBuffer;
    this.source = next.source;
    this.gain = next.gain;
    this.offset = position;
    this.startedAt = now;

    window.setTimeout(() => {
      try { oldSource.stop(); } catch (error) { /* Crossfade source already ended. */ }
      oldSource.disconnect();
      oldGain.disconnect();
    }, CROSSFADE_SECONDS * 1000 + 25);
  }

  removeBand(frequency, halfWidth) {
    const samples = this.processor.removeBand(frequency, halfWidth);
    this.switchSamples(samples);
    return this.visualData();
  }

  reset() {
    const samples = this.processor.reset();
    this.switchSamples(samples);
    return this.visualData();
  }

  async dispose() {
    this.disposed = true;
    this.stopCurrentSource();
    this.playing = false;
    if (this.context && this.context.state !== 'closed') await this.context.close();
  }
}
