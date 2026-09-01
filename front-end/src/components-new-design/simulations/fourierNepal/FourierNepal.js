import { useEffect, useRef, useState } from 'react';
import FourierNepalConfig from './config/FourierNepalConfig';
import nepalFlag from '../../../img/nepal-flag.svg';
import nepalAnthem from '../../../audio/nepal-national-anthem.ogg';

const COMPONENT_PRESETS = [5, 11, 21, 51, 101, 501, 1001];

export default function FourierNepal() {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const configRef = useRef(null);
  const animationRef = useRef(null);
  const audioRef = useRef(null);
  const [componentCount, setComponentCount] = useState(1001);
  const [paused, setPaused] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(true);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    const context = canvas.getContext('2d');

    const resize = () => {
      canvas.width = Math.max(1, wrapper.clientWidth);
      canvas.height = Math.max(1, wrapper.clientHeight);
    };

    resize();
    configRef.current = new FourierNepalConfig(canvas, context, componentCount);

    // Browsers allow audible autoplay only in some circumstances. Try it
    // immediately, then fall back to the first interaction anywhere on the
    // page so visitors do not have to find a dedicated music button.
    let componentActive = true;
    const startMusic = async () => {
      if (!audio || !audio.paused) return;
      audio.volume = 0.18;
      try {
        await audio.play();
        if (componentActive) setMusicPlaying(true);
        document.removeEventListener('pointerdown', startMusic);
        document.removeEventListener('keydown', startMusic);
      } catch (error) {
        // The first pointer or keyboard interaction will retry playback.
      }
    };
    startMusic();
    document.addEventListener('pointerdown', startMusic);
    document.addEventListener('keydown', startMusic);

    const animate = (timestamp) => {
      configRef.current.renderNextFrame(timestamp);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);

    return () => {
      componentActive = false;
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      audio?.pause();
      document.removeEventListener('pointerdown', startMusic);
      document.removeEventListener('keydown', startMusic);
    };
    // The iterator receives control changes directly; the FFT is initialized once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeComponentCount = (value) => {
    const nextCount = Number(value);
    setComponentCount(nextCount);
    configRef.current?.iterator.setComponentCount(nextCount);
  };

  const togglePaused = () => {
    const nextPaused = !paused;
    setPaused(nextPaused);
    configRef.current?.iterator.setPaused(nextPaused);
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.volume = 0.18;
      try {
        await audio.play();
        setMusicPlaying(true);
      } catch (error) {
        setMusicPlaying(false);
      }
    } else {
      audio.pause();
      setMusicPlaying(false);
    }
  };

  return (
    <div className="fourier-nepal" ref={wrapperRef}>
      <canvas ref={canvasRef} aria-label="Fourier epicycle approximation of Nepal's boundary" />
      <img className="fourier-nepal-flag" src={nepalFlag} alt="Flag of Nepal" />
      <audio ref={audioRef} src={nepalAnthem} autoPlay loop preload="metadata" />
      <div className={`fourier-nepal-controls floating-controls ${controlsOpen ? '' : 'collapsed'}`}>
        <button type="button" className="floating-controls-toggle" onClick={() => setControlsOpen((open) => !open)} aria-expanded={controlsOpen} aria-controls="fourier-controls-content" aria-label={`${controlsOpen ? 'Hide' : 'Show'} Fourier controls`}>
          <span>Fourier controls</span>
          {controlsOpen && <strong>{componentCount} components</strong>}
          <span className="floating-controls-action">{controlsOpen ? 'Hide' : 'Show controls'}</span>
          <span className="floating-controls-chevron" aria-hidden="true">{controlsOpen ? '−' : '+'}</span>
        </button>
        <div id="fourier-controls-content" className="floating-controls-content">
          <div className="fourier-control-strip">
            <div className="fourier-component-stepper">
              <span>Components <strong>{componentCount}</strong></span>
              <button type="button" onClick={() => changeComponentCount(Math.max(1, componentCount - 2))} aria-label="Decrease Fourier components">‹</button>
              <button type="button" onClick={() => changeComponentCount(Math.min(1001, componentCount + 2))} aria-label="Increase Fourier components">›</button>
            </div>
            <div className="fourier-nepal-presets" aria-label="Fourier component presets">
              {COMPONENT_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={preset === componentCount ? 'active' : ''}
                  onClick={() => changeComponentCount(preset)}
                >
                  {preset}
                </button>
              ))}
            </div>
            <button className="fourier-pause" type="button" onClick={togglePaused}>{paused ? 'Resume' : 'Pause'}</button>
            <div className="fourier-nepal-audio">
              <button type="button" onClick={toggleMusic} aria-pressed={musicPlaying}>
                {musicPlaying ? 'Pause anthem' : '♪ Play anthem'}
              </button>
              <a
                href="https://commons.wikimedia.org/wiki/File:Sayaun_Thunga_Phool_Ka_(instrumental).ogg"
                target="_blank"
                rel="noreferrer"
              >
                U.S. Navy Band · public domain
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
