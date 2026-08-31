import SpectrumView from './SpectrumView';
import WaveformView from './WaveformView';
import useFourierAudio from './useFourierAudio';

const formatTime = (seconds) => {
  const safeSeconds = Number.isFinite(seconds) ? seconds : 0;
  const minutes = Math.floor(safeSeconds / 60);
  return `${minutes}:${(safeSeconds % 60).toFixed(1).padStart(4, '0')}`;
};

export default function FourierAudioDemo() {
  const audio = useFourierAudio();
  const interferenceSelected = audio.selectedFrequency !== null
    && Math.abs(audio.selectedFrequency - 6000) <= 250;

  return (
    <section className="fourier-audio-demo" aria-label="Interactive Fourier Transform audio visualization">
      <header className="fourier-audio-header">
        <div>
          <h2>Fourier Transform</h2>
          <p>See what a signal is made of.</p>
        </div>
        {audio.visualData && (
          <div className="fourier-audio-transport">
            <button type="button" onClick={audio.togglePlayback} disabled={audio.status !== 'ready'}>
              {audio.playing ? 'Pause' : 'Play'}
            </button>
            <button type="button" onClick={audio.restart} disabled={audio.status === 'loading'}>Restart</button>
            <time>{formatTime(audio.currentTime)} / {formatTime(audio.visualData.duration)}</time>
          </div>
        )}
      </header>

      {audio.status === 'loading' && <div className="fourier-audio-message">Loading and transforming the WAV signal…</div>}
      {audio.status === 'error' && <div className="fourier-audio-message error">{audio.error}</div>}

      {audio.visualData && (
        <div className="fourier-audio-content">
          <section className="fourier-audio-domain">
            <div className="fourier-audio-section-label">
              <span>Time domain</span>
              <small>amplitude over time</small>
            </div>
            <WaveformView
              waveform={audio.visualData.waveform}
              duration={audio.visualData.duration}
              currentTime={audio.currentTime}
            />
          </section>

          <div className="fourier-audio-transition" aria-label="Transform signal into frequencies">
            <span>Signal</span><b>→</b><span>FFT</span><b>↓</b>
          </div>

          <section className="fourier-audio-domain spectrum-domain">
            <div className="fourier-audio-section-label">
              <span>Frequency domain</span>
              <small>strength by frequency · tap a peak</small>
            </div>
            <SpectrumView
              spectrum={audio.visualData.spectrum}
              selectedFrequency={audio.selectedFrequency}
              onSelect={audio.setSelectedFrequency}
            />
            <div className="fourier-audio-filter-row">
              <div className="fourier-audio-selection" aria-live="polite">
                {audio.selectedFrequency === null
                  ? 'No frequency selected'
                  : <><strong>≈ {audio.selectedFrequency.toLocaleString()} Hz</strong>{interferenceSelected && <span>background interference</span>}</>}
              </div>
              <button
                type="button"
                className="fourier-audio-remove"
                onClick={audio.removeSelectedBand}
                disabled={audio.selectedFrequency === null || audio.status !== 'ready'}
              >
                {audio.status === 'processing' ? 'Filtering…' : 'Remove frequency ±35 Hz'}
              </button>
              <button
                type="button"
                className="fourier-audio-reset"
                onClick={audio.resetFrequencies}
                disabled={audio.removedBands.length === 0 || audio.status === 'processing'}
              >
                Reset frequencies
              </button>
            </div>
          </section>

          <footer className="fourier-audio-pipeline">
            Signal <span>→</span> FFT <span>→</span> remove frequency <span>→</span> inverse FFT <span>→</span> filtered signal
            {audio.removedBands.length > 0 && <strong>{audio.removedBands.length} band{audio.removedBands.length === 1 ? '' : 's'} removed</strong>}
          </footer>
        </div>
      )}
    </section>
  );
}

