import { useCallback, useEffect, useRef, useState } from 'react';
import FourierAudioEngine from '../../../simulation-logic/fourier-audio/FourierAudioEngine';

const AUDIO_URL = `${process.env.PUBLIC_URL}/audio/fourier_stadium_demo_with_noise.wav`;

export default function useFourierAudio() {
  const engineRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [visualData, setVisualData] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [removedBands, setRemovedBands] = useState([]);

  useEffect(() => {
    const engine = new FourierAudioEngine();
    engineRef.current = engine;
    let active = true;
    let animationFrame;
    let lastUpdate = 0;

    engine.load(AUDIO_URL)
      .then((data) => {
        if (!active) return;
        setVisualData(data);
        setStatus('ready');
      })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError.message || 'The WAV file could not be loaded.');
        setStatus('error');
      });

    const updateClock = (timestamp) => {
      if (active && timestamp - lastUpdate > 45) {
        setCurrentTime(engine.currentTime());
        lastUpdate = timestamp;
      }
      animationFrame = requestAnimationFrame(updateClock);
    };
    animationFrame = requestAnimationFrame(updateClock);

    return () => {
      active = false;
      cancelAnimationFrame(animationFrame);
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  const togglePlayback = useCallback(async () => {
    const engine = engineRef.current;
    if (!engine || status !== 'ready') return;
    if (engine.playing) {
      engine.pause();
      setPlaying(false);
      setCurrentTime(engine.currentTime());
    } else {
      await engine.play();
      setPlaying(true);
    }
  }, [status]);

  const restart = useCallback(async () => {
    const engine = engineRef.current;
    if (!engine) return;
    await engine.restart();
    setCurrentTime(0);
    setPlaying(engine.playing);
  }, []);

  const removeSelectedBand = useCallback(() => {
    const engine = engineRef.current;
    if (!engine || selectedFrequency === null || status !== 'ready') return;
    setStatus('processing');

    // Yield once so the processing state paints before the FFT/IFFT work.
    window.setTimeout(() => {
      try {
        const halfWidth = 35;
        const data = engine.removeBand(selectedFrequency, halfWidth);
        setVisualData(data);
        setRemovedBands((bands) => [...bands, { center: selectedFrequency, halfWidth }]);
        setStatus('ready');
      } catch (processingError) {
        setError(processingError.message || 'The selected frequency could not be removed.');
        setStatus('error');
      }
    }, 20);
  }, [selectedFrequency, status]);

  const resetFrequencies = useCallback(() => {
    const engine = engineRef.current;
    if (!engine || status === 'loading') return;
    const data = engine.reset();
    setVisualData(data);
    setRemovedBands([]);
    setSelectedFrequency(null);
    setStatus('ready');
  }, [status]);

  return {
    status,
    error,
    visualData,
    playing,
    currentTime,
    selectedFrequency,
    removedBands,
    setSelectedFrequency,
    togglePlayback,
    restart,
    removeSelectedBand,
    resetFrequencies,
  };
}

